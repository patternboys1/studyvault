import { onRequest } from "firebase-functions/v2/https";

import { defineSecret } from "firebase-functions/params";

import { getApp, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { FieldValue, getFirestore, Timestamp } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

import { GoogleGenAI } from "@google/genai";

initializeApp();
const app = getApp();
const auth = getAuth(app);
const db = getFirestore(app);

const paystackSecretKey = defineSecret("PAYSTACK_SECRET_KEY");

const geminiApiKey = defineSecret("GEMINI_API_KEY");

const setCorsHeaders = (res) => {
  res.set("Access-Control-Allow-Origin", "*");

  res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");

  res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

  return res;
};

const getExpectedPaystackAmount = (planId) => {
  if (planId === "monthly") return 4900;

  if (planId === "yearly") return 49900;

  return 0;
};

const MONTHLY_PREMIUM_MS = 30 * 24 * 60 * 60 * 1000;
const YEARLY_PREMIUM_MS = 365 * 24 * 60 * 60 * 1000;
const FREE_MOCKS_PER_MONTH = 3;
const PARENT_EXPORTS_PER_MONTH = 3;
const FREE_PAPER_YEARS = new Set(["2020", "2021"]);

const isPremiumActive = (userData, now = Date.now()) => {
  const expiresAt = userData?.premiumExpiresAt?.toDate?.()?.getTime?.();
  return Boolean(
    userData?.isPremium && Number.isFinite(expiresAt) && expiresAt > now,
  );
};

const getAuthenticatedUser = async (req) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  if (!token) return null;
  return auth.verifyIdToken(token);
};

const sendAuthRequired = (res, message = "Authentication required.") =>
  res.status(401).json({ error: message });

const getUtcMonthKey = (date = new Date()) =>
  `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;

const resolveLegacyPremium = async (userRef, userData) => {
  if (userData?.premiumExpiresAt) {
    if (userData.isPremium && !isPremiumActive(userData)) {
      await userRef.set({ plan: "free", isPremium: false }, { merge: true });
      return { ...userData, plan: "free", isPremium: false };
    }
    return userData;
  }
  if (!userData?.isPremium) return userData;

  const paidAt = userData.paymentVerifiedAt?.toDate?.();
  if (!paidAt) {
    await userRef.set({ plan: "free", isPremium: false }, { merge: true });
    return { ...userData, plan: "free", isPremium: false };
  }

  const duration = userData.billingCycle === "yearly"
    ? YEARLY_PREMIUM_MS
    : MONTHLY_PREMIUM_MS;
  const premiumExpiresAt = new Date(paidAt.getTime() + duration);
  const stillActive = premiumExpiresAt.getTime() > Date.now();
  await userRef.set({
    premiumExpiresAt: Timestamp.fromDate(premiumExpiresAt),
    plan: stillActive ? "premium" : "free",
    isPremium: stillActive,
  }, { merge: true });
  return {
    ...userData,
    premiumExpiresAt: Timestamp.fromDate(premiumExpiresAt),
    plan: stillActive ? "premium" : "free",
    isPremium: stillActive,
  };
};

const getSignedImageUrl = async (value) => {
  if (!value || !String(value).startsWith("gs://")) return value;
  const match = String(value).match(/^gs:\/\/([^/]+)\/(.+)$/);
  if (!match) return null;
  const configuredBucket = app.options.storageBucket;
  if (configuredBucket && match[1] !== configuredBucket) return null;

  const file = getStorage().bucket(match[1]).file(match[2]);
  try {
    const [url] = await file.getSignedUrl({
      action: "read",
      expires: Date.now() + 60 * 60 * 1000,
    });
    return url;
  } catch (signingError) {
    console.warn(
      "Unable to sign a study image URL; loading image data instead:",
      signingError?.message || signingError,
    );
  }

  const [[contents], [metadata]] = await Promise.all([
    file.download(),
    file.getMetadata(),
  ]);
  if (!metadata.contentType?.startsWith("image/")) {
    throw new Error(`Study image has an invalid content type: ${metadata.contentType || "unknown"}`);
  }
  return `data:${metadata.contentType};base64,${contents.toString("base64")}`;
};

const normalizePaystackSecret = (value) =>
  String(value || "")
    .trim()
    .replace(/^authorization:\s*/i, "")
    .replace(/^bearer\s+/i, "")
    .trim();

const buildFallbackRecommendations = (attempts = []) => {
  if (!attempts || attempts.length === 0) {
    return [
      {
        label: "Focus Topic",

        title: "Take your first mock exam",

        body: "Complete a timed mock to unlock your personalized study plan and weakest-area analysis.",

        tag: "Start now",
      },

      {
        label: "Suggested Resource",

        title: "Past questions review",

        body: "Practice 10 focused questions from your weakest subject to build momentum quickly.",

        tag: "10 min",
      },
    ];
  }

  const subjectScores = {};

  attempts.forEach((attempt) => {
    const subject = attempt.subjectName || "Unknown";

    if (!subjectScores[subject]) {
      subjectScores[subject] = [];
    }

    subjectScores[subject].push(Number(attempt.score) || 0);
  });

  const subjectAverages = Object.entries(subjectScores).map(
    ([subject, scores]) => ({
      subject,

      average: Math.round(
        scores.reduce((sum, value) => sum + value, 0) / scores.length,
      ),
    }),
  );

  const weakestSubject = [...subjectAverages].sort(
    (a, b) => a.average - b.average,
  )[0];

  const strongestSubject = [...subjectAverages].sort(
    (a, b) => b.average - a.average,
  )[0];

  return [
    {
      label: "Focus Topic",

      title: `${weakestSubject?.subject || "Math"} improvement plan`,

      body: `Your weakest area is ${weakestSubject?.subject || "your current subject"}. Focus on the most recent topic gaps and increase your fluency with short revision sessions.`,

      tag: "15 mins",
    },

    {
      label: "Suggested Resource",

      title: `${strongestSubject?.subject || "Science"} confidence boost`,

      body: `Use your strongest subject to build momentum. Revisit recent questions and keep your timing sharp with timed mini-practice sets.`,

      tag: "2 sets",
    },
  ];
};

export const verifyPaystackPayment = onRequest(
  { secrets: [paystackSecretKey] },
  async (req, res) => {
    setCorsHeaders(res);

    if (req.method === "OPTIONS") {
      return res.status(204).send("");
    }

    try {
      const authHeader = req.headers.authorization || "";

      const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";

      if (!token) {
        return res
          .status(401)
          .json({ error: "Authentication required to verify payment." });
      }

      const decodedToken = await auth.verifyIdToken(token);

      const reference = String(req.body?.reference || "").trim();

      const planId = String(req.body?.planId || "monthly").trim();

      const expectedAmount = getExpectedPaystackAmount(planId);

      if (
        !reference ||
        !/^[A-Za-z0-9_-]+$/.test(reference) ||
        !reference.startsWith(`studyvault-${decodedToken.uid}-`)
      ) {
        return res
          .status(400)
          .json({
            error: "A valid payment reference for this account is required.",
          });
      }

      if (!expectedAmount) {
        return res
          .status(400)
          .json({ error: "A valid paid plan is required." });
      }

      const secretKey = normalizePaystackSecret(paystackSecretKey.value());

      if (!secretKey) {
        return res
          .status(500)
          .json({
            error: "Paystack secret key is not configured on the backend.",
          });
      }

      const verificationRes = await fetch(
        `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
        {
          method: "GET",

          headers: {
            Authorization: `Bearer ${secretKey}`,

            "Content-Type": "application/json",
          },
        },
      );

      const verificationPayload = await verificationRes.json();

      const transaction = verificationPayload?.data || {};

      if (
        !verificationRes.ok ||
        verificationPayload?.status !== true ||
        transaction.status !== "success"
      ) {
        return res.status(400).json({
          error: "Payment verification failed.",

          details: verificationPayload,
        });
      }

      if (
        Number(transaction.amount) !== expectedAmount ||
        transaction.currency !== "GHS"
      ) {
        return res.status(400).json({
          error: "Payment amount or currency does not match the selected plan.",

          expectedAmount,

          receivedAmount: Number(transaction.amount),

          receivedCurrency: transaction.currency,
        });
      }

      const userRef = db
        .collection("users")
        .doc(decodedToken.uid);

      const paymentRef = userRef.collection("payments").doc(reference);
      const cycle = planId === "yearly" ? "yearly" : "monthly";
      const duration = cycle === "yearly" ? YEARLY_PREMIUM_MS : MONTHLY_PREMIUM_MS;
      const now = Date.now();
      const result = await db.runTransaction(async (firestoreTransaction) => {
        const [paymentSnap, userSnap] = await Promise.all([
          firestoreTransaction.get(paymentRef),
          firestoreTransaction.get(userRef),
        ]);
        const userData = userSnap.data() || {};
        if (paymentSnap.exists) {
          return {
            alreadyApplied: true,
            premiumExpiresAt: userData.premiumExpiresAt || null,
          };
        }

        const previousExpiry = userData.premiumExpiresAt?.toDate?.()?.getTime?.() || 0;
        const expiryBase = isPremiumActive(userData, now) ? previousExpiry : now;
        const premiumExpiresAt = Timestamp.fromMillis(expiryBase + duration);
        firestoreTransaction.set(userRef, {
          uid: decodedToken.uid,
          email: userData.email || decodedToken.email || "",
          displayName: userData.displayName || decodedToken.name || "Student",
          plan: "premium",
          isPremium: true,
          billingCycle: cycle,
          premiumExpiresAt,
          lastPaymentReference: reference,
          paymentVerifiedAt: FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp(),
        }, { merge: true });
        firestoreTransaction.create(paymentRef, {
          reference,
          planId: cycle,
          amount: expectedAmount,
          currency: transaction.currency,
          verifiedAt: FieldValue.serverTimestamp(),
        });
        return { alreadyApplied: false, premiumExpiresAt };
      });

      return res.json({
        ok: true,

        plan: "premium",

        billingCycle: cycle,

        premiumExpiresAt: result.premiumExpiresAt?.toDate?.()?.toISOString?.() || null,

        alreadyApplied: result.alreadyApplied,

        reference,

        message: "Payment verified and premium access activated.",
      });
    } catch (error) {
      console.error("Paystack verification error:", error);

      return res
        .status(500)
        .json({ error: "Unable to verify Paystack payment." });
    }
  },
);

export const getMyEntitlements = onRequest(async (req, res) => {
  setCorsHeaders(res);
  if (req.method === "OPTIONS") return res.status(204).send("");
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed." });

  try {
    const decodedToken = await getAuthenticatedUser(req);
    if (!decodedToken) return sendAuthRequired(res);
    const userRef = db.collection("users").doc(decodedToken.uid);
    let userData = (await userRef.get()).data() || {};
    userData = await resolveLegacyPremium(userRef, userData);

    const monthKey = getUtcMonthKey();
    const premium = isPremiumActive(userData);
    const reservations = premium
      ? null
      : await userRef.collection("mockReservations").where("monthKey", "==", monthKey).get();
    const parentUsage = await userRef.collection("parentReportUsage").doc(monthKey).get();
    const usedParentExports = Number(parentUsage.data()?.count) || 0;
    const expiresAt = userData.premiumExpiresAt?.toDate?.()?.getTime?.() || null;

    return res.json({
      isPremium: premium,
      plan: premium ? "premium" : "free",
      billingCycle: premium ? userData.billingCycle || null : null,
      premiumExpiresAt: expiresAt,
      freeMocksRemaining: premium ? null : Math.max(0, FREE_MOCKS_PER_MONTH - (reservations?.size || 0)),
      parentExportsRemaining: premium && userData.billingCycle === "yearly"
        ? Math.max(0, PARENT_EXPORTS_PER_MONTH - usedParentExports)
        : 0,
    });
  } catch (error) {
    console.error("Entitlement lookup failed:", error?.message || error);
    return res.status(500).json({ error: "Unable to load account entitlements." });
  }
});

export const getStudyContent = onRequest(async (req, res) => {
  setCorsHeaders(res);
  if (req.method === "OPTIONS") return res.status(204).send("");
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed." });

  try {
    const decodedToken = await getAuthenticatedUser(req);
    if (!decodedToken) return sendAuthRequired(res);
    const userRef = db.collection("users").doc(decodedToken.uid);
    let userData = (await userRef.get()).data() || {};
    userData = await resolveLegacyPremium(userRef, userData);
    const premium = isPremiumActive(userData);
    const operation = req.body?.operation;

    if (operation === "papers") {
      const snapshot = await db.collection("papers")
        .where("isPublished", "==", true)
        .get();
      const papers = snapshot.docs
        .map((paperDoc) => ({ ...paperDoc.data(), id: paperDoc.id }))
        .map((paper) => ({
          ...paper,
          // Paper metadata is shared so students can see the complete library.
          // The actual question payload remains protected below.
          requiresPro: !premium && !FREE_PAPER_YEARS.has(String(paper.year)),
        }));
      papers.sort((first, second) => Number(second.year || 0) - Number(first.year || 0));
      return res.json({ papers, isPremium: premium });
    }

    if (operation !== "questions") {
      return res.status(400).json({ error: "A valid study content operation is required." });
    }

    const subjectId = String(req.body?.subjectId || "").trim();
    const year = String(req.body?.year || "").trim();
    const section = ["Objectives", "Theory"].includes(req.body?.section)
      ? req.body.section
      : "Objectives";
    const mode = req.body?.mode === "mock" ? "mock" : "practice";
    if (!subjectId || !/^\d{4}$/.test(year)) {
      return res.status(400).json({ error: "A valid subject and paper year are required." });
    }
    const publishedPapers = await db.collection("papers")
      .where("isPublished", "==", true)
      .get();
    const paperIsPublished = publishedPapers.docs.some((paperDoc) => {
      const paper = paperDoc.data();
      return String(paper.subjectId || "") === subjectId && String(paper.year || "") === year;
    });
    if (!paperIsPublished) {
      return res.status(404).json({ error: "This paper is not published or is unavailable." });
    }
    if (!premium && !FREE_PAPER_YEARS.has(year)) {
      return res.status(403).json({ error: "This paper is available with Pro access." });
    }

    if (mode === "mock") {
      const reservationId = String(req.body?.reservationId || "");
      if (!/^[A-Za-z0-9_-]{8,100}$/.test(reservationId)) {
        return res.status(403).json({ error: "Start this mock exam before loading its questions." });
      }
      const reservation = await userRef.collection("mockReservations").doc(reservationId).get();
      const reserved = reservation.data() || {};
      if (
        !reservation.exists || reserved.subjectId !== subjectId ||
        String(reserved.year) !== year || reserved.section !== section ||
        reserved.status !== "started"
      ) {
        return res.status(403).json({ error: "This mock exam reservation is invalid." });
      }
    }

    const questionsRef = db.collection("BECE").doc(subjectId)
      .collection(year).doc(section).collection("Questions");
    const questionsSnapshot = await questionsRef.orderBy("number", "asc").get();
    const imageFields = ["imageUrl", "answerImageUrl", "modelAnswerImageUrl", "answerImage"];
    const hiddenFields = ["explanation", "modelAnswer", "answerImageUrl", "modelAnswerImageUrl", "answerImage"];
    const questions = await Promise.all(questionsSnapshot.docs.map(async (questionDoc) => {
      const data = { ...questionDoc.data(), id: questionDoc.id };
      if (!premium) {
        for (const field of hiddenFields) delete data[field];
        // Never send the answer key with an active free mock. Objective scores
        // are computed from the private Firestore questions on submission.
        delete data.correctAnswer;
      }
      await Promise.all(imageFields.map(async (field) => {
        if (data[field]) {
          try {
            data[field] = await getSignedImageUrl(data[field]);
          } catch (imageError) {
            console.warn("Unable to sign a study image URL:", imageError?.message || imageError);
            data[field] = null;
          }
        }
      }));
      return data;
    }));

    return res.json({ questions, isPremium: premium });
  } catch (error) {
    console.error("Study content request failed:", error?.message || error);
    return res.status(500).json({ error: "Unable to load study content." });
  }
});

export const reserveMockAttempt = onRequest(async (req, res) => {
  setCorsHeaders(res);
  if (req.method === "OPTIONS") return res.status(204).send("");
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed." });

  try {
    const decodedToken = await getAuthenticatedUser(req);
    if (!decodedToken) return sendAuthRequired(res);
    const attemptId = String(req.body?.attemptId || "");
    const paperId = String(req.body?.paperId || "");
    const section = ["Objectives", "Theory"].includes(req.body?.section) ? req.body.section : "";
    if (!/^[A-Za-z0-9_-]{8,100}$/.test(attemptId) || !paperId || !section) {
      return res.status(400).json({ error: "A valid mock exam selection is required." });
    }

    const paperSnap = await db.collection("papers").doc(paperId).get();
    if (!paperSnap.exists || paperSnap.data()?.isPublished !== true) {
      return res.status(404).json({ error: "This paper is unavailable." });
    }
    const paper = paperSnap.data();
    const userRef = db.collection("users").doc(decodedToken.uid);
    let userData = (await userRef.get()).data() || {};
    userData = await resolveLegacyPremium(userRef, userData);
    const premium = isPremiumActive(userData);
    const year = String(paper.year || "");
    if (!premium && !FREE_PAPER_YEARS.has(year)) {
      return res.status(403).json({ error: "This mock paper requires Pro access." });
    }

    const reservationRef = userRef.collection("mockReservations").doc(attemptId);
    const monthKey = getUtcMonthKey();
    const result = await db.runTransaction(async (tx) => {
      const existing = await tx.get(reservationRef);
      if (existing.exists) {
        const reservation = existing.data();
        if (reservation.paperId !== paperId || reservation.section !== section) {
          throw new Error("This mock attempt ID is already in use.");
        }
        return { alreadyReserved: true, remaining: null };
      }

      if (!premium) {
        const usage = await tx.get(
          userRef.collection("mockReservations").where("monthKey", "==", monthKey),
        );
        if (usage.size >= FREE_MOCKS_PER_MONTH) {
          throw new Error("FREE_MOCK_LIMIT");
        }
        tx.create(reservationRef, {
          attemptId,
          paperId,
          subjectId: paper.subjectId,
          subjectName: paper.subjectName || "",
          year,
          section,
          monthKey,
          status: "started",
          createdAt: FieldValue.serverTimestamp(),
        });
        return { alreadyReserved: false, remaining: FREE_MOCKS_PER_MONTH - usage.size - 1 };
      }

      tx.create(reservationRef, {
        attemptId,
        paperId,
        subjectId: paper.subjectId,
        subjectName: paper.subjectName || "",
        year,
        section,
        monthKey,
        status: "started",
        createdAt: FieldValue.serverTimestamp(),
      });
      return { alreadyReserved: false, remaining: null };
    });

    return res.json({ ok: true, attemptId, freeMocksRemaining: result.remaining });
  } catch (error) {
    if (error?.message === "FREE_MOCK_LIMIT") {
      return res.status(403).json({ error: "You have used all 3 free mock exams for this month. Pro includes unlimited mocks." });
    }
    console.error("Mock reservation failed:", error?.message || error);
    return res.status(500).json({ error: error?.message || "Unable to start this mock exam." });
  }
});

export const completeMockAttempt = onRequest(async (req, res) => {
  setCorsHeaders(res);
  if (req.method === "OPTIONS") return res.status(204).send("");
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed." });

  try {
    const decodedToken = await getAuthenticatedUser(req);
    if (!decodedToken) return sendAuthRequired(res);
    const attemptId = String(req.body?.attemptId || "");
    if (!/^[A-Za-z0-9_-]{8,100}$/.test(attemptId)) {
      return res.status(400).json({ error: "A valid mock attempt is required." });
    }
    const userRef = db.collection("users").doc(decodedToken.uid);
    const reservationRef = userRef.collection("mockReservations").doc(attemptId);
    const attemptRef = userRef.collection("mockAttempts").doc(attemptId);
    const reservationSnap = await reservationRef.get();
    if (!reservationSnap.exists) return res.status(403).json({ error: "This mock exam was not started correctly." });
    const reservation = reservationSnap.data();

    if (reservation.section === "Theory") {
      const theoryQuestions = await db.collection("BECE")
        .doc(reservation.subjectId).collection(String(reservation.year))
        .doc("Theory").collection("Questions").orderBy("number", "asc").get();
      const validQuestionIds = new Set(theoryQuestions.docs.map((questionDoc) => questionDoc.id));
      const requestedResponses = req.body?.responses && typeof req.body.responses === "object"
        ? req.body.responses
        : {};
      const responses = Object.fromEntries(Object.entries(requestedResponses)
        .filter(([questionId, response]) => validQuestionIds.has(questionId) && typeof response === "string")
        .map(([questionId, response]) => [questionId, response.slice(0, 20000)]));
      const theoryAttemptRef = userRef.collection("mockTheoryAttempts").doc(attemptId);
      const result = await db.runTransaction(async (tx) => {
        const [currentReservation, existingAttempt] = await Promise.all([
          tx.get(reservationRef),
          tx.get(theoryAttemptRef),
        ]);
        if (!currentReservation.exists || currentReservation.data()?.section !== "Theory") {
          throw new Error("MOCK_RESERVATION_MISSING");
        }
        if (existingAttempt.exists) return { alreadySaved: true };
        if (currentReservation.data()?.status !== "started") throw new Error("MOCK_ALREADY_COMPLETED");
        tx.create(theoryAttemptRef, {
          id: attemptId,
          paperId: reservation.paperId,
          subjectId: reservation.subjectId,
          subjectName: reservation.subjectName || "",
          year: reservation.year,
          section: "Theory",
          responses,
          answeredCount: Object.values(responses).filter((response) => response.trim()).length,
          totalQuestions: theoryQuestions.size,
          completedAt: FieldValue.serverTimestamp(),
        });
        tx.update(reservationRef, {
          status: "completed",
          completedAt: FieldValue.serverTimestamp(),
        });
        return { alreadySaved: false };
      });
      return res.json({ ok: true, saved: true, alreadySaved: result.alreadySaved });
    }

    if (reservation.section !== "Objectives") {
      return res.status(400).json({ error: "This mock exam section is not supported." });
    }

    const answers = req.body?.answers && typeof req.body.answers === "object" ? req.body.answers : {};
    const questionsSnapshot = await db.collection("BECE")
      .doc(reservation.subjectId).collection(String(reservation.year))
      .doc("Objectives").collection("Questions").orderBy("number", "asc").get();
    const questions = questionsSnapshot.docs.map((questionDoc) => ({ id: questionDoc.id, ...questionDoc.data() }));
    if (!questions.length) return res.status(404).json({ error: "The mock questions are unavailable." });
    const isCorrectAnswer = (question, selection) => {
      if (!selection || !question.correctAnswer) return false;
      const correct = String(question.correctAnswer).trim();
      if (correct.toUpperCase() === String(selection).toUpperCase()) return true;
      const optionIndex = String(selection).toUpperCase().charCodeAt(0) - 65;
      const selectedOption = question.options?.[optionIndex];
      return Boolean(selectedOption && selectedOption.trim().toLowerCase() === correct.toLowerCase());
    };
    const correctCount = questions.filter((question) => isCorrectAnswer(question, answers[question.id])).length;
    const answeredCount = questions.filter((question) => {
      const selected = answers[question.id];
      if (typeof selected !== "string" || !selected.trim()) return false;
      const index = selected.trim().toUpperCase().charCodeAt(0) - 65;
      return index >= 0 && index < (question.options?.length || 0);
    }).length;
    const score = Math.round((correctCount / questions.length) * 100);
    const attempt = {
      id: attemptId,
      paperId: reservation.paperId,
      subjectId: reservation.subjectId,
      subjectName: reservation.subjectName,
      year: reservation.year,
      section: "Objectives",
      score,
      correctCount,
      answeredCount,
      totalQuestions: questions.length,
    };
    const result = await db.runTransaction(async (tx) => {
      const [currentReservation, existingAttempt] = await Promise.all([
        tx.get(reservationRef),
        tx.get(attemptRef),
      ]);
      if (!currentReservation.exists) throw new Error("MOCK_RESERVATION_MISSING");
      if (existingAttempt.exists) return { alreadySaved: true };
      if (currentReservation.data()?.status !== "started") throw new Error("MOCK_ALREADY_COMPLETED");
      tx.create(attemptRef, {
        ...attempt,
        userId: decodedToken.uid,
        completedAt: FieldValue.serverTimestamp(),
      });
      tx.update(reservationRef, {
        status: "completed",
        completedAt: FieldValue.serverTimestamp(),
      });
      return { alreadySaved: false };
    });
    return res.json({
      ok: true,
      saved: true,
      alreadySaved: result.alreadySaved,
      score,
      correctCount,
      answeredCount,
      totalQuestions: questions.length,
      review: questions.map((question) => ({
        questionId: question.id,
        correctAnswer: question.correctAnswer || "",
        explanation: question.explanation || "",
      })),
    });
  } catch (error) {
    console.error("Mock completion failed:", error?.message || error);
    return res.status(500).json({ error: "Unable to save this mock attempt." });
  }
});

export const authorizeParentReportExport = onRequest(async (req, res) => {
  setCorsHeaders(res);
  if (req.method === "OPTIONS") return res.status(204).send("");
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed." });

  try {
    const decodedToken = await getAuthenticatedUser(req);
    if (!decodedToken) return sendAuthRequired(res);
    const userRef = db.collection("users").doc(decodedToken.uid);
    const monthKey = getUtcMonthKey();
    const usageRef = userRef.collection("parentReportUsage").doc(monthKey);
    const exportId = String(req.body?.exportId || "");
    const action = req.body?.action === "release" ? "release" : "authorize";
    if (!/^[A-Za-z0-9_-]{8,100}$/.test(exportId)) {
      return res.status(400).json({ error: "A valid report export ID is required." });
    }
    const exportRef = usageRef.collection("exports").doc(exportId);
    const result = await db.runTransaction(async (tx) => {
      const [userSnap, usageSnap, exportSnap] = await Promise.all([
        tx.get(userRef), tx.get(usageRef), tx.get(exportRef),
      ]);
      const userData = userSnap.data() || {};
      if (!isPremiumActive(userData) || userData.billingCycle !== "yearly") {
        throw new Error("YEARLY_PLAN_REQUIRED");
      }
      const count = Number(usageSnap.data()?.count) || 0;
      if (action === "release") {
        if (exportSnap.exists && exportSnap.data()?.status === "authorized") {
          const releasedCount = Math.max(0, count - 1);
          tx.set(usageRef, { count: releasedCount, monthKey, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
          tx.update(exportRef, { status: "released", releasedAt: FieldValue.serverTimestamp() });
          return { remaining: PARENT_EXPORTS_PER_MONTH - releasedCount };
        }
        return { remaining: Math.max(0, PARENT_EXPORTS_PER_MONTH - count) };
      }
      if (exportSnap.exists) return { remaining: Math.max(0, PARENT_EXPORTS_PER_MONTH - count) };
      if (count >= PARENT_EXPORTS_PER_MONTH) throw new Error("PARENT_EXPORT_LIMIT");
      tx.set(usageRef, { count: count + 1, monthKey, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
      tx.create(exportRef, { exportId, status: "authorized", createdAt: FieldValue.serverTimestamp() });
      return { remaining: PARENT_EXPORTS_PER_MONTH - count - 1 };
    });
    return res.json({ ok: true, parentExportsRemaining: result.remaining });
  } catch (error) {
    if (error?.message === "YEARLY_PLAN_REQUIRED") {
      return res.status(403).json({ error: "Parent report exports are included with Pro Yearly." });
    }
    if (error?.message === "PARENT_EXPORT_LIMIT") {
      return res.status(429).json({ error: "You have used all 3 parent report exports for this month." });
    }
    console.error("Parent report export authorization failed:", error?.message || error);
    return res.status(500).json({ error: "Unable to authorize this parent report export." });
  }
});

export const leaderboard = onRequest(async (req, res) => {
  setCorsHeaders(res);

  if (req.method === "OPTIONS") {
    return res.status(204).send("");
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed." });
  }

  try {
    const authHeader = req.headers.authorization || "";

    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";

    if (!token) {
      return res
        .status(401)
        .json({ error: "Authentication required to view the leaderboard." });
    }

    const decodedToken = await auth.verifyIdToken(token);

    const attemptsSnapshot = await db
      .collectionGroup("mockAttempts")
      .get();

    const totalsByUser = new Map();

    attemptsSnapshot.forEach((attemptDoc) => {
      const attempt = attemptDoc.data();

      const userId = attemptDoc.ref.parent.parent?.id || attempt.userId;

      const score = Number(attempt.score);

      if (!userId || !Number.isFinite(score)) return;

      const totals = totalsByUser.get(userId) || {
        totalScore: 0,
        attemptCount: 0,
      };

      totals.totalScore += score;

      totals.attemptCount += 1;

      totalsByUser.set(userId, totals);
    });

    const rankedUsers = [...totalsByUser.entries()]

      .map(([userId, totals]) => ({
        userId,

        averageScore: Math.round(totals.totalScore / totals.attemptCount),

        attemptCount: totals.attemptCount,
      }))

      .sort(
        (first, second) =>
          second.averageScore - first.averageScore ||
          second.attemptCount - first.attemptCount ||
          first.userId.localeCompare(second.userId),
      );

    const visibleUsers = rankedUsers.slice(0, 10);

    const viewerEntry = rankedUsers.find(
      (entry) => entry.userId === decodedToken.uid,
    );

    if (
      viewerEntry &&
      !visibleUsers.some((entry) => entry.userId === viewerEntry.userId)
    ) {
      visibleUsers.push(viewerEntry);
    }

    const userProfiles = await Promise.all(
      visibleUsers.map((entry) =>
        db.collection("users").doc(entry.userId).get(),
      ),
    );

    const entries = visibleUsers.map((entry, index) => {
      const isCurrentUser = entry.userId === decodedToken.uid;

      const profile = userProfiles[index].data() || {};

      return {
        rank:
          rankedUsers.findIndex(
            (rankedUser) => rankedUser.userId === entry.userId,
          ) + 1,

        name: isCurrentUser
          ? profile.displayName || decodedToken.name || "You"
          : `Student ${entry.userId.slice(-6).toUpperCase()}`,

        averageScore: entry.averageScore,

        attemptCount: entry.attemptCount,

        isCurrentUser,
      };
    });

    return res.json({ entries, participantCount: rankedUsers.length });
  } catch (error) {
    console.error("Leaderboard error:", error);

    return res.status(500).json({ error: "Unable to load the leaderboard." });
  }
});

export const recommendations = onRequest(
  { secrets: [geminiApiKey] },
  async (req, res) => {
    setCorsHeaders(res);

    if (req.method === "OPTIONS") {
      return res.status(204).send("");
    }

    try {
      const authHeader = req.headers.authorization || "";

      const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";

      if (!token) {
        return res
          .status(401)
          .json({ error: "Authentication required for premium AI features." });
      }

      let decodedToken;
      try {
        decodedToken = await auth.verifyIdToken(token);
      } catch {
        return res.status(401).json({ error: "Your sign-in session is invalid. Sign in again." });
      }

      const userRef = db.collection("users").doc(decodedToken.uid);
      let userData = (await userRef.get()).data() || {};
      userData = await resolveLegacyPremium(userRef, userData);
      const isPremium = isPremiumActive(userData);

      if (!isPremium) {
        return res
          .status(403)
          .json({
            error: "Premium access is required for AI recommendations.",
          });
      }

      const attempts = Array.isArray(req.body?.attempts)
        ? req.body.attempts
        : [];

      const apiKey = geminiApiKey.value();

      if (!apiKey) {
        return res.json({
          recommendations: buildFallbackRecommendations(attempts),

          provider: "rules",
          fallbackReason: "provider_unavailable",
        });
      }

      const gemini = new GoogleGenAI({ apiKey });

      const context =
        attempts.length > 0
          ? attempts
              .slice(0, 20)
              .map(
                (attempt) =>
                  `${attempt.subjectName || "Unknown"}: ${Number(attempt.score) || 0}%`,
              )
              .join(" | ")
          : "No attempts yet";

      const completion = await gemini.interactions.create({
        model: "gemini-3.5-flash-lite",

        store: false,

        input: `You are an academic coach for BECE students. Give a practical study plan based on these mock scores: ${context}. Return exactly two concise recommendations: one focused on the weakest subject and one that builds confidence in the strongest subject. Each recommendation must have label, title, body, and tag.`,

        response_format: {
          type: "text",

          mime_type: "application/json",

          schema: {
            type: "object",

            properties: {
              recommendations: {
                type: "array",

                minItems: 2,

                maxItems: 2,

                items: {
                  type: "object",

                  properties: {
                    label: { type: "string" },

                    title: { type: "string" },

                    body: { type: "string" },

                    tag: { type: "string" },
                  },

                  required: ["label", "title", "body", "tag"],

                  additionalProperties: false,
                },
              },
            },

            required: ["recommendations"],

            additionalProperties: false,
          },
        },
      });

      const rawContent = completion.output_text;

      let recommendations = null;

      if (typeof rawContent === "string" && rawContent.trim()) {
        try {
          const parsed = JSON.parse(rawContent);

          const candidate = parsed?.recommendations;

          const hasValidRecommendations =
            Array.isArray(candidate) &&
            candidate.length === 2 &&
            candidate.every((item) =>
              ["label", "title", "body", "tag"].every(
                (field) =>
                  typeof item?.[field] === "string" && item[field].trim(),
              ),
            );

          if (hasValidRecommendations) {
            recommendations = candidate;
          }
        } catch (parseError) {
          console.warn(
            "Gemini returned invalid recommendation JSON:",
            parseError,
          );
        }
      }

      if (!recommendations) {
        return res.json({
          recommendations: buildFallbackRecommendations(attempts),

          provider: "rules",
        });
      }

      return res.json({
        recommendations,

        provider: "gemini",

        model: "gemini-3.5-flash-lite",
      });
    } catch (error) {
      const statusCode = error?.statusCode || error?.status || 0;
      const isRateLimited = statusCode === 429;
      console.error("Gemini recommendation error:", {
        statusCode,
        message: error?.message || "Unknown Gemini error",
      });

      const fallbackAttempts = Array.isArray(req.body?.attempts)
        ? req.body.attempts
        : [];

      return res.json({
        recommendations: buildFallbackRecommendations(fallbackAttempts),

        provider: "rules",
        fallbackReason: isRateLimited ? "quota" : "provider_error",
      });
    }
  },
);
