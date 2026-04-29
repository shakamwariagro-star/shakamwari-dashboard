'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { MOCK_LABS, MOCK_BILLS, MOCK_EXPENSES, IS_PREVIEW } from '@/lib/mockData';
import { createClient } from '@/lib/supabase/client';
import { REGISTER_TYPES, MONTHS, EXPENSE_CATEGORIES } from '@/lib/constants';
import ProgressBar from '@/components/common/ProgressBar';
import StatusBadge from '@/components/common/StatusBadge';
import type { Lab, Register, Bill, Expense } from '@/lib/types';

const COORD_EXPENSE_CATEGORIES = EXPENSE_CATEGORIES.filter(c => c.key !== 'lifafa');

type Tab = 'overview' | 'registers' | 'billing' | 'expenses';

// Fields filled by lab staff (read-only for coordinator, approve)
const EXPERT_FIELDS = [
  { key: 'target', label: 'Target' },
  { key: 'sanctioned_target', label: 'Sanctioned Target' },
  { key: 'hand_over_samples', label: 'Handover Samples' },
  { key: 'sample_tested', label: 'Sample Tested' },
  { key: 'shc_printed', label: 'SHC Printed' },
  { key: 'shc_handover', label: 'SHC Handover' },
] as const;

// Fields filled by coordinator
const COORDINATOR_FIELDS = [
  { key: 'sanctioned_payment', label: 'Sanctioned Payment' },
  { key: 'billing_sample', label: 'Billing Sample' },
  { key: 'billing_amount', label: 'Billing Amount' },
  { key: 'payment_received', label: 'Payment Received' },
  { key: 'expenses_total', label: 'Expenses Total' },
] as const;

export default function CoordinatorLabPage() {
  const params = useParams();
  const labId = Number(params.labId);
  const supabase = createClient();

  const [lab, setLab] = useState<Lab | null>(null);
  const [registers, setRegisters] = useState<Register[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [editing, setEditing] = useState(false);
  const [editValues, setEditValues] = useState<Record<string, number>>({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'ok' | 'er'; text: string } | null>(null);

  useEffect(() => {
    if (IS_PREVIEW) {
      const mockLab = MOCK_LABS.find(l => l.id === labId);
      if (mockLab) {
        setLab(mockLab);
        setEditValues({
          sanctioned_payment: mockLab.sanctioned_payment,
          billing_sample: mockLab.billing_sample,
          billing_amount: mockLab.billing_amount,
          payment_received: mockLab.payment_received,
          expenses_total: mockLab.expenses_total,
        });
      }
      setBills(MOCK_BILLS.filter(b => b.lab_id === labId));
      setExpenses(MOCK_EXPENSES.filter(e => e.lab_id === labId));
      return;
    }
    async function fetchData() {
      const [labRes, regRes, billRes, expRes] = await Promise.all([
        supabase.from('labs').select('*').eq('id', labId).single(),
        supabase.from('registers').select('*').eq('lab_id', labId).order('month'),
        supabase.from('bills').select('*').eq('lab_id', labId).order('created_at', { ascending: false }),
        supabase.from('expenses').select('*').eq('lab_id', labId).order('month'),
      ]);
      if (labRes.data) {
        setLab(labRes.data);
        setEditValues({
          sanctioned_payment: labRes.data.sanctioned_payment,
          billing_sample: labRes.data.billing_sample,
          billing_amount: labRes.data.billing_amount,
          payment_received: labRes.data.payment_received,
          expenses_total: labRes.data.expenses_total,
        });
      }
      if (regRes.data) setRegisters(regRes.data);
      if (billRes.data) setBills(billRes.data);
      if (expRes.data) setExpenses(expRes.data);
    }
    fetchData();
  }, [labId]);

  const handleSave = async () => {
    if (!lab) return;
    setSaving(true);
    if (IS_PREVIEW) {
      setLab({ ...lab, ...editValues });
      setEditing(false);
      setMessage({ type: 'ok', text: 'Data saved (preview)' });
      setSaving(false);
      setTimeout(() => setMessage(null), 3000);
      return;
    }
    const { error } = await supabase.from('labs').update(editValues).eq('id', lab.id);
    if (!error) {
      setLab({ ...lab, ...editValues });
      setEditing(false);
      setMessage({ type: 'ok', text: 'Data saved' });
    } else {
      setMessage({ type: 'er', text: error.message });
    }
    setSaving(false);
    setTimeout(() => setMessage(null), 3000);
  };

  if (!lab) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-g4" /></div>;
  }

  const formatNum = (n: number) => n.toLocaleString('en-IN');
  const remainingTarget = lab.target - lab.sanctioned_target;
  const remainingPayment = lab.sanctioned_payment - lab.payment_received;
  const remainingTesting = lab.hand_over_samples - lab.sample_tested;
  const remainingSHC = lab.sample_tested - lab.shc_printed;

  const tabs: { key: Tab; label: string }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'registers', label: 'Registers' },
    { key: 'billing', label: 'Billing' },
    { key: 'expenses', label: 'Expenses' },
  ];

  return (
    <div className="space-y-5">
      {message && (
        <div className="px-4 py-2.5 rounded-xl text-xs font-bold" style={{ background: message.type === 'ok' ? 'var(--color-ok-bg)' : 'var(--color-er-bg)', color: message.type === 'ok' ? 'var(--color-ok)' : 'var(--color-er)' }}>
          {message.text}
        </div>
      )}

      {/* Lab Header */}
      <div className="theme-card">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-base font-extrabold" style={{ color: 'var(--color-g1)' }}>{lab.lab_code}</h2>
              <span className="pill pill-ok text-[10px]">{lab.company_name}</span>
            </div>
            <p className="text-[11px] mt-1" style={{ color: 'var(--color-tx-f)', fontFamily: "'Fira Mono', monospace" }}>
              {lab.district} / {lab.block} | Coordinator: {lab.coordinator}
            </p>
          </div>
          {!editing ? (
            <button onClick={() => setEditing(true)} className="px-3.5 py-1.5 rounded-[9px] text-xs font-bold" style={{ border: '1.5px solid var(--color-bd2)', color: 'var(--color-tx-d)' }}>
              Edit My Fields
            </button>
          ) : (
            <div className="flex gap-2">
              <button onClick={() => { setEditing(false); if (lab) setEditValues({ sanctioned_payment: lab.sanctioned_payment, billing_sample: lab.billing_sample, billing_amount: lab.billing_amount, payment_received: lab.payment_received, expenses_total: lab.expenses_total }); }} className="px-3 py-1.5 rounded-[9px] text-xs font-bold" style={{ border: '1.5px solid var(--color-bd2)', color: 'var(--color-tx-d)' }}>Cancel</button>
              <button onClick={handleSave} disabled={saving} className="px-3.5 py-1.5 rounded-[9px] text-xs font-bold text-white" style={{ background: 'linear-gradient(135deg, #3d6b30, #4e8a3e)', opacity: saving ? 0.6 : 1 }}>
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ borderBottom: '1.5px solid var(--color-bd2)' }}>
        <nav className="flex gap-5">
          {tabs.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} className="py-2.5 px-1 text-xs font-bold transition-colors" style={{ borderBottom: activeTab === tab.key ? '2px solid #4e8a3e' : '2px solid transparent', color: activeTab === tab.key ? '#3d6b30' : 'var(--color-tx-f)' }}>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-5">
          {/* Expert-filled data (read-only) */}
          <div className="sec-label">Lab Staff Data (Read Only)</div>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-2.5">
            {EXPERT_FIELDS.map(f => (
              <div key={f.key} className="mcard">
                <div className="mcard-label">{f.label}</div>
                <div className="mcard-value" style={{ color: 'var(--color-tx)' }}>{formatNum((lab as any)[f.key])}</div>
              </div>
            ))}
            <div className="mcard">
              <div className="mcard-label">Remaining Target</div>
              <div className="mcard-value" style={{ color: 'var(--color-earth)' }}>{formatNum(remainingTarget)}</div>
            </div>
            <div className="mcard">
              <div className="mcard-label">Remaining for Testing</div>
              <div className="mcard-value" style={{ color: 'var(--color-er)' }}>{formatNum(remainingTesting)}</div>
            </div>
            <div className="mcard">
              <div className="mcard-label">Remaining SHC</div>
              <div className="mcard-value" style={{ color: 'var(--color-wn)' }}>{formatNum(remainingSHC)}</div>
            </div>
          </div>

          {/* Coordinator-filled data (editable) */}
          <div className="sec-label">Coordinator Data (Editable)</div>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-2.5">
            {COORDINATOR_FIELDS.map(f => (
              <div key={f.key} className="mcard">
                <div className="mcard-label">{f.label}</div>
                {editing ? (
                  <input
                    type="number"
                    value={editValues[f.key] || 0}
                    onChange={(e) => setEditValues({ ...editValues, [f.key]: Number(e.target.value) })}
                    className="w-full mt-1.5 text-lg font-bold mn rounded-lg px-2.5 py-1.5"
                    style={{ border: '1.5px solid var(--color-bd2)', background: '#fff', color: 'var(--color-tx)', outline: 'none' }}
                    min={0}
                  />
                ) : (
                  <div className="mcard-value" style={{
                    color: f.key === 'payment_received' ? 'var(--color-ok)' : f.key === 'expenses_total' ? 'var(--color-earth)' : 'var(--color-tx)'
                  }}>
                    {formatNum((lab as any)[f.key])}
                  </div>
                )}
              </div>
            ))}
            <div className="mcard">
              <div className="mcard-label">Remaining Payment</div>
              <div className="mcard-value" style={{ color: 'var(--color-er)' }}>{formatNum(remainingPayment)}</div>
            </div>
          </div>

          {/* Progress */}
          <div className="theme-card space-y-3">
            <div className="theme-card-title">Sample Progress</div>
            <ProgressBar value={lab.sanctioned_target} max={lab.target || 1} label="Sanctioned / Target" />
            <ProgressBar value={lab.hand_over_samples} max={lab.sanctioned_target || 1} label="Handover / Sanctioned" />
            <ProgressBar value={lab.sample_tested} max={lab.hand_over_samples || 1} label="Tested / Handover" />
            <ProgressBar value={lab.shc_printed} max={lab.sample_tested || 1} label="SHC Printed / Tested" />
          </div>
        </div>
      )}

      {activeTab === 'registers' && (
        <RegistersTab registers={registers} labId={labId} supabase={supabase} setRegisters={setRegisters} />
      )}

      {activeTab === 'billing' && (
        <BillingTab bills={bills} lab={lab} supabase={supabase} setBills={setBills} />
      )}

      {activeTab === 'expenses' && (
        <ExpensesTab expenses={expenses} labId={labId} />
      )}
    </div>
  );
}

function RegistersTab({ registers, labId, supabase, setRegisters }: {
  registers: Register[]; labId: number; supabase: any; setRegisters: (v: Register[]) => void;
}) {
  const getStatus = (type: string, month: string) =>
    registers.find(r => r.register_type === type && r.month.toLowerCase() === month.toLowerCase())?.status || 'pending';

  const approveRegister = async (type: string, month: string) => {
    const existing = registers.find(r => r.register_type === type && r.month.toLowerCase() === month.toLowerCase());
    if (existing && existing.status === 'done') {
      if (!IS_PREVIEW) await supabase.from('registers').update({ status: 'approved' }).eq('id', existing.id);
      setRegisters(registers.map(r => r.id === existing.id ? { ...r, status: 'approved' } : r));
    }
  };

  return (
    <div className="space-y-3">
      <p className="text-[11px]" style={{ color: 'var(--color-tx-f)' }}>
        Click on "Done" badges to approve them
      </p>
      <div className="theme-table-wrap">
        <table className="min-w-full" style={{ borderCollapse: 'collapse', fontSize: '12.5px' }}>
          <thead>
            <tr style={{ background: 'var(--color-g8)' }}>
              <th className="px-4 py-2.5 text-left" style={{ fontSize: '10px', fontWeight: 700, color: 'var(--color-tx-d)', textTransform: 'uppercase', letterSpacing: '0.04em', fontFamily: "'Fira Mono', monospace", borderBottom: '1.5px solid var(--color-bd2)', minWidth: '180px' }}>Register</th>
              {MONTHS.map(m => (
                <th key={m} className="px-2 py-2.5 text-center" style={{ fontSize: '10px', fontWeight: 700, color: 'var(--color-tx-d)', textTransform: 'uppercase', letterSpacing: '0.04em', fontFamily: "'Fira Mono', monospace", borderBottom: '1.5px solid var(--color-bd2)' }}>{m.slice(0, 3)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {REGISTER_TYPES.map(reg => (
              <tr key={reg.key} style={{ borderBottom: '1px solid rgba(61,107,48,0.06)' }}>
                <td className="px-4 py-2.5 text-sm whitespace-nowrap" style={{ color: 'var(--color-tx)' }}>{reg.label}</td>
                {MONTHS.map(month => {
                  const status = getStatus(reg.key, month);
                  return (
                    <td key={month} className="px-2 py-2.5 text-center">
                      <button onClick={() => status === 'done' ? approveRegister(reg.key, month) : undefined} className="inline-block" style={{ cursor: status === 'done' ? 'pointer' : 'default' }}>
                        <StatusBadge status={status} />
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function BillingTab({ bills, lab, supabase, setBills }: {
  bills: Bill[]; lab: Lab; supabase: any; setBills: (v: Bill[]) => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ bill_no: '', billing_samples: 0, billing_amount: 0, bill_date: new Date().toISOString().split('T')[0] });

  const inputStyle = { border: '1.5px solid var(--color-bd2)', borderRadius: '9px', padding: '9px 11px', fontSize: '13px', fontFamily: "'Nunito', sans-serif", fontWeight: 500, background: '#fff', color: 'var(--color-tx)', outline: 'none', width: '100%' } as const;
  const labelStyle = { fontSize: '10px', fontWeight: 700, color: 'var(--color-tx-d)', textTransform: 'uppercase' as const, letterSpacing: '0.06em', fontFamily: "'Fira Mono', monospace", marginBottom: '4px', display: 'block' };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (IS_PREVIEW) {
      const newBill: Bill = {
        id: Date.now(), bill_no: form.bill_no, lab_id: lab.id, district: lab.district, company_name: lab.company_name,
        bill_date: form.bill_date, billing_samples: form.billing_samples, billing_amount: form.billing_amount,
        bill_copy_url: null, submitted_by: null, submission_status: 'pending', approved_by: null, approved_at: null,
        sanctioned_order_number: null, sanctioned_order_copy_url: null, payment_status: 'pending', payment_date: null,
        payment_amount: null, utr_number: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
      };
      setBills([newBill, ...bills]);
      setShowForm(false);
      return;
    }
    const { data } = await supabase.from('bills').insert({ bill_no: form.bill_no, lab_id: lab.id, district: lab.district, company_name: lab.company_name, bill_date: form.bill_date, billing_samples: form.billing_samples, billing_amount: form.billing_amount }).select().single();
    if (data) { setBills([data, ...bills]); setShowForm(false); }
  };

  const handleApprove = async (bill: Bill) => {
    const orderNum = prompt('Enter Sanctioned Order Number:');
    if (!orderNum) return;
    if (IS_PREVIEW) {
      setBills(bills.map(b => b.id === bill.id ? { ...b, submission_status: 'approved', sanctioned_order_number: orderNum } : b));
      return;
    }
    const { error } = await supabase.from('bills').update({ submission_status: 'approved', sanctioned_order_number: orderNum }).eq('id', bill.id);
    if (!error) setBills(bills.map(b => b.id === bill.id ? { ...b, submission_status: 'approved', sanctioned_order_number: orderNum } : b));
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <button onClick={() => setShowForm(!showForm)} className="px-3.5 py-1.5 rounded-[9px] text-xs font-bold text-white" style={{ background: 'linear-gradient(135deg, #3d6b30, #4e8a3e)' }}>
          {showForm ? 'Cancel' : '+ Submit Bill'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="theme-card space-y-3">
          <div className="theme-card-title">Submit New Bill</div>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-2.5">
            <div><label style={labelStyle}>Bill No.</label><input type="text" value={form.bill_no} onChange={e => setForm({ ...form, bill_no: e.target.value })} style={inputStyle} required /></div>
            <div><label style={labelStyle}>Bill Date</label><input type="date" value={form.bill_date} onChange={e => setForm({ ...form, bill_date: e.target.value })} style={inputStyle} required /></div>
            <div><label style={labelStyle}>Billing Samples</label><input type="number" value={form.billing_samples} onChange={e => setForm({ ...form, billing_samples: Number(e.target.value) })} style={inputStyle} required /></div>
            <div><label style={labelStyle}>Billing Amount</label><input type="number" value={form.billing_amount} onChange={e => setForm({ ...form, billing_amount: Number(e.target.value) })} style={inputStyle} required /></div>
          </div>
          <div className="flex justify-end pt-2" style={{ borderTop: '1px solid var(--color-bd)' }}>
            <button type="submit" className="px-4 py-2 rounded-[9px] text-[13px] font-bold text-white" style={{ background: 'linear-gradient(135deg, #3d6b30, #4e8a3e)' }}>Submit Bill</button>
          </div>
        </form>
      )}

      <div className="theme-table-wrap">
        <table className="min-w-full" style={{ borderCollapse: 'collapse', fontSize: '12.5px' }}>
          <thead>
            <tr style={{ background: 'var(--color-g8)' }}>
              {['Bill No.', 'Date', 'Samples', 'Amount', 'Status', 'Order No.', 'Payment', 'UTR', 'Actions'].map(h => (
                <th key={h} className="px-3 py-2.5 text-left whitespace-nowrap" style={{ fontSize: '10px', fontWeight: 700, color: 'var(--color-tx-d)', textTransform: 'uppercase', letterSpacing: '0.04em', fontFamily: "'Fira Mono', monospace", borderBottom: '1.5px solid var(--color-bd2)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bills.map(bill => (
              <tr key={bill.id} style={{ borderBottom: '1px solid rgba(61,107,48,0.06)' }}>
                <td className="px-3 py-2.5 text-sm font-bold" style={{ color: 'var(--color-g1)' }}>{bill.bill_no}</td>
                <td className="px-3 py-2.5 mn" style={{ color: 'var(--color-tx-d)' }}>{bill.bill_date}</td>
                <td className="px-3 py-2.5 text-right mn">{bill.billing_samples.toLocaleString('en-IN')}</td>
                <td className="px-3 py-2.5 text-right mn font-bold">{bill.billing_amount.toLocaleString('en-IN')}</td>
                <td className="px-3 py-2.5"><StatusBadge status={bill.submission_status} /></td>
                <td className="px-3 py-2.5 mn" style={{ color: 'var(--color-tx-d)' }}>{bill.sanctioned_order_number || '-'}</td>
                <td className="px-3 py-2.5"><StatusBadge status={bill.payment_status} /></td>
                <td className="px-3 py-2.5 mn" style={{ color: 'var(--color-tx-d)' }}>{bill.utr_number || '-'}</td>
                <td className="px-3 py-2.5">
                  {bill.submission_status === 'pending' && (
                    <button onClick={() => handleApprove(bill)} className="text-xs font-bold hover:underline" style={{ color: 'var(--color-ok)' }}>Approve</button>
                  )}
                </td>
              </tr>
            ))}
            {bills.length === 0 && (
              <tr><td colSpan={9} className="px-4 py-8 text-center text-sm" style={{ color: 'var(--color-tx-f)' }}>No bills yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ExpensesTab({ expenses, labId }: { expenses: Expense[]; labId: number }) {
  const getExpense = (month: string) => expenses.find(e => e.month.toLowerCase() === month.toLowerCase());

  return (
    <div className="theme-table-wrap">
      <table className="min-w-full" style={{ borderCollapse: 'collapse', fontSize: '12.5px' }}>
        <thead>
          <tr style={{ background: 'var(--color-g8)' }}>
            <th className="px-3 py-2.5 text-left" style={{ fontSize: '10px', fontWeight: 700, color: 'var(--color-tx-d)', textTransform: 'uppercase', letterSpacing: '0.04em', fontFamily: "'Fira Mono', monospace", borderBottom: '1.5px solid var(--color-bd2)' }}>Category</th>
            {MONTHS.map(m => (
              <th key={m} className="px-2 py-2.5 text-center" style={{ fontSize: '10px', fontWeight: 700, color: 'var(--color-tx-d)', textTransform: 'uppercase', letterSpacing: '0.04em', fontFamily: "'Fira Mono', monospace", borderBottom: '1.5px solid var(--color-bd2)' }}>{m.slice(0, 3)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {COORD_EXPENSE_CATEGORIES.map(cat => (
            <tr key={cat.key} style={{ borderBottom: '1px solid rgba(61,107,48,0.06)' }}>
              <td className="px-3 py-2 text-sm whitespace-nowrap" style={{ color: 'var(--color-tx)' }}>{cat.label}</td>
              {MONTHS.map(month => {
                const exp = getExpense(month);
                const val = exp ? (exp as any)[cat.key] || 0 : 0;
                return (
                  <td key={month} className="px-2 py-2 text-center mn" style={{ color: val > 0 ? 'var(--color-tx)' : 'var(--color-tx-f)' }}>
                    {val > 0 ? val.toLocaleString('en-IN') : '-'}
                  </td>
                );
              })}
            </tr>
          ))}
          <tr style={{ background: 'var(--color-g8)', fontWeight: 700 }}>
            <td className="px-3 py-2.5 text-sm" style={{ color: 'var(--color-tx)', fontFamily: "'Fira Mono', monospace", fontSize: '11px' }}>TOTAL</td>
            {MONTHS.map(month => {
              const exp = getExpense(month);
              const total = exp ? COORD_EXPENSE_CATEGORIES.reduce((s, c) => s + ((exp as any)[c.key] || 0), 0) : 0;
              return (
                <td key={month} className="px-2 py-2.5 text-center mn font-bold" style={{ color: 'var(--color-tx)' }}>
                  {total > 0 ? total.toLocaleString('en-IN') : '-'}
                </td>
              );
            })}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
