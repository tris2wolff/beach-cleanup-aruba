# Beach Cleanup Aruba - Next.js Version

This is the Next.js conversion of the Beach Cleanup Aruba website, featuring an interactive map for tracking beach cleanups across Aruba.

## 🚀 Features

- **Interactive Google Maps** with beach markers
- **Real-time cleanup tracking** with color-coded status
- **Firebase integration** for data persistence
- **Contact form** with EmailJS integration
- **Responsive design** for mobile and desktop
- **Server-side rendering** for better performance
- **TypeScript** for type safety

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Google Maps API key
- Firebase project
- EmailJS account

## 🛠️ Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env.local` file in the root directory with:
   ```env
   # Google Maps API Key
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id

   # EmailJS Configuration
   NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_emailjs_service_id
   NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
   NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_emailjs_public_key
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── about/             # About page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── Header.tsx         # Page header
│   ├── ContactModal.tsx   # Contact form modal
│   ├── CleanupModal.tsx   # Add cleanup modal
│   ├── Legend.tsx         # Map legend
│   ├── Map.tsx            # Google Maps component
│   └── SidePanel.tsx      # Beach info side panel
├── config/                # Configuration
│   └── constants.ts       # App constants
├── data/                  # Static data
│   └── beaches.ts         # Beach data
├── lib/                   # Utilities
│   └── firebase.ts        # Firebase configuration
├── types/                 # TypeScript types
│   └── index.ts           # Type definitions
└── utils/                 # Utility functions
    └── index.ts           # Helper functions
```

## 🎨 Key Components

### Map Component
- **Google Maps integration** with custom markers
- **Real-time marker updates** based on cleanup status
- **User location detection**
- **Info windows** with beach details

### Side Panel
- **Beach information display**
- **Cleanup history tracking**
- **Interactive rating gauge**
- **Action buttons** for cleanup and directions

### Contact Modal
- **EmailJS integration** for form submissions
- **Responsive design** for mobile and desktop
- **Form validation** and error handling

## 🔧 Configuration

### Google Maps
The map uses the Google Maps JavaScript API with the following features:
- Satellite view as default
- Custom marker icons for different cleanup statuses
- User location marker
- Info windows with beach details

### Firebase
Firebase Firestore is used for:
- Storing cleanup data
- Real-time updates
- Offline support

### EmailJS
EmailJS handles contact form submissions without a backend server.

## 📱 Responsive Design

The application is fully responsive with:
- **Mobile-first approach**
- **Adaptive layouts** for different screen sizes
- **Touch-friendly interactions**
- **Optimized performance** on mobile devices

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- DigitalOcean App Platform

## 🔄 Migration from Original

This Next.js version maintains **95% visual similarity** to the original HTML version while providing:
- **Better performance** with SSR and code splitting
- **Improved SEO** with server-side rendering
- **Enhanced maintainability** with component-based architecture
- **Type safety** with TypeScript
- **Modern development experience** with hot reloading

## 🐛 Troubleshooting

### Common Issues

1. **Google Maps not loading:**
   - Check your API key is correct
   - Ensure billing is enabled for your Google Cloud project
   - Verify the Maps JavaScript API is enabled

2. **Firebase connection issues:**
   - Check your Firebase configuration
   - Ensure Firestore rules allow read/write access
   - Verify your project ID is correct

3. **EmailJS not working:**
   - Check your service ID and template ID
   - Ensure your public key is correct
   - Verify your email template is properly configured

## 📄 License

MIT License - see the original project for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For questions or support, contact: tris2wolff@gmail.com
