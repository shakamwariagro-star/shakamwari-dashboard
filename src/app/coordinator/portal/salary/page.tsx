'use client';

import { useEffect, useState } from 'react';
import { getCoordinatorById, getLabsForCoordinator } from '@/lib/coordinatorData';
import { MOCK_EXPENSES, IS_PREVIEW } from '@/lib/mockData';
import { createClient } from '@/lib/supabase/client';
import { MONTHS } from '@/lib/constants';
import type { Lab, Expense } from '@/lib/types';

export default function CoordinatorSalaryPage() {
  const [labs, setLabs] = useState<Lab[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>(getCurrentMonth());
  const [editingLab, setEditingLab] = useState<number | null>(null);
  const [editValue, setEditValue] = useState<number>(0);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'ok' | 'er'; text: string } | null>(null);

  function getCurrentMonth(): string {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ];
    return monthNames[new Date().getMonth()];
  }

  useEffect(() => {
    const storedId = localStorage.getItem('shakamwari_coordinator_id');
    if (!storedId) return;
    const coordinator = getCoordinatorById(storedId);
    if (!coordinator) return;

    const coordLabs = getLabsForCoordinator(coordinator.full_name);
    setLabs(coordLabs);

    if (IS_PREVIEW) {
      const labIds = coordLabs.map((l) => l.id);
      setExpenses(MOCK_EXPENSES.filter((e) => labIds.includes(e.lab_id)));
      return;
    }

    const supabase = createClient();
    const labIds = coordLabs.map((l) => l.id);
    supabase
      .from('expenses')
      .select('*')
      .in('lab_id', labIds)
      .then(({ data }) => { if (data) setExpenses(data); });
  }, []);

  const getExpenseForLab = (labId: number, month: string) =>
    expenses.find((e) => e.lab_id === labId && e.month.toLowerCase() === month.toLowerCase());

  const getSalary = (labId: number, month: string): number => {
    const exp = getExpenseForLab(labId, month);
    return exp ? (exp as any).salary || 0 : 0;
  };

  const handleEdit = (labId: number) => {
    setEditingLab(labId);
    setEditValue(getSalary(labId, selectedMonth));
  };

  const handleSave = async (labId: number) => {
    setSaving(true);
    setMessage(null);

    const existing = getExpenseForLab(labId, selectedMonth);

    if (IS_PREVIEW) {
      if (existing) {
        setExpenses(expenses.map((e) =>
          e.id === existing.id ? { ...e, salary: editValue } : e
        ));
      } else {
        const newExp = {
          id: Date.now(),
          lab_id: labId,
          month: selectedMonth.toLowerCase(),
          year: 2026,
          salary: editValue,
          electricity: 0, chemical: 0, stationery: 0, printing: 0,
          lifafa: 0, cleaning: 0, other: 0, tour: 0,
          approval_status: 'draft' as const,
          approved_by: null, approved_at: null, rejection_reason: null, submitted_by: null,
          created_at: new Date().toISOString(),
        } as Expense;
        setExpenses([...expenses, newExp]);
      }

      const lab = labs.find((l) => l.id === labId);
      setMessage({ type: 'ok', text: `Salary for ${lab?.block || 'lab'} — ${selectedMonth} saved (preview)` });
      setEditingLab(null);
      setSaving(false);
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    const supabase = createClient();
    if (existing) {
      const { error } = await supabase.from('expenses').update({ salary: editValue }).eq('id', existing.id);
      if (!error) {
        setExpenses(expenses.map((e) => (e.id === existing.id ? { ...e, salary: editValue } : e)));
      } else {
        setMessage({ type: 'er', text: error.message });
      }
    } else {
      const { data, error } = await supabase.from('expenses').insert({
        lab_id: labId,
        month: selectedMonth.toLowerCase(),
        year: 2026,
        salary: editValue,
      }).select().single();
      if (data) setExpenses([...expenses, data]);
      else if (error) setMessage({ type: 'er', text: error.message });
    }

    const lab = labs.find((l) => l.id === labId);
    if (!message) {
      setMessage({ type: 'ok', text: `Salary for ${lab?.block || 'lab'} — ${selectedMonth} saved` });
    }
    setEditingLab(null);
    setSaving(false);
    setTimeout(() => setMessage(null), 3000);
  };

  const totalSalary = labs.reduce((sum, lab) => sum + getSalary(lab.id, selectedMonth), 0);

  const inputStyle = {
    border: '1.5px solid var(--color-bd2)',
    borderRadius: '9px',
    padding: '8px 10px',
    fontSize: '14px',
    fontFamily: "'Fira Mono', monospace",
    fontWeight: 600,
    background: '#fff',
    color: 'var(--color-tx)',
    outline: 'none',
    width: '120px',
  } as const;

  return (
    <div className="space-y-5">
      {message && (
        <div
          className="px-4 py-2.5 rounded-xl text-xs font-bold"
          style={{
            background: message.type === 'ok' ? 'var(--color-ok-bg)' : 'var(--color-er-bg)',
            color: message.type === 'ok' ? 'var(--color-ok)' : 'var(--color-er)',
          }}
        >
          {message.text}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <div className="sec-label" style={{ marginBottom: 0 }}>Lab Salary Entry</div>
          <p className="text-[11px] mt-1" style={{ color: 'var(--color-tx-f)' }}>
            Enter monthly salary for each lab. Experts will see this as read-only in their expense page.
          </p>
        </div>
        <div className="mcard" style={{ minWidth: '140px', textAlign: 'center' }}>
          <div className="mcard-label">Total ({selectedMonth.slice(0, 3)})</div>
          <div className="mcard-value" style={{ color: 'var(--color-g3)' }}>
            {totalSalary > 0 ? totalSalary.toLocaleString('en-IN') : '-'}
          </div>
        </div>
      </div>

      {/* Month selector */}
      <div className="flex flex-wrap gap-2">
        {MONTHS.map((month) => {
          const isSelected = selectedMonth === month;
          const hasData = labs.some((lab) => getSalary(lab.id, month) > 0);
          return (
            <button
              key={month}
              onClick={() => { setSelectedMonth(month); setEditingLab(null); }}
              className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
              style={{
                background: isSelected ? 'var(--color-ok-bg)' : hasData ? 'var(--color-g8)' : 'transparent',
                color: isSelected ? 'var(--color-ok)' : hasData ? 'var(--color-g3)' : 'var(--color-tx-d)',
                border: `1.5px solid ${isSelected ? 'rgba(45,110,31,0.3)' : hasData ? 'var(--color-bd2)' : 'var(--color-bd)'}`,
              }}
            >
              {month.slice(0, 3)}
              {hasData && <span className="ml-1 text-[9px] opacity-60">*</span>}
            </button>
          );
        })}
      </div>

      {/* Lab salary table */}
      <div className="theme-table-wrap">
        <table className="min-w-full" style={{ borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ background: 'var(--color-g8)' }}>
              {['S.N.', 'Lab Code', 'District', 'Block', 'Company', `Salary (${selectedMonth.slice(0, 3)})`, 'Action'].map((h) => (
                <th
                  key={h}
                  className="px-3 py-2.5 text-left whitespace-nowrap"
                  style={{
                    fontSize: '10px', fontWeight: 700, color: 'var(--color-tx-d)',
                    textTransform: 'uppercase', letterSpacing: '0.04em',
                    fontFamily: "'Fira Mono', monospace",
                    borderBottom: '1.5px solid var(--color-bd2)',
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {labs.map((lab, idx) => {
              const salary = getSalary(lab.id, selectedMonth);
              const isEditing = editingLab === lab.id;

              return (
                <tr key={lab.id} style={{ borderBottom: '1px solid rgba(61,107,48,0.06)' }}>
                  <td className="px-3 py-2.5 mn" style={{ color: 'var(--color-tx-f)' }}>{idx + 1}</td>
                  <td className="px-3 py-2.5">
                    <span className="text-sm font-bold" style={{ color: 'var(--color-g3)' }}>{lab.lab_code}</span>
                  </td>
                  <td className="px-3 py-2.5 text-sm" style={{ color: 'var(--color-tx)' }}>{lab.district}</td>
                  <td className="px-3 py-2.5 text-sm" style={{ color: 'var(--color-tx)' }}>{lab.block}</td>
                  <td className="px-3 py-2.5">
                    <span className="pill pill-ok text-[10px]">{lab.company_name}</span>
                  </td>
                  <td className="px-3 py-2.5">
                    {isEditing ? (
                      <input
                        type="number"
                        value={editValue}
                        onChange={(e) => setEditValue(Number(e.target.value))}
                        style={inputStyle}
                        min={0}
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSave(lab.id);
                          if (e.key === 'Escape') setEditingLab(null);
                        }}
                      />
                    ) : (
                      <span className="mn font-bold text-sm" style={{ color: salary > 0 ? 'var(--color-tx)' : 'var(--color-tx-f)' }}>
                        {salary > 0 ? salary.toLocaleString('en-IN') : '-'}
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2.5">
                    {isEditing ? (
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => handleSave(lab.id)}
                          disabled={saving}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-white"
                          style={{
                            background: 'linear-gradient(135deg, #3d6b30, #4e8a3e)',
                            boxShadow: '0 1px 4px rgba(61,107,48,0.3)',
                            opacity: saving ? 0.6 : 1,
                          }}
                        >
                          {saving ? '...' : 'Save'}
                        </button>
                        <button
                          onClick={() => setEditingLab(null)}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-bold"
                          style={{ border: '1px solid var(--color-bd2)', color: 'var(--color-tx-d)' }}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleEdit(lab.id)}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all"
                        style={{ border: '1px solid var(--color-bd2)', color: 'var(--color-tx-d)', background: 'transparent' }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-g8)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                      >
                        {salary > 0 ? 'Edit' : 'Set Salary'}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr style={{ background: 'var(--color-g8)', fontWeight: 700 }}>
              <td colSpan={5} className="px-3 py-2.5 text-right text-sm" style={{ color: 'var(--color-tx)', fontFamily: "'Fira Mono', monospace", fontSize: '11px' }}>
                TOTAL SALARY ({selectedMonth.slice(0, 3)})
              </td>
              <td className="px-3 py-2.5 mn font-bold text-sm" style={{ color: 'var(--color-g3)' }}>
                {totalSalary > 0 ? totalSalary.toLocaleString('en-IN') : '-'}
              </td>
              <td />
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Overview: all months */}
      <div className="sec-label">Salary Overview (All Months)</div>
      <div className="theme-table-wrap">
        <table className="min-w-full" style={{ borderCollapse: 'collapse', fontSize: '12px' }}>
          <thead>
            <tr style={{ background: 'var(--color-g8)' }}>
              <th className="px-3 py-2 text-left" style={{ fontSize: '10px', fontWeight: 700, color: 'var(--color-tx-d)', textTransform: 'uppercase', letterSpacing: '0.04em', fontFamily: "'Fira Mono', monospace", borderBottom: '1.5px solid var(--color-bd2)', minWidth: '100px' }}>
                Lab
              </th>
              {MONTHS.map((m) => (
                <th key={m} className="px-2 py-2 text-center" style={{ fontSize: '10px', fontWeight: 700, color: 'var(--color-tx-d)', textTransform: 'uppercase', letterSpacing: '0.04em', fontFamily: "'Fira Mono', monospace", borderBottom: '1.5px solid var(--color-bd2)' }}>
                  {m.slice(0, 3)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {labs.map((lab) => (
              <tr key={lab.id} style={{ borderBottom: '1px solid rgba(61,107,48,0.06)' }}>
                <td className="px-3 py-2 text-sm font-bold whitespace-nowrap" style={{ color: 'var(--color-g3)' }}>
                  {lab.lab_code}
                  <span className="text-[9px] font-normal ml-1.5" style={{ color: 'var(--color-tx-f)' }}>{lab.block}</span>
                </td>
                {MONTHS.map((month) => {
                  const val = getSalary(lab.id, month);
                  return (
                    <td key={month} className="px-2 py-2 text-center mn" style={{ color: val > 0 ? 'var(--color-tx)' : 'var(--color-tx-f)' }}>
                      {val > 0 ? val.toLocaleString('en-IN') : '-'}
                    </td>
                  );
                })}
              </tr>
            ))}
            <tr style={{ background: 'var(--color-g8)', fontWeight: 700 }}>
              <td className="px-3 py-2 text-sm" style={{ fontFamily: "'Fira Mono', monospace", fontSize: '10px', color: 'var(--color-tx)' }}>TOTAL</td>
              {MONTHS.map((month) => {
                const total = labs.reduce((sum, lab) => sum + getSalary(lab.id, month), 0);
                return (
                  <td key={month} className="px-2 py-2 text-center mn font-bold" style={{ color: total > 0 ? 'var(--color-tx)' : 'var(--color-tx-f)' }}>
                    {total > 0 ? total.toLocaleString('en-IN') : '-'}
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
