import React from 'react';
import { Plane, Clock, ArrowRight } from 'lucide-react';
import type { Flight } from '../../types/flight';

interface FlightCardProps {
  flight: Flight;
}

const FlightCard: React.FC<FlightCardProps> = ({ flight }) => {
  return (
    <div className="flight-card glass-card animate-fade-in">
      <div className="flight-info">
        <div className="airline-info">
          <img src={flight.airlineLogo} alt={flight.airline} className="airline-logo" />
          <span className="airline-name">{flight.airline}</span>
        </div>
        
        <div className="flight-route">
          <div className="route-point">
            <span className="time">{flight.departure.time}</span>
            <span className="iata">{flight.departure.iata}</span>
          </div>
          
          <div className="route-path">
            <div className="duration">
              <Clock size={14} />
              <span>{flight.duration}</span>
            </div>
            <div className="path-line">
              <div className="dot"></div>
              <div className="line"></div>
              <Plane size={16} className="plane-icon" />
              <div className="line"></div>
              <div className="dot"></div>
            </div>
            <div className="stops">
              {flight.stops === 0 ? 'Non-stop' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
            </div>
          </div>
          
          <div className="route-point">
            <span className="time">{flight.arrival.time}</span>
            <span className="iata">{flight.arrival.iata}</span>
          </div>
        </div>
      </div>
      
      <div className="flight-price-action">
        <div className="price-tag">
          <span className="currency">$</span>
          <span className="amount">{flight.price}</span>
        </div>
        <button className="select-btn">
          <span>Select</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default FlightCard;
