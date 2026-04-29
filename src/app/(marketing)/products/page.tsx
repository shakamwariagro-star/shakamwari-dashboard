import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FPO Products — Shakamwari Agro India Pvt Ltd',
  description:
    'Buy direct from our network of 16 Farmer Producer Companies — natural and organic produce, oils, spices, dal and more, listed on ONDC Mystore.',
};

const fpcProducts = [
  { name: 'Silwani Farmer Producer Company', logo: '/images/products/fpc-1.jpeg', url: 'https://www.mystore.in/en/seller/silwani-farmer-producer-company-limited' },
  { name: 'Raisen Trade Producer Company', logo: '/images/products/fpc-2.png', url: 'https://www.mystore.in/en/seller/raisen-trade-farmer-producer-company-limited' },
  { name: 'Bareli Farmer Producer Company', logo: '/images/products/fpc-4.png', url: 'https://www.mystore.in/en/seller/baraily-crop-producer-company-limited' },
  { name: 'Udaipura Farmer Producer Company', logo: '/images/products/fpc-5.jpeg', url: 'https://www.mystore.in/en/seller/udaipura-farmer-producer-company-limited' },
  { name: 'Sheopur Crop Producer Company', logo: '/images/products/fpc-6.png', url: 'https://www.mystore.in/en/seller/sheopur-crop-producer-company-limited' },
  { name: 'Kunoo Farmer Producer Company', logo: '/images/products/fpc-7.jpeg', url: 'https://www.mystore.in/en/seller/kunno-farmer-producer-company-ltd_emlsd0vj' },
  { name: 'Shrivijaypur Agro Producer Company', logo: '/images/products/fpc-8.jpeg', url: 'https://www.mystore.in/en/seller/shrivijaypur-agro-producer-company-limited' },
  { name: 'Porsa Crop Producer Company', logo: '/images/products/fpc-9.jpeg', url: 'https://www.mystore.in/en/seller/porsa-crop-producer-company-limited' },
  { name: 'Gohad-Trade Farmer Producer Company', logo: '/images/products/fpc-10.png', url: 'https://www.mystore.in/en/seller/gohad-trade-farmer-producer-company' },
  { name: 'Ganjbasoda Farmer Producer Company', logo: '/images/products/fpc-11.jpeg', url: 'https://www.mystore.in/en/seller/ganjbasoda-farmer-producer-company-limited' },
  { name: 'Narmadavahini Organic Farmer Producer Company', logo: '/images/products/fpc-12.jpeg', url: 'https://www.mystore.in/en/seller/narmadavahini-organic-farmer-producer-company' },
  { name: 'NF Sanchi Agro Producer Company', logo: '/images/products/fpc-13.jpeg', url: 'https://www.mystore.in/en/seller/nfsanchi-agro-producer-company-limited' },
  { name: 'Agrikuno Natural Farming Producer Company', logo: '/images/products/fpc-14.jpeg', url: 'https://www.mystore.in/en/seller/agrikuno-natural-farming-producer-company-limited' },
  { name: 'Apnaa Chambal Natural Farming Producer Company', logo: '/images/products/fpc-15.jpeg', url: 'https://www.mystore.in/en/seller/apnaa-chambal-natural-farming-producer-company-limited' },
];

export default function ProductsPage() {
  return (
    <>
      {/* HEADER */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              'radial-gradient(circle at 20% 0%, rgba(163,205,185,0.4), transparent 50%), radial-gradient(circle at 90% 30%, rgba(212,180,131,0.18), transparent 45%), var(--color-cream)',
          }}
        />
        <div className="max-w-[1200px] mx-auto px-5 md:px-8 pt-16 md:pt-24 pb-10">
          <div className="sec-label">Products</div>
          <h1
            className="text-[38px] md:text-[54px] leading-[1.05] font-extrabold text-g1 tracking-tight max-w-4xl mb-5"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Buy direct from our
            <br />
            <span className="text-g3">Farmer Producer Companies.</span>
          </h1>
        </div>
      </section>

      {/* PRODUCT GRID */}
      <section className="max-w-[1200px] mx-auto px-5 md:px-8 py-12 md:py-16 border-t border-bd">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {fpcProducts.map((p) => (
            <a
              key={p.url}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-[16px] bg-white ring-1 ring-black/5 hover:ring-g4 transition-all hover:-translate-y-1 flex flex-col"
              style={{ boxShadow: 'var(--shadow-card)' }}
            >
              <div className="aspect-square flex items-center justify-center p-6 bg-parch">
                <img
                  src={p.logo}
                  alt={`${p.name} logo`}
                  className="max-h-full max-w-full object-contain transition-transform group-hover:scale-105"
                />
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between gap-2">
                <h3
                  className="text-[13.5px] font-extrabold text-g1 leading-tight"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {p.name}
                </h3>
                <div className="text-[12px] font-bold text-g3 group-hover:text-g2 transition-colors flex items-center gap-1">
                  Shop on Mystore
                  <span aria-hidden>→</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* MYSTORE INFO */}
      <section className="max-w-[1200px] mx-auto px-5 md:px-8 py-12 md:py-16">
        <div
          className="rounded-[24px] p-10 md:p-12 ring-1 ring-black/5"
          style={{
            background: 'linear-gradient(135deg, var(--color-parch), rgba(163,205,185,0.18))',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-8">
              <div
                className="text-[10.5px] uppercase tracking-[0.14em] font-bold text-g3 mb-2"
                style={{ fontFamily: "'Fira Mono', monospace" }}
              >
                Powered by ONDC Mystore
              </div>
              <h2
                className="text-[24px] md:text-[30px] font-extrabold text-g1 tracking-tight mb-3 leading-tight"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Why buy direct from an FPO?
              </h2>
              <p className="text-[14px] text-tx-d leading-relaxed mb-2">
                A Farmer Producer Company is owned by the farmers who grow the produce. Buying
                direct means a fair price for the grower, traceable origins for the buyer, and
                no exploitation in between.
              </p>
              <p className="text-[14px] text-tx-d leading-relaxed">
                Our partner FPCs are listed on the Government of India&apos;s ONDC Mystore — a verified,
                regulated marketplace built specifically for producer organisations.
              </p>
            </div>
            <div className="md:col-span-4 flex md:justify-end">
              <a
                href="https://www.mystore.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                Visit Mystore →
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
