'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Profile } from '@/lib/types';

const navSections = [
  {
    label: 'Overview',
    items: [
      { href: '/dashboard', label: 'Dashboard', icon: '📊' },
      { href: '/dashboard/labs', label: 'Labs', icon: '🔬' },
    ],
  },
  {
    label: 'Finance',
    items: [
      { href: '/dashboard/billing/approvals', label: 'Bill Approvals', icon: '🧾', roles: ['team_leader', 'admin'] as string[] },
      { href: '/dashboard/expenses', label: 'Expenses', icon: '📤' },
    ],
  },
  {
    label: 'Reports',
    items: [
      { href: '/dashboard/reports/target-achievement', label: 'Target vs Achievement', icon: '🎯' },
      { href: '/dashboard/reports/coordinators', label: 'Coordinator Summary', icon: '👥' },
      { href: '/dashboard/reports/payments', label: 'Payment Tracker', icon: '💳' },
      { href: '/dashboard/reports/pipeline', label: 'Sample Pipeline', icon: '🔄' },
      { href: '/dashboard/reports/activity', label: 'Activity Log', icon: '📝' },
    ],
  },
  {
    label: 'Operations',
    items: [
      { href: '/dashboard/dispatch', label: 'Dispatch', icon: '📨', roles: ['team_leader', 'admin'] as string[] },
    ],
  },
  {
    label: 'Portals',
    items: [
      { href: '/expert/login', label: 'Expert Portal', icon: '🌾', roles: ['admin', 'team_leader'] as string[] },
      { href: '/coordinator/login', label: 'Coordinator Panel', icon: '📋', roles: ['admin', 'team_leader'] as string[] },
    ],
  },
];

interface SidebarProps {
  profile: Profile | null;
  onClose?: () => void;
}

export default function Sidebar({ profile, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={`flex-shrink-0 flex flex-col h-screen overflow-y-auto ${onClose ? 'w-full sm:w-[260px]' : 'w-[220px]'}`}
      style={{
        background: 'linear-gradient(180deg, #1c2b2a 0%, #14201f 100%)',
        backgroundImage: 'linear-gradient(165deg, rgba(123,179,156,0.10) 0%, transparent 50%), linear-gradient(180deg, #1c2b2a 0%, #14201f 100%)',
        borderRight: '1px solid rgba(255,255,255,0.04)',
        boxShadow: 'inset -1px 0 0 rgba(255,255,255,0.02)',
      }}
    >
      {/* Brand + Close button */}
      <div className="px-4 pt-4 pb-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-[9px]">
            <img src="/logo.jpeg" alt="Shakamwari Agro" className="w-9 h-9 rounded-lg object-cover" />
            <div>
              <div className="text-[13.5px] font-extrabold text-white tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>Shakamwari Agro</div>
              <div
                className="text-[9px] uppercase tracking-[0.1em]"
                style={{ color: 'rgba(255,255,255,0.35)', fontFamily: "'Fira Mono', monospace" }}
              >
                India Pvt Ltd
              </div>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
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

      {/* Navigation */}
      <nav className="flex-1 px-2 py-2.5">
        {navSections.map((section) => {
          const visibleItems = section.items.filter(
            (item) => !item.roles || (profile && item.roles.includes(profile.role))
          );
          if (visibleItems.length === 0) return null;
          return (
            <div key={section.label}>
              <div
                className="px-2 pt-3 pb-1 text-[9px] font-bold uppercase tracking-[0.12em]"
                style={{ color: 'rgba(255,255,255,0.25)', fontFamily: "'Fira Mono', monospace" }}
              >
                {section.label}
              </div>
              {visibleItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className="flex items-center gap-[9px] px-2.5 py-2 rounded-[9px] text-[12.5px] font-medium mb-px transition-all duration-150"
                    style={{
                      color: isActive ? '#b8d9cb' : 'rgba(255,255,255,0.55)',
                      background: isActive
                        ? 'linear-gradient(90deg, rgba(123,179,156,0.18), rgba(123,179,156,0.04))'
                        : 'transparent',
                      borderLeft: isActive ? '2px solid #7bb39c' : '2px solid transparent',
                      fontFamily: "'Nunito', sans-serif",
                      boxShadow: isActive ? 'inset 0 0 0 1px rgba(123,179,156,0.10)' : 'none',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.07)';
                        e.currentTarget.style.color = 'rgba(255,255,255,0.85)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = 'rgba(255,255,255,0.5)';
                      }
                    }}
                  >
                    <span className="w-[18px] text-center text-sm">{item.icon}</span>
                    {item.label}
                  </Link>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* Footer - Sync Status */}
      <div className="px-2 py-2.5" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="flex items-center gap-1.5 px-2.5 py-2 rounded-[9px]" style={{ background: 'rgba(255,255,255,0.05)' }}>
          <div
            className="w-[7px] h-[7px] rounded-full flex-shrink-0"
            style={{ background: '#7bb39c', boxShadow: '0 0 8px rgba(123,179,156,0.6)', animation: 'pulse 2s ease infinite' }}
          />
          <div>
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.45)', fontFamily: "'Fira Mono', monospace" }}>
              Live Dashboard
            </div>
          </div>
        </div>
        {profile && (
          <div className="mt-2 px-2.5 py-2 rounded-[9px]" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <p className="text-xs font-semibold text-white">{profile.full_name}</p>
            <p className="text-[10px] capitalize" style={{ color: 'rgba(255,255,255,0.35)' }}>
              {profile.role.replace('_', ' ')}
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
