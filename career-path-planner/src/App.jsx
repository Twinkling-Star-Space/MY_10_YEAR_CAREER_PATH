import React, { useState } from 'react';

// Enhanced initial data
const initialCareerData = {
  title: "Senior Full-Stack Developer",
  description: "Master React, Node.js, cloud technologies, and system design within 3 years",
  years: [
    {
      id: 'year-1',
      title: 'Foundation & Fundamentals',
      yearNumber: 1,
      description: 'Build strong fundamentals in web development',
      isCompleted: false,
      months: [
        {
          id: 'month-1',
          title: 'React Core Concepts',
          monthNumber: 1,
          description: 'Master React fundamentals and hooks',
          isCompleted: false,
          days: [
            {
              id: 'day-1',
              title: 'Environment Setup',
              date: '2024-01-01',
              description: 'Setup development environment',
              isCompleted: true,
              tasks: [
                { id: 'task-1', title: 'Install Node.js & npm', isCompleted: true },
                { id: 'task-2', title: 'Configure VS Code', isCompleted: true },
                { id: 'task-3', title: 'Create first React app', isCompleted: true }
              ]
            },
            {
              id: 'day-2',
              title: 'React Components',
              date: '2024-01-02',
              description: 'Learn component architecture',
              isCompleted: false,
              tasks: [
                { id: 'task-4', title: 'Functional vs Class components', isCompleted: true },
                { id: 'task-5', title: 'Props and State', isCompleted: false },
                { id: 'task-6', title: 'Lifecycle methods', isCompleted: false }
              ]
            }
          ]
        },
        {
          id: 'month-2',
          title: 'Advanced React Patterns',
          monthNumber: 2,
          description: 'Learn state management and performance',
          isCompleted: false,
          days: []
        }
      ]
    },
    {
      id: 'year-2',
      title: 'Backend & Databases',
      yearNumber: 2,
      description: 'Master server-side development and databases',
      isCompleted: false,
      months: []
    }
  ]
};

function App() {
  const [careerData, setCareerData] = useState(initialCareerData);
  const [gamingMode, setGamingMode] = useState(false);
  const [expandedYears, setExpandedYears] = useState({ 'year-1': true });
  const [expandedMonths, setExpandedMonths] = useState({ 'month-1': true });
  const [editingTask, setEditingTask] = useState(null); // { yearIndex, monthIndex, dayIndex, taskIndex }
  const [editText, setEditText] = useState('');
  
  // Calculate progress statistics
  const calculateProgress = () => {
    const totalYears = careerData.years.length;
    const completedYears = careerData.years.filter(year => year.isCompleted).length;
    
    const totalMonths = careerData.years.reduce((sum, year) => sum + year.months.length, 0);
    const completedMonths = careerData.years.reduce((sum, year) => 
      sum + year.months.filter(month => month.isCompleted).length, 0);
    
    const totalDays = careerData.years.reduce((sum, year) => 
      sum + year.months.reduce((mSum, month) => mSum + month.days.length, 0), 0);
    
    const totalTasks = careerData.years.reduce((sum, year) => 
      sum + year.months.reduce((mSum, month) => 
        mSum + month.days.reduce((dSum, day) => dSum + day.tasks.length, 0), 0), 0);
    
    const completedTasks = careerData.years.reduce((sum, year) => 
      sum + year.months.reduce((mSum, month) => 
        mSum + month.days.reduce((dSum, day) => 
          dSum + day.tasks.filter(task => task.isCompleted).length, 0), 0), 0);
    
    return {
      totalYears,
      completedYears,
      totalMonths,
      completedMonths,
      totalDays,
      totalTasks,
      completedTasks,
      yearProgress: totalYears > 0 ? (completedYears / totalYears) * 100 : 0,
      taskProgress: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0
    };
  };

  const stats = calculateProgress();

  const toggleGamingMode = () => setGamingMode(!gamingMode);
  
  const toggleYearExpansion = (yearId) => {
    setExpandedYears(prev => ({
      ...prev,
      [yearId]: !prev[yearId]
    }));
  };

  const toggleMonthExpansion = (monthId) => {
    setExpandedMonths(prev => ({
      ...prev,
      [monthId]: !prev[monthId]
    }));
  };

  const toggleTaskCompletion = (yearIndex, monthIndex, dayIndex, taskIndex) => {
    const newData = JSON.parse(JSON.stringify(careerData));
    const task = newData.years[yearIndex].months[monthIndex].days[dayIndex].tasks[taskIndex];
    task.isCompleted = !task.isCompleted;
    setCareerData(newData);
  };

  // Start editing a task
  const startEditingTask = (yearIndex, monthIndex, dayIndex, taskIndex) => {
    const task = careerData.years[yearIndex].months[monthIndex].days[dayIndex].tasks[taskIndex];
    setEditingTask({ yearIndex, monthIndex, dayIndex, taskIndex });
    setEditText(task.title);
  };

  // Save edited task
  const saveEditedTask = () => {
    if (!editingTask || !editText.trim()) return;
    
    const newData = JSON.parse(JSON.stringify(careerData));
    const { yearIndex, monthIndex, dayIndex, taskIndex } = editingTask;
    newData.years[yearIndex].months[monthIndex].days[dayIndex].tasks[taskIndex].title = editText.trim();
    
    setCareerData(newData);
    setEditingTask(null);
    setEditText('');
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingTask(null);
    setEditText('');
  };

  // Handle Enter key in edit mode
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      saveEditedTask();
    } else if (e.key === 'Escape') {
      cancelEditing();
    }
  };

  // Add Year
  const addYear = () => {
    const newYearNumber = careerData.years.length + 1;
    const newYear = {
      id: `year-${Date.now()}`,
      title: `Year ${newYearNumber} - New Career Phase`,
      yearNumber: newYearNumber,
      description: 'Define your goals and milestones for this year',
      isCompleted: false,
      months: []
    };
    setCareerData(prev => ({
      ...prev,
      years: [...prev.years, newYear]
    }));
    setExpandedYears(prev => ({ ...prev, [newYear.id]: true }));
  };

  // Remove Year
  const removeYear = (yearIndex) => {
    const newData = JSON.parse(JSON.stringify(careerData));
    const yearId = newData.years[yearIndex].id;
    newData.years.splice(yearIndex, 1);
    setCareerData(newData);
    
    // Remove from expanded state
    const newExpanded = { ...expandedYears };
    delete newExpanded[yearId];
    setExpandedYears(newExpanded);
  };

  // Add Month
  const addMonth = (yearIndex) => {
    const newData = JSON.parse(JSON.stringify(careerData));
    const year = newData.years[yearIndex];
    const newMonthNumber = year.months.length + 1;
    
    const newMonth = {
      id: `month-${Date.now()}`,
      title: `Month ${newMonthNumber} - New Monthly Plan`,
      monthNumber: newMonthNumber,
      description: 'Add your monthly objectives and learning goals',
      isCompleted: false,
      days: []
    };
    
    year.months.push(newMonth);
    setCareerData(newData);
    setExpandedMonths(prev => ({ ...prev, [newMonth.id]: true }));
  };

  // Remove Month
  const removeMonth = (yearIndex, monthIndex) => {
    const newData = JSON.parse(JSON.stringify(careerData));
    const monthId = newData.years[yearIndex].months[monthIndex].id;
    newData.years[yearIndex].months.splice(monthIndex, 1);
    setCareerData(newData);
    
    // Remove from expanded state
    const newExpanded = { ...expandedMonths };
    delete newExpanded[monthId];
    setExpandedMonths(newExpanded);
  };

  // Add Day
  const addDay = (yearIndex, monthIndex) => {
    const newData = JSON.parse(JSON.stringify(careerData));
    const month = newData.years[yearIndex].months[monthIndex];
    
    const today = new Date();
    const date = new Date(today.getFullYear(), monthIndex, month.days.length + 1);
    const dayNumber = month.days.length + 1;
    
    const newDay = {
      id: `day-${Date.now()}`,
      title: `Day ${dayNumber} - Daily Plan`,
      date: date.toISOString().split('T')[0],
      description: 'Plan your daily tasks and activities',
      isCompleted: false,
      tasks: [
        { id: `task-${Date.now()}-1`, title: 'Add your first task', isCompleted: false }
      ]
    };
    
    month.days.push(newDay);
    setCareerData(newData);
  };

  // Remove Day
  const removeDay = (yearIndex, monthIndex, dayIndex) => {
    const newData = JSON.parse(JSON.stringify(careerData));
    newData.years[yearIndex].months[monthIndex].days.splice(dayIndex, 1);
    setCareerData(newData);
  };

  // Add Task
  const addTask = (yearIndex, monthIndex, dayIndex) => {
    const newData = JSON.parse(JSON.stringify(careerData));
    const day = newData.years[yearIndex].months[monthIndex].days[dayIndex];
    
    const newTask = {
      id: `task-${Date.now()}`,
      title: `Task ${day.tasks.length + 1}`,
      isCompleted: false
    };
    
    day.tasks.push(newTask);
    setCareerData(newData);
  };

  // Remove Task
  const removeTask = (yearIndex, monthIndex, dayIndex, taskIndex) => {
    const newData = JSON.parse(JSON.stringify(careerData));
    newData.years[yearIndex].months[monthIndex].days[dayIndex].tasks.splice(taskIndex, 1);
    setCareerData(newData);
  };

  // Format date nicely
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Check if current task is being edited
  const isEditing = (yearIndex, monthIndex, dayIndex, taskIndex) => {
    return editingTask && 
           editingTask.yearIndex === yearIndex &&
           editingTask.monthIndex === monthIndex &&
           editingTask.dayIndex === dayIndex &&
           editingTask.taskIndex === taskIndex;
  };

  // Get task color based on completion status with better contrast
  const getTaskColor = (isCompleted) => {
    if (gamingMode) {
      return isCompleted ? '#a7f3d0' : '#fbcfe8'; // Green/Pink for gaming mode
    }
    return isCompleted ? '#047857' : '#1e293b'; // Dark green/Dark slate for normal
  };

  return (
    <div className={`app ${gamingMode ? 'gaming-mode' : ''}`}>
      {/* Modern Navbar */}
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-brand">
            <a href="/" className="logo">
              <div className="logo-icon">🚀</div>
              <span className="logo-text">CareerPath</span>
            </a>
          </div>
          
          <div className="navbar-actions">
            <button 
              className="mode-toggle"
              onClick={toggleGamingMode}
              aria-label={gamingMode ? "Switch to professional mode" : "Switch to gaming mode"}
            >
              {gamingMode ? '💼 Professional Mode' : '🎮 Gaming Mode'}
            </button>
          </div>
        </div>
      </nav>

      <main className="main-content">
        {/* Hero Section */}
        <div className="hero-section">
          <h1>Plan Your Career Journey</h1>
          <p className="hero-subtitle">
            Break down ambitious career goals into manageable yearly, monthly, and daily tasks
          </p>
          
          <div className="career-goal">
            <h2>
              <span role="img" aria-label="target">🎯</span>
              Current Career Goal
            </h2>
            <h3>{careerData.title}</h3>
            <p>{careerData.description}</p>
          </div>
        </div>

        {/* Timeline Section */}
        <div className="timeline-section">
          <div className="section-header">
            <h2>
              <span role="img" aria-label="calendar">📅</span>
              Career Timeline
            </h2>
            <button className="btn btn-primary" onClick={addYear}>
              <span>+</span> Add Year
            </button>
          </div>

          {careerData.years.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <h3 className="empty-title">No career years planned yet</h3>
              <p className="empty-description">
                Start by adding your first year plan. Break down your long-term goals into yearly milestones.
              </p>
              <button className="btn btn-primary" onClick={addYear}>
                <span>+</span> Start Planning Your First Year
              </button>
            </div>
          ) : (
            <div className="timeline">
              {careerData.years.map((year, yearIndex) => (
                <div key={year.id} className="year-node">
                  <div className="year-header" onClick={() => toggleYearExpansion(year.id)}>
                    <div className="year-header-left">
                      <div className="year-badge">
                        {year.yearNumber}
                      </div>
                      <div>
                        <h3 className="year-title">{year.title}</h3>
                        <p className="year-description">{year.description}</p>
                      </div>
                    </div>
                    <div className="year-header-right">
                      <span className={`status-badge ${year.isCompleted ? 'status-completed' : 'status-pending'}`}>
                        {year.isCompleted ? 'Completed' : 'In Progress'}
                      </span>
                      <button 
                        className="btn btn-danger btn-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeYear(yearIndex);
                        }}
                        aria-label={`Remove year ${year.yearNumber}`}
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  {expandedYears[year.id] && (
                    <div className="year-content">
                      <div className="actions-container">
                        <button 
                          className="btn btn-secondary"
                          onClick={() => addMonth(yearIndex)}
                        >
                          <span>+</span> Add Month to Year {year.yearNumber}
                        </button>
                      </div>

                      <div className="months-container">
                        {year.months.length === 0 ? (
                          <div className="empty-state" style={{ padding: 'var(--space-4)' }}>
                            <p>No months planned for this year. Add your first month!</p>
                          </div>
                        ) : (
                          year.months.map((month, monthIndex) => (
                            <div key={month.id} className="month-node">
                              <div className="month-header" onClick={() => toggleMonthExpansion(month.id)}>
                                <div className="month-header-left">
                                  <div className="month-badge">
                                    {month.monthNumber}
                                  </div>
                                  <h4 className="month-title">{month.title}</h4>
                                </div>
                                <div className="month-header-right">
                                  <span className={`status-badge ${month.isCompleted ? 'status-completed' : 'status-pending'}`}>
                                    {month.isCompleted ? '✓' : '○'}
                                  </span>
                                  <button 
                                    className="btn btn-danger btn-sm btn-icon"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      removeMonth(yearIndex, monthIndex);
                                    }}
                                    aria-label={`Remove month ${month.monthNumber}`}
                                  >
                                    ✕
                                  </button>
                                </div>
                              </div>

                              {expandedMonths[month.id] && (
                                <div className="month-content">
                                  <div className="actions-container">
                                    <button 
                                      className="btn btn-secondary"
                                      onClick={() => addDay(yearIndex, monthIndex)}
                                    >
                                      <span>+</span> Add Day to Month {month.monthNumber}
                                    </button>
                                  </div>

                                  <div className="days-container">
                                    {month.days.length === 0 ? (
                                      <div className="empty-state" style={{ padding: 'var(--space-3)' }}>
                                        <p>No days planned for this month. Plan your daily activities!</p>
                                      </div>
                                    ) : (
                                      month.days.map((day, dayIndex) => (
                                        <div key={day.id} className="day-node">
                                          <div className="day-header">
                                            <div>
                                              <h5 className="day-title">{day.title}</h5>
                                              <span className="day-date">{formatDate(day.date)}</span>
                                            </div>
                                            <button 
                                              className="btn btn-danger btn-sm btn-icon"
                                              onClick={() => removeDay(yearIndex, monthIndex, dayIndex)}
                                              aria-label="Remove day"
                                            >
                                              ✕
                                            </button>
                                          </div>
                                          
                                          <p className="day-description">{day.description}</p>

                                          <div className="actions-container">
                                            <button 
                                              className="btn btn-secondary btn-sm"
                                              onClick={() => addTask(yearIndex, monthIndex, dayIndex)}
                                            >
                                              <span>+</span> Add Task
                                            </button>
                                          </div>

                                          <div className="tasks-container">
                                            {day.tasks.length === 0 ? (
                                              <p className="empty-message">No tasks for this day.</p>
                                            ) : (
                                              day.tasks.map((task, taskIndex) => {
                                                const editing = isEditing(yearIndex, monthIndex, dayIndex, taskIndex);
                                                const taskColor = getTaskColor(task.isCompleted);
                                                
                                                return (
                                                  <div key={task.id} className="task-item">
                                                    <div className="task-left">
                                                      <input
                                                        type="checkbox"
                                                        id={`task-${task.id}`}
                                                        className="task-checkbox"
                                                        checked={task.isCompleted}
                                                        onChange={() => toggleTaskCompletion(yearIndex, monthIndex, dayIndex, taskIndex)}
                                                        aria-label={`Mark task "${task.title}" as ${task.isCompleted ? 'incomplete' : 'complete'}`}
                                                      />
                                                      
                                                      {editing ? (
                                                        <div className="task-edit-container">
                                                          <input
                                                            type="text"
                                                            value={editText}
                                                            onChange={(e) => setEditText(e.target.value)}
                                                            onKeyDown={handleKeyDown}
                                                            onBlur={saveEditedTask}
                                                            autoFocus
                                                            className="task-edit-input"
                                                            style={{
                                                              color: taskColor,
                                                              fontWeight: '600',
                                                              backgroundColor: gamingMode ? 'rgba(255,255,255,0.1)' : 'var(--white)'
                                                            }}
                                                          />
                                                          <div className="task-edit-actions">
                                                            <button 
                                                              className="btn btn-success btn-sm btn-icon"
                                                              onClick={saveEditedTask}
                                                              aria-label="Save changes"
                                                            >
                                                              ✓
                                                            </button>
                                                            <button 
                                                              className="btn btn-danger btn-sm btn-icon"
                                                              onClick={cancelEditing}
                                                              aria-label="Cancel editing"
                                                            >
                                                              ✕
                                                            </button>
                                                          </div>
                                                        </div>
                                                      ) : (
                                                        <label 
                                                          htmlFor={`task-${task.id}`}
                                                          className={`task-text ${task.isCompleted ? 'completed' : ''}`}
                                                          style={{
                                                            color: taskColor,
                                                            fontWeight: task.isCompleted ? '500' : '600',
                                                            cursor: 'pointer',
                                                            flex: 1,
                                                            padding: '4px 8px',
                                                            borderRadius: '4px',
                                                            backgroundColor: task.isCompleted ? 
                                                              (gamingMode ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.05)') : 
                                                              'transparent'
                                                          }}
                                                          onDoubleClick={() => startEditingTask(yearIndex, monthIndex, dayIndex, taskIndex)}
                                                          title="Double-click to edit"
                                                        >
                                                          {task.title}
                                                        </label>
                                                      )}
                                                    </div>
                                                    {!editing && (
                                                      <div className="task-actions">
                                                        <button 
                                                          className="btn btn-secondary btn-sm btn-icon"
                                                          onClick={() => startEditingTask(yearIndex, monthIndex, dayIndex, taskIndex)}
                                                          aria-label={`Edit task "${task.title}"`}
                                                          title="Edit task"
                                                        >
                                                          ✏️
                                                        </button>
                                                        <button 
                                                          className="btn btn-danger btn-sm btn-icon"
                                                          onClick={() => removeTask(yearIndex, monthIndex, dayIndex, taskIndex)}
                                                          aria-label={`Remove task "${task.title}"`}
                                                        >
                                                          ✕
                                                        </button>
                                                      </div>
                                                    )}
                                                  </div>
                                                );
                                              })
                                            )}
                                          </div>
                                        </div>
                                      ))
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Stats Section */}
        <div className="stats-section">
          <div className="stat-card">
            <div className="stat-value">{stats.totalYears}</div>
            <div className="stat-label">Years Planned</div>
            <div className="progress-container">
              <div className="progress-label">
                <span>Progress</span>
                <span>{Math.round(stats.yearProgress)}%</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${stats.yearProgress}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-value">{stats.totalMonths}</div>
            <div className="stat-label">Months</div>
            <div className="progress-container">
              <div className="progress-label">
                <span>Completed</span>
                <span>{stats.completedMonths}/{stats.totalMonths}</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${stats.totalMonths > 0 ? (stats.completedMonths / stats.totalMonths) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-value">{stats.totalDays}</div>
            <div className="stat-label">Days Planned</div>
          </div>

          <div className="stat-card">
            <div className="stat-value">{stats.totalTasks}</div>
            <div className="stat-label">Total Tasks</div>
            <div className="progress-container">
              <div className="progress-label">
                <span>Completed</span>
                <span>{stats.completedTasks}/{stats.totalTasks}</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${stats.taskProgress}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions Panel */}
        <div className="card" style={{ marginTop: 'var(--space-6)' }}>
          <h3 style={{ 
            marginBottom: 'var(--space-4)', 
            color: gamingMode ? '#ddd6fe' : 'var(--gray-800)',
            fontSize: '1.25rem'
          }}>
            ✨ How to Use This Planner
          </h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: 'var(--space-4)',
            color: gamingMode ? '#c7d2fe' : 'var(--gray-600)'
          }}>
            <div>
              <h4 style={{ 
                fontSize: '1rem', 
                color: gamingMode ? '#a78bfa' : 'var(--primary)',
                marginBottom: 'var(--space-2)',
                fontWeight: '600'
              }}>
                Edit Tasks
              </h4>
              <p style={{ fontSize: '0.875rem', lineHeight: '1.6' }}>
                Double-click any task or click the ✏️ icon to edit task names. Press Enter to save or Escape to cancel.
              </p>
            </div>
            <div>
              <h4 style={{ 
                fontSize: '1rem', 
                color: gamingMode ? '#a78bfa' : 'var(--primary)',
                marginBottom: 'var(--space-2)',
                fontWeight: '600'
              }}>
                Complete Tasks
              </h4>
              <p style={{ fontSize: '0.875rem', lineHeight: '1.6' }}>
                Click the checkbox to mark tasks as complete. Completed tasks have a green color with strikethrough.
              </p>
            </div>
            <div>
              <h4 style={{ 
                fontSize: '1rem', 
                color: gamingMode ? '#a78bfa' : 'var(--primary)',
                marginBottom: 'var(--space-2)',
                fontWeight: '600'
              }}>
                Add & Remove
              </h4>
              <p style={{ fontSize: '0.875rem', lineHeight: '1.6' }}>
                Use + buttons to add items. Click ✕ buttons to remove. Expand/collapse with arrow buttons.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ 
        textAlign: 'center', 
        padding: 'var(--space-4)', 
        color: gamingMode ? '#94a3b8' : 'var(--gray-500)',
        fontSize: '0.875rem',
        borderTop: gamingMode ? '1px solid rgba(139, 92, 246, 0.3)' : '1px solid var(--gray-200)',
        marginTop: 'var(--space-6)',
        backgroundColor: gamingMode ? 'rgba(30, 27, 75, 0.5)' : 'var(--white)'
      }}>
        <p style={{ 
          fontWeight: '500',
          letterSpacing: '0.5px'
        }}>
          CareerPath Planner • Double-click tasks to edit • {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}

export default App;