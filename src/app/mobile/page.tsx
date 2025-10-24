'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Wrapper, Status } from '@googlemaps/react-wrapper';
import { beaches } from '@/data/beaches';
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

interface Beach {
  name: string;
  lat: number;
  lng: number;
  description: string;
  image?: string;
}

interface MapProps {
  beaches: typeof beaches;
}

function MobileMapComponent({ beaches }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const [selectedBeach, setSelectedBeach] = useState<typeof beaches[0] | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize the map
    const map = new google.maps.Map(mapRef.current, {
      center: { lat: 12.57, lng: -70.01 }, // Aruba center
      zoom: 12,
      mapTypeId: 'satellite',
      gestureHandling: 'greedy',
      fullscreenControl: true,
      zoomControl: true,
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
        console.log(`Creating marker ${index + 1}/${beaches.length}: ${beach.name} at ${beach.lat}, ${beach.lng}`);
        
        const marker = new google.maps.Marker({
          position: { lat: beach.lat, lng: beach.lng },
          map: map,
          title: beach.name,
          icon: {
            path: 'M12,2 C7.58,2 4,5.58 4,10 c0,6 8,14 8,14 s8,-8 8,-14 C20,5.58 16.42,2 12,2 z M12,12 C10.9,12 10,11.1 10,10 s0.9,-2 2,-2 s2,0.9 2,2 S13.1,12 12,12 z',
            fillColor: '#FF0000', // Bright red
            fillOpacity: 0.85,
            strokeColor: '#FFFFFF',
            strokeWeight: 1,
            scale: 1.5,
            anchor: new google.maps.Point(12, 24)
          }
        });

        console.log(`Marker created for ${beach.name}:`, marker);

        // Add click listener to show beach info drawer
        marker.addListener('click', () => {
          setSelectedBeach(beach);
          setIsDrawerOpen(true);
        });

        markers.push(marker);
      });

      console.log(`Successfully created ${markers.length} markers on the map`);

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
  }, [beaches]);

  return (
    <>
      <div ref={mapRef} id="map" style={{ width: '100%', height: '100vh' }} />
      {selectedBeach && (
        <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle className="text-xl font-bold text-gray-900">
                {selectedBeach.name}
              </DrawerTitle>
              <DrawerDescription>
                Beach information and cleanup options
              </DrawerDescription>
            </DrawerHeader>
            
            <div className="px-4 pb-4">
              {selectedBeach.image && (
                <div className="w-full h-48 rounded-lg overflow-hidden mb-4">
                  <img 
                    src={selectedBeach.image} 
                    alt={selectedBeach.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <div className="space-y-3 mb-6">
                <p className="text-gray-700 leading-relaxed">
                  {selectedBeach.description}
                </p>
                <p className="text-sm text-gray-500">
                  📍 {selectedBeach.lat.toFixed(5)}, {selectedBeach.lng.toFixed(5)}
                </p>
              </div>

              <div className="space-y-3">
                <Button 
                  className="w-full h-12 text-base font-semibold" 
                  variant="default"
                  onClick={() => {
                    // Add cleanup functionality here
                    console.log('Add cleanup clicked for:', selectedBeach.name);
                  }}
                >
                  🧹 Add Cleanup
                </Button>
                
                <Button 
                  className="w-full h-12 text-base" 
                  variant="outline"
                  onClick={() => {
                    // Get directions functionality
                    const url = `https://www.google.com/maps/dir/?api=1&destination=${selectedBeach.lat},${selectedBeach.lng}`;
                    window.open(url, '_blank');
                  }}
                >
                  🧭 Get Directions
                </Button>
                
                <Button 
                  className="w-full h-12 text-base" 
                  variant="outline"
                  onClick={() => {
                    // See past cleanups functionality
                    console.log('See past cleanups clicked for:', selectedBeach.name);
                  }}
                >
                  📊 See Past Cleanups
                </Button>
              </div>
            </div>
            
            <DrawerFooter>
              <DrawerClose asChild>
                <Button variant="outline" className="h-12 text-base">
                  Close
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
}

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'AIzaSyAjHboXS874vfmUjD35Y0U2P-U_IsnJQ2M';

function MobileMapWrapper({ beaches }: MapProps) {
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
            </div>
          </div>
        );
      default:
        return <div></div>;
    }
  };

  return (
    <Wrapper apiKey={API_KEY} render={render}>
      <MobileMapComponent beaches={beaches} />
    </Wrapper>
  );
}

export default function MobileBeachCleanupPage() {
  return (
    <main className="relative h-screen overflow-hidden bg-gray-50">
      {/* Mobile Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-white/90 backdrop-blur-sm border-b border-gray-200">
        <div className="px-4 py-3">
          <h1 className="text-lg font-bold text-gray-900 text-center">
            🏖️ Beach Cleanup Aruba
          </h1>
          <p className="text-sm text-gray-600 text-center mt-1">
            Tap any marker to see beach details
          </p>
        </div>
      </div>
      
      {/* Map Container */}
      <div className="pt-16 h-full">
        <MobileMapWrapper beaches={beaches} />
      </div>
      
      {/* Mobile Legend */}
      <div className="absolute bottom-4 left-4 right-4 z-10">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-gray-200">
          <div className="flex items-center justify-center space-x-4 text-xs">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-700">Recently Clean</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span className="text-gray-700">Needs Attention</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-gray-700">Urgent Cleanup</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
