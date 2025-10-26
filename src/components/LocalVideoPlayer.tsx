'use client';

import React from 'react';

interface LocalVideoPlayerProps {
  localSrc: string;
  fallbackSrc?: string;
  poster?: string;
  className?: string;
}

export default function LocalVideoPlayer({ 
  localSrc, 
  fallbackSrc, 
  poster, 
  className = '' 
}: LocalVideoPlayerProps) {
  const [currentSrc, setCurrentSrc] = React.useState(localSrc);
  const [hasError, setHasError] = React.useState(false);

  const handleError = () => {
    if (!hasError && fallbackSrc && currentSrc === localSrc) {
      setHasError(true);
      setCurrentSrc(fallbackSrc);
    }
  };

  return (
    <video 
      controls 
      controlsList="nodownload noplaybackrate" 
      poster={poster} 
      className={className}
      preload="metadata"
      playsInline
      onError={handleError}
      key={currentSrc}
    >
      <source src={currentSrc} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
}
