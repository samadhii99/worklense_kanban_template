// Updated TaskCard.jsx with Portal-based DatePicker, AssigneeSelector, Date Selection, SubTask Integration, and Right-Click Delete

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Plus, Calendar, MoreHorizontal, ChevronDown, ChevronRight, ChevronLeft } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { tagLabels } from '../data/tagData';
import AssigneeSelector from './AssigneeSelector';
import SubTask from './SubTask';
import '../styles/TaskCard.css';
import '../styles/DatePicker.css';

// Add the TaskProgressCircle component
const TaskProgressCircle = ({ task, size = 28 }) => {
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
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
          fill="none"
          opacity="0.3"
        />
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

// Date Picker Component with React Portal
const DatePicker = ({ isOpen, onClose, currentDate, onDateSelect, position }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(currentDate ? new Date(currentDate) : new Date());
  const datePickerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        onClose();
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
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
    const startingDayOfWeek = (firstDay.getDay() + 6) % 7;

    const days = [];
    
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
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
      setSelectedDate(date);
      onDateSelect(date);
    }
  };

  const handleTodayClick = () => {
    const today = new Date();
    setSelectedDate(today);
    onDateSelect(today);
  };

  const handleTomorrowClick = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setSelectedDate(tomorrow);
    onDateSelect(tomorrow);
  };

  const handleNextWeekClick = () => {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    setSelectedDate(nextWeek);
    onDateSelect(nextWeek);
  };

  const handleClearClick = () => {
    setSelectedDate(null);
    onDateSelect(null);
  };

  const isToday = (date) => {
    const today = new Date();
    return date && date.toDateString() === today.toDateString();
  };

  const isSelected = (date) => {
    return selectedDate && date && date.toDateString() === selectedDate.toDateString();
  };

  const days = getDaysInMonth(currentMonth);

  // Calculate final position
  const pickerWidth = 208;
  const pickerHeight = 300;
  let finalTop = position.top;
  let finalLeft = position.left;

  // Adjust if going off screen
  if (finalLeft + pickerWidth > window.innerWidth) {
    finalLeft = window.innerWidth - pickerWidth - 10;
  }
  if (finalTop + pickerHeight > window.innerHeight) {
    finalTop = position.top - pickerHeight - 16;
  }
  if (finalTop < 10) {
    finalTop = 10;
  }

  const datePickerContent = (
    <>
      {/* Backdrop */}
      <div 
        className="date-picker-backdrop" 
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 99998,
          background: 'transparent'
        }}
      />
      
      {/* Date Picker Popup */}
      <div 
        ref={datePickerRef}
        className="date-picker-popup"
        style={{
          position: 'fixed',
          top: `${finalTop}px`,
          left: `${finalLeft}px`,
          zIndex: 99999
        }}
        onClick={(e) => e.stopPropagation()}
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
    </>
  );

  // Use React Portal to render outside of component tree
  return createPortal(datePickerContent, document.body);
};

const TaskCard = ({ task, isDragging, onTaskUpdate, onTaskDelete }) => {
  const [showSubtasks, setShowSubtasks] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showAssigneeSelector, setShowAssigneeSelector] = useState(false);
  const [datePickerPosition, setDatePickerPosition] = useState({ top: 0, left: 0 });
  const [assigneeSelectorPosition, setAssigneeSelectorPosition] = useState({ top: 0, left: 0 });
  const [taskDueDate, setTaskDueDate] = useState(task.dueDate);
  const [taskAssignees, setTaskAssignees] = useState(task.assignees || []);
  const [taskSubtasks, setTaskSubtasks] = useState(task.subtasks || []);
  const [contextMenu, setContextMenu] = useState({
    isOpen: false,
    position: { x: 0, y: 0 }
  });
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false
  });
  const dateButtonRef = useRef(null);
  const addAssigneeButtonRef = useRef(null);
  const cardRef = useRef(null);
  
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

  // Close context menu when clicking anywhere
  useEffect(() => {
    const handleClick = () => {
      if (contextMenu.isOpen) {
        setContextMenu({ isOpen: false, position: { x: 0, y: 0 } });
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [contextMenu.isOpen]);

  const handleRightClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    
    setContextMenu({
      isOpen: true,
      position: { x: event.clientX, y: event.clientY }
    });
  };

  const handleDeleteClick = () => {
    setDeleteModal({ isOpen: true });
    setContextMenu({ isOpen: false, position: { x: 0, y: 0 } });
  };

  const handleConfirmDelete = () => {
    if (onTaskDelete) {
      onTaskDelete(task.id);
    }
    setDeleteModal({ isOpen: false });
  };

  const handleCancelDelete = () => {
    setDeleteModal({ isOpen: false });
  };

  const handleDateClick = (event) => {
    event.stopPropagation();
    event.preventDefault();
    
    if (dateButtonRef.current) {
      const rect = dateButtonRef.current.getBoundingClientRect();
      
      setDatePickerPosition({
        top: rect.bottom + 8,
        left: rect.left
      });
    }
    setShowDatePicker(true);
  };

  const handleDateSelect = (date) => {
    let formattedDate;
    if (date) {
      const options = { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      };
      formattedDate = date.toLocaleDateString('en-US', options);
    } else {
      formattedDate = 'No due date';
    }
    
    setTaskDueDate(formattedDate);
    setShowDatePicker(false);
    
    // Optional: Call parent update function if provided
    if (onTaskUpdate) {
      onTaskUpdate(task.id, { dueDate: formattedDate });
    }
    
    console.log('Selected date:', formattedDate);
  };

  const handleAddAssigneeClick = (event) => {
    event.stopPropagation();
    event.preventDefault();
    
    if (addAssigneeButtonRef.current) {
      const rect = addAssigneeButtonRef.current.getBoundingClientRect();
      
      setAssigneeSelectorPosition({
        top: rect.bottom + 8,
        left: rect.left
      });
    }
    setShowAssigneeSelector(true);
  };

  const handleAssigneeAdd = (user) => {
    const newAssignees = [...taskAssignees, { id: user.id, avatar: user.avatar, name: user.name }];
    setTaskAssignees(newAssignees);
    
    // Optional: Call parent update function if provided
    if (onTaskUpdate) {
      onTaskUpdate(task.id, { assignees: newAssignees });
    }
    
    console.log('Added assignee:', user);
  };

  const handleAssigneeRemove = (userId) => {
    const newAssignees = taskAssignees.filter(assignee => assignee.id !== userId);
    setTaskAssignees(newAssignees);
    
    // Optional: Call parent update function if provided
    if (onTaskUpdate) {
      onTaskUpdate(task.id, { assignees: newAssignees });
    }
    
    console.log('Removed assignee:', userId);
  };

  const handleSubtasksUpdate = (taskId, updatedSubtasks) => {
    // Update local state
    setTaskSubtasks(updatedSubtasks);
    
    // Call parent update function if provided
    if (onTaskUpdate) {
      onTaskUpdate(taskId, { subtasks: updatedSubtasks });
    }
    
    console.log('Updated subtasks for task:', taskId, updatedSubtasks);
  };

  // Prevent dragging when clicking on interactive elements
  const handleInteractiveClick = (event) => {
    event.stopPropagation();
  };

  const handleInteractivePointerDown = (event) => {
    event.stopPropagation();
  };

  return (
    <>
      <div
        ref={(node) => {
          setNodeRef(node);
          cardRef.current = node;
        }}
        style={style}
        {...attributes}
        {...listeners}
        className={`task-card ${isDragging ? 'dragging' : ''}`}
        onContextMenu={handleRightClick}
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
          <button 
            className="task-menu"
            onClick={handleInteractiveClick}
            onPointerDown={handleInteractivePointerDown}
          >
            <MoreHorizontal size={16} />
          </button>
        </div>
        
        {/* Footer with date and assignees */}
        <div className="task-footer">
          <button 
            ref={dateButtonRef}
            className="task-date"
            onClick={handleDateClick}
            onPointerDown={handleInteractivePointerDown}
          >
            {taskDueDate}
          </button>
          
          <div className="task-right-section">
            <div className="task-assignees">
              {taskAssignees.map((assignee, index) => (
                <img
                  key={assignee.id}
                  src={assignee.avatar}
                  alt={assignee.name || `Assignee ${assignee.id}`}
                  className="assignee-avatar"
                  title={assignee.name || `Assignee ${assignee.id}`}
                />
              ))}
              <button 
                ref={addAssigneeButtonRef}
                className={`add-assignee-btn ${showAssigneeSelector ? 'active' : ''}`}
                onClick={handleAddAssigneeClick}
                onPointerDown={handleInteractivePointerDown}
                title="Add assignee"
              >
                <Plus size={12} />
              </button>
            </div> 

            {taskSubtasks && taskSubtasks.length > 0 && (
              <button
                type="button"
                className={`subtask-toggle-fork ${showSubtasks ? 'expanded' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowSubtasks(!showSubtasks);
                }}
                onPointerDown={handleInteractivePointerDown}
                title={showSubtasks ? 'Hide Subtasks' : 'Show Subtasks'}
              >
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
                  {taskSubtasks?.length || 0}
                </span>
                
                {showSubtasks ? (
                  <ChevronDown size={12} />
                ) : (
                  <ChevronRight size={12} />
                )}
              </button>
            )}
          </div>
        </div>
        
        {/* Subtasks Container - positioned after the footer */}
        {showSubtasks && (
          <div className="subtasks-container-wrapper">
            <SubTask 
              subtasks={taskSubtasks}
              onSubtasksUpdate={handleSubtasksUpdate}
              taskId={task.id}
            />
          </div>
        )}
      </div>

      {/* Date Picker rendered as Portal */}
      <DatePicker
        isOpen={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        currentDate={taskDueDate !== 'No due date' ? taskDueDate : null}
        onDateSelect={handleDateSelect}
        position={datePickerPosition}
      />

      {/* Assignee Selector rendered as Portal */}
      <AssigneeSelector
        isOpen={showAssigneeSelector}
        onClose={() => setShowAssigneeSelector(false)}
        position={assigneeSelectorPosition}
        currentAssignees={taskAssignees}
        onAssigneeAdd={handleAssigneeAdd}
        onAssigneeRemove={handleAssigneeRemove}
      />

      {/* Context Menu */}
      {contextMenu.isOpen && createPortal(
        <div
          className="task-context-menu"
          style={{
            position: 'fixed',
            top: `${contextMenu.position.y}px`,
            left: `${contextMenu.position.x}px`,
            zIndex: 100000
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button className="context-menu-item delete" onClick={handleDeleteClick}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
            </svg>
            Delete
          </button>
        </div>,
        document.body
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && createPortal(
        <div className="delete-modal-overlay">
          <div className="delete-modal">
            <div className="delete-modal-header">
              <div className="delete-modal-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                </svg>
              </div>
              <h3 className="delete-modal-title">Delete Task</h3>
            </div>
            <p className="delete-modal-message">
              Are you sure you want to delete this task? This action cannot be undone.
            </p>
            <div className="delete-modal-actions">
              <button className="delete-modal-btn cancel" onClick={handleCancelDelete}>
                Cancel
              </button>
              <button className="delete-modal-btn delete" onClick={handleConfirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default TaskCard;