import React, { useState, useRef, useEffect } from 'react';
import { Plus, X, Check } from 'lucide-react';
import AssigneeSelector from './AssigneeSelector'; // Import the AssigneeSelector component
import '../styles/SubTask.css';

const SubTask = ({ subtasks = [], onSubtasksUpdate, taskId }) => {
  const [localSubtasks, setLocalSubtasks] = useState(subtasks);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [assigneeSelectorState, setAssigneeSelectorState] = useState({
    isOpen: false,
    position: { top: 0, left: 0 },
    subtaskId: null
  });
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
        completed: false,
        assignees: [] // Add assignees array for new subtasks
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

  // Handle assignee button click
  const handleAssigneeButtonClick = (event, subtaskId) => {
    event.stopPropagation();
    const buttonRect = event.target.getBoundingClientRect();
    
    setAssigneeSelectorState({
      isOpen: true,
      position: {
        top: buttonRect.bottom + 5,
        left: buttonRect.left
      },
      subtaskId: subtaskId
    });
  };

  // Close assignee selector
  const handleCloseAssigneeSelector = () => {
    setAssigneeSelectorState({
      isOpen: false,
      position: { top: 0, left: 0 },
      subtaskId: null
    });
  };

  // Add assignee to subtask
  const handleAssigneeAdd = (user) => {
    const updatedSubtasks = localSubtasks.map(subtask => {
      if (subtask.id === assigneeSelectorState.subtaskId) {
        const currentAssignees = subtask.assignees || [];
        const isAlreadyAssigned = currentAssignees.some(assignee => assignee.id === user.id);
        
        if (!isAlreadyAssigned) {
          return {
            ...subtask,
            assignees: [...currentAssignees, user]
          };
        }
      }
      return subtask;
    });
    
    setLocalSubtasks(updatedSubtasks);
    onSubtasksUpdate && onSubtasksUpdate(taskId, updatedSubtasks);
  };

  // Remove assignee from subtask
  const handleAssigneeRemove = (userId) => {
    const updatedSubtasks = localSubtasks.map(subtask => {
      if (subtask.id === assigneeSelectorState.subtaskId) {
        const currentAssignees = subtask.assignees || [];
        return {
          ...subtask,
          assignees: currentAssignees.filter(assignee => assignee.id !== userId)
        };
      }
      return subtask;
    });
    
    setLocalSubtasks(updatedSubtasks);
    onSubtasksUpdate && onSubtasksUpdate(taskId, updatedSubtasks);
  };

  // Get current assignees for the selected subtask
  const getCurrentAssignees = () => {
    if (!assigneeSelectorState.subtaskId) return [];
    const subtask = localSubtasks.find(s => s.id === assigneeSelectorState.subtaskId);
    return subtask?.assignees || [];
  };

  return (
    <div className="subtasks-container">
      {/* Subtasks List */}
      {localSubtasks.length > 0 && (
        <>
          <div className="subtasks-border-top"></div>
          <div className="subtasks-list">
          {localSubtasks.map(subtask => (
            <div key={subtask.id} className="subtask-item">
              {/* Medium priority dot */}
              <div className="subtask-priority-dot"></div>
              
              <span 
                className={`subtask-title ${subtask.completed ? 'completed' : ''}`}
                title={subtask.title}
              >
                {subtask.title}
              </span>
              
              <div className="subtask-assignees-wrapper">
                {/* Display assigned avatars */}
                {subtask.assignees && subtask.assignees.length > 0 && (
                  <div className="subtask-assignees">
                    {subtask.assignees.map((assignee) => (
                      <img
                        key={assignee.id}
                        src={assignee.avatar}
                        alt={assignee.name || `Assignee ${assignee.id}`}
                        className="subtask-assignee-avatar"
                        title={assignee.name || `Assignee ${assignee.id}`}
                      />
                    ))}
                  </div>
                )}
                
                {/* Add assignee button */}
                <button
                  className="add-assignee-btn-subtask"
                  title="Add assignee"
                  onClick={(e) => handleAssigneeButtonClick(e, subtask.id)}
                >
                  <Plus size={12} />
                </button>
              </div>
            </div>
          ))}
          </div>
        </>
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
         
        </div>
      )}

      {/* Assignee Selector Popup */}
      <AssigneeSelector
        isOpen={assigneeSelectorState.isOpen}
        onClose={handleCloseAssigneeSelector}
        position={assigneeSelectorState.position}
        currentAssignees={getCurrentAssignees()}
        onAssigneeAdd={handleAssigneeAdd}
        onAssigneeRemove={handleAssigneeRemove}
      />
    </div>
  );
};

export default SubTask;