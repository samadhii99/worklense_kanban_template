// KanbanBoard.jsx
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
      // Disable keyboard sensor when focus is on subtask items
      coordinateGetter: (event, args) => {
        // Don't handle keyboard events from subtask items
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
    setActiveTask(null);

    if (!over) return;

    const activeTask = data.tasks[active.id];
    const overColumnId = over.data?.current?.type === 'column' ? over.id : data.tasks[over.id]?.columnId;
    
    if (!overColumnId || activeTask.columnId === overColumnId) return;

    setData(prevData => {
      const newData = { ...prevData };
      
      // Remove task from old column
      const oldColumn = newData.columns[activeTask.columnId];
      oldColumn.taskIds = oldColumn.taskIds.filter(id => id !== active.id);
      
      // Add task to new column
      const newColumn = newData.columns[overColumnId];
      newColumn.taskIds.push(active.id);
      
      // Update task's column
      newData.tasks[active.id] = {
        ...newData.tasks[active.id],
        columnId: overColumnId
      };
      
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

  // ===== TASK DELETE HANDLER =====
  const handleTaskDelete = (taskId) => {
    setData(prevData => {
      const newData = { ...prevData };
      const task = newData.tasks[taskId];
      
      if (!task) return prevData;
      
      // Remove task from its column's taskIds
      const columnId = task.columnId;
      if (newData.columns[columnId]) {
        newData.columns[columnId].taskIds = newData.columns[columnId].taskIds.filter(
          id => id !== taskId
        );
      }
      
      // Remove task from tasks object
      const { [taskId]: deletedTask, ...remainingTasks } = newData.tasks;
      newData.tasks = remainingTasks;
      
      return newData;
    });
    
    console.log('Task deleted:', taskId);
  };

  // ===== TASK UPDATE HANDLER =====
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
    
    console.log('Task updated:', taskId, updates);
  };

  const filteredTasks = useMemo(() => {
    if (!searchTerm) return data.tasks;
    
    const filtered = {};
    Object.entries(data.tasks).forEach(([id, task]) => {
      if (task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          task.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))) {
        filtered[id] = task;
      }
    });
    return filtered;
  }, [data.tasks, searchTerm]);

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
                .filter(Boolean);
              
              return (
                <KanbanColumn
                  key={column.id}
                  column={column}
                  tasks={tasks}
                  onAddTask={handleAddTask}
                  onTaskDelete={handleTaskDelete}
                  onTaskUpdate={handleTaskUpdate}
                />
              );
            })}
          </SortableContext>
        </div>

        <DragOverlay>
          {activeTask && (
            <div className="drag-overlay">
              <TaskCard 
                task={activeTask} 
                isDragging={true}
                onTaskDelete={handleTaskDelete}
                onTaskUpdate={handleTaskUpdate}
              />
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default KanbanBoard;