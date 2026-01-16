import React from 'react';
import { SlidersHorizontal, ChevronDown } from 'lucide-react';

interface FilterSidebarProps {
  filters: {
    maxPrice: number;
    stops: number | null;
    airlines: string[];
  };
  setFilters: (filters: any) => void;
  availableAirlines: string[];
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ filters, setFilters, availableAirlines }) => {
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, maxPrice: Number(e.target.value) });
  };

  const handleStopChange = (stops: number | null) => {
    setFilters({ ...filters, stops });
  };

  const handleAirlineToggle = (airline: string) => {
    const newAirlines = filters.airlines.includes(airline)
      ? filters.airlines.filter(a => a !== airline)
      : [...filters.airlines, airline];
    setFilters({ ...filters, airlines: newAirlines });
  };

  return (
    <aside className="filter-sidebar glass-card">
      <div className="filter-header">
        <SlidersHorizontal size={18} />
        <span>Filters</span>
      </div>
      
      <div className="filter-section">
        <div className="section-title">
          <span>Stops</span>
          <ChevronDown size={14} />
        </div>
        <div className="filter-options">
          <button 
            className={`filter-chip ${filters.stops === null ? 'active' : ''}`}
            onClick={() => handleStopChange(null)}
          >
            Any
          </button>
          <button 
            className={`filter-chip ${filters.stops === 0 ? 'active' : ''}`}
            onClick={() => handleStopChange(0)}
          >
            Non-stop
          </button>
          <button 
            className={`filter-chip ${filters.stops === 1 ? 'active' : ''}`}
            onClick={() => handleStopChange(1)}
          >
            1 Stop
          </button>
        </div>
      </div>
      
      <div className="filter-section">
        <div className="section-title">
          <span>Max Price</span>
          <span className="value">${filters.maxPrice}</span>
        </div>
        <input 
          type="range" 
          min="200" 
          max="1000" 
          step="50"
          value={filters.maxPrice}
          onChange={handlePriceChange}
          className="price-range"
        />
      </div>
      
      <div className="filter-section">
        <div className="section-title">
          <span>Airlines</span>
          <ChevronDown size={14} />
        </div>
        <div className="airline-list">
          {availableAirlines.map(airline => (
            <label key={airline} className="airline-item">
              <input 
                type="checkbox" 
                checked={filters.airlines.includes(airline)}
                onChange={() => handleAirlineToggle(airline)}
              />
              <span>{airline}</span>
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default FilterSidebar;
