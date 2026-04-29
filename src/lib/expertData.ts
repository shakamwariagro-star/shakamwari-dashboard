import type { ExpertUser } from './types';

// All Soil Testing Experts from Dashboard AR Excel — Main Page Home Page
// Username: first name lowercase | Password: phone number from Master Data
export const EXPERT_USERS: ExpertUser[] = [
  // 1. Sidhi / Majholi / SRH — Nitin Tomar
  { id: 'exp-001', username: 'satyadev', password: '7089239279', full_name: 'Satyadev Kol', phone: '7089239279', employee_number: '3', assigned_lab_id: 1, coordinator: 'Nitin Tomar', company: 'SRH', role: 'soil_testing_expert' },
  // 2. Sehore / Ichhawar / SRH — Akshay Tiwari
  { id: 'exp-002', username: 'ritesh', password: '9302607733', full_name: 'Ritesh Kumar', phone: '9302607733', employee_number: '6', assigned_lab_id: 2, coordinator: 'Akshay Tiwari', company: 'SRH', role: 'soil_testing_expert' },
  // 3. Ratlam / Jaora / Radhika — Akshay Tiwari
  { id: 'exp-003', username: 'arjun', password: '8819868365', full_name: 'Arjun Dhanora', phone: '8819868365', employee_number: '7', assigned_lab_id: 3, coordinator: 'Akshay Tiwari', company: 'Radhika', role: 'soil_testing_expert' },
  // 4. Raisen / Badi / Radhika — Nitin Tomar
  { id: 'exp-004', username: 'dipak', password: '9131362734', full_name: 'Dipak Muniya', phone: '9131362734', employee_number: '8', assigned_lab_id: 4, coordinator: 'Nitin Tomar', company: 'Radhika', role: 'soil_testing_expert' },
  // 5. Guna / Bamori / Radhika — Shubham Raghuwanshi
  { id: 'exp-005', username: 'sumit', password: '7828643014', full_name: 'Sumit Dhakad', phone: '7828643014', employee_number: '10', assigned_lab_id: 5, coordinator: 'Shubham Raghuwanshi', company: 'Radhika', role: 'soil_testing_expert' },
  // 6. Singrauli / Waidhan / SRH — Nitin Tomar
  { id: 'exp-006', username: 'sakshi', password: '6264359790', full_name: 'Sakshi Singh', phone: '6264359790', employee_number: 'SAI0026', assigned_lab_id: 6, coordinator: 'Nitin Tomar', company: 'SRH', role: 'soil_testing_expert' },
  // 7. Morena / Joura / Radhika — Kuldeep Singh
  { id: 'exp-007', username: 'madan', password: '7987663316', full_name: 'Madan Mohan Dandotiya', phone: '7987663316', employee_number: 'SAI0027', assigned_lab_id: 7, coordinator: 'Kuldeep Singh', company: 'Radhika', role: 'soil_testing_expert' },
  // 8. Bhind / Raoun / SRH — Kuldeep Singh
  { id: 'exp-008', username: 'gopal', password: '7999883984', full_name: 'Gopal Singh Rajawat', phone: '7999883984', employee_number: 'SAI0010', assigned_lab_id: 8, coordinator: 'Kuldeep Singh', company: 'SRH', role: 'soil_testing_expert' },
  // 9. Khandwa / Harsud / Radhika — Abhishek Raghuwanshi
  { id: 'exp-009', username: 'pranjal', password: '9691375827', full_name: 'Pranjal Verma', phone: '9691375827', employee_number: 'SAI0012', assigned_lab_id: 9, coordinator: 'Abhishek Raghuwanshi', company: 'Radhika', role: 'soil_testing_expert' },
  // 10. Betul / Multai / Radhika — Shubham Raghuwanshi
  { id: 'exp-010', username: 'dipanshu', password: '7999667698', full_name: 'Dipanshu Manker', phone: '7999667698', employee_number: 'SAI0013', assigned_lab_id: 10, coordinator: 'Shubham Raghuwanshi', company: 'Radhika', role: 'soil_testing_expert' },
  // 11. Anuppur / Jaithari / SRH — Nitin Tomar
  { id: 'exp-011', username: 'nehal', password: '9770510266', full_name: 'Nehal Mansoori', phone: '9770510266', employee_number: 'SAI0014', assigned_lab_id: 11, coordinator: 'Nitin Tomar', company: 'SRH', role: 'soil_testing_expert' },
  // 12. Harda / Timarni / Porsa — Abhishek Raghuwanshi
  { id: 'exp-012', username: 'basant', password: '9617900178', full_name: 'Basant Keer', phone: '9617900178', employee_number: 'SAI0015', assigned_lab_id: 12, coordinator: 'Abhishek Raghuwanshi', company: 'Porsa', role: 'soil_testing_expert' },
  // 13. Bhind / Mehgaon / Radhika — Kuldeep Singh
  { id: 'exp-013', username: 'vinay', password: '8305976325', full_name: 'Vinay Bhadouriya', phone: '8305976325', employee_number: 'SAI0016', assigned_lab_id: 13, coordinator: 'Kuldeep Singh', company: 'Radhika', role: 'soil_testing_expert' },
  // 14. Ujjain / Barnagar / Radhika — Akshay Tiwari
  { id: 'exp-014', username: 'gokul', password: '9644755331', full_name: 'Gokul Sekwadiya', phone: '9644755331', employee_number: 'SAI0017', assigned_lab_id: 14, coordinator: 'Akshay Tiwari', company: 'Radhika', role: 'soil_testing_expert' },
  // 15. Gwalior / Dabra / Radhika — Kuldeep Singh
  { id: 'exp-015', username: 'arun', password: '7000189581', full_name: 'Arun Yadav', phone: '7000189581', employee_number: 'SAI0018', assigned_lab_id: 15, coordinator: 'Kuldeep Singh', company: 'Radhika', role: 'soil_testing_expert' },
  // 16. Shahdol / Beohari / Radhika — Nitin Tomar
  { id: 'exp-016', username: 'lalit', password: '9981967654', full_name: 'Lalit Singh Kushwah', phone: '9981967654', employee_number: 'SAI0019', assigned_lab_id: 16, coordinator: 'Nitin Tomar', company: 'Radhika', role: 'soil_testing_expert' },
  // 17. Morena / Pahadgarh / SRH — Kuldeep Singh
  { id: 'exp-017', username: 'akash', password: '6269075443', full_name: 'Akash Dhakar', phone: '6269075443', employee_number: 'SAI0020', assigned_lab_id: 17, coordinator: 'Kuldeep Singh', company: 'SRH', role: 'soil_testing_expert' },
  // 18. Dewas / Khategaon / Porsa — Akshay Tiwari
  { id: 'exp-018', username: 'anand', password: '9584670132', full_name: 'Anand Gurjar', phone: '9584670132', employee_number: 'SAI0021', assigned_lab_id: 18, coordinator: 'Akshay Tiwari', company: 'Porsa', role: 'soil_testing_expert' },
  // 19. Sidhi / Kusmi / Porsa — Nitin Tomar
  { id: 'exp-019', username: 'ashok', password: '8815453291', full_name: 'Ashok Singh', phone: '8815453291', employee_number: 'SAI0022', assigned_lab_id: 19, coordinator: 'Nitin Tomar', company: 'Porsa', role: 'soil_testing_expert' },
  // 20. Shahdol / Jaisinghagar / SRH — Nitin Tomar
  { id: 'exp-020', username: 'ashwani', password: '6264895175', full_name: 'Ashwani Kumar Singh', phone: '6264895175', employee_number: 'SAI0023', assigned_lab_id: 20, coordinator: 'Nitin Tomar', company: 'SRH', role: 'soil_testing_expert' },
  // 21. Satna / Nagod / SRH — Nitin Tomar
  { id: 'exp-021', username: 'durgatma', password: '9399199882', full_name: 'Durgatma D Garg', phone: '9399199882', employee_number: 'SAI0024', assigned_lab_id: 21, coordinator: 'Nitin Tomar', company: 'SRH', role: 'soil_testing_expert' },
  // 22. Agar Malwa / Nalkheda / SRH — Shubham Raghuwanshi
  { id: 'exp-022', username: 'jitendra', password: '9165849893', full_name: 'Jitendra Bhilala', phone: '9165849893', employee_number: 'SAI0025', assigned_lab_id: 22, coordinator: 'Shubham Raghuwanshi', company: 'SRH', role: 'soil_testing_expert' },
  // 23. Datia / Bhander / SRH — Kuldeep Singh
  { id: 'exp-023', username: 'vikas', password: '9039514211', full_name: 'Vikas Goswami', phone: '9039514211', employee_number: 'SAI0029', assigned_lab_id: 23, coordinator: 'Kuldeep Singh', company: 'SRH', role: 'soil_testing_expert' },
  // 24. Sidhi / Rampurnaikin / SRH — Nitin Tomar
  { id: 'exp-024', username: 'anurag', password: '9876543210', full_name: 'Anurag Singh', phone: '9876543210', employee_number: 'SAI0028', assigned_lab_id: 24, coordinator: 'Nitin Tomar', company: 'SRH', role: 'soil_testing_expert' },
  // 25. Rewa / Sirmour / SRH — Nitin Tomar
  { id: 'exp-025', username: 'hemant', password: '9285180277', full_name: 'Hemant Tiwari', phone: '9285180277', employee_number: '13', assigned_lab_id: 25, coordinator: 'Nitin Tomar', company: 'SRH', role: 'soil_testing_expert' },
  // 26. Raisen / Udaipura / SRH — Nitin Tomar
  { id: 'exp-026', username: 'vikram', password: '8435631651', full_name: 'Vikram Raghuwanshi', phone: '8435631651', employee_number: 'SAI0033', assigned_lab_id: 26, coordinator: 'Nitin Tomar', company: 'SRH', role: 'soil_testing_expert' },
  // 27. Sheopur / Karahal / SRH — Kuldeep Singh
  { id: 'exp-027', username: 'dharmendra', password: '9691542683', full_name: 'Dharmendra Singh', phone: '9691542683', employee_number: 'SAI0034', assigned_lab_id: 27, coordinator: 'Kuldeep Singh', company: 'SRH', role: 'soil_testing_expert' },
  // 28. Barwani / Rajpur / Porsa — Shubham Raghuwanshi
  { id: 'exp-028', username: 'abhisheks', password: '8355105770', full_name: 'Abhishek Solanki', phone: '8355105770', employee_number: 'SAI0035', assigned_lab_id: 28, coordinator: 'Shubham Raghuwanshi', company: 'Porsa', role: 'soil_testing_expert' },
  // 29. Bhind / Gohad / Porsa — Kuldeep Singh
  { id: 'exp-029', username: 'pushpendra', password: '7047177982', full_name: 'Pushpendra Singh Kushwah', phone: '7047177982', employee_number: 'SAI0036', assigned_lab_id: 29, coordinator: 'Kuldeep Singh', company: 'Porsa', role: 'soil_testing_expert' },
  // 30. Rewa / Theonthar / Radhika — Nitin Tomar
  { id: 'exp-030', username: 'sanjay', password: '8827887358', full_name: 'Sanjay Singh', phone: '8827887358', employee_number: 'SAI0037', assigned_lab_id: 30, coordinator: 'Nitin Tomar', company: 'Radhika', role: 'soil_testing_expert' },
  // 31. Sheopur / Vijaypur / Porsa — Kuldeep Singh
  { id: 'exp-031', username: 'ravi', password: '9294847905', full_name: 'Ravi Kushwah', phone: '9294847905', employee_number: 'SAI0038', assigned_lab_id: 31, coordinator: 'Kuldeep Singh', company: 'Porsa', role: 'soil_testing_expert' },
  // 32. Shivpuri / Khaniadhana / SRH — Shubham Raghuwanshi
  { id: 'exp-032', username: 'anilk', password: '9669641290', full_name: 'Anil Kumar Lodhi', phone: '9669641290', employee_number: 'SAI0039', assigned_lab_id: 32, coordinator: 'Shubham Raghuwanshi', company: 'SRH', role: 'soil_testing_expert' },
  // 33. Guna / Chachoda / SRH — Shubham Raghuwanshi
  { id: 'exp-033', username: 'rahul', password: '8982699410', full_name: 'Rahul Paliya', phone: '8982699410', employee_number: 'SAI0040', assigned_lab_id: 33, coordinator: 'Shubham Raghuwanshi', company: 'SRH', role: 'soil_testing_expert' },
  // 34. Shivpuri / Pohri / Radhika — Shubham Raghuwanshi
  { id: 'exp-034', username: 'ramveer', password: '8878367202', full_name: 'Ramveer Rawat', phone: '8878367202', employee_number: 'SAI0041', assigned_lab_id: 34, coordinator: 'Shubham Raghuwanshi', company: 'Radhika', role: 'soil_testing_expert' },
  // 35. Barwani / Niwali / SRH — Shubham Raghuwanshi
  { id: 'exp-035', username: 'pyar', password: '9584824865', full_name: 'Pyar Singh Solanki', phone: '9584824865', employee_number: 'SAI0042', assigned_lab_id: 35, coordinator: 'Shubham Raghuwanshi', company: 'SRH', role: 'soil_testing_expert' },
  // 36. Neemuch / Jawad / Radhika — Akshay Tiwari
  { id: 'exp-036', username: 'pankaj', password: '8827969885', full_name: 'Pankaj Rathore', phone: '8827969885', employee_number: 'SAI0055', assigned_lab_id: 36, coordinator: 'Akshay Tiwari', company: 'Radhika', role: 'soil_testing_expert' },
  // 37. Rajgarh / Khilchipur / SRH — Shubham Raghuwanshi
  { id: 'exp-037', username: 'jagdish', password: '8085934745', full_name: 'Jagdish Prasad Gour', phone: '8085934745', employee_number: 'SAI0057', assigned_lab_id: 37, coordinator: 'Shubham Raghuwanshi', company: 'SRH', role: 'soil_testing_expert' },
  // 38. Rajgarh / Biaora / Radhika — Shubham Raghuwanshi
  { id: 'exp-038', username: 'mukeshd', password: '9165763938', full_name: 'Mukesh Dangi', phone: '9165763938', employee_number: 'SAI0058', assigned_lab_id: 38, coordinator: 'Shubham Raghuwanshi', company: 'Radhika', role: 'soil_testing_expert' },
  // 39. Guna / Bamori / Radhika — Shubham Raghuwanshi
  { id: 'exp-039', username: 'anandk', password: '9584670132', full_name: 'Anand Kirar', phone: '9584670132', employee_number: 'SAI0059', assigned_lab_id: 39, coordinator: 'Shubham Raghuwanshi', company: 'Radhika', role: 'soil_testing_expert' },
  // 40. Ujjain / Mahidpur / SRH — Akshay Tiwari
  { id: 'exp-040', username: 'digvijay', password: '9522109332', full_name: 'Digvijay Porwal', phone: '9522109332', employee_number: 'SAI0060', assigned_lab_id: 40, coordinator: 'Akshay Tiwari', company: 'SRH', role: 'soil_testing_expert' },
  // 41. Morena / Porsa / Porsa — Kuldeep Singh
  { id: 'exp-041', username: 'abhisheksh', password: '7509217732', full_name: 'Abhishek Sharma', phone: '7509217732', employee_number: 'SAI009', assigned_lab_id: 41, coordinator: 'Kuldeep Singh', company: 'Porsa', role: 'soil_testing_expert' },
  // Extra: Shivam Dwivedi — also at Majholi lab
  { id: 'exp-042', username: 'shivam', password: '8269642752', full_name: 'Shivam Dwivedi', phone: '8269642752', employee_number: '11', assigned_lab_id: 1, coordinator: 'Nitin Tomar', company: 'SRH', role: 'soil_testing_expert' },
  // Extra: Nandani Verma — also at Sirmour lab
  { id: 'exp-043', username: 'nandani', password: '7610197523', full_name: 'Nandani Verma', phone: '7610197523', employee_number: 'SAI0032', assigned_lab_id: 25, coordinator: 'Nitin Tomar', company: 'SRH', role: 'soil_testing_expert' },
  // Extra: Dharmendra Raghuwanshi — Badi lab
  { id: 'exp-044', username: 'dharmendrr', password: '9876543211', full_name: 'Dharmendra Raghuwanshi', phone: '9876543211', employee_number: 'SAI0044', assigned_lab_id: 4, coordinator: 'Nitin Tomar', company: 'Radhika', role: 'soil_testing_expert' },
  // Extra: Sanjit Singh — Sidhi lab
  { id: 'exp-045', username: 'sanjit', password: '9977341589', full_name: 'Sanjit Singh', phone: '9977341589', employee_number: 'SAI0043', assigned_lab_id: 24, coordinator: 'Nitin Tomar', company: 'SRH', role: 'soil_testing_expert' },
];

// Authenticate expert by username + password
export function authenticateExpert(username: string, password: string): ExpertUser | null {
  const normalizedUsername = username.toLowerCase().trim();
  const normalizedPassword = password.trim();
  const match = EXPERT_USERS.find(
    (u) => u.username === normalizedUsername && u.password === normalizedPassword
  ) || null;
  return match;
}

// Get expert by ID
export function getExpertById(id: string): ExpertUser | null {
  return EXPERT_USERS.find((u) => u.id === id) || null;
}

// Get all experts for a specific lab
export function getExpertsByLabId(labId: number): ExpertUser[] {
  return EXPERT_USERS.filter((u) => u.assigned_lab_id === labId);
}
