'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Wrapper, Status } from '@googlemaps/react-wrapper';
import { beaches } from '@/data/beaches';
import { BeachInfoSheet } from '@/components/BeachInfoSheet';
import { useFirebaseCleanups } from '@/hooks/useFirebase';
import { Beach } from '@/types';

interface MapProps {
  beaches: typeof beaches;
}

function MapComponent({ beaches }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const [selectedBeach, setSelectedBeach] = useState<Beach | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [clickedMarker, setClickedMarker] = useState<google.maps.Marker | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);

  // Use Firebase hook to get cleanup data
  const { cleanups, loading } = useFirebaseCleanups();

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current || loading) return;

    // Initialize the map
    const map = new google.maps.Map(mapRef.current, {
      center: { lat: 12.57, lng: -70.01 }, // Aruba center
      zoom: 12,
      mapTypeId: 'satellite',
      gestureHandling: 'greedy',
      fullscreenControl: true,
      zoomControl: true,
      zoomControlOptions: {
        position: google.maps.ControlPosition.RIGHT_BOTTOM
      },
      mapTypeControl: true,
      streetViewControl: true,
      rotateControl: true,
      scaleControl: true
    });

    mapInstanceRef.current = map;

    // Wait for map to be ready before adding markers
    google.maps.event.addListenerOnce(map, 'idle', () => {
      // Add markers for each beach
      const markers: google.maps.Marker[] = [];
      
      console.log(`Loading ${beaches.length} beaches for markers...`);
      
      beaches.forEach((beach, index) => {
      // Determine marker color based on most recent cleanup
      const beachCleanups = cleanups.filter(c => c.beach === beach.name);
      const mostRecent = beachCleanups
        .map(c => new Date(c.date))
        .sort((a,b) => b.getTime() - a.getTime())[0];
      
      let markerColor = 'red';
      let iconUrl = 'https://maps.google.com/mapfiles/ms/icons/red-dot.png';
      
      if (mostRecent) {
        const cleanupDate = mostRecent.getTime();
        const now = Date.now();
        const diffDays = Math.floor((now - cleanupDate) / (1000*60*60*24));
        
        // Handle future dates (test data) - treat them as recent
        if (diffDays < 0) {
          markerColor = 'green';
          iconUrl = 'https://maps.google.com/mapfiles/ms/icons/green-dot.png';
          console.log(`${beach.name}: Future date (${mostRecent.toISOString().split('T')[0]}) - treating as recent (green)`);
        } else if (diffDays < 45) {
          markerColor = 'green';
          iconUrl = 'https://maps.google.com/mapfiles/ms/icons/green-dot.png';
          console.log(`${beach.name}: ${diffDays} days ago (green)`);
        } else if (diffDays <= 90) {
          markerColor = 'orange';
          iconUrl = 'https://maps.google.com/mapfiles/ms/icons/orange-dot.png';
          console.log(`${beach.name}: ${diffDays} days ago (orange)`);
        } else {
          markerColor = 'red';
          iconUrl = 'https://maps.google.com/mapfiles/ms/icons/red-dot.png';
          console.log(`${beach.name}: ${diffDays} days ago (red)`);
        }
      } else {
        console.log(`${beach.name}: No cleanups found (red)`);
      }
      
      console.log(`Creating marker ${index + 1}/${beaches.length}: ${beach.name} at ${beach.lat}, ${beach.lng} (${markerColor})`);
      
      const marker = new google.maps.Marker({
        position: { lat: beach.lat, lng: beach.lng },
        map: map,
        title: beach.name,
        icon: {
          url: iconUrl,
          scaledSize: new google.maps.Size(32, 32),
          anchor: new google.maps.Point(16, 16)
        }
      });

      console.log(`Marker created for ${beach.name}:`, marker);

          // Add click listener to show beach info sheet
          marker.addListener('click', () => {
            // Reset previous clicked marker
            if (clickedMarker) {
              const currentIcon = clickedMarker.getIcon();
              const iconUrl = typeof currentIcon === 'string' ? currentIcon : 
                             (currentIcon as google.maps.Icon)?.url || 'https://maps.google.com/mapfiles/ms/icons/red-dot.png';
              clickedMarker.setIcon({
                url: iconUrl,
                scaledSize: new google.maps.Size(32, 32),
                anchor: new google.maps.Point(16, 16)
              });
            }

            // Highlight clicked marker
            const currentIcon = marker.getIcon();
            const iconUrl = typeof currentIcon === 'string' ? currentIcon : 
                           (currentIcon as google.maps.Icon)?.url || 'https://maps.google.com/mapfiles/ms/icons/red-dot.png';
            marker.setIcon({
              url: iconUrl,
              scaledSize: new google.maps.Size(48, 48), // Make it bigger
              anchor: new google.maps.Point(24, 24)
            });

            setClickedMarker(marker);

            // Merge Firebase cleanups with beach data
            const beachWithCleanups = {
              ...beach,
              cleanups: beachCleanups.map(c => ({
                date: c.date,
                rating: c.rating,
                description: c.description || '',
                name: c.contributorName || '',
                photoUrl: c.photoUrl || ''
              }))
            };
            setSelectedBeach(beachWithCleanups);
            setIsSheetOpen(true);
          });

      markers.push(marker);
    });

      console.log(`Successfully created ${markers.length} markers on the map`);
      markersRef.current = markers;

      // Fit map to show all markers
      if (markers.length > 0) {
        const bounds = new google.maps.LatLngBounds();
        markers.forEach(marker => bounds.extend(marker.getPosition()!));
        map.fitBounds(bounds);
      }

    });

    return () => {
      // Cleanup will be handled by the map instance
    };
  }, [beaches, cleanups, loading]);

  // Listen for custom beach selection events
  useEffect(() => {
    const handleBeachSelection = (event: CustomEvent) => {
      const beachName = event.detail.beachName;
      const beach = beaches.find(b => b.name === beachName);
      if (beach) {
        // Merge Firebase cleanups with beach data
        const beachCleanups = cleanups.filter(c => c.beach === beach.name);
        const beachWithCleanups = {
          ...beach,
          cleanups: beachCleanups.map(c => ({
            date: c.date,
            rating: c.rating,
            description: c.description || '',
            name: c.contributorName || '',
            photoUrl: c.photoUrl || ''
          }))
        };
        setSelectedBeach(beachWithCleanups);
        setIsSheetOpen(true);
      }
    };

    window.addEventListener('selectBeach', handleBeachSelection as EventListener);
    return () => {
      window.removeEventListener('selectBeach', handleBeachSelection as EventListener);
    };
  }, [beaches, cleanups]);

      return (
        <>
          {loading ? (
            <div className="flex items-center justify-center h-screen bg-gray-100">
              <div className="text-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading beach data...</p>
              </div>
            </div>
          ) : (
            <>
              <div ref={mapRef} id="map" style={{ width: '100%', height: '100vh' }} />
              {selectedBeach && (
                <BeachInfoSheet 
                  beach={selectedBeach} 
                  isOpen={isSheetOpen} 
                  onClose={() => {
                    setIsSheetOpen(false);
                    // Reset clicked marker when sheet closes
                    if (clickedMarker) {
                      const currentIcon = clickedMarker.getIcon();
                      const iconUrl = typeof currentIcon === 'string' ? currentIcon : 
                                     (currentIcon as google.maps.Icon)?.url || 'https://maps.google.com/mapfiles/ms/icons/red-dot.png';
                      clickedMarker.setIcon({
                        url: iconUrl,
                        scaledSize: new google.maps.Size(32, 32),
                        anchor: new google.maps.Point(16, 16)
                      });
                      setClickedMarker(null);
                    }
                  }} 
                />
              )}
            </>
          )}
        </>
      );
}

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'AIzaSyAjHboXS874vfmUjD35Y0U2P-U_IsnJQ2M';

function MapWrapper({ beaches }: MapProps) {
  const render = (status: Status) => {
    switch (status) {
      case Status.LOADING:
        return (
          <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600 text-lg">Loading Aruba Map...</p>
            </div>
          </div>
        );
      case Status.FAILURE:
        return (
          <div className="flex items-center justify-center h-screen bg-red-50">
            <div className="text-center">
              <div className="text-red-500 text-6xl mb-4">🗺️</div>
              <p className="text-red-600 text-lg">Error Loading Map</p>
              <p className="text-red-500 text-sm mt-2">Please check your Google Maps API key</p>
              <p className="text-gray-600 text-xs mt-4 max-w-md">
                Current key is for development only. Get a proper Google Maps API key from 
                <a href="https://console.cloud.google.com/" target="_blank" className="text-blue-600 underline"> Google Cloud Console</a>
              </p>
            </div>
          </div>
        );
      default:
        return <div></div>;
    }
  };

  return (
    <Wrapper apiKey={API_KEY} render={render}>
      <MapComponent beaches={beaches} />
    </Wrapper>
  );
}

export default MapWrapper;
