import { 
  collection, 
  getDocs, 
  query, 
  orderBy,
} from "firebase/firestore";
import { auth, db } from "../firebase/firebase";

const FUNCTIONS_BASE_URL = "https://us-central1-bece-prep.cloudfunctions.net";

async function callFunction(name, body) {
  const user = auth.currentUser;
  if (!user) throw new Error("Sign in to continue.");
  const token = await user.getIdToken();
  const response = await fetch(`${FUNCTIONS_BASE_URL}/${name}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data?.error || `Request failed (HTTP ${response.status}).`);
  return data;
}

/**
 * Helper to map Firestore snapshots into usable arrays
 */
function mapSnapshot(snapshot) {
  return snapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));
}

/**
 * Fetches all active subjects for the library
 */
export async function getSubjects() {
  try {
    const subjectsRef = collection(db, "subjects");
    const snapshot = await getDocs(subjectsRef);
    const subjects = mapSnapshot(snapshot);

    return subjects
      .filter((subject) => subject.isActive)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  } catch (error) {
    console.error("Error fetching subjects:", error);
    return [];
  }
}

/**
 * Fetches paper metadata
 */
export async function getPapers() {
  try {
    const { papers = [] } = await callFunction("getStudyContent", { operation: "papers" });
    return papers;
  } catch (error) {
    console.error("Error fetching papers:", error);
    return [];
  }
}

/**
 * Fetches questions and resolves storage URLs for images
 * Path: BECE/[subjectId]/[year]/[section]/Questions
 */
export const getQuestionsByPaper = async (subjectId, year, type = "Objectives", options = {}) => {
  try {
    const section = type === "All Types" || !type ? "Objectives" : type;
    const { questions = [] } = await callFunction("getStudyContent", {
      operation: "questions",
      subjectId,
      year: String(year),
      section,
      mode: options.mode || "practice",
      reservationId: options.reservationId || null,
    });
    return questions;
  } catch (error) {
    console.error("Study content request failed:", error.message);
    throw error;
  }
};

export async function saveMockAttempt(userId, attempt) {
  if (auth.currentUser?.uid !== userId) throw new Error("You can only save your own mock exam.");
  return callFunction("completeMockAttempt", {
    attemptId: attempt.id,
    answers: attempt.answers || {},
    score: attempt.score,
    correctCount: attempt.correctCount,
    answeredCount: attempt.answeredCount,
    totalQuestions: attempt.totalQuestions,
  });
}

export async function saveTheoryMockAttempt(userId, attempt) {
  if (auth.currentUser?.uid !== userId) throw new Error("You can only save your own theory mock.");
  const result = await callFunction("completeMockAttempt", {
    attemptId: attempt.id,
    section: "Theory",
    responses: attempt.responses || {},
  });
  if (!result.saved) throw new Error("The server could not confirm that your theory responses were saved.");
  return result;
}

export async function reserveMockAttempt({ paper, section, attemptId }) {
  return callFunction("reserveMockAttempt", {
    paperId: paper.id,
    section,
    attemptId,
  });
}

export async function getMyEntitlements() {
  return callFunction("getMyEntitlements", {});
}

export async function authorizeParentReportExport(exportId, action = "authorize") {
  return callFunction("authorizeParentReportExport", { exportId, action });
}

export async function getMockAttempts(userId) {
  if (!userId) return [];

  const attemptsRef = collection(db, "users", userId, "mockAttempts");
  const snapshot = await getDocs(query(attemptsRef, orderBy("completedAt", "desc")));
  return mapSnapshot(snapshot);
}
