// components/ManagePhasesModal.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Plus, GripVertical, X, Pencil, Trash2, Droplet } from 'lucide-react';
import { createPortal } from 'react-dom';
import '../styles/ManagePhasesModal.css';

const ManagePhasesModal = ({ isOpen, onClose, phases = [], onUpdatePhases }) => {
  const [localPhases, setLocalPhases] = useState(phases);
  const [phaseLabel, setPhaseLabel] = useState('Order by Phase');
  const [editingPhaseId, setEditingPhaseId] = useState(null);
  const inputRef = useRef(null);

  // Reset state when modal opens or new data comes in
  useEffect(() => {
    if (isOpen) {
      setLocalPhases(phases);
      setPhaseLabel('Order by Phase');
    }
  }, [isOpen, JSON.stringify(phases)]);

  useEffect(() => {
    if (editingPhaseId && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingPhaseId]);

  if (!isOpen) return null;

  const handleAddPhase = () => {
    const newPhaseId = `phase-${Date.now()}`;
    const newPhase = {
      id: newPhaseId,
      name: '',
      color: '#74B9FF', // default color
    };
    setLocalPhases(prev => [...prev, newPhase]);
    setEditingPhaseId(newPhaseId);
  };

  const handlePhaseNameChange = (phaseId, newName) => {
    setLocalPhases(prev =>
      prev.map(phase =>
        phase.id === phaseId ? { ...phase, name: newName } : phase
      )
    );
  };

  const handleFinishEditing = (phaseId) => {
    const phase = localPhases.find(p => p.id === phaseId);
    if (!phase?.name.trim()) handlePhaseNameChange(phaseId, 'New Phase');
    setEditingPhaseId(null);
  };

  const handleKeyDown = (e, phaseId) => {
    if (e.key === 'Enter') handleFinishEditing(phaseId);
    else if (e.key === 'Escape') setEditingPhaseId(null);
  };

  const handleColorChange = (phaseId, color) => {
    setLocalPhases(prev =>
      prev.map(phase =>
        phase.id === phaseId ? { ...phase, color } : phase
      )
    );
  };

  const handleDeletePhase = (phaseId) => {
    if (localPhases.length <= 1) {
      alert('You must have at least one phase');
      return;
    }
    setLocalPhases(prev => prev.filter(phase => phase.id !== phaseId));
    if (editingPhaseId === phaseId) setEditingPhaseId(null);
  };

  const handleRenamePhase = (phaseId) => setEditingPhaseId(phaseId);

  const handleSave = () => {
    const validPhases = localPhases.map(phase => ({
      ...phase,
      name: phase.name.trim() || 'Unnamed Phase'
    }));
    onUpdatePhases?.(validPhases, phaseLabel.trim() || 'Order by Phase');
    onClose();
  };

  const handleClose = () => onClose();

  const modalContent = (
    <>
      <div className="manage-phases-overlay" onClick={handleClose} />
      <div className="manage-phases-modal">
        {/* Header */}
        <div className="manage-phases-header">
          <h2>Configure Order by Phase</h2>
          <button className="close-button" onClick={handleClose}>
            <X size={20} />
          </button>
        </div>

        {/* Main Content */}
        <div className="manage-phases-content bg-blue p-4 rounded-lg shadow-md">
          <div className="phase-label-section">
            <label className="phase-label-input">Phase Label</label>
            <input
              type="text"
              value={phaseLabel}
              onChange={(e) => setPhaseLabel(e.target.value)}
              className="phase-label-input-field"
              placeholder="Enter phase label"
            />
          </div>

          <div className="manage-phases-info">
            <div className="info-text">
              <span role="img" aria-label="info">📦</span>{' '}
              <strong>Drag phases to reorder them. Click on a phase name to rename it. You can pick a custom color for each phase.</strong>
            </div>
          </div>

          <div className="phases-options-header">
            <span className="options-title">Phase Options</span>
            <button onClick={handleAddPhase} className="add-phase-btn">
              <Plus size={16} /> Add Phase
            </button>
          </div>

          {/* Phase List */}
          <div className="phases-list">
            {localPhases.map((phase) => (
              <div key={phase.id} className="phase-item">
                {/* Drag Handle */}
                <div className="phase-drag-handle"><GripVertical size={18} /></div>

                {/*  Native Color Picker */}
                <div className="color-picker-container">
                  <label className="color-picker-label" title="Choose color">
                    <Droplet size={16} />
                    <input
                      type="color"
                      value={phase.color}
                      onChange={(e) => handleColorChange(phase.id, e.target.value)}
                      className="color-picker-input"
                    />
                  </label>
                </div>

                {/* Phase Name */}
                {editingPhaseId === phase.id ? (
                  <input
                    ref={inputRef}
                    type="text"
                    value={phase.name}
                    onChange={(e) => handlePhaseNameChange(phase.id, e.target.value)}
                    onBlur={() => handleFinishEditing(phase.id)}
                    onKeyDown={(e) => handleKeyDown(e, phase.id)}
                    placeholder="Enter phase name"
                    className="phase-name-input editing"
                  />
                ) : (
                  <div
                    onClick={() => handleRenamePhase(phase.id)}
                    className="phase-name-display"
                    title="Click to rename"
                  >
                    {phase.name || 'Click to edit'}
                  </div>
                )}

                {/* Actions */}
                <div className="phase-actions">
                  <button
                    onClick={() => handleRenamePhase(phase.id)}
                    className="phase-action-btn rename-btn"
                    title="Rename phase"
                    disabled={editingPhaseId === phase.id}
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleDeletePhase(phase.id)}
                    className="phase-action-btn delete-btn"
                    title="Delete phase"
                    disabled={localPhases.length <= 1}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Empty Message */}
          {localPhases.length === 0 && (
            <div className="empty-phases-message">
              No phases added yet. Click "Add Phase" to create your first phase.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="manage-phases-footer">
          <button onClick={handleSave} className="save-phases-btn">
            Save Changes
          </button>
          <button onClick={handleClose} className="close-modal-btn">
            Cancel
          </button>
        </div>
      </div>
    </>
  );

  return createPortal(modalContent, document.body);
};

export default ManagePhasesModal;
