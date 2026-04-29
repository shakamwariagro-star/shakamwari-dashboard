export interface AuditEntry {
  id: number;
  timestamp: string;
  user: string;
  role: 'expert' | 'coordinator' | 'admin';
  action: string;
  entity_type: string;
  entity_id: number;
  lab_code: string;
  details: string;
}

let nextId = 16;

const INITIAL_ENTRIES: AuditEntry[] = [
  {
    id: 1, timestamp: '2026-04-13T09:15:00Z', user: 'Satyadev Kol', role: 'expert',
    action: 'updated_lab_data', entity_type: 'lab_data', entity_id: 1, lab_code: 'SRH001',
    details: 'Updated sample_tested from 1800 to 2000 for SRH001',
  },
  {
    id: 2, timestamp: '2026-04-13T08:42:00Z', user: 'Nitin Tomar', role: 'coordinator',
    action: 'approved_expense', entity_type: 'expense', entity_id: 1, lab_code: 'SRH001',
    details: 'Approved expenses for SRH001 — April 2026 (total: 45,200)',
  },
  {
    id: 3, timestamp: '2026-04-12T17:30:00Z', user: 'Ravi Kushwah', role: 'admin',
    action: 'submitted_expenses', entity_type: 'expense', entity_id: 31, lab_code: 'PRS006',
    details: 'Submitted expenses for PRS006 — April 2026 (total: 38,750)',
  },
  {
    id: 4, timestamp: '2026-04-12T16:10:00Z', user: 'Kuldeep Singh', role: 'coordinator',
    action: 'supplied_stock', entity_type: 'stock', entity_id: 31, lab_code: 'PRS006',
    details: 'Supplied Conductivity Meter Probe for PRS006',
  },
  {
    id: 5, timestamp: '2026-04-12T14:55:00Z', user: 'Ritesh Kumar', role: 'expert',
    action: 'uploaded_register', entity_type: 'register', entity_id: 2, lab_code: 'SRH002',
    details: 'Uploaded Result Entry Register for SRH002 — April 2026',
  },
  {
    id: 6, timestamp: '2026-04-12T11:20:00Z', user: 'Akshay Tiwari', role: 'coordinator',
    action: 'rejected_expense', entity_type: 'expense', entity_id: 14, lab_code: 'RAD008',
    details: 'Rejected expenses for RAD008 — March 2026 (reason: missing receipts)',
  },
  {
    id: 7, timestamp: '2026-04-11T15:45:00Z', user: 'Gopal Singh Rajawat', role: 'expert',
    action: 'updated_lab_data', entity_type: 'lab_data', entity_id: 8, lab_code: 'SRH004',
    details: 'Updated shc_printed from 0 to 500 for SRH004',
  },
  {
    id: 8, timestamp: '2026-04-11T13:00:00Z', user: 'Shubham Raghuwanshi', role: 'coordinator',
    action: 'raised_indent', entity_type: 'stock', entity_id: 5, lab_code: 'RAD003',
    details: 'Raised indent for pH Meter Buffer Solution (qty: 10) for RAD003',
  },
  {
    id: 9, timestamp: '2026-04-11T10:30:00Z', user: 'Ravi Kushwah', role: 'admin',
    action: 'approved_bill', entity_type: 'bill', entity_id: 1, lab_code: 'SRH001',
    details: 'Approved bill BILL-2026-001 for SRH001 — amount: 2,35,000',
  },
  {
    id: 10, timestamp: '2026-04-10T16:20:00Z', user: 'Pranjal Verma', role: 'expert',
    action: 'uploaded_register', entity_type: 'register', entity_id: 9, lab_code: 'RAD005',
    details: 'Uploaded Sample Collection Register for RAD005 — April 2026',
  },
  {
    id: 11, timestamp: '2026-04-10T14:00:00Z', user: 'Abhishek Raghuwanshi', role: 'coordinator',
    action: 'supplied_stock', entity_type: 'stock', entity_id: 12, lab_code: 'PRS001',
    details: 'Supplied Beakers (100ml, set of 6) for PRS001',
  },
  {
    id: 12, timestamp: '2026-04-10T11:45:00Z', user: 'Dipanshu Manker', role: 'expert',
    action: 'submitted_expenses', entity_type: 'expense', entity_id: 10, lab_code: 'RAD006',
    details: 'Submitted expenses for RAD006 — April 2026 (total: 31,400)',
  },
  {
    id: 13, timestamp: '2026-04-09T17:10:00Z', user: 'Nitin Tomar', role: 'coordinator',
    action: 'created_dispatch', entity_type: 'dispatch', entity_id: 1, lab_code: 'SRH005',
    details: 'Created dispatch DSP-2026-014 for SRH005 — Chemical supply kit',
  },
  {
    id: 14, timestamp: '2026-04-09T14:30:00Z', user: 'Sakshi Singh', role: 'expert',
    action: 'updated_lab_data', entity_type: 'lab_data', entity_id: 6, lab_code: 'SRH003',
    details: 'Updated hand_over_samples from 0 to 150 for SRH003',
  },
  {
    id: 15, timestamp: '2026-04-09T09:00:00Z', user: 'Ravi Kushwah', role: 'admin',
    action: 'approved_expense', entity_type: 'expense', entity_id: 2, lab_code: 'SRH002',
    details: 'Approved expenses for SRH002 — March 2026 (total: 52,100)',
  },
];

let auditLog: AuditEntry[] = [...INITIAL_ENTRIES];

export function addAuditEntry(entry: Omit<AuditEntry, 'id' | 'timestamp'>): void {
  auditLog.unshift({
    ...entry,
    id: nextId++,
    timestamp: new Date().toISOString(),
  });
}

export function getAuditLog(): AuditEntry[] {
  return [...auditLog].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export function getAuditLogForLab(labCode: string): AuditEntry[] {
  return getAuditLog().filter(e => e.lab_code === labCode);
}
