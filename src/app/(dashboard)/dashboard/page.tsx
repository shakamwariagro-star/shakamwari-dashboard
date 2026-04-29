'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { MOCK_LABS, IS_PREVIEW } from '@/lib/mockData';
import SummaryTable from '@/components/dashboard/SummaryTable';
import SummaryCharts from '@/components/dashboard/SummaryCharts';
import type { Lab } from '@/lib/types';

export default function DashboardPage() {
  const [labs, setLabs] = useState<Lab[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (IS_PREVIEW) {
      setLabs(MOCK_LABS);
      setLoading(false);
      return;
    }
    async function fetchLabs() {
      const supabase = createClient();
      const { data } = await supabase.from('labs').select('*').order('id');
      if (data) setLabs(data);
      setLoading(false);
    }
    fetchLabs();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-g4" />
      </div>
    );
  }

  // Search filter
  const query = search.toLowerCase().trim();
  const filteredLabs = query
    ? labs.filter(l =>
        l.district.toLowerCase().includes(query) ||
        l.block.toLowerCase().includes(query) ||
        l.lab_code.toLowerCase().includes(query) ||
        l.company_name.toLowerCase().includes(query) ||
        l.coordinator.toLowerCase().includes(query)
      )
    : labs;

  const totalTarget = labs.reduce((s, l) => s + l.target, 0);
  const totalTested = labs.reduce((s, l) => s + l.sample_tested, 0);
  const totalPayment = labs.reduce((s, l) => s + l.sanctioned_payment, 0);
  const totalReceived = labs.reduce((s, l) => s + l.payment_received, 0);
  const totalExpenses = labs.reduce((s, l) => s + l.expenses_total, 0);
  const formatNum = (n: number) => n.toLocaleString('en-IN');

  const metrics = [
    { label: 'Total Labs', value: labs.length.toString(), color: '' },
    { label: 'Total Target', value: formatNum(totalTarget), sub: `${formatNum(totalTested)} tested`, color: '' },
    { label: 'Sanctioned Target', value: formatNum(labs.reduce((s, l) => s + l.sanctioned_target, 0)), color: '' },
    { label: 'Remaining Target', value: formatNum(totalTarget - labs.reduce((s, l) => s + l.sanctioned_target, 0)), color: 'var(--color-earth)' },
    { label: 'Sample Tested', value: formatNum(totalTested), color: 'var(--color-ok)' },
    { label: 'SHC Printed', value: formatNum(labs.reduce((s, l) => s + l.shc_printed, 0)), color: '' },
    { label: 'Payment Sanctioned', value: formatNum(totalPayment), color: '' },
    { label: 'Payment Received', value: formatNum(totalReceived), sub: `of ${formatNum(totalPayment)}`, color: 'var(--color-ok)' },
    { label: 'Remaining Payment', value: formatNum(totalPayment - totalReceived), color: 'var(--color-er)' },
    { label: 'Total Expenses', value: formatNum(totalExpenses), color: 'var(--color-earth)' },
    { label: 'Billing Amount', value: formatNum(labs.reduce((s, l) => s + l.billing_amount, 0)), color: '' },
  ];

  return (
    <div className="space-y-5">
      {IS_PREVIEW && (
        <div className="rounded-lg px-4 py-3 text-sm" style={{ background: 'var(--color-ok-bg)', border: '1.5px solid rgba(45,110,31,0.2)', color: 'var(--color-ok)' }}>
          Preview Mode — Showing sample data. Connect Supabase to enable live data and authentication.
        </div>
      )}

      {/* Search Bar */}
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by district, block, lab code, company, or coordinator..."
            className="w-full"
            style={{
              border: '1.5px solid var(--color-bd2)',
              borderRadius: '12px',
              padding: '10px 14px 10px 38px',
              fontSize: '13px',
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 500,
              background: '#fff',
              color: 'var(--color-tx)',
              outline: 'none',
            }}
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ opacity: 0.4 }}>🔍</span>
        </div>
        {search && (
          <span className="text-[11px] mn font-bold" style={{ color: 'var(--color-tx-f)' }}>
            {filteredLabs.length} of {labs.length} labs
          </span>
        )}
      </div>

      {/* Section: Overall Summary */}
      <div className="sec-label">Overall Summary</div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-2.5">
        {metrics.map((m) => (
          <div key={m.label} className="mcard">
            <div className="mcard-label">{m.label}</div>
            <div className="mcard-value" style={m.color ? { color: m.color } : undefined}>
              {m.value}
            </div>
            {m.sub && <div className="mcard-sub">{m.sub}</div>}
          </div>
        ))}
      </div>

      {/* Section: Master Data */}
      <div className="sec-label">Master Data</div>
      <SummaryTable labs={filteredLabs} />

      {/* Section: Charts */}
      <div className="sec-label">Visual Overview</div>
      <SummaryCharts labs={filteredLabs} />
    </div>
  );
}
