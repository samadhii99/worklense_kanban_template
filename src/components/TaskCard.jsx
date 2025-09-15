// components/TaskCard.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Plus, Calendar, MoreHorizontal, ChevronDown, ChevronRight, ChevronLeft } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { tagLabels } from '../data/tagData';
import '../styles/TaskCard.css';
import '../styles/DatePicker.css';

// Add the TaskProgressCircle component
const TaskProgressCircle = ({ task, size = 28 }) => {
  // Assuming task has a progress property (0-100) or complete_ratio
  const progress = typeof task.complete_ratio === 'number'
    ? task.complete_ratio
    : (typeof task.progress === 'number' ? task.progress : 0);
  
  const strokeWidth = 1.5;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;
  
  return (
    <div className="task-progress-circle">
      <svg width={size} height={size} style={{ display: 'block' }}>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
          fill="none"
          opacity="0.3"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={progress === 100 ? "#22c55e" : "#3b82f6"}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ 
            transition: 'stroke-dashoffset 0.3s',
            transform: 'rotate(-90deg)',
            transformOrigin: '50% 50%'
          }}
        />
        {progress === 100 ? (
          // Green checkmark icon
          <g>
            <circle cx={size / 2} cy={size / 2} r={radius} fill="#22c55e" opacity="0.15" />
            <svg x={(size/2)-(size*0.22)} y={(size/2)-(size*0.22)} width={size*0.44} height={size*0.44} viewBox="0 0 24 24">
              <path d="M5 13l4 4L19 7" stroke="#22c55e" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </g>
        ) : progress > 0 && (
          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={size * 0.38}
            fill="#3b82f6"
            fontWeight="bold"
          >
            {Math.round(progress)}
          </text>
        )}
      </svg>
    </div>
  );
};

// Date Picker Component
const DatePicker = ({ isOpen, onClose, currentDate, onDateSelect, position }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const datePickerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = (firstDay.getDay() + 6) % 7; // Convert to Monday = 0

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const navigateMonth = (direction) => {
    setCurrentMonth(prevMonth => {
      const newMonth = new Date(prevMonth);
      newMonth.setMonth(prevMonth.getMonth() + direction);
      return newMonth;
    });
  };

  const handleDateClick = (date) => {
    if (date) {
      onDateSelect(date);
      onClose();
    }
  };

  const handleTodayClick = () => {
    const today = new Date();
    onDateSelect(today);
    onClose();
  };

  const handleTomorrowClick = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    onDateSelect(tomorrow);
    onClose();
  };

  const handleNextWeekClick = () => {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    onDateSelect(nextWeek);
    onClose();
  };

  const handleClearClick = () => {
    onDateSelect(null);
    onClose();
  };

  const isToday = (date) => {
    const today = new Date();
    return date && date.toDateString() === today.toDateString();
  };

  const isSelected = (date) => {
    return currentDate && date && date.toDateString() === new Date(currentDate).toDateString();
  };

  const days = getDaysInMonth(currentMonth);

      return (
    <div 
      ref={datePickerRef}
      className="date-picker-popup"
      style={{
        position: 'fixed',
        top: `${position.top}px`,
        left: `${position.left}px`,
        zIndex: 10000
      }}
    >
      <div className="date-picker-header">
        <button 
          className="nav-button"
          onClick={() => navigateMonth(-1)}
        >
          <ChevronLeft size={16} />
        </button>
        <h3 className="month-year">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>
        <button 
          className="nav-button"
          onClick={() => navigateMonth(1)}
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="calendar-grid">
        <div className="day-headers">
          {dayNames.map(day => (
            <div key={day} className="day-header">{day}</div>
          ))}
        </div>
        
        <div className="dates-grid">
          {days.map((date, index) => (
            <button
              key={index}
              className={`date-cell ${!date ? 'empty' : ''} ${isToday(date) ? 'today' : ''} ${isSelected(date) ? 'selected' : ''}`}
              onClick={() => handleDateClick(date)}
              disabled={!date}
            >
              {date ? date.getDate() : ''}
            </button>
          ))}
        </div>
      </div>

      <div className="date-picker-actions">
        <div className="action-buttons-row">
          <button className="action-button primary" onClick={handleTodayClick}>
            Today
          </button>
          <button className="action-button clear" onClick={handleClearClick}>
            Clear
          </button>
        </div>
        <div className="action-buttons-row-2">
          <button className="action-button secondary" onClick={handleTomorrowClick}>
            Tomorrow
          </button>
          <button className="action-button secondary" onClick={handleNextWeekClick}>
            Next week
          </button>
        </div>
      </div>
    </div>
  );
};

const TaskCard = ({ task, isDragging }) => {
  const [showSubtasks, setShowSubtasks] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerPosition, setDatePickerPosition] = useState({ top: 0, left: 0 });
  const dateButtonRef = useRef(null);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

const handleDateClick = (event) => {
  event.stopPropagation();
  if (dateButtonRef.current) {
    const rect = dateButtonRef.current.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    
    setDatePickerPosition({
      top: rect.bottom + scrollTop + 5,
      left: rect.left + scrollLeft
    });
  }
  setShowDatePicker(!showDatePicker);
};


  const handleDateSelect = (date) => {
    // Here you would update the task's due date
    console.log('Selected date:', date);
    // You can implement the actual date update logic here
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`task-card ${isDragging ? 'dragging' : ''}`}
    >
      {/* Tags at the top */}
      <div className="task-tags">
        <div className="tags-left">
          {task.tags.map(tag => (
            <span key={tag} className={`task-tag ${tag}`}>
              {tagLabels[tag] || tag}
            </span>
          ))}
        </div>
        <div className="task-progress-wrapper">
          <TaskProgressCircle task={task} size={20} />
        </div>
      </div>
      
      {/* Title with priority indicator */}
      <div className="task-header">
        <div className="task-title-section">
          <div className={`task-priority ${task.priority}`}></div>
          <h4 className="task-title">{task.title}</h4>
        </div>
        <button className="task-menu">
          <MoreHorizontal size={16} />
        </button>
      </div>
      
      {/* Subtasks */}
      {showSubtasks && task.subtasks && task.subtasks.length > 0 && (
        <div className="subtasks-list">
          {task.subtasks.map(subtask => (
            <div key={subtask.id} className="subtask-item">
              <div className="subtask-checkbox" style={{
                backgroundColor: subtask.completed ? '#10b981' : 'transparent'
              }}></div>
              <span style={{ 
                textDecoration: subtask.completed ? 'line-through' : 'none',
                color: subtask.completed ? '#9ca3af' : '#6b7280'
              }}>
                {subtask.title}
              </span>
            </div>
          ))}
        </div>
      )}
      
      {/* Footer with date and assignees */}
      <div className="task-footer">
        <button 
          ref={dateButtonRef}
          className="task-date"
          onClick={handleDateClick}
        >
          {task.dueDate || 'No due date'}
        </button>
        
        <div className="task-right-section">
          <div className="task-assignees">
            {task.assignees.map((assignee, index) => (
              <img
                key={assignee.id}
                src={assignee.avatar}
                alt={`Assignee ${assignee.id}`}
                className="assignee-avatar"
              />
            ))}
            <button className="add-assignee-btn">
              <Plus size={12} />
            </button>
          </div> 

          {task.subtasks && task.subtasks.length > 0 && (
            <button
              type="button"
              className={`subtask-toggle-fork ${showSubtasks ? 'expanded' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                setShowSubtasks(!showSubtasks);
              }}
              title={showSubtasks ? 'Hide Subtasks' : 'Show Subtasks'}
            >
              {/* Fork/branch icon */}
              <svg 
                className="fork-svg-icon" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 20 20"
              >
                <path d="M6 3v2a2 2 0 002 2h4a2 2 0 002 2v2" strokeLinecap="round" />
                <circle cx="6" cy="3" r="2" fill="currentColor" />
                <circle cx="16" cy="9" r="2" fill="currentColor" />
                <circle cx="6" cy="17" r="2" fill="currentColor" />
                <path d="M6 5v10" strokeLinecap="round" />
              </svg>
              
              <span className="subtask-count">
                {task.subtasks?.length || 0}
              </span>
              
              {/* Caret icon */}
              {showSubtasks ? (
                <ChevronDown size={12} />
              ) : (
                <ChevronRight size={12} />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Date Picker Popup */}
      <DatePicker
  isOpen={showDatePicker}
  onClose={() => setShowDatePicker(false)}
  currentDate={task.dueDate}
  onDateSelect={handleDateSelect}
  position={datePickerPosition}
/>
    </div>
  );
};

export default TaskCard;