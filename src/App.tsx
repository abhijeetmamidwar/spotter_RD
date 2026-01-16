import React, { useState, useMemo, useEffect } from 'react';
import Navbar from './components/layout/Navbar';
import SearchHero from './components/search/SearchHero';
import FilterSidebar from './components/filters/FilterSidebar';
import FlightCard from './components/results/FlightCard';
import PriceGraph from './components/results/PriceGraph';
import { mockFlights, getPriceTrends } from './services/mockData';
import type { Flight, FilterParams } from './types/flight';

import LandingContent from './components/layout/LandingContent';

const App: React.FC = () => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  
  const [filters, setFilters] = useState<FilterParams>({
    maxPrice: 1000,
    stops: null,
    airlines: [],
  });

  const [priceTrends, setPriceTrends] = useState(getPriceTrends());

  const handleSearch = (_params: any) => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setFlights(mockFlights);
      setLoading(false);
      setSearched(true);
      setPriceTrends(getPriceTrends());
    }, 800);
  };

  const filteredFlights = useMemo(() => {
    return flights.filter(flight => {
      const matchesPrice = flight.price <= filters.maxPrice;
      const matchesStops = filters.stops === null || flight.stops === filters.stops;
      const matchesAirline = filters.airlines.length === 0 || filters.airlines.includes(flight.airline);
      return matchesPrice && matchesStops && matchesAirline;
    });
  }, [flights, filters]);

  const availableAirlines = useMemo(() => {
    const airlines = new Set(flights.map(f => f.airline));
    return Array.from(airlines);
  }, [flights]);

  // Update price trends based on filters (simulated)
  useEffect(() => {
    if (searched) {
      setPriceTrends(prev => prev.map(item => ({
        ...item,
        price: item.price + (filters.stops !== null ? 50 : 0) - (filters.maxPrice < 500 ? 20 : 0)
      })));
    }
  }, [filters, searched]);

  return (
    <div className="app">
      <Navbar />
      
      <main>
        <SearchHero onSearch={handleSearch} />
        
        {!searched && <LandingContent />}
        
        {searched && (
          <div className="container results-layout animate-fade-in">
            <div className="results-sidebar">
              <FilterSidebar 
                filters={filters} 
                setFilters={setFilters} 
                availableAirlines={availableAirlines}
              />
            </div>
            
            <div className="results-main">
              <PriceGraph data={priceTrends} />
              
              <div className="results-header">
                <h2>{filteredFlights.length} Flights found</h2>
                <div className="sort-by">
                  <span>Sort by: </span>
                  <select>
                    <option>Cheapest</option>
                    <option>Fastest</option>
                  </select>
                </div>
              </div>
              
              {loading ? (
                <div className="loading-state">
                  <div className="spinner"></div>
                  <p>Searching for the best flights...</p>
                </div>
              ) : (
                <div className="flight-list">
                  {filteredFlights.length > 0 ? (
                    filteredFlights.map(flight => (
                      <FlightCard key={flight.id} flight={flight} />
                    ))
                  ) : (
                    <div className="no-results">
                      <p>No flights match your filters. Try adjusting them!</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
      
      <footer className="footer">
        <div className="container">
          <p>&copy; 2026 SkyBound. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
