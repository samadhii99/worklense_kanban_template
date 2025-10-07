// components/KanbanColumn.jsx - Fixed
import React, { useState } from 'react';
import { Plus, MoreHorizontal, SquarePen, Trash2 } from 'lucide-react';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import TaskCard from './TaskCard';
import '../styles/KanbanColumn.css';

const KanbanColumn = ({ column, tasks, onAddTask, onTaskDelete, onTaskUpdate, activeTaskId, groupBy }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: column.id, data: { type: 'column' } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      onAddTask(column.id, newTaskTitle.trim());
      setNewTaskTitle('');
      setShowAddForm(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddTask();
    } else if (e.key === 'Escape') {
      setShowAddForm(false);
      setNewTaskTitle('');
    }
  };

  const handleColumnMenuClick = (e) => {
    e.stopPropagation();
    setShowDropdown(!showDropdown);
  };

  const handleDropdownClose = () => {
    setShowDropdown(false);
  };

  const handleDropdownAction = (action) => {
    console.log(`Column ${column.id} action:`, action);
    setShowDropdown(false);
  };

  return (
    <div ref={setNodeRef} style={style} className="kanban-column">
      
      <div className={`column-header ${groupBy === 'Priority' ? column.id : column.id}`}>
        <div className="column-title">
          {column.title}
          <span className="column-count">({tasks.length})</span>
        </div>
        <div className="column-header-actions">
          <button
            className="add-task-button"
            onClick={() => setShowAddForm(true)}
          >
            <Plus size={16} />
          </button>
          <button 
            className="column-menu-button" 
            onClick={handleColumnMenuClick}
          >
            <MoreHorizontal size={16} />
          </button>

          {showDropdown && (
            <>
              <div className="dropdown-overlay" onClick={handleDropdownClose} />
              <div className="column-dropdown">
                <button 
                  className="dropdown-item" 
                  onClick={() => handleDropdownAction('edit')}
                >
                  <SquarePen size={14} />
                  Rename
                </button>
                
                <div className="dropdown-separator" />
                
                <div className="dropdown-section">
                  <div className="Change-Category">CHANGE CATEGORY</div>
                  <button onClick={() => handleDropdownAction('move-todo')}>
                    <span className='font-bold'>To do</span>
                  </button>
                  <button onClick={() => handleDropdownAction('move-doing')}>
                    <span className='font-bold'>Doing</span>
                  </button>
                  <button onClick={() => handleDropdownAction('move-done')}>
                    <span className='font-bold'>Done</span>
                  </button>
                </div>
                
                <div className="dropdown-separator" />
                
                <button 
                  className="dropdown-item danger" 
                  onClick={() => handleDropdownAction('delete')}
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      
      <div className="column-tasks">
        <SortableContext items={tasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
          {tasks.map(task => (
            <TaskCard 
              key={task.id} 
              task={task}
              onTaskDelete={onTaskDelete}
              onTaskUpdate={onTaskUpdate}
            />
          ))}
        </SortableContext>
        
        {showAddForm ? (
          <div className="add-task-form">
            <textarea
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Enter a title for this card..."
              className="add-task-input"
              autoFocus
            />
            <div className="add-task-actions">
              <button 
                className="btn btn-primary"
                onClick={handleAddTask}
                disabled={!newTaskTitle.trim()}
              >
                Add Task
              </button>
              <button 
                className="btn btn-secondary"
                onClick={() => {
                  setShowAddForm(false);
                  setNewTaskTitle('');
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div 
            className="add-task-card"
            onClick={() => setShowAddForm(true)}
          >
            <Plus size={16} />
            Add Task
          </div>
        )}
      </div>
      
    </div>
  );
};

export default KanbanColumn;