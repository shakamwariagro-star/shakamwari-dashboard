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

const SAMPLES = [
  { email: 'admin@shakamwari.local',    password: 'Admin@12345',    name: 'Sample Admin',    role: 'admin' },
  { email: 'manager@shakamwari.local',  password: 'Manager@12345',  name: 'Sample Manager',  role: 'manager' },
  { email: 'account@shakamwari.local',  password: 'Account@12345',  name: 'Sample Account',  role: 'account' },
  { email: 'hr@shakamwari.local',       password: 'Hr@12345',       name: 'Sample HR',       role: 'hr' },
  { email: 'employee@shakamwari.local', password: 'Employee@12345', name: 'Sample Employee', role: 'employee' },
];

let ok = 0, fail = 0;
for (const u of SAMPLES) {
  const { data, error } = await supabase.auth.admin.createUser({
    email: u.email,
    password: u.password,
    email_confirm: true,
    user_metadata: { full_name: u.name },
  });

  if (error) {
    console.error('FAIL', u.email, '-', error.message);
    fail++;
    continue;
  }

  const { error: pErr } = await supabase.from('profiles').upsert({
    id: data.user.id,
    full_name: u.name,
    role: u.role,
  });

  if (pErr) {
    console.error('FAIL profile', u.email, '-', pErr.message);
    fail++;
    continue;
  }

  console.log('OK  ', u.email, '/', u.password, '→', u.role);
  ok++;
}

console.log(`\nDone. ${ok} ok, ${fail} failed.`);
exit(fail ? 1 : 0);
