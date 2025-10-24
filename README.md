# Beach Cleanup Aruba 🏖️

An interactive web application for tracking and mapping beach cleanups across Aruba. This project helps volunteers coordinate cleanup efforts and track the cleanliness status of beaches over time.

## 🌟 Features

- **Interactive Map**: Satellite view of Aruba with color-coded beach markers
- **Cleanup Tracking**: Add and track cleanup dates with cleanliness ratings
- **Real-time Data**: Firebase integration for persistent data storage
- **Responsive Design**: Works on desktop and mobile devices
- **User Location**: Shows your current location on the map

## 📁 Project Structure

```
beach-cleanup-aruba/
├── src/
│   ├── js/
│   │   ├── config.js          # Configuration constants
│   │   ├── utils.js           # Utility functions
│   │   ├── geolocation.js     # User location handling
│   │   ├── sidePanel.js       # Side panel management
│   │   ├── firebase-config.js # Firebase configuration
│   │   ├── beachData.js       # Beach data and locations
│   │   └── mapLogic.js        # Main map functionality
│   ├── css/
│   │   └── style.css          # All stylesheets
│   └── assets/
│       └── images/            # Beach photos and images
├── index.html                 # Main application page
├── blog.html                  # Mission/about page
├── 404.html                   # Error page
├── firebase.json              # Firebase hosting config
└── package.json              # Project metadata
```

## 🚀 Getting Started

### Prerequisites
- Python 3.x (for local development server)
- Modern web browser
- Internet connection (for Google Maps and Firebase)

### Local Development

1. **Clone or download the project**
2. **Start the development server:**
   ```bash
   python -m http.server 8000
   ```
3. **Open your browser and navigate to:**
   ```
   http://localhost:8000
   ```

### Using npm scripts (if Node.js is installed)
```bash
npm start
# or
npm run dev
```

## 🗺️ How to Use

1. **View the Map**: The main page shows Aruba with color-coded beach markers
   - 🟢 Green: Recently cleaned (within 45 days)
   - 🟠 Orange: Moderately clean (45-90 days)
   - 🔴 Red: Needs attention (90+ days)
   - 🔵 Blue: Your current location

2. **Add Cleanup Data**: Click on a beach marker to:
   - View beach information and photos
   - Add new cleanup dates
   - Rate beach cleanliness (1-10 scale)
   - Get directions to the beach

3. **Track Progress**: View past cleanups and see how beach conditions change over time

## 🛠️ Technical Details

### Technologies Used
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Maps**: Google Maps JavaScript API
- **Database**: Firebase Firestore
- **Hosting**: Firebase Hosting
- **Development**: Python HTTP Server

### Key Features
- **Modular Architecture**: Code organized into focused modules
- **Responsive Design**: Mobile-first approach with CSS Grid/Flexbox
- **Real-time Updates**: Firebase integration for live data
- **Progressive Enhancement**: Works without JavaScript for basic functionality

## 📱 Mobile Support

The application is fully responsive and optimized for mobile devices:
- Touch-friendly interface
- Optimized image loading
- Mobile-specific UI adjustments
- Geolocation support

## 🔧 Configuration

### Environment Variables
- Google Maps API key (configured in index.html)
- Firebase configuration (in src/js/firebase-config.js)

### Customization
- Beach data: Edit `src/js/beachData.js`
- Styling: Modify `src/css/style.css`
- Map settings: Update `src/js/config.js`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the package.json file for details.

## 📞 Contact

For questions or to add new beaches to the map:
- Email: tris2wolff@gmail.com
- Visit the "Contact Us" button on the main page

## 🙏 Acknowledgments

- Google Maps API for mapping functionality
- Firebase for data persistence
- All volunteers who contribute cleanup data
- The Aruba community for environmental awareness

---

**Help keep Aruba's beaches beautiful! 🏝️**
