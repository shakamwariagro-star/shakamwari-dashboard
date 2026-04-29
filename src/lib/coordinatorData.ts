import { MOCK_LABS } from './mockData';

export interface CoordinatorUser {
  id: string;
  username: string;
  password: string;
  full_name: string;
  phone: string;
  employee_number: string;
  title: string;
  role: 'coordinator';
}

export const COORDINATOR_USERS: CoordinatorUser[] = [
  { id: 'coord-001', username: 'nitin', password: '9713905333', full_name: 'Nitin Tomar', phone: '9713905333', employee_number: 'SAI007', title: 'Project Manager', role: 'coordinator' },
  { id: 'coord-002', username: 'shubham', password: '9713897650', full_name: 'Shubham Raghuwanshi', phone: '9713897650', employee_number: 'SAI005', title: 'Project Manager', role: 'coordinator' },
  { id: 'coord-003', username: 'kuldeep', password: '8225041978', full_name: 'Kuldeep Singh', phone: '8225041978', employee_number: 'SAI006', title: 'Project Manager', role: 'coordinator' },
  { id: 'coord-004', username: 'akshay', password: '9098019270', full_name: 'Akshay Tiwari', phone: '9098019270', employee_number: 'SAI0056', title: 'Regional Coordinator', role: 'coordinator' },
  { id: 'coord-005', username: 'abhishek', password: '9109878357', full_name: 'Abhishek Raghuwanshi', phone: '9109878357', employee_number: 'SAI008', title: 'Assistant Accountant', role: 'coordinator' },
];

export function authenticateCoordinator(username: string, password: string): CoordinatorUser | null {
  const normalized = username.toLowerCase().trim();
  const normalizedPassword = password.trim();
  const match = COORDINATOR_USERS.find(
    (u) => u.username === normalized && u.password === normalizedPassword
  ) || null;
  return match;
}

export function getCoordinatorById(id: string): CoordinatorUser | null {
  return COORDINATOR_USERS.find((u) => u.id === id) || null;
}

export function getLabsForCoordinator(coordinatorName: string) {
  return MOCK_LABS.filter(
    (l) => l.coordinator.toLowerCase() === coordinatorName.toLowerCase()
  );
}
