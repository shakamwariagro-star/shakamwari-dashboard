'use client';

import { useEffect, useState } from 'react';
import { getExpertById } from '@/lib/expertData';
import { MOCK_LABS, IS_PREVIEW } from '@/lib/mockData';
import { createClient } from '@/lib/supabase/client';
import ProgressBar from '@/components/common/ProgressBar';
import type { Lab } from '@/lib/types';

const EDITABLE_FIELDS = [
  { key: 'sample_tested', label: 'Sample Tested', icon: '🧪' },
  { key: 'shc_printed', label: 'SHC Printed', icon: '🖨' },
  { key: 'shc_handover', label: 'SHC Handover', icon: '🤝' },
  { key: 'hand_over_samples', label: 'Handover Samples', icon: '📦' },
] as const;

const READ_ONLY_FIELDS = [
  { key: 'target', label: 'Target' },
  { key: 'sanctioned_target', label: 'Sanctioned Target' },
  { key: 'billing_sample', label: 'Billing Samples' },
  { key: 'billing_amount', label: 'Billing Amount' },
  { key: 'payment_received', label: 'Payment Received' },
  { key: 'expenses_total', label: 'Expenses Total' },
] as const;

export default function ExpertPortalHome() {
  const [lab, setLab] = useState<Lab | null>(null);
  const [editValues, setEditValues] = useState<Record<string, number>>({});
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'ok' | 'er'; text: string } | null>(null);

  useEffect(() => {
    const storedId = localStorage.getItem('shakamwari_expert_id');
    if (!storedId) return;
    const expert = getExpertById(storedId);
    if (!expert) return;

    if (IS_PREVIEW) {
      const mockLab = MOCK_LABS.find((l) => l.id === expert.assigned_lab_id);
      if (mockLab) {
        setLab(mockLab);
        setEditValues({
          sample_tested: mockLab.sample_tested,
          shc_printed: mockLab.shc_printed,
          shc_handover: mockLab.shc_handover,
          hand_over_samples: mockLab.hand_over_samples,
        });
      }
      return;
    }

    const supabase = createClient();
    supabase.from('labs').select('*').eq('id', expert.assigned_lab_id).single().then(({ data }) => {
      if (data) {
        setLab(data);
        setEditValues({
          sample_tested: data.sample_tested,
          shc_printed: data.shc_printed,
          shc_handover: data.shc_handover,
          hand_over_samples: data.hand_over_samples,
        });
      }
    });
  }, []);

  const handleSave = async () => {
    if (!lab) return;
    setSaving(true);
    setMessage(null);

    if (IS_PREVIEW) {
      // Mock save — update local state
      setLab({ ...lab, ...editValues });
      setEditing(false);
      setMessage({ type: 'ok', text: 'Data saved successfully (preview mode)' });
      setSaving(false);
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.from('labs').update(editValues).eq('id', lab.id);
    if (error) {
      setMessage({ type: 'er', text: 'Failed to save: ' + error.message });
    } else {
      setLab({ ...lab, ...editValues });
      setEditing(false);
      setMessage({ type: 'ok', text: 'Data saved successfully' });
      setTimeout(() => setMessage(null), 3000);
    }
    setSaving(false);
  };

  const handleCancel = () => {
    if (lab) {
      setEditValues({
        sample_tested: lab.sample_tested,
        shc_printed: lab.shc_printed,
        shc_handover: lab.shc_handover,
        hand_over_samples: lab.hand_over_samples,
      });
    }
    setEditing(false);
  };

  if (!lab) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-g4" />
      </div>
    );
  }

  const formatNum = (n: number) => n.toLocaleString('en-IN');

  return (
    <div className="space-y-5">
      {/* Success/Error Message */}
      {message && (
        <div
          className="px-4 py-2.5 rounded-xl text-xs font-bold"
          style={{
            background: message.type === 'ok' ? 'var(--color-ok-bg)' : 'var(--color-er-bg)',
            color: message.type === 'ok' ? 'var(--color-ok)' : 'var(--color-er)',
          }}
        >
          {message.text}
        </div>
      )}

      {/* Lab Header Card */}
      <div className="theme-card">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-base font-extrabold" style={{ color: 'var(--color-g1)' }}>{lab.lab_code}</h2>
              <span className="pill pill-ok text-[10px]">{lab.company_name}</span>
            </div>
            <p className="text-[11px] mt-1" style={{ color: 'var(--color-tx-f)', fontFamily: "'Fira Mono', monospace" }}>
              {lab.district} / {lab.block} | Coordinator: {lab.coordinator}
            </p>
          </div>
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="px-3.5 py-1.5 rounded-[9px] text-xs font-bold"
              style={{ border: '1.5px solid var(--color-bd2)', color: 'var(--color-tx-d)', background: 'transparent' }}
            >
              Edit Data
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                className="px-3 py-1.5 rounded-[9px] text-xs font-bold"
                style={{ border: '1.5px solid var(--color-bd2)', color: 'var(--color-tx-d)', background: 'transparent' }}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-3.5 py-1.5 rounded-[9px] text-xs font-bold text-white"
                style={{
                  background: 'linear-gradient(135deg, #3d6b30, #4e8a3e)',
                  boxShadow: '0 2px 8px rgba(61,107,48,0.35)',
                  opacity: saving ? 0.6 : 1,
                }}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Editable Data Fields */}
      <div>
        <div className="sec-label">Lab Data (Editable)</div>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-3">
          {EDITABLE_FIELDS.map((field) => (
            <div key={field.key} className="mcard">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-sm">{field.icon}</span>
                <span className="mcard-label" style={{ marginBottom: 0 }}>{field.label}</span>
              </div>
              {editing ? (
                <input
                  type="number"
                  value={editValues[field.key] || 0}
                  onChange={(e) => setEditValues({ ...editValues, [field.key]: Number(e.target.value) })}
                  className="w-full mt-1.5 text-lg font-bold mn rounded-lg px-2.5 py-1.5"
                  style={{
                    border: '1.5px solid var(--color-bd2)',
                    background: '#fff',
                    color: 'var(--color-tx)',
                    outline: 'none',
                  }}
                  min={0}
                />
              ) : (
                <div className="mcard-value" style={{ color: 'var(--color-g3)' }}>
                  {formatNum(editValues[field.key] || 0)}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Read-only Summary */}
      <div>
        <div className="sec-label">Lab Summary (Read Only)</div>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-2.5">
          {READ_ONLY_FIELDS.map((field) => (
            <div key={field.key} className="mcard" style={{ cursor: 'default' }}>
              <div className="mcard-label">{field.label}</div>
              <div
                className="mcard-value"
                style={{
                  color: field.key === 'payment_received'
                    ? 'var(--color-ok)'
                    : field.key === 'expenses_total'
                    ? 'var(--color-earth)'
                    : 'var(--color-tx)',
                }}
              >
                {field.key === 'billing_amount' || field.key === 'payment_received' || field.key === 'expenses_total'
                  ? `${formatNum((lab as any)[field.key])}`
                  : formatNum((lab as any)[field.key])}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Progress Section */}
      <div className="theme-card space-y-3">
        <div className="theme-card-title">Sample Progress</div>
        <ProgressBar value={lab.sanctioned_target} max={lab.target || 1} label="Sanctioned / Target" />
        <ProgressBar value={lab.hand_over_samples} max={lab.sanctioned_target || 1} label="Handover / Sanctioned" />
        <ProgressBar value={lab.sample_tested} max={lab.hand_over_samples || 1} label="Tested / Handover" />
        <ProgressBar value={lab.shc_printed} max={lab.sample_tested || 1} label="SHC Printed / Tested" />
      </div>
    </div>
  );
}
