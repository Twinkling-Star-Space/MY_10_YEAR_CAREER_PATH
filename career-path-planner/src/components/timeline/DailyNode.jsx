import React, { useState } from 'react';
import { useCareer } from '../../context/CareerContext';
import TaskForm from '../tasks/TaskForm';

const DailyNode = ({ day, yearId, monthId, index }) => {
  const { addTask, toggleTaskCompletion } = useCareer();
  const [showAddTask, setShowAddTask] = useState(false);

  const handleAddTask = (taskData) => {
    addTask(yearId, monthId, day.id, {
      ...taskData,
      isCompleted: false
    });
    setShowAddTask(false);
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="daily-node">
      <div className="node-header">
        <div className="node-indicator">
          <div className="day-circle">
            <span>D{index + 1}</span>
          </div>
        </div>
        
        <div className="node-content">
          <div className="node-title">
            <h5>{day.title}</h5>
            <span className="date-badge">{formatDate(day.date)}</span>
          </div>
          <p className="node-description">{day.description}</p>
          
          <div className="tasks-list">
            {day.tasks.length > 0 ? (
              day.tasks.map(task => (
                <div key={task.id} className="task-item">
                  <input
                    type="checkbox"
                    checked={task.isCompleted}
                    onChange={() => toggleTaskCompletion(yearId, monthId, day.id, task.id)}
                    className="task-checkbox"
                  />
                  <span className={`task-text ${task.isCompleted ? 'completed' : ''}`}>
                    {task.title}
                  </span>
                </div>
              ))
            ) : (
              <p className="no-tasks">No tasks planned for this day</p>
            )}
          </div>
        </div>
        
        <div className="node-actions">
          <button 
            className="add-task-btn"
            onClick={() => setShowAddTask(true)}
            title="Add task"
          >
            +
          </button>
        </div>
      </div>

      {showAddTask && (
        <div className="task-form-container">
          <TaskForm
            onSubmit={handleAddTask}
            onCancel={() => setShowAddTask(false)}
            placeholderTitle="Enter task description"
            showDescription={false}
          />
        </div>
      )}
    </div>
  );
};

export default DailyNode;