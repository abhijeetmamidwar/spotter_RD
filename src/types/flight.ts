export interface Flight {
  id: string;
  airline: string;
  airlineLogo: string;
  departure: {
    iata: string;
    city: string;
    time: string;
  };
  arrival: {
    iata: string;
    city: string;
    time: string;
  };
  duration: string;
  stops: number;
  price: number;
  currency: string;
  date: string;
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
