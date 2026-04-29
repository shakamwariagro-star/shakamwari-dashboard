'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { MOCK_LABS, MOCK_EXPENSES, IS_PREVIEW } from '@/lib/mockData';
import { EXPENSE_CATEGORIES, MONTHS } from '@/lib/constants';
import type { Lab, Expense } from '@/lib/types';

export default function ExpensesPage() {
  const [labs, setLabs] = useState<Lab[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [selectedLab, setSelectedLab] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (IS_PREVIEW) {
      setLabs(MOCK_LABS);
      setExpenses(MOCK_EXPENSES);
      setSelectedLab(MOCK_LABS[0].id);
      setLoading(false);
      return;
    }
    async function fetchData() {
      const supabase = createClient();
      const [labRes, expRes] = await Promise.all([
        supabase.from('labs').select('*').order('id'),
        supabase.from('expenses').select('*').order('lab_id'),
      ]);
      if (labRes.data) { setLabs(labRes.data); if (labRes.data.length > 0) setSelectedLab(labRes.data[0].id); }
      if (expRes.data) setExpenses(expRes.data);
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-g4" /></div>;
  }

  const allLabExpenses = selectedLab ? expenses.filter(e => e.lab_id === selectedLab) : [];
  const labExpenses = showAll ? allLabExpenses : allLabExpenses.filter(e => e.approval_status === 'approved');
  const getExpense = (month: string) => labExpenses.find(e => e.month.toLowerCase() === month.toLowerCase());
  const calcTotal = (exp: Expense) =>
    exp.salary + exp.electricity + exp.chemical + exp.stationery + exp.printing + exp.lifafa + exp.cleaning + exp.other + exp.tour;

  const grandTotal = labExpenses.reduce((sum, e) => sum + calcTotal(e), 0);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <div className="sec-label" style={{ marginBottom: 0 }}>📤 Expenses Overview</div>
          <button
            onClick={() => setShowAll(!showAll)}
            className="px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all"
            style={{
              background: showAll ? 'var(--color-in-bg)' : 'var(--color-ok-bg)',
              color: showAll ? 'var(--color-in)' : 'var(--color-ok)',
              border: `1px solid ${showAll ? 'rgba(30,90,150,0.2)' : 'rgba(45,110,31,0.2)'}`,
            }}
          >
            {showAll ? 'Showing All' : 'Approved Only'}
          </button>
        </div>
        <select
          value={selectedLab || ''}
          onChange={e => setSelectedLab(Number(e.target.value))}
          className="text-[12.5px] font-semibold px-2.5 py-1.5 rounded-lg outline-none cursor-pointer"
          style={{
            border: '1.5px solid var(--color-bd2)',
            background: '#fff',
            color: 'var(--color-tx)',
            fontFamily: "'Nunito', sans-serif",
          }}
        >
          {labs.map(lab => (
            <option key={lab.id} value={lab.id}>{lab.lab_code} - {lab.district}/{lab.block}</option>
          ))}
        </select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-2.5">
        <div className="mcard">
          <div className="mcard-label">Total Expenses</div>
          <div className="mcard-value" style={{ color: 'var(--color-er)' }}>₹{grandTotal.toLocaleString('en-IN')}</div>
        </div>
        <div className="mcard">
          <div className="mcard-label">Months with Data</div>
          <div className="mcard-value">{labExpenses.length}</div>
        </div>
        <div className="mcard">
          <div className="mcard-label">Avg Monthly</div>
          <div className="mcard-value" style={{ color: 'var(--color-earth)' }}>
            ₹{labExpenses.length > 0 ? Math.round(grandTotal / labExpenses.length).toLocaleString('en-IN') : '0'}
          </div>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="theme-table-wrap">
        <table className="min-w-full" style={{ borderCollapse: 'collapse', fontSize: '12.5px' }}>
          <thead>
            <tr style={{ background: 'var(--color-g8)' }}>
              <th className="px-4 py-2.5 text-left" style={{ fontSize: '10px', fontWeight: 700, color: 'var(--color-tx-d)', textTransform: 'uppercase', letterSpacing: '0.04em', fontFamily: "'Fira Mono', monospace", borderBottom: '1.5px solid var(--color-bd2)' }}>Category</th>
              {MONTHS.map(m => (
                <th key={m} className="px-3 py-2.5 text-center" style={{ fontSize: '10px', fontWeight: 700, color: 'var(--color-tx-d)', textTransform: 'uppercase', letterSpacing: '0.04em', fontFamily: "'Fira Mono', monospace", borderBottom: '1.5px solid var(--color-bd2)' }}>{m.slice(0, 3)}</th>
              ))}
              <th className="px-3 py-2.5 text-center" style={{ fontSize: '10px', fontWeight: 700, color: 'var(--color-tx-d)', textTransform: 'uppercase', letterSpacing: '0.04em', fontFamily: "'Fira Mono', monospace", borderBottom: '1.5px solid var(--color-bd2)' }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {EXPENSE_CATEGORIES.map(cat => {
              const catTotal = labExpenses.reduce((sum, e) => sum + ((e as any)[cat.key] || 0), 0);
              return (
                <tr
                  key={cat.key}
                  style={{ borderBottom: '1px solid rgba(61,107,48,0.06)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-g8)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                >
                  <td className="px-4 py-2.5 text-sm font-semibold" style={{ color: 'var(--color-tx)' }}>{cat.label}</td>
                  {MONTHS.map(month => {
                    const exp = getExpense(month);
                    const val = exp ? (exp as any)[cat.key] || 0 : 0;
                    return (
                      <td key={month} className="px-3 py-2.5 text-center mn">
                        <span style={{ color: val > 0 ? 'var(--color-tx)' : 'var(--color-tx-f)' }}>{val > 0 ? val.toLocaleString('en-IN') : '-'}</span>
                      </td>
                    );
                  })}
                  <td className="px-3 py-2.5 text-center mn font-bold" style={{ color: 'var(--color-tx)' }}>
                    {catTotal > 0 ? catTotal.toLocaleString('en-IN') : '-'}
                  </td>
                </tr>
              );
            })}
            <tr style={{ background: 'var(--color-g8)', fontWeight: 700 }}>
              <td className="px-4 py-2.5 text-sm" style={{ color: 'var(--color-tx)', fontFamily: "'Fira Mono', monospace", fontSize: '11px' }}>TOTAL</td>
              {MONTHS.map(month => {
                const exp = getExpense(month);
                const total = exp ? calcTotal(exp) : 0;
                return (
                  <td key={month} className="px-3 py-2.5 text-center mn font-bold" style={{ color: 'var(--color-tx)' }}>
                    {total > 0 ? total.toLocaleString('en-IN') : '-'}
                  </td>
                );
              })}
              <td className="px-3 py-2.5 text-center mn font-bold" style={{ color: 'var(--color-ok)' }}>
                {grandTotal.toLocaleString('en-IN')}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
