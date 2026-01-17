import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ArrowUpDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SortDropdownProps {
  value: 'cheapest' | 'fastest';
  onChange: (value: 'cheapest' | 'fastest') => void;
}

const SortDropdown: React.FC<SortDropdownProps> = ({ value, onChange }) => {
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

  const options = [
    { id: 'cheapest', label: 'Cheapest' },
    { id: 'fastest', label: 'Fastest' }
  ] as const;

  return (
    <div className="sort-dropdown-container" ref={containerRef}>
      <div 
        className={`sort-trigger ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="sort-content">
          <div className="sort-label-group">
            <ArrowUpDown size={14} className="sort-icon" />
            <span>Sort by</span>
          </div>
          <div className="sort-value-group">
            <span className="current-value">{value.charAt(0).toUpperCase() + value.slice(1)}</span>
            <ChevronDown size={14} className={`chevron ${isOpen ? 'open' : ''}`} />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="sort-menu glass-card"
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {options.map((option) => (
              <div 
                key={option.id} 
                className={`sort-option ${value === option.id ? 'active' : ''}`}
                onClick={() => {
                  onChange(option.id);
                  setIsOpen(false);
                }}
              >
                <span>{option.label}</span>
                {value === option.id && (
                  <motion.div 
                    layoutId="active-dot"
                    className="active-dot" 
                  />
                )}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SortDropdown;
