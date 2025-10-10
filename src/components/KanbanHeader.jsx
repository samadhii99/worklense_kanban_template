// components/KanbanHeader.jsx
import React, { useEffect, useState } from 'react';
import { Search, ChevronDown, Tag, UsersRound } from 'lucide-react';
import { FlagOutlined, GroupOutlined, SettingOutlined } from '@ant-design/icons';
import FilterDropdowns from './FilterDropdowns';
import ManageStatusesModal from './ManageStatusesModal';
import ManagePhasesModal from './ManagePhasesModal';
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
  selectedMembers,
  setSelectedMembers,
  labelSearchTerm,
  setLabelSearchTerm,
  selectedLabels,
  setSelectedLabels,
  selectedGroupBy,
  setSelectedGroupBy,
  columns,
  columnOrder,
  onUpdateColumns,
}) => {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isManageStatusesOpen, setIsManageStatusesOpen] = useState(false);
  const [isManagePhasesOpen, setIsManagePhasesOpen] = useState(false);

  // ✅ Removed re-declaration of columns, columnOrder, onUpdateColumns
  // They already come from props!

  // Close all dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        !e.target.closest('.filter-wrapper') &&
        !e.target.closest('.filter-button')
      ) {
        setActiveFilters({
          priority: false,
          labels: false,
          members: false,
          group: false,
        });
      }

      if (!e.target.closest('.search-input')) {
        setIsSearchExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setActiveFilters]);

  const toggleFilter = (filterName) => {
    setActiveFilters((prev) => {
      const allClosed = {
        priority: false,
        labels: false,
        members: false,
        group: false,
      };
      return prev[filterName]
        ? allClosed
        : { ...allClosed, [filterName]: true };
    });
  };

  const dropdownProps = {
    activeFilters,
    setActiveFilters,
    selectedPriorities,
    setSelectedPriorities,
    memberSearchTerm,
    setMemberSearchTerm,
    selectedMembers,
    setSelectedMembers,
    labelSearchTerm,
    setLabelSearchTerm,
    selectedLabels,
    setSelectedLabels,
    selectedGroupBy,
    setSelectedGroupBy,
  };

  const handleSearchClick = () => setIsSearchExpanded(true);
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
        {/*  Search Input */}
        <div
          className={`search-input ${isSearchExpanded ? 'expanded' : ''}`}
          onClick={handleSearchClick}
        >
          <Search size={16} />
          <input
            type="text"
            placeholder="Search tasks by name or key..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearchSubmit(e);
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

        {/* Priority Filter */}
        <div className="filter-wrapper">
          <button
            className={`filter-button ${
              activeFilters.priority ? 'active' : ''
            }`}
            onClick={() => toggleFilter('priority')}
          >
            <FlagOutlined style={{ fontSize: '16px' }} />
            Priority
            {selectedPriorities.length > 0 && (
              <span className="filter-count">{selectedPriorities.length}</span>
            )}
            <ChevronDown size={12} className="filter-dropdown-arrow" />
          </button>

          {activeFilters.priority && (
            <FilterDropdowns.PriorityDropdown
              selectedPriorities={selectedPriorities}
              setSelectedPriorities={setSelectedPriorities}
            />
          )}
        </div>

        {/*  Members Filter */}
        <div className="filter-wrapper">
          <button
            className={`filter-button ${
              activeFilters.members ? 'active' : ''
            }`}
            onClick={() => toggleFilter('members')}
          >
            <UsersRound size={16} style={{ transform: 'scaleX(-1)' }} />
            Members
            {selectedMembers?.length > 0 && (
              <span className="filter-count">{selectedMembers.length}</span>
            )}
            <ChevronDown size={12} className="filter-dropdown-arrow" />
          </button>

          {activeFilters.members && (
            <FilterDropdowns.MembersDropdown
              memberSearchTerm={memberSearchTerm}
              setMemberSearchTerm={setMemberSearchTerm}
              selectedMembers={selectedMembers}
              setSelectedMembers={setSelectedMembers}
            />
          )}
        </div>

        {/*  Group By Filter */}
        <div className="filter-wrapper">
          <button
            className={`filter-button ${
              activeFilters.group ? 'active' : ''
            }`}
            onClick={() => toggleFilter('group')}
          >
            <GroupOutlined style={{ fontSize: '16px' }} />
            <span className="filter-label">Group by</span> {selectedGroupBy}
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

        {/*  Manage Statuses or Phases */}
        {(selectedGroupBy === 'Status' || selectedGroupBy === 'Phase') && (
          <div className="filter-wrapper">
            <div
              className="manage-statuses-btn"
              title={`Manage ${
                selectedGroupBy === 'Status' ? 'Statuses' : 'Phases'
              }`}
              onClick={() => {
                if (selectedGroupBy === 'Status') {
                  setIsManageStatusesOpen(true);
                } else {
                  setIsManagePhasesOpen(true);
                }
              }}
            >
              <span>
                Manage {selectedGroupBy === 'Status' ? 'Statuses' : 'Phases'}
              </span>
              <SettingOutlined style={{ fontSize: '16px' }} />
            </div>
          </div>
        )}
      </div>

      {/* Manage Modals */}
      <ManageStatusesModal
        isOpen={isManageStatusesOpen}
        onClose={() => setIsManageStatusesOpen(false)}
        columns={columns}
        columnOrder={columnOrder}
        onUpdateColumns={onUpdateColumns}
      />

      <ManagePhasesModal
        isOpen={isManagePhasesOpen}
        onClose={() => setIsManagePhasesOpen(false)}
        columns={columns}
        columnOrder={columnOrder}
        onUpdateColumns={onUpdateColumns}
      />
    </div>
  );
};

export default KanbanHeader;
