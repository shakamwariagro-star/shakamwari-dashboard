'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import type { CoordinatorUser } from '@/lib/coordinatorData';
import { getCoordinatorById, getLabsForCoordinator } from '@/lib/coordinatorData';
import { MOCK_APPROVALS } from '@/lib/mockData';
import type { Lab } from '@/lib/types';

const mainNav = [
  { href: '/coordinator/portal', label: 'Inbox', icon: '📥' },
  { href: '/coordinator/portal/salary', label: 'Salary', icon: '💰' },
  { href: '/coordinator/portal/stock', label: 'Stock', icon: '📦' },
  { href: '/coordinator/portal/dispatch', label: 'Dispatch', icon: '📨' },
  { href: '/coordinator/portal/billing', label: 'Billing', icon: '🧾' },
];

export default function CoordinatorPortalLayout({ children }: { children: React.ReactNode }) {
  const [coordinator, setCoordinator] = useState<CoordinatorUser | null>(null);
  const [labs, setLabs] = useState<Lab[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const storedId = localStorage.getItem('shakamwari_coordinator_id');
    if (!storedId) { router.push('/coordinator/login'); return; }
    const found = getCoordinatorById(storedId);
    if (!found) { localStorage.removeItem('shakamwari_coordinator_id'); router.push('/coordinator/login'); return; }
    setCoordinator(found);
    setLabs(getLabsForCoordinator(found.full_name));
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('shakamwari_coordinator_id');
    router.push('/coordinator/login');
  };

  if (loading || !coordinator) {
    return (
      <div className="h-screen flex items-center justify-center" style={{ background: 'var(--color-cream)' }}>
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-g4" />
      </div>
    );
  }

  const pendingCount = MOCK_APPROVALS.filter(a => a.status === 'pending').length;

  const sidebarContent = (mobile: boolean) => (
    <aside
      className={`flex-shrink-0 flex flex-col min-h-screen overflow-y-auto ${mobile ? 'w-full' : 'w-[230px]'}`}
      style={{
        background: '#1a2e14',
        backgroundImage: 'linear-gradient(160deg, rgba(47,82,37,0.2) 0%, transparent 45%)',
      }}
    >
      {/* Brand */}
      <div className="px-3.5 pt-3.5 pb-2.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo.jpeg" alt="Shakamwari" className="w-7 h-7 rounded-lg object-cover" />
            <div>
              <div className="text-[12px] font-extrabold text-white tracking-tight">Coordinator Panel</div>
              <div className="text-[8px] uppercase tracking-[0.1em]" style={{ color: 'rgba(255,255,255,0.35)', fontFamily: "'Fira Mono', monospace" }}>
                Team Leader
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

      <nav className="flex-1 px-2 py-2">
        {/* Main Nav */}
        <div className="px-2 pt-2 pb-1 text-[9px] font-bold uppercase tracking-[0.12em]" style={{ color: 'rgba(255,255,255,0.25)', fontFamily: "'Fira Mono', monospace" }}>
          Dashboard
        </div>
        {mainNav.map(item => {
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
              {item.href === '/coordinator/portal' && pendingCount > 0 && (
                <span className="ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(139,32,32,0.3)', color: '#ff9999' }}>
                  {pendingCount}
                </span>
              )}
            </Link>
          );
        })}

        {/* Labs Section */}
        <div className="px-2 pt-4 pb-1 text-[9px] font-bold uppercase tracking-[0.12em]" style={{ color: 'rgba(255,255,255,0.25)', fontFamily: "'Fira Mono', monospace" }}>
          My Labs ({labs.length})
        </div>
        {labs.map(lab => {
          const labPath = `/coordinator/portal/lab/${lab.id}`;
          const isActive = pathname === labPath;
          return (
            <Link
              key={lab.id}
              href={labPath}
              onClick={() => mobile && setSidebarOpen(false)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] font-medium mb-px transition-all duration-150"
              style={{
                color: isActive ? '#8bc97a' : 'rgba(255,255,255,0.45)',
                background: isActive ? 'rgba(106,170,88,0.22)' : 'transparent',
                borderLeft: isActive ? '3px solid #6aaa58' : '3px solid transparent',
              }}
            >
              <span className="w-4 text-center text-[10px]">🔬</span>
              <div className="truncate">
                <div className="truncate">{lab.block}</div>
                <div className="text-[8px] opacity-50" style={{ fontFamily: "'Fira Mono', monospace" }}>{lab.lab_code} | {lab.company_name}</div>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div className="px-2.5 pb-3" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="mt-2.5 px-2.5 py-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.05)' }}>
          <p className="text-[11px] font-semibold text-white">{coordinator.full_name}</p>
          <p className="text-[9px]" style={{ color: 'rgba(255,255,255,0.35)', fontFamily: "'Fira Mono', monospace" }}>
            {coordinator.employee_number} | {coordinator.title}
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full mt-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-bold text-left transition-all"
          style={{ color: 'rgba(255,255,255,0.4)' }}
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

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between px-5 py-3 flex-shrink-0" style={{ background: '#1a2e14', boxShadow: '0 2px 12px rgba(0,0,0,0.2)' }}>
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
              <h1 className="text-sm font-extrabold text-white">Team Leader Dashboard</h1>
              <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.4)', fontFamily: "'Fira Mono', monospace" }}>
                {coordinator.full_name} | {labs.length} labs
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-[7px] h-[7px] rounded-full" style={{ background: '#6aaa58', animation: 'pulse 2s ease infinite' }} />
            <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.45)', fontFamily: "'Fira Mono', monospace" }}>Online</span>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-5" style={{ maxWidth: '1400px' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
