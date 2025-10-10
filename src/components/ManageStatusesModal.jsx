// components/ManageStatusesModal.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Plus, GripVertical, X, Pencil, Trash2 } from 'lucide-react';
import { createPortal } from 'react-dom';
import '../styles/ManageStatusesModal.css';

const ManageStatusesModal = ({ isOpen, onClose, columns, columnOrder, onUpdateColumns }) => {
  const [localColumns, setLocalColumns] = useState(columns);
  const [localOrder, setLocalOrder] = useState(columnOrder);
  const [editingStatusId, setEditingStatusId] = useState(null);
  const [statusChildren, setStatusChildren] = useState({});
  const inputRef = useRef(null);

  useEffect(() => {
    if (editingStatusId && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingStatusId]);

  if (!isOpen) return null;

  const handleAddStatus = (categoryId) => {
    const newStatusId = `status-${Date.now()}`;
    const newStatus = {
      id: newStatusId,
      title: '',
      color: localColumns[categoryId].color,
      taskIds: []
    };

    setLocalColumns(prev => ({
      ...prev,
      [newStatusId]: newStatus
    }));

    setStatusChildren(prev => ({
      ...prev,
      [categoryId]: [...(prev[categoryId] || []), newStatusId]
    }));

    setEditingStatusId(newStatusId);
  };

  const handleStatusNameChange = (statusId, newTitle) => {
    setLocalColumns(prev => ({
      ...prev,
      [statusId]: {
        ...prev[statusId],
        title: newTitle
      }
    }));
  };

  const handleFinishEditing = (statusId) => {
    if (!localColumns[statusId]?.title.trim()) {
      handleStatusNameChange(statusId, 'New Status');
    }
    setEditingStatusId(null);
  };

  const handleKeyDown = (e, statusId) => {
    if (e.key === 'Enter') {
      handleFinishEditing(statusId);
    } else if (e.key === 'Escape') {
      setEditingStatusId(null);
    }
  };

  const handleRenameStatus = (statusId) => {
    setEditingStatusId(statusId);
  };

  const handleDeleteStatus = (categoryId, statusId) => {
    // Remove from statusChildren
    setStatusChildren(prev => ({
      ...prev,
      [categoryId]: prev[categoryId].filter(id => id !== statusId)
    }));

    // Remove from localColumns
    setLocalColumns(prev => {
      const newColumns = { ...prev };
      delete newColumns[statusId];
      return newColumns;
    });
  };

  const handleClose = () => {
    onClose();
  };

  const modalContent = (
    <>
      <div className="manage-statuses-overlay" onClick={handleClose} />

      <div className="manage-statuses-modal">
        <div className="manage-statuses-header">
          <h2>Manage Statuses</h2>
          <button className="close-button" onClick={handleClose}>
            <X size={20} />
          </button>
        </div>

        <div className="manage-statuses-info">
          <div className="info-text">
            <strong>
              💡 Drag statuses to reorder within categories or drag between categories to change their type.
            </strong>
            <br />
            <span className="info-subtext">
              ⚠️ Note: Each category must have at least one status. You cannot move a status if it's the only one in its category.
            </span>
          </div>
        </div>

        <div className="manage-statuses-content">
          {localOrder.map(columnId => {
            const column = localColumns[columnId];
            const childStatuses = statusChildren[columnId] || [];
            const totalStatusCount = 1 + childStatuses.length;

            return (
              <div key={columnId} className="status-category">
                <div className="category-header">
                  <h3 className="category-title">
                    {column.title}
                    <span className="status-count">{totalStatusCount}</span>
                  </h3>
                  <button 
                    className="add-status-btn"
                    onClick={() => handleAddStatus(columnId)}
                  >
                    <Plus size={14} />
                    Add Status
                  </button>
                </div>
                <hr className="divider color-gray w-full" />

                <div className="status-list">
                  {/* Main category status (always shows, no delete/rename) */}
                  <div className="status-item">
                    <div className="status-drag-handle">
                      <GripVertical size={16} />
                    </div>
                    <div 
                      className="status-color-indicator" 
                      style={{ backgroundColor: column.color }}
                    />
                    <span className="status-name">{column.title}</span>
                  </div>

                  {/* Child statuses (can be renamed and deleted) */}
                  {childStatuses.map(statusId => {
                    const status = localColumns[statusId];
                    if (!status) return null;

                    return (
                      <div key={statusId} className="status-item">
                        <div className="status-drag-handle">
                          <GripVertical size={16} />
                        </div>
                        <div 
                          className="status-color-indicator" 
                          style={{ backgroundColor: status.color }}
                        />
                        {editingStatusId === statusId ? (
                          <input
                            ref={inputRef}
                            type="text"
                            className="status-name-input"
                            value={status.title}
                            onChange={(e) => handleStatusNameChange(statusId, e.target.value)}
                            onBlur={() => handleFinishEditing(statusId)}
                            onKeyDown={(e) => handleKeyDown(e, statusId)}
                            placeholder="Enter status name"
                          />
                        ) : (
                          <span className="status-name">{status.title}</span>
                        )}
                        
                        {/* Action buttons (only for child statuses) */}
                        <div className="status-actions">
                          <button
                            className="status-action-btn rename-btn"
                            onClick={() => handleRenameStatus(statusId)}
                            title="Rename status"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            className="status-action-btn delete-btn"
                            onClick={() => handleDeleteStatus(columnId, statusId)}
                            title="Delete status"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="manage-statuses-footer">
          <button className="close-modal-btn" onClick={handleClose}>
            Close
          </button>
        </div>
      </div>
    </>
  );

  return createPortal(modalContent, document.body);
};

export default ManageStatusesModal;