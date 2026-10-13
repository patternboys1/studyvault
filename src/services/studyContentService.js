import { 
  collection, 
  doc,
  getDocs, 
  query, 
  orderBy,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { 
  ref, 
  getDownloadURL 
} from "firebase/storage"; 
import { db, storage } from "../firebase/firebase";

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
    const papersRef = collection(db, "papers");
    const snapshot = await getDocs(papersRef);
    const papers = mapSnapshot(snapshot);

    return papers
      .filter((paper) => paper.isPublished === true)
      .sort((a, b) => (b.year ?? 0) - (a.year ?? 0));
  } catch (error) {
    console.error("Error fetching papers:", error);
    return [];
  }
}

/**
 * Fetches questions and resolves storage URLs for images
 * Path: BECE/[subjectId]/[year]/[section]/Questions
 */
export const getQuestionsByPaper = async (subjectId, year, type = "Objectives") => {
  try {
    // 1. Path Normalization
    const section = type === "All Types" || !type ? "Objectives" : type;

    const questionsRef = collection(
      db,
      "BECE",
      subjectId,
      String(year),
      section,
      "Questions"
    );

    const q = query(questionsRef, orderBy("number", "asc"));
    const snapshot = await getDocs(q);

    const imageFields = ["imageUrl", "answerImageUrl", "modelAnswerImageUrl", "answerImage"];

    const resolveStorageField = async (value) => {
      if (!value || !String(value).startsWith("gs://")) {
        return value;
      }

      try {
        const imageRef = ref(storage, value);
        return await getDownloadURL(imageRef);
      } catch (err) {
        console.warn(`Could not resolve Firebase image: ${value}`, err.message);
        return null;
      }
    };

    // 2. Resolve gs:// links to https:// download URLs
    const questions = await Promise.all(
      snapshot.docs.map(async (docSnap) => {
        const data = docSnap.data();

        for (const field of imageFields) {
          if (data[field]) {
            data[field] = await resolveStorageField(data[field]);
          }
        }

        return { id: docSnap.id, ...data };
      })
    );

    console.log(` ${questions.length} questions loaded for ${subjectId} ${year} (${section})`);
    return questions;

  } catch (error) {
    console.error(" Firebase Fetch Error:", error.message);
    return [];
  }
};

export async function saveMockAttempt(userId, attempt) {
  const attemptRef = doc(db, "users", userId, "mockAttempts", attempt.id);

  await setDoc(attemptRef, {
    ...attempt,
    userId,
    completedAt: serverTimestamp(),
  });
}

export async function getMockAttempts(userId) {
  if (!userId) return [];

  const attemptsRef = collection(db, "users", userId, "mockAttempts");
  const snapshot = await getDocs(query(attemptsRef, orderBy("completedAt", "desc")));
  return mapSnapshot(snapshot);
}
