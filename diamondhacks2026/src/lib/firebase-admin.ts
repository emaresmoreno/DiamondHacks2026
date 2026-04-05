import admin from 'firebase-admin';
import {readFileSync} from 'fs';

import {ucsdLocations} from './ucsd-locations.ts';  // Path to where your array is stored

// 1. Initialize Admin SDK
const serviceAccount = JSON.parse(
    readFileSync(new URL('./serviceAccountKey.json', import.meta.url), 'utf8'));

admin.initializeApp({credential: admin.credential.cert(serviceAccount)});

const db = admin.firestore();

async function uploadData() {
  const collectionKey = 'studySpots';  // Your Firestore collection name
  console.log('🚀 Starting upload...');

  try {
    const batch = db.batch();

    ucsdLocations.forEach((spot) => {
      // Use the 'id' from the object as the document reference
      const docRef = db.collection(collectionKey).doc(spot.id);
      batch.set(docRef, spot);
    });

    await batch.commit();
    console.log(`✅ Successfully uploaded ${ucsdLocations.length} spots!`);
  } catch (error) {
    console.error('❌ Error uploading data: ', error);
  }
}

uploadData();