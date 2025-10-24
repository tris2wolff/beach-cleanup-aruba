'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Event } from '@/types';

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (!db) {
        console.warn('Firebase not available, returning empty events');
        setEvents([]);
        return;
      }

      const q = query(
        collection(db, 'events'), 
        where('date', '>=', new Date()),
        orderBy('date', 'asc')
      );
      const snapshot = await getDocs(q);
      
      const eventsList: Event[] = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        eventsList.push({
          id: doc.id,
          title: data.title,
          date: data.date.toDate(),
          location: data.location,
          description: data.description,
          organizer: data.organizer,
          contactEmail: data.contactEmail
        });
      });

      setEvents(eventsList);
    } catch (err) {
      console.warn('Firebase error:', err);
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return {
    events,
    isLoading,
    error,
    refetch: fetchEvents
  };
}

