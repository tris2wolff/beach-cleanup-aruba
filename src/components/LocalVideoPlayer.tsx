'use client';

import React, { useEffect, useState } from 'react';
import { FirebaseService } from '@/lib/firebase';

interface LocalVideoPlayerProps {
  fileName: string;
  poster?: string;
  className?: string;
  fallbackSrc?: string;
}

export default function LocalVideoPlayer({ 
  fileName,
  poster, 
  className = '',
  fallbackSrc
}: LocalVideoPlayerProps) {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadVideo = async () => {
      try {
        setLoading(true);
        const url = await FirebaseService.getVideoUrl(fileName);
        setVideoUrl(url);
      } catch (err) {
        console.error('Failed to load video from Firebase:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadVideo();
  }, [fileName]);

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
    if (fallbackSrc) {
      return (
        <video 
          controls 
          controlsList="nodownload noplaybackrate" 
          poster={poster} 
          className={className}
          preload="metadata"
          playsInline
        >
          <source src={fallbackSrc} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      );
    }
    return (
      <div className={`flex items-center justify-center bg-gray-100 ${className}`}>
        <div className="text-center text-gray-600">
          <p>⚠️ Video not available</p>
          <p className="text-sm mt-2">Please upload the video to Firebase Storage</p>
        </div>
      </div>
    );
  }

  return (
    <video 
      controls 
      controlsList="nodownload noplaybackrate" 
      poster={poster} 
      className={className}
      preload="metadata"
      playsInline
    >
      <source src={videoUrl} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
}
