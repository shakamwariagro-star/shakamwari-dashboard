'use client';

import { useEffect, useState } from 'react';
import { getCoordinatorById, getLabsForCoordinator } from '@/lib/coordinatorData';
import { MOCK_BILLS, IS_PREVIEW } from '@/lib/mockData';
import { createClient } from '@/lib/supabase/client';
import StatusBadge from '@/components/common/StatusBadge';
import type { Lab, Bill } from '@/lib/types';

export default function CoordinatorBillingPage() {
  const [labs, setLabs] = useState<Lab[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all');
  const supabase = createClient();

  useEffect(() => {
    const storedId = localStorage.getItem('shakamwari_coordinator_id');
    if (!storedId) return;
    const coord = getCoordinatorById(storedId);
    if (!coord) return;
    const coordLabs = getLabsForCoordinator(coord.full_name);
    setLabs(coordLabs);

    if (IS_PREVIEW) {
      const labIds = coordLabs.map(l => l.id);
      setBills(MOCK_BILLS.filter(b => labIds.includes(b.lab_id)));
      return;
    }

    const labIds = coordLabs.map(l => l.id);
    supabase.from('bills').select('*, lab:labs(*)').in('lab_id', labIds).order('created_at', { ascending: false }).then(({ data }) => {
      if (data) setBills(data);
    });
  }, []);

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

  const filteredBills = filter === 'all' ? bills : bills.filter(b => b.submission_status === filter);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="sec-label" style={{ marginBottom: 0 }}>Bill Submission & Payment Status</div>
        <div className="flex gap-1.5">
          {(['all', 'pending', 'approved'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} className="px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all" style={{
              background: filter === f ? 'var(--color-ok-bg)' : 'transparent',
              color: filter === f ? 'var(--color-ok)' : 'var(--color-tx-d)',
              border: `1.5px solid ${filter === f ? 'rgba(45,110,31,0.2)' : 'var(--color-bd2)'}`,
            }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="theme-table-wrap">
        <table className="min-w-full" style={{ borderCollapse: 'collapse', fontSize: '12.5px' }}>
          <thead>
            <tr style={{ background: 'var(--color-g8)' }}>
              {['S.N', 'Dist', 'Lab', 'Company', 'Bill No.', 'Date', 'Samples', 'Amount', 'Order No.', 'Status', 'Payment', 'Pay Date', 'Pay Amount', 'UTR', 'Actions'].map(h => (
                <th key={h} className="px-2.5 py-2.5 text-left whitespace-nowrap" style={{ fontSize: '10px', fontWeight: 700, color: 'var(--color-tx-d)', textTransform: 'uppercase', letterSpacing: '0.04em', fontFamily: "'Fira Mono', monospace", borderBottom: '1.5px solid var(--color-bd2)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredBills.map((bill, i) => {
              const lab = labs.find(l => l.id === bill.lab_id);
              return (
                <tr key={bill.id} style={{ borderBottom: '1px solid rgba(61,107,48,0.06)' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-g8)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                >
                  <td className="px-2.5 py-2 mn" style={{ color: 'var(--color-tx-d)' }}>{i + 1}</td>
                  <td className="px-2.5 py-2 text-sm">{bill.district}</td>
                  <td className="px-2.5 py-2 text-sm font-semibold" style={{ color: 'var(--color-g3)' }}>{lab?.lab_code || '-'}</td>
                  <td className="px-2.5 py-2 text-sm">{bill.company_name}</td>
                  <td className="px-2.5 py-2 text-sm font-bold" style={{ color: 'var(--color-g1)' }}>{bill.bill_no}</td>
                  <td className="px-2.5 py-2 mn" style={{ color: 'var(--color-tx-d)' }}>{bill.bill_date}</td>
                  <td className="px-2.5 py-2 text-right mn">{bill.billing_samples.toLocaleString('en-IN')}</td>
                  <td className="px-2.5 py-2 text-right mn font-bold">{bill.billing_amount.toLocaleString('en-IN')}</td>
                  <td className="px-2.5 py-2 mn" style={{ color: 'var(--color-tx-d)' }}>{bill.sanctioned_order_number || '-'}</td>
                  <td className="px-2.5 py-2"><StatusBadge status={bill.submission_status} /></td>
                  <td className="px-2.5 py-2"><StatusBadge status={bill.payment_status} /></td>
                  <td className="px-2.5 py-2 mn" style={{ color: 'var(--color-tx-d)' }}>{bill.payment_date || '-'}</td>
                  <td className="px-2.5 py-2 text-right mn font-bold" style={{ color: 'var(--color-ok)' }}>{bill.payment_amount?.toLocaleString('en-IN') || '-'}</td>
                  <td className="px-2.5 py-2 mn" style={{ color: 'var(--color-tx-d)' }}>{bill.utr_number || '-'}</td>
                  <td className="px-2.5 py-2">
                    {bill.submission_status === 'pending' && (
                      <button onClick={() => handleApprove(bill)} className="text-xs font-bold hover:underline" style={{ color: 'var(--color-ok)' }}>Approve</button>
                    )}
                  </td>
                </tr>
              );
            })}
            {filteredBills.length === 0 && (
              <tr><td colSpan={15} className="px-4 py-8 text-center text-sm" style={{ color: 'var(--color-tx-f)' }}>No bills found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
