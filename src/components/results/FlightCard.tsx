import React, { useState } from 'react';
import { Plane, Clock, ArrowRight, ChevronDown, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Flight } from '../../types/flight';

interface FlightCardProps {
  flight: Flight;
}

const FlightCard: React.FC<FlightCardProps> = ({ flight }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hoveredStop, setHoveredStop] = useState<number | null>(null);

  return (
    <div className="flight-card-wrapper">
      <div className={`flight-card glass-card animate-fade-in ${isExpanded ? 'expanded' : ''}`}>
        <div className="flight-info">
          <div className="airline-info">
            <img src={flight.airlineLogo} alt={flight.airline} className="airline-logo" />
            <div className="airline-meta">
              <span className="airline-name">{flight.airline}</span>
              <span className="flight-date">{flight.date}</span>
            </div>
          </div>
          
          <div className="flight-route">
            <div className="route-point">
              <span className="time">{flight.departure.time}</span>
              <span className="iata">{flight.departure.iata}</span>
            </div>
            
            <div className="route-path-container">
              <div className="duration">
                <Clock size={14} />
                <span>{flight.duration}</span>
              </div>
              
              <div className="path-line-wrapper">
                <div className="path-line">
                  <div className="dot start"></div>
                  <div className="line"></div>
                  
                  {/* Intermediate Stops */}
                  {flight.layovers.map((stop, index) => (
                    <div 
                      key={index} 
                      className="stop-point-wrapper"
                      style={{ left: `${((index + 1) / (flight.stops + 1)) * 100}%` }}
                      onMouseEnter={() => setHoveredStop(index)}
                      onMouseLeave={() => setHoveredStop(null)}
                    >
                      <div className={`stop-dot ${hoveredStop === index ? 'hovered' : ''}`}></div>
                      <AnimatePresence>
                        {hoveredStop === index && (
                          <motion.div 
                            className="stop-tooltip glass-card"
                            initial={{ opacity: 0, y: 10, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.9 }}
                          >
                            <div className="tooltip-header">
                              <MapPin size={12} />
                              <span>Layover in {stop.iata}</span>
                            </div>
                            <div className="tooltip-body">
                              <Clock size={12} />
                              <span>{stop.duration} wait</span>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}

                  <Plane size={16} className="plane-icon" />
                  <div className="line"></div>
                  <div className="dot end"></div>
                </div>
              </div>

              <div className="stops-info">
                {flight.stops === 0 ? (
                  <span className="non-stop">Non-stop</span>
                ) : (
                  <span className="has-stops">
                    {flight.stops} stop{flight.stops > 1 ? 's' : ''} 
                    <span className="stop-cities">({flight.layovers.map(l => l.iata).join(', ')})</span>
                  </span>
                )}
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
          <div className="action-buttons">
            <button className="details-toggle" onClick={() => setIsExpanded(!isExpanded)}>
              <span>{isExpanded ? 'Hide Details' : 'View Details'}</span>
              <ChevronDown size={16} className={`chevron ${isExpanded ? 'open' : ''}`} />
            </button>
            <button className="select-btn">
              <span>Select</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            className="flight-details-panel glass-card"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
          >
            <div className="details-content">
              <h4 className="details-title">Flight Itinerary</h4>
              <div className="itinerary-timeline">
                {flight.segments.map((segment, index) => (
                  <React.Fragment key={index}>
                    <div className="itinerary-segment">
                      <div className="segment-icon">
                        <div className="segment-line top"></div>
                        <div className="segment-dot">
                          <Plane size={14} />
                        </div>
                        <div className="segment-line bottom"></div>
                      </div>
                      <div className="segment-details">
                        <div className="segment-header">
                          <span className="carrier">{segment.carrier}</span>
                          <span className="flight-num">{segment.flightNumber}</span>
                          <span className="seg-duration">{segment.duration}</span>
                        </div>
                        <div className="segment-points">
                          <div className="point">
                            <span className="p-time">{segment.departure.time}</span>
                            <span className="p-iata">{segment.departure.iata}</span>
                          </div>
                          <div className="point-arrow">
                            <ArrowRight size={14} />
                          </div>
                          <div className="point">
                            <span className="p-time">{segment.arrival.time}</span>
                            <span className="p-iata">{segment.arrival.iata}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {index < flight.layovers.length && (
                      <div className="itinerary-layover">
                        <div className="layover-icon">
                          <div className="segment-line dashed"></div>
                          <div className="layover-dot">
                            <Clock size={12} />
                          </div>
                          <div className="segment-line dashed"></div>
                        </div>
                        <div className="layover-info-panel">
                          <span className="l-text">Layover in {flight.layovers[index].iata}</span>
                          <span className="l-time">{flight.layovers[index].duration}</span>
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FlightCard;
