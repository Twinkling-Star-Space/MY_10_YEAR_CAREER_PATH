import React, { useState } from 'react';
import { useCareer } from '../../context/CareerContext';
import DailyNode from './DailyNode';
import TaskForm from '../tasks/TaskForm';

const MonthNode = ({ month, yearId, index }) => {
  const { expandedNodes, toggleMonth, addDay } = useCareer();
  const [showAddDay, setShowAddDay] = useState(false);
  const isExpanded = expandedNodes.months[`${yearId}-${month.id}`];

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const handleAddDay = (dayData) => {
    const today = new Date();
    const date = new Date(today.getFullYear(), month.monthNumber - 1, month.days.length + 1);
    
    addDay(yearId, month.id, {
      ...dayData,
      date: date.toISOString().split('T')[0],
      title: `${date.toLocaleDateString('en-US', { weekday: 'short' })} - ${date.getDate()} ${monthNames[date.getMonth()]}`,
      isCompleted: false,
      tasks: []
    });
    setShowAddDay(false);
  };

  return (
    <div className={`month-node ${isExpanded ? 'expanded' : ''}`}>
      <div className="node-header" onClick={() => toggleMonth(yearId, month.id)}>
        <div className="node-indicator">
          <div className="month-circle">
            <span>M{index + 1}</span>
          </div>
          <div className="timeline-line"></div>
        </div>
        
        <div className="node-content">
          <div className="node-title">
            <h4>{month.title}</h4>
            <span className={`status-badge ${month.isCompleted ? 'completed' : 'pending'}`}>
              {month.isCompleted ? '✓' : '○'}
            </span>
          </div>
          <p className="node-description">{month.description}</p>
          <div className="node-stats">
            <span>📅 {month.days.length} days planned</span>
            <span>✅ {month.days.filter(d => d.isCompleted).length} completed</span>
          </div>
        </div>
        
        <div className="node-actions">
          <button className="expand-btn">
            {isExpanded ? '▼' : '▶'}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="node-children">
          <div className="children-header">
            <h5>Daily Tasks ({month.days.length})</h5>
            <button 
              className="add-btn small"
              onClick={() => setShowAddDay(true)}
            >
              + Add Day
            </button>
          </div>
          
          {showAddDay && (
            <TaskForm
              onSubmit={handleAddDay}
              onCancel={() => setShowAddDay(false)}
              placeholderTitle="Enter day task"
              showDescription={true}
            />
          )}

          <div className="days-container">
            {month.days.length > 0 ? (
              month.days.map((day, dayIndex) => (
                <DailyNode
                  key={day.id}
                  day={day}
                  yearId={yearId}
                  monthId={month.id}
                  index={dayIndex}
                />
              ))
            ) : (
              <div className="empty-days">
                <p>No daily tasks yet. Plan your daily activities!</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MonthNode;