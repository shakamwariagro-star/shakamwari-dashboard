'use client';

import { Fragment, useEffect, useState, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import { MOCK_LABS, IS_PREVIEW } from '@/lib/mockData';
import { exportToCsv, exportButtonStyle } from '@/lib/exportCsv';
import type { Lab } from '@/lib/types';

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

interface CoordinatorSummary {
  name: string;
  labs: Lab[];
  labCount: number;
  totalTarget: number;
  totalTested: number;
  totalSanctionedPayment: number;
  totalPaymentReceived: number;
  totalExpenses: number;
  achievementPct: number;
}

export default function CoordinatorsPage() {
  const [labs, setLabs] = useState<Lab[]>([]);
  const [loading, setLoading] = useState(true);

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

  const coordinators = useMemo((): CoordinatorSummary[] => {
    const grouped = new Map<string, Lab[]>();
    labs.forEach(l => {
      const existing = grouped.get(l.coordinator) || [];
      existing.push(l);
      grouped.set(l.coordinator, existing);
    });

    return Array.from(grouped.entries()).map(([name, coordLabs]) => {
      const totalTarget = coordLabs.reduce((s, l) => s + l.target, 0);
      const totalTested = coordLabs.reduce((s, l) => s + l.sample_tested, 0);
      return {
        name,
        labs: coordLabs,
        labCount: coordLabs.length,
        totalTarget,
        totalTested,
        totalSanctionedPayment: coordLabs.reduce((s, l) => s + l.sanctioned_payment, 0),
        totalPaymentReceived: coordLabs.reduce((s, l) => s + l.payment_received, 0),
        totalExpenses: coordLabs.reduce((s, l) => s + l.expenses_total, 0),
        achievementPct: totalTarget > 0 ? (totalTested / totalTarget) * 100 : 0,
      };
    });
  }, [labs]);

  function handleExport() {
    const headers = ['Coordinator', 'Lab Code', 'District', 'Block', 'Company', 'Target', 'Tested', 'Sanctioned Payment', 'Payment Received', 'Expenses'];
    const rows: (string | number)[][] = [];
    coordinators.forEach(c => {
      c.labs.forEach(l => {
        rows.push([c.name, l.lab_code, l.district, l.block, l.company_name, l.target, l.sample_tested, l.sanctioned_payment, l.payment_received, l.expenses_total]);
      });
    });
    exportToCsv('coordinator_summary_report', headers, rows);
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-g4" /></div>;
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="sec-label" style={{ marginBottom: 0 }}>Coordinator-wise Summary</div>
        <button onClick={handleExport} style={exportButtonStyle}>Export CSV</button>
      </div>

      {/* Coordinator Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {coordinators.map(c => (
          <div
            key={c.name}
            className="theme-card"
            style={{
              background: 'var(--color-parch)',
              border: '1.5px solid var(--color-bd)',
              borderRadius: '14px',
              padding: '16px',
              boxShadow: 'var(--shadow-card)',
            }}
          >
            <div className="text-sm font-extrabold mb-1" style={{ color: 'var(--color-g1)' }}>{c.name}</div>
            <div className="text-[11px] mb-3" style={{ color: 'var(--color-tx-f)', fontFamily: "'Fira Mono', monospace" }}>
              {c.labCount} labs
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] mb-3">
              <div>
                <span style={{ color: 'var(--color-tx-f)' }}>Target: </span>
                <span className="mn font-bold" style={{ color: 'var(--color-tx)' }}>{c.totalTarget.toLocaleString('en-IN')}</span>
              </div>
              <div>
                <span style={{ color: 'var(--color-tx-f)' }}>Tested: </span>
                <span className="mn font-bold" style={{ color: 'var(--color-ok)' }}>{c.totalTested.toLocaleString('en-IN')}</span>
              </div>
              <div>
                <span style={{ color: 'var(--color-tx-f)' }}>Sanctioned: </span>
                <span className="mn font-bold" style={{ color: 'var(--color-tx)' }}>{c.totalSanctionedPayment.toLocaleString('en-IN')}</span>
              </div>
              <div>
                <span style={{ color: 'var(--color-tx-f)' }}>Received: </span>
                <span className="mn font-bold" style={{ color: 'var(--color-ok)' }}>{c.totalPaymentReceived.toLocaleString('en-IN')}</span>
              </div>
              <div>
                <span style={{ color: 'var(--color-tx-f)' }}>Expenses: </span>
                <span className="mn font-bold" style={{ color: 'var(--color-er)' }}>{c.totalExpenses.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Achievement bar */}
            <div style={{ background: 'var(--color-g8)', borderRadius: '6px', height: '8px', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${Math.min(c.achievementPct, 100)}%`,
                  height: '100%',
                  borderRadius: '6px',
                  background: c.achievementPct > 80 ? 'var(--color-ok)' : c.achievementPct >= 50 ? '#c59a1a' : 'var(--color-er)',
                  transition: 'width 0.4s ease',
                }}
              />
            </div>
            <div className="text-[10px] mt-1 font-bold mn" style={{ color: c.achievementPct > 80 ? 'var(--color-ok)' : c.achievementPct >= 50 ? '#c59a1a' : 'var(--color-er)' }}>
              {c.achievementPct.toFixed(1)}% achievement
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Table grouped by coordinator */}
      <div className="theme-table-wrap">
        <table className="min-w-full" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--color-g8)' }}>
              <th style={thStyle}>S.N</th>
              <th style={thStyle}>Lab Code</th>
              <th style={thStyle}>District</th>
              <th style={thStyle}>Block</th>
              <th style={thStyle}>Company</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Target</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Tested</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Sanctioned Pmt</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Payment Rcvd</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Expenses</th>
            </tr>
          </thead>
          <tbody>
            {coordinators.map(c => {
              let sn = 0;
              return (
                <Fragment key={c.name}>
                  {/* Group header */}
                  <tr style={{ background: 'rgba(61,107,48,0.08)' }}>
                    <td
                      colSpan={10}
                      style={{
                        padding: '10px 12px', fontSize: '12px', fontWeight: 800,
                        color: 'var(--color-g1)', fontFamily: "'Nunito', sans-serif",
                        borderBottom: '1.5px solid var(--color-bd2)',
                      }}
                    >
                      {c.name} ({c.labCount} labs)
                    </td>
                  </tr>
                  {c.labs.map(l => {
                    sn++;
                    return (
                      <tr
                        key={l.id}
                        style={{ borderBottom: '1px solid rgba(61,107,48,0.06)' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-g8)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                      >
                        <td style={tdStyle} className="mn">{sn}</td>
                        <td style={{ ...tdStyle, fontWeight: 700, color: 'var(--color-g1)' }}>{l.lab_code}</td>
                        <td style={tdStyle}>{l.district}</td>
                        <td style={tdStyle}>{l.block}</td>
                        <td style={tdStyle}>{l.company_name}</td>
                        <td style={{ ...tdStyle, textAlign: 'right' }} className="mn">{l.target.toLocaleString('en-IN')}</td>
                        <td style={{ ...tdStyle, textAlign: 'right' }} className="mn">{l.sample_tested.toLocaleString('en-IN')}</td>
                        <td style={{ ...tdStyle, textAlign: 'right' }} className="mn">{l.sanctioned_payment.toLocaleString('en-IN')}</td>
                        <td style={{ ...tdStyle, textAlign: 'right' }} className="mn">{l.payment_received.toLocaleString('en-IN')}</td>
                        <td style={{ ...tdStyle, textAlign: 'right' }} className="mn">{l.expenses_total.toLocaleString('en-IN')}</td>
                      </tr>
                    );
                  })}
                  {/* Coordinator subtotal */}
                  <tr style={{ background: 'var(--color-g8)', fontWeight: 700 }}>
                    <td style={{ ...tdStyle, fontFamily: "'Fira Mono', monospace", fontSize: '10px' }} colSpan={5}>SUBTOTAL</td>
                    <td style={{ ...tdStyle, textAlign: 'right' }} className="mn">{c.totalTarget.toLocaleString('en-IN')}</td>
                    <td style={{ ...tdStyle, textAlign: 'right' }} className="mn">{c.totalTested.toLocaleString('en-IN')}</td>
                    <td style={{ ...tdStyle, textAlign: 'right' }} className="mn">{c.totalSanctionedPayment.toLocaleString('en-IN')}</td>
                    <td style={{ ...tdStyle, textAlign: 'right' }} className="mn">{c.totalPaymentReceived.toLocaleString('en-IN')}</td>
                    <td style={{ ...tdStyle, textAlign: 'right' }} className="mn">{c.totalExpenses.toLocaleString('en-IN')}</td>
                  </tr>
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

