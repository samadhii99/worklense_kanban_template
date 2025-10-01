import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Plus, X, Check } from 'lucide-react';
import AssigneeSelector from './AssigneeSelector';
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
  const [contextMenu, setContextMenu] = useState({
    isOpen: false,
    position: { x: 0, y: 0 },
    subtaskId: null
  });
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    subtaskId: null,
    subtaskTitle: ''
  });
  const inputRef = useRef(null);

  // Focus input when adding new subtask
  useEffect(() => {
    if (isAddingNew && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAddingNew]);

  // Close context menu when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (contextMenu.isOpen && !e.target.closest('.task-context-menu, .subtask-context-menu')) {
        setContextMenu({ isOpen: false, position: { x: 0, y: 0 }, subtaskId: null });
      }
    };

    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [contextMenu.isOpen]);

  // Listen for close all context menus event
  useEffect(() => {
    const handleCloseAll = () => {
      setContextMenu({ isOpen: false, position: { x: 0, y: 0 }, subtaskId: null });
    };
    
    document.addEventListener('closeAllContextMenus', handleCloseAll);
    return () => document.removeEventListener('closeAllContextMenus', handleCloseAll);
  }, []);

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
        assignees: []
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

  // Handle right-click on subtask - prevent it from bubbling to TaskCard
  const handleSubtaskContextMenu = (e, subtaskId) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Close all other context menus first
    document.dispatchEvent(new CustomEvent('closeAllContextMenus'));
    
    setContextMenu({
      isOpen: true,
      position: { x: e.clientX, y: e.clientY },
      subtaskId: subtaskId
    });
  };

  const handleDeleteClick = (subtaskId, subtaskTitle) => {
    setDeleteModal({ 
      isOpen: true, 
      subtaskId: subtaskId,
      subtaskTitle: subtaskTitle
    });
    setContextMenu({ isOpen: false, position: { x: 0, y: 0 }, subtaskId: null });
  };

  const handleConfirmDelete = () => {
    if (deleteModal.subtaskId) {
      handleDeleteSubtask(deleteModal.subtaskId);
    }
    setDeleteModal({ isOpen: false, subtaskId: null, subtaskTitle: '' });
  };

  const handleCancelDelete = () => {
    setDeleteModal({ isOpen: false, subtaskId: null, subtaskTitle: '' });
  };

  // Handle Delete key for subtasks
  const handleSubtaskKeyDown = (e, subtaskId, subtaskTitle) => {
    // Only delete subtask if Delete or Backspace is pressed
    if (e.key === 'Delete' || e.key === 'Backspace') {
      e.preventDefault();
      e.stopPropagation();
      
      // Also stop the event at the native level
      if (e.nativeEvent) {
        e.nativeEvent.stopImmediatePropagation();
      }
      
      // Open delete modal instead of directly deleting
      setDeleteModal({ 
        isOpen: true, 
        subtaskId: subtaskId,
        subtaskTitle: subtaskTitle
      });
      
      // Return false to stop all propagation
      return false;
    }
  };

  const handleInputBlur = () => {
    setTimeout(() => {
      if (newSubtaskTitle.trim()) {
        handleAddSubtask();
      } else {
        handleCancelAdd();
      }
    }, 150);
  };

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

  const handleCloseAssigneeSelector = () => {
    setAssigneeSelectorState({
      isOpen: false,
      position: { top: 0, left: 0 },
      subtaskId: null
    });
  };

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

  const getCurrentAssignees = () => {
    if (!assigneeSelectorState.subtaskId) return [];
    const subtask = localSubtasks.find(s => s.id === assigneeSelectorState.subtaskId);
    return subtask?.assignees || [];
  };

  return (
    <>
      <div className="subtasks-container">
        {localSubtasks.length > 0 && (
          <>
            <div className="subtasks-border-top"></div>
            <div className="subtasks-list">
              {localSubtasks.map(subtask => (
                <div 
                  key={subtask.id} 
                  className="subtask-item"
                  tabIndex={0}
                  onKeyDownCapture={(e) => handleSubtaskKeyDown(e, subtask.id, subtask.title)}
                  onContextMenu={(e) => handleSubtaskContextMenu(e, subtask.id)}
                >
                  <div className="subtask-priority-dot"></div>
                  
                  <span 
                    className={`subtask-title ${subtask.completed ? 'completed' : ''}`}
                    title={subtask.title}
                  >
                    {subtask.title}
                  </span>
                  
                  <div className="subtask-assignees-wrapper">
                    {subtask.assignees && subtask.assignees.length > 0 && (
                      <div className="subtask-assignees">
                        {subtask.assignees.slice(0, 2).map((assignee) => (
                          <img
                            key={assignee.id}
                            src={assignee.avatar}
                            alt={assignee.name || `Assignee ${assignee.id}`}
                            className="subtask-assignee-avatar"
                            title={assignee.name || `Assignee ${assignee.id}`}
                          />
                        ))}
                        {subtask.assignees.length > 2 && (
                          <div className="subtask-assignee-more" title={subtask.assignees.slice(2).map(a => a.name).join(', ')}>
                            +{subtask.assignees.length - 2}
                          </div>
                        )}
                      </div>
                    )}
                    
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

        <AssigneeSelector
          isOpen={assigneeSelectorState.isOpen}
          onClose={handleCloseAssigneeSelector}
          position={assigneeSelectorState.position}
          currentAssignees={getCurrentAssignees()}
          onAssigneeAdd={handleAssigneeAdd}
          onAssigneeRemove={handleAssigneeRemove}
        />
      </div>

      {/* Context Menu */}
      {contextMenu.isOpen && createPortal(
        <div
          className="subtask-context-menu"
          style={{
            position: 'fixed',
            top: `${contextMenu.position.y}px`,
            left: `${contextMenu.position.x}px`,
            zIndex: 100000
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button 
            className="context-menu-item delete" 
            onClick={() => {
              const subtask = localSubtasks.find(s => s.id === contextMenu.subtaskId);
              handleDeleteClick(contextMenu.subtaskId, subtask?.title || '');
            }}
          >
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
                <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                </svg>
              </div>
              <h3 className="delete-modal-title">Delete Subtask</h3>
            </div>
            <p className="delete-modal-message">
              Are you sure you want to delete "{deleteModal.subtaskTitle}"? This action cannot be undone.
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

export default SubTask;