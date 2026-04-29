-- Profiles (extends Supabase Auth users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('lab_staff', 'team_leader', 'account_section', 'admin')),
  assigned_lab_id INTEGER,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Labs (main entity)
CREATE TABLE labs (
  id SERIAL PRIMARY KEY,
  lab_code TEXT UNIQUE NOT NULL,
  district TEXT NOT NULL,
  block TEXT NOT NULL,
  company_name TEXT NOT NULL,
  coordinator TEXT NOT NULL,
  target INTEGER DEFAULT 0,
  sanctioned_target INTEGER DEFAULT 0,
  hand_over_samples INTEGER DEFAULT 0,
  sample_tested INTEGER DEFAULT 0,
  shc_printed INTEGER DEFAULT 0,
  shc_handover INTEGER DEFAULT 0,
  sanctioned_payment NUMERIC(12,2) DEFAULT 0,
  billing_sample INTEGER DEFAULT 0,
  billing_amount NUMERIC(12,2) DEFAULT 0,
  payment_received NUMERIC(12,2) DEFAULT 0,
  expenses_total NUMERIC(12,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE profiles ADD CONSTRAINT fk_assigned_lab FOREIGN KEY (assigned_lab_id) REFERENCES labs(id);

-- Registers
CREATE TABLE registers (
  id SERIAL PRIMARY KEY,
  lab_id INTEGER REFERENCES labs(id) ON DELETE CASCADE NOT NULL,
  register_type TEXT NOT NULL,
  month TEXT NOT NULL,
  year INTEGER NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'done', 'approved')),
  file_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(lab_id, register_type, month, year)
);

-- Bills
CREATE TABLE bills (
  id SERIAL PRIMARY KEY,
  bill_no TEXT NOT NULL,
  lab_id INTEGER REFERENCES labs(id) ON DELETE CASCADE NOT NULL,
  district TEXT NOT NULL,
  company_name TEXT NOT NULL,
  bill_date DATE NOT NULL,
  billing_samples INTEGER NOT NULL,
  billing_amount NUMERIC(12,2) NOT NULL,
  bill_copy_url TEXT,
  submitted_by UUID REFERENCES profiles(id),
  submission_status TEXT DEFAULT 'pending' CHECK (submission_status IN ('pending', 'approved', 'rejected')),
  approved_by UUID REFERENCES profiles(id),
  approved_at TIMESTAMPTZ,
  sanctioned_order_number TEXT,
  sanctioned_order_copy_url TEXT,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'received')),
  payment_date DATE,
  payment_amount NUMERIC(12,2),
  utr_number TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Expenses
CREATE TABLE expenses (
  id SERIAL PRIMARY KEY,
  lab_id INTEGER REFERENCES labs(id) ON DELETE CASCADE NOT NULL,
  month TEXT NOT NULL,
  year INTEGER NOT NULL,
  salary NUMERIC(10,2) DEFAULT 0,
  electricity NUMERIC(10,2) DEFAULT 0,
  chemical NUMERIC(10,2) DEFAULT 0,
  stationery NUMERIC(10,2) DEFAULT 0,
  printing NUMERIC(10,2) DEFAULT 0,
  lifafa NUMERIC(10,2) DEFAULT 0,
  cleaning NUMERIC(10,2) DEFAULT 0,
  other NUMERIC(10,2) DEFAULT 0,
  tour NUMERIC(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(lab_id, month, year)
);

-- Dispatches
CREATE TABLE dispatches (
  id SERIAL PRIMARY KEY,
  dispatch_number TEXT UNIQUE NOT NULL,
  lab_id INTEGER REFERENCES labs(id) ON DELETE CASCADE NOT NULL,
  purpose TEXT NOT NULL,
  details TEXT,
  copy_url TEXT,
  dispatched_in_date DATE,
  dispatched_in_via TEXT,
  dispatched_out_date DATE,
  dispatched_out_via TEXT,
  head TEXT,
  remark TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Stock
CREATE TABLE stock (
  id SERIAL PRIMARY KEY,
  lab_id INTEGER REFERENCES labs(id) ON DELETE CASCADE NOT NULL,
  item_name TEXT NOT NULL,
  indent_demand INTEGER DEFAULT 0,
  supply INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'done')),
  remark TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Notifications
CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  recipient_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  related_bill_id INTEGER REFERENCES bills(id) ON DELETE SET NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE labs ENABLE ROW LEVEL SECURITY;
ALTER TABLE registers ENABLE ROW LEVEL SECURITY;
ALTER TABLE bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE dispatches ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Profiles: users can read all profiles, update only their own
CREATE POLICY profiles_read ON profiles FOR SELECT USING (true);
CREATE POLICY profiles_update ON profiles FOR UPDATE USING (auth.uid() = id);

-- Labs: all authenticated users can read, team_leader/admin can update
CREATE POLICY labs_read ON labs FOR SELECT USING (true);
CREATE POLICY labs_insert ON labs FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('team_leader', 'admin'))
);
CREATE POLICY labs_update ON labs FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('lab_staff', 'team_leader', 'admin'))
);

-- Registers: all can read, lab_staff can update their lab
CREATE POLICY registers_read ON registers FOR SELECT USING (true);
CREATE POLICY registers_write ON registers FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND (role IN ('team_leader', 'admin') OR (role = 'lab_staff' AND assigned_lab_id = registers.lab_id)))
);

-- Bills: all can read, lab_staff can insert, team_leader can approve, account can update payment
CREATE POLICY bills_read ON bills FOR SELECT USING (true);
CREATE POLICY bills_insert ON bills FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('lab_staff', 'team_leader', 'admin'))
);
CREATE POLICY bills_update ON bills FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('team_leader', 'account_section', 'admin'))
);

-- Expenses: all can read, lab_staff/team_leader can write
CREATE POLICY expenses_read ON expenses FOR SELECT USING (true);
CREATE POLICY expenses_write ON expenses FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('lab_staff', 'team_leader', 'admin'))
);

-- Dispatches: all can read, team_leader can write
CREATE POLICY dispatches_read ON dispatches FOR SELECT USING (true);
CREATE POLICY dispatches_write ON dispatches FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('team_leader', 'admin'))
);

-- Stock: all can read, lab_staff/team_leader can write
CREATE POLICY stock_read ON stock FOR SELECT USING (true);
CREATE POLICY stock_write ON stock FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('lab_staff', 'team_leader', 'admin'))
);

-- Notifications: users can only read their own
CREATE POLICY notifications_read ON notifications FOR SELECT USING (recipient_id = auth.uid());
CREATE POLICY notifications_update ON notifications FOR UPDATE USING (recipient_id = auth.uid());
CREATE POLICY notifications_insert ON notifications FOR INSERT WITH CHECK (true);
