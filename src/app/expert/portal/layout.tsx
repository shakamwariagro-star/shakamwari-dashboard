'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ExpertUser } from '@/lib/types';
import { getExpertById } from '@/lib/expertData';
import { MOCK_LABS } from '@/lib/mockData';

const navItems = [
  { href: '/expert/portal', label: 'My Lab', icon: '🔬' },
  { href: '/expert/portal/expenses', label: 'Expenses', icon: '📤' },
  { href: '/expert/portal/registers', label: 'Registers', icon: '📋' },
  { href: '/expert/portal/stock', label: 'Stock', icon: '📦' },
];

export default function ExpertPortalLayout({ children }: { children: React.ReactNode }) {
  const [expert, setExpert] = useState<ExpertUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const storedId = localStorage.getItem('shakamwari_expert_id');
    if (!storedId) {
      router.push('/expert/login');
      return;
    }
    const found = getExpertById(storedId);
    if (!found) {
      localStorage.removeItem('shakamwari_expert_id');
      router.push('/expert/login');
      return;
    }
    setExpert(found);
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('shakamwari_expert_id');
    router.push('/expert/login');
  };

  if (loading || !expert) {
    return (
      <div className="h-screen flex items-center justify-center" style={{ background: 'var(--color-cream)' }}>
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-g4" />
      </div>
    );
  }

  const lab = MOCK_LABS.find((l) => l.id === expert.assigned_lab_id);

  const sidebarContent = (mobile: boolean) => (
    <aside
      className={`flex-shrink-0 flex flex-col min-h-screen ${mobile ? 'w-full' : 'w-[200px]'}`}
      style={{
        background: '#1a2e14',
        backgroundImage: 'linear-gradient(160deg, rgba(78,138,62,0.14) 0%, transparent 45%)',
      }}
    >
      {/* Brand */}
      <div className="px-3.5 pt-3.5 pb-2.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo.jpeg" alt="Shakamwari" className="w-7 h-7 rounded-lg object-cover" />
            <div>
              <div className="text-[12px] font-extrabold text-white tracking-tight">Expert Portal</div>
              <div className="text-[8px] uppercase tracking-[0.1em]" style={{ color: 'rgba(255,255,255,0.35)', fontFamily: "'Fira Mono', monospace" }}>
                Soil Testing
              </div>
            </div>
          </div>
          {mobile && (
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1.5 rounded-lg transition-colors"
              style={{ color: 'rgba(255,255,255,0.5)' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.85)'; e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; e.currentTarget.style.background = 'transparent'; }}
              aria-label="Close sidebar"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Lab Info */}
      {lab && (
        <div className="mx-2.5 mt-2.5 px-2.5 py-2 rounded-lg" style={{ background: 'rgba(106,170,88,0.15)' }}>
          <div className="text-[11px] font-bold text-white">{lab.lab_code}</div>
          <div className="text-[9px]" style={{ color: 'rgba(255,255,255,0.5)', fontFamily: "'Fira Mono', monospace" }}>
            {lab.district} / {lab.block}
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-2 py-2.5">
        <div className="px-2 pt-2 pb-1 text-[9px] font-bold uppercase tracking-[0.12em]" style={{ color: 'rgba(255,255,255,0.25)', fontFamily: "'Fira Mono', monospace" }}>
          Menu
        </div>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => mobile && setSidebarOpen(false)}
              className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-[12px] font-medium mb-px transition-all duration-150"
              style={{
                color: isActive ? '#8bc97a' : 'rgba(255,255,255,0.5)',
                background: isActive ? 'rgba(106,170,88,0.22)' : 'transparent',
                borderLeft: isActive ? '3px solid #6aaa58' : '3px solid transparent',
              }}
            >
              <span className="w-4 text-center text-sm">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User Card + Logout */}
      <div className="px-2.5 pb-3" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="mt-2.5 px-2.5 py-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.05)' }}>
          <p className="text-[11px] font-semibold text-white">{expert.full_name}</p>
          <p className="text-[9px]" style={{ color: 'rgba(255,255,255,0.35)', fontFamily: "'Fira Mono', monospace" }}>
            {expert.employee_number} | {expert.company}
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full mt-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-bold text-left transition-all"
          style={{ color: 'rgba(255,255,255,0.4)', background: 'transparent' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; }}
        >
          Logout
        </button>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden md:block">
        {sidebarContent(false)}
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          style={{ background: 'rgba(0,0,0,0.5)' }}
          onClick={() => setSidebarOpen(false)}
        >
          <div
            className="absolute inset-y-0 left-0 w-[280px] max-w-[85vw]"
            onClick={(e) => e.stopPropagation()}
          >
            {sidebarContent(true)}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header
          className="flex items-center justify-between px-5 py-3 flex-shrink-0"
          style={{ background: '#1a2e14', boxShadow: '0 2px 12px rgba(0,0,0,0.2)' }}
        >
          <div className="flex items-center gap-3">
            {/* Hamburger - mobile only */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-1.5 rounded-lg transition-colors"
              style={{ color: 'rgba(255,255,255,0.5)' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.85)'; e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; e.currentTarget.style.background = 'transparent'; }}
              aria-label="Open menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <h1 className="text-sm font-extrabold text-white">
                {lab ? `${lab.district} - ${lab.block}` : 'My Lab'}
              </h1>
              <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.4)', fontFamily: "'Fira Mono', monospace" }}>
                Coordinator: {expert.coordinator}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-[7px] h-[7px] rounded-full flex-shrink-0" style={{ background: '#6aaa58', animation: 'pulse 2s ease infinite' }} />
            <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.45)', fontFamily: "'Fira Mono', monospace" }}>Online</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-5" style={{ maxWidth: '1200px' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
