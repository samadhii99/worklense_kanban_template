// components/KanbanHeader.jsx
import React from 'react';
import { Search, ChevronDown, Tag, UsersRound } from 'lucide-react';
import { FlagOutlined, GroupOutlined, SettingOutlined } from '@ant-design/icons';
import FilterDropdowns from './FilterDropdowns';
import '../styles/KanbanHeader.css';

const KanbanHeader = ({
  searchTerm,
  setSearchTerm,
  activeFilters,
  setActiveFilters,
  selectedPriorities,
  setSelectedPriorities,
  memberSearchTerm,
  setMemberSearchTerm,
  labelSearchTerm,
  setLabelSearchTerm,
  selectedLabels,
  setSelectedLabels,
  selectedGroupBy,
  setSelectedGroupBy
}) => {
  const toggleFilter = (filterName) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterName]: !prev[filterName]
    }));
  };

  const dropdownProps = {
    activeFilters,
    setActiveFilters,
    selectedPriorities,
    setSelectedPriorities,
    memberSearchTerm,
    setMemberSearchTerm,
    labelSearchTerm,
    setLabelSearchTerm,
    selectedLabels,
    setSelectedLabels,
    selectedGroupBy,
    setSelectedGroupBy
  };

  return (
    <div className="kanban-header">
      <h1 className="kanban-title">Kanban Board</h1>
      
      <div className="kanban-filters">
        <div className="search-input">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filter-wrapper">
          <button 
            className={`filter-button ${activeFilters.priority ? 'active' : ''}`}
            onClick={() => toggleFilter('priority')}
          >
            <FlagOutlined style={{ fontSize: '16px' }} />
            Priority
            <ChevronDown size={12} className="filter-dropdown-arrow" />
          </button>
          
          {activeFilters.priority && (
            <FilterDropdowns.PriorityDropdown 
              selectedPriorities={selectedPriorities}
              setSelectedPriorities={setSelectedPriorities}
            />
          )}
        </div>
        
        <div className="filter-wrapper">
          <button 
            className={`filter-button ${activeFilters.members ? 'active' : ''}`}
            onClick={() => toggleFilter('members')}
          >
            <UsersRound size={16} style={{ transform: 'scaleX(-1)' }} />
            Members
            <ChevronDown size={12} className="filter-dropdown-arrow" />
          </button>
          
          {activeFilters.members && (
            <FilterDropdowns.MembersDropdown 
              memberSearchTerm={memberSearchTerm}
              setMemberSearchTerm={setMemberSearchTerm}
            />
          )}
        </div>
        
        <div className="filter-wrapper">
          <button 
            className={`filter-button ${activeFilters.labels ? 'active' : ''}`}
            onClick={() => toggleFilter('labels')}
          >
            <Tag size={16} style={{ transform: 'scaleX(-1)' }} />
            Labels
            <ChevronDown size={12} className="filter-dropdown-arrow" />
          </button>
          
          {activeFilters.labels && (
            <FilterDropdowns.LabelsDropdown 
              labelSearchTerm={labelSearchTerm}
              setLabelSearchTerm={setLabelSearchTerm}
              selectedLabels={selectedLabels}
              setSelectedLabels={setSelectedLabels}
            />
          )}
        </div>

        <div className="filter-wrapper">
          <button 
            className={`filter-button ${activeFilters.group ? 'active' : ''}`}
            onClick={() => toggleFilter('group')}
          >
            <GroupOutlined style={{ fontSize: '16px' }} />
            Group by {selectedGroupBy}
            <ChevronDown size={12} className="filter-dropdown-arrow" />
          </button>
          
          {activeFilters.group && (
            <FilterDropdowns.GroupByDropdown 
              selectedGroupBy={selectedGroupBy}
              setSelectedGroupBy={setSelectedGroupBy}
              setActiveFilters={setActiveFilters}
            />
          )}
        </div>

        <button className="manage-statuses-btn">
          <SettingOutlined style={{ fontSize: '16px' }} />
          Manage Statuses
        </button>
      </div>
    </div>
  );
};

export default KanbanHeader;