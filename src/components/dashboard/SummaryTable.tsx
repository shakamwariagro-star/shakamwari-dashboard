'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Lab } from '@/lib/types';
import { exportToCsv, exportButtonStyle } from '@/lib/exportCsv';

type SortKey = 'district' | 'block' | 'company_name' | 'coordinator' | 'target' | 'sanctioned_target' | 'sample_tested' | 'shc_printed' | 'billing_amount' | 'payment_received' | 'expenses_total';

const COLUMNS: { key: SortKey | 'sn' | 'rem_target' | 'rem_payment'; label: string; align: 'left' | 'right' }[] = [
  { key: 'sn', label: 'S.N', align: 'left' },
  { key: 'district', label: 'Dist', align: 'left' },
  { key: 'block', label: 'Block', align: 'left' },
  { key: 'company_name', label: 'Company', align: 'left' },
  { key: 'coordinator', label: 'Coordinator', align: 'left' },
  { key: 'target', label: 'Target', align: 'right' },
  { key: 'sanctioned_target', label: 'Sanctioned', align: 'right' },
  { key: 'rem_target', label: 'Rem. Target', align: 'right' },
  { key: 'sample_tested', label: 'Tested', align: 'right' },
  { key: 'shc_printed', label: 'SHC Printed', align: 'right' },
  { key: 'billing_amount', label: 'Billing Amt', align: 'right' },
  { key: 'payment_received', label: 'Payment Rcvd', align: 'right' },
  { key: 'rem_payment', label: 'Rem. Payment', align: 'right' },
  { key: 'expenses_total', label: 'Expenses', align: 'right' },
];

export default function SummaryTable({ labs }: { labs: Lab[] }) {
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortAsc, setSortAsc] = useState(true);
  const formatNum = (n: number) => n.toLocaleString('en-IN');

  const handleSort = (key: string) => {
    if (key === 'sn' || key === 'rem_target' || key === 'rem_payment') return;
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key as SortKey);
      setSortAsc(true);
    }
  };

  const sortedLabs = [...labs].sort((a, b) => {
    if (!sortKey) return 0;
    const aVal = (a as any)[sortKey];
    const bVal = (b as any)[sortKey];
    if (typeof aVal === 'string') return sortAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    return sortAsc ? aVal - bVal : bVal - aVal;
  });

  const handleExport = () => {
    const headers = ['S.N', 'District', 'Block', 'Company', 'Coordinator', 'Target', 'Sanctioned', 'Rem Target', 'Tested', 'SHC Printed', 'Billing Amt', 'Payment Rcvd', 'Rem Payment', 'Expenses'];
    const rows = sortedLabs.map((lab, i) => [
      i + 1, lab.district, lab.block, lab.company_name, lab.coordinator,
      lab.target, lab.sanctioned_target, lab.target - lab.sanctioned_target,
      lab.sample_tested, lab.shc_printed, lab.billing_amount,
      lab.payment_received, lab.sanctioned_payment - lab.payment_received, lab.expenses_total,
    ]);
    exportToCsv('shakamwari_master_data', headers, rows);
  };

  return (
    <div>
      <div className="flex justify-end mb-2">
        <button onClick={handleExport} style={exportButtonStyle}>Export CSV</button>
      </div>
      <div className="theme-table-wrap">
        <table className="min-w-full" style={{ borderCollapse: 'collapse', fontSize: '12.5px' }}>
          <thead>
            <tr style={{ background: 'var(--color-g8)' }}>
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  className="px-3 py-2.5 whitespace-nowrap select-none"
                  style={{
                    textAlign: col.align,
                    fontSize: '10px', fontWeight: 700, color: 'var(--color-tx-d)',
                    textTransform: 'uppercase', letterSpacing: '0.04em',
                    fontFamily: "'Fira Mono', monospace",
                    borderBottom: '1.5px solid var(--color-bd2)',
                    cursor: col.key !== 'sn' && col.key !== 'rem_target' && col.key !== 'rem_payment' ? 'pointer' : 'default',
                  }}
                  onClick={() => handleSort(col.key)}
                >
                  {col.label}
                  {sortKey === col.key && <span className="ml-1">{sortAsc ? '▲' : '▼'}</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedLabs.map((lab, i) => (
              <tr
                key={lab.id}
                className="transition-colors cursor-pointer"
                style={{ borderBottom: i < labs.length - 1 ? '1px solid rgba(61,107,48,0.06)' : 'none' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-g8)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
              >
                <td className="px-3 py-2.5 mn" style={{ color: 'var(--color-tx-d)' }}>{i + 1}</td>
                <td className="px-3 py-2.5 text-sm font-semibold">
                  <Link href={`/labs/${lab.id}`} className="hover:underline" style={{ color: 'var(--color-g3)' }}>{lab.district}</Link>
                </td>
                <td className="px-3 py-2.5 text-sm" style={{ color: 'var(--color-tx)' }}>{lab.block}</td>
                <td className="px-3 py-2.5 text-sm" style={{ color: 'var(--color-tx)' }}>{lab.company_name}</td>
                <td className="px-3 py-2.5 text-sm" style={{ color: 'var(--color-tx)' }}>{lab.coordinator}</td>
                <td className="px-3 py-2.5 text-right mn">{formatNum(lab.target)}</td>
                <td className="px-3 py-2.5 text-right mn">{formatNum(lab.sanctioned_target)}</td>
                <td className="px-3 py-2.5 text-right mn font-bold" style={{ color: 'var(--color-earth)' }}>{formatNum(lab.target - lab.sanctioned_target)}</td>
                <td className="px-3 py-2.5 text-right mn">{formatNum(lab.sample_tested)}</td>
                <td className="px-3 py-2.5 text-right mn">{formatNum(lab.shc_printed)}</td>
                <td className="px-3 py-2.5 text-right mn">{formatNum(lab.billing_amount)}</td>
                <td className="px-3 py-2.5 text-right mn font-bold" style={{ color: 'var(--color-ok)' }}>{formatNum(lab.payment_received)}</td>
                <td className="px-3 py-2.5 text-right mn font-bold" style={{ color: 'var(--color-er)' }}>{formatNum(lab.sanctioned_payment - lab.payment_received)}</td>
                <td className="px-3 py-2.5 text-right mn">{formatNum(lab.expenses_total)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr style={{ background: 'var(--color-g8)', fontWeight: 700 }}>
              <td colSpan={5} className="px-3 py-2.5 text-sm" style={{ color: 'var(--color-tx)', fontFamily: "'Fira Mono', monospace", fontSize: '11px' }}>TOTAL</td>
              <td className="px-3 py-2.5 text-right mn font-bold">{formatNum(labs.reduce((s, l) => s + l.target, 0))}</td>
              <td className="px-3 py-2.5 text-right mn font-bold">{formatNum(labs.reduce((s, l) => s + l.sanctioned_target, 0))}</td>
              <td className="px-3 py-2.5 text-right mn font-bold" style={{ color: 'var(--color-earth)' }}>{formatNum(labs.reduce((s, l) => s + (l.target - l.sanctioned_target), 0))}</td>
              <td className="px-3 py-2.5 text-right mn font-bold">{formatNum(labs.reduce((s, l) => s + l.sample_tested, 0))}</td>
              <td className="px-3 py-2.5 text-right mn font-bold">{formatNum(labs.reduce((s, l) => s + l.shc_printed, 0))}</td>
              <td className="px-3 py-2.5 text-right mn font-bold">{formatNum(labs.reduce((s, l) => s + l.billing_amount, 0))}</td>
              <td className="px-3 py-2.5 text-right mn font-bold" style={{ color: 'var(--color-ok)' }}>{formatNum(labs.reduce((s, l) => s + l.payment_received, 0))}</td>
              <td className="px-3 py-2.5 text-right mn font-bold" style={{ color: 'var(--color-er)' }}>{formatNum(labs.reduce((s, l) => s + (l.sanctioned_payment - l.payment_received), 0))}</td>
              <td className="px-3 py-2.5 text-right mn font-bold">{formatNum(labs.reduce((s, l) => s + l.expenses_total, 0))}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
