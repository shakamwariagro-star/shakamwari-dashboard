'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/products', label: 'Products' },
  { href: '/contact', label: 'Contact' },
];

export default function PublicHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className="sticky top-0 z-50 transition-all duration-200"
      style={{
        background: scrolled ? 'rgba(246, 244, 239, 0.92)' : 'rgba(246, 244, 239, 0.6)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: scrolled ? '1px solid var(--color-bd)' : '1px solid transparent',
      }}
    >
      <div className="max-w-[1200px] mx-auto px-5 md:px-8 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-3 group">
          <img src="/logo.jpeg" alt="Shakamwari Agro" className="w-10 h-10 rounded-lg object-cover ring-1 ring-black/5" />
          <div className="leading-tight">
            <div className="text-[15px] font-extrabold text-g1 tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
              Shakamwari Agro
            </div>
            <div className="text-[10px] uppercase tracking-[0.12em] text-tx-d font-semibold" style={{ fontFamily: "'Fira Mono', monospace" }}>
              India Pvt Ltd
            </div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((l) => {
            const active = l.href === '/' ? pathname === '/' : pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className="px-4 py-2 rounded-lg text-[13.5px] font-semibold transition-colors"
                style={{
                  color: active ? 'var(--color-g2)' : 'var(--color-tx-d)',
                  background: active ? 'rgba(123, 179, 156, 0.14)' : 'transparent',
                  fontFamily: 'var(--font-body)',
                }}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link href="/login" className="btn-primary">
            Employee Login
          </Link>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="md:hidden p-2 rounded-lg text-g1"
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="md:hidden px-5 pb-4 pt-2 border-t border-bd" style={{ background: 'rgba(246, 244, 239, 0.96)' }}>
          {navLinks.map((l) => {
            const active = l.href === '/' ? pathname === '/' : pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block px-3 py-3 rounded-lg text-[14px] font-semibold mb-1"
                style={{
                  color: active ? 'var(--color-g2)' : 'var(--color-tx-d)',
                  background: active ? 'rgba(123, 179, 156, 0.14)' : 'transparent',
                }}
              >
                {l.label}
              </Link>
            );
          })}
          <Link
            href="/login"
            onClick={() => setOpen(false)}
            className="btn-primary block text-center mt-2"
          >
            Employee Login
          </Link>
        </div>
      )}
    </header>
  );
}
