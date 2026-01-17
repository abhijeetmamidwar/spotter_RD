import axios from 'axios';

const AMADEUS_BASE_URL = 'https://test.api.amadeus.com';

let accessToken = '';
let tokenExpiry = 0;

const getAccessToken = async () => {
  const now = Date.now();
  if (accessToken && now < tokenExpiry) {
    return accessToken;
  }

  const clientId = import.meta.env.VITE_AMADEUS_CLIENT_ID;
  const clientSecret = import.meta.env.VITE_AMADEUS_CLIENT_SECRET;

  if (!clientId || !clientSecret || clientId === 'REPLACE_WITH_YOUR_API_KEY') {
    throw new Error('Amadeus API credentials missing. Please add them to your .env file.');
  }

  const params = new URLSearchParams();
  params.append('grant_type', 'client_credentials');
  params.append('client_id', clientId);
  params.append('client_secret', clientSecret);

  try {
    const response = await axios.post(`${AMADEUS_BASE_URL}/v1/security/oauth2/token`, params);
    accessToken = response.data.access_token;
    tokenExpiry = now + response.data.expires_in * 1000 - 60000; // Expire 1 minute early
    return accessToken;
  } catch (error) {
    console.error('Error fetching Amadeus access token:', error);
    throw new Error('Failed to authenticate with Amadeus API');
  }
};

export const searchFlights = async (params: {
  originCode: string;
  destinationCode: string;
  date: string;
  adults: number;
}) => {
  const token = await getAccessToken();

  try {
    const response = await axios.get(`${AMADEUS_BASE_URL}/v2/shopping/flight-offers`, {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        originLocationCode: params.originCode,
        destinationLocationCode: params.destinationCode,
        departureDate: params.date,
        adults: params.adults,
        currencyCode: 'USD',
        max: 100,
      },
    });

    const { data, dictionaries } = response.data;
    return data.map((offer: any) => mapAmadeusToFlight(offer, dictionaries));
  } catch (error) {
    console.error('Error searching flights:', error);
    throw error;
  }
};

const formatDuration = (durationStr: string) => {
  return durationStr.replace('PT', '').toLowerCase();
};

const calculateLayover = (arrivalStr: string, departureStr: string) => {
  const arrival = new Date(arrivalStr);
  const departure = new Date(departureStr);
  const diffMs = departure.getTime() - arrival.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const hours = Math.floor(diffMins / 60);
  const mins = diffMins % 60;
  return {
    duration: `${hours}h ${mins}m`,
    minutes: diffMins
  };
};

const mapAmadeusToFlight = (offer: any, dictionaries: any) => {
  const itinerary = offer.itineraries[0];
  const segments = itinerary.segments;
  const firstSegment = segments[0];
  const lastSegment = segments[segments.length - 1];
  const carrierCode = firstSegment.carrierCode;
  const airlineName = dictionaries.carriers[carrierCode] || carrierCode;

  const layovers = [];
  for (let i = 0; i < segments.length - 1; i++) {
    const arrival = segments[i].arrival;
    const departure = segments[i + 1].departure;
    const layoverInfo = calculateLayover(arrival.at, departure.at);
    layovers.push({
      iata: arrival.iataCode,
      duration: layoverInfo.duration,
      durationMinutes: layoverInfo.minutes
    });
  }

  const mappedSegments = segments.map((seg: any) => ({
    departure: {
      iata: seg.departure.iataCode,
      time: seg.departure.at.split('T')[1].substring(0, 5)
    },
    arrival: {
      iata: seg.arrival.iataCode,
      time: seg.arrival.at.split('T')[1].substring(0, 5)
    },
    carrier: dictionaries.carriers[seg.carrierCode] || seg.carrierCode,
    flightNumber: `${seg.carrierCode} ${seg.number}`,
    duration: formatDuration(seg.duration)
  }));

  return {
    id: offer.id,
    airline: airlineName,
    airlineLogo: `https://www.gstatic.com/flights/airline_logos/70px/${carrierCode}.png`,
    departure: {
      iata: firstSegment.departure.iataCode,
      city: firstSegment.departure.iataCode,
      time: firstSegment.departure.at.split('T')[1].substring(0, 5),
      terminal: firstSegment.departure.terminal
    },
    arrival: {
      iata: lastSegment.arrival.iataCode,
      city: lastSegment.arrival.iataCode,
      time: lastSegment.arrival.at.split('T')[1].substring(0, 5),
      terminal: lastSegment.arrival.terminal
    },
    duration: formatDuration(itinerary.duration),
    stops: segments.length - 1,
    price: parseFloat(offer.price.total),
    currency: offer.price.currency,
    date: firstSegment.departure.at.split('T')[0],
    layovers,
    segments: mappedSegments
  };
};

// Helper to extract IATA code from "City (IATA)" string
export const extractIataCode = (locationString: string) => {
  const match = locationString.match(/\(([A-Z]{3})\)/);
  return match ? match[1] : '';
};

export const searchLocations = async (keyword: string) => {
  if (!keyword || keyword.length < 2) return [];
  
  const token = await getAccessToken();
  try {
    const response = await axios.get(`${AMADEUS_BASE_URL}/v1/reference-data/locations`, {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        subType: 'CITY,AIRPORT',
        keyword,
        'page[limit]': 10
      }
    });
    
    return response.data.data.map((loc: any) => ({
      code: loc.iataCode,
      city: loc.address.cityName,
      country: loc.address.countryName,
      name: loc.name
    }));
  } catch (error) {
    console.error('Error searching locations:', error);
    return [];
  }
};
