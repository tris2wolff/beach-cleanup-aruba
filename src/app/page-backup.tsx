import { ContactPopover } from '@/components/ContactPopover';

export default function HomePage() {
  return (
    <main className="relative h-screen overflow-hidden bg-gradient-to-br from-blue-100 to-cyan-100">
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
      
      {/* Map Container - Temporarily disabled */}
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🗺️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Map Loading...</h2>
          <p className="text-gray-600">The interactive map will be available soon!</p>
        </div>
      </div>
    </main>
  );
}
