-- Align profiles role vocabulary with the v68 dashboard.
-- v68 uses: admin, manager, account, hr, employee.
-- Old schema used: lab_staff, team_leader, account_section, admin.

BEGIN;

-- 1. Map any existing rows from old role names to v68 role names.
UPDATE profiles SET role = CASE role
  WHEN 'lab_staff'       THEN 'employee'
  WHEN 'team_leader'     THEN 'manager'
  WHEN 'account_section' THEN 'account'
  ELSE role
END
WHERE role IN ('lab_staff', 'team_leader', 'account_section');

-- 2. Replace the role check constraint.
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check
  CHECK (role IN ('admin', 'manager', 'account', 'hr', 'employee'));

-- 3. Drop policies that reference old role names so we can recreate with v68 vocab.
DROP POLICY IF EXISTS labs_insert      ON labs;
DROP POLICY IF EXISTS labs_update      ON labs;
DROP POLICY IF EXISTS registers_write  ON registers;
DROP POLICY IF EXISTS bills_insert     ON bills;
DROP POLICY IF EXISTS bills_update     ON bills;
DROP POLICY IF EXISTS expenses_write   ON expenses;
DROP POLICY IF EXISTS dispatches_write ON dispatches;
DROP POLICY IF EXISTS stock_write      ON stock;

-- 4. Recreate with v68 role names.
CREATE POLICY labs_insert ON labs FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('manager', 'admin'))
);

CREATE POLICY labs_update ON labs FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager', 'employee'))
);

CREATE POLICY registers_write ON registers FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND (
      role IN ('admin', 'manager')
      OR (role = 'employee' AND assigned_lab_id = registers.lab_id)
    )
  )
);

CREATE POLICY bills_insert ON bills FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager', 'employee'))
);

CREATE POLICY bills_update ON bills FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager', 'account'))
);

CREATE POLICY expenses_write ON expenses FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager', 'employee'))
);

CREATE POLICY dispatches_write ON dispatches FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))
);

CREATE POLICY stock_write ON stock FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager', 'employee'))
);

COMMIT;
