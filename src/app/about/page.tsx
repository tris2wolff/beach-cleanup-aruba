'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFirebaseCleanups } from '@/hooks/useFirebase';

export default function AboutPage() {
  const { cleanups } = useFirebaseCleanups();
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  // Calculate cleanup statistics
  const totalCleanups = cleanups.length;
  const uniqueContributors = new Set(cleanups.map(c => c.contributorName).filter(Boolean)).size;
  
  // Calculate top contributors
  const contributorStats = cleanups.reduce((acc, cleanup) => {
    if (cleanup.contributorName) {
      acc[cleanup.contributorName] = (acc[cleanup.contributorName] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);
  
  const topContributors = Object.entries(contributorStats)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Using EmailJS to send emails
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: contactForm.name,
          email: contactForm.email,
          subject: contactForm.subject,
          message: contactForm.message,
        }),
      });

      if (response.ok) {
        alert('Thank you for your message! We\'ll get back to you soon.');
        setContactForm({ name: '', email: '', subject: '', message: '' });
      } else {
        throw new Error('Failed to send email');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Sorry, there was an error sending your message. Please try again later.');
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100">
      {/* Header */}
      <div className="bg-white shadow-lg">
        <div className="w-full px-6 py-2 md:py-2" style={{ paddingTop: '20px', paddingBottom: '20px' }}>
          {/* Desktop Layout with Button and Title Side by Side */}
          <div className="hidden md:flex items-center justify-between">
            <Button 
              onClick={() => window.location.href = '/'}
              className="bg-gradient-to-r from-blue-400 to-cyan-500 hover:from-blue-500 hover:to-cyan-600 text-white border-0 px-4 py-2 text-sm"
            >
              🗺️ Back to Map
            </Button>
            
            <div className="flex flex-col items-center">
              <div className="flex items-center mb-2">
                <span className="text-5xl mr-2">🌊</span>
                <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-600 bg-clip-text text-transparent">
                  Aruba Clean
                </h1>
                <span className="text-5xl ml-2">🌊</span>
              </div>
              <h2 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-600 bg-clip-text text-transparent">
                Beaches
              </h2>
            </div>
            
            {/* Empty div to balance the layout */}
            <div className="w-24"></div>
          </div>
          
          {/* Mobile Layout - Centered Title */}
          <div className="md:hidden flex items-center justify-center">
            <div className="flex flex-col items-center">
              <div className="flex items-center mb-2">
                <span className="text-3xl mr-2">🌊</span>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-600 bg-clip-text text-transparent">
                  Aruba Clean
                </h1>
                <span className="text-3xl ml-2">🌊</span>
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-600 bg-clip-text text-transparent">
                Beaches
              </h2>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full px-6 py-12">
        {/* Video Section */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="aspect-video w-full bg-black">
            <iframe 
              width="100%" 
              height="100%" 
              src="https://player.cloudinary.com/embed/?cloud_name=djwmymkoc&public_id=arubacleanbeaches_1_kjj0pr&profile=cld-default"
              title="Aruba Clean Beaches Video"
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>
          <div className="p-4 text-center">
            <div className="md:hidden">
              <Button 
                onClick={() => window.location.href = '/'}
                className="bg-gradient-to-r from-blue-400 to-cyan-500 hover:from-blue-500 hover:to-cyan-600 text-white border-0 px-4 py-2 text-sm"
              >
                🗺️ Back to Map
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Our Mission</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            At Aruba Clean Beaches, we are passionate about preserving the natural beauty of Aruba&apos;s coastline. 
            Our mission is to create a community-driven platform that empowers locals and visitors to actively 
            participate in beach cleanup efforts while tracking the health and cleanliness of our precious beaches.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            We believe that every small action counts. By providing an interactive map showing beach conditions 
            and organizing cleanup events, we&apos;re building a sustainable future for Aruba&apos;s marine ecosystem.
          </p>
        </div>

        {/* Cleanup Leaderboard */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">🏆 Beach Cleanup Champions</h3>
          {topContributors.length > 0 ? (
            <div className="space-y-3">
              {topContributors.map(([name, count], i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">{i+1}</div>
                    <div className="font-semibold text-gray-800">{name}</div>
                  </div>
                  <div className="text-sm text-blue-700 font-semibold">{count} beaches cleaned</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 text-lg mb-2">No cleanup champions yet!</p>
              <p className="text-blue-600 font-medium">Be the first to register a cleanup and become a champion! 🌟</p>
            </div>
          )}
        </div>

        {/* Upcoming Events Placeholder */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">📅 Upcoming Events</h3>
          <p className="text-gray-700 mb-4">No events scheduled yet. Contact us to upload your cleanup event!</p>
          <Button 
            onClick={() => {
              const contactSection = document.getElementById('contact-section');
              contactSection?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white border-0"
          >
            📧 Contact Us
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              🧹 <span className="ml-2">Cleanup Tracking</span>
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Our interactive map shows real-time beach conditions with color-coded markers:
            </p>
            <ul className="mt-4 space-y-2 text-gray-700">
              <li className="flex items-center">
                <span className="w-4 h-4 bg-green-500 rounded-full mr-3"></span>
                <strong>Green:</strong> Recently cleaned (less than 45 days)
              </li>
              <li className="flex items-center">
                <span className="w-4 h-4 bg-orange-400 rounded-full mr-3"></span>
                <strong>Orange:</strong> Moderate condition (45-90 days)
              </li>
              <li className="flex items-center">
                <span className="w-4 h-4 bg-red-500 rounded-full mr-3"></span>
                <strong>Red:</strong> Needs urgent cleanup (90+ days)
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              🌊 <span className="ml-2">Community Impact</span>
            </h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Since our launch, our community has made a significant impact:
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">21</div>
                <div className="text-sm text-gray-600">Beaches Monitored</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{totalCleanups}</div>
                <div className="text-sm text-gray-600">Cleanups Registered</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">How You Can Help</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl">
              <div className="text-4xl mb-4">📍</div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Report Cleanups</h4>
              <p className="text-gray-700 text-sm">
                Click on any beach marker to report your cleanup activities and help keep our data current.
              </p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
              <div className="text-4xl mb-4">🤝</div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Join Events</h4>
              <p className="text-gray-700 text-sm">
                Participate in organized cleanup events and connect with like-minded environmental advocates.
              </p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl">
              <div className="text-4xl mb-4">📢</div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Spread Awareness</h4>
              <p className="text-gray-700 text-sm">
                Share our platform with friends and family to grow our community of beach protectors.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Us Section */}
        <div id="contact-section" className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Get in Touch</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p className="text-lg text-gray-700 mb-4">
                Have questions about beach cleanups or want to report an issue? We&apos;d love to hear from you!
              </p>
              <div className="bg-gradient-to-r from-slate-50 to-slate-100 p-4 rounded-lg">
                <p className="text-lg font-medium text-slate-700">📧 Contact Form</p>
                <p className="text-sm text-gray-600 mt-1">Fill out the form to get in touch with us</p>
              </div>
            </div>
            
            <div>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="contact-name" className="text-sm font-semibold">Your Name</Label>
                  <Input
                    id="contact-name"
                    type="text"
                    value={contactForm.name}
                    onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter your name"
                    required
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="contact-email" className="text-sm font-semibold">Email Address</Label>
                  <Input
                    id="contact-email"
                    type="email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="your.email@example.com"
                    required
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="contact-subject" className="text-sm font-semibold">Subject/Reason</Label>
                  <select
                    id="contact-subject"
                    value={contactForm.subject}
                    onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
                    required
                    className="w-full mt-1 p-3 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="">Select a reason...</option>
                    <option value="add-cleanup-event">Add Cleanup Event</option>
                    <option value="suggest-beach-marker">Suggest a Beach Marker</option>
                    <option value="partnership">Want to Partner</option>
                    <option value="general-question">General Question</option>
                    <option value="report-issue">Report an Issue</option>
                    <option value="volunteer">Volunteer Information</option>
                    <option value="feedback">Website Feedback</option>
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="contact-message" className="text-sm font-semibold">Message</Label>
                  <textarea
                    id="contact-message"
                    value={contactForm.message}
                    onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Tell us how we can help..."
                    required
                    className="w-full mt-1 p-3 border border-gray-300 rounded-md text-sm"
                    rows={4}
                  />
                </div>
                
                <Button 
                  type="submit"
                  className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white border-0"
                >
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl shadow-xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">Ready to Make a Difference?</h3>
          <p className="text-lg mb-6 opacity-90">
            Join our community of beach protectors and help keep Aruba&apos;s coastline pristine for future generations.
          </p>
          <Button 
            onClick={() => window.location.href = '/'}
            className="bg-white text-blue-600 hover:bg-gray-100 border-0 px-8 py-3 text-lg font-semibold"
          >
            🗺️ Explore Our Beach Map
          </Button>
        </div>
      </div>
    </div>
  );
}