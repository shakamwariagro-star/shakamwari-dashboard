'use client';

import { useEffect, useState } from 'react';
import { getExpertById } from '@/lib/expertData';
import { MOCK_EXPENSES, IS_PREVIEW } from '@/lib/mockData';
import { createClient } from '@/lib/supabase/client';
import { MONTHS, EXPENSE_CATEGORIES } from '@/lib/constants';
import StatusBadge from '@/components/common/StatusBadge';
import type { Expense } from '@/lib/types';

const EXPERT_EXPENSE_CATEGORIES = EXPENSE_CATEGORIES.filter(c => c.key !== 'lifafa');
const EXPERT_EDITABLE_CATEGORIES = EXPERT_EXPENSE_CATEGORIES.filter(c => c.key !== 'salary');
const READ_ONLY_CATEGORIES = new Set(['salary']);

const APPROVAL_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  draft: { bg: 'var(--color-g8)', color: 'var(--color-tx-d)', label: 'Draft' },
  submitted: { bg: 'var(--color-in-bg)', color: 'var(--color-in)', label: 'Submitted' },
  approved: { bg: 'var(--color-ok-bg)', color: 'var(--color-ok)', label: 'Approved' },
  rejected: { bg: 'var(--color-er-bg)', color: 'var(--color-er)', label: 'Rejected' },
};

export default function ExpertExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [labId, setLabId] = useState<number>(0);
  const [expertName, setExpertName] = useState<string>('');
  const [editMonth, setEditMonth] = useState<string | null>(null);
  const [editData, setEditData] = useState<Record<string, number>>({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'ok' | 'er'; text: string } | null>(null);

  useEffect(() => {
    const storedId = localStorage.getItem('shakamwari_expert_id');
    if (!storedId) return;
    const expert = getExpertById(storedId);
    if (!expert) return;
    setLabId(expert.assigned_lab_id);
    setExpertName(expert.full_name);

    if (IS_PREVIEW) {
      setExpenses(MOCK_EXPENSES.filter((e) => e.lab_id === expert.assigned_lab_id));
      return;
    }

    const supabase = createClient();
    supabase
      .from('expenses')
      .select('*')
      .eq('lab_id', expert.assigned_lab_id)
      .order('month')
      .then(({ data }) => { if (data) setExpenses(data); });
  }, []);

  const getExpense = (month: string) =>
    expenses.find((e) => e.month.toLowerCase() === month.toLowerCase());

  const getApprovalStatus = (month: string): string => {
    const exp = getExpense(month);
    return exp?.approval_status || 'draft';
  };

  const handleEdit = (month: string) => {
    const status = getApprovalStatus(month);
    // Can only edit if draft, rejected, or no entry yet
    if (status === 'approved' || status === 'submitted') return;

    const existing = getExpense(month);
    setEditMonth(month);
    setEditData(
      existing
        ? EXPERT_EDITABLE_CATEGORIES.reduce((acc, c) => ({ ...acc, [c.key]: (existing as any)[c.key] || 0 }), {})
        : EXPERT_EDITABLE_CATEGORIES.reduce((acc, c) => ({ ...acc, [c.key]: 0 }), {})
    );
  };

  const handleSave = async () => {
    if (!editMonth) return;
    setSaving(true);
    setMessage(null);

    const existing = getExpense(editMonth);
    const saveData = {
      ...editData,
      approval_status: 'submitted' as const,
      submitted_by: expertName,
      rejection_reason: null,
    };

    if (IS_PREVIEW) {
      if (existing) {
        setExpenses(expenses.map((e) => (e.id === existing.id ? { ...e, ...saveData } : e)));
      } else {
        const newExp = {
          id: Date.now(), lab_id: labId, month: editMonth.toLowerCase(), year: 2026,
          salary: 0, lifafa: 0, ...saveData,
          approved_by: null, approved_at: null,
          created_at: new Date().toISOString(),
        } as Expense;
        setExpenses([...expenses, newExp]);
      }
      setEditMonth(null);
      setSaving(false);
      setMessage({ type: 'ok', text: `Expenses for ${editMonth} submitted for approval` });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    const supabase = createClient();
    if (existing) {
      const { error } = await supabase.from('expenses').update(saveData).eq('id', existing.id);
      if (!error) setExpenses(expenses.map((e) => (e.id === existing.id ? { ...e, ...saveData } : e)));
      else setMessage({ type: 'er', text: error.message });
    } else {
      const { data, error } = await supabase.from('expenses').insert({
        lab_id: labId, month: editMonth.toLowerCase(), year: 2026, ...saveData,
      }).select().single();
      if (data) setExpenses([...expenses, data]);
      else if (error) setMessage({ type: 'er', text: error.message });
    }

    setEditMonth(null);
    setSaving(false);
    if (!message) {
      setMessage({ type: 'ok', text: `Expenses for ${editMonth} submitted for approval` });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const calcTotal = (data: Record<string, number>, month?: string) => {
    const editableTotal = EXPERT_EDITABLE_CATEGORIES.reduce((s, c) => s + (data[c.key] || 0), 0);
    if (month) {
      const exp = getExpense(month);
      const salaryVal = exp ? (exp as any).salary || 0 : 0;
      return editableTotal + salaryVal;
    }
    return editableTotal + (data.salary || 0);
  };

  const inputStyle = {
    border: '1.5px solid var(--color-bd2)',
    borderRadius: '9px',
    padding: '8px 10px',
    fontSize: '13px',
    fontFamily: "'Fira Mono', monospace",
    fontWeight: 500,
    background: '#fff',
    color: 'var(--color-tx)',
    outline: 'none',
    width: '100%',
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

      <div className="sec-label">Monthly Expenses</div>
      <p className="text-[11px] -mt-3 mb-2" style={{ color: 'var(--color-tx-f)' }}>
        Submit expenses for coordinator approval. You can edit <strong>Draft</strong> and <strong>Rejected</strong> entries.
      </p>

      {/* Month selector with status */}
      <div className="flex flex-wrap gap-2">
        {MONTHS.map((month) => {
          const exp = getExpense(month);
          const hasData = !!exp;
          const isEditing = editMonth === month;
          const status = getApprovalStatus(month);
          const canEdit = status === 'draft' || status === 'rejected' || !hasData;
          const style = hasData ? APPROVAL_STYLES[status] || APPROVAL_STYLES.draft : null;

          return (
            <button
              key={month}
              onClick={() => (isEditing ? setEditMonth(null) : canEdit ? handleEdit(month) : null)}
              className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
              style={{
                background: isEditing ? 'var(--color-ok-bg)' : style?.bg || 'transparent',
                color: isEditing ? 'var(--color-ok)' : style?.color || 'var(--color-tx-d)',
                border: `1.5px solid ${isEditing ? 'rgba(45,110,31,0.3)' : hasData ? 'var(--color-bd2)' : 'var(--color-bd)'}`,
                opacity: !canEdit && !isEditing ? 0.7 : 1,
                cursor: canEdit || isEditing ? 'pointer' : 'default',
              }}
            >
              {month.slice(0, 3)}
              {hasData && (
                <span className="ml-1 text-[8px] font-bold" style={{ opacity: 0.8 }}>
                  {status === 'submitted' ? '⏳' : status === 'approved' ? '✓' : status === 'rejected' ? '✗' : ''}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Rejection reason banner */}
      {editMonth && getApprovalStatus(editMonth) === 'rejected' && (
        <div
          className="px-4 py-3 rounded-xl flex items-start gap-2.5"
          style={{ background: 'var(--color-er-bg)', border: '1.5px solid rgba(139,32,32,0.2)' }}
        >
          <span className="text-lg flex-shrink-0">❌</span>
          <div>
            <p className="text-xs font-bold" style={{ color: 'var(--color-er)' }}>
              Rejected by coordinator
            </p>
            <p className="text-[11px] mt-0.5" style={{ color: 'var(--color-er)' }}>
              Reason: {getExpense(editMonth)?.rejection_reason || 'No reason provided'}
            </p>
            <p className="text-[10px] mt-1" style={{ color: 'var(--color-tx-f)' }}>
              Please correct the issues and resubmit.
            </p>
          </div>
        </div>
      )}

      {/* Edit Form */}
      {editMonth && (
        <div className="theme-card space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="theme-card-title" style={{ marginBottom: 0 }}>
                Expenses for {editMonth} 2026
              </div>
              {getExpense(editMonth) && (
                <span
                  className="pill text-[9px] font-bold"
                  style={{
                    background: APPROVAL_STYLES[getApprovalStatus(editMonth)].bg,
                    color: APPROVAL_STYLES[getApprovalStatus(editMonth)].color,
                  }}
                >
                  {APPROVAL_STYLES[getApprovalStatus(editMonth)].label}
                </span>
              )}
            </div>
            <div className="mn font-bold text-sm" style={{ color: 'var(--color-earth)' }}>
              Total: {calcTotal(editData, editMonth!).toLocaleString('en-IN')}
            </div>
          </div>

          <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-2.5">
            {EXPERT_EXPENSE_CATEGORIES.map((cat) => {
              const isReadOnly = READ_ONLY_CATEGORIES.has(cat.key);
              const salaryValue = isReadOnly ? ((getExpense(editMonth!) as any)?.[cat.key] || 0) : (editData[cat.key] || 0);
              return (
                <div key={cat.key}>
                  <label
                    style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      color: isReadOnly ? 'var(--color-tx-f)' : 'var(--color-tx-d)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      fontFamily: "'Fira Mono', monospace",
                      marginBottom: '4px',
                      display: 'block',
                    }}
                  >
                    {cat.label} {isReadOnly && <span style={{ fontSize: '8px', opacity: 0.7 }}>(set by coordinator)</span>}
                  </label>
                  {isReadOnly ? (
                    <div
                      className="mn font-bold text-lg px-2.5 py-1.5 rounded-lg"
                      style={{
                        background: 'var(--color-g8)',
                        color: 'var(--color-tx-d)',
                        border: '1.5px solid var(--color-bd)',
                        minHeight: '38px',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      {salaryValue > 0 ? salaryValue.toLocaleString('en-IN') : '-'}
                    </div>
                  ) : (
                    <input
                      type="number"
                      value={editData[cat.key] || 0}
                      onChange={(e) => setEditData({ ...editData, [cat.key]: Number(e.target.value) })}
                      style={inputStyle}
                      min={0}
                    />
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex justify-end gap-2 pt-2" style={{ borderTop: '1px solid var(--color-bd)' }}>
            <button
              onClick={() => setEditMonth(null)}
              className="px-3 py-1.5 rounded-[9px] text-xs font-bold"
              style={{ border: '1.5px solid var(--color-bd2)', color: 'var(--color-tx-d)' }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-1.5 rounded-[9px] text-xs font-bold text-white"
              style={{
                background: 'linear-gradient(135deg, #3d6b30, #4e8a3e)',
                boxShadow: '0 2px 8px rgba(61,107,48,0.35)',
                opacity: saving ? 0.6 : 1,
              }}
            >
              {saving ? 'Submitting...' : 'Submit for Approval'}
            </button>
          </div>
        </div>
      )}

      {/* Summary Table with status row */}
      <div className="theme-table-wrap">
        <table className="min-w-full" style={{ borderCollapse: 'collapse', fontSize: '12.5px' }}>
          <thead>
            <tr style={{ background: 'var(--color-g8)' }}>
              <th className="px-3 py-2.5 text-left" style={{ fontSize: '10px', fontWeight: 700, color: 'var(--color-tx-d)', textTransform: 'uppercase', letterSpacing: '0.04em', fontFamily: "'Fira Mono', monospace", borderBottom: '1.5px solid var(--color-bd2)' }}>Category</th>
              {MONTHS.map((m) => (
                <th key={m} className="px-2 py-2.5 text-center" style={{ fontSize: '10px', fontWeight: 700, color: 'var(--color-tx-d)', textTransform: 'uppercase', letterSpacing: '0.04em', fontFamily: "'Fira Mono', monospace", borderBottom: '1.5px solid var(--color-bd2)' }}>{m.slice(0, 3)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Status row */}
            <tr style={{ borderBottom: '1.5px solid var(--color-bd2)' }}>
              <td className="px-3 py-2 text-[10px] font-bold uppercase" style={{ color: 'var(--color-tx-d)', fontFamily: "'Fira Mono', monospace" }}>Status</td>
              {MONTHS.map((month) => {
                const status = getApprovalStatus(month);
                const hasData = !!getExpense(month);
                const style = APPROVAL_STYLES[status];
                return (
                  <td key={month} className="px-1 py-2 text-center">
                    {hasData ? (
                      <span
                        className="inline-block text-[8px] font-bold px-1.5 py-0.5 rounded"
                        style={{ background: style.bg, color: style.color }}
                      >
                        {style.label}
                      </span>
                    ) : (
                      <span className="text-[9px]" style={{ color: 'var(--color-tx-f)' }}>-</span>
                    )}
                  </td>
                );
              })}
            </tr>
            {EXPERT_EXPENSE_CATEGORIES.map((cat) => (
              <tr key={cat.key} style={{ borderBottom: '1px solid rgba(61,107,48,0.06)' }}>
                <td className="px-3 py-2 text-sm whitespace-nowrap" style={{ color: 'var(--color-tx)' }}>{cat.label}</td>
                {MONTHS.map((month) => {
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
              {MONTHS.map((month) => {
                const exp = getExpense(month);
                const total = exp ? EXPERT_EXPENSE_CATEGORIES.reduce((s, c) => s + ((exp as any)[c.key] || 0), 0) : 0;
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
    </div>
  );
}
