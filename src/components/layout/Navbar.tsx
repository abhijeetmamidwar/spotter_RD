import React from 'react';
import { Plane, User, Menu, Globe, ChevronDown } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <nav className="navbar">
      <div className="container nav-content">
        <div className="logo">
          <div className="logo-icon-wrapper">
            <Plane className="logo-icon" size={24} />
          </div>
          <span>SkyBound</span>
        </div>
        
        <div className="nav-links">
          <a href="#" className="active">Explore</a>
          <a href="#">Flights</a>
          <a href="#">Hotels</a>
          <a href="#">Packages</a>
        </div>

        <div className="nav-actions">
          <button className="nav-util-btn desktop-only">
            <Globe size={18} />
            <span>EN</span>
            <ChevronDown size={14} />
          </button>
          
          <div className="divider desktop-only"></div>

          <button className="signin-btn desktop-only">
            <User size={18} />
            <span>Sign In</span>
          </button>
          
          <button 
            className="menu-btn" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <Menu size={20} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="mobile-menu">
          <a href="#" className="traveler-option active">Explore</a>
          <a href="#" className="traveler-option">Flights</a>
          <a href="#" className="traveler-option">Hotels</a>
          <a href="#" className="traveler-option">Packages</a>
          <div className="divider" style={{ width: '100%', height: '1px', margin: '0.5rem 0' }}></div>
          <button className="signin-btn" style={{ width: '100%', justifyContent: 'center' }}>
            <User size={18} />
            <span>Sign In</span>
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
