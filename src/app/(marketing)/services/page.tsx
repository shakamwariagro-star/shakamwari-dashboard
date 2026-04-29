import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';

const photoPositions: Record<string, string> = {
  '/images/work/soil-lab-vijaypur-building.jpg': 'center 30%',
  '/images/work/soil-lab-field-distribution.jpg': 'center 35%',
  '/images/work/soil-lab-technician.jpg': 'center 25%',
  '/images/work/soil-lab-interior.jpg': 'center 40%',
  '/images/work/soil-lab-students-visit.jpg': 'center 35%',
};

export const metadata: Metadata = {
  title: 'Services — Shakamwari Agro India Pvt Ltd',
  description:
    'Soil testing lab consultancy, Farmer Producer Company (FPC) promotion, PM-MKSSY fisheries cooperative strengthening, and farmer training — across MP and UP.',
};

const services = [
  {
    id: 'soil-labs',
    eyebrow: '01 — Soil Testing',
    title: 'Soil Testing Lab',
    summary:
      'We support 45 soil testing laboratories across Madhya Pradesh — turning everyday samples into clear, plot-level guidance that helps farmers grow more, hire locally and farm without exhausting their land.',
    points: [],
    sections: [
      {
        heading: 'Higher yields, smarter inputs',
        body:
          'For generations, farmers here have used the same urea dose on every field — a habit that wasted money and stressed the soil. Our labs replace that with a per-plot Soil Health Card showing exactly how much Nitrogen, Phosphorus and Potassium a field needs. Once micro-nutrient gaps like zinc and boron are corrected, growers commonly report a 20–25% jump in yield within a single season.',
      },
      {
        heading: 'Green-collar jobs that stay in the village',
        body:
          'Every lab we run with local hands — technicians, sample handlers, data operators — and we hire from the surrounding villages first. Agriculture graduates and rural youth get skilled, high-tech work close to home, which is a small but real answer to the migration of young people into already-crowded cities.',
      },
      {
        heading: 'Soil that outlives the next generation',
        body:
          'Routine over-fertilization quietly damages pH balance and leaches into groundwater. Test first, fertilize second — that is the discipline our labs build into the farming cycle. The result is sustainable intensification: more output today, without trading away the land that has to feed the next generation.',
      },
    ],
    highlights: [
      'Known across the region for fast turnaround and reliable results',
      'School and college students regularly visit to see how soil testing actually works',
      'Hands-on practice on mini testing kits — practical learning, not just lectures',
    ],
    photos: [
      '/images/work/soil-lab-vijaypur-building.jpg',
      '/images/work/soil-lab-students-visit.jpg',
      '/images/work/soil-lab-field-distribution.jpg',
      '/images/work/soil-lab-technician.jpg',
      '/images/work/soil-lab-interior.jpg',
      '/images/work/soil-lab-reagents.jpg',
    ],
    badge: '45 Labs · Madhya Pradesh',
  },
  {
    id: 'fpc',
    eyebrow: '02 — Farmer Producer Organizations',
    title: 'FPO Project',
    summary:
      'In 2022, SFAC allotted 25 Farmer Producer Companies (FPCs) to Shakamwari Agro for promotion and incubation — including 6 dedicated to natural farming. We walk each FPC through the full five-year journey, from mobilising farmers in a single village cluster to running a registered company with members, working capital and steady buyers.',
    points: [],
    sections: [
      {
        heading: 'From scattered farmers to a registered company',
        body:
          'Most member farmers come from villages that have never had a formal producer body. We start at the ground — door-to-door mobilisation, share-capital meetings, board elections — and take each cluster all the way through registration as a legally compliant Farmer Producer Company under the Companies Act. By the end of year one, every FPC has a working board, a member register and statutory books in order.',
      },
      {
        heading: 'Equity, credit and government scheme access',
        body:
          'A registered company is only useful if it has working capital. We file each FPC for SFAC\u2019s equity-grant matching (up to \u20B915 lakh per company), draft a written business plan, and tie the FPC up with NABARD and partner banks for working-capital and infrastructure loans. We also help members access input subsidies, crop insurance and other state-level schemes most small farmers never see on their own.',
      },
      {
        heading: 'Six FPOs built around natural farming',
        body:
          'Six of our 25 allotted FPOs are dedicated to natural farming \u2014 producing organic basmati, toor dal, cold-pressed oils and spices without chemical inputs. These FPOs have their own branding, trade-fair stalls and a growing list of urban buyers, and they regularly represent Shakamwari Agro at events like Krishi Mahotsav, Silwani Mela and the SFAC Natural Farming pavilions.',
      },
      {
        heading: 'Markets, branding and trade fairs',
        body:
          'A producer company without a buyer is just paperwork. Our market team links member produce to wholesale buyers, retail chains, exporters and direct-to-consumer fair stalls. Our FPCs \u2014 Silwani, Narmadavahini Organic, Apna Pamla, NF Sanchi Agro and others \u2014 have built a recognisable presence across MP trade fairs and increasingly outside the state too.',
      },
    ],
    highlights: [
      '25 Farmer Producer Companies allotted by SFAC in 2022 — full incubation across MP & UP',
      '6 dedicated Natural Farming FPOs with their own brands and fair stalls',
      'End-to-end support — mobilisation, registration, equity grants, credit and market linkages',
    ],
    photos: [
      '/images/work/fpc-apna-pamla-field.jpg',
      '/images/work/fpc-byohari-office.jpg',
      '/images/work/fpc-nf-sanchi-office.jpg',
      '/images/work/fpc-input-counter.jpg',
      '/images/work/fpc-team-meeting.jpg',
    ],
    badge: '25 FPCs · 6 Natural Farming · SFAC 2022',
  },
  {
    id: 'fisheries',
    eyebrow: '03 — Fisheries',
    title: 'Fisheries Project',
    summary:
      'Awarded to Shakamwari Agro by SFAC in 2025 under the Pradhan Mantri Matsya Kisan Samridhi Sah-Yojna (PM-MKSSY), this project strengthens 45 fisheries cooperative societies across Madhya Pradesh — verifying and registering each one on the NFDP portal and taking it through the full transition into a Fish Farmer Producer Organization (FFPO).',
    points: [],
    sections: [
      {
        heading: 'NFDP verification and gap analysis',
        body:
          'Each of the 45 fisheries cooperatives is first verified and registered on the National Fisheries Digital Platform (NFDP) — bringing decades-old societies into the official system. We then run a detailed gap analysis on every society: governance, statutory compliance, member records, infrastructure and finances. The output is a clear picture of what each cooperative has, what it lacks, and what it needs to function as a professional FFPO.',
      },
      {
        heading: 'Business plans, training and capacity building',
        body:
          'On top of the gap analysis we draft a written business plan for every society — one a bank or a buyer can actually act on. Boards and members go through structured training in cooperative governance, basic accounting, aquaculture practice, harvest and post-harvest handling, so day-to-day operations are run by the members themselves rather than by outside agents.',
      },
      {
        heading: 'Market linkage, credit linkage and business development',
        body:
          'A registered, well-run FFPO is only useful if its catch reaches the right buyer at the right price. We connect members to wholesale and institutional buyers, tie societies up with banks and cooperatives for working-capital credit, and help them access PM-MKSSY and PMMSY benefits — so the FFPO grows from a paper entity into a working business.',
      },
    ],
    highlights: [
      'Awarded by SFAC in 2025 under the PM-MKSSY scheme',
      '45 fisheries cooperative societies verified and registered on the NFDP portal',
      'End-to-end FFPO transition — gap analysis, business plan, training, market and credit linkages',
    ],
    photos: [
      '/images/work/fisheries-lingmara-pond.jpg',
      '/images/work/fisheries-singodi-society.jpg',
      '/images/work/fisheries-seoni-matsyaki-divas.jpg',
      '/images/work/fisheries-customer-service-point.jpg',
      '/images/work/fisheries-balaghat-pond.jpg',
      '/images/work/fisheries-mehta-pond.jpg',
      '/images/work/fisheries-mohadi-pond.jpg',
    ],
    photoAspect: '16/9' as const,
    badge: 'PM-MKSSY · SFAC 2025 · 45 Societies',
  },
  {
    id: 'training',
    eyebrow: '04 — Capacity Building',
    title: 'Farmer & Field-Staff Training',
    summary:
      'A cross-cutting service that runs through every project — from farmer awareness camps to formal training programs for cooperative board members and our own field staff.',
    points: [
      'On-field demonstrations and farmer awareness camps',
      'Board training for cooperative directors (governance, accounting, compliance)',
      'Workshops on natural farming, soil health, integrated pest management',
      'Internships and field placements for agriculture college students',
      'Industrial visits hosted at our partner soil testing labs',
    ],
    photos: [
      '/images/work/training-business-plan-workshop.jpg',
      '/images/work/training-sai-session.jpg',
      '/images/work/training-staff-session.jpg',
      '/images/work/training-farmers-meeting.jpg',
      '/images/work/workshop-poster.jpg',
      '/images/work/event-community-meal.jpg',
      '/images/work/team-students-field.jpg',
    ],
    badge: 'Year-round programs',
  },
];

export default function ServicesPage() {
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
        <div className="max-w-[1200px] mx-auto px-5 md:px-8 pt-16 md:pt-24 pb-12">
          <div className="sec-label">What We Do</div>
          <h1
            className="text-[38px] md:text-[54px] leading-[1.05] font-extrabold text-g1 tracking-tight max-w-4xl mb-5"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Four services. One thread —
            <br />
            <span className="text-g3">making rural agriculture stronger.</span>
          </h1>
          <p className="text-[16px] text-tx-d max-w-2xl">
            From soil samples to fish ponds, Shakamwari Agro's services span the full
            journey of organizing, advising, and uplifting Indian farmers.
          </p>

          {/* Quick nav */}
          <div className="mt-8 flex flex-wrap gap-2">
            {services.map((s, i) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="px-3 py-1.5 rounded-full text-[12px] font-bold border border-bd2 text-g2 hover:bg-white/40 transition-colors"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {String(i + 1).padStart(2, '0')} · {s.title.split(' ').slice(0, 2).join(' ')}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <div className="max-w-[1200px] mx-auto px-5 md:px-8">
        {services.map((s, idx) => (
          <section
            id={s.id}
            key={s.id}
            className="scroll-mt-24 py-16 md:py-20 border-t border-bd"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              <div className="lg:col-span-5">
                <div
                  className="text-[11px] uppercase tracking-[0.14em] font-bold text-g3 mb-3"
                  style={{ fontFamily: "'Fira Mono', monospace" }}
                >
                  {s.eyebrow}
                </div>
                <h2
                  className="text-[28px] md:text-[36px] font-extrabold text-g1 tracking-tight leading-tight mb-4"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {s.title}
                </h2>
                <span
                  className="inline-block px-3 py-1 rounded-full text-[10.5px] font-bold uppercase tracking-wider mb-5"
                  style={{ background: 'var(--color-ok-bg)', color: 'var(--color-ok)' }}
                >
                  {s.badge}
                </span>
                <p className="text-[14.5px] leading-relaxed text-tx-d mb-6">{s.summary}</p>

                {'sections' in s && Array.isArray((s as { sections?: unknown }).sections) && (
                  <div className="space-y-5 mb-6">
                    {(s as { sections: { heading: string; body: string }[] }).sections.map((sec) => (
                      <div key={sec.heading}>
                        <h3
                          className="text-[15px] font-extrabold text-g1 mb-1.5"
                          style={{ fontFamily: 'var(--font-heading)' }}
                        >
                          {sec.heading}
                        </h3>
                        <p className="text-[13.5px] leading-relaxed text-tx">{sec.body}</p>
                      </div>
                    ))}
                  </div>
                )}

                {'liveDemo' in s && (s as { liveDemo?: { href: string; label: string } }).liveDemo && (
                  <a
                    href={(s as { liveDemo: { href: string; label: string } }).liveDemo.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary inline-flex items-center gap-2 mb-6"
                  >
                    📊 {(s as { liveDemo: { href: string; label: string } }).liveDemo.label} →
                  </a>
                )}

                {'highlights' in s && Array.isArray((s as { highlights?: unknown }).highlights) && (
                  <div
                    className="rounded-[14px] p-4 mb-6"
                    style={{ background: 'var(--color-ok-bg)', border: '1px solid var(--color-ok)' }}
                  >
                    <ul className="space-y-2">
                      {(s as { highlights: string[] }).highlights.map((h) => (
                        <li key={h} className="flex gap-2.5 text-[13px] text-g1 leading-relaxed">
                          <span className="text-g3 font-bold">✓</span>
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <ul className="space-y-3">
                  {s.points.map((p) => (
                    <li key={p} className="flex gap-3 text-[13.5px] text-tx leading-relaxed">
                      <span className="flex-shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-g4" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="lg:col-span-7">
                <div className="grid grid-cols-2 gap-3">
                  {s.photos.map((src, i) => (
                    <div
                      key={src}
                      className={`relative overflow-hidden rounded-[14px] ring-1 ring-black/5 ${
                        i === 0 && s.photos.length >= 4
                          ? 'col-span-2 aspect-[16/9]'
                          : (s as { photoAspect?: string }).photoAspect === '16/9'
                            ? 'aspect-[16/9]'
                            : 'aspect-[4/3]'
                      }`}
                      style={{ boxShadow: 'var(--shadow-card)' }}
                    >
                      <Image
                        src={src}
                        alt=""
                        fill
                        sizes={i === 0 && s.photos.length >= 4 ? '(max-width: 1024px) 100vw, 700px' : '(max-width: 1024px) 50vw, 350px'}
                        quality={90}
                        className="object-cover hover:scale-105 transition-transform duration-500"
                        style={{ objectPosition: photoPositions[src] || 'center' }}
                        priority={idx === 0 && i === 0}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* TRUST */}
      <section className="max-w-[1200px] mx-auto px-5 md:px-8 mt-12">
        <div
          className="rounded-[24px] p-10 md:p-14 ring-1 ring-black/5"
          style={{
            background: 'linear-gradient(135deg, #1f3a2e 0%, #2d5545 100%)',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          <div
            className="text-[11px] uppercase tracking-[0.14em] font-bold text-g6 mb-3"
            style={{ fontFamily: "'Fira Mono', monospace" }}
          >
            Government Empaneled & Recognized
          </div>
          <h2
            className="text-[24px] md:text-[32px] font-extrabold text-white tracking-tight leading-tight mb-8 max-w-3xl"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Working alongside India's most important agriculture institutions.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: 'SFAC', sub: "Small Farmers' Agribusiness Consortium" },
              { name: 'Min. of Fisheries', sub: 'Animal Husbandry & Dairying' },
              { name: 'PM-MKSSY', sub: 'Pradhan Mantri Matsya Kisan Samriddhi Sah-Yojana' },
              { name: 'MP Krishi Vibhag', sub: 'Madhya Pradesh Department of Agriculture' },
            ].map((p) => (
              <div
                key={p.name}
                className="rounded-[14px] p-5"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.10)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <div
                  className="text-[18px] font-extrabold text-white mb-1"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {p.name}
                </div>
                <div className="text-[11.5px] text-g7 leading-snug">{p.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-[1200px] mx-auto px-5 md:px-8 mt-16">
        <div
          className="rounded-[24px] p-10 md:p-12 text-center ring-1 ring-black/5"
          style={{
            background: 'linear-gradient(135deg, var(--color-parch), rgba(163,205,185,0.18))',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          <h2
            className="text-[24px] md:text-[32px] font-extrabold text-g1 tracking-tight mb-4 max-w-3xl mx-auto leading-tight"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Have a project in mind? Need a CBBO partner, FPC consultant, or training facilitator?
          </h2>
          <p className="text-[14.5px] text-tx-d max-w-xl mx-auto mb-7">
            We respond to every genuine inquiry within 48 hours.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/contact" className="btn-primary">
              Talk to Our Team
            </Link>
            <Link
              href="tel:+919981361626"
              className="px-4 py-2 rounded-[12px] text-[13px] font-bold border border-bd2 text-g1 hover:bg-white/60 transition-colors"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              📞 +91 99813 61626
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
