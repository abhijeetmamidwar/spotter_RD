import React, { useState, useRef, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { AIRPORTS } from '../../services/mockData';
import { motion, AnimatePresence } from 'framer-motion';

interface AirportAutocompleteProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  excludeValue?: string;
}

const AirportAutocomplete: React.FC<AirportAutocompleteProps> = ({ label, value, onChange, placeholder, excludeValue }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState(value);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredAirports = AIRPORTS.filter(airport => {
    const displayValue = `${airport.city} (${airport.code})`;
    const matchesQuery = airport.city.toLowerCase().includes(query.toLowerCase()) ||
                        airport.code.toLowerCase().includes(query.toLowerCase()) ||
                        airport.name.toLowerCase().includes(query.toLowerCase());
    const isNotExcluded = displayValue !== excludeValue;
    return matchesQuery && isNotExcluded;
  }).slice(0, 6);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  const handleSelect = (airport: typeof AIRPORTS[0]) => {
    const displayValue = `${airport.city} (${airport.code})`;
    setQuery(displayValue);
    onChange(displayValue);
    setIsOpen(false);
  };

  return (
    <div className={`search-field autocomplete-container ${isOpen && query.length > 0 && filteredAirports.length > 0 ? 'is-open' : ''}`} ref={containerRef}>
      <label style={{ color: isOpen ? 'var(--primary)' : 'var(--text-muted)' }}>
        <MapPin size={16} style={{ color: isOpen ? 'var(--primary)' : 'var(--text-muted)' }} /> 
        {label}
      </label>
      <input 
        type="text" 
        value={query} 
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        placeholder={placeholder}
      />
      
      <AnimatePresence>
        {isOpen && query.length > 0 && filteredAirports.length > 0 && (
          <motion.div 
            className="autocomplete-dropdown glass-card"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
          >
            {filteredAirports.map((airport) => (
              <div 
                key={airport.code} 
                className="autocomplete-item"
                onClick={() => handleSelect(airport)}
              >
                <div className="airport-row">
                  <span className="city">{airport.city}</span>
                  <span className="code">({airport.code})</span>
                  <span className="separator">•</span>
                  <span className="name">{airport.name}</span>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AirportAutocomplete;
