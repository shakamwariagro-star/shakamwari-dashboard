'use client';

import { useEffect, useState, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import { MOCK_LABS, IS_PREVIEW } from '@/lib/mockData';
import { exportToCsv, exportButtonStyle } from '@/lib/exportCsv';
import type { Lab } from '@/lib/types';

const STAGES = ['Hand Over Samples', 'Sample Tested', 'SHC Printed', 'SHC Handover'] as const;
const STAGE_KEYS: (keyof Lab)[] = ['hand_over_samples', 'sample_tested', 'shc_printed', 'shc_handover'];

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

function dropOffPct(current: number, previous: number): number {
  if (previous <= 0) return 0;
  return ((previous - current) / previous) * 100;
}

function dropOffColor(pct: number): string {
  // If drop-off > 30% (i.e., retention < 70%), show red
  return pct > 30 ? 'var(--color-er)' : 'var(--color-ok)';
}

export default function PipelinePage() {
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

  const stageTotals = useMemo(() => {
    return STAGE_KEYS.map(key =>
      labs.reduce((sum, l) => sum + (l[key] as number), 0)
    );
  }, [labs]);

  const maxStageTotal = Math.max(...stageTotals, 1);

  function handleExport() {
    const headers = [
      'S.N', 'Lab Code', 'District',
      'Hand Over Samples', 'Sample Tested', 'SHC Printed', 'SHC Handover',
      'Drop-off: Received>Tested %', 'Drop-off: Tested>Printed %', 'Drop-off: Printed>Handover %',
    ];
    const rows = labs.map((l, i) => {
      const vals = STAGE_KEYS.map(k => l[k] as number);
      return [
        i + 1, l.lab_code, l.district,
        vals[0], vals[1], vals[2], vals[3],
        vals[0] > 0 ? dropOffPct(vals[1], vals[0]).toFixed(1) : '-',
        vals[1] > 0 ? dropOffPct(vals[2], vals[1]).toFixed(1) : '-',
        vals[2] > 0 ? dropOffPct(vals[3], vals[2]).toFixed(1) : '-',
      ];
    });
    exportToCsv('sample_pipeline_report', headers, rows);
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-g4" /></div>;
  }

  const stageColors = ['var(--color-earth)', 'var(--color-g1)', 'var(--color-ok)', '#6a8f5e'];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="sec-label" style={{ marginBottom: 0 }}>Sample Pipeline Tracker</div>
        <button onClick={handleExport} style={exportButtonStyle}>Export CSV</button>
      </div>

      {/* Pipeline summary - funnel visualization */}
      <div className="mcard" style={{ padding: '20px' }}>
        <div className="text-[11px] font-bold mb-3" style={{ color: 'var(--color-tx-d)', fontFamily: "'Fira Mono', monospace", textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Pipeline Overview (All Labs)
        </div>
        <div className="space-y-3">
          {STAGES.map((stage, idx) => {
            const value = stageTotals[idx];
            const widthPct = maxStageTotal > 0 ? (value / maxStageTotal) * 100 : 0;
            const drop = idx > 0 && stageTotals[idx - 1] > 0
              ? dropOffPct(value, stageTotals[idx - 1])
              : null;
            return (
              <div key={stage}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-semibold" style={{ color: 'var(--color-tx)' }}>{stage}</span>
                  <span className="text-[11px] mn font-bold" style={{ color: stageColors[idx] }}>
                    {value.toLocaleString('en-IN')}
                    {drop !== null && (
                      <span style={{ color: dropOffColor(drop), marginLeft: '8px', fontSize: '10px' }}>
                        ({drop > 0 ? '-' : ''}{drop.toFixed(1)}% drop)
                      </span>
                    )}
                  </span>
                </div>
                <div style={{ background: 'var(--color-g8)', borderRadius: '6px', height: '12px', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${Math.max(widthPct, 1)}%`,
                      height: '100%',
                      borderRadius: '6px',
                      background: stageColors[idx],
                      transition: 'width 0.4s ease',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Per-lab pipeline bars */}
      <div className="sec-label" style={{ fontSize: '11px' }}>Per-Lab Pipeline</div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {labs.map(l => {
          const vals = STAGE_KEYS.map(k => l[k] as number);
          const labMax = Math.max(...vals, 1);
          return (
            <div
              key={l.id}
              style={{
                background: 'var(--color-parch)',
                border: '1.5px solid var(--color-bd)',
                borderRadius: '12px',
                padding: '12px 14px',
              }}
            >
              <div className="text-[12px] font-extrabold mb-0.5" style={{ color: 'var(--color-g1)' }}>{l.lab_code}</div>
              <div className="text-[10px] mb-2" style={{ color: 'var(--color-tx-f)', fontFamily: "'Fira Mono', monospace" }}>
                {l.district} &middot; {l.block}
              </div>
              <div className="space-y-1.5">
                {STAGES.map((stage, idx) => {
                  const val = vals[idx];
                  const w = labMax > 0 ? (val / labMax) * 100 : 0;
                  const hasDropOff = idx > 0 && vals[idx - 1] > 0 && dropOffPct(val, vals[idx - 1]) > 30;
                  return (
                    <div key={stage} className="flex items-center gap-2">
                      <span className="text-[9px] w-[60px] shrink-0 text-right" style={{ color: 'var(--color-tx-f)', fontFamily: "'Fira Mono', monospace" }}>
                        {stage.split(' ').pop()}
                      </span>
                      <div style={{ flex: 1, background: 'var(--color-g8)', borderRadius: '4px', height: '7px', overflow: 'hidden' }}>
                        <div style={{
                          width: `${Math.max(w, val > 0 ? 2 : 0)}%`,
                          height: '100%',
                          borderRadius: '4px',
                          background: hasDropOff ? 'var(--color-er)' : stageColors[idx],
                          transition: 'width 0.3s ease',
                        }} />
                      </div>
                      <span className="text-[9px] mn w-[32px] shrink-0" style={{ color: hasDropOff ? 'var(--color-er)' : 'var(--color-tx-f)' }}>
                        {val.toLocaleString('en-IN')}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Table */}
      <div className="theme-table-wrap">
        <table className="min-w-full" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--color-g8)' }}>
              <th style={thStyle}>S.N</th>
              <th style={thStyle}>Lab Code</th>
              <th style={thStyle}>District</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Hand Over</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Tested</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>SHC Printed</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>SHC Handover</th>
              <th style={{ ...thStyle, textAlign: 'center' }}>Drop: Rcvd&gt;Test</th>
              <th style={{ ...thStyle, textAlign: 'center' }}>Drop: Test&gt;Print</th>
              <th style={{ ...thStyle, textAlign: 'center' }}>Drop: Print&gt;Hand</th>
            </tr>
          </thead>
          <tbody>
            {labs.map((l, i) => {
              const vals = STAGE_KEYS.map(k => l[k] as number);
              const drops = [
                vals[0] > 0 ? dropOffPct(vals[1], vals[0]) : null,
                vals[1] > 0 ? dropOffPct(vals[2], vals[1]) : null,
                vals[2] > 0 ? dropOffPct(vals[3], vals[2]) : null,
              ];
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
                  <td style={{ ...tdStyle, textAlign: 'right' }} className="mn">{vals[0].toLocaleString('en-IN')}</td>
                  <td style={{ ...tdStyle, textAlign: 'right' }} className="mn">{vals[1].toLocaleString('en-IN')}</td>
                  <td style={{ ...tdStyle, textAlign: 'right' }} className="mn">{vals[2].toLocaleString('en-IN')}</td>
                  <td style={{ ...tdStyle, textAlign: 'right' }} className="mn">{vals[3].toLocaleString('en-IN')}</td>
                  {drops.map((d, di) => (
                    <td key={di} style={{ ...tdStyle, textAlign: 'center' }}>
                      {d !== null ? (
                        <span className="pill mn" style={{
                          background: d > 30 ? 'var(--color-er-bg)' : 'var(--color-ok-bg)',
                          color: dropOffColor(d),
                          fontWeight: 700, fontSize: '10.5px',
                        }}>
                          {d.toFixed(1)}%
                        </span>
                      ) : (
                        <span style={{ color: 'var(--color-tx-f)', fontSize: '11px' }}>-</span>
                      )}
                    </td>
                  ))}
                </tr>
              );
            })}
            {/* Summary row */}
            <tr style={{ background: 'var(--color-g8)', fontWeight: 700 }}>
              <td style={{ ...tdStyle, fontFamily: "'Fira Mono', monospace", fontSize: '10px' }} colSpan={3}>TOTAL</td>
              {stageTotals.map((val, idx) => (
                <td key={idx} style={{ ...tdStyle, textAlign: 'right' }} className="mn">{val.toLocaleString('en-IN')}</td>
              ))}
              {[0, 1, 2].map(di => {
                const d = stageTotals[di] > 0 ? dropOffPct(stageTotals[di + 1], stageTotals[di]) : null;
                return (
                  <td key={di} style={{ ...tdStyle, textAlign: 'center' }}>
                    {d !== null ? (
                      <span className="pill mn" style={{
                        background: d > 30 ? 'var(--color-er-bg)' : 'var(--color-ok-bg)',
                        color: dropOffColor(d),
                        fontWeight: 700, fontSize: '10.5px',
                      }}>
                        {d.toFixed(1)}%
                      </span>
                    ) : (
                      <span style={{ color: 'var(--color-tx-f)', fontSize: '11px' }}>-</span>
                    )}
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
