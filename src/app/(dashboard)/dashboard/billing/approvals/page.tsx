'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { MOCK_BILLS, IS_PREVIEW } from '@/lib/mockData';
import RoleGuard from '@/components/layout/RoleGuard';
import StatusBadge from '@/components/common/StatusBadge';
import RejectModal from '@/components/common/RejectModal';
import type { Bill } from '@/lib/types';

/* ------------------------------------------------------------------ */
/*  Generic Input Modal (styled like RejectModal)                     */
/* ------------------------------------------------------------------ */
interface InputField {
  key: string;
  label: string;
  placeholder?: string;
  defaultValue?: string;
  type?: string;
}

interface InputModalProps {
  title: string;
  description?: string;
  fields: InputField[];
  confirmLabel: string;
  confirmStyle?: React.CSSProperties;
  onConfirm: (values: Record<string, string>) => void;
  onCancel: () => void;
}

function InputModal({ title, description, fields, confirmLabel, confirmStyle, onConfirm, onCancel }: InputModalProps) {
  const [values, setValues] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    fields.forEach((f) => { init[f.key] = f.defaultValue ?? ''; });
    return init;
  });
  const [error, setError] = useState('');

  const handleSubmit = () => {
    for (const f of fields) {
      if (!values[f.key]?.trim()) {
        setError(`Please fill in: ${f.label}`);
        return;
      }
    }
    onConfirm(values);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(2px)' }}
      onClick={onCancel}
    >
      <div
        className="w-full max-w-md rounded-2xl p-5 space-y-4"
        style={{
          background: 'var(--color-parch)',
          border: '1.5px solid var(--color-bd)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div>
          <h3 className="text-sm font-extrabold" style={{ color: 'var(--color-tx)' }}>
            {title}
          </h3>
          {description && (
            <p className="text-[11px] mt-1" style={{ color: 'var(--color-tx-f)' }}>
              {description}
            </p>
          )}
        </div>

        {/* Fields */}
        {fields.map((f, idx) => (
          <div key={f.key}>
            <label
              style={{
                fontSize: '10px',
                fontWeight: 700,
                color: 'var(--color-tx-d)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                fontFamily: "'Fira Mono', monospace",
                marginBottom: '4px',
                display: 'block',
              }}
            >
              {f.label} *
            </label>
            <input
              type={f.type || 'text'}
              value={values[f.key]}
              onChange={(e) => { setValues({ ...values, [f.key]: e.target.value }); setError(''); }}
              className="w-full"
              style={{
                border: `1.5px solid ${error ? 'var(--color-er)' : 'var(--color-bd2)'}`,
                borderRadius: '9px',
                padding: '10px 12px',
                fontSize: '13px',
                fontFamily: "'Nunito', sans-serif",
                fontWeight: 500,
                background: 'var(--color-parch)',
                color: 'var(--color-tx)',
                outline: 'none',
              }}
              placeholder={f.placeholder}
              autoFocus={idx === 0}
            />
          </div>
        ))}

        {error && (
          <p className="text-[11px] font-bold" style={{ color: 'var(--color-er)' }}>{error}</p>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-1" style={{ borderTop: '1px solid var(--color-bd)' }}>
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-[9px] text-xs font-bold"
            style={{ border: '1.5px solid var(--color-bd2)', color: 'var(--color-tx-d)', background: 'transparent' }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded-[9px] text-xs font-bold text-white"
            style={confirmStyle ?? {
              background: 'linear-gradient(135deg, #3d6b30, #4e8a3e)',
              boxShadow: '0 2px 8px rgba(61,107,48,0.35)',
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                              */
/* ------------------------------------------------------------------ */

export default function BillApprovalsPage() {
  return (
    <RoleGuard allowedRoles={['team_leader', 'account_section', 'admin']}>
      <BillApprovalsContent />
    </RoleGuard>
  );
}

function BillApprovalsContent() {
  const { profile } = useAuth();
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'pending' | 'approved' | 'all'>('pending');
  const [rejectingBill, setRejectingBill] = useState<Bill | null>(null);
  const [approvingBill, setApprovingBill] = useState<Bill | null>(null);
  const [payingBill, setPayingBill] = useState<Bill | null>(null);

  useEffect(() => {
    if (IS_PREVIEW) {
      const filtered = filter === 'all' ? MOCK_BILLS : MOCK_BILLS.filter(b => b.submission_status === filter);
      setBills(filtered);
      setLoading(false);
      return;
    }
    async function fetchBills() {
      const supabase = createClient();
      let query = supabase.from('bills').select('*, lab:labs(*)').order('created_at', { ascending: false });
      if (filter !== 'all') query = query.eq('submission_status', filter);
      const { data } = await query;
      if (data) setBills(data);
      setLoading(false);
    }
    fetchBills();
  }, [filter]);

  const handleApprove = async (bill: Bill, orderNum: string) => {
    if (IS_PREVIEW) {
      setBills(bills.map(b => b.id === bill.id ? { ...b, submission_status: 'approved', sanctioned_order_number: orderNum, approved_by: profile?.id || null, approved_at: new Date().toISOString() } : b));
      setApprovingBill(null);
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.from('bills').update({
      submission_status: 'approved',
      approved_by: profile?.id,
      approved_at: new Date().toISOString(),
      sanctioned_order_number: orderNum,
    }).eq('id', bill.id);
    if (!error) {
      setBills(bills.map(b => b.id === bill.id ? { ...b, submission_status: 'approved', sanctioned_order_number: orderNum } : b));
      await supabase.from('notifications').insert({
        recipient_id: bill.submitted_by || profile?.id,
        type: 'bill_approved',
        title: 'Bill Approved',
        message: `Bill ${bill.bill_no} has been approved. Order: ${orderNum}`,
        related_bill_id: bill.id,
      });
    }
    setApprovingBill(null);
  };

  const handleReject = async (bill: Bill, reason: string) => {
    if (IS_PREVIEW) {
      setBills(bills.map(b => b.id === bill.id ? { ...b, submission_status: 'rejected', rejection_reason: reason } : b));
      setRejectingBill(null);
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.from('bills').update({
      submission_status: 'rejected',
      rejection_reason: reason,
    }).eq('id', bill.id);
    if (!error) {
      setBills(bills.map(b => b.id === bill.id ? { ...b, submission_status: 'rejected', rejection_reason: reason } : b));
    }
    setRejectingBill(null);
  };

  const handlePayment = async (bill: Bill, utr: string, amount: string) => {
    if (IS_PREVIEW) {
      setBills(bills.map(b => b.id === bill.id ? { ...b, payment_status: 'received', payment_date: new Date().toISOString().split('T')[0], payment_amount: Number(amount), utr_number: utr } : b));
      setPayingBill(null);
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.from('bills').update({
      payment_status: 'received',
      payment_date: new Date().toISOString().split('T')[0],
      payment_amount: Number(amount),
      utr_number: utr,
    }).eq('id', bill.id);
    if (!error) {
      setBills(bills.map(b => b.id === bill.id ? { ...b, payment_status: 'received', utr_number: utr, payment_amount: Number(amount) } : b));
    }
    setPayingBill(null);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-g4" /></div>;
  }

  return (
    <div className="space-y-5">
      {/* Reject Modal */}
      {rejectingBill && (
        <RejectModal
          title={`Reject Bill: ${rejectingBill.bill_no}`}
          description={`Bill amount: ${rejectingBill.billing_amount.toLocaleString('en-IN')} | ${rejectingBill.district}`}
          onReject={(reason) => handleReject(rejectingBill, reason)}
          onCancel={() => setRejectingBill(null)}
        />
      )}

      {/* Approve Modal */}
      {approvingBill && (
        <InputModal
          title={`Approve Bill: ${approvingBill.bill_no}`}
          description={`Bill amount: ${approvingBill.billing_amount.toLocaleString('en-IN')} | ${approvingBill.district}`}
          fields={[
            { key: 'orderNum', label: 'Sanctioned Order Number', placeholder: 'e.g. SO-2026-001' },
          ]}
          confirmLabel="Approve"
          onConfirm={(vals) => handleApprove(approvingBill, vals.orderNum)}
          onCancel={() => setApprovingBill(null)}
        />
      )}

      {/* Payment Modal */}
      {payingBill && (
        <InputModal
          title={`Record Payment: ${payingBill.bill_no}`}
          description={`Bill amount: ${payingBill.billing_amount.toLocaleString('en-IN')} | ${payingBill.district}`}
          fields={[
            { key: 'utr', label: 'UTR Number', placeholder: 'e.g. UTR123456789' },
            { key: 'amount', label: 'Payment Amount', placeholder: 'e.g. 50000', defaultValue: String(payingBill.billing_amount), type: 'number' },
          ]}
          confirmLabel="Record Payment"
          confirmStyle={{
            background: 'linear-gradient(135deg, #165a6a, #1e7a8a)',
            boxShadow: '0 2px 8px rgba(22,90,106,0.35)',
          }}
          onConfirm={(vals) => handlePayment(payingBill, vals.utr, vals.amount)}
          onCancel={() => setPayingBill(null)}
        />
      )}

      <div className="flex items-center justify-between">
        <div className="sec-label" style={{ marginBottom: 0 }}>🧾 Bill Approvals</div>
        <div className="flex gap-1.5">
          {(['pending', 'approved', 'all'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all"
              style={{
                background: filter === f ? 'var(--color-ok-bg)' : 'transparent',
                color: filter === f ? 'var(--color-ok)' : 'var(--color-tx-d)',
                border: `1.5px solid ${filter === f ? 'rgba(45,110,31,0.2)' : 'var(--color-bd2)'}`,
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {bills.map(bill => (
          <div key={bill.id} className="theme-card">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2.5">
                  <h3 className="font-extrabold text-sm" style={{ color: 'var(--color-g1)' }}>{bill.bill_no}</h3>
                  <StatusBadge status={bill.submission_status} />
                  <StatusBadge status={bill.payment_status} />
                </div>
                <p className="text-[11px] mt-1" style={{ color: 'var(--color-tx-f)', fontFamily: "'Fira Mono', monospace" }}>
                  {bill.district} - {bill.company_name} | Date: {bill.bill_date}
                </p>
              </div>
              <div className="text-right">
                <p className="text-base font-extrabold mn" style={{ color: 'var(--color-tx)' }}>₹{bill.billing_amount.toLocaleString('en-IN')}</p>
                <p className="text-[10px]" style={{ color: 'var(--color-tx-f)' }}>{bill.billing_samples} samples</p>
              </div>
            </div>

            {bill.rejection_reason && bill.submission_status === 'rejected' && (
              <div className="mt-2 px-3 py-2 rounded-lg" style={{ background: 'var(--color-er-bg)', border: '1px solid rgba(139,32,32,0.15)' }}>
                <p className="text-[10px] font-bold" style={{ color: 'var(--color-er)' }}>Rejection Reason:</p>
                <p className="text-[11px] mt-0.5" style={{ color: 'var(--color-er)' }}>{bill.rejection_reason}</p>
              </div>
            )}
            {bill.sanctioned_order_number && (
              <p className="text-[11px] mt-2" style={{ color: 'var(--color-tx-f)' }}>Sanctioned Order: {bill.sanctioned_order_number}</p>
            )}
            {bill.utr_number && (
              <p className="text-[11px]" style={{ color: 'var(--color-tx-f)' }}>UTR: {bill.utr_number} | Paid: ₹{bill.payment_amount?.toLocaleString('en-IN')}</p>
            )}

            <div className="flex gap-2 mt-3">
              {profile?.role === 'team_leader' && bill.submission_status === 'pending' && (
                <>
                  <button
                    onClick={() => setApprovingBill(bill)}
                    className="px-3 py-1.5 rounded-[9px] text-xs font-bold text-white"
                    style={{ background: 'linear-gradient(135deg, #3d6b30, #4e8a3e)', boxShadow: '0 2px 8px rgba(61,107,48,0.35)' }}
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => setRejectingBill(bill)}
                    className="px-3 py-1.5 rounded-[9px] text-xs font-bold"
                    style={{ background: 'var(--color-er-bg)', color: 'var(--color-er)' }}
                  >
                    Reject
                  </button>
                </>
              )}
              {profile?.role === 'account_section' && bill.submission_status === 'approved' && bill.payment_status === 'pending' && (
                <button
                  onClick={() => setPayingBill(bill)}
                  className="px-3 py-1.5 rounded-[9px] text-xs font-bold text-white"
                  style={{ background: 'linear-gradient(135deg, #165a6a, #1e7a8a)' }}
                >
                  Record Payment
                </button>
              )}
            </div>
          </div>
        ))}
        {bills.length === 0 && (
          <div className="theme-card text-center py-8">
            <p className="text-sm" style={{ color: 'var(--color-tx-f)' }}>No {filter !== 'all' ? filter : ''} bills found</p>
          </div>
        )}
      </div>
    </div>
  );
}
