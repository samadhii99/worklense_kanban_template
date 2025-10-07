// components/FilterDropdowns.jsx
import React, { useEffect } from 'react';
import { Search } from 'lucide-react';
import { availableLabels, groupByOptions } from '../data/filterData';
import '../styles/FilterDropdowns.css';

// Available members data (same as in AssigneeSelector)
const availableMembers = [
  {
    id: 'John Doe',
    name: 'John Doe'
    
  },
  {
    id: 'Jane Smith',
    name: 'Jane Smith'
    
  },
  {
    id: 'Mike Johnson',
    name: 'Mike Johnson'
   
  },
  {
    id: 'Sarah Wilson',
    name: 'Sarah Wilson'
    
  },
  {
    id: 'David Brown',
    name: 'David Brown'
    
  },
  {
    id: 'Emily Davis',
    name: 'Emily Davis'
   
  }
];

const PriorityDropdown = ({ selectedPriorities, setSelectedPriorities }) => {
  const togglePriority = (priority) => {
    setSelectedPriorities(prev => 
      prev.includes(priority) 
        ? prev.filter(p => p !== priority)
        : [...prev, priority]
    );
  };

  return (
    <div className="filter-dropdown priority-dropdown" onClick={(e) => e.stopPropagation()}>
      <div className="priority-option" onClick={() => togglePriority('low')}>
        <input type="checkbox" checked={selectedPriorities.includes('low')} readOnly />
        <div className="priority-dot low"></div>
        <span>Low</span>
      </div>
      <div className="priority-option" onClick={() => togglePriority('medium')}>
        <input type="checkbox" checked={selectedPriorities.includes('medium')} readOnly />
        <div className="priority-dot medium"></div>
        <span>Medium</span>
      </div>
      <div className="priority-option" onClick={() => togglePriority('high')}>
        <input type="checkbox" checked={selectedPriorities.includes('high')} readOnly />
        <div className="priority-dot high"></div>
        <span>High</span>
      </div>
    </div>
  );
};

const MembersDropdown = ({ memberSearchTerm, setMemberSearchTerm, selectedMembers, setSelectedMembers }) => {
  const toggleMember = (memberId) => {
    setSelectedMembers(prev => 
      prev.includes(memberId) 
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const filteredMembers = availableMembers.filter(member =>
  member.name.toLowerCase().includes(memberSearchTerm.toLowerCase()) ||
  (member.email && member.email.toLowerCase().includes(memberSearchTerm.toLowerCase()))
);

  return (
    <div className="members-dropdown" onClick={(e) => e.stopPropagation()}>
      <div className="members-search">
        <Search size={16} className="search-icon" />
        <input
          type="text"
          placeholder="Search... members..."
          value={memberSearchTerm}
          onChange={(e) => setMemberSearchTerm(e.target.value)}
        />
      </div>

      <div className="member-dropdown-separator" />

      <div className="members-list">
        {filteredMembers.length > 0 ? (
          filteredMembers.map(member => (
            <div
              key={member.id}
              className="member-option"
              onClick={() => toggleMember(member.id)}
            >
              <input type="checkbox" checked={selectedMembers?.includes(member.id)} readOnly />
              
              <div className="member-details">
                <div className="member-name">{member.name}</div> 
              </div>
            </div>
          ))
        ) : (
          <div className="no-members-found">No members found</div>
        )}
      </div>
    </div>
  );
};

const LabelsDropdown = ({ labelSearchTerm, setLabelSearchTerm, selectedLabels, setSelectedLabels }) => {
  const toggleLabel = (labelId) => {
    setSelectedLabels(prev => 
      prev.includes(labelId) 
        ? prev.filter(id => id !== labelId)
        : [...prev, labelId]
    );
  };

  const filteredLabels = availableLabels.filter(label =>
    label.name.toLowerCase().includes(labelSearchTerm.toLowerCase())
  );

  return (
    <div className="labels-dropdown" onClick={(e) => e.stopPropagation()}>
      <div className="labels-search">
        <Search size={16} className="search-icon" />
        <input
          type="text"
          placeholder="Search... labels..."
          value={labelSearchTerm}
          onChange={(e) => setLabelSearchTerm(e.target.value)}
        />
      </div>
      <div className="dropdown-separator" />
      <div className="labels-list">
        {filteredLabels.map(label => (
          <div
            key={label.id}
            className="label-option"
            onClick={() => toggleLabel(label.id)}
          >
            <input type="checkbox" checked={selectedLabels.includes(label.id)} readOnly />
            <div className={`label-color-dot ${label.color}`}></div>
            <span>{label.name}</span>
          </div>
        ))}
        {filteredLabels.length === 0 && (
          <div className="no-members-found">No labels found</div>
        )}
      </div>
    </div>
  );
};

const GroupByDropdown = ({ selectedGroupBy, setSelectedGroupBy, setActiveFilters }) => {
  const handleGroupBySelect = (optionName) => {
    setSelectedGroupBy(optionName);
    setActiveFilters(prev => ({
      ...prev,
      group: false
    }));
  };

  return (
    <div className="group-by-dropdown" onClick={(e) => e.stopPropagation()}>
      <div className="group-by-list">
        {groupByOptions.map(option => (
          <div
            key={option.id}
            className={`group-by-option ${selectedGroupBy === option.name ? 'selected' : ''}`}
            onClick={() => handleGroupBySelect(option.name)}
          >
            <span>{option.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};


const FilterDropdowns = {
  PriorityDropdown,
  MembersDropdown,
  LabelsDropdown,
  GroupByDropdown
};

export default FilterDropdowns;