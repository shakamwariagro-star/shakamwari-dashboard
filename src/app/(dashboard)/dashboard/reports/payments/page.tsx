'use client';

import { useEffect, useState, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import { MOCK_LABS, IS_PREVIEW } from '@/lib/mockData';
import { exportToCsv, exportButtonStyle } from '@/lib/exportCsv';
import type { Lab } from '@/lib/types';

type PaymentStatus = 'All' | 'Fully Paid' | 'Partial' | 'Pending';

const thStyle: React.CSSProperties = {
  fontSize: '10px', fontWeight: 700, color: 'var(--color-tx-d)',
  textTransform: 'uppercase', letterSpacing: '0.04em',
  fontFamily: "'Fira Mono', monospace",
  borderBottom: '1.5px solid var(--color-bd2)',
  padding: '10px 12px', textAlign: 'left', whiteSpace: 'nowrap',
};

const tdStyle: React.CSSProperties = {
  padding: '8px 12px', fontSize: '12.5px', color: 'var(--color-tx)',
};

function getPaymentStatus(lab: Lab): 'Fully Paid' | 'Partial' | 'Pending' {
  if (lab.sanctioned_payment <= 0) return 'Pending';
  if (lab.payment_received >= lab.sanctioned_payment) return 'Fully Paid';
  if (lab.payment_received > 0) return 'Partial';
  return 'Pending';
}

function statusBadgeStyle(status: string): React.CSSProperties {
  if (status === 'Fully Paid') return { background: 'var(--color-ok-bg)', color: 'var(--color-ok)' };
  if (status === 'Partial') return { background: '#fef3cd', color: '#c59a1a' };
  return { background: 'var(--color-er-bg)', color: 'var(--color-er)' };
}

export default function PaymentsPage() {
  const [labs, setLabs] = useState<Lab[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<PaymentStatus>('All');

  useEffect(() => {
    if (IS_PREVIEW) {
      setLabs(MOCK_LABS);
      setLoading(false);
      return;
    }
    async function fetchData() {
      const supabase = createClient();
      const { data } = await supabase.from('labs').select('*').order('id');
      if (data) setLabs(data);
      setLoading(false);
    }
    fetchData();
  }, []);

  const labsWithStatus = useMemo(() => {
    return labs.map(l => ({
      ...l,
      outstanding: l.sanctioned_payment - l.payment_received,
      status: getPaymentStatus(l),
    }));
  }, [labs]);

  const filtered = useMemo(() => {
    if (statusFilter === 'All') return labsWithStatus;
    return labsWithStatus.filter(l => l.status === statusFilter);
  }, [labsWithStatus, statusFilter]);

  const summary = useMemo(() => {
    return labs.reduce(
      (acc, l) => ({
        sanctioned: acc.sanctioned + l.sanctioned_payment,
        received: acc.received + l.payment_received,
        outstanding: acc.outstanding + (l.sanctioned_payment - l.payment_received),
        billing: acc.billing + l.billing_amount,
      }),
      { sanctioned: 0, received: 0, outstanding: 0, billing: 0 }
    );
  }, [labs]);

  function handleExport() {
    const headers = ['S.N', 'Lab Code', 'District', 'Block', 'Company', 'Sanctioned Payment', 'Billing Amount', 'Payment Received', 'Outstanding', 'Status'];
    const rows = filtered.map((l, i) => [
      i + 1, l.lab_code, l.district, l.block, l.company_name,
      l.sanctioned_payment, l.billing_amount, l.payment_received, l.outstanding, l.status,
    ]);
    exportToCsv('payment_tracker_report', headers, rows);
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-g4" /></div>;
  }

  const selectStyle: React.CSSProperties = {
    border: '1.5px solid var(--color-bd2)', background: '#fff', color: 'var(--color-tx)',
    fontFamily: "'Nunito', sans-serif", fontSize: '12.5px', fontWeight: 600,
    padding: '5px 10px', borderRadius: '8px', outline: 'none', cursor: 'pointer',
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="sec-label" style={{ marginBottom: 0 }}>Payment Tracker</div>
        <div className="flex items-center gap-2 flex-wrap">
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as PaymentStatus)} style={selectStyle}>
            <option value="All">All Status</option>
            <option value="Fully Paid">Fully Paid</option>
            <option value="Partial">Partial</option>
            <option value="Pending">Pending</option>
          </select>
          <button onClick={handleExport} style={exportButtonStyle}>Export CSV</button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(170px,1fr))] gap-2.5">
        <div className="mcard">
          <div className="mcard-label">Total Sanctioned</div>
          <div className="mcard-value mn" style={{ color: 'var(--color-g1)' }}>{summary.sanctioned.toLocaleString('en-IN')}</div>
        </div>
        <div className="mcard">
          <div className="mcard-label">Total Received</div>
          <div className="mcard-value mn" style={{ color: 'var(--color-ok)' }}>{summary.received.toLocaleString('en-IN')}</div>
        </div>
        <div className="mcard">
          <div className="mcard-label">Total Outstanding</div>
          <div className="mcard-value mn" style={{ color: 'var(--color-er)' }}>{summary.outstanding.toLocaleString('en-IN')}</div>
        </div>
        <div className="mcard">
          <div className="mcard-label">Total Billing Amount</div>
          <div className="mcard-value mn" style={{ color: 'var(--color-earth)' }}>{summary.billing.toLocaleString('en-IN')}</div>
        </div>
      </div>

      {/* Table */}
      <div className="theme-table-wrap">
        <table className="min-w-full" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--color-g8)' }}>
              <th style={thStyle}>S.N</th>
              <th style={thStyle}>Lab Code</th>
              <th style={thStyle}>District</th>
              <th style={thStyle}>Block</th>
              <th style={thStyle}>Company</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Sanctioned Pmt</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Billing Amt</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Payment Rcvd</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Outstanding</th>
              <th style={{ ...thStyle, textAlign: 'center' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((l, i) => (
              <tr
                key={l.id}
                style={{ borderBottom: '1px solid rgba(61,107,48,0.06)' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-g8)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
              >
                <td style={tdStyle} className="mn">{i + 1}</td>
                <td style={{ ...tdStyle, fontWeight: 700, color: 'var(--color-g1)' }}>{l.lab_code}</td>
                <td style={tdStyle}>{l.district}</td>
                <td style={tdStyle}>{l.block}</td>
                <td style={tdStyle}>{l.company_name}</td>
                <td style={{ ...tdStyle, textAlign: 'right' }} className="mn">{l.sanctioned_payment.toLocaleString('en-IN')}</td>
                <td style={{ ...tdStyle, textAlign: 'right' }} className="mn">{l.billing_amount.toLocaleString('en-IN')}</td>
                <td style={{ ...tdStyle, textAlign: 'right' }} className="mn">{l.payment_received.toLocaleString('en-IN')}</td>
                <td style={{ ...tdStyle, textAlign: 'right' }} className="mn">{l.outstanding.toLocaleString('en-IN')}</td>
                <td style={{ ...tdStyle, textAlign: 'center' }}>
                  <span className="pill" style={{ ...statusBadgeStyle(l.status), fontWeight: 700, fontSize: '10.5px' }}>
                    {l.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
