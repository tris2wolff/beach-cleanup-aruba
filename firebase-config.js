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
firebase.initializeApp(firebaseConfig);
window.db = firebase.firestore();
