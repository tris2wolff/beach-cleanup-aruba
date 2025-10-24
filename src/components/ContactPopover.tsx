'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function ContactPopover() {
  const [showAnimations, setShowAnimations] = useState(true);

  useEffect(() => {
    // Stop animations after 2 seconds
    setTimeout(() => {
      setShowAnimations(false);
    }, 2000);
  }, []);

  return (
    <Popover>
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes spin-360 {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .spin-360 {
            animation: spin-360 0.8s ease-in-out;
          }
        `
      }} />
          <PopoverTrigger asChild>
            <Button 
              className={`absolute top-16 left-6 z-20 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white border-0 px-8 py-4 rounded-full text-lg font-semibold shadow-lg transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5 ${showAnimations ? 'animate-bounce spin-360' : ''}`}
            >
              📧 Contact Us
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-96 h-72 border-0 shadow-2xl" side="bottom" align="start" sideOffset={10}>
        <div className="grid gap-4">
          <div className="space-y-2 text-center bg-white p-4 rounded-lg">
            <h4 className="text-xl font-bold leading-none">Get in Touch</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Have questions about beach cleanups or want to report an issue? We&apos;d love to hear from you!
            </p>
          </div>
          
          
          <div className="grid gap-3">
            <div className="grid gap-2">
              <Label htmlFor="reason" className="text-sm font-semibold bg-gradient-to-r from-cyan-400 to-blue-500 text-white px-2 py-1 rounded">Reason for Contact</Label>
              <select
                id="reason"
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">Select a reason...</option>
                <option value="beach-cleanup">Report Beach Cleanup</option>
                <option value="report-issue">Report Beach Issue</option>
                <option value="volunteer">Volunteer Information</option>
                <option value="partnership">Partnership Inquiry</option>
                <option value="general">General Question</option>
                <option value="feedback">Website Feedback</option>
              </select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-sm font-semibold bg-gradient-to-r from-cyan-400 to-blue-500 text-white px-2 py-1 rounded">Your Name</Label>
              <Input
                id="name"
                placeholder="Enter your full name"
                className="h-9"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-sm font-semibold bg-gradient-to-r from-cyan-400 to-blue-500 text-white px-2 py-1 rounded">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                className="h-9"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="message" className="text-sm font-semibold bg-gradient-to-r from-cyan-400 to-blue-500 text-white px-2 py-1 rounded">Message</Label>
              <textarea
                id="message"
                placeholder="Tell us more about your inquiry..."
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                rows={3}
              />
            </div>
            
            <Button className="w-full h-10 bg-gradient-to-r from-teal-400 to-teal-500 hover:from-teal-500 hover:to-teal-600 text-white border-0 text-sm font-semibold">
              Send Message
            </Button>
          </div>
          
        </div>
      </PopoverContent>
    </Popover>
  );
}
