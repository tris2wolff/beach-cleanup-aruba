"use client"

import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import HCaptcha from '@hcaptcha/react-hcaptcha';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { beaches } from '@/data/beaches';
import { useFirebaseCleanups } from '@/hooks/useFirebase';
import { CleanupData } from '@/lib/firebase';

interface BeachInfoSheetProps {
  beach: typeof beaches[0];
  isOpen: boolean;
  onClose: () => void;
}

export function BeachInfoSheet({ beach, isOpen, onClose }: BeachInfoSheetProps) {
  const [isMobile, setIsMobile] = React.useState(false);
  const [showCleanupForm, setShowCleanupForm] = useState(false);
  const [showPastCleanups, setShowPastCleanups] = useState(false);
  const [cleanupData, setCleanupData] = useState<CleanupData>({
    beach: beach.name,
    date: '',
    rating: 5,
    description: '',
    contributorName: '',
    photoUrl: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const captchaRef = useRef<HCaptcha>(null);

  // Use Firebase hook
  const { addCleanup, uploadImage, error: firebaseError } = useFirebaseCleanups();

  // Use actual beach cleanup data
  const pastCleanups = beach.cleanups ? beach.cleanups.map((cleanup, index) => ({
    id: index + 1,
    date: cleanup.date,
    cleanliness: cleanup.rating,
    description: cleanup.description || 'No description provided',
    contributorName: cleanup.contributorName || 'Anonymous',
    photoUrl: cleanup.photoUrl || '/images/sample-cleanup.jpg'
  })) : [];

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleGetDirections = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${beach.lat},${beach.lng}`;
    window.open(url, '_blank');
  };

  const handleAddCleanup = () => {
    setShowCleanupForm(true);
  };

  const handleSeePastCleanups = () => {
    setShowPastCleanups(!showPastCleanups);
    
    // Auto-scroll to show past cleanups section on mobile
    if (isMobile && !showPastCleanups) {
      setTimeout(() => {
        const pastCleanupsElement = document.querySelector('[data-past-cleanups]');
        if (pastCleanupsElement) {
          pastCleanupsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  const handleCleanupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate CAPTCHA
    if (!captchaToken) {
      alert('Please complete the "I am not a robot" verification.');
      return;
    }
    
    // Validate date - prevent future dates
    const selectedDate = new Date(cleanupData.date);
    const today = new Date();
    today.setHours(23, 59, 59, 999); // End of today
    
    if (selectedDate > today) {
      alert('Please select a date that is today or in the past. Future dates are not allowed.');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Upload image if provided
      let photoUrl = cleanupData.photoUrl;
      if (cleanupData.photoUrl && cleanupData.photoUrl.startsWith('data:')) {
        // Convert data URL to file and upload
        const response = await fetch(cleanupData.photoUrl);
        const blob = await response.blob();
        const file = new File([blob], 'cleanup-photo.jpg', { type: 'image/jpeg' });
        photoUrl = await uploadImage(file, beach.name);
      }

      // Add cleanup to Firebase
      await addCleanup({
        beach: beach.name,
        date: cleanupData.date,
        rating: cleanupData.rating,
        description: cleanupData.description,
        contributorName: cleanupData.contributorName,
        photoUrl: photoUrl
      });

      alert('Cleanup submitted successfully!');
      setShowCleanupForm(false);
      setCleanupData({
        beach: beach.name,
        date: '',
        rating: 5,
        description: '',
        contributorName: '',
        photoUrl: ''
      });
      // Reset CAPTCHA
      setCaptchaToken(null);
      captchaRef.current?.resetCaptcha();
    } catch (error) {
      console.error('Error submitting cleanup:', error);
      alert('Failed to submit cleanup. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseSheet = () => {
    setShowCleanupForm(false);
    setShowPastCleanups(false);
    setCleanupData({
      beach: beach.name,
      date: '',
      rating: 5,
      description: '',
      contributorName: '',
      photoUrl: ''
    });
    // Reset CAPTCHA
    setCaptchaToken(null);
    captchaRef.current?.resetCaptcha();
    onClose();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In real app, upload to Firebase Storage
      const reader = new FileReader();
      reader.onload = (event) => {
        setCleanupData(prev => ({
          ...prev,
          photoUrl: event.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const content = (
    <>
      <div className="space-y-4">
        {beach.image && (
          <div className="w-full h-48 overflow-hidden">
            <img 
              src={beach.image} 
              alt={beach.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <div className="space-y-2 px-4">
          <p className="text-sm text-gray-600">{beach.description}</p>
        </div>

        {!showCleanupForm ? (
          <div className="space-y-3 px-4 pb-6">
            <Button 
              onClick={handleAddCleanup}
              className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white border-0 shadow-lg"
            >
              🧹 Add Cleanup
            </Button>
            <Button 
              onClick={handleGetDirections}
              className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white border-0 shadow-lg"
            >
              🧭 Get Directions
            </Button>
            <Button 
              onClick={handleSeePastCleanups}
              className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white border-0 shadow-lg"
            >
              📊 See Past Cleanups
            </Button>
            
            {/* Most Recent Cleanup Info - Always visible */}
            {pastCleanups.length > 0 ? (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <h5 className="font-semibold text-blue-800 mb-2">📊 Most Recent Cleanup</h5>
                <div className="text-sm">
                  <p className="text-blue-700"><strong>Date:</strong> {pastCleanups[0].date}</p>
                  <p className="text-blue-700"><strong>Cleanliness:</strong> {pastCleanups[0].cleanliness}/10</p>
                  <p className="text-blue-600 text-xs mt-1">{pastCleanups[0].description}</p>
                </div>
              </div>
            ) : (
              <div className="mt-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                <h5 className="font-semibold text-orange-800 mb-2">🌟 No Cleanups Yet!</h5>
                <p className="text-orange-700 text-sm">Be the first to register a cleanup at this beach and help keep Aruba&apos;s shores pristine!</p>
              </div>
            )}
            
                {showPastCleanups && (
                  <div data-past-cleanups className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold mb-3">Past Cleanups</h4>
                    {pastCleanups.length > 0 ? (
                      <div className="space-y-3">
                        {pastCleanups.map((cleanup) => (
                          <div key={cleanup.id} className="border-b pb-2 last:border-b-0">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium text-sm">{cleanup.date}</p>
                                <p className="text-xs text-gray-600">Cleanliness: {cleanup.cleanliness}/10</p>
                                <p className="text-xs text-gray-500 mt-1">{cleanup.description}</p>
                                <p className="text-xs text-blue-600 mt-1">By: {cleanup.contributorName}</p>
                              </div>
                              {cleanup.photoUrl && (
                                <img 
                                  src={cleanup.photoUrl} 
                                  alt="Cleanup photo" 
                                  className="w-16 h-16 object-cover rounded"
                                />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-gray-500 text-sm mb-2">No cleanups have been registered yet.</p>
                        <p className="text-blue-600 text-sm font-medium">Be the first! 🌟</p>
                      </div>
                    )}
                  </div>
                )}
          </div>
        ) : (
          <div className="px-4 pb-4">
            <form onSubmit={handleCleanupSubmit} className="space-y-3">
                  <div>
                    <Label htmlFor="date" className="text-sm font-semibold">Cleanup Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={cleanupData.date}
                      onChange={(e) => setCleanupData(prev => ({ ...prev, date: e.target.value }))}
                      max={new Date().toISOString().split('T')[0]}
                      required
                      className="mt-1"
                      placeholder="Select cleanup date"
                      style={{
                        colorScheme: 'light',
                        backgroundColor: cleanupData.date ? 'white' : '#f9fafb',
                        color: cleanupData.date ? 'black' : '#6b7280',
                        ...(isMobile && {
                          fontSize: '16px', // Prevents zoom on iOS
                          padding: '12px',
                          borderRadius: '6px',
                          border: '1px solid #d1d5db'
                        })
                      }}
                    />
                    {!cleanupData.date && (
                      <p className="text-xs text-gray-500 mt-1">📅 Click to select the cleanup date</p>
                    )}
                  </div>
              
                  <div>
                    <Label htmlFor="rating" className="text-sm font-semibold">
                      Beach Cleanliness (1-10)
                    </Label>
                    <div className="mt-1 space-y-1">
                      <input
                        id="rating"
                        type="range"
                        min={1}
                        max={10}
                        value={cleanupData.rating}
                        onChange={(e) => setCleanupData(prev => ({ ...prev, rating: parseInt(e.target.value) }))}
                        className="w-full h-2 bg-gradient-to-r from-red-500 via-orange-500 to-green-500 rounded-lg appearance-none cursor-pointer"
                        style={{
                          background: `linear-gradient(to right, #ef4444 0%, #f97316 50%, #22c55e 100%)`
                        }}
                      />
                      <Input
                        type="number"
                        min={1}
                        max={10}
                        value={cleanupData.rating}
                        onChange={(e) => setCleanupData(prev => ({ ...prev, rating: parseInt(e.target.value) || 1 }))}
                        className="w-20 mx-auto text-center"
                      />
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">🗑️ 1 Dirty</span>
                        <span className="text-xs font-semibold">{cleanupData.rating}/10</span>
                        <span className="text-xs text-gray-600">🧽 10 Clean</span>
                      </div>
                    </div>
                  </div>
              
                  <div>
                    <Label htmlFor="description" className="text-sm font-semibold">Cleanup Description</Label>
                    <textarea
                      id="description"
                      value={cleanupData.description}
                      onChange={(e) => setCleanupData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe what you cleaned up... (Example: Excellent cleanup! Removed plastic bottles, fishing nets, and seaweed. Beach looks pristine.)"
                      className="w-full mt-1 p-2 border border-gray-300 rounded-md text-sm"
                      rows={2}
                    />
                  </div>
              
              <div>
                <Label htmlFor="name" className="text-sm font-semibold">Your Name (Optional)</Label>
                <Input
                  id="name"
                  type="text"
                  value={cleanupData.contributorName}
                  onChange={(e) => setCleanupData(prev => ({ ...prev, contributorName: e.target.value }))}
                  placeholder="Enter your name"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="photo" className="text-sm font-semibold">Beach Photo (Optional)</Label>
                <Input
                  id="photo"
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="mt-1"
                />
                {cleanupData.photoUrl && (
                  <img 
                    src={cleanupData.photoUrl} 
                    alt="Preview" 
                    className="mt-2 w-20 h-20 object-cover rounded"
                  />
                )}
              </div>
              
              {/* CAPTCHA */}
              <div className="pt-2">
                <div className="text-xs text-gray-600 mb-2">Please verify you&apos;re not a robot:</div>
                <HCaptcha
                  ref={captchaRef}
                  sitekey="10000000-ffff-ffff-ffff-000000000001"
                  onVerify={(token) => setCaptchaToken(token)}
                  onExpire={() => setCaptchaToken(null)}
                  onError={() => setCaptchaToken(null)}
                  theme="light"
                  size="normal"
                />
              </div>
              
                  <div className="flex space-x-2 pt-2 pb-2">
                    <Button 
                      type="button"
                      onClick={() => setShowCleanupForm(false)}
                      disabled={isSubmitting}
                      className="flex-1 bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 text-white border-0"
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white border-0"
                    >
                      {isSubmitting ? 'Saving...' : 'Save Cleanup'}
                    </Button>
                  </div>
            </form>
          </div>
        )}
      </div>
    </>
  );

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={handleCloseSheet}>
        <DrawerContent className="bg-white">
          <div className="h-[70vh] bg-white rounded-t-2xl flex flex-col">
            <div className="flex items-center justify-center p-4 relative flex-shrink-0">
              <DrawerTitle className="text-xl font-bold text-gray-900 text-center">{beach.name}</DrawerTitle>
              <button 
                onClick={handleCloseSheet}
                className="absolute right-4 top-0 text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-4 pb-20">
              {content}
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Sheet open={isOpen} onOpenChange={handleCloseSheet}>
      <SheetContent side="right" className="w-[400px] sm:w-[540px] bg-white border-0 shadow-2xl p-0 overflow-y-auto">
        <SheetHeader className="px-6 pt-6 pb-4">
          <SheetTitle className="text-2xl font-bold text-gray-900">{beach.name}</SheetTitle>
        </SheetHeader>
        <div className="py-0">
          {content}
        </div>
      </SheetContent>
    </Sheet>
  );
}
