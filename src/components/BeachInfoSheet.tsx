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
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
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

  // Compress image to reduce file size
  const compressImage = async (blob: Blob): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions (max 800px width/height)
        const maxSize = 800;
        let { width, height } = img;
        
        if (width > height) {
          if (width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height);
        canvas.toBlob((compressedBlob) => {
          if (compressedBlob) {
            const file = new File([compressedBlob], 'cleanup-photo.jpg', { 
              type: 'image/jpeg',
              lastModified: Date.now()
            });
            resolve(file);
          } else {
            // Fallback to original blob
            const file = new File([blob], 'cleanup-photo.jpg', { type: 'image/jpeg' });
            resolve(file);
          }
        }, 'image/jpeg', 0.8); // 80% quality
      };
      
      img.src = URL.createObjectURL(blob);
    });
  };

  const handleCleanupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous validation errors
    setValidationErrors([]);
    
    // Validate form fields
    const errors: string[] = [];
    
    if (!cleanupData.date) {
      errors.push('Please select a date for the cleanup.');
    } else {
      // Validate date - prevent future dates
      const selectedDate = new Date(cleanupData.date);
      const today = new Date();
      today.setHours(23, 59, 59, 999); // End of today
      
      if (selectedDate > today) {
        errors.push('Please select a date that is today or in the past.');
      }
    }
    
    if (!cleanupData.contributorName.trim()) {
      errors.push('Please enter your name.');
    }
    
    if (!captchaToken) {
      errors.push('Please complete the "I\'m not a robot" verification.');
    }
    
    // If there are validation errors, show them and return
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Upload image if provided
      let photoUrl = cleanupData.photoUrl;
      if (cleanupData.photoUrl && cleanupData.photoUrl.startsWith('data:')) {
        try {
          // Convert data URL to file and upload
          const response = await fetch(cleanupData.photoUrl);
          const blob = await response.blob();
          
          // Compress image if it's too large
          const compressedFile = await compressImage(blob);
          photoUrl = await uploadImage(compressedFile, beach.name);
        } catch (uploadError) {
          console.error('Image upload failed:', uploadError);
          // If upload fails, don't include photoUrl
          photoUrl = '';
        }
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

      // Show success message and confetti
      triggerConfetti();
      setShowSuccessNotification(true);
      setTimeout(() => setShowSuccessNotification(false), 3000);
      
      // Auto-exit after showing celebration
      setTimeout(() => {
        setShowCleanupForm(false);
        setShowPastCleanups(false);
        handleCloseSheet(); // Use handleCloseSheet instead of onClose directly
      }, 2000); // Wait 2 seconds to show celebration, then exit
      
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
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setValidationErrors([`Failed to submit cleanup: ${errorMessage}. Please check your internet connection and try again.`]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const triggerConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const resetForm = () => {
    setCleanupData({
      beach: beach.name,
      date: '',
      rating: 5,
      description: '',
      contributorName: '',
      photoUrl: ''
    });
    setCaptchaToken(null);
    setValidationErrors([]);
    captchaRef.current?.resetCaptcha();
  };

  const handleCloseSheet = () => {
    setShowCleanupForm(false);
    setShowPastCleanups(false);
    resetForm();
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
              <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200 shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h5 className="font-bold text-blue-800 mb-3 flex items-center">
                      📊 <span className="ml-2">Most Recent Cleanup</span>
                    </h5>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <span className="text-blue-600 font-medium w-20">Date:</span>
                        <span className="text-blue-800">{pastCleanups[0].date}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-blue-600 font-medium w-20">Rating:</span>
                        <div className="flex items-center">
                          <span className="text-blue-800">{pastCleanups[0].cleanliness}/10</span>
                          <div className="ml-2 flex">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={i < Math.floor(pastCleanups[0].cleanliness/2) ? 'text-yellow-400' : 'text-gray-300'}>⭐</span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className="text-blue-600 font-medium w-20">By:</span>
                        <span className="text-blue-800">{pastCleanups[0].contributorName}</span>
                      </div>
                      {pastCleanups[0].description && (
                        <div className="mt-2">
                          <p className="text-blue-700 text-sm bg-blue-100 p-2 rounded-lg">{pastCleanups[0].description}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  {pastCleanups[0].photoUrl ? (
                    <div className="ml-4 flex-shrink-0">
                      <img 
                        src={pastCleanups[0].photoUrl} 
                        alt="Cleanup photo" 
                        className="w-16 h-16 object-cover rounded-lg shadow-sm border border-blue-200"
                      />
                    </div>
                  ) : (
                    <div className="ml-4 flex-shrink-0">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg shadow-sm border border-gray-200 flex items-center justify-center">
                        <span className="text-xs text-gray-500 text-center">No image uploaded</span>
                      </div>
                    </div>
                  )}
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
                              {cleanup.photoUrl ? (
                                <img 
                                  src={cleanup.photoUrl} 
                                  alt="Cleanup photo" 
                                  className="w-16 h-16 object-cover rounded"
                                />
                              ) : (
                                <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center">
                                  <span className="text-xs text-gray-500 text-center">No image</span>
                                </div>
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
              {/* Validation Errors */}
              {validationErrors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 sticky top-0 z-10">
                  <div className="flex items-center mb-2">
                    <span className="text-red-600 mr-2">⚠️</span>
                    <h4 className="font-semibold text-red-800">Please fix the following issues:</h4>
                  </div>
                  <ul className="list-disc list-inside space-y-1">
                    {validationErrors.map((error, index) => (
                      <li key={index} className="text-red-700 text-sm">{error}</li>
                    ))}
                  </ul>
                </div>
              )}
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
                      onClick={() => {
                        setShowCleanupForm(false);
                        resetForm();
                      }}
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
      <React.Fragment>
        {/* Confetti Animation */}
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-ping"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${1 + Math.random() * 2}s`,
                }}
              >
                <span className="text-2xl">
                  {['🎉', '✨', '🌟', '💫', '🎊'][Math.floor(Math.random() * 5)]}
                </span>
              </div>
            ))}
          </div>
        )}
        
        {/* Success Notification */}
        {showSuccessNotification && (
          <div className="fixed top-[180px] left-1/2 transform -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-bounce">
            <div className="flex items-center">
              <span className="text-xl mr-2">🎉</span>
              <span className="font-semibold">Cleanup saved successfully!</span>
            </div>
            <p className="text-sm mt-1">Thank you for helping keep Aruba&apos;s beaches clean!</p>
          </div>
        )}
        
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
              {/* Scroll indicator */}
              <div className="absolute bottom-2 left-2 text-gray-400 animate-bounce">
                <div className="flex flex-col items-center">
                  <span className="text-xs">Scroll down</span>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-4 pb-20">
              {content}
            </div>
          </div>
        </DrawerContent>
      </Drawer>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${1 + Math.random() * 2}s`,
              }}
            >
              <span className="text-2xl">
                {['🎉', '✨', '🌟', '💫', '🎊'][Math.floor(Math.random() * 5)]}
              </span>
            </div>
          ))}
        </div>
      )}
      
      {/* Success Notification */}
      {showSuccessNotification && (
        <div className="fixed top-[200px] left-1/2 transform -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-bounce">
          <div className="flex items-center">
            <span className="text-xl mr-2">🎉</span>
            <span className="font-semibold">Cleanup saved successfully!</span>
          </div>
          <p className="text-sm mt-1">Thank you for helping keep Aruba&apos;s beaches clean!</p>
        </div>
      )}
      
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
    </React.Fragment>
  );
}
