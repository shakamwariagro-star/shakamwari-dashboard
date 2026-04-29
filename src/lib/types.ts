export type UserRole = 'lab_staff' | 'team_leader' | 'account_section' | 'admin' | 'soil_testing_expert';

export interface ExpertUser {
  id: string;
  username: string;
  password: string;
  full_name: string;
  phone: string;
  employee_number: string;
  assigned_lab_id: number;
  coordinator: string;
  company: string;
  role: 'soil_testing_expert';
}

export interface UploadedDocument {
  id: number;
  lab_id: number;
  uploaded_by: string;
  doc_type: 'register_scan' | 'expense_receipt' | 'other';
  register_type?: string;
  month?: string;
  file_name: string;
  file_url: string;
  file_size: number;
  uploaded_at: string;
}

export interface Profile {
  id: string;
  full_name: string;
  role: UserRole;
  assigned_lab_id: number | null;
  phone: string | null;
  created_at: string;
}

export interface Lab {
  id: number;
  lab_code: string;
  district: string;
  block: string;
  company_name: string;
  coordinator: string;
  target: number;
  sanctioned_target: number;
  hand_over_samples: number;
  sample_tested: number;
  shc_printed: number;
  shc_handover: number;
  sanctioned_payment: number;
  billing_sample: number;
  billing_amount: number;
  payment_received: number;
  expenses_total: number;
  created_at: string;
  updated_at: string;
}

export interface Register {
  id: number;
  lab_id: number;
  register_type: string;
  month: string;
  year: number;
  status: 'pending' | 'done' | 'approved';
  file_url: string | null;
  updated_at: string;
}

export interface Bill {
  id: number;
  bill_no: string;
  lab_id: number;
  district: string;
  company_name: string;
  bill_date: string;
  billing_samples: number;
  billing_amount: number;
  bill_copy_url: string | null;
  submitted_by: string | null;
  submission_status: 'pending' | 'approved' | 'rejected';
  approved_by: string | null;
  approved_at: string | null;
  rejection_reason: string | null;
  sanctioned_order_number: string | null;
  sanctioned_order_copy_url: string | null;
  payment_status: 'pending' | 'received';
  payment_date: string | null;
  payment_amount: number | null;
  utr_number: string | null;
  created_at: string;
  updated_at: string;
  lab?: Lab;
  submitter?: Profile;
}

export interface Expense {
  id: number;
  lab_id: number;
  month: string;
  year: number;
  salary: number;
  electricity: number;
  chemical: number;
  stationery: number;
  printing: number;
  lifafa: number;
  cleaning: number;
  other: number;
  tour: number;
  approval_status: 'draft' | 'submitted' | 'approved' | 'rejected';
  approved_by?: string | null;
  approved_at?: string | null;
  rejection_reason?: string | null;
  submitted_by?: string | null;
  created_at: string;
}

export interface ApprovalAction {
  id: number;
  entity_type: 'expense' | 'bill' | 'salary' | 'register';
  entity_id: number;
  lab_id: number;
  action: 'approved' | 'rejected';
  acted_by: string;
  acted_at: string;
  comment: string | null;
}

export interface Dispatch {
  id: number;
  dispatch_number: string;
  lab_id: number;
  purpose: string;
  details: string | null;
  copy_url: string | null;
  dispatched_in_date: string | null;
  dispatched_in_via: string | null;
  dispatched_out_date: string | null;
  dispatched_out_via: string | null;
  head: string | null;
  remark: string | null;
  created_by: string | null;
  created_at: string;
  lab?: Lab;
}

export interface StockItem {
  id: number;
  lab_id: number;
  item_name: string;
  category: 'chemicals' | 'equipment' | 'consumables' | 'other';
  indent_demand: number;
  supply: number;
  status: 'pending' | 'done';
  remark: string | null;
  requested_by: string | null;
  updated_at: string;
}

export interface Notification {
  id: number;
  recipient_id: string;
  type: string;
  title: string;
  message: string;
  related_bill_id: number | null;
  is_read: boolean;
  created_at: string;
}
