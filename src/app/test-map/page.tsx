'use client';

import { useEffect, useState } from 'react';

export default function TestMapPage() {
  const [apiKey, setApiKey] = useState<string>('');
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'AIzaSyAjHboXS874vfmUjD35Y0U2P-U_IsnJQ2M';
    setApiKey(key);
    console.log('API Key from environment:', key);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.google) {
      setMapLoaded(true);
      console.log('Google Maps loaded successfully');
    }
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Google Maps API Test</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <h2>API Key Status:</h2>
        <p><strong>API Key:</strong> {apiKey}</p>
        <p><strong>API Key Length:</strong> {apiKey.length} characters</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>Google Maps Status:</h2>
        <p><strong>Google Maps Loaded:</strong> {mapLoaded ? '✅ Yes' : '❌ No'}</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>Environment Variables:</h2>
        <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '5px' }}>
          {JSON.stringify({
            NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
            NODE_ENV: process.env.NODE_ENV
          }, null, 2)}
        </pre>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>Instructions:</h2>
        <ol>
          <li>Check if the API key is displayed above</li>
          <li>Open browser console (F12) to see any error messages</li>
          <li>Try disabling ad blockers</li>
          <li>Check if Google Maps loads</li>
        </ol>
      </div>

      <a href="/" style={{ color: '#007bff', textDecoration: 'underline' }}>
        ← Back to Main Map
      </a>
    </div>
  );
}
