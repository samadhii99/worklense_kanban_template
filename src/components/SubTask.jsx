import React, { useState, useRef, useEffect } from 'react';
import { Plus, X, Check } from 'lucide-react';
import '../styles/SubTask.css';

const SubTask = ({ subtasks = [], onSubtasksUpdate, taskId }) => {
  const [localSubtasks, setLocalSubtasks] = useState(subtasks);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const inputRef = useRef(null);

  // Focus input when adding new subtask
  useEffect(() => {
    if (isAddingNew && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAddingNew]);

  const handleToggleSubtask = (subtaskId) => {
    const updatedSubtasks = localSubtasks.map(subtask =>
      subtask.id === subtaskId
        ? { ...subtask, completed: !subtask.completed }
        : subtask
    );
    setLocalSubtasks(updatedSubtasks);
    onSubtasksUpdate && onSubtasksUpdate(taskId, updatedSubtasks);
  };

  const handleDeleteSubtask = (subtaskId) => {
    const updatedSubtasks = localSubtasks.filter(subtask => subtask.id !== subtaskId);
    setLocalSubtasks(updatedSubtasks);
    onSubtasksUpdate && onSubtasksUpdate(taskId, updatedSubtasks);
  };

  const handleAddSubtask = () => {
    if (newSubtaskTitle.trim()) {
      const newSubtask = {
        id: `subtask_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title: newSubtaskTitle.trim(),
        completed: false
      };
      const updatedSubtasks = [...localSubtasks, newSubtask];
      setLocalSubtasks(updatedSubtasks);
      onSubtasksUpdate && onSubtasksUpdate(taskId, updatedSubtasks);
      setNewSubtaskTitle('');
      setIsAddingNew(false);
    }
  };

  const handleCancelAdd = () => {
    setNewSubtaskTitle('');
    setIsAddingNew(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddSubtask();
    } else if (e.key === 'Escape') {
      handleCancelAdd();
    }
  };

  const handleInputBlur = () => {
    // Small delay to allow click events on buttons to register
    setTimeout(() => {
      if (newSubtaskTitle.trim()) {
        handleAddSubtask();
      } else {
        handleCancelAdd();
      }
    }, 150);
  };

  return (
    <div className="subtasks-container">
      {/* Subtasks List */}
      {localSubtasks.length > 0 && (
        <div className="subtasks-list">
          {localSubtasks.map(subtask => (
            <div key={subtask.id} className="subtask-item">
              {/* Medium priority dot */}
              <div className="subtask-priority-dot"></div>
              
              <button
                className={`subtask-checkbox ${subtask.completed ? 'completed' : ''}`}
                onClick={() => handleToggleSubtask(subtask.id)}
                title={subtask.completed ? 'Mark as incomplete' : 'Mark as complete'}
              >
                {subtask.completed && <Check size={12} />}
              </button>
              
              <span 
                className={`subtask-title ${subtask.completed ? 'completed' : ''}`}
                title={subtask.title}
              >
                {subtask.title}
              </span>
              
              <button
                className="subtask-delete"
                onClick={() => handleDeleteSubtask(subtask.id)}
                title="Delete subtask"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add New Subtask Form */}
      {isAddingNew ? (
        <div className="subtask-add-form">
          <div className="subtask-priority-dot"></div>
          <input
            ref={inputRef}
            type="text"
            value={newSubtaskTitle}
            onChange={(e) => setNewSubtaskTitle(e.target.value)}
            onKeyPress={handleKeyPress}
            onBlur={handleInputBlur}
            placeholder="Enter subtask..."
            className="subtask-input"
            maxLength={100}
          />
          <div className="subtask-form-actions">
            <button
              className="subtask-form-btn save"
              onClick={handleAddSubtask}
              disabled={!newSubtaskTitle.trim()}
              title="Add subtask"
            >
              <Check size={12} />
            </button>
            <button
              className="subtask-form-btn cancel"
              onClick={handleCancelAdd}
              title="Cancel"
            >
              <X size={12} />
            </button>
          </div>
        </div>
      ) : (
        <div className="add-subtask-wrapper">
          <button
            className="add-subtask-btn"
            onClick={() => setIsAddingNew(true)}
            title="Add subtask"
          >
            <Plus size={12} />
            <span>Add subtask</span>
          </button>
          
          {/* Add assignee button for subtasks */}
          <button className="add-assignee-btn-subtask" title="Add assignee">
            <Plus size={12} />
          </button>
        </div>
      )}
    </div>
  );
};

export default SubTask;