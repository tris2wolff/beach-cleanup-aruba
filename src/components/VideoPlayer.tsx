'use client';

import React, { useState, useEffect } from 'react';

interface VideoPlayerProps {
  fileName: string;
  poster?: string;
  className?: string;
  fallbackUrl?: string; // Add fallback URL option
}

export default function VideoPlayer({ fileName, poster, className = '', fallbackUrl }: VideoPlayerProps) {
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const loadVideo = async () => {
      try {
        setLoading(true);
        
        // Try Firebase Storage first
        try {
          const { FirebaseService } = await import('@/lib/firebase');
          const url = await FirebaseService.getVideoUrl(fileName);
          setVideoUrl(url);
          setError('');
        } catch (firebaseError) {
          console.log('Firebase Storage not available, using fallback');
          
          // Use fallback URL if provided
          if (fallbackUrl) {
            setVideoUrl(fallbackUrl);
            setError('');
          } else {
            throw new Error('No video source available');
          }
        }
      } catch (err) {
        console.error('Error loading video:', err);
        setError('Failed to load video');
      } finally {
        setLoading(false);
      }
    };

    loadVideo();
  }, [fileName, fallbackUrl]);

  if (loading) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading video...</p>
        </div>
      </div>
    );
  }

  if (error || !videoUrl) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 ${className}`}>
        <div className="text-center text-gray-600">
          <p>⚠️ {error || 'Video not available'}</p>
          <p className="text-sm mt-2">Please upload the video to Firebase Storage</p>
        </div>
      </div>
    );
  }

  return (
    <video
      src={videoUrl}
      controls
      controlsList="noplaybackrate nodownload"
      preload="metadata"
      playsInline
      poster={poster}
      className={`w-full h-full object-cover ${className}`}
      style={{ width: '100%', maxWidth: '100%' }}
    >
      Your browser does not support the video tag.
    </video>
  );
}
