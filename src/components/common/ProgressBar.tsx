export default function ProgressBar({
  value,
  max,
  label,
}: {
  value: number;
  max: number;
  label?: string;
  color?: 'green' | 'blue' | 'yellow' | 'red';
}) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;

  return (
    <div>
      {label && (
        <div className="flex justify-between text-xs mb-1" style={{ color: 'var(--color-tx-d)' }}>
          <span>{label}</span>
          <span className="mn">{value.toLocaleString('en-IN')} / {max.toLocaleString('en-IN')}</span>
        </div>
      )}
      <div className="w-full rounded-[3px] overflow-hidden" style={{ height: '5px', background: 'var(--color-g7)' }}>
        <div
          className="h-full rounded-[3px] transition-all duration-700"
          style={{
            width: `${pct}%`,
            background: 'linear-gradient(to right, #4e8a3e, #8bc97a)',
          }}
        />
      </div>
    </div>
  );
}
