// data/initialData.js
export const initialData = {
  columns: {
    'todo': {
      id: 'todo',
      title: 'To Do',
      color: '#e5e7eb',
      taskIds: ['task-1', 'task-2', 'task-3', 'task-4']
    },
    'doing': {
      id: 'doing',
      title: 'Doing',
      color: '#dbeafe',
      taskIds: ['task-5', 'task-6']
    },
    'done': {
      id: 'done',
      title: 'Done',
      color: '#dcfce7',
      taskIds: ['task-7', 'task-8', 'task-9', 'task-10']
    }
  },
  tasks: {
    'task-1': {
      id: 'task-1',
      title: 'In the admin panel, when I click on a student',
      tags: ['ux-ui', 'ai'],
      priority: 'high',
      progress: 33, // 1 of 3 subtasks completed
      assignees: [
        { id: 'user-1', avatar: 'https://i.pravatar.cc/150?img=1' },
        { id: 'user-2', avatar: 'https://i.pravatar.cc/150?img=2' }
      ],
      dueDate: 'No due date',
      columnId: 'todo',
      subtasks: [
        { id: 'sub-1', title: 'Design user interface', completed: false },
        
        { id: 'sub-3', title: 'Test functionality', completed: false }
      ]
    },
    'task-2': {
      id: 'task-2',
      title: 'UI & Mobile Fixes',
      tags: ['content'],
      priority: 'medium',
      progress: 0, // Not started
      assignees: [
        { id: 'user-1', avatar: 'https://i.pravatar.cc/150?img=1' }
      ],
      dueDate: 'No due date',
      columnId: 'todo',
      subtasks: []
    },
    'task-3': {
      id: 'task-3',
      title: 'Responsive Website Design for 13 more clients',
      tags: ['design'],
      priority: 'low',
      progress: 25, // 1 of 4 subtasks completed
      assignees: [
        { id: 'user-1', avatar: 'https://i.pravatar.cc/150?img=1' },
        { id: 'user-2', avatar: 'https://i.pravatar.cc/150?img=2' },
        { id: 'user-3', avatar: 'https://i.pravatar.cc/150?img=3' },
        { id: 'user-4', avatar: 'https://i.pravatar.cc/150?img=4' }
      ],
      dueDate: 'Nov 20',
      columnId: 'todo',
      subtasks: [
        { id: 'sub-4', title: 'Client Requirements', completed: true },
        { id: 'sub-5', title: 'Gathering & Planning', completed: false },
        { id: 'sub-6', title: 'Design, Development & Testing', completed: false },
        { id: 'sub-7', title: 'Client Review & Deployment', completed: false }
      ]
    },
    'task-4': {
      id: 'task-4',
      title: 'Client Requirements Gathering & Planning',
      tags: ['planning'],
      priority: 'medium',
      progress: 10, // Just started
      assignees: [
        { id: 'user-1', avatar: 'https://i.pravatar.cc/150?img=1' }
      ],
      dueDate: 'Nov 18',
      columnId: 'todo',
      subtasks: []
    },
    'task-5': {
      id: 'task-5',
      title: 'Bank Details Management',
      tags: ['ux-ui', 'finance'],
      priority: 'high',
      progress: 75, // Almost complete
      assignees: [
        { id: 'user-1', avatar: 'https://i.pravatar.cc/150?img=1' },
        { id: 'user-2', avatar: 'https://i.pravatar.cc/150?img=2' }
      ],
      dueDate: 'No due date',
      columnId: 'doing',
      subtasks: []
    },
    'task-6': {
      id: 'task-6',
      title: 'Add Task',
      tags: [],
      priority: 'medium',
      progress: 50, // Half way done
      assignees: [],
      dueDate: 'No due date',
      columnId: 'doing',
      subtasks: []
    },
    'task-7': {
      id: 'task-7',
      title: 'In the admin panel, the student will refference ID',
      tags: ['ux-ui', 'ai'],
      priority: 'high',
      progress: 100, // Completed - will show checkmark
      assignees: [
        { id: 'user-1', avatar: 'https://i.pravatar.cc/150?img=1' },
        { id: 'user-2', avatar: 'https://i.pravatar.cc/150?img=2' },
        { id: 'user-3', avatar: 'https://i.pravatar.cc/150?img=3' }
      ],
      dueDate: 'No due date',
      columnId: 'done',
      subtasks: []
    },
    'task-8': {
      id: 'task-8',
      title: 'In the admin panel. When users click on a student',
      tags: ['ux-ui', 'ai'],
      priority: 'medium',
      progress: 100, // Completed - will show checkmark
      assignees: [
        { id: 'user-1', avatar: 'https://i.pravatar.cc/150?img=1' },
        { id: 'user-2', avatar: 'https://i.pravatar.cc/150?img=2' },
        { id: 'user-3', avatar: 'https://i.pravatar.cc/150?img=3' }
      ],
      dueDate: 'No due date',
      columnId: 'done',
      subtasks: []
    },
    'task-9': {
      id: 'task-9',
      title: 'In the Student profile dashboard, the student refference ID',
      tags: ['ux-ui', 'ai'],
      priority: 'low',
      progress: 100, // Completed - will show checkmark
      assignees: [
        { id: 'user-1', avatar: 'https://i.pravatar.cc/150?img=1' },
        { id: 'user-2', avatar: 'https://i.pravatar.cc/150?img=2' },
        { id: 'user-3', avatar: 'https://i.pravatar.cc/150?img=3' }
      ],
      dueDate: 'No due date',
      columnId: 'done',
      subtasks: []
    },
    'task-10': {
      id: 'task-10',
      title: 'Database Design',
      tags: ['ux-ui', 'ai'],
      priority: 'high',
      progress: 100, // Completed - will show checkmark
      assignees: [
        { id: 'user-1', avatar: 'https://i.pravatar.cc/150?img=1' },
        { id: 'user-2', avatar: 'https://i.pravatar.cc/150?img=2' },
        { id: 'user-3', avatar: 'https://i.pravatar.cc/150?img=3' }
      ],
      dueDate: 'No due date',
      columnId: 'done',
      subtasks: []
    }
  },
  columnOrder: ['todo', 'doing', 'done']
};