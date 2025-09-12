// data/filterData.js
export const availableLabels = [
  { id: 'awaiting-review', name: 'Awaiting review', color: 'awaiting-review' },
  { id: 'critical', name: 'Critical', color: 'critical' },
  { id: 'documentation', name: 'Documentation', color: 'documentation' },
  { id: 'duplicate', name: 'Duplicate', color: 'duplicate' },
  { id: 'fixed', name: 'Fixed', color: 'fixed' },
  { id: 'fixing', name: 'Fixing', color: 'fixing' },
  { id: 'ready-for-dev', name: 'Ready for Dev', color: 'ready-for-dev' },
  { id: 'regression', name: 'Regression', color: 'regression' },
  { id: 'ui-ux-bug', name: 'UI/UX Bug', color: 'ui-ux-bug' }
];

export const groupByOptions = [
  { id: 'status', name: 'Status' },
  { id: 'priority', name: 'Priority' },
  { id: 'phase', name: 'Phase' }
];