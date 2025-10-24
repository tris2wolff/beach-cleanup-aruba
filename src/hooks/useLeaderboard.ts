'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { LeaderboardEntry } from '@/types';

export function useLeaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaderboard = async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (!db) {
        console.warn('Firebase not available, returning empty leaderboard');
        setLeaderboard([]);
        return;
      }

      const q = query(collection(db, 'cleanups'), orderBy('timestamp', 'desc'));
      const snapshot = await getDocs(q);
      
      // Group cleanups by contributor name and count them
      const cleanupCounts: Record<string, number> = {};
      
      snapshot.forEach(doc => {
        const { contributorName } = doc.data();
        if (contributorName) {
          cleanupCounts[contributorName] = (cleanupCounts[contributorName] || 0) + 1;
        }
      });

      // Convert to array and sort by count
      const leaderboardEntries: LeaderboardEntry[] = Object.entries(cleanupCounts)
        .map(([name, count], index) => ({
          name,
          cleanupCount: count,
          rank: index + 1
        }))
        .sort((a, b) => b.cleanupCount - a.cleanupCount)
        .map((entry, index) => ({
          ...entry,
          rank: index + 1
        }))
        .slice(0, 10); // Top 10

      setLeaderboard(leaderboardEntries);
    } catch (err) {
      console.warn('Firebase error:', err);
      setLeaderboard([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  return {
    leaderboard,
    isLoading,
    error,
    refetch: fetchLeaderboard
  };
}

