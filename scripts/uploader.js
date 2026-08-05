import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const serviceAccount = require('./serviceAccountKey.json');

// Initialize only once
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

// 1. Capture Arguments from Terminal
// Command: node uploader.js [subject] [year] [type]
const subjectArg = process.argv[2]; // e.g., Science
const yearArg = process.argv[3];    // e.g., 2025
const typeArg = process.argv[4];    // e.g., Theory or Objectives

if (!subjectArg || !yearArg || !typeArg) {
  console.log("❌ Missing arguments!");
  console.log("Usage: node uploader.js <Subject> <Year> <Type>");
  console.log("Example: node uploader.js Science 2025 Theory");
  process.exit(1);
}

async function uploadPaper() {
  // 2. Dynamically build the file path
  // Assumes your folder is: data/conversions/science/science_2025_theory.json
  const fileName = `${subjectArg.toLowerCase()}_${yearArg}_${typeArg.toLowerCase() === 'objectives' ? 'obj' : 'theory'}.json`;
  const filePath = path.join('../src/data/conversions', subjectArg.toLowerCase(), fileName);

  try {
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found at ${filePath}`);
    }

    const rawData = fs.readFileSync(filePath);
    const questions = JSON.parse(rawData);
    const batch = db.batch();
    
    // 3. Dynamic Pathing to Firestore
    const collectionRef = db.collection('BECE').doc(subjectArg)
                           .collection(yearArg).doc(typeArg)
                           .collection('Questions');

    questions.forEach((q) => {
      const docId = q.number.toString(); 
      const docRef = collectionRef.doc(docId);
      batch.set(docRef, q);
    });

    await batch.commit();
    console.log(`✅ SUCCESS: Uploaded ${subjectArg} ${yearArg} ${typeArg} from ${fileName}`);

    // 4. Automatically create the Library Card (Metadata)
    await updateLibraryCard(subjectArg, yearArg);

  } catch (error) {
    console.error('❌ Upload failed: ', error.message);
  }
}

async function updateLibraryCard(subject, year) {
  const cardId = `${subject.toLowerCase()}_${year}`;
  await db.collection('papers').doc(cardId).set({
    id: year,
    subjectName: subject === 'Science' ? 'Integrated Science' : subject,
    year: parseInt(year),
    isPublished: true,
    type: "Theory + Objectives",
    questionCount: 45,
    durationMinutes: 120
  }, { merge: true });
  console.log(`📝 Library Card updated: ${cardId}`);
}

uploadPaper();