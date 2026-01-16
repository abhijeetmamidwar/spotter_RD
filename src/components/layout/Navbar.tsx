import React from 'react';
import { Plane, User, Menu, Globe, ChevronDown } from 'lucide-react';

const Navbar: React.FC = () => {
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
          <button className="nav-util-btn">
            <Globe size={18} />
            <span>EN</span>
            <ChevronDown size={14} />
          </button>
          
          <div className="divider"></div>

          <button className="signin-btn">
            <User size={18} />
            <span>Sign In</span>
          </button>
          
          <button className="menu-btn">
            <Menu size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
