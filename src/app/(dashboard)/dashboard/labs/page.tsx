'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { MOCK_LABS, IS_PREVIEW } from '@/lib/mockData';
import ProgressBar from '@/components/common/ProgressBar';
import type { Lab } from '@/lib/types';

export default function LabsPage() {
  const [labs, setLabs] = useState<Lab[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    if (IS_PREVIEW) {
      setLabs(MOCK_LABS);
      setLoading(false);
      return;
    }
    supabase.from('labs').select('*').order('id').then(({ data }) => {
      if (data) setLabs(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-g4" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="sec-label">🔬 Lab-wise Status</div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {labs.map(lab => (
          <Link
            key={lab.id}
            href={`/labs/${lab.id}`}
            className="lab-card relative overflow-hidden transition-all duration-200"
            style={{
              background: 'var(--color-parch)',
              border: '1.5px solid var(--color-bd)',
              borderRadius: '14px',
              padding: '14px 16px',
              boxShadow: 'var(--shadow-card)',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-card-hover)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'var(--shadow-card)'; }}
          >
            {/* Faint sprout icon */}
            <span className="absolute top-3 right-3.5 text-[26px] opacity-10">🌱</span>

            <div className="text-sm font-extrabold mb-0.5" style={{ color: 'var(--color-g1)' }}>{lab.lab_code}</div>
            <div className="text-[11px] mb-2.5" style={{ color: 'var(--color-tx-f)', fontFamily: "'Fira Mono', monospace" }}>
              {lab.district} · {lab.block} · {lab.company_name}
            </div>

            <p className="text-[10px] mb-3" style={{ color: 'var(--color-tx-f)' }}>Coordinator: {lab.coordinator}</p>

            <div className="space-y-2.5">
              <ProgressBar value={lab.sanctioned_target} max={lab.target} label="Sanctioned / Target" />
              <ProgressBar value={lab.sample_tested} max={lab.sanctioned_target || 1} label="Tested / Sanctioned" />
              <ProgressBar value={lab.shc_printed} max={lab.sample_tested || 1} label="SHC Printed / Tested" />
            </div>

            <div className="mt-3 pt-3 grid grid-cols-2 gap-3 text-center" style={{ borderTop: '1px solid var(--color-bd)' }}>
              <div>
                <div className="text-[9.5px] font-bold uppercase tracking-wide" style={{ color: 'var(--color-tx-f)' }}>Billing Amt</div>
                <div className="text-[13px] font-extrabold mn" style={{ color: 'var(--color-g1)' }}>{lab.billing_amount.toLocaleString('en-IN')}</div>
              </div>
              <div>
                <div className="text-[9.5px] font-bold uppercase tracking-wide" style={{ color: 'var(--color-tx-f)' }}>Payment Rcvd</div>
                <div className="text-[13px] font-extrabold mn" style={{ color: 'var(--color-ok)' }}>{lab.payment_received.toLocaleString('en-IN')}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
