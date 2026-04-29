import Link from 'next/link';

export default function PublicFooter() {
  const year = new Date().getFullYear();
  return (
    <footer
      className="mt-24 text-tx-d"
      style={{
        background: 'linear-gradient(180deg, transparent 0%, rgba(31,58,46,0.04) 100%)',
        borderTop: '1px solid var(--color-bd)',
      }}
    >
      <div className="max-w-[1200px] mx-auto px-5 md:px-8 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <img src="/logo.jpeg" alt="Shakamwari Agro" className="w-10 h-10 rounded-lg object-cover ring-1 ring-black/5" />
            <div className="leading-tight">
              <div className="text-[15px] font-extrabold text-g1" style={{ fontFamily: 'var(--font-heading)' }}>
                Shakamwari Agro
              </div>
              <div className="text-[10px] uppercase tracking-[0.12em] text-tx-d font-semibold" style={{ fontFamily: "'Fira Mono', monospace" }}>
                India Pvt Ltd
              </div>
            </div>
          </div>
          <p className="text-[13px] leading-relaxed mb-3">
            Empowering Agriculture, Enriching Lives.
          </p>
          <p className="text-[12px] leading-relaxed text-tx-f">
            CIN: U01100MP2016PTC041775<br />
            Incorporated 3 December 2016
          </p>
        </div>

        <div>
          <h4 className="text-[12px] font-bold uppercase tracking-[0.1em] text-g2 mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
            Explore
          </h4>
          <ul className="space-y-2.5 text-[13.5px]">
            <li><Link href="/" className="hover:text-g3 transition-colors">Home</Link></li>
            <li><Link href="/about" className="hover:text-g3 transition-colors">About Us</Link></li>
            <li><Link href="/services" className="hover:text-g3 transition-colors">Our Services</Link></li>
            <li><Link href="/contact" className="hover:text-g3 transition-colors">Contact</Link></li>
            <li><Link href="/login" className="hover:text-g3 transition-colors">Employee Login</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-[12px] font-bold uppercase tracking-[0.1em] text-g2 mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
            Our Verticals
          </h4>
          <ul className="space-y-2.5 text-[13.5px]">
            <li><Link href="/services#soil-labs" className="hover:text-g3 transition-colors">Soil Testing Labs</Link></li>
            <li><Link href="/services#fpc" className="hover:text-g3 transition-colors">Farmer Producer Companies</Link></li>
            <li><Link href="/services#fisheries" className="hover:text-g3 transition-colors">PM-MKSSY Fisheries</Link></li>
            <li><Link href="/services#training" className="hover:text-g3 transition-colors">Training & Capacity Building</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-[12px] font-bold uppercase tracking-[0.1em] text-g2 mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
            Reach Us
          </h4>
          <ul className="space-y-3 text-[13px] leading-relaxed">
            <li className="flex gap-2">
              <span>📍</span>
              <span>B-99, Priyadarshini Colony,<br />Bagsewaniya, Bhopal,<br />Madhya Pradesh — 462043</span>
            </li>
            <li className="flex gap-2">
              <span>📞</span>
              <a href="tel:+919981361626" className="hover:text-g3 transition-colors">+91 99813 61626</a>
            </li>
            <li className="flex gap-2">
              <span>✉️</span>
              <a href="mailto:shakamwariagro@gmail.com" className="hover:text-g3 transition-colors break-all">shakamwariagro@gmail.com</a>
            </li>
          </ul>
        </div>
      </div>

      <div
        className="border-t border-bd"
        style={{ background: 'rgba(31,58,46,0.03)' }}
      >
        <div className="max-w-[1200px] mx-auto px-5 md:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] text-tx-f">
          <div>© {year} Shakamwari Agro (India) Pvt Ltd. All rights reserved.</div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-g4" style={{ boxShadow: '0 0 6px rgba(123,179,156,0.6)' }} />
            <span>Working in MP & UP since 2016</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
