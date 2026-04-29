'use client';

import { useEffect, useState, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import { MOCK_LABS, IS_PREVIEW } from '@/lib/mockData';
import { exportToCsv, exportButtonStyle } from '@/lib/exportCsv';
import type { Lab } from '@/lib/types';

const COMPANIES = ['All', 'SRH', 'Radhika', 'Porsa'];
const COORDINATORS = ['All', 'Nitin Tomar', 'Akshay Tiwari', 'Kuldeep Singh', 'Shubham Raghuwanshi', 'Abhishek Raghuwanshi'];

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

function achievementColor(pct: number): string {
  if (pct > 80) return 'var(--color-ok)';
  if (pct >= 50) return '#c59a1a';
  return 'var(--color-er)';
}

function achievementBg(pct: number): string {
  if (pct > 80) return 'var(--color-ok-bg)';
  if (pct >= 50) return '#fef3cd';
  return 'var(--color-er-bg)';
}

export default function TargetAchievementPage() {
  const [labs, setLabs] = useState<Lab[]>([]);
  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState('All');
  const [coordinator, setCoordinator] = useState('All');

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

  const filtered = useMemo(() => {
    return labs.filter(l => {
      if (company !== 'All' && l.company_name !== company) return false;
      if (coordinator !== 'All' && l.coordinator !== coordinator) return false;
      return true;
    });
  }, [labs, company, coordinator]);

  const totals = useMemo(() => {
    return filtered.reduce(
      (acc, l) => ({
        target: acc.target + l.target,
        sanctioned: acc.sanctioned + l.sanctioned_target,
        tested: acc.tested + l.sample_tested,
        printed: acc.printed + l.shc_printed,
      }),
      { target: 0, sanctioned: 0, tested: 0, printed: 0 }
    );
  }, [filtered]);

  const totalPct = totals.target > 0 ? (totals.tested / totals.target) * 100 : 0;

  function handleExport() {
    const headers = ['S.N', 'Lab Code', 'District', 'Block', 'Company', 'Coordinator', 'Target', 'Sanctioned', 'Tested', 'SHC Printed', 'Achievement %'];
    const rows = filtered.map((l, i) => {
      const pct = l.target > 0 ? ((l.sample_tested / l.target) * 100).toFixed(1) : '0.0';
      return [i + 1, l.lab_code, l.district, l.block, l.company_name, l.coordinator, l.target, l.sanctioned_target, l.sample_tested, l.shc_printed, pct];
    });
    rows.push(['', '', '', '', '', 'TOTAL', totals.target, totals.sanctioned, totals.tested, totals.printed, totalPct.toFixed(1)]);
    exportToCsv('target_achievement_report', headers, rows);
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
        <div className="sec-label" style={{ marginBottom: 0 }}>Target vs Achievement Report</div>
        <div className="flex items-center gap-2 flex-wrap">
          <select value={company} onChange={e => setCompany(e.target.value)} style={selectStyle}>
            {COMPANIES.map(c => <option key={c} value={c}>{c === 'All' ? 'All Companies' : c}</option>)}
          </select>
          <select value={coordinator} onChange={e => setCoordinator(e.target.value)} style={selectStyle}>
            {COORDINATORS.map(c => <option key={c} value={c}>{c === 'All' ? 'All Coordinators' : c}</option>)}
          </select>
          <button onClick={handleExport} style={exportButtonStyle}>Export CSV</button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-2.5">
        <div className="mcard">
          <div className="mcard-label">Total Target</div>
          <div className="mcard-value mn">{totals.target.toLocaleString('en-IN')}</div>
        </div>
        <div className="mcard">
          <div className="mcard-label">Sanctioned</div>
          <div className="mcard-value mn" style={{ color: 'var(--color-earth)' }}>{totals.sanctioned.toLocaleString('en-IN')}</div>
        </div>
        <div className="mcard">
          <div className="mcard-label">Tested</div>
          <div className="mcard-value mn" style={{ color: 'var(--color-ok)' }}>{totals.tested.toLocaleString('en-IN')}</div>
        </div>
        <div className="mcard">
          <div className="mcard-label">SHC Printed</div>
          <div className="mcard-value mn" style={{ color: 'var(--color-g1)' }}>{totals.printed.toLocaleString('en-IN')}</div>
        </div>
        <div className="mcard">
          <div className="mcard-label">Achievement</div>
          <div className="mcard-value mn" style={{ color: achievementColor(totalPct) }}>{totalPct.toFixed(1)}%</div>
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
              <th style={thStyle}>Coordinator</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Target</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Sanctioned</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Tested</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>SHC Printed</th>
              <th style={{ ...thStyle, textAlign: 'center' }}>Achievement %</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((l, i) => {
              const pct = l.target > 0 ? (l.sample_tested / l.target) * 100 : 0;
              return (
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
                  <td style={tdStyle}>{l.coordinator}</td>
                  <td style={{ ...tdStyle, textAlign: 'right' }} className="mn">{l.target.toLocaleString('en-IN')}</td>
                  <td style={{ ...tdStyle, textAlign: 'right' }} className="mn">{l.sanctioned_target.toLocaleString('en-IN')}</td>
                  <td style={{ ...tdStyle, textAlign: 'right' }} className="mn">{l.sample_tested.toLocaleString('en-IN')}</td>
                  <td style={{ ...tdStyle, textAlign: 'right' }} className="mn">{l.shc_printed.toLocaleString('en-IN')}</td>
                  <td style={{ ...tdStyle, textAlign: 'center' }}>
                    <span
                      className="pill mn"
                      style={{
                        background: achievementBg(pct),
                        color: achievementColor(pct),
                        fontWeight: 700,
                        fontSize: '11px',
                      }}
                    >
                      {pct.toFixed(1)}%
                    </span>
                  </td>
                </tr>
              );
            })}
            {/* Totals row */}
            <tr style={{ background: 'var(--color-g8)', fontWeight: 700 }}>
              <td style={{ ...tdStyle, fontFamily: "'Fira Mono', monospace", fontSize: '11px' }} colSpan={6}>TOTAL ({filtered.length} labs)</td>
              <td style={{ ...tdStyle, textAlign: 'right' }} className="mn">{totals.target.toLocaleString('en-IN')}</td>
              <td style={{ ...tdStyle, textAlign: 'right' }} className="mn">{totals.sanctioned.toLocaleString('en-IN')}</td>
              <td style={{ ...tdStyle, textAlign: 'right' }} className="mn">{totals.tested.toLocaleString('en-IN')}</td>
              <td style={{ ...tdStyle, textAlign: 'right' }} className="mn">{totals.printed.toLocaleString('en-IN')}</td>
              <td style={{ ...tdStyle, textAlign: 'center' }}>
                <span className="pill mn" style={{ background: achievementBg(totalPct), color: achievementColor(totalPct), fontWeight: 700, fontSize: '11px' }}>
                  {totalPct.toFixed(1)}%
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
