// components/KanbanColumn.jsx
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import TaskCard from './TaskCard';
import '../styles/KanbanColumn.css';

const KanbanColumn = ({ column, tasks, onAddTask }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');

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

  return (
    <div ref={setNodeRef} style={style} className="kanban-column">
      
      <div className={`column-header ${column.id}`}>
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
    <button className="column-menu-button">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <circle cx="3" cy="8" r="1.5"/>
        <circle cx="8" cy="8" r="1.5"/>
        <circle cx="13" cy="8" r="1.5"/>
      </svg>
    </button>
  </div>
</div>
      
      <div className="column-tasks">
        <SortableContext items={tasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
          {tasks.map(task => (
            <TaskCard key={task.id} task={task} />
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