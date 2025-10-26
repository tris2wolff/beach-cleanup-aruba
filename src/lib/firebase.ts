import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, query, orderBy, onSnapshot, Timestamp } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

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

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Storage
export const storage = getStorage(app);

// Types
export interface CleanupData {
  id?: string;
  beach: string; // Changed from beachName to match Firebase data
  date: string;
  rating: number;
  description?: string;
  contributorName?: string; // Changed from name to match Firebase data
  photoUrl?: string;
  createdAt?: Timestamp;
}

export interface BeachData {
  name: string;
  lat: number;
  lng: number;
  description: string;
  image: string;
  cleanups: CleanupData[];
}

// Firebase service functions
export class FirebaseService {
  // Add a new cleanup
  static async addCleanup(cleanupData: Omit<CleanupData, 'id' | 'createdAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'cleanups'), {
        ...cleanupData,
        createdAt: Timestamp.now()
      });
      console.log('Cleanup added with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error adding cleanup:', error);
      throw error;
    }
  }

  // Upload video to Firebase Storage
  static async uploadVideo(file: File, fileName: string): Promise<string> {
    try {
      const storageRef = ref(storage, `videos/${fileName}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading video:', error);
      throw error;
    }
  }

  // Get video URL from Firebase Storage
  static async getVideoUrl(fileName: string): Promise<string> {
    try {
      const storageRef = ref(storage, `videos/${fileName}`);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error('Error getting video URL:', error);
      throw error;
    }
  }

  // Upload image to Firebase Storage
  static async uploadImage(file: File, beachName: string): Promise<string> {
    try {
      const timestamp = Date.now();
      const fileName = `${beachName}_${timestamp}_${file.name}`;
      const storageRef = ref(storage, `cleanup-images/${fileName}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }

  // Get all cleanups
  static async getAllCleanups(): Promise<CleanupData[]> {
    try {
      const q = query(collection(db, 'cleanups'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const cleanups: CleanupData[] = [];
      
      querySnapshot.forEach((doc) => {
        cleanups.push({
          id: doc.id,
          ...doc.data()
        } as CleanupData);
      });
      
      return cleanups;
    } catch (error) {
      console.error('Error getting cleanups:', error);
      throw error;
    }
  }

  // Get cleanups for a specific beach
  static async getCleanupsForBeach(beachName: string): Promise<CleanupData[]> {
    try {
      const q = query(collection(db, 'cleanups'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const cleanups: CleanupData[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data() as CleanupData;
        if (data.beach === beachName) {
          cleanups.push({
            id: doc.id,
            ...data
          });
        }
      });
      
      return cleanups;
    } catch (error) {
      console.error('Error getting cleanups for beach:', error);
      throw error;
    }
  }

  // Listen to real-time updates for cleanups
  static subscribeToCleanups(callback: (cleanups: CleanupData[]) => void): () => void {
    const q = query(collection(db, 'cleanups'));
    
    return onSnapshot(q, 
      (querySnapshot) => {
        const cleanups: CleanupData[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          
          // Normalize the data to handle different field names
          const normalizedData: CleanupData = {
            id: doc.id,
            beach: data.beach || '',
            date: data.date || '',
            rating: data.rating || data.cleanlinessRating || 5, // Handle both field names
            description: data.description || '',
            contributorName: data.contributorName || '',
            photoUrl: data.photoUrl || '',
            createdAt: data.createdAt || data.timestamp
          };
          
          cleanups.push(normalizedData);
        });
        callback(cleanups);
      },
      (error) => {
        console.error('Firebase subscription error:', error);
        callback([]); // Return empty array on error
      }
    );
  }

  // Get beaches with their cleanup data
  static async getBeachesWithCleanups(beaches: BeachData[]): Promise<BeachData[]> {
    try {
      const allCleanups = await this.getAllCleanups();
      
      return beaches.map(beach => ({
        ...beach,
        cleanups: allCleanups.filter(cleanup => cleanup.beach === beach.name)
      }));
    } catch (error) {
      console.error('Error getting beaches with cleanups:', error);
      return beaches; // Return original beaches if error
    }
  }
}