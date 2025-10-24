import { MapConfig, MarkerColors, MarkerIcons, GeolocationOptions } from '@/types';

export const MAP_CONFIG: MapConfig = {
  center: { lat: 12.57, lng: -70.01 },
  zoom: 13,
  mapTypeId: 'satellite',
  gestureHandling: 'greedy',
  fullscreenControl: false,
  mapId: 'DEMO_MAP_ID' // Required for Advanced Markers
};
export const MARKER_ICONS: MarkerIcons = {
  GREEN: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
  ORANGE: 'http://maps.google.com/mapfiles/ms/icons/orange-dot.png',
  RED: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
  BLUE: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
};

export const GEOLOCATION_OPTIONS: GeolocationOptions = {
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 0
};

export const FIREBASE_CONFIG = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBVRzM_jmRlASnURwvQp26YgAry_uvbvmk",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "beach-cleanup-aruba.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "beach-cleanup-aruba",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "beach-cleanup-aruba.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "804809578032",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:804809578032:web:23bc10abe1c703075d7ff5",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-5QBVFJWX39"
};

export const EMAILJS_CONFIG = {
  serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 'service_xnjk5rv',
  templateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || 'template_ggv25ya',
  publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || 'JXNXyszWHScBiAhVt'
};
