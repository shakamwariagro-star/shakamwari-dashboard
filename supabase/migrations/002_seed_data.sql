-- Seed initial lab data from Excel
INSERT INTO labs (lab_code, district, block, company_name, coordinator, target, sanctioned_target, hand_over_samples, sample_tested, shc_printed, shc_handover, sanctioned_payment, billing_sample, billing_amount, payment_received, expenses_total) VALUES
('SRH101', 'Raisen', 'Badi', 'SRH', 'Nitin Tomar', 4500, 3000, 1000, 2000, 1000, 5000, 1085000, 1000, 235000, 0, 73800),
('RAD101', 'Raisen', 'Udaipura', 'Radhika', 'Nitin Tomar', 4500, 4200, 0, 3500, 10000, 0, 0, 0, 0, 0, 0),
('SHB101', 'Ujjain', 'Badnagar', 'Radhika', 'Shubham', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);

-- Seed expenses for lab 1 (April)
INSERT INTO expenses (lab_id, month, year, salary, electricity, chemical, stationery, printing, lifafa, cleaning, other, tour) VALUES
(1, 'April', 2026, 15000, 1000, 12000, 20000, 100, 18000, 1200, 500, 6000);

-- Seed stock items
INSERT INTO stock (lab_id, item_name, indent_demand, supply, status) VALUES
(1, 'Chemical', 5, 2, 'pending'),
(1, 'SHC', 2000, 1500, 'pending');
