export interface Beach {
  name: string;
  lat: number;
  lng: number;
  description: string;
  cleanups: Cleanup[];
  image: string;
}

export interface Cleanup {
  date: string;
  rating: number;
  photoUrl?: string;
  description?: string;
  contributorName?: string; // optional, only if consent given
  timestamp?: Date;
  cleanlinessRating?: number; // 1-10 rating of how clean the beach is now
  cleanupDescription?: string; // description of the cleanup status
}

export interface MapConfig {
  center: { lat: number; lng: number };
  zoom: number;
  mapTypeId: string;
  gestureHandling: string;
  fullscreenControl: boolean;
  mapId?: string;
}

export interface MarkerColors {
  RECENT: number;
  MODERATE: number;
  OLD: number;
}

export interface MarkerIcons {
  GREEN: string;
  ORANGE: string;
  RED: string;
  BLUE: string;
}

export interface GeolocationOptions {
  enableHighAccuracy: boolean;
  timeout: number;
  maximumAge: number;
}

export interface ContactFormData {
  name: string;
  email: string;
  inquiry_type: string;
  message: string;
}

export interface Event {
  id: string;
  title: string;
  date: Date;
  location: string;
  description: string;
  organizer: string;
  contactEmail: string;
}

export interface LeaderboardEntry {
  name: string;
  cleanupCount: number;
  rank: number;
}
