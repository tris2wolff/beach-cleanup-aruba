import { useState, useEffect } from 'react';
import { FirebaseService, CleanupData, BeachData } from '@/lib/firebase';

export function useFirebaseCleanups() {
  const [cleanups, setCleanups] = useState<CleanupData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Subscribe to real-time updates
    const unsubscribe = FirebaseService.subscribeToCleanups((newCleanups) => {
      setCleanups(newCleanups);
      setLoading(false);
      setError(null);
    });

    return () => unsubscribe();
  }, []);

  const addCleanup = async (cleanupData: Omit<CleanupData, 'id' | 'createdAt'>) => {
    try {
      setError(null);
      await FirebaseService.addCleanup(cleanupData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add cleanup');
      throw err;
    }
  };

  const uploadImage = async (file: File, beachName: string) => {
    try {
      setError(null);
      return await FirebaseService.uploadImage(file, beachName);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image');
      throw err;
    }
  };

  return {
    cleanups,
    loading,
    error,
    addCleanup,
    uploadImage
  };
}

export function useBeachesWithCleanups(beaches: BeachData[]) {
  const [beachesWithCleanups, setBeachesWithCleanups] = useState<BeachData[]>(beaches);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBeachesWithCleanups = async () => {
      try {
        const beachesData = await FirebaseService.getBeachesWithCleanups(beaches);
        setBeachesWithCleanups(beachesData);
      } catch (error) {
        console.error('Error loading beaches with cleanups:', error);
        setBeachesWithCleanups(beaches); // Fallback to original beaches
      } finally {
        setLoading(false);
      }
    };

    loadBeachesWithCleanups();
  }, [beaches]);

  return { beachesWithCleanups, loading };
}
