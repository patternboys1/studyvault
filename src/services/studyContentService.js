import { 
  collection, 
  getDocs, 
  query, 
  orderBy 
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

    // 2. Resolve gs:// links to https:// download URLs
    const questions = await Promise.all(
      snapshot.docs.map(async (docSnap) => {
        const data = docSnap.data();
        
        // If an image exists and uses the internal Firebase scheme
        if (data.imageUrl && data.imageUrl.startsWith("gs://")) {
          try {
            const imageRef = ref(storage, data.imageUrl);
            data.imageUrl = await getDownloadURL(imageRef);
          } catch (err) {
            console.warn(` Could not resolve image for Q${data.number}:`, err.message);
            // Keep the data but set image to null so UI handles it gracefully
            data.imageUrl = null; 
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
