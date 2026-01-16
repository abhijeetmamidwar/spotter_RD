import type { Flight } from '../types/flight';

const AIRLINES = [
  { name: 'Emirates', logo: 'https://www.gstatic.com/flights/airline_logos/70px/EK.png' },
  { name: 'Qatar Airways', logo: 'https://www.gstatic.com/flights/airline_logos/70px/QR.png' },
  { name: 'Air India', logo: 'https://www.gstatic.com/flights/airline_logos/70px/AI.png' },
  { name: 'Lufthansa', logo: 'https://www.gstatic.com/flights/airline_logos/70px/LH.png' },
  { name: 'Singapore Airlines', logo: 'https://www.gstatic.com/flights/airline_logos/70px/SQ.png' },
];

export const mockFlights: Flight[] = Array.from({ length: 20 }).map((_, i) => {
  const airline = AIRLINES[Math.floor(Math.random() * AIRLINES.length)];
  const departureHour = Math.floor(Math.random() * 24);
  const durationHours = Math.floor(Math.random() * 15) + 2;
  
  return {
    id: `f-${i}`,
    airline: airline.name,
    airlineLogo: airline.logo,
    departure: {
      iata: 'BOM',
      city: 'Mumbai',
      time: `${departureHour.toString().padStart(2, '0')}:00`,
    },
    arrival: {
      iata: 'DXB',
      city: 'Dubai',
      time: `${((departureHour + durationHours) % 24).toString().padStart(2, '0')}:30`,
    },
    duration: `${durationHours}h 30m`,
    stops: Math.floor(Math.random() * 3),
    price: Math.floor(Math.random() * 500) + 200,
    currency: 'USD',
    date: '2026-01-20',
  };
});

export const getPriceTrends = () => {
  return Array.from({ length: 14 }).map((_, i) => ({
    date: `Jan ${15 + i}`,
    price: Math.floor(Math.random() * 300) + 300,
  }));
};

export const AIRPORTS = [
  { code: 'BOM', city: 'Mumbai', country: 'India', name: 'Chhatrapati Shivaji Maharaj' },
  { code: 'DEL', city: 'Delhi', country: 'India', name: 'Indira Gandhi International' },
  { code: 'DXB', city: 'Dubai', country: 'UAE', name: 'Dubai International' },
  { code: 'LHR', city: 'London', country: 'United Kingdom', name: 'Heathrow Airport' },
  { code: 'LGW', city: 'London', country: 'United Kingdom', name: 'Gatwick Airport' },
  { code: 'STN', city: 'London', country: 'United Kingdom', name: 'Stansted Airport' },
  { code: 'JFK', city: 'New York', country: 'USA', name: 'John F. Kennedy' },
  { code: 'EWR', city: 'New York', country: 'USA', name: 'Newark Liberty' },
  { code: 'SIN', city: 'Singapore', country: 'Singapore', name: 'Changi Airport' },
  { code: 'CDG', city: 'Paris', country: 'France', name: 'Charles de Gaulle' },
  { code: 'HND', city: 'Tokyo', country: 'Japan', name: 'Haneda Airport' },
  { code: 'NRT', city: 'Tokyo', country: 'Japan', name: 'Narita Airport' },
];
