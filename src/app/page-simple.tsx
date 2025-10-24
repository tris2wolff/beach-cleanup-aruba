import dynamic from 'next/dynamic';
import { beaches } from '@/data/beaches';
import { ContactPopover } from '@/components/ContactPopover';

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
  return (
    <main className="relative h-screen overflow-hidden">
      {/* Desktop Header */}
      <div className="absolute top-0 left-0 right-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-center mb-2">
            <span className="text-3xl mr-3">🌊</span>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-600 bg-clip-text text-transparent drop-shadow-lg">Aruba Clean Beaches</h1>
          </div>
          <p className="text-sm text-white drop-shadow-md text-center mb-1">Help clean our beaches and care for our environment</p>
          <p className="text-xs text-white drop-shadow-md text-center mb-2">Click any marker to see beach details</p>
          <div className="text-center">
            <button 
              className="bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5"
              onClick={() => window.location.href = '/about'}
            >
              🌊 Learn More About Us
            </button>
          </div>
        </div>
      </div>
      
      {/* Contact Us Button */}
      <ContactPopover />
      
      {/* Map Container */}
      <div className="h-full">
        <Map beaches={beaches} />
      </div>
    </main>
  );
}
