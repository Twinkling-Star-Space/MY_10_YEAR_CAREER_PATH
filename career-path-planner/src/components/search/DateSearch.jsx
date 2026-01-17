import React, { useState } from 'react';

const DateSearch = ({ onSearch }) => {
  const [selectedDate, setSelectedDate] = useState('');
  
  const handleDateChange = (e) => {
    const date = e.target.value;
    setSelectedDate(date);
    if (date) {
      onSearch(date);
    }
  };
  
  const handleTodayClick = () => {
    const today = new Date().toISOString().split('T')[0];
    setSelectedDate(today);
    onSearch(today);
  };
  
  const handleTomorrowClick = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    setSelectedDate(tomorrowStr);
    onSearch(tomorrowStr);
  };

  return (
    <div className="date-search card">
      <h3>🔍 Search Tasks by Date</h3>
      <div className="search-controls">
        <input
          type="date"
          value={selectedDate}
          onChange={handleDateChange}
          className="date-input"
        />
        <div className="quick-dates">
          <button onClick={handleTodayClick} className="quick-date-btn">
            Today
          </button>
          <button onClick={handleTomorrowClick} className="quick-date-btn">
            Tomorrow
          </button>
        </div>
      </div>
      <p className="search-hint">
        Select a date to see all tasks planned or completed on that day
      </p>
    </div>
  );
};

export default DateSearch;