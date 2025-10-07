// components/ManageStatusesModal.jsx
import React, { useState } from 'react';
import { Plus, GripVertical, X } from 'lucide-react';
import { createPortal } from 'react-dom';
import '../styles/ManageStatusesModal.css';

const ManageStatusesModal = ({ isOpen, onClose, columns, columnOrder, onUpdateColumns }) => {
  const [localColumns, setLocalColumns] = useState(columns);
  const [localOrder, setLocalOrder] = useState(columnOrder);

  if (!isOpen) return null;

  const handleAddStatus = (categoryId) => {
    const newStatusId = `status-${Date.now()}`;
    const newStatus = {
      id: newStatusId,
      title: 'New Status',
      color: '#e5e7eb',
      taskIds: []
    };

    setLocalColumns(prev => ({
      ...prev,
      [newStatusId]: newStatus
    }));

    // Add to the end of the order
    setLocalOrder(prev => [...prev, newStatusId]);
  };

  const handleClose = () => {
    // You can add save logic here if needed
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
          <div className="info-icon">💡</div>
          <div className="info-text">
            <strong>Drag statuses to reorder within categories or drag between categories to change their type.</strong>
            <br />
            <span className="info-subtext">
              ⚠️ Note: Each category must have at least one status. You cannot move a status if it's the only one in its category.
            </span>
          </div>
        </div>

        <div className="manage-statuses-content">
          {localOrder.map(columnId => {
            const column = localColumns[columnId];
            const statusCount = column.taskIds?.length || 0;

            return (
              <div key={columnId} className="status-category">
                <div className="category-header">
                  <h3 className="category-title">
                    {column.title}
                    <span className="status-count">{localOrder.filter(id => localColumns[id]).length}</span>
                  </h3>
                  <button 
                    className="add-status-btn"
                    onClick={() => handleAddStatus(columnId)}
                  >
                    <Plus size={14} />
                    Add Status
                  </button>
                </div>

                <div className="status-list">
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