import React from 'react';
import { TrendingUp, ShieldCheck, Globe, Zap } from 'lucide-react';

const DESTINATIONS = [
  {
    name: 'Paris, France',
    price: 549,
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80', // Fallback if generated not available
    tag: 'Romantic'
  },
  {
    name: 'Tokyo, Japan',
    price: 820,
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80',
    tag: 'Vibrant'
  },
  {
    name: 'Maldives',
    price: 1200,
    image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80',
    tag: 'Relaxing'
  }
];

const FEATURES = [
  {
    icon: <TrendingUp size={24} />,
    title: 'Live Price Trends',
    desc: 'Track real-time price fluctuations and book at the perfect moment.'
  },
  {
    icon: <ShieldCheck size={24} />,
    title: 'Secure Booking',
    desc: 'Your data and transactions are protected by industry-leading security.'
  },
  {
    icon: <Zap size={24} />,
    title: 'Instant Results',
    desc: 'Get the fastest flight comparisons from over 500+ airlines worldwide.'
  },
  {
    icon: <Globe size={24} />,
    title: 'Global Reach',
    desc: 'Find flights to even the most remote destinations across the globe.'
  }
];

const LandingContent: React.FC = () => {
  return (
    <div className="landing-content animate-fade-in">
      <section className="destinations-section">
        <div className="container">
          <div className="section-header">
            <h2>Popular Destinations</h2>
            <p>Explore the most sought-after places on Earth</p>
          </div>
          
          <div className="destinations-grid">
            {DESTINATIONS.map((dest, i) => (
              <div key={i} className="dest-card glass-card">
                <div className="dest-image">
                  <img src={dest.image} alt={dest.name} />
                  <span className="dest-tag">{dest.tag}</span>
                </div>
                <div className="dest-info">
                  <h3>{dest.name}</h3>
                  <div className="dest-price">
                    <span>Starting from</span>
                    <strong>${dest.price}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="container">
          <div className="features-grid">
            {FEATURES.map((feature, i) => (
              <div key={i} className="feature-item">
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingContent;
