import { onRequest } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import admin from "firebase-admin";
import { GoogleGenAI } from "@google/genai";

admin.initializeApp();
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

  const subjectAverages = Object.entries(subjectScores).map(([subject, scores]) => ({
    subject,
    average: Math.round(scores.reduce((sum, value) => sum + value, 0) / scores.length),
  }));

  const weakestSubject = [...subjectAverages].sort((a, b) => a.average - b.average)[0];
  const strongestSubject = [...subjectAverages].sort((a, b) => b.average - a.average)[0];

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

export const verifyPaystackPayment = onRequest({ secrets: [paystackSecretKey] }, async (req, res) => {
  setCorsHeaders(res);

  if (req.method === "OPTIONS") {
    return res.status(204).send("");
  }

  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";

    if (!token) {
      return res.status(401).json({ error: "Authentication required to verify payment." });
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    const reference = String(req.body?.reference || "").trim();
    const planId = String(req.body?.planId || "monthly").trim();
    const expectedAmount = getExpectedPaystackAmount(planId);

    if (!reference || !reference.startsWith(`studyvault-${decodedToken.uid}-`)) {
      return res.status(400).json({ error: "A valid payment reference for this account is required." });
    }

    if (!expectedAmount) {
      return res.status(400).json({ error: "A valid paid plan is required." });
    }

    const secretKey = paystackSecretKey.value();
    if (!secretKey) {
      return res.status(500).json({ error: "Paystack secret key is not configured on the backend." });
    }

    const verificationRes = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/json",
      },
    });

    const verificationPayload = await verificationRes.json();
    const transaction = verificationPayload?.data || {};

    if (!verificationRes.ok || verificationPayload?.status !== true || transaction.status !== "success") {
      return res.status(400).json({
        error: "Payment verification failed.",
        details: verificationPayload,
      });
    }

    if (Number(transaction.amount) !== expectedAmount || transaction.currency !== "GHS") {
      return res.status(400).json({
        error: "Payment amount or currency does not match the selected plan.",
        expectedAmount,
        receivedAmount: Number(transaction.amount),
        receivedCurrency: transaction.currency,
      });
    }

    const userRef = admin.firestore().collection("users").doc(decodedToken.uid);
    const userSnap = await userRef.get();
    const userData = userSnap.data() || {};

    await userRef.set(
      {
        uid: decodedToken.uid,
        email: userData.email || decodedToken.email || "",
        displayName: userData.displayName || decodedToken.name || "Student",
        plan: "premium",
        isPremium: true,
        billingCycle: planId === "yearly" ? "yearly" : "monthly",
        lastPaymentReference: reference,
        paymentVerifiedAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    return res.json({
      ok: true,
      plan: "premium",
      billingCycle: planId === "yearly" ? "yearly" : "monthly",
      reference,
      message: "Payment verified and premium access activated.",
    });
  } catch (error) {
    console.error("Paystack verification error:", error);
    return res.status(500).json({ error: "Unable to verify Paystack payment." });
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
      return res.status(401).json({ error: "Authentication required to view the leaderboard." });
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    const attemptsSnapshot = await admin.firestore().collectionGroup("mockAttempts").get();
    const totalsByUser = new Map();

    attemptsSnapshot.forEach((attemptDoc) => {
      const attempt = attemptDoc.data();
      const userId = attemptDoc.ref.parent.parent?.id || attempt.userId;
      const score = Number(attempt.score);

      if (!userId || !Number.isFinite(score)) return;

      const totals = totalsByUser.get(userId) || { totalScore: 0, attemptCount: 0 };
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
      .sort((first, second) =>
        second.averageScore - first.averageScore
        || second.attemptCount - first.attemptCount
        || first.userId.localeCompare(second.userId)
      );

    const visibleUsers = rankedUsers.slice(0, 10);
    const viewerEntry = rankedUsers.find((entry) => entry.userId === decodedToken.uid);
    if (viewerEntry && !visibleUsers.some((entry) => entry.userId === viewerEntry.userId)) {
      visibleUsers.push(viewerEntry);
    }

    const userProfiles = await Promise.all(
      visibleUsers.map((entry) => admin.firestore().collection("users").doc(entry.userId).get())
    );

    const entries = visibleUsers.map((entry, index) => {
      const isCurrentUser = entry.userId === decodedToken.uid;
      const profile = userProfiles[index].data() || {};

      return {
        rank: rankedUsers.findIndex((rankedUser) => rankedUser.userId === entry.userId) + 1,
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

export const recommendations = onRequest({ secrets: [geminiApiKey] }, async (req, res) => {
  setCorsHeaders(res);

  if (req.method === "OPTIONS") {
    return res.status(204).send("");
  }

  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";

    if (!token) {
      return res.status(401).json({ error: "Authentication required for premium AI features." });
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    const userDoc = await admin.firestore().collection("users").doc(decodedToken.uid).get();
    const userData = userDoc.data() || {};
    const isPremium = Boolean(userData.isPremium || userData.plan === "premium");

    if (!isPremium) {
      return res.status(403).json({ error: "Premium access is required for AI recommendations." });
    }

    const attempts = Array.isArray(req.body?.attempts) ? req.body.attempts : [];

    const apiKey = geminiApiKey.value();
    if (!apiKey) {
      return res.json({
        recommendations: buildFallbackRecommendations(attempts),
        provider: "rules",
      });
    }

    const gemini = new GoogleGenAI({ apiKey });
    const context = attempts.length > 0
      ? attempts.slice(0, 20).map((attempt) => `${attempt.subjectName || "Unknown"}: ${Number(attempt.score) || 0}%`).join(" | ")
      : "No attempts yet";

    const completion = await gemini.interactions.create({
      model: "gemini-3.8-flash",
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

    const rawContent = completion.output_text || "{}";
    const parsed = JSON.parse(rawContent);
    const recommendations = Array.isArray(parsed?.recommendations) && parsed.recommendations.length === 2
      ? parsed.recommendations
      : buildFallbackRecommendations(attempts);

    return res.json({
      recommendations,
      provider: "gemini",
      model: "gemini-3.8-flash",
    });
  } catch (error) {
    console.error("Gemini recommendation error:", error);

    const fallbackAttempts = Array.isArray(req.body?.attempts) ? req.body.attempts : [];
    return res.json({
      recommendations: buildFallbackRecommendations(fallbackAttempts),
      provider: "rules",
    });
  }
});
