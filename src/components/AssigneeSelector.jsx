// components/AssigneeSelector.jsx
import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Search, UserRoundPlus, Check } from 'lucide-react';
import '../styles/AssigneeSelector.css';

// Sample user data - you can replace this with your actual user data from initialData.js
const availableUsers = [
  {
    id: 'John Doe',
    name: 'John Doe',
    email: 'john.doe@company.com',
    avatar: 'https://i.pravatar.cc/150?img=1'
  },
  {
    id: 'Jane Smith',
    name: 'Jane Smith',
    email: 'jane.smith@company.com',
    avatar: 'https://i.pravatar.cc/150?img=2'
  },
  {
    id: 'Mike Johnson',
    name: 'Mike Johnson',
    email: 'mike.johnson@company.com',
    avatar: 'https://i.pravatar.cc/150?img=3'
  },
  {
    id: 'Sarah Wilson',
    name: 'Sarah Wilson',
    email: 'sarah.wilson@company.com',
    avatar: 'https://i.pravatar.cc/150?img=4'
  },
  {
    id: 'David Brown',
    name: 'David Brown',
    email: 'david.brown@company.com',
    avatar: 'https://i.pravatar.cc/150?img=5'
  },
  {
    id: 'Emily Davis',
    name: 'Emily Davis',
    email: 'emily.davis@company.com',
    avatar: 'https://i.pravatar.cc/150?img=6'
  }
];

const AssigneeSelector = ({ 
  isOpen, 
  onClose, 
  position, 
  currentAssignees = [], 
  onAssigneeAdd,
  onAssigneeRemove 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState(availableUsers);
  const selectorRef = useRef(null);

useEffect(() => {
  const handleClickOutside = (event) => {
    if (selectorRef.current && !selectorRef.current.contains(event.target)) {
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

  useEffect(() => {
    const filtered = availableUsers.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm]);

  if (!isOpen) return null;

  // Calculate final position
  const selectorWidth = 280;
  const selectorHeight = 300;
  let finalTop = position.top;
  let finalLeft = position.left;

  // Adjust if going off screen
  if (finalLeft + selectorWidth > window.innerWidth) {
    finalLeft = window.innerWidth - selectorWidth - 10;
  }
  if (finalTop + selectorHeight > window.innerHeight) {
    finalTop = position.top - selectorHeight - 16;
  }
  if (finalTop < 10) {
    finalTop = 10;
  }

  const isUserAssigned = (userId) => {
    return currentAssignees.some(assignee => assignee.id === userId);
  };

  const handleUserClick = (user) => {
    if (isUserAssigned(user.id)) {
      onAssigneeRemove && onAssigneeRemove(user.id);
    } else {
      onAssigneeAdd && onAssigneeAdd(user);
    }
  };

  const handleInviteMember = () => {
    // Handle invite member functionality
    console.log('Invite new member');
    onClose();
  };

  const selectorContent = (
    <>
      {/* Backdrop */}
      <div 
        className="assignee-selector-backdrop" 
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
      
      {/* Assignee Selector Popup */}
      <div 
        ref={selectorRef}
        className="assignee-selector-popup"
        style={{
          position: 'fixed',
          top: `${finalTop}px`,
          left: `${finalLeft}px`,
          zIndex: 99999
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        

        {/* Search Input */}
        <div className="assignee-search-container">
          
          <input
            type="text"
            placeholder="Search members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="assignee-search-input"
            autoFocus
          />
        </div>

        {/* Users List */}
        <div className="assignee-users-list">
          {filteredUsers.length > 0 ? (
            filteredUsers.map(user => (
              <div
                key={user.id}
                className={`assignee-user-item ${isUserAssigned(user.id) ? 'assigned' : ''}`}
                onClick={() => handleUserClick(user)}
              >
                <div className="assignee-user-info">
                  <div className={`assignee-checkbox ${isUserAssigned(user.id) ? 'checked' : ''}`}>
  {isUserAssigned(user.id) && <Check size={12} className="checkbox-tick" />}
</div>
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="assignee-user-avatar"
                  />
                  <div className="assignee-user-details">
                    <div className="assignee-user-name">{user.name}</div>
                    <div className="assignee-user-email">{user.email}</div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-users-found">
              No users found matching "{searchTerm}"
            </div>
          )}
        </div>

        {/* Invite Member Button */}
        {/* Invite Member Button */}
<div className="assignee-selector-footer">
  <button 
    className="invite-member-button"
    onClick={handleInviteMember}
  >
    <UserRoundPlus size={13} />
    Invite member
  </button>
</div>
      </div>
    </>
  );

  // Use React Portal to render outside of component tree
  return createPortal(selectorContent, document.body);
};

export default AssigneeSelector;