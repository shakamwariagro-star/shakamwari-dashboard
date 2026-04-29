'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { MOCK_LABS, MOCK_DISPATCHES, IS_PREVIEW } from '@/lib/mockData';
import RoleGuard from '@/components/layout/RoleGuard';
import { DISPATCH_PURPOSES } from '@/lib/constants';
import type { Lab, Dispatch } from '@/lib/types';

export default function DispatchPage() {
  return (
    <RoleGuard allowedRoles={['team_leader', 'admin']}>
      <DispatchContent />
    </RoleGuard>
  );
}

function DispatchContent() {
  const { profile } = useAuth();
  const supabase = createClient();
  const [labs, setLabs] = useState<Lab[]>([]);
  const [dispatches, setDispatches] = useState<Dispatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    lab_id: 0,
    purpose: 'bill_submission',
    details: '',
    dispatched_in_date: new Date().toISOString().split('T')[0],
    dispatched_in_via: '',
    head: '',
    remark: '',
  });

  useEffect(() => {
    if (IS_PREVIEW) {
      setLabs(MOCK_LABS);
      setDispatches(MOCK_DISPATCHES);
      if (MOCK_LABS.length > 0) setForm(f => ({ ...f, lab_id: MOCK_LABS[0].id }));
      setLoading(false);
      return;
    }
    async function fetch() {
      const [labRes, dispRes] = await Promise.all([
        supabase.from('labs').select('*').order('id'),
        supabase.from('dispatches').select('*, lab:labs(*)').order('created_at', { ascending: false }),
      ]);
      if (labRes.data) { setLabs(labRes.data); if (labRes.data.length > 0) setForm(f => ({ ...f, lab_id: labRes.data[0].id })); }
      if (dispRes.data) setDispatches(dispRes.data);
      setLoading(false);
    }
    fetch();
  }, []);

  const generateDispatchNumber = () => {
    const year = new Date().getFullYear();
    const nextNum = dispatches.length + 1;
    return `DISP-${year}-${String(nextNum).padStart(3, '0')}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const dispatchNumber = generateDispatchNumber();
    const { data } = await supabase.from('dispatches').insert({
      dispatch_number: dispatchNumber,
      lab_id: form.lab_id,
      purpose: form.purpose,
      details: form.details,
      dispatched_in_date: form.dispatched_in_date,
      dispatched_in_via: form.dispatched_in_via,
      head: form.head,
      remark: form.remark,
      created_by: profile?.id,
    }).select('*, lab:labs(*)').single();
    if (data) {
      setDispatches([data, ...dispatches]);
      setShowForm(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-g4" /></div>;
  }

  const inputStyle = {
    border: '1.5px solid var(--color-bd2)',
    borderRadius: '9px',
    padding: '9px 11px',
    fontSize: '13px',
    fontFamily: "'Nunito', sans-serif",
    fontWeight: 500,
    background: '#fff',
    color: 'var(--color-tx)',
    outline: 'none',
    width: '100%',
  } as const;

  const labelStyle = {
    fontSize: '10px',
    fontWeight: 700,
    color: 'var(--color-tx-d)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.06em',
    fontFamily: "'Fira Mono', monospace",
    marginBottom: '4px',
    display: 'block',
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="sec-label" style={{ marginBottom: 0 }}>📨 Dispatch Management</div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-3.5 py-2 rounded-[9px] text-xs font-bold text-white"
          style={{ background: 'linear-gradient(135deg, #3d6b30, #4e8a3e)', boxShadow: '0 2px 8px rgba(61,107,48,0.35)' }}
        >
          {showForm ? 'Cancel' : '+ Generate Dispatch'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="theme-card space-y-3">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="theme-card-title" style={{ marginBottom: 0 }}>New Dispatch</div>
            <span className="pill pill-ok mn">{generateDispatchNumber()}</span>
          </div>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-2.5">
            <div>
              <label style={labelStyle}>Lab</label>
              <select value={form.lab_id} onChange={e => setForm({ ...form, lab_id: Number(e.target.value) })} style={inputStyle}>
                {labs.map(l => <option key={l.id} value={l.id}>{l.lab_code} - {l.district}/{l.block}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Purpose</label>
              <select value={form.purpose} onChange={e => setForm({ ...form, purpose: e.target.value })} style={inputStyle}>
                {DISPATCH_PURPOSES.map(p => <option key={p.key} value={p.key}>{p.label}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Date</label>
              <input type="date" value={form.dispatched_in_date} onChange={e => setForm({ ...form, dispatched_in_date: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Via</label>
              <input type="text" value={form.dispatched_in_via} onChange={e => setForm({ ...form, dispatched_in_via: e.target.value })} style={inputStyle} placeholder="e.g. Courier, Hand delivery" />
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={labelStyle}>Details</label>
              <textarea value={form.details} onChange={e => setForm({ ...form, details: e.target.value })} style={{ ...inputStyle, resize: 'vertical', minHeight: '64px' }} />
            </div>
            <div>
              <label style={labelStyle}>Head</label>
              <input type="text" value={form.head} onChange={e => setForm({ ...form, head: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Remark</label>
              <input type="text" value={form.remark} onChange={e => setForm({ ...form, remark: e.target.value })} style={inputStyle} />
            </div>
          </div>
          <div className="flex justify-end pt-2" style={{ borderTop: '1px solid var(--color-bd)' }}>
            <button
              type="submit"
              className="px-4 py-2 rounded-[9px] text-[13px] font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #3d6b30, #4e8a3e)', boxShadow: '0 2px 8px rgba(61,107,48,0.35)' }}
            >
              Create Dispatch
            </button>
          </div>
        </form>
      )}

      <div className="theme-table-wrap">
        <table className="min-w-full" style={{ borderCollapse: 'collapse', fontSize: '12.5px' }}>
          <thead>
            <tr style={{ background: 'var(--color-g8)' }}>
              {['Dispatch No.', 'Lab', 'Purpose', 'Details', 'Date', 'Via'].map(h => (
                <th key={h} className="px-3 py-2.5 text-left whitespace-nowrap" style={{ fontSize: '10px', fontWeight: 700, color: 'var(--color-tx-d)', textTransform: 'uppercase', letterSpacing: '0.04em', fontFamily: "'Fira Mono', monospace", borderBottom: '1.5px solid var(--color-bd2)' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dispatches.map(d => (
              <tr
                key={d.id}
                style={{ borderBottom: '1px solid rgba(61,107,48,0.06)' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-g8)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
              >
                <td className="px-3 py-2.5 mn font-bold" style={{ color: 'var(--color-ok)' }}>{d.dispatch_number}</td>
                <td className="px-3 py-2.5 text-sm" style={{ color: 'var(--color-tx)' }}>{d.lab?.lab_code || '-'}</td>
                <td className="px-3 py-2.5 text-sm capitalize" style={{ color: 'var(--color-tx)' }}>{d.purpose.replace('_', ' ')}</td>
                <td className="px-3 py-2.5 text-sm" style={{ color: 'var(--color-tx-d)' }}>{d.details || '-'}</td>
                <td className="px-3 py-2.5 mn" style={{ color: 'var(--color-tx-d)' }}>{d.dispatched_in_date || '-'}</td>
                <td className="px-3 py-2.5 text-sm" style={{ color: 'var(--color-tx-d)' }}>{d.dispatched_in_via || '-'}</td>
              </tr>
            ))}
            {dispatches.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm" style={{ color: 'var(--color-tx-f)' }}>No dispatches yet</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
