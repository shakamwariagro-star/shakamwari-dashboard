import { createClient } from '@supabase/supabase-js';
import { env, exit } from 'node:process';

const URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE = env.SUPABASE_SERVICE_ROLE_KEY;

if (!URL || !SERVICE) {
  console.error('Need NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in env');
  exit(1);
}

const supabase = createClient(URL, SERVICE, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const EMAIL_DOMAIN = '@shakamwari.local';

const SEED = [
  { username: 'admin',    password: 'admin123', name: 'Admin',                    role: 'admin' },
  { username: 'expenses', password: 'exp123',   name: 'Expenses (panel only)',    role: 'account' },
  { username: 'manager1', password: 'mgr123',   name: 'Manager 1 (10 labs)',      role: 'manager' },
  { username: 'manager2', password: 'mgr123',   name: 'Manager 2 (10 labs)',      role: 'manager' },
  { username: 'manager3', password: 'mgr123',   name: 'Manager 3 (5 labs)',       role: 'manager' },
  { username: 'account',  password: 'acc123',   name: 'Account (bill status)',    role: 'account' },
  { username: 'hr',       password: 'hr123',    name: 'HR (staff / salary)',      role: 'hr' },
];

// Step 1: clear out any existing @shakamwari.local users so reruns are idempotent.
const { data: list, error: listErr } = await supabase.auth.admin.listUsers({ perPage: 1000 });
if (listErr) { console.error('listUsers:', listErr.message); exit(1); }

for (const u of list.users) {
  if (u.email && u.email.endsWith(EMAIL_DOMAIN)) {
    const { error } = await supabase.auth.admin.deleteUser(u.id);
    if (error) console.error('delete', u.email, error.message);
    else console.log('cleared', u.email);
  }
}

// Step 2: create the seven seed users.
let ok = 0, fail = 0;
for (const u of SEED) {
  const email = u.username + EMAIL_DOMAIN;
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password: u.password,
    email_confirm: true,
    user_metadata: { full_name: u.name, username: u.username },
  });

  if (error) { console.error('FAIL', email, '-', error.message); fail++; continue; }

  const { error: pErr } = await supabase.from('profiles').upsert({
    id: data.user.id,
    full_name: u.name,
    role: u.role,
  });

  if (pErr) { console.error('FAIL profile', email, '-', pErr.message); fail++; continue; }

  console.log('OK   ', u.username.padEnd(10), '/', u.password.padEnd(10), '→', u.role);
  ok++;
}

console.log(`\nDone. ${ok} ok, ${fail} failed.`);
exit(fail ? 1 : 0);
