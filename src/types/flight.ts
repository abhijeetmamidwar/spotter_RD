export interface Flight {
  id: string;
  airline: string;
  airlineLogo: string;
  departure: {
    iata: string;
    city: string;
    time: string;
    terminal?: string;
  };
  arrival: {
    iata: string;
    city: string;
    time: string;
    terminal?: string;
  };
  duration: string;
  stops: number;
  price: number;
  currency: string;
  date: string;
  layovers: {
    iata: string;
    duration: string;
    durationMinutes: number;
  }[];
  segments: {
    departure: { iata: string; time: string };
    arrival: { iata: string; time: string };
    carrier: string;
    flightNumber: string;
    duration: string;
  }[];
}

export interface SearchParams {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  passengers: number;
}

export interface FilterParams {
  maxPrice: number;
  stops: number | null;
  airlines: string[];
}
