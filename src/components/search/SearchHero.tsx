import React, { useState } from 'react';
import { Search, ArrowLeftRight } from 'lucide-react';
import DatePicker from './DatePicker';
import { format } from 'date-fns';
import AirportAutocomplete from './AirportAutocomplete';
import TravelerPicker from './TravelerPicker';

interface SearchHeroProps {
  onSearch: (params: any) => void;
}

const SearchHero: React.FC<SearchHeroProps> = ({ onSearch }) => {
  const [origin, setOrigin] = useState('Mumbai (BOM)');
  const [destination, setDestination] = useState('Dubai (DXB)');
  const [date, setDate] = useState(new Date(2026, 0, 20));
  const [passengers, setPassengers] = useState(1);

  const handleSwap = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  const handleSearch = () => {
    onSearch({ 
      origin, 
      destination, 
      date: format(date, 'yyyy-MM-dd'), 
      passengers 
    });
  };

  return (
    <section className="search-hero">
      <div className="container">
        <div className="hero-content animate-fade-in">
          <h1>Where to next?</h1>
          <p>Explore the world with SkyBound's premium flight search.</p>
          
          <div className="search-container glass-card">
            <div className="search-grid">
              <div className="airport-fields-group">
                <AirportAutocomplete 
                  label="From"
                  value={origin}
                  onChange={setOrigin}
                  excludeValue={destination}
                  placeholder="Origin city"
                />
                
                <button className="swap-button" onClick={handleSwap} aria-label="Swap origin and destination">
                  <ArrowLeftRight size={18} />
                </button>

                <AirportAutocomplete 
                  label="To"
                  value={destination}
                  onChange={setDestination}
                  excludeValue={origin}
                  placeholder="Destination city"
                />
              </div>
              
              <DatePicker 
                selectedDate={date} 
                onChange={setDate} 
              />
              
              <TravelerPicker 
                value={passengers} 
                onChange={setPassengers} 
              />
            </div>
            
            <button className="search-btn" onClick={handleSearch}>
              <Search size={20} />
              <span>Search Flights</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchHero;
