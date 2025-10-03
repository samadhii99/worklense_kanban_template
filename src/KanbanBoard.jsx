import React, { useState, useMemo } from 'react';
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import {
  SortableContext,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';

import KanbanHeader from './components/KanbanHeader';
import KanbanColumn from './components/KanbanColumn';
import TaskCard from './components/TaskCard';
import { initialData } from './data/initialData';
import './styles/KanbanBoard.css';

const KanbanBoard = () => {
  const [data, setData] = useState(initialData);
  const [activeTask, setActiveTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState({
    priority: false,
    labels: false,
    members: false,
    group: false
  });
  const [selectedPriorities, setSelectedPriorities] = useState([]);
  const [memberSearchTerm, setMemberSearchTerm] = useState('');
  const [labelSearchTerm, setLabelSearchTerm] = useState('');
  const [selectedLabels, setSelectedLabels] = useState([]);
  const [selectedGroupBy, setSelectedGroupBy] = useState('Status');

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: (event, args) => {
        if (event.target.closest('.subtask-item')) {
          return null;
        }
        return args.current;
      }
    })
  );

  const handleDragStart = (event) => {
    const { active } = event;
    const task = data.tasks[active.id];
    setActiveTask(task);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) {
      setActiveTask(null);
      return;
    }

    const activeTaskData = data.tasks[active.id];
    const activeId = active.id;
    const overId = over.id;

    // Clear active task first
    setActiveTask(null);

    if (!activeTaskData) {
      return;
    }

    // Use functional update to ensure we have latest state
    setData(prevData => {
      const newData = JSON.parse(JSON.stringify(prevData)); // Deep clone to avoid mutations
      
      const task = newData.tasks[activeId];
      if (!task) return prevData;

      const oldColumnId = task.columnId;
      
      // Determine the target column
      let newColumnId;
      if (over.data?.current?.type === 'column') {
        newColumnId = overId;
      } else {
        // Dropped on another task
        const overTask = newData.tasks[overId];
        newColumnId = overTask?.columnId || oldColumnId;
      }

      // If same column, handle reordering
      if (oldColumnId === newColumnId) {
        const columnTaskIds = newData.columns[oldColumnId].taskIds;
        const oldIndex = columnTaskIds.indexOf(activeId);
        const newIndex = columnTaskIds.indexOf(overId);

        if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
          // Remove from old position
          columnTaskIds.splice(oldIndex, 1);
          // Insert at new position
          const finalIndex = oldIndex < newIndex ? newIndex : newIndex;
          columnTaskIds.splice(finalIndex, 0, activeId);
          newData.columns[oldColumnId].taskIds = columnTaskIds;
        }
      } else {
        // Moving to different column
        // Remove from old column
        if (newData.columns[oldColumnId]) {
          newData.columns[oldColumnId].taskIds = newData.columns[oldColumnId].taskIds.filter(
            id => id !== activeId
          );
        }
        
        // Add to new column at the right position
        if (newData.columns[newColumnId]) {
          const newColumnTaskIds = newData.columns[newColumnId].taskIds;
          
          if (over.data?.current?.type === 'column') {
            // Dropped on empty column or column header - add to end
            newColumnTaskIds.push(activeId);
          } else {
            // Dropped on a task - insert at that position
            const overIndex = newColumnTaskIds.indexOf(overId);
            if (overIndex !== -1) {
              newColumnTaskIds.splice(overIndex, 0, activeId);
            } else {
              newColumnTaskIds.push(activeId);
            }
          }
          
          newData.columns[newColumnId].taskIds = newColumnTaskIds;
        }
        
        // Update task's column
        newData.tasks[activeId] = {
          ...newData.tasks[activeId],
          columnId: newColumnId
        };
      }
      
      return newData;
    });
  };

  const handleAddTask = (columnId, title) => {
    const newTaskId = `task-${Date.now()}`;
    const newTask = {
      id: newTaskId,
      title,
      tags: [],
      priority: 'medium',
      assignees: [],
      dueDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      columnId,
      subtasks: []
    };

    setData(prevData => ({
      ...prevData,
      tasks: {
        ...prevData.tasks,
        [newTaskId]: newTask
      },
      columns: {
        ...prevData.columns,
        [columnId]: {
          ...prevData.columns[columnId],
          taskIds: [...prevData.columns[columnId].taskIds, newTaskId]
        }
      }
    }));
  };

  const handleTaskDelete = (taskId) => {
    setData(prevData => {
      const newData = { ...prevData };
      const task = newData.tasks[taskId];
      
      if (!task) return prevData;
      
      const columnId = task.columnId;
      if (newData.columns[columnId]) {
        newData.columns[columnId].taskIds = newData.columns[columnId].taskIds.filter(
          id => id !== taskId
        );
      }
      
      const { [taskId]: deletedTask, ...remainingTasks } = newData.tasks;
      newData.tasks = remainingTasks;
      
      return newData;
    });
  };

  const handleTaskUpdate = (taskId, updates) => {
    setData(prevData => ({
      ...prevData,
      tasks: {
        ...prevData.tasks,
        [taskId]: {
          ...prevData.tasks[taskId],
          ...updates
        }
      }
    }));
  };

  const filteredTasks = useMemo(() => {
    let filtered = { ...data.tasks };
    
    // Filter by search term
    if (searchTerm) {
      const searchFiltered = {};
      Object.entries(filtered).forEach(([id, task]) => {
        if (task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            task.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))) {
          searchFiltered[id] = task;
        }
      });
      filtered = searchFiltered;
    }
    
    // Filter by selected priorities
    if (selectedPriorities.length > 0) {
      const priorityFiltered = {};
      Object.entries(filtered).forEach(([id, task]) => {
        if (selectedPriorities.includes(task.priority)) {
          priorityFiltered[id] = task;
        }
      });
      filtered = priorityFiltered;
    }
    
    // Filter by selected labels
    if (selectedLabels.length > 0) {
      const labelFiltered = {};
      Object.entries(filtered).forEach(([id, task]) => {
        // Check if task has any of the selected labels
        const hasSelectedLabel = task.tags.some(tag => selectedLabels.includes(tag));
        if (hasSelectedLabel) {
          labelFiltered[id] = task;
        }
      });
      filtered = labelFiltered;
    }
    
    return filtered;
  }, [data.tasks, searchTerm, selectedPriorities, selectedLabels]);

  const headerProps = {
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
  };

  return (
    <div className="kanban-container">
      <KanbanHeader {...headerProps} />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="kanban-board">
          <SortableContext items={data.columnOrder} strategy={horizontalListSortingStrategy}>
            {data.columnOrder.map(columnId => {
              const column = data.columns[columnId];
              const tasks = column.taskIds
                .map(taskId => filteredTasks[taskId])
                .filter(Boolean)
                .filter(task => task.id !== activeTask?.id); // Exclude active dragging task
              
              return (
                <KanbanColumn
                  key={column.id}
                  column={column}
                  tasks={tasks}
                  onAddTask={handleAddTask}
                  onTaskDelete={handleTaskDelete}
                  onTaskUpdate={handleTaskUpdate}
                  activeTaskId={activeTask?.id}
                />
              );
            })}
          </SortableContext>
        </div>

        <DragOverlay dropAnimation={{
          duration: 200,
          easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
        }}>
          {activeTask ? (
            <div style={{ 
              cursor: 'grabbing',
              transform: 'rotate(3deg)',
              opacity: 0.95
            }}>
              <TaskCard 
                task={activeTask} 
                isDragging={true}
                onTaskDelete={handleTaskDelete}
                onTaskUpdate={handleTaskUpdate}
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default KanbanBoard;