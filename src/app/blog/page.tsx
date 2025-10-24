import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Mission – Beach Cleanup Aruba',
  description: 'Learn about our mission to keep Aruba\'s coastlines beautiful through community-driven beach cleanups and real-time tracking.',
};

export default function BlogPage() {
  return (
    <div className="mission-container">
      <Link href="/" className="back-btn">
        ← Back to Map
      </Link>
      
      <h1>Our Mission</h1>
      
      <div className="mission-content">
        <div className="mission-section">
          <h2>🌊 Keeping Aruba&apos;s Coastlines Beautiful</h2>
          <p>
            Aruba&apos;s pristine beaches are one of our island&apos;s greatest treasures. However, 
            marine debris and litter continue to threaten these natural wonders. Our mission 
            is to create a community-driven platform that makes it easy for locals and 
            visitors to track, report, and participate in beach cleanup efforts across the island.
          </p>
        </div>

        <div className="mission-section">
          <h2>🗺️ Real-Time Beach Status Tracking</h2>
          <p>
            Our interactive map shows the current status of beaches across Aruba, helping you 
            identify which areas need the most attention. Green markers indicate recently 
            cleaned beaches, orange shows moderate attention needed, and red indicates areas 
            that urgently need cleanup efforts.
          </p>
        </div>

        <div className="mission-section">
          <h2>🤝 Community-Powered Solutions</h2>
          <p>
            We believe that keeping Aruba clean is everyone&apos;s responsibility. Our platform 
            empowers individuals, families, schools, and organizations to make a real difference 
            in preserving our island&apos;s natural beauty.
          </p>
        </div>

        <div className="mission-section">
          <h2>📊 Data-Driven Impact</h2>
          <p>
            By tracking cleanup activities and beach conditions, we&apos;re building a comprehensive 
            database that helps us understand patterns, identify problem areas, and measure 
            the collective impact of our community&apos;s efforts.
          </p>
        </div>

        <div className="cta-section">
          <Link href="/" className="contact-btn">
            Explore the Map
          </Link>
          <a href="mailto:tris2wolff@gmail.com" className="contact-btn secondary">
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
}
