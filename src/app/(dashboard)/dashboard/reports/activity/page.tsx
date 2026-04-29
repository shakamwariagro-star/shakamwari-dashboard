'use client';

import { useState, useMemo } from 'react';
import { getAuditLog, type AuditEntry } from '@/lib/auditLog';
import { exportToCsv, exportButtonStyle } from '@/lib/exportCsv';

type EntityFilter = 'all' | 'lab_data' | 'expense' | 'register' | 'stock' | 'bill' | 'dispatch';

const ENTITY_OPTIONS: { value: EntityFilter; label: string }[] = [
  { value: 'all', label: 'All Types' },
  { value: 'lab_data', label: 'Lab Data' },
  { value: 'expense', label: 'Expenses' },
  { value: 'register', label: 'Registers' },
  { value: 'stock', label: 'Stock' },
  { value: 'bill', label: 'Bills' },
  { value: 'dispatch', label: 'Dispatch' },
];

const ACTION_COLORS: Record<string, { bg: string; color: string }> = {
  approved_expense: { bg: 'var(--color-ok-bg)', color: 'var(--color-ok)' },
  approved_bill: { bg: 'var(--color-ok-bg)', color: 'var(--color-ok)' },
  rejected_expense: { bg: 'var(--color-er-bg)', color: 'var(--color-er)' },
  submitted_expenses: { bg: '#e8f0fe', color: '#1a73e8' },
  uploaded_register: { bg: '#e8f0fe', color: '#1a73e8' },
  updated_lab_data: { bg: '#f0f0f0', color: '#555' },
  supplied_stock: { bg: 'var(--color-ok-bg)', color: 'var(--color-ok)' },
  raised_indent: { bg: '#e8f0fe', color: '#1a73e8' },
  created_dispatch: { bg: '#e8f0fe', color: '#1a73e8' },
};

const ROLE_BADGE: Record<string, { bg: string; color: string }> = {
  expert: { bg: '#e8f0fe', color: '#1a73e8' },
  coordinator: { bg: '#fef3cd', color: '#c59a1a' },
  admin: { bg: 'var(--color-er-bg)', color: 'var(--color-er)' },
};

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

const selectStyle: React.CSSProperties = {
  border: '1.5px solid var(--color-bd2)', background: '#fff', color: 'var(--color-tx)',
  fontFamily: "'Nunito', sans-serif", fontSize: '12.5px', fontWeight: 600,
  padding: '5px 10px', borderRadius: '8px', outline: 'none', cursor: 'pointer',
};

const inputStyle: React.CSSProperties = {
  border: '1.5px solid var(--color-bd2)', background: '#fff', color: 'var(--color-tx)',
  fontFamily: "'Nunito', sans-serif", fontSize: '12.5px', fontWeight: 600,
  padding: '5px 10px', borderRadius: '8px', outline: 'none', width: '200px',
};

function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true,
  });
}

function formatActionLabel(action: string): string {
  return action.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

export default function ActivityLogPage() {
  const allEntries = useMemo(() => getAuditLog(), []);

  const [entityFilter, setEntityFilter] = useState<EntityFilter>('all');
  const [userFilter, setUserFilter] = useState('all');
  const [search, setSearch] = useState('');

  const uniqueUsers = useMemo(() => {
    const users = new Set(allEntries.map(e => e.user));
    return Array.from(users).sort();
  }, [allEntries]);

  const filtered = useMemo(() => {
    let entries = allEntries;
    if (entityFilter !== 'all') {
      entries = entries.filter(e => e.entity_type === entityFilter);
    }
    if (userFilter !== 'all') {
      entries = entries.filter(e => e.user === userFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      entries = entries.filter(e =>
        e.details.toLowerCase().includes(q) ||
        e.lab_code.toLowerCase().includes(q) ||
        e.user.toLowerCase().includes(q) ||
        e.action.toLowerCase().includes(q)
      );
    }
    return entries;
  }, [allEntries, entityFilter, userFilter, search]);

  const summary = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const e of allEntries) {
      counts[e.entity_type] = (counts[e.entity_type] || 0) + 1;
    }
    return counts;
  }, [allEntries]);

  function handleExport() {
    const headers = ['S.N', 'Timestamp', 'User', 'Role', 'Action', 'Entity Type', 'Lab Code', 'Details'];
    const rows = filtered.map((e, i) => [
      i + 1, formatTimestamp(e.timestamp), e.user, e.role,
      formatActionLabel(e.action), e.entity_type, e.lab_code, e.details,
    ]);
    exportToCsv('activity_log', headers, rows);
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="sec-label" style={{ marginBottom: 0 }}>Activity Log</div>
        <div className="flex items-center gap-2 flex-wrap">
          <input
            type="text"
            placeholder="Search entries..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={inputStyle}
          />
          <select value={entityFilter} onChange={e => setEntityFilter(e.target.value as EntityFilter)} style={selectStyle}>
            {ENTITY_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <select value={userFilter} onChange={e => setUserFilter(e.target.value)} style={selectStyle}>
            <option value="all">All Users</option>
            {uniqueUsers.map(u => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>
          <button onClick={handleExport} style={exportButtonStyle}>Export CSV</button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-2.5">
        <div className="mcard">
          <div className="mcard-label">Total Entries</div>
          <div className="mcard-value mn" style={{ color: 'var(--color-g1)' }}>{allEntries.length}</div>
        </div>
        <div className="mcard">
          <div className="mcard-label">Lab Data</div>
          <div className="mcard-value mn" style={{ color: '#555' }}>{summary['lab_data'] || 0}</div>
        </div>
        <div className="mcard">
          <div className="mcard-label">Expenses</div>
          <div className="mcard-value mn" style={{ color: '#1a73e8' }}>{summary['expense'] || 0}</div>
        </div>
        <div className="mcard">
          <div className="mcard-label">Registers</div>
          <div className="mcard-value mn" style={{ color: '#1a73e8' }}>{summary['register'] || 0}</div>
        </div>
        <div className="mcard">
          <div className="mcard-label">Stock</div>
          <div className="mcard-value mn" style={{ color: 'var(--color-ok)' }}>{summary['stock'] || 0}</div>
        </div>
        <div className="mcard">
          <div className="mcard-label">Bills</div>
          <div className="mcard-value mn" style={{ color: 'var(--color-earth)' }}>{summary['bill'] || 0}</div>
        </div>
      </div>

      {/* Table */}
      <div className="theme-table-wrap">
        <table className="min-w-full" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--color-g8)' }}>
              <th style={thStyle}>S.N</th>
              <th style={thStyle}>Timestamp</th>
              <th style={thStyle}>User</th>
              <th style={thStyle}>Role</th>
              <th style={thStyle}>Action</th>
              <th style={thStyle}>Lab</th>
              <th style={thStyle}>Details</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ ...tdStyle, textAlign: 'center', padding: '24px', color: 'var(--color-tx-d)' }}>
                  No entries match your filters.
                </td>
              </tr>
            ) : (
              filtered.map((e, i) => {
                const actionColor = ACTION_COLORS[e.action] || { bg: '#f0f0f0', color: '#555' };
                const roleBadge = ROLE_BADGE[e.role] || { bg: '#f0f0f0', color: '#555' };
                return (
                  <tr
                    key={e.id}
                    style={{ borderBottom: '1px solid rgba(61,107,48,0.06)' }}
                    onMouseEnter={ev => { ev.currentTarget.style.background = 'var(--color-g8)'; }}
                    onMouseLeave={ev => { ev.currentTarget.style.background = 'transparent'; }}
                  >
                    <td style={tdStyle} className="mn">{i + 1}</td>
                    <td style={{ ...tdStyle, whiteSpace: 'nowrap', fontFamily: "'Fira Mono', monospace", fontSize: '11px' }}>
                      {formatTimestamp(e.timestamp)}
                    </td>
                    <td style={{ ...tdStyle, fontWeight: 700 }}>{e.user}</td>
                    <td style={tdStyle}>
                      <span
                        className="pill"
                        style={{
                          background: roleBadge.bg, color: roleBadge.color,
                          fontWeight: 700, fontSize: '10px', textTransform: 'capitalize',
                        }}
                      >
                        {e.role}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      <span
                        className="pill"
                        style={{
                          background: actionColor.bg, color: actionColor.color,
                          fontWeight: 700, fontSize: '10px',
                        }}
                      >
                        {formatActionLabel(e.action)}
                      </span>
                    </td>
                    <td style={{ ...tdStyle, fontWeight: 700, color: 'var(--color-g1)' }}>{e.lab_code}</td>
                    <td style={{ ...tdStyle, maxWidth: '340px' }}>{e.details}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer count */}
      <div style={{ fontSize: '11px', color: 'var(--color-tx-d)', fontFamily: "'Fira Mono', monospace" }}>
        Showing {filtered.length} of {allEntries.length} entries
      </div>
    </div>
  );
}
