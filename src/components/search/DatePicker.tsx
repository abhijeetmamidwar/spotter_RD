import React, { useState, useRef, useEffect } from 'react';
import { format, addDays, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, addMonths, subMonths, eachDayOfInterval } from 'date-fns';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DatePickerProps {
  selectedDate: Date;
  onChange: (date: Date) => void;
}

const DatePicker: React.FC<DatePickerProps> = ({ selectedDate, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate));
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

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  return (
    <div className={`search-field custom-datepicker ${isOpen ? 'is-open' : ''}`} ref={containerRef}>
      <div className="datepicker-trigger" onClick={() => setIsOpen(!isOpen)}>
        <label style={{ cursor: 'pointer', color: isOpen ? 'var(--primary)' : 'var(--text-muted)' }}>
          <CalendarIcon size={16} style={{ color: isOpen ? 'var(--primary)' : 'var(--text-muted)' }} />
          <span>Departure</span>
        </label>
        <div className="date-display">
          <span className="day">{format(selectedDate, 'EEE')},</span>
          <span className="date">{format(selectedDate, 'dd MMM')}</span>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="datepicker-dropdown glass-card"
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className="calendar-header">
              <button onClick={prevMonth} className="nav-btn"><ChevronLeft size={20} /></button>
              <h3>{format(currentMonth, 'MMMM yyyy')}</h3>
              <button onClick={nextMonth} className="nav-btn"><ChevronRight size={20} /></button>
            </div>

            <div className="calendar-grid">
              {days.map(day => (
                <div key={day} className="weekday">{day}</div>
              ))}
              {calendarDays.map((day, i) => (
                <div 
                  key={i}
                  className={`calendar-day ${
                    !isSameMonth(day, monthStart) ? 'outside' : ''
                  } ${isSameDay(day, selectedDate) ? 'selected' : ''} ${
                    isSameDay(day, new Date()) ? 'today' : ''
                  }`}
                  onClick={() => {
                    onChange(day);
                    setIsOpen(false);
                  }}
                >
                  {format(day, 'd')}
                </div>
              ))}
            </div>

            <div className="calendar-footer">
              <button onClick={() => { onChange(new Date()); setIsOpen(false); }}>Today</button>
              <button onClick={() => { onChange(addDays(new Date(), 1)); setIsOpen(false); }}>Tomorrow</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DatePicker;
