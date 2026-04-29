import type { Lab, Bill, Expense, Dispatch, StockItem } from './types';

// All 42 labs from Dashboard AR Excel — Main Page Home Page
// Numeric data filled where available from the Excel
export const MOCK_LABS: Lab[] = [
  { id: 1, lab_code: 'SRH001', district: 'Sidhi', block: 'Majholi', company_name: 'SRH', coordinator: 'Nitin Tomar', target: 4500, sanctioned_target: 3000, hand_over_samples: 0, sample_tested: 2000, shc_printed: 1000, shc_handover: 5000, sanctioned_payment: 1085000, billing_sample: 1000, billing_amount: 235000, payment_received: 0, expenses_total: 0, created_at: '2026-04-01', updated_at: '2026-04-09' },
  { id: 2, lab_code: 'SRH002', district: 'Sehore', block: 'Ichhawar', company_name: 'SRH', coordinator: 'Akshay Tiwari', target: 4500, sanctioned_target: 4200, hand_over_samples: 3000, sample_tested: 3500, shc_printed: 10000, shc_handover: 0, sanctioned_payment: 0, billing_sample: 0, billing_amount: 0, payment_received: 0, expenses_total: 0, created_at: '2026-04-01', updated_at: '2026-04-09' },
  { id: 3, lab_code: 'RAD001', district: 'Ratlam', block: 'Jaora', company_name: 'Radhika', coordinator: 'Akshay Tiwari', target: 0, sanctioned_target: 0, hand_over_samples: 0, sample_tested: 0, shc_printed: 0, shc_handover: 0, sanctioned_payment: 0, billing_sample: 0, billing_amount: 0, payment_received: 0, expenses_total: 0, created_at: '2026-04-01', updated_at: '2026-04-09' },
  { id: 4, lab_code: 'RAD002', district: 'Raisen', block: 'Badi', company_name: 'Radhika', coordinator: 'Nitin Tomar', target: 0, sanctioned_target: 0, hand_over_samples: 0, sample_tested: 0, shc_printed: 0, shc_handover: 0, sanctioned_payment: 0, billing_sample: 0, billing_amount: 0, payment_received: 0, expenses_total: 0, created_at: '2026-04-01', updated_at: '2026-04-09' },
  { id: 5, lab_code: 'RAD003', district: 'Guna', block: 'Bamori', company_name: 'Radhika', coordinator: 'Shubham Raghuwanshi', target: 0, sanctioned_target: 0, hand_over_samples: 0, sample_tested: 0, shc_printed: 0, shc_handover: 0, sanctioned_payment: 0, billing_sample: 0, billing_amount: 0, payment_received: 0, expenses_total: 0, created_at: '2026-04-01', updated_at: '2026-04-09' },
  { id: 6, lab_code: 'SRH003', district: 'Singrauli', block: 'Waidhan', company_name: 'SRH', coordinator: 'Nitin Tomar', target: 0, sanctioned_target: 0, hand_over_samples: 0, sample_tested: 0, shc_printed: 0, shc_handover: 0, sanctioned_payment: 0, billing_sample: 0, billing_amount: 0, payment_received: 0, expenses_total: 0, created_at: '2026-04-01', updated_at: '2026-04-09' },
  { id: 7, lab_code: 'RAD004', district: 'Morena', block: 'Joura', company_name: 'Radhika', coordinator: 'Kuldeep Singh', target: 0, sanctioned_target: 0, hand_over_samples: 0, sample_tested: 0, shc_printed: 0, shc_handover: 0, sanctioned_payment: 0, billing_sample: 0, billing_amount: 0, payment_received: 0, expenses_total: 0, created_at: '2026-04-01', updated_at: '2026-04-09' },
  { id: 8, lab_code: 'SRH004', district: 'Bhind', block: 'Raoun', company_name: 'SRH', coordinator: 'Kuldeep Singh', target: 0, sanctioned_target: 0, hand_over_samples: 0, sample_tested: 0, shc_printed: 0, shc_handover: 0, sanctioned_payment: 0, billing_sample: 0, billing_amount: 0, payment_received: 0, expenses_total: 0, created_at: '2026-04-01', updated_at: '2026-04-09' },
  { id: 9, lab_code: 'RAD005', district: 'Khandwa', block: 'Harsud', company_name: 'Radhika', coordinator: 'Abhishek Raghuwanshi', target: 0, sanctioned_target: 0, hand_over_samples: 0, sample_tested: 0, shc_printed: 0, shc_handover: 0, sanctioned_payment: 0, billing_sample: 0, billing_amount: 0, payment_received: 0, expenses_total: 0, created_at: '2026-04-01', updated_at: '2026-04-09' },
  { id: 10, lab_code: 'RAD006', district: 'Betul', block: 'Multai', company_name: 'Radhika', coordinator: 'Shubham Raghuwanshi', target: 0, sanctioned_target: 0, hand_over_samples: 0, sample_tested: 0, shc_printed: 0, shc_handover: 0, sanctioned_payment: 0, billing_sample: 0, billing_amount: 0, payment_received: 0, expenses_total: 0, created_at: '2026-04-01', updated_at: '2026-04-09' },
  { id: 11, lab_code: 'SRH005', district: 'Anuppur', block: 'Jaithari', company_name: 'SRH', coordinator: 'Nitin Tomar', target: 0, sanctioned_target: 0, hand_over_samples: 0, sample_tested: 0, shc_printed: 0, shc_handover: 0, sanctioned_payment: 0, billing_sample: 0, billing_amount: 0, payment_received: 0, expenses_total: 0, created_at: '2026-04-01', updated_at: '2026-04-09' },
  { id: 12, lab_code: 'PRS001', district: 'Harda', block: 'Timarni', company_name: 'Porsa', coordinator: 'Abhishek Raghuwanshi', target: 0, sanctioned_target: 0, hand_over_samples: 0, sample_tested: 0, shc_printed: 0, shc_handover: 0, sanctioned_payment: 0, billing_sample: 0, billing_amount: 0, payment_received: 0, expenses_total: 0, created_at: '2026-04-01', updated_at: '2026-04-09' },
  { id: 13, lab_code: 'RAD007', district: 'Bhind', block: 'Mehgaon', company_name: 'Radhika', coordinator: 'Kuldeep Singh', target: 0, sanctioned_target: 0, hand_over_samples: 0, sample_tested: 0, shc_printed: 0, shc_handover: 0, sanctioned_payment: 0, billing_sample: 0, billing_amount: 0, payment_received: 0, expenses_total: 0, created_at: '2026-04-01', updated_at: '2026-04-09' },
  { id: 14, lab_code: 'RAD008', district: 'Ujjain', block: 'Barnagar', company_name: 'Radhika', coordinator: 'Akshay Tiwari', target: 0, sanctioned_target: 0, hand_over_samples: 0, sample_tested: 0, shc_printed: 0, shc_handover: 0, sanctioned_payment: 0, billing_sample: 0, billing_amount: 0, payment_received: 0, expenses_total: 0, created_at: '2026-04-01', updated_at: '2026-04-09' },
  { id: 15, lab_code: 'RAD009', district: 'Gwalior', block: 'Dabra', company_name: 'Radhika', coordinator: 'Kuldeep Singh', target: 0, sanctioned_target: 0, hand_over_samples: 0, sample_tested: 0, shc_printed: 0, shc_handover: 0, sanctioned_payment: 0, billing_sample: 0, billing_amount: 0, payment_received: 0, expenses_total: 0, created_at: '2026-04-01', updated_at: '2026-04-09' },
  { id: 16, lab_code: 'RAD010', district: 'Shahdol', block: 'Beohari', company_name: 'Radhika', coordinator: 'Nitin Tomar', target: 0, sanctioned_target: 0, hand_over_samples: 0, sample_tested: 0, shc_printed: 0, shc_handover: 0, sanctioned_payment: 0, billing_sample: 0, billing_amount: 0, payment_received: 0, expenses_total: 0, created_at: '2026-04-01', updated_at: '2026-04-09' },
  { id: 17, lab_code: 'SRH006', district: 'Morena', block: 'Pahadgarh', company_name: 'SRH', coordinator: 'Kuldeep Singh', target: 0, sanctioned_target: 0, hand_over_samples: 0, sample_tested: 0, shc_printed: 0, shc_handover: 0, sanctioned_payment: 0, billing_sample: 0, billing_amount: 0, payment_received: 0, expenses_total: 0, created_at: '2026-04-01', updated_at: '2026-04-09' },
  { id: 18, lab_code: 'PRS002', district: 'Dewas', block: 'Khategaon', company_name: 'Porsa', coordinator: 'Akshay Tiwari', target: 0, sanctioned_target: 0, hand_over_samples: 0, sample_tested: 0, shc_printed: 0, shc_handover: 0, sanctioned_payment: 0, billing_sample: 0, billing_amount: 0, payment_received: 0, expenses_total: 0, created_at: '2026-04-01', updated_at: '2026-04-09' },
  { id: 19, lab_code: 'PRS003', district: 'Sidhi', block: 'Kusmi', company_name: 'Porsa', coordinator: 'Nitin Tomar', target: 0, sanctioned_target: 0, hand_over_samples: 0, sample_tested: 0, shc_printed: 0, shc_handover: 0, sanctioned_payment: 0, billing_sample: 0, billing_amount: 0, payment_received: 0, expenses_total: 0, created_at: '2026-04-01', updated_at: '2026-04-09' },
  { id: 20, lab_code: 'SRH007', district: 'Shahdol', block: 'Jaisinghagar', company_name: 'SRH', coordinator: 'Nitin Tomar', target: 0, sanctioned_target: 0, hand_over_samples: 0, sample_tested: 0, shc_printed: 0, shc_handover: 0, sanctioned_payment: 0, billing_sample: 0, billing_amount: 0, payment_received: 0, expenses_total: 0, created_at: '2026-04-01', updated_at: '2026-04-09' },
  { id: 21, lab_code: 'SRH008', district: 'Satna', block: 'Nagod', company_name: 'SRH', coordinator: 'Nitin Tomar', target: 0, sanctioned_target: 0, hand_over_samples: 0, sample_tested: 0, shc_printed: 0, shc_handover: 0, sanctioned_payment: 0, billing_sample: 0, billing_amount: 0, payment_received: 0, expenses_total: 0, created_at: '2026-04-01', updated_at: '2026-04-09' },
  { id: 22, lab_code: 'SRH009', district: 'Agar Malwa', block: 'Nalkheda', company_name: 'SRH', coordinator: 'Shubham Raghuwanshi', target: 0, sanctioned_target: 0, hand_over_samples: 0, sample_tested: 0, shc_printed: 0, shc_handover: 0, sanctioned_payment: 0, billing_sample: 0, billing_amount: 0, payment_received: 0, expenses_total: 0, created_at: '2026-04-01', updated_at: '2026-04-09' },
  { id: 23, lab_code: 'SRH010', district: 'Datia', block: 'Bhander', company_name: 'SRH', coordinator: 'Kuldeep Singh', target: 0, sanctioned_target: 0, hand_over_samples: 0, sample_tested: 0, shc_printed: 0, shc_handover: 0, sanctioned_payment: 0, billing_sample: 0, billing_amount: 0, payment_received: 0, expenses_total: 0, created_at: '2026-04-01', updated_at: '2026-04-09' },
  { id: 24, lab_code: 'SRH011', district: 'Sidhi', block: 'Rampurnaikin', company_name: 'SRH', coordinator: 'Nitin Tomar', target: 0, sanctioned_target: 0, hand_over_samples: 0, sample_tested: 0, shc_printed: 0, shc_handover: 0, sanctioned_payment: 0, billing_sample: 0, billing_amount: 0, payment_received: 0, expenses_total: 0, created_at: '2026-04-01', updated_at: '2026-04-09' },
  { id: 25, lab_code: 'SRH012', district: 'Rewa', block: 'Sirmour', company_name: 'SRH', coordinator: 'Nitin Tomar', target: 0, sanctioned_target: 0, hand_over_samples: 0, sample_tested: 0, shc_printed: 0, shc_handover: 0, sanctioned_payment: 0, billing_sample: 0, billing_amount: 0, payment_received: 0, expenses_total: 0, created_at: '2026-04-01', updated_at: '2026-04-09' },
  { id: 26, lab_code: 'SRH013', district: 'Raisen', block: 'Udaipura', company_name: 'SRH', coordinator: 'Nitin Tomar', target: 0, sanctioned_target: 0, hand_over_samples: 0, sample_tested: 0, shc_printed: 0, shc_handover: 0, sanctioned_payment: 0, billing_sample: 0, billing_amount: 0, payment_received: 0, expenses_total: 0, created_at: '2026-04-01', updated_at: '2026-04-09' },
  { id: 27, lab_code: 'SRH014', district: 'Sheopur', block: 'Karahal', company_name: 'SRH', coordinator: 'Kuldeep Singh', target: 0, sanctioned_target: 0, hand_over_samples: 0, sample_tested: 0, shc_printed: 0, shc_handover: 0, sanctioned_payment: 0, billing_sample: 0, billing_amount: 0, payment_received: 0, expenses_total: 0, created_at: '2026-04-01', updated_at: '2026-04-09' },
  { id: 28, lab_code: 'PRS004', district: 'Barwani', block: 'Rajpur', company_name: 'Porsa', coordinator: 'Shubham Raghuwanshi', target: 0, sanctioned_target: 0, hand_over_samples: 0, sample_tested: 0, shc_printed: 0, shc_handover: 0, sanctioned_payment: 0, billing_sample: 0, billing_amount: 0, payment_received: 0, expenses_total: 0, created_at: '2026-04-01', updated_at: '2026-04-09' },
  { id: 29, lab_code: 'PRS005', district: 'Bhind', block: 'Gohad', company_name: 'Porsa', coordinator: 'Kuldeep Singh', target: 0, sanctioned_target: 0, hand_over_samples: 0, sample_tested: 0, shc_printed: 0, shc_handover: 0, sanctioned_payment: 0, billing_sample: 0, billing_amount: 0, payment_received: 0, expenses_total: 0, created_at: '2026-04-01', updated_at: '2026-04-09' },
  { id: 30, lab_code: 'RAD011', district: 'Rewa', block: 'Theonthar', company_name: 'Radhika', coordinator: 'Nitin Tomar', target: 0, sanctioned_target: 0, hand_over_samples: 0, sample_tested: 0, shc_printed: 0, shc_handover: 0, sanctioned_payment: 0, billing_sample: 0, billing_amount: 0, payment_received: 0, expenses_total: 0, created_at: '2026-04-01', updated_at: '2026-04-09' },
  { id: 31, lab_code: 'PRS006', district: 'Sheopur', block: 'Vijaypur', company_name: 'Porsa', coordinator: 'Kuldeep Singh', target: 0, sanctioned_target: 0, hand_over_samples: 0, sample_tested: 0, shc_printed: 0, shc_handover: 0, sanctioned_payment: 0, billing_sample: 0, billing_amount: 0, payment_received: 0, expenses_total: 0, created_at: '2026-04-01', updated_at: '2026-04-09' },
  { id: 32, lab_code: 'SRH015', district: 'Shivpuri', block: 'Khaniadhana', company_name: 'SRH', coordinator: 'Shubham Raghuwanshi', target: 0, sanctioned_target: 0, hand_over_samples: 0, sample_tested: 0, shc_printed: 0, shc_handover: 0, sanctioned_payment: 0, billing_sample: 0, billing_amount: 0, payment_received: 0, expenses_total: 0, created_at: '2026-04-01', updated_at: '2026-04-09' },
  { id: 33, lab_code: 'SRH016', district: 'Guna', block: 'Chachoda', company_name: 'SRH', coordinator: 'Shubham Raghuwanshi', target: 0, sanctioned_target: 0, hand_over_samples: 0, sample_tested: 0, shc_printed: 0, shc_handover: 0, sanctioned_payment: 0, billing_sample: 0, billing_amount: 0, payment_received: 0, expenses_total: 0, created_at: '2026-04-01', updated_at: '2026-04-09' },
  { id: 34, lab_code: 'RAD012', district: 'Shivpuri', block: 'Pohri', company_name: 'Radhika', coordinator: 'Shubham Raghuwanshi', target: 0, sanctioned_target: 0, hand_over_samples: 0, sample_tested: 0, shc_printed: 0, shc_handover: 0, sanctioned_payment: 0, billing_sample: 0, billing_amount: 0, payment_received: 0, expenses_total: 0, created_at: '2026-04-01', updated_at: '2026-04-09' },
  { id: 35, lab_code: 'SRH017', district: 'Barwani', block: 'Niwali', company_name: 'SRH', coordinator: 'Shubham Raghuwanshi', target: 0, sanctioned_target: 0, hand_over_samples: 0, sample_tested: 0, shc_printed: 0, shc_handover: 0, sanctioned_payment: 0, billing_sample: 0, billing_amount: 0, payment_received: 0, expenses_total: 0, created_at: '2026-04-01', updated_at: '2026-04-09' },
  { id: 36, lab_code: 'RAD013', district: 'Neemuch', block: 'Jawad', company_name: 'Radhika', coordinator: 'Akshay Tiwari', target: 0, sanctioned_target: 0, hand_over_samples: 0, sample_tested: 0, shc_printed: 0, shc_handover: 0, sanctioned_payment: 0, billing_sample: 0, billing_amount: 0, payment_received: 0, expenses_total: 0, created_at: '2026-04-01', updated_at: '2026-04-09' },
  { id: 37, lab_code: 'SRH018', district: 'Rajgarh', block: 'Khilchipur', company_name: 'SRH', coordinator: 'Shubham Raghuwanshi', target: 0, sanctioned_target: 0, hand_over_samples: 0, sample_tested: 0, shc_printed: 0, shc_handover: 0, sanctioned_payment: 0, billing_sample: 0, billing_amount: 0, payment_received: 0, expenses_total: 0, created_at: '2026-04-01', updated_at: '2026-04-09' },
  { id: 38, lab_code: 'RAD014', district: 'Rajgarh', block: 'Biaora', company_name: 'Radhika', coordinator: 'Shubham Raghuwanshi', target: 0, sanctioned_target: 0, hand_over_samples: 0, sample_tested: 0, shc_printed: 0, shc_handover: 0, sanctioned_payment: 0, billing_sample: 0, billing_amount: 0, payment_received: 0, expenses_total: 0, created_at: '2026-04-01', updated_at: '2026-04-09' },
  { id: 39, lab_code: 'RAD015', district: 'Guna', block: 'Bamori', company_name: 'Radhika', coordinator: 'Shubham Raghuwanshi', target: 0, sanctioned_target: 0, hand_over_samples: 0, sample_tested: 0, shc_printed: 0, shc_handover: 0, sanctioned_payment: 0, billing_sample: 0, billing_amount: 0, payment_received: 0, expenses_total: 0, created_at: '2026-04-01', updated_at: '2026-04-09' },
  { id: 40, lab_code: 'SRH019', district: 'Ujjain', block: 'Mahidpur', company_name: 'SRH', coordinator: 'Akshay Tiwari', target: 0, sanctioned_target: 0, hand_over_samples: 0, sample_tested: 0, shc_printed: 0, shc_handover: 0, sanctioned_payment: 0, billing_sample: 0, billing_amount: 0, payment_received: 0, expenses_total: 0, created_at: '2026-04-01', updated_at: '2026-04-09' },
  { id: 41, lab_code: 'PRS007', district: 'Morena', block: 'Porsa', company_name: 'Porsa', coordinator: 'Kuldeep Singh', target: 0, sanctioned_target: 0, hand_over_samples: 0, sample_tested: 0, shc_printed: 0, shc_handover: 0, sanctioned_payment: 0, billing_sample: 0, billing_amount: 0, payment_received: 0, expenses_total: 0, created_at: '2026-04-01', updated_at: '2026-04-09' },
];

// Expert-to-lab mapping (S.N from Excel → lab id)
export const EXPERT_LAB_MAP: Record<string, { expert: string; lab_id: number }> = {
  '1': { expert: 'Satyadev Kol', lab_id: 1 },
  '2': { expert: 'Ritesh Kumar', lab_id: 2 },
  '3': { expert: 'Arjun Dhanora', lab_id: 3 },
  '4': { expert: 'Dipak Muniya', lab_id: 4 },
  '5': { expert: 'Devansh Raghuwanshi', lab_id: 5 },
  '6': { expert: 'Sakshi Singh', lab_id: 6 },
  '7': { expert: 'Madan Mohan Dandotiya', lab_id: 7 },
  '8': { expert: 'Gopal Singh Rajawat', lab_id: 8 },
  '9': { expert: 'Pranjal Verma', lab_id: 9 },
  '10': { expert: 'Dipanshu Manker', lab_id: 10 },
  '11': { expert: 'Nehal Mansoori', lab_id: 11 },
  '12': { expert: 'Basant Keer', lab_id: 12 },
  '13': { expert: 'Vinay Bhadouriya', lab_id: 13 },
  '14': { expert: 'Gokul Sekwadiya', lab_id: 14 },
  '15': { expert: 'Arun Yadav', lab_id: 15 },
  '16': { expert: 'Lalit Singh Kushwah', lab_id: 16 },
  '17': { expert: 'Akash Dhakar', lab_id: 17 },
  '18': { expert: 'Anand Gurjar', lab_id: 18 },
  '19': { expert: 'Ashok Singh', lab_id: 19 },
  '20': { expert: 'Ashwani Kumar Singh', lab_id: 20 },
  '21': { expert: 'Durgatma D Garg', lab_id: 21 },
  '22': { expert: 'Jitendra Bhilala', lab_id: 22 },
  '23': { expert: 'Vikas Goswami', lab_id: 23 },
  '24': { expert: 'Anurag Singh', lab_id: 24 },
  '25': { expert: 'Hemant Singh', lab_id: 25 },
  '26': { expert: 'Vikram Raghuwanshi', lab_id: 26 },
  '27': { expert: 'Dharmendra Singh', lab_id: 27 },
  '28': { expert: 'Abhishek Solanki', lab_id: 28 },
  '29': { expert: 'Pushpendra Singh Kushwah', lab_id: 29 },
  '30': { expert: 'Sanjay Singh', lab_id: 30 },
  '31': { expert: 'Ravi Kushwah', lab_id: 31 },
  '32': { expert: 'Anil Kumar Lodhi', lab_id: 32 },
  '33': { expert: 'Rahul Paliya', lab_id: 33 },
  '34': { expert: 'Ramveer Rawat', lab_id: 34 },
  '35': { expert: 'Pyar Singh Solanki', lab_id: 35 },
  '37': { expert: 'Pankaj Rathore', lab_id: 36 },
  '38': { expert: 'Jagdish Prasad Gour', lab_id: 37 },
  '39': { expert: 'Mukesh Dangi', lab_id: 38 },
  '40': { expert: 'Anand Kirar', lab_id: 39 },
  '41': { expert: 'Digvijay Porwal', lab_id: 40 },
  '42': { expert: 'Abhishek Sharma', lab_id: 41 },
};

export const MOCK_BILLS: Bill[] = [
  {
    id: 1, bill_no: 'Raisen Bill 01', lab_id: 1, district: 'Sidhi', company_name: 'SRH',
    bill_date: '2026-04-01', billing_samples: 1000, billing_amount: 235000,
    bill_copy_url: null, submitted_by: null, submission_status: 'approved',
    approved_by: null, approved_at: '2026-04-05', rejection_reason: null,
    sanctioned_order_number: 'Raisen Bill 01', sanctioned_order_copy_url: null,
    payment_status: 'received', payment_date: '2026-04-15',
    payment_amount: 235000, utr_number: 'ubi122244488777888',
    created_at: '2026-04-01', updated_at: '2026-04-15',
  },
];

export const MOCK_EXPENSES: Expense[] = [
  {
    id: 1, lab_id: 1, month: 'april', year: 2026,
    salary: 15000, electricity: 1000, chemical: 12000,
    stationery: 20000, printing: 100, lifafa: 18000,
    cleaning: 1200, other: 500, tour: 6000,
    approval_status: 'approved', approved_by: 'Nitin Tomar', approved_at: '2026-04-10T14:00:00',
    rejection_reason: null, submitted_by: 'Satyadev Kol',
    created_at: '2026-04-01',
  },
  {
    id: 2, lab_id: 1, month: 'may', year: 2026,
    salary: 15000, electricity: 1200, chemical: 10000,
    stationery: 18000, printing: 200, lifafa: 16000,
    cleaning: 1000, other: 800, tour: 5000,
    approval_status: 'submitted', approved_by: null, approved_at: null,
    rejection_reason: null, submitted_by: 'Satyadev Kol',
    created_at: '2026-05-01',
  },
  {
    id: 3, lab_id: 2, month: 'april', year: 2026,
    salary: 14000, electricity: 900, chemical: 11000,
    stationery: 15000, printing: 150, lifafa: 14000,
    cleaning: 1100, other: 600, tour: 4500,
    approval_status: 'submitted', approved_by: null, approved_at: null,
    rejection_reason: null, submitted_by: 'Ritesh Kumar',
    created_at: '2026-04-02',
  },
  {
    id: 4, lab_id: 31, month: 'april', year: 2026,
    salary: 13000, electricity: 800, chemical: 9000,
    stationery: 12000, printing: 100, lifafa: 10000,
    cleaning: 900, other: 400, tour: 3500,
    approval_status: 'rejected', approved_by: null, approved_at: null,
    rejection_reason: 'Chemical expenses seem too high, please verify bills', submitted_by: 'Ravi Kushwah',
    created_at: '2026-04-03',
  },
];

export const MOCK_STOCK_ITEMS: StockItem[] = [
  { id: 1, lab_id: 1, item_name: 'pH Buffer Solution (4.0)', category: 'chemicals', indent_demand: 10, supply: 10, status: 'done', remark: 'Supplied in full', requested_by: 'Satyadev Kol', updated_at: '2026-03-15' },
  { id: 2, lab_id: 1, item_name: 'NPK Testing Kit', category: 'chemicals', indent_demand: 5, supply: 3, status: 'done', remark: 'Partial supply', requested_by: 'Satyadev Kol', updated_at: '2026-03-20' },
  { id: 3, lab_id: 1, item_name: 'Volumetric Flask 250ml', category: 'equipment', indent_demand: 8, supply: 0, status: 'pending', remark: null, requested_by: 'Satyadev Kol', updated_at: '2026-04-05' },
  { id: 4, lab_id: 1, item_name: 'Sample Collection Bags', category: 'consumables', indent_demand: 500, supply: 0, status: 'pending', remark: 'Urgent - running low', requested_by: 'Satyadev Kol', updated_at: '2026-04-08' },
  { id: 5, lab_id: 31, item_name: 'Conductivity Meter Probe', category: 'equipment', indent_demand: 2, supply: 0, status: 'pending', remark: 'Current probe damaged', requested_by: 'Ravi Kushwah', updated_at: '2026-04-10' },
  { id: 6, lab_id: 31, item_name: 'Organic Carbon Reagent', category: 'chemicals', indent_demand: 15, supply: 15, status: 'done', remark: null, requested_by: 'Ravi Kushwah', updated_at: '2026-03-25' },
  { id: 7, lab_id: 31, item_name: 'Printer Cartridge', category: 'consumables', indent_demand: 2, supply: 1, status: 'done', remark: 'Only 1 available', requested_by: 'Ravi Kushwah', updated_at: '2026-04-01' },
  { id: 8, lab_id: 31, item_name: 'Distilled Water (20L)', category: 'chemicals', indent_demand: 10, supply: 0, status: 'pending', remark: null, requested_by: 'Ravi Kushwah', updated_at: '2026-04-12' },
  { id: 9, lab_id: 2, item_name: 'Pipette Tips (1000 pack)', category: 'consumables', indent_demand: 3, supply: 0, status: 'pending', remark: null, requested_by: 'Ritesh Kumar', updated_at: '2026-04-09' },
  { id: 10, lab_id: 2, item_name: 'Boron Testing Kit', category: 'chemicals', indent_demand: 4, supply: 4, status: 'done', remark: null, requested_by: 'Ritesh Kumar', updated_at: '2026-03-18' },
];

export const MOCK_DISPATCHES: Dispatch[] = [];

// Pending approval items for coordinator inbox
export interface PendingApproval {
  id: number;
  lab_id: number;
  type: 'lab_data' | 'register' | 'expense';
  field?: string;
  old_value?: number;
  new_value?: number;
  submitted_by: string;
  submitted_at: string;
  status: 'pending' | 'approved' | 'rejected';
}

export const MOCK_APPROVALS: PendingApproval[] = [
  { id: 1, lab_id: 1, type: 'lab_data', field: 'sample_tested', old_value: 1800, new_value: 2000, submitted_by: 'Satyadev Kol', submitted_at: '2026-04-09T10:30:00', status: 'pending' },
  { id: 2, lab_id: 1, type: 'lab_data', field: 'shc_printed', old_value: 900, new_value: 1000, submitted_by: 'Satyadev Kol', submitted_at: '2026-04-09T10:30:00', status: 'pending' },
  { id: 3, lab_id: 1, type: 'register', field: 'result_entry', submitted_by: 'Satyadev Kol', submitted_at: '2026-04-08T14:00:00', status: 'approved' },
  { id: 4, lab_id: 2, type: 'lab_data', field: 'sample_tested', old_value: 3200, new_value: 3500, submitted_by: 'Ritesh Kumar', submitted_at: '2026-04-09T11:00:00', status: 'pending' },
];

// Helper: check if we're in preview mode (no real Supabase)
export const IS_PREVIEW = process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder') ?? true;
