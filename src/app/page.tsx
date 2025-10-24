'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { beaches } from '@/data/beaches';
import { ContactPopover } from '@/components/ContactPopover';
import { useFirebaseCleanups } from '@/hooks/useFirebase';
import { Button } from '@/components/ui/button';

// Dynamically import the Map component to avoid SSR issues
const Map = dynamic(() => import('@/components/Map'), { 
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading map...</p>
      </div>
    </div>
  )
});

export default function HomePage() {
  const [showAnimations, setShowAnimations] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [showPriorityList, setShowPriorityList] = useState(false);
  
  // Use Firebase hook to get cleanup data
  const { cleanups } = useFirebaseCleanups();

  useEffect(() => {
    // Stop all animations after 2 seconds
    setTimeout(() => {
      setShowAnimations(false);
    }, 2000);

    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Calculate priority beaches (those needing cleanup most urgently)
  const getPriorityBeaches = () => {
    const beachPriority = beaches.map(beach => {
      const beachCleanups = cleanups.filter(c => c.beach === beach.name);
      const mostRecent = beachCleanups
        .map(c => new Date(c.date))
        .sort((a, b) => b.getTime() - a.getTime())[0];
      
      let daysSinceCleanup = Infinity;
      let priorityScore = 0;
      
      if (mostRecent) {
        const cleanupDate = mostRecent.getTime();
        const now = Date.now();
        daysSinceCleanup = Math.floor((now - cleanupDate) / (1000 * 60 * 60 * 24));
        
        // Handle future dates (test data) - treat them as recent
        if (daysSinceCleanup < 0) {
          daysSinceCleanup = 0;
          priorityScore = 0;
        } else {
          priorityScore = daysSinceCleanup;
        }
      } else {
        priorityScore = 999; // No cleanup ever
      }
      
      return {
        ...beach,
        daysSinceCleanup,
        priorityScore
      };
    });
    
    return beachPriority.sort((a, b) => b.priorityScore - a.priorityScore);
  };

  return (
    <main className="relative h-screen overflow-hidden bg-gradient-to-br from-blue-100 to-cyan-100">
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes spin-360 {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .spin-360 {
            animation: spin-360 0.8s ease-in-out;
          }
          .gm-control-active {
            transform: translateY(-10px) scale(0.9) !important;
          }
        `
      }} />
          {/* Header */}
          <div className={`absolute top-0 left-0 right-0 z-10 ${isMobile ? 'pt-[-3px]' : ''}`}>
            <div className={`px-6 ${isMobile ? 'py-2' : 'py-6'}`}>
                  <div className={`flex items-center justify-center ${isMobile ? 'mb-2' : 'mb-4'} ${isMobile ? 'flex-row' : ''}`}>
                    <span className={`${isMobile ? 'text-2xl mr-2' : 'text-5xl mr-4'} ${showAnimations ? 'animate-bounce' : ''}`}>🌊</span>
                    <h1 className={`${isMobile ? 'text-xl' : 'text-4xl'} font-bold bg-gradient-to-r from-blue-300 via-cyan-300 to-blue-500 bg-clip-text text-transparent drop-shadow-lg ${isMobile ? 'text-center' : ''}`}>Aruba Clean Beaches</h1>
                    <span className={`${isMobile ? 'text-2xl ml-2' : 'text-5xl ml-4'} ${showAnimations ? 'animate-bounce' : ''}`}>🌊</span>
                  </div>
                  <p className={`${isMobile ? 'text-xs' : 'text-lg'} text-white drop-shadow-md text-center ${isMobile ? 'mb-1' : 'mb-3'}`}>Help clean our beaches and care for our environment</p>
                  <p className={`${isMobile ? 'text-xs' : 'text-base'} text-white drop-shadow-md text-center ${isMobile ? 'mb-2' : 'mb-4'}`}>📍 Click any marker to see beach details</p>
                  <div className={`text-center ${isMobile ? 'space-y-2' : 'space-y-3'}`}>
                    <button 
                      className={`bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white ${isMobile ? 'px-6 py-3 text-sm' : 'px-8 py-4 text-lg'} rounded-full font-semibold shadow-lg transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5 ${showAnimations ? 'animate-bounce spin-360' : ''}`}
                      onClick={() => window.location.href = '/about'}
                    >
                      🌊 Learn More About Our Mission
                    </button>
                    {isMobile && (
                      <div className="flex space-x-3">
                        <button 
                          className={`bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white px-6 py-3 rounded-full text-sm font-semibold shadow-lg transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5 ${showAnimations ? 'animate-bounce spin-360' : ''}`}
                          onClick={() => setShowPriorityList(true)}
                        >
                          🚨 Urgent Cleanups
                        </button>
                        <button 
                          className={`bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white px-6 py-3 rounded-full text-sm font-semibold shadow-lg transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5 ${showAnimations ? 'animate-bounce spin-360' : ''}`}
                          onClick={() => {
                            const contactSection = document.getElementById('contact-section');
                            if (contactSection) {
                              contactSection.scrollIntoView({ behavior: 'smooth' });
                            } else {
                              window.location.href = '/about#contact-section';
                            }
                          }}
                        >
                          📧 Contact Us
                        </button>
                      </div>
                    )}
                  </div>
            </div>
          </div>
      
      {/* Contact Us Button - Desktop Only */}
      {!isMobile && <ContactPopover />}
      
      {/* Urgent Cleanups Button - Desktop Only */}
      {!isMobile && (
        <div className="absolute top-16 right-6 z-20">
          <Button 
            className={`bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white border-0 px-8 py-[18px] rounded-full text-lg font-semibold shadow-lg transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5 ${showAnimations ? 'animate-bounce spin-360' : ''}`}
            onClick={() => setShowPriorityList(true)}
          >
            🚨 Urgent Cleanups
          </Button>
        </div>
      )}
      
      {/* Map Container */}
      <div className="h-full">
        <Map beaches={beaches} />
      </div>

      {/* Priority Beach Cleanup List */}
      {showPriorityList && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className={`bg-white rounded-2xl w-full max-w-2xl ${isMobile ? 'max-h-[80vh]' : 'max-h-[70vh]'} overflow-hidden`}>
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-bold text-gray-900">🚨 Urgent Cleanups Needed</h2>
              <button 
                onClick={() => setShowPriorityList(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            <div className={`p-4 overflow-y-auto ${isMobile ? 'max-h-[60vh]' : 'max-h-[50vh]'}`}>
              <p className="text-sm text-gray-600 mb-4">Beaches sorted by urgency (longest time since last cleanup):</p>
              <div className="space-y-3">
                {getPriorityBeaches().slice(0, 10).map((beach, index) => (
                  <div 
                    key={beach.name}
                    className="flex items-center justify-between p-3 rounded-lg border"
                    style={{
                      backgroundColor: index < 3 ? '#fef2f2' : index < 6 ? '#fffbeb' : '#f0f9ff',
                      borderColor: index < 3 ? '#fecaca' : index < 6 ? '#fed7aa' : '#bae6fd'
                    }}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">
                          {index < 3 ? '🔴' : index < 6 ? '🟠' : '🟡'}
                        </span>
                        <h3 className="font-semibold text-gray-900">{beach.name}</h3>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {beach.daysSinceCleanup === Infinity 
                          ? 'Never cleaned' 
                          : beach.daysSinceCleanup === 0 
                          ? 'Recently cleaned' 
                          : `${beach.daysSinceCleanup} days ago`
                        }
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setShowPriorityList(false);
                        // Find the beach marker and trigger click
                        const mapElement = document.getElementById('map');
                        if (mapElement) {
                          // Dispatch a custom event to trigger beach selection
                          const event = new CustomEvent('selectBeach', { 
                            detail: { beachName: beach.name } 
                          });
                          window.dispatchEvent(event);
                        }
                      }}
                      className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-3 py-1 rounded-full text-xs font-semibold"
                    >
                      View
                    </button>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800 text-center">
                  💡 <strong>Tip:</strong> Click "View" to see the beach on the map and register a cleanup!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}