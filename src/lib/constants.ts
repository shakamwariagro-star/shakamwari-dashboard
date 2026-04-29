export const REGISTER_TYPES = [
  { key: 'result_entry', label: 'Result Entry Register' },
  { key: 'shc_handover', label: 'Soil Health Card Handover Register' },
  { key: 'samples_receiving', label: 'Samples Receiving Register' },
  { key: 'inward_outward', label: 'Inward Outward Register' },
  { key: 'attendance', label: 'Attendance Register' },
  { key: 'stock', label: 'Stock Register' },
  { key: 'expenses', label: 'Expenses Register' },
  { key: 'visitors', label: 'Visitors Register' },
  { key: 'electricity_bill', label: 'Electricity Bill Register' },
] as const;

export const MONTHS = [
  'April', 'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December',
  'January', 'February', 'March',
] as const;

export const EXPENSE_CATEGORIES = [
  { key: 'salary', label: 'Salary' },
  { key: 'electricity', label: 'Electricity' },
  { key: 'chemical', label: 'Chemical' },
  { key: 'stationery', label: 'Stationery' },
  { key: 'printing', label: 'Printing' },
  { key: 'lifafa', label: 'Lifafa' },
  { key: 'cleaning', label: 'Cleaning' },
  { key: 'other', label: 'Other Expenses' },
  { key: 'tour', label: 'Tour Expenses' },
] as const;

export const STOCK_CATEGORIES = [
  { key: 'chemicals', label: 'Chemicals & Reagents' },
  { key: 'equipment', label: 'Glassware & Equipment' },
  { key: 'consumables', label: 'Consumables & Stationery' },
  { key: 'other', label: 'Other' },
] as const;

export const DISPATCH_PURPOSES = [
  { key: 'bill_submission', label: 'Bill Submission' },
  { key: 'sample_handover', label: 'Sample Handover' },
  { key: 'cross_sample', label: 'Cross Sample' },
  { key: 'others', label: 'Others' },
] as const;

export const ROLE_LABELS: Record<string, string> = {
  lab_staff: 'Lab Staff',
  team_leader: 'Team Leader',
  account_section: 'Account Section',
  admin: 'Admin',
  soil_testing_expert: 'Soil Testing Expert',
};

export const LAB_DATA_FIELDS = [
  { key: 'sample_tested', label: 'Sample Tested' },
  { key: 'shc_printed', label: 'SHC Printed' },
  { key: 'shc_handover', label: 'SHC Handover' },
  { key: 'hand_over_samples', label: 'Handover Samples' },
] as const;

export const NAV_ITEMS = [
  { href: '/', label: 'Dashboard', icon: 'home' },
  { href: '/labs', label: 'Labs', icon: 'lab' },
  { href: '/billing/approvals', label: 'Bill Approvals', icon: 'bill', roles: ['team_leader', 'admin'] },
  { href: '/expenses', label: 'Expenses', icon: 'expense' },
  { href: '/dispatch', label: 'Dispatch', icon: 'dispatch', roles: ['team_leader', 'admin'] },
] as const;
