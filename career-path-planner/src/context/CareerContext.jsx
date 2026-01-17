import React, { createContext, useState, useContext, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const CareerContext = createContext();

export const useCareer = () => useContext(CareerContext);

export const CareerProvider = ({ children }) => {
  const [careerData, setCareerData] = useLocalStorage('careerData', {
    title: 'My Career Journey',
    description: 'Plan your career growth and development',
    years: []
  });
  
  const [isLoggedIn, setIsLoggedIn] = useLocalStorage('isLoggedIn', false);
  const [user, setUser] = useLocalStorage('user', null);
  const [gamingMode, setGamingMode] = useState(false);
  const [expandedNodes, setExpandedNodes] = useState({
    years: {},
    months: {}
  });

  const toggleGamingMode = () => setGamingMode(!gamingMode);

  const toggleYear = (yearId) => {
    setExpandedNodes(prev => ({
      ...prev,
      years: {
        ...prev.years,
        [yearId]: !prev.years[yearId]
      }
    }));
  };

  const toggleMonth = (yearId, monthId) => {
    setExpandedNodes(prev => ({
      ...prev,
      months: {
        ...prev.months,
        [`${yearId}-${monthId}`]: !prev.months[`${yearId}-${monthId}`]
      }
    }));
  };

  const addYear = (yearData) => {
    const newYear = {
      ...yearData,
      id: `year-${Date.now()}`,
      months: []
    };
    
    setCareerData(prev => ({
      ...prev,
      years: [...prev.years, newYear]
    }));
    
    setExpandedNodes(prev => ({
      ...prev,
      years: {
        ...prev.years,
        [newYear.id]: true
      }
    }));
  };

  const addMonth = (yearId, monthData) => {
    const newMonth = {
      ...monthData,
      id: `month-${Date.now()}`,
      days: []
    };
    
    setCareerData(prev => ({
      ...prev,
      years: prev.years.map(year => 
        year.id === yearId 
          ? { ...year, months: [...year.months, newMonth] }
          : year
      )
    }));
  };

  const addDay = (yearId, monthId, dayData) => {
    const newDay = {
      ...dayData,
      id: `day-${Date.now()}`,
      tasks: []
    };
    
    setCareerData(prev => ({
      ...prev,
      years: prev.years.map(year => 
        year.id === yearId 
          ? {
              ...year,
              months: year.months.map(month =>
                month.id === monthId
                  ? { ...month, days: [...month.days, newDay] }
                  : month
              )
            }
          : year
      )
    }));
  };

  const addTask = (yearId, monthId, dayId, taskData) => {
    const newTask = {
      ...taskData,
      id: `task-${Date.now()}`,
      isCompleted: false
    };
    
    setCareerData(prev => ({
      ...prev,
      years: prev.years.map(year => 
        year.id === yearId 
          ? {
              ...year,
              months: year.months.map(month =>
                month.id === monthId
                  ? {
                      ...month,
                      days: month.days.map(day =>
                        day.id === dayId
                          ? { ...day, tasks: [...day.tasks, newTask] }
                          : day
                      )
                    }
                  : month
              )
            }
          : year
      )
    }));
  };

  const toggleTaskCompletion = (yearId, monthId, dayId, taskId) => {
    setCareerData(prev => ({
      ...prev,
      years: prev.years.map(year => 
        year.id === yearId 
          ? {
              ...year,
              months: year.months.map(month =>
                month.id === monthId
                  ? {
                      ...month,
                      days: month.days.map(day =>
                        day.id === dayId
                          ? {
                              ...day,
                              tasks: day.tasks.map(task =>
                                task.id === taskId
                                  ? { ...task, isCompleted: !task.isCompleted }
                                  : task
                              )
                            }
                          : day
                      )
                    }
                  : month
              )
            }
          : year
      )
    }));
  };

  const searchTasksByDate = (date) => {
    const allTasks = [];
    
    careerData.years.forEach(year => {
      year.months.forEach(month => {
        month.days.forEach(day => {
          if (day.date === date) {
            day.tasks.forEach(task => {
              allTasks.push({
                ...task,
                year: year.title,
                month: month.title,
                day: day.title
              });
            });
          }
        });
      });
    });
    
    return allTasks;
  };

  const loginUser = (email, password) => {
    setIsLoggedIn(true);
    setUser({
      email,
      name: email.split('@')[0],
      avatar: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=4361ee&color=fff`
    });
    return true;
  };

  const logoutUser = () => {
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <CareerContext.Provider value={{
      careerData,
      setCareerData,
      isLoggedIn,
      setIsLoggedIn,
      user,
      setUser,
      gamingMode,
      toggleGamingMode,
      expandedNodes,
      toggleYear,
      toggleMonth,
      addYear,
      addMonth,
      addDay,
      addTask,
      toggleTaskCompletion,
      searchTasksByDate,
      loginUser,
      logoutUser
    }}>
      {children}
    </CareerContext.Provider>
  );
};