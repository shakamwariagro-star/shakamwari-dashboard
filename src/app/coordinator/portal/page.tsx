'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getCoordinatorById, getLabsForCoordinator } from '@/lib/coordinatorData';
import { MOCK_APPROVALS, MOCK_EXPENSES, IS_PREVIEW, type PendingApproval } from '@/lib/mockData';
import { createClient } from '@/lib/supabase/client';
import RejectModal from '@/components/common/RejectModal';
import type { Lab, Expense } from '@/lib/types';

export default function CoordinatorInbox() {
  const [labs, setLabs] = useState<Lab[]>([]);
  const [approvals, setApprovals] = useState<PendingApproval[]>(MOCK_APPROVALS);
  const [pendingExpenses, setPendingExpenses] = useState<Expense[]>([]);
  const [coordName, setCoordName] = useState('');
  const [rejectTarget, setRejectTarget] = useState<{ type: 'approval' | 'expense'; id: number } | null>(null);

  useEffect(() => {
    const storedId = localStorage.getItem('shakamwari_coordinator_id');
    if (!storedId) return;
    const coord = getCoordinatorById(storedId);
    if (!coord) return;
    setCoordName(coord.full_name);
    const coordLabs = getLabsForCoordinator(coord.full_name);
    setLabs(coordLabs);

    // Load submitted expenses for coordinator's labs
    const labIds = coordLabs.map(l => l.id);
    if (IS_PREVIEW) {
      setPendingExpenses(MOCK_EXPENSES.filter(e =>
        labIds.includes(e.lab_id) && (e.approval_status === 'submitted' || e.approval_status === 'rejected')
      ));
      return;
    }

    const supabase = createClient();
    supabase
      .from('expenses')
      .select('*')
      .in('lab_id', labIds)
      .in('approval_status', ['submitted', 'rejected'])
      .then(({ data }) => { if (data) setPendingExpenses(data); });
  }, []);

  // Approve existing approval item
  const handleApprove = (id: number) => {
    setApprovals(approvals.map(a => a.id === id ? { ...a, status: 'approved' } : a));
  };

  // Reject existing approval item with reason
  const handleRejectApproval = (id: number, reason: string) => {
    setApprovals(approvals.map(a => a.id === id ? { ...a, status: 'rejected' } : a));
    setRejectTarget(null);
  };

  // Approve expense
  const handleApproveExpense = async (expenseId: number) => {
    const updateData = {
      approval_status: 'approved' as const,
      approved_by: coordName,
      approved_at: new Date().toISOString(),
      rejection_reason: null,
    };

    if (IS_PREVIEW) {
      setPendingExpenses(pendingExpenses.filter(e => e.id !== expenseId));
      return;
    }

    const supabase = createClient();
    await supabase.from('expenses').update(updateData).eq('id', expenseId);
    setPendingExpenses(pendingExpenses.filter(e => e.id !== expenseId));
  };

  // Reject expense with reason
  const handleRejectExpense = async (expenseId: number, reason: string) => {
    const updateData = {
      approval_status: 'rejected' as const,
      rejection_reason: reason,
    };

    if (IS_PREVIEW) {
      setPendingExpenses(pendingExpenses.map(e =>
        e.id === expenseId ? { ...e, ...updateData } : e
      ));
      setRejectTarget(null);
      return;
    }

    const supabase = createClient();
    await supabase.from('expenses').update(updateData).eq('id', expenseId);
    setPendingExpenses(pendingExpenses.map(e =>
      e.id === expenseId ? { ...e, ...updateData } : e
    ));
    setRejectTarget(null);
  };

  const pendingApprovalItems = approvals.filter(a => a.status === 'pending');
  const submittedExpenses = pendingExpenses.filter(e => e.approval_status === 'submitted');
  const recentApprovals = approvals.filter(a => a.status !== 'pending');

  const totalPending = pendingApprovalItems.length + submittedExpenses.length;

  const formatNum = (n: number) => n.toLocaleString('en-IN');
  const totalTarget = labs.reduce((s, l) => s + l.target, 0);
  const totalTested = labs.reduce((s, l) => s + l.sample_tested, 0);
  const totalBilling = labs.reduce((s, l) => s + l.billing_amount, 0);
  const totalReceived = labs.reduce((s, l) => s + l.payment_received, 0);

  const calcExpenseTotal = (exp: Expense) =>
    (exp.salary || 0) + (exp.electricity || 0) + (exp.chemical || 0) +
    (exp.stationery || 0) + (exp.printing || 0) + (exp.lifafa || 0) +
    (exp.cleaning || 0) + (exp.other || 0) + (exp.tour || 0);

  return (
    <div className="space-y-5">
      {/* Reject Modal */}
      {rejectTarget && (
        <RejectModal
          title={rejectTarget.type === 'expense' ? 'Reject Expense Submission' : 'Reject Approval Request'}
          description="Please provide a reason so the expert can correct and resubmit."
          onReject={(reason) => {
            if (rejectTarget.type === 'expense') {
              handleRejectExpense(rejectTarget.id, reason);
            } else {
              handleRejectApproval(rejectTarget.id, reason);
            }
          }}
          onCancel={() => setRejectTarget(null)}
        />
      )}

      {/* Summary Cards */}
      <div className="sec-label">Overview</div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-2.5">
        {[
          { label: 'Total Labs', value: String(labs.length), color: 'var(--color-tx)' },
          { label: 'Total Target', value: formatNum(totalTarget), color: 'var(--color-tx)' },
          { label: 'Total Tested', value: formatNum(totalTested), color: 'var(--color-g3)' },
          { label: 'Total Billing', value: formatNum(totalBilling), color: 'var(--color-earth)' },
          { label: 'Payment Received', value: formatNum(totalReceived), color: 'var(--color-ok)' },
          { label: 'Pending Approvals', value: String(totalPending), color: totalPending > 0 ? 'var(--color-er)' : 'var(--color-ok)' },
        ].map(card => (
          <div key={card.label} className="mcard">
            <div className="mcard-label">{card.label}</div>
            <div className="mcard-value" style={{ color: card.color }}>{card.value}</div>
          </div>
        ))}
      </div>

      {/* Pending Expense Approvals */}
      {submittedExpenses.length > 0 && (
        <>
          <div className="sec-label">Pending Expense Approvals</div>
          <div className="space-y-2">
            {submittedExpenses.map(expense => {
              const lab = labs.find(l => l.id === expense.lab_id);
              const total = calcExpenseTotal(expense);
              return (
                <div key={expense.id} className="theme-card">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="pill pill-in text-[10px]">expense</span>
                        <span className="text-xs font-bold" style={{ color: 'var(--color-g1)' }}>
                          {lab?.lab_code} — {lab?.block}
                        </span>
                      </div>
                      <p className="text-[11px] mt-1" style={{ color: 'var(--color-tx-d)' }}>
                        <strong>{expense.submitted_by || 'Expert'}</strong> submitted expenses for <strong>{expense.month} {expense.year}</strong>
                      </p>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5">
                        {[
                          { label: 'Salary', val: expense.salary },
                          { label: 'Electricity', val: expense.electricity },
                          { label: 'Chemical', val: expense.chemical },
                          { label: 'Stationery', val: expense.stationery },
                          { label: 'Printing', val: expense.printing },
                          { label: 'Cleaning', val: expense.cleaning },
                          { label: 'Tour', val: expense.tour },
                          { label: 'Other', val: expense.other },
                        ].filter(item => item.val > 0).map(item => (
                          <span key={item.label} className="text-[10px] mn" style={{ color: 'var(--color-tx-f)' }}>
                            {item.label}: <span style={{ color: 'var(--color-tx-d)', fontWeight: 600 }}>{formatNum(item.val)}</span>
                          </span>
                        ))}
                      </div>
                      <p className="text-[11px] mt-1.5 mn font-bold" style={{ color: 'var(--color-earth)' }}>
                        Total: {formatNum(total)}
                      </p>
                      <p className="text-[10px] mn mt-0.5" style={{ color: 'var(--color-tx-f)' }}>
                        {new Date(expense.created_at).toLocaleString('en-IN')}
                      </p>
                    </div>
                    <div className="flex gap-1.5 flex-shrink-0 ml-3">
                      <button
                        onClick={() => handleApproveExpense(expense.id)}
                        className="px-3 py-1.5 rounded-[9px] text-xs font-bold text-white"
                        style={{ background: 'linear-gradient(135deg, #3d6b30, #4e8a3e)', boxShadow: '0 2px 8px rgba(61,107,48,0.35)' }}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => setRejectTarget({ type: 'expense', id: expense.id })}
                        className="px-3 py-1.5 rounded-[9px] text-xs font-bold"
                        style={{ background: 'var(--color-er-bg)', color: 'var(--color-er)' }}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Pending Data Approvals */}
      {pendingApprovalItems.length > 0 && (
        <>
          <div className="sec-label">Pending Data Approvals</div>
          <div className="space-y-2">
            {pendingApprovalItems.map(approval => {
              const lab = labs.find(l => l.id === approval.lab_id);
              return (
                <div key={approval.id} className="theme-card">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="pill pill-wn text-[10px]">{approval.type.replace('_', ' ')}</span>
                        <span className="text-xs font-bold" style={{ color: 'var(--color-g1)' }}>
                          {lab?.lab_code} — {lab?.block}
                        </span>
                      </div>
                      <p className="text-[11px] mt-1" style={{ color: 'var(--color-tx-d)' }}>
                        <strong>{approval.submitted_by}</strong> updated <strong>{approval.field?.replace('_', ' ')}</strong>
                        {approval.old_value !== undefined && (
                          <span>: {formatNum(approval.old_value)} → <span style={{ color: 'var(--color-ok)' }}>{formatNum(approval.new_value!)}</span></span>
                        )}
                      </p>
                      <p className="text-[10px] mn mt-0.5" style={{ color: 'var(--color-tx-f)' }}>
                        {new Date(approval.submitted_at).toLocaleString('en-IN')}
                      </p>
                    </div>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => handleApprove(approval.id)}
                        className="px-3 py-1.5 rounded-[9px] text-xs font-bold text-white"
                        style={{ background: 'linear-gradient(135deg, #3d6b30, #4e8a3e)', boxShadow: '0 2px 8px rgba(61,107,48,0.35)' }}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => setRejectTarget({ type: 'approval', id: approval.id })}
                        className="px-3 py-1.5 rounded-[9px] text-xs font-bold"
                        style={{ background: 'var(--color-er-bg)', color: 'var(--color-er)' }}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* No pending items */}
      {totalPending === 0 && (
        <div className="theme-card text-center py-6">
          <p className="text-2xl mb-2">✅</p>
          <p className="text-sm font-semibold" style={{ color: 'var(--color-ok)' }}>All caught up!</p>
          <p className="text-[11px] mt-1" style={{ color: 'var(--color-tx-f)' }}>No pending approvals at the moment.</p>
        </div>
      )}

      {/* Recent Activity */}
      {recentApprovals.length > 0 && (
        <>
          <div className="sec-label">Recent Activity</div>
          <div className="space-y-1.5">
            {recentApprovals.map(a => {
              const lab = labs.find(l => l.id === a.lab_id);
              return (
                <div key={a.id} className="theme-card py-2.5">
                  <div className="flex items-center gap-2">
                    <span className={`pill text-[10px] ${a.status === 'approved' ? 'pill-ok' : 'pill-er'}`}>
                      {a.status}
                    </span>
                    <span className="text-[11px]" style={{ color: 'var(--color-tx-d)' }}>
                      {a.submitted_by} — {a.field?.replace('_', ' ')} ({lab?.block})
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Labs Grid */}
      <div className="sec-label">My Labs</div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-3">
        {labs.map(lab => (
          <Link key={lab.id} href={`/coordinator/portal/lab/${lab.id}`}>
            <div className="mcard" style={{ cursor: 'pointer' }}>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="text-xs font-extrabold" style={{ color: 'var(--color-g1)' }}>{lab.lab_code}</span>
                  <span className="pill pill-ok text-[9px] ml-2">{lab.company_name}</span>
                </div>
                <span className="text-[10px] mn" style={{ color: 'var(--color-tx-f)' }}>{lab.block}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-1.5">
                <div>
                  <div className="text-[9px]" style={{ color: 'var(--color-tx-f)' }}>Target</div>
                  <div className="mn text-xs font-bold">{formatNum(lab.target)}</div>
                </div>
                <div>
                  <div className="text-[9px]" style={{ color: 'var(--color-tx-f)' }}>Tested</div>
                  <div className="mn text-xs font-bold" style={{ color: 'var(--color-g3)' }}>{formatNum(lab.sample_tested)}</div>
                </div>
                <div>
                  <div className="text-[9px]" style={{ color: 'var(--color-tx-f)' }}>SHC</div>
                  <div className="mn text-xs font-bold">{formatNum(lab.shc_printed)}</div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
