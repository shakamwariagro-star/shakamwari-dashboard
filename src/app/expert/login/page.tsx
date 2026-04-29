'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authenticateExpert } from '@/lib/expertData';

export default function ExpertLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const expert = authenticateExpert(username.trim(), password.trim());
    if (!expert) {
      setError('Invalid username or password');
      setLoading(false);
      return;
    }

    localStorage.setItem('shakamwari_expert_id', expert.id);
    router.push('/expert/portal');
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        background: 'linear-gradient(160deg, #1a2e14 0%, #2f5225 40%, #3d6b30 70%, #4e8a3e 100%)',
      }}
    >
      {/* Decorative soil/plant pattern */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="w-full max-w-sm relative z-10">
        <div
          className="rounded-2xl p-7"
          style={{
            background: 'var(--color-parch)',
            border: '1.5px solid var(--color-bd)',
            boxShadow: '0 12px 48px rgba(0,0,0,0.3)',
          }}
        >
          {/* Brand Header */}
          <div className="text-center mb-6">
            <img src="/logo.jpeg" alt="Shakamwari Agro" className="w-16 h-16 rounded-2xl object-cover mx-auto mb-3" style={{ boxShadow: '0 4px 14px rgba(58,106,44,0.3)' }} />
            <h1 className="text-lg font-extrabold" style={{ color: 'var(--color-g1)', fontFamily: 'var(--font-heading)' }}>
              Soil Testing Expert
            </h1>
            <p
              className="text-[10px] uppercase tracking-[0.12em] mt-1"
              style={{ color: 'var(--color-tx-f)', fontFamily: "var(--font-mono)" }}
            >
              Shakamwari Agro India Pvt Ltd
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-3.5">
            <div>
              <label
                className="block mb-1"
                style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  color: 'var(--color-tx-d)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  fontFamily: "'Fira Mono', monospace",
                }}
              >
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full"
                style={{
                  border: '1.5px solid var(--color-bd2)',
                  borderRadius: '9px',
                  padding: '10px 12px',
                  fontSize: '13px',
                  fontFamily: "'Nunito', sans-serif",
                  fontWeight: 600,
                  background: '#fff',
                  color: 'var(--color-tx)',
                  outline: 'none',
                }}
                placeholder="e.g. ramswaroop"
                required
                autoComplete="off"
              />
            </div>

            <div>
              <label
                className="block mb-1"
                style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  color: 'var(--color-tx-d)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  fontFamily: "'Fira Mono', monospace",
                }}
              >
                Password
              </label>
              <input
                type="tel"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full"
                style={{
                  border: '1.5px solid var(--color-bd2)',
                  borderRadius: '9px',
                  padding: '10px 12px',
                  fontSize: '13px',
                  fontFamily: "'Nunito', sans-serif",
                  fontWeight: 600,
                  background: '#fff',
                  color: 'var(--color-tx)',
                  outline: 'none',
                }}
                placeholder="Your phone number"
                required
                autoComplete="off"
              />
            </div>

            {error && (
              <p
                className="text-xs font-bold px-3 py-2 rounded-lg"
                style={{ background: 'var(--color-er-bg)', color: 'var(--color-er)' }}
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-[9px] text-sm font-bold text-white transition-all"
              style={{
                background: 'linear-gradient(135deg, #3d6b30, #4e8a3e)',
                boxShadow: '0 3px 12px rgba(61,107,48,0.4)',
                opacity: loading ? 0.6 : 1,
              }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-[10px]" style={{ color: 'var(--color-tx-f)' }}>
              Use your first name as username and phone number as password
            </p>
          </div>
        </div>

        <div className="text-center mt-3 flex gap-4 justify-center">
          <a href="/coordinator/login" className="text-[11px] font-semibold" style={{ color: 'rgba(255,255,255,0.5)' }}>Coordinator Panel &rarr;</a>
          <a href="/dashboard" className="text-[11px] font-semibold" style={{ color: 'rgba(255,255,255,0.5)' }}>Admin Dashboard &rarr;</a>
        </div>
      </div>
    </div>
  );
}
