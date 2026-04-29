'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { MOCK_LABS, MOCK_BILLS, MOCK_EXPENSES, IS_PREVIEW } from '@/lib/mockData';
import ProgressBar from '@/components/common/ProgressBar';
import StatusBadge from '@/components/common/StatusBadge';
import { REGISTER_TYPES, MONTHS, EXPENSE_CATEGORIES } from '@/lib/constants';
import type { Lab, Register, Bill, Expense } from '@/lib/types';

type Tab = 'overview' | 'registers' | 'billing' | 'expenses';

export default function LabDetailPage() {
  const params = useParams();
  const labId = Number(params.labId);
  const { profile } = useAuth();
  const supabase = createClient();

  const [lab, setLab] = useState<Lab | null>(null);
  const [registers, setRegisters] = useState<Register[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editLab, setEditLab] = useState<Partial<Lab>>({});

  useEffect(() => {
    if (IS_PREVIEW) {
      const mockLab = MOCK_LABS.find(l => l.id === labId) || MOCK_LABS[0];
      setLab(mockLab);
      setEditLab(mockLab);
      setBills(MOCK_BILLS.filter(b => b.lab_id === labId));
      setExpenses(MOCK_EXPENSES.filter(e => e.lab_id === labId));
      setLoading(false);
      return;
    }
    async function fetchData() {
      const [labRes, regRes, billRes, expRes] = await Promise.all([
        supabase.from('labs').select('*').eq('id', labId).single(),
        supabase.from('registers').select('*').eq('lab_id', labId).order('month'),
        supabase.from('bills').select('*').eq('lab_id', labId).order('created_at', { ascending: false }),
        supabase.from('expenses').select('*').eq('lab_id', labId).order('month'),
      ]);
      if (labRes.data) { setLab(labRes.data); setEditLab(labRes.data); }
      if (regRes.data) setRegisters(regRes.data);
      if (billRes.data) setBills(billRes.data);
      if (expRes.data) setExpenses(expRes.data);
      setLoading(false);
    }
    fetchData();
  }, [labId]);

  const handleSaveLab = async () => {
    const { error } = await supabase.from('labs').update({
      target: editLab.target,
      sanctioned_target: editLab.sanctioned_target,
      hand_over_samples: editLab.hand_over_samples,
      sample_tested: editLab.sample_tested,
      shc_printed: editLab.shc_printed,
      shc_handover: editLab.shc_handover,
      sanctioned_payment: editLab.sanctioned_payment,
      billing_sample: editLab.billing_sample,
      billing_amount: editLab.billing_amount,
      payment_received: editLab.payment_received,
    }).eq('id', labId);
    if (!error) {
      setLab(prev => prev ? { ...prev, ...editLab } : null);
      setEditing(false);
    }
  };

  if (loading || !lab) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-g4" />
      </div>
    );
  }

  const formatNum = (n: number) => n.toLocaleString('en-IN');
  const tabs: { key: Tab; label: string }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'registers', label: 'Registers' },
    { key: 'billing', label: 'Billing' },
    { key: 'expenses', label: 'Expenses' },
  ];

  return (
    <div className="space-y-5">
      {/* Header Card */}
      <div className="theme-card">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-base font-extrabold" style={{ color: 'var(--color-g1)' }}>{lab.lab_code}</h2>
            <p className="text-[11px] mt-1" style={{ color: 'var(--color-tx-f)', fontFamily: "'Fira Mono', monospace" }}>
              {lab.district} / {lab.block} / {lab.company_name}
            </p>
            <p className="text-[11px]" style={{ color: 'var(--color-tx-f)' }}>Coordinator: {lab.coordinator}</p>
          </div>
          {(profile?.role === 'team_leader' || profile?.role === 'admin' || profile?.role === 'lab_staff') && (
            <button
              onClick={() => editing ? handleSaveLab() : setEditing(true)}
              className="px-3.5 py-1.5 rounded-[9px] text-xs font-bold transition-all"
              style={editing ? {
                background: 'linear-gradient(135deg, #3d6b30, #4e8a3e)',
                color: '#fff',
                boxShadow: '0 2px 8px rgba(61,107,48,0.35)',
              } : {
                background: 'transparent',
                color: 'var(--color-tx-d)',
                border: '1.5px solid var(--color-bd2)',
              }}
            >
              {editing ? 'Save Changes' : 'Edit Data'}
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ borderBottom: '1.5px solid var(--color-bd2)' }}>
        <nav className="flex gap-5">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="py-2.5 px-1 text-xs font-bold transition-colors"
              style={{
                borderBottom: activeTab === tab.key ? '2px solid #4e8a3e' : '2px solid transparent',
                color: activeTab === tab.key ? '#3d6b30' : 'var(--color-tx-f)',
              }}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <OverviewTab lab={lab} editLab={editLab} setEditLab={setEditLab} editing={editing} formatNum={formatNum} />
      )}
      {activeTab === 'registers' && (
        <RegistersTab registers={registers} labId={labId} supabase={supabase} setRegisters={setRegisters} />
      )}
      {activeTab === 'billing' && (
        <BillingTab bills={bills} lab={lab} profile={profile} supabase={supabase} setBills={setBills} />
      )}
      {activeTab === 'expenses' && (
        <ExpensesTab expenses={expenses} labId={labId} supabase={supabase} setExpenses={setExpenses} />
      )}
    </div>
  );
}

function OverviewTab({ lab, editLab, setEditLab, editing, formatNum }: {
  lab: Lab; editLab: Partial<Lab>; setEditLab: (v: Partial<Lab>) => void; editing: boolean; formatNum: (n: number) => string;
}) {
  const kpiCards = [
    { label: 'Target', value: lab.target, key: 'target' as const },
    { label: 'Sanctioned Target', value: lab.sanctioned_target, key: 'sanctioned_target' as const },
    { label: 'Sample Tested', value: lab.sample_tested, key: 'sample_tested' as const },
    { label: 'SHC Printed', value: lab.shc_printed, key: 'shc_printed' as const },
  ];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-2.5">
        {kpiCards.map(card => (
          <div key={card.key} className="mcard">
            <div className="mcard-label">{card.label}</div>
            {editing ? (
              <input
                type="number"
                value={editLab[card.key] ?? 0}
                onChange={e => setEditLab({ ...editLab, [card.key]: Number(e.target.value) })}
                className="mt-1 w-full text-lg font-bold mn rounded-lg px-2 py-1"
                style={{ border: '1.5px solid var(--color-bd2)', background: '#fff', color: 'var(--color-tx)', outline: 'none' }}
              />
            ) : (
              <div className="mcard-value">{formatNum(card.value)}</div>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
        <div className="theme-card space-y-3">
          <div className="theme-card-title">Sample Progress</div>
          <ProgressBar value={lab.sanctioned_target} max={lab.target} label="Sanctioned / Target" />
          <ProgressBar value={lab.hand_over_samples} max={lab.sanctioned_target || 1} label="Handover / Sanctioned" />
          <ProgressBar value={lab.sample_tested} max={lab.hand_over_samples || 1} label="Tested / Handover" />
          <ProgressBar value={lab.shc_printed} max={lab.sample_tested || 1} label="SHC Printed / Tested" />
        </div>

        <div className="theme-card space-y-1">
          <div className="theme-card-title">Payment Summary</div>
          {[
            { label: 'Sanctioned Payment', value: formatNum(lab.sanctioned_payment), color: 'var(--color-tx)' },
            { label: 'Billing Amount', value: formatNum(lab.billing_amount), color: 'var(--color-tx)' },
            { label: 'Payment Received', value: formatNum(lab.payment_received), color: 'var(--color-ok)' },
            { label: 'Remaining Payment', value: formatNum(lab.sanctioned_payment - lab.payment_received), color: 'var(--color-er)' },
            { label: 'Expenses Total', value: formatNum(lab.expenses_total), color: 'var(--color-earth)' },
          ].map((row, i, arr) => (
            <div
              key={row.label}
              className="flex justify-between py-2"
              style={{ borderBottom: i < arr.length - 1 ? '1px solid var(--color-bd)' : 'none' }}
            >
              <span className="text-[12.5px]" style={{ color: 'var(--color-tx-d)' }}>{row.label}</span>
              <span className="mn font-bold" style={{ color: row.color }}>{row.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RegistersTab({ registers, labId, supabase, setRegisters }: {
  registers: Register[]; labId: number; supabase: ReturnType<typeof createClient>; setRegisters: (v: Register[]) => void;
}) {
  const getStatus = (type: string, month: string) => {
    return registers.find(r => r.register_type === type && r.month.toLowerCase() === month.toLowerCase())?.status || 'pending';
  };

  const toggleStatus = async (type: string, month: string) => {
    const existing = registers.find(r => r.register_type === type && r.month.toLowerCase() === month.toLowerCase());
    const nextStatus = existing?.status === 'pending' ? 'done' : existing?.status === 'done' ? 'approved' : 'pending';
    if (existing) {
      await supabase.from('registers').update({ status: nextStatus }).eq('id', existing.id);
      setRegisters(registers.map(r => r.id === existing.id ? { ...r, status: nextStatus } : r));
    } else {
      const { data } = await supabase.from('registers').insert({ lab_id: labId, register_type: type, month: month.toLowerCase(), year: 2026, status: 'done' }).select().single();
      if (data) setRegisters([...registers, data]);
    }
  };

  return (
    <div className="theme-table-wrap">
      <table className="min-w-full" style={{ borderCollapse: 'collapse', fontSize: '12.5px' }}>
        <thead>
          <tr style={{ background: 'var(--color-g8)' }}>
            <th className="px-4 py-2.5 text-left" style={{ fontSize: '10px', fontWeight: 700, color: 'var(--color-tx-d)', textTransform: 'uppercase', letterSpacing: '0.04em', fontFamily: "'Fira Mono', monospace", borderBottom: '1.5px solid var(--color-bd2)' }}>Register</th>
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
                    <button onClick={() => toggleStatus(reg.key, month)} className="inline-block">
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
  );
}

function BillingTab({ bills, lab, profile, supabase, setBills }: {
  bills: Bill[]; lab: Lab; profile: any; supabase: ReturnType<typeof createClient>; setBills: (v: Bill[]) => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ bill_no: '', billing_samples: 0, billing_amount: 0, bill_date: new Date().toISOString().split('T')[0] });

  const inputStyle = { border: '1.5px solid var(--color-bd2)', borderRadius: '9px', padding: '9px 11px', fontSize: '13px', fontFamily: "'Nunito', sans-serif", fontWeight: 500, background: '#fff', color: 'var(--color-tx)', outline: 'none', width: '100%' } as const;
  const labelStyle = { fontSize: '10px', fontWeight: 700, color: 'var(--color-tx-d)', textTransform: 'uppercase' as const, letterSpacing: '0.06em', fontFamily: "'Fira Mono', monospace", marginBottom: '4px', display: 'block' };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data } = await supabase.from('bills').insert({ bill_no: form.bill_no, lab_id: lab.id, district: lab.district, company_name: lab.company_name, bill_date: form.bill_date, billing_samples: form.billing_samples, billing_amount: form.billing_amount, submitted_by: profile?.id }).select().single();
    if (data) { setBills([data, ...bills]); setShowForm(false); setForm({ bill_no: '', billing_samples: 0, billing_amount: 0, bill_date: new Date().toISOString().split('T')[0] }); }
  };

  const handleApprove = async (bill: Bill) => {
    const orderNum = prompt('Enter Sanctioned Order Number:');
    if (!orderNum) return;
    const { error } = await supabase.from('bills').update({ submission_status: 'approved', approved_by: profile?.id, approved_at: new Date().toISOString(), sanctioned_order_number: orderNum }).eq('id', bill.id);
    if (!error) setBills(bills.map(b => b.id === bill.id ? { ...b, submission_status: 'approved', sanctioned_order_number: orderNum } : b));
  };

  const handlePayment = async (bill: Bill) => {
    const utr = prompt('Enter UTR Number:');
    const amount = prompt('Enter Payment Amount:');
    if (!utr || !amount) return;
    const { error } = await supabase.from('bills').update({ payment_status: 'received', payment_date: new Date().toISOString().split('T')[0], payment_amount: Number(amount), utr_number: utr }).eq('id', bill.id);
    if (!error) setBills(bills.map(b => b.id === bill.id ? { ...b, payment_status: 'received', utr_number: utr, payment_amount: Number(amount) } : b));
  };

  return (
    <div className="space-y-3">
      {(profile?.role === 'lab_staff' || profile?.role === 'admin') && (
        <div className="flex justify-end">
          <button onClick={() => setShowForm(!showForm)} className="px-3.5 py-1.5 rounded-[9px] text-xs font-bold text-white" style={{ background: 'linear-gradient(135deg, #3d6b30, #4e8a3e)', boxShadow: '0 2px 8px rgba(61,107,48,0.35)' }}>
            {showForm ? 'Cancel' : '+ Submit New Bill'}
          </button>
        </div>
      )}

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
              {['Bill No.', 'Date', 'Samples', 'Amount', 'Approval', 'Payment', 'UTR', 'Actions'].map(h => (
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
                <td className="px-3 py-2.5 text-center"><StatusBadge status={bill.submission_status} /></td>
                <td className="px-3 py-2.5 text-center"><StatusBadge status={bill.payment_status} /></td>
                <td className="px-3 py-2.5 mn" style={{ color: 'var(--color-tx-d)' }}>{bill.utr_number || '-'}</td>
                <td className="px-3 py-2.5 text-center">
                  {profile?.role === 'team_leader' && bill.submission_status === 'pending' && (
                    <button onClick={() => handleApprove(bill)} className="text-xs font-bold hover:underline" style={{ color: 'var(--color-ok)' }}>Approve</button>
                  )}
                  {profile?.role === 'account_section' && bill.submission_status === 'approved' && bill.payment_status === 'pending' && (
                    <button onClick={() => handlePayment(bill)} className="text-xs font-bold hover:underline" style={{ color: 'var(--color-in)' }}>Record Payment</button>
                  )}
                </td>
              </tr>
            ))}
            {bills.length === 0 && (
              <tr><td colSpan={8} className="px-4 py-8 text-center text-sm" style={{ color: 'var(--color-tx-f)' }}>No bills submitted yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ExpensesTab({ expenses, labId, supabase, setExpenses }: {
  expenses: Expense[]; labId: number; supabase: ReturnType<typeof createClient>; setExpenses: (v: Expense[]) => void;
}) {
  const [editMonth, setEditMonth] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Expense>>({});

  const getExpense = (month: string) => expenses.find(e => e.month.toLowerCase() === month.toLowerCase());

  const handleEdit = (month: string) => {
    const existing = getExpense(month);
    setEditMonth(month);
    setEditData(existing || { salary: 0, electricity: 0, chemical: 0, stationery: 0, printing: 0, lifafa: 0, cleaning: 0, other: 0, tour: 0 });
  };

  const handleSave = async () => {
    if (!editMonth) return;
    const existing = getExpense(editMonth);
    if (existing) {
      await supabase.from('expenses').update(editData).eq('id', existing.id);
      setExpenses(expenses.map(e => e.id === existing.id ? { ...e, ...editData } : e));
    } else {
      const { data } = await supabase.from('expenses').insert({ lab_id: labId, month: editMonth.toLowerCase(), year: 2026, ...editData }).select().single();
      if (data) setExpenses([...expenses, data]);
    }
    setEditMonth(null);
  };

  const calcTotal = (exp: Partial<Expense>) => {
    return (exp.salary || 0) + (exp.electricity || 0) + (exp.chemical || 0) + (exp.stationery || 0) + (exp.printing || 0) + (exp.lifafa || 0) + (exp.cleaning || 0) + (exp.other || 0) + (exp.tour || 0);
  };

  return (
    <div className="theme-table-wrap">
      <table className="min-w-full" style={{ borderCollapse: 'collapse', fontSize: '12.5px' }}>
        <thead>
          <tr style={{ background: 'var(--color-g8)' }}>
            <th className="px-4 py-2.5 text-left" style={{ fontSize: '10px', fontWeight: 700, color: 'var(--color-tx-d)', textTransform: 'uppercase', letterSpacing: '0.04em', fontFamily: "'Fira Mono', monospace", borderBottom: '1.5px solid var(--color-bd2)' }}>Category</th>
            {MONTHS.map(m => (
              <th key={m} className="px-3 py-2.5 text-center" style={{ fontSize: '10px', fontWeight: 700, color: 'var(--color-tx-d)', textTransform: 'uppercase', letterSpacing: '0.04em', fontFamily: "'Fira Mono', monospace", borderBottom: '1.5px solid var(--color-bd2)' }}>
                <div>{m.slice(0, 3)}</div>
                <button onClick={() => handleEdit(m)} className="text-[9px] mt-0.5 hover:underline" style={{ color: 'var(--color-g4)' }}>
                  {editMonth === m ? 'Editing' : 'Edit'}
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {EXPENSE_CATEGORIES.map(cat => (
            <tr key={cat.key} style={{ borderBottom: '1px solid rgba(61,107,48,0.06)' }}>
              <td className="px-4 py-2.5 text-sm" style={{ color: 'var(--color-tx)' }}>{cat.label}</td>
              {MONTHS.map(month => {
                const exp = getExpense(month);
                const val = exp ? (exp as any)[cat.key] || 0 : 0;
                const isEditing = editMonth === month;
                return (
                  <td key={month} className="px-3 py-2.5 text-center">
                    {isEditing ? (
                      <input type="number" value={(editData as any)[cat.key] || 0} onChange={e => setEditData({ ...editData, [cat.key]: Number(e.target.value) })} className="w-16 rounded px-1 py-0.5 text-xs text-center mn" style={{ border: '1.5px solid var(--color-bd2)', background: '#fff', color: 'var(--color-tx)', outline: 'none' }} />
                    ) : (
                      <span className="mn" style={{ color: val > 0 ? 'var(--color-tx)' : 'var(--color-tx-f)' }}>{val > 0 ? val.toLocaleString('en-IN') : '-'}</span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
          <tr style={{ background: 'var(--color-g8)', fontWeight: 700 }}>
            <td className="px-4 py-2.5 text-sm" style={{ color: 'var(--color-tx)', fontFamily: "'Fira Mono', monospace", fontSize: '11px' }}>TOTAL</td>
            {MONTHS.map(month => {
              const exp = getExpense(month);
              const total = exp ? calcTotal(exp) : 0;
              const isEditing = editMonth === month;
              return (
                <td key={month} className="px-3 py-2.5 text-center mn font-bold" style={{ color: 'var(--color-tx)' }}>
                  {isEditing ? (
                    <div className="space-y-1">
                      <span>{calcTotal(editData).toLocaleString('en-IN')}</span>
                      <button onClick={handleSave} className="block mx-auto text-[9px] hover:underline" style={{ color: 'var(--color-g4)' }}>Save</button>
                    </div>
                  ) : (
                    total > 0 ? total.toLocaleString('en-IN') : '-'
                  )}
                </td>
              );
            })}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
