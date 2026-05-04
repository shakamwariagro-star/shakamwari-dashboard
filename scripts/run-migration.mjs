import { readFile } from 'node:fs/promises';
import { argv, env, exit } from 'node:process';

const PAT = env.SUPABASE_PAT;
const REF = env.SUPABASE_PROJECT_REF;
const file = argv[2];

if (!PAT || !REF || !file) {
  console.error('Usage: SUPABASE_PAT=xxx SUPABASE_PROJECT_REF=xxx node scripts/run-migration.mjs <sqlFile>');
  exit(1);
}

const sql = await readFile(file, 'utf8');

const res = await fetch(`https://api.supabase.com/v1/projects/${REF}/database/query`, {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${PAT}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({ query: sql }),
});

const text = await res.text();
console.log('HTTP', res.status);
console.log(text);
exit(res.ok ? 0 : 1);
