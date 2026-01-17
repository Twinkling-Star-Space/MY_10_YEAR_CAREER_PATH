// Career data model and types
export const TaskTypes = {
  YEAR: 'year',
  MONTH: 'month',
  DAY: 'day',
  TASK: 'task'
};

export const TaskStatus = {
  NOT_STARTED: 'not_started',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  BLOCKED: 'blocked'
};

// Base task interface
export const BaseTask = {
  id: '',
  title: '',
  description: '',
  type: '',
  status: TaskStatus.NOT_STARTED,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  isCompleted: false,
  priority: 'medium', // 'low', 'medium', 'high', 'urgent'
  tags: [],
  notes: ''
};

// Extended models
export const YearPlan = {
  ...BaseTask,
  type: TaskTypes.YEAR,
  yearNumber: 0,
  startDate: '',
  endDate: '',
  months: [],
  totalMonths: 12,
  completedMonths: 0,
  progress: 0
};

export const MonthPlan = {
  ...BaseTask,
  type: TaskTypes.MONTH,
  monthNumber: 0,
  yearId: '',
  days: [],
  totalDays: 0,
  completedDays: 0
};

export const DayPlan = {
  ...BaseTask,
  type: TaskTypes.DAY,
  date: '',
  monthId: '',
  tasks: [],
  totalTasks: 0,
  completedTasks: 0
};

export const DailyTask = {
  ...BaseTask,
  type: TaskTypes.TASK,
  dayId: '',
  estimatedTime: 0, // in hours
  actualTime: 0,
  dependencies: [], // array of task IDs
  deadline: '',
  reminders: []
};

// Career goal model
export const CareerGoal = {
  id: '',
  title: '',
  description: '',
  targetRole: '',
  targetIndustry: '',
  targetSalary: 0,
  targetDate: '', // when you want to achieve this
  currentRole: '',
  currentIndustry: '',
  currentSalary: 0,
  skillsRequired: [],
  certificationsNeeded: [],
  years: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  isActive: true,
  progress: 0
};

// User model
export const User = {
  id: '',
  email: '',
  name: '',
  avatar: '',
  currentRole: '',
  experience: 0, // in years
  skills: [],
  careerGoals: [],
  settings: {
    theme: 'light', // 'light', 'dark', 'gaming'
    notifications: true,
    weeklyRecap: true,
    defaultView: 'timeline' // 'timeline', 'calendar', 'kanban'
  }
};

// Create factory functions for generating instances
export const createCareerGoal = (data) => ({
  ...CareerGoal,
  id: `career-${Date.now()}`,
  ...data
});

export const createYearPlan = (yearNumber, parentId) => ({
  ...YearPlan,
  id: `year-${Date.now()}`,
  yearNumber,
  title: `Year ${yearNumber}`,
  description: `Plan for year ${yearNumber}`,
  startDate: new Date(new Date().getFullYear() + yearNumber - 1, 0, 1).toISOString().split('T')[0],
  endDate: new Date(new Date().getFullYear() + yearNumber - 1, 11, 31).toISOString().split('T')[0],
  months: Array.from({ length: 12 }, (_, i) => createMonthPlan(i + 1, `year-${Date.now()}`))
});

export const createMonthPlan = (monthNumber, yearId) => ({
  ...MonthPlan,
  id: `month-${Date.now()}`,
  monthNumber,
  yearId,
  title: `Month ${monthNumber}`,
  description: `Plan for month ${monthNumber}`,
  days: []
});

export const createDayPlan = (date, monthId) => ({
  ...DayPlan,
  id: `day-${Date.now()}`,
  date,
  monthId,
  title: `Day: ${new Date(date).toLocaleDateString()}`,
  tasks: []
});

export const createDailyTask = (title, dayId) => ({
  ...DailyTask,
  id: `task-${Date.now()}`,
  dayId,
  title,
  description: ''
});

// Helper functions
export const calculateProgress = (items) => {
  if (items.length === 0) return 0;
  const completed = items.filter(item => item.isCompleted).length;
  return Math.round((completed / items.length) * 100);
};

export const getDefaultCareerData = () => ({
  ...createCareerGoal({
    title: 'My Career Journey',
    description: 'Plan your career growth and development',
    targetRole: 'Senior Developer',
    targetIndustry: 'Technology',
    years: [
      createYearPlan(1, 'career-1'),
      createYearPlan(2, 'career-1'),
      createYearPlan(3, 'career-1')
    ]
  })
});

// Validation schemas (optional - if using form validation)
export const validationSchemas = {
  careerGoal: {
    title: { required: true, minLength: 3, maxLength: 100 },
    description: { required: false, maxLength: 500 },
    targetDate: { required: true, isFutureDate: true }
  },
  task: {
    title: { required: true, minLength: 1, maxLength: 200 },
    description: { required: false, maxLength: 1000 }
  }
};

// Sample data for development/testing
export const sampleCareerData = getDefaultCareerData();