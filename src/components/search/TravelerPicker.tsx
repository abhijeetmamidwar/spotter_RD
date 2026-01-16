import React, { useState, useRef, useEffect } from 'react';
import { Users, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TravelerPickerProps {
  value: number;
  onChange: (value: number) => void;
}

const TravelerPicker: React.FC<TravelerPickerProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const options = [1, 2, 3, 4, 5];

  return (
    <div 
      className={`search-field traveler-picker ${isOpen ? 'is-open' : ''}`} 
      ref={containerRef} 
      onClick={() => setIsOpen(!isOpen)}
    >
      <label style={{ color: isOpen ? 'var(--primary)' : 'var(--text-muted)' }}>
        <Users size={16} style={{ color: isOpen ? 'var(--primary)' : 'var(--text-muted)' }} /> 
        Travelers
      </label>
      <div className="picker-value">
        <span>{value} Traveler{value > 1 ? 's' : ''}</span>
        <ChevronDown size={16} className={`chevron ${isOpen ? 'open' : ''}`} />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="traveler-dropdown glass-card"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
          >
            {options.map((num) => (
              <div 
                key={num} 
                className={`traveler-option ${value === num ? 'active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(num);
                  setIsOpen(false);
                }}
              >
                {num} Traveler{num > 1 ? 's' : ''}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TravelerPicker;
