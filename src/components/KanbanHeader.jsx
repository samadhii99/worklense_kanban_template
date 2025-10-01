// components/KanbanHeader.jsx
import React, { useEffect } from 'react';
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
  const [isSearchExpanded, setIsSearchExpanded] = React.useState(false);

  // Close all dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      // Check if click is outside filter dropdowns
      if (!e.target.closest('.filter-wrapper') && !e.target.closest('.filter-button')) {
        setActiveFilters({
          priority: false,
          labels: false,
          members: false,
          group: false
        });
      }
      
      // Check if click is outside search input
      if (!e.target.closest('.search-input')) {
        setIsSearchExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setActiveFilters]);

  const toggleFilter = (filterName) => {
    setActiveFilters(prev => {
      // Close all filters first
      const allClosed = {
        priority: false,
        labels: false,
        members: false,
        group: false
      };
      
      // If the clicked filter was already open, keep everything closed
      // Otherwise, open only the clicked filter
      if (prev[filterName]) {
        return allClosed;
      } else {
        return {
          ...allClosed,
          [filterName]: true
        };
      }
    });
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

  const handleSearchClick = () => {
    setIsSearchExpanded(true);
  };

  const handleSearchCancel = () => {
    setSearchTerm('');
    setIsSearchExpanded(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setIsSearchExpanded(false);
  };

  return (
    <div className="kanban-header">
      <h1 className="kanban-title">Kanban Board</h1>
      
      <div className="kanban-filters">
        <div className={`search-input ${isSearchExpanded ? 'expanded' : ''}`} onClick={handleSearchClick}>
          <Search size={16} />
          <input
            type="text"
            placeholder="Search tasks by name or key..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearchSubmit(e);
              }
            }}
          />
        </div>
        
        {isSearchExpanded && (
          <>
            <button 
              className="search-action-btn search-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleSearchSubmit(e);
              }}
            >
              Search
            </button>
            <button 
              className="search-action-btn cancel-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleSearchCancel();
              }}
            >
              Cancel
            </button>
          </>
        )}
        
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

        
      </div>
    </div>
  );
};

export default KanbanHeader;