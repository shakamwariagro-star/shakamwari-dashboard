/**
 * Export data as CSV file download
 */
export function exportToCsv(filename: string, headers: string[], rows: (string | number)[][]) {
  const csvContent = [
    headers.join(','),
    ...rows.map(row =>
      row.map(cell => {
        const str = String(cell ?? '');
        // Escape commas and quotes
        if (str.includes(',') || str.includes('"') || str.includes('\n')) {
          return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
      }).join(',')
    ),
  ].join('\n');

  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export button component styles (reusable inline)
 */
export const exportButtonStyle = {
  padding: '6px 12px',
  borderRadius: '9px',
  fontSize: '11px',
  fontWeight: 700,
  color: '#3d6b30',
  background: 'var(--color-ok-bg)',
  border: '1px solid rgba(45,110,31,0.2)',
  cursor: 'pointer',
} as const;
