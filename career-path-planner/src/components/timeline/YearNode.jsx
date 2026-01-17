import React, { useState } from 'react';
import { useCareer } from '../../context/CareerContext';
import MonthNode from './MonthNode';
import TaskForm from '../tasks/TaskForm';

const YearNode = ({ year, index }) => {
  const { expandedNodes, toggleYear, addMonth, toggleTaskCompletion } = useCareer();
  const [showAddMonth, setShowAddMonth] = useState(false);
  const isExpanded = expandedNodes.years[year.id];

  const handleAddMonth = (monthData) => {
    addMonth(year.id, {
      ...monthData,
      monthNumber: year.months.length + 1,
      isCompleted: false,
      days: []
    });
    setShowAddMonth(false);
  };

  const handleYearCompletion = () => {
    // Toggle year completion
  };

  return (
    <div className={`year-node ${isExpanded ? 'expanded' : ''}`}>
      <div className="node-header" onClick={() => toggleYear(year.id)}>
        <div className="node-indicator">
          <div className="year-circle">
            <span>Y{index + 1}</span>
          </div>
          <div className="timeline-line"></div>
        </div>
        
        <div className="node-content">
          <div className="node-title">
            <h3>{year.title}</h3>
            <span className={`status-badge ${year.isCompleted ? 'completed' : 'pending'}`}>
              {year.isCompleted ? '✓ Completed' : 'In Progress'}
            </span>
          </div>
          <p className="node-description">{year.description}</p>
          <div className="node-stats">
            <span>📅 {year.months.length} months</span>
            <span>✅ {year.months.filter(m => m.isCompleted).length} completed</span>
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
            <h4>Monthly Plans ({year.months.length})</h4>
            <button 
              className="add-btn"
              onClick={() => setShowAddMonth(true)}
            >
              + Add Month
            </button>
          </div>
          
          {showAddMonth && (
            <TaskForm
              onSubmit={handleAddMonth}
              onCancel={() => setShowAddMonth(false)}
              placeholderTitle={`Month ${year.months.length + 1} - Plan`}
              showDescription={true}
            />
          )}

          <div className="months-container">
            {year.months.length > 0 ? (
              year.months.map((month, monthIndex) => (
                <MonthNode
                  key={month.id}
                  month={month}
                  yearId={year.id}
                  index={monthIndex}
                />
              ))
            ) : (
              <div className="empty-months">
                <p>No months planned yet. Add your first month plan!</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default YearNode;