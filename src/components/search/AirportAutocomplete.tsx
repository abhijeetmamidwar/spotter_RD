import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Loader2 } from 'lucide-react';
import { AIRPORTS } from '../../services/mockData';
import { searchLocations } from '../../services/amadeusService';
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
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initial load of static data
  useEffect(() => {
    const sortedAirports = [...AIRPORTS].sort((a, b) => a.city.localeCompare(b.city));
    setResults(sortedAirports);
  }, []);

  // Handle live search
  useEffect(() => {
    const fetchLocations = async () => {
      // If query matches current value (no new typing) or is empty, show default static list
      if (!query || query === value) {
        const sortedAirports = [...AIRPORTS].sort((a, b) => a.city.localeCompare(b.city));
        setResults(sortedAirports);
        return;
      }

      // If query is short, filter static list locally
      if (query.length < 2) {
        const localMatches = AIRPORTS.filter(a => 
          a.city.toLowerCase().includes(query.toLowerCase()) || 
          a.code.toLowerCase().includes(query.toLowerCase())
        );
        setResults(localMatches);
        return;
      }

      setIsLoading(true);
      try {
        const apiResults = await searchLocations(query);
        // Merge API results with local matches if API returns nothing (fallback)
        if (apiResults.length === 0) {
           const localMatches = AIRPORTS.filter(a => 
            a.city.toLowerCase().includes(query.toLowerCase()) || 
            a.code.toLowerCase().includes(query.toLowerCase())
          );
          setResults(localMatches);
        } else {
          setResults(apiResults);
        }
      } catch (error) {
        console.error("Failed to fetch locations", error);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchLocations, 300);
    return () => clearTimeout(debounceTimer);
  }, [query, value]);

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

  const handleSelect = (airport: any) => {
    const displayValue = `${airport.city} (${airport.code})`;
    setQuery(displayValue);
    onChange(displayValue);
    setIsOpen(false);
  };

  const filteredResults = results.filter(airport => {
    const displayValue = `${airport.city} (${airport.code})`;
    return displayValue !== excludeValue;
  }).slice(0, 10);

  return (
    <div className={`search-field autocomplete-container ${isOpen && filteredResults.length > 0 ? 'is-open' : ''}`} ref={containerRef}>
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
        {isOpen && (filteredResults.length > 0 || isLoading) && (
          <motion.div 
            className="autocomplete-dropdown glass-card"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
          >
            {isLoading ? (
              <div className="loading-item">
                <Loader2 size={18} className="animate-spin" />
                <span>Searching...</span>
              </div>
            ) : (
              filteredResults.map((airport) => (
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
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AirportAutocomplete;
