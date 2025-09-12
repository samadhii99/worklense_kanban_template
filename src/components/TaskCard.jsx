// components/TaskCard.jsx
import React, { useState } from 'react';
import { Plus, Calendar, MoreHorizontal, ChevronDown, ChevronRight } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { tagLabels } from '../data/tagData';
import '../styles/TaskCard.css';

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

const TaskCard = ({ task, isDragging }) => {
  const [showSubtasks, setShowSubtasks] = useState(false);
  
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
        {task.tags.map(tag => (
          <span key={tag} className={`task-tag ${tag}`}>
            {tagLabels[tag] || tag}
          </span>
        ))}
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
        <div className="task-date">
          {task.dueDate}
        </div>
        
        <div className="task-right-section">
          {/* Add Task Progress Circle here */}
          <div className="task-progress-wrapper">
            <TaskProgressCircle task={task} size={24} />
          </div>

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
    </div>
  );
};

export default TaskCard;