// Firebase Video Upload Utility
// Run this script to upload your video to Firebase Storage
// Usage: node upload-video.js

const { initializeApp } = require('firebase/app');
const { getStorage, ref, uploadBytes, getDownloadURL } = require('firebase/storage');
const fs = require('fs');
const path = require('path');

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyBVRzM_jmRlASnURwvQp26YgAry_uvbvmk",
  authDomain: "beach-cleanup-aruba.firebaseapp.com",
  projectId: "beach-cleanup-aruba",
  storageBucket: "beach-cleanup-aruba.firebasestorage.app",
  messagingSenderId: "804809578032",
  appId: "1:804809578032:web:23bc10abe1c703075d7ff5",
  measurementId: "G-5QBVFJWX39"
};

async function uploadVideo() {
  try {
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const storage = getStorage(app);

    // Path to your video file
    const videoPath = path.join(__dirname, 'public', 'arubacleanbeaches.mp4');
    
    // Check if file exists
    if (!fs.existsSync(videoPath)) {
      console.error('❌ Video file not found at:', videoPath);
      console.log('Please make sure arubacleanbeaches.mp4 is in the public/ folder');
      return;
    }

    console.log('📁 Found video file:', videoPath);
    
    // Read the file
    const fileBuffer = fs.readFileSync(videoPath);
    const fileName = 'arubacleanbeaches.mp4';
    
    console.log('📤 Uploading video to Firebase Storage...');
    
    // Upload to Firebase Storage
    const storageRef = ref(storage, `videos/${fileName}`);
    const snapshot = await uploadBytes(storageRef, fileBuffer);
    
    console.log('✅ Upload successful!');
    console.log('📊 Upload details:', {
      fileName: fileName,
      size: `${(fileBuffer.length / 1024 / 1024).toFixed(2)} MB`,
      path: snapshot.ref.fullPath
    });
    
    // Get download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log('🔗 Download URL:', downloadURL);
    
    console.log('\n🎉 Video uploaded successfully!');
    console.log('The video should now be available in your About Us page.');
    
  } catch (error) {
    console.error('❌ Upload failed:', error);
  }
}

// Run the upload
uploadVideo();
