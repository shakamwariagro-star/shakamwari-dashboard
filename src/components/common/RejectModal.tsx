'use client';

import { useState } from 'react';

interface RejectModalProps {
  title: string;
  description?: string;
  onReject: (reason: string) => void;
  onCancel: () => void;
}

export default function RejectModal({ title, description, onReject, onCancel }: RejectModalProps) {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    const trimmed = reason.trim();
    if (!trimmed) {
      setError('Please provide a reason for rejection');
      return;
    }
    if (trimmed.length < 5) {
      setError('Reason must be at least 5 characters');
      return;
    }
    onReject(trimmed);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(2px)' }}
      onClick={onCancel}
    >
      <div
        className="w-full max-w-md rounded-2xl p-5 space-y-4"
        style={{
          background: 'var(--color-parch)',
          border: '1.5px solid var(--color-bd)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div>
          <h3 className="text-sm font-extrabold" style={{ color: 'var(--color-er)' }}>
            {title}
          </h3>
          {description && (
            <p className="text-[11px] mt-1" style={{ color: 'var(--color-tx-f)' }}>
              {description}
            </p>
          )}
        </div>

        {/* Reason input */}
        <div>
          <label
            style={{
              fontSize: '10px',
              fontWeight: 700,
              color: 'var(--color-tx-d)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              fontFamily: "'Fira Mono', monospace",
              marginBottom: '4px',
              display: 'block',
            }}
          >
            Reason for rejection *
          </label>
          <textarea
            value={reason}
            onChange={(e) => { setReason(e.target.value); setError(''); }}
            rows={3}
            className="w-full"
            style={{
              border: `1.5px solid ${error ? 'var(--color-er)' : 'var(--color-bd2)'}`,
              borderRadius: '9px',
              padding: '10px 12px',
              fontSize: '13px',
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 500,
              background: '#fff',
              color: 'var(--color-tx)',
              outline: 'none',
              resize: 'vertical',
            }}
            placeholder="e.g. Chemical expenses seem too high, please recheck bills"
            autoFocus
          />
          {error && (
            <p className="text-[11px] mt-1 font-bold" style={{ color: 'var(--color-er)' }}>{error}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-1" style={{ borderTop: '1px solid var(--color-bd)' }}>
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-[9px] text-xs font-bold"
            style={{ border: '1.5px solid var(--color-bd2)', color: 'var(--color-tx-d)', background: 'transparent' }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded-[9px] text-xs font-bold text-white"
            style={{
              background: 'linear-gradient(135deg, #8b2020, #a03030)',
              boxShadow: '0 2px 8px rgba(139,32,32,0.35)',
            }}
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}
