'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { IS_PREVIEW } from '@/lib/mockData';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handlePreviewLogin = () => {
    setLoading(true);
    // Store mock session for preview mode
    if (typeof window !== 'undefined') {
      localStorage.setItem('preview_admin_session', JSON.stringify({ role: 'admin', email: 'admin@preview.local' }));
    }
    router.push('/dashboard');
    router.refresh();
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (IS_PREVIEW) {
      handlePreviewLogin();
      return;
    }

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    router.push('/dashboard');
    router.refresh();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <img src="/logo.jpeg" alt="Shakamwari Agro" className="w-20 h-20 rounded-2xl object-cover mx-auto mb-3" style={{ boxShadow: '0 4px 14px rgba(58,106,44,0.3)' }} />
            <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-heading)' }}>Shakamwari Agro</h1>
            <p className="text-sm text-gray-500 mt-1">India Private Limited</p>
            <p className="text-[10px] uppercase tracking-[0.12em] mt-1" style={{ color: 'var(--color-tx-f)', fontFamily: "var(--font-mono)" }}>
              Empowering Farmers, Enriching Fields
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                placeholder="Enter your password"
                required
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-2.5 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {IS_PREVIEW && (
            <div className="mt-4">
              <button
                onClick={handlePreviewLogin}
                disabled={loading}
                className="w-full bg-amber-500 text-white py-2.5 rounded-lg font-medium hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Preview Mode
              </button>
            </div>
          )}

          <div className="mt-4 pt-4 border-t border-gray-100 text-center">
            <a href="/expert/login" className="text-sm text-green-700 font-semibold hover:underline">
              Soil Testing Expert? Login here &rarr;
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
