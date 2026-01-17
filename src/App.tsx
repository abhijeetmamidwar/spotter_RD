import React, { useState, useMemo, useEffect } from 'react';
import Navbar from './components/layout/Navbar';
import SearchHero from './components/search/SearchHero';
import FilterSidebar from './components/filters/FilterSidebar';
import FlightCard from './components/results/FlightCard';
import PriceGraph from './components/results/PriceGraph';
import { getPriceTrends } from './services/mockData';
import type { Flight, FilterParams } from './types/flight';

import LandingContent from './components/layout/LandingContent';

import { searchFlights, extractIataCode } from './services/amadeusService';

import SortDropdown from './components/results/SortDropdown';

const App: React.FC = () => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [filters, setFilters] = useState<FilterParams>({
    maxPrice: 2000,
    stops: null,
    airlines: [],
  });

  const [sortBy, setSortBy] = useState<'cheapest' | 'fastest'>('cheapest');

  const [priceTrends, setPriceTrends] = useState(getPriceTrends());

  const parseDuration = (duration: string) => {
    const hoursMatch = duration.match(/(\d+)h/);
    const minsMatch = duration.match(/(\d+)m/);
    const hours = hoursMatch ? parseInt(hoursMatch[1]) : 0;
    const mins = minsMatch ? parseInt(minsMatch[1]) : 0;
    return hours * 60 + mins;
  };

  const handleSearch = async (params: any) => {
    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      const originCode = extractIataCode(params.origin);
      const destinationCode = extractIataCode(params.destination);

      const results = await searchFlights({
        originCode,
        destinationCode,
        date: params.date,
        adults: params.passengers,
      });

      setFlights(results);
      setPriceTrends(getPriceTrends());
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Something went wrong while searching for flights.');
      setFlights([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredFlights = useMemo(() => {
    const filtered = flights.filter(flight => {
      const matchesPrice = flight.price <= filters.maxPrice;
      const matchesStops = filters.stops === null || flight.stops === filters.stops;
      const matchesAirline = filters.airlines.length === 0 || filters.airlines.includes(flight.airline);
      return matchesPrice && matchesStops && matchesAirline;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === 'cheapest') {
        return a.price - b.price;
      } else {
        return parseDuration(a.duration) - parseDuration(b.duration);
      }
    });
  }, [flights, filters, sortBy]);

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
        <SearchHero onSearch={handleSearch} loading={loading} />
        
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
              
              {error ? (
                <div className="error-state glass-card">
                  <p>{error}</p>
                  <button onClick={() => setSearched(false)} className="back-btn">Go Back</button>
                </div>
              ) : (
                <>
                  <div className="results-header">
                    <h2>{filteredFlights.length} Flights found</h2>
                    <SortDropdown value={sortBy} onChange={setSortBy} />
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
                </>
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
