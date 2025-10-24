import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyBVRzM_jmRlASnURwvQp26YgAry_uvbvmk",
  authDomain: "beach-cleanup-aruba.firebaseapp.com",
  projectId: "beach-cleanup-aruba",
  storageBucket: "beach-cleanup-aruba.appspot.com",
  messagingSenderId: "804809578032",
  appId: "1:804809578032:web:23bc10abe1c703075d7ff5",
  measurementId: "G-5QBVFJWX39"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function checkAllFirebaseData() {
  try {
    console.log('🔍 Checking ALL Firebase collections...');
    
    // Check cleanups collection
    const cleanupsSnapshot = await getDocs(collection(db, 'cleanups'));
    console.log(`📊 Found ${cleanupsSnapshot.size} documents in 'cleanups' collection`);
    
    if (cleanupsSnapshot.size > 0) {
      console.log('📋 Cleanup documents:');
      cleanupsSnapshot.forEach((doc, index) => {
        const data = doc.data();
        console.log(`${index + 1}. Document ID: ${doc.id}`);
        console.log(`   Data:`, JSON.stringify(data, null, 2));
        console.log('---');
      });
    }
    
    // Check if there are other collections
    console.log('\n🔍 Checking for other collections...');
    console.log('Note: Firestore doesn\'t have a direct way to list all collections from client-side');
    console.log('But we can check common collection names...');
    
    const commonCollections = ['beaches', 'users', 'events', 'reports'];
    for (const collectionName of commonCollections) {
      try {
        const snapshot = await getDocs(collection(db, collectionName));
        if (snapshot.size > 0) {
          console.log(`📊 Found ${snapshot.size} documents in '${collectionName}' collection`);
        }
      } catch (error) {
        // Collection might not exist, that's okay
      }
    }
    
    return cleanupsSnapshot.size;
  } catch (error) {
    console.error('❌ Error checking Firebase:', error);
    return 0;
  }
}

// Run the check
checkAllFirebaseData().then(count => {
  console.log(`\n✅ Firebase check complete. Found ${count} cleanup documents.`);
  console.log('\n💡 If you see cleanup documents above, they exist but might have different field names than expected.');
});
