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
      tags: ['ui-ux-bug', 'fixing'],
      priority: 'high',
      progress: 33,
      assignees: [
        { id: 'John Doe', name: 'John Doe', avatar: 'https://i.pravatar.cc/150?img=1' },
        { id: 'Jane Smith', name: 'Jane Smith', avatar: 'https://i.pravatar.cc/150?img=2' }
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
      tags: ['ui-ux-bug', 'fixing'],
      priority: 'medium',
      progress: 0,
      assignees: [
        { id: 'John Doe', name: 'John Doe', avatar: 'https://i.pravatar.cc/150?img=1' }
      ],
      dueDate: 'No due date',
      columnId: 'todo',
      subtasks: []
    },
    'task-3': {
      id: 'task-3',
      title: 'Responsive Website Design for 13 more clients',
      tags: ['ready-for-dev'],
      priority: 'low',
      progress: 25,
      assignees: [
        { id: 'John Doe', name: 'John Doe', avatar: 'https://i.pravatar.cc/150?img=1' },
        { id: 'Jane Smith', name: 'Jane Smith', avatar: 'https://i.pravatar.cc/150?img=2' },
        { id: 'Mike Johnson', name: 'Mike Johnson', avatar: 'https://i.pravatar.cc/150?img=3' },
        { id: 'Sarah Wilson', name: 'Sarah Wilson', avatar: 'https://i.pravatar.cc/150?img=4' }
      ],
      dueDate: 'Nov 20',
      columnId: 'todo',
      subtasks: [
        { id: 'sub-5', title: 'Gathering & Planning', completed: false },
        { id: 'sub-6', title: 'Design, Development & Testing', completed: false },
        { id: 'sub-7', title: 'Client Review & Deployment', completed: false }
      ]
    },
    'task-4': {
      id: 'task-4',
      title: 'Client Requirements Gathering & Planning',
      tags: ['documentation'],
      priority: 'medium',
      progress: 10,
      assignees: [
        { id: 'John Doe', name: 'John Doe', avatar: 'https://i.pravatar.cc/150?img=1' }
      ],
      dueDate: 'Nov 18',
      columnId: 'todo',
      subtasks: []
    },
    'task-5': {
      id: 'task-5',
      title: 'Bank Details Management',
      tags: ['critical', 'fixing'],
      priority: 'high',
      progress: 75,
      assignees: [
        { id: 'John Doe', name: 'John Doe', avatar: 'https://i.pravatar.cc/150?img=1' },
        { id: 'Jane Smith', name: 'Jane Smith', avatar: 'https://i.pravatar.cc/150?img=2' }
      ],
      dueDate: 'No due date',
      columnId: 'doing',
      subtasks: []
    },
    'task-6': {
      id: 'task-6',
      title: 'Add Task',
      tags: ['ready-for-dev'],
      priority: 'medium',
      progress: 50,
      assignees: [],
      dueDate: 'No due date',
      columnId: 'doing',
      subtasks: []
    },
    'task-7': {
      id: 'task-7',
      title: 'In the admin panel, the student will refference ID',
      tags: ['fixed', 'ui-ux-bug'],
      priority: 'high',
      progress: 100,
      assignees: [
        { id: 'John Doe', name: 'John Doe', avatar: 'https://i.pravatar.cc/150?img=1' },
        { id: 'Jane Smith', name: 'Jane Smith', avatar: 'https://i.pravatar.cc/150?img=2' },
        { id: 'Mike Johnson', name: 'Mike Johnson', avatar: 'https://i.pravatar.cc/150?img=3' }
      ],
      dueDate: 'No due date',
      columnId: 'done',
      subtasks: []
    },
    'task-8': {
      id: 'task-8',
      title: 'In the admin panel. When users click on a student',
      tags: ['fixed', 'regression'],
      priority: 'medium',
      progress: 100,
      assignees: [
        { id: 'John Doe', name: 'John Doe', avatar: 'https://i.pravatar.cc/150?img=1' },
        { id: 'Jane Smith', name: 'Jane Smith', avatar: 'https://i.pravatar.cc/150?img=2' },
        { id: 'Mike Johnson', name: 'Mike Johnson', avatar: 'https://i.pravatar.cc/150?img=3' }
      ],
      dueDate: 'No due date',
      columnId: 'done',
      subtasks: []
    },
    'task-9': {
      id: 'task-9',
      title: 'In the Student profile dashboard, the student refference ID',
      tags: ['fixed'],
      priority: 'low',
      progress: 100,
      assignees: [
        { id: 'John Doe', name: 'John Doe', avatar: 'https://i.pravatar.cc/150?img=1' },
        { id: 'Jane Smith', name: 'Jane Smith', avatar: 'https://i.pravatar.cc/150?img=2' },
        { id: 'Mike Johnson', name: 'Mike Johnson', avatar: 'https://i.pravatar.cc/150?img=3' }
      ],
      dueDate: 'No due date',
      columnId: 'done',
      subtasks: []
    },
    'task-10': {
      id: 'task-10',
      title: 'Database Design',
      tags: ['documentation', 'fixed'],
      priority: 'high',
      progress: 100,
      assignees: [
        { id: 'John Doe', name: 'John Doe', avatar: 'https://i.pravatar.cc/150?img=1' },
        { id: 'Jane Smith', name: 'Jane Smith', avatar: 'https://i.pravatar.cc/150?img=2' },
        { id: 'Mike Johnson', name: 'Mike Johnson', avatar: 'https://i.pravatar.cc/150?img=3' }
      ],
      dueDate: 'No due date',
      columnId: 'done',
      subtasks: []
    }
  },
  columnOrder: ['todo', 'doing', 'done']
};