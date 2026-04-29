const statusStyles: Record<string, string> = {
  pending: 'pill pill-wn',
  approved: 'pill pill-ok',
  rejected: 'pill pill-er',
  received: 'pill pill-in',
  done: 'pill pill-ok',
};

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`capitalize ${statusStyles[status] || 'pill'}`} style={!statusStyles[status] ? { background: 'var(--color-g8)', color: 'var(--color-tx-d)' } : undefined}>
      {status}
    </span>
  );
}
