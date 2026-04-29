import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About — Shakamwari Agro India Pvt Ltd',
  description:
    'Founded in 2016 in Bhopal, Shakamwari Agro India Private Limited works with farmers, cooperatives, and government schemes across Madhya Pradesh and Uttar Pradesh.',
};

const coreTeam = [
  { role: 'Manager', photo: '/images/team/core/manager.jpg' },
  { role: 'Team Lead', photo: '/images/team/core/team-lead.jpg' },
  { role: 'Assistant Project Manager', photo: '/images/team/core/assistant-project-manager.jpg' },
  { role: 'IT Expert', photo: '/images/team/core/it-expert.jpg' },
  { role: 'FPO Expert', photo: '/images/team/core/fpo-expert.jpg' },
  { role: 'Fisheries Expert', photo: '/images/team/core/fisheries-expert.jpg' },
  { role: 'Soil Testing Expert', photo: '/images/team/core/training-expert.jpg' },
  { role: 'Training Expert', photo: '/images/team/core/soil-testing-expert.jpg' },
];

const achievements = [
  {
    icon: '🏆',
    headline: 'Madhya Pradesh Gaurav Ratan 2025',
    year: '2025',
    body: 'Honoured with the Madhya Pradesh Gaurav Ratan award for our work in agriculture services and rural development across the state.',
    photo: '/images/achievements/mp-gaurav-ratan.jpg',
  },
  {
    icon: '🌱',
    headline: 'APEDA — Biofach 2025',
    year: '2025',
    body: 'Invited by APEDA to represent our member FPCs at Biofach 2025, the world\u2019s leading trade fair for organic food and natural produce.',
    photo: '/images/achievements/biofach.jpg',
  },
  {
    icon: '🎪',
    headline: 'Unnat Krishi Mahotsav 2026',
    year: '2026',
    body: 'Represented our natural farming FPOs at Unnat Krishi Mahotsav 2026, one of central India\u2019s largest agriculture exhibitions.',
    photo: '/images/achievements/unnat-krishi.jpg',
  },
  {
    icon: '✈️',
    headline: 'Dubai International Exhibition',
    year: '2025',
    body: 'Traded natural farming products at the Dubai Exhibition Centre \u2014 taking our member FPCs into the international market for the first time.',
    photo: '/images/achievements/dubai.jpg',
  },
  {
    icon: '🛒',
    headline: 'FPO Products on E-Commerce',
    year: 'Ongoing',
    body: 'FPO products from our network are now selling direct-to-consumer through ONDC Mystore and other major e-commerce platforms.',
    photo: '/images/achievements/e-commerce.jpg',
  },
  {
    icon: '🎉',
    headline: 'Atmanirbhar Bharat Utsav',
    year: '2024 · Pragati Maidan',
    body: 'Selected by SFAC to take part in the Atmanirbhar Bharat Utsav at Pragati Maidan, New Delhi \u2014 showcasing our member FPCs alongside the country\u2019s leading producer organisations.',
    photo: '/images/achievements/atmanirbhar.jpg',
  },
];

const values = [
  {
    icon: '🤝',
    title: 'On the Ground',
    body: 'We meet farmers in their fields, not in conference rooms. Every recommendation comes from real soil, real ponds, real challenges.',
  },
  {
    icon: '🎓',
    title: 'Local Talent',
    body: 'We hire agriculture students and rural professionals — the people closest to the problem build the strongest solutions.',
  },
  {
    icon: '🛡️',
    title: 'Government-Empaneled',
    body: 'Our work is recognized by SFAC, the Ministry of Fisheries, and state agriculture departments — credibility farmers can trust.',
  },
  {
    icon: '🌱',
    title: 'Long-Term Thinking',
    body: 'A decade of consistent work — not chasing trends. Building cooperatives, capacity, and community wealth that compounds.',
  },
];

export default function AboutPage() {
  return (
    <>
      {/* HEADER */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              'radial-gradient(circle at 80% 0%, rgba(163,205,185,0.4), transparent 50%), var(--color-cream)',
          }}
        />
        <div className="max-w-[1200px] mx-auto px-5 md:px-8 pt-16 md:pt-24 pb-12">
          <div className="sec-label">About Us</div>
          <h1
            className="text-[38px] md:text-[54px] leading-[1.05] font-extrabold text-g1 tracking-tight max-w-4xl"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            A decade of working with farmers,
            <br />
            <span className="text-g3">cooperatives, and government</span> to lift rural India.
          </h1>
        </div>
      </section>

      {/* STORY */}
      <section className="max-w-[1200px] mx-auto px-5 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-7">
          <h2
            className="text-[24px] font-extrabold text-g1 mb-4"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Our Story
          </h2>
          <div className="space-y-4 text-[15px] leading-relaxed text-tx-d">
            <p>
              <strong className="text-g2">Shakamwari Agro (India) Private Limited</strong> was incorporated on
              <strong> 3 December 2016</strong> in Bhopal, Madhya Pradesh, with one mission:
              to bring science, structure, and dignity to the agricultural lives of farmers in
              central India.
            </p>
            <p>
              Indian agriculture's biggest problems are not technical — they are organizational. Small landholdings,
              weak bargaining power, scattered access to government schemes, and a chronic lack of trustworthy
              guidance at the village level. From day one, we set out to be that bridge.
            </p>
            <p>
              We started with <strong className="text-g2">soil testing lab consultancy</strong> — the simplest, most
              evidence-based starting point for any farmer. From there, our work grew naturally into{' '}
              <strong className="text-g2">forming and incubating Farmer Producer Companies</strong> in 2022, when
              SFAC allotted 25 FPCs to us — including 6 dedicated to natural farming. Today, we are also a Cluster
              Based Business Organization for the <strong className="text-g2">PM-MKSSY fisheries program</strong>,
              strengthening fisheries cooperatives across MP.
            </p>
            <p>
              We also believe deeply in <strong className="text-g2">creating rural employment</strong> — most of our
              field team comes from agricultural colleges and the very villages where we work.
            </p>
          </div>
        </div>

        <div className="lg:col-span-5 lg:sticky lg:top-24">
          <div
            className="rounded-[18px] overflow-hidden ring-1 ring-black/5"
            style={{ boxShadow: 'var(--shadow-card)' }}
          >
            <img
              src="/images/team/team-festive.jpg"
              alt="Shakamwari Agro team"
              className="w-full h-[360px] object-cover"
            />
          </div>
          <div
            className="mt-4 rounded-[14px] p-5 ring-1 ring-black/5"
            style={{ background: 'var(--color-parch)', boxShadow: 'var(--shadow-card)' }}
          >
            <div
              className="text-[10.5px] uppercase tracking-[0.12em] font-bold text-g3 mb-1"
              style={{ fontFamily: "'Fira Mono', monospace" }}
            >
              Director
            </div>
            <div
              className="text-[18px] font-extrabold text-g1 mb-1"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Mukesh Raghuwanshi
            </div>
            <div className="text-[12.5px] text-tx-d">
              Director, Shakamwari Agro India Pvt Ltd
            </div>
          </div>
        </div>
      </section>

      {/* VISION / MISSION */}
      <section className="max-w-[1200px] mx-auto px-5 md:px-8 mt-24 grid grid-cols-1 md:grid-cols-2 gap-5">
        <div
          className="rounded-[18px] p-8 ring-1 ring-black/5"
          style={{
            background: 'linear-gradient(135deg, rgba(163,205,185,0.25), var(--color-parch))',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          <div className="text-3xl mb-3">🎯</div>
          <h3 className="text-[20px] font-extrabold text-g1 mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
            Our Mission
          </h3>
          <p className="text-[14px] text-tx-d leading-relaxed">
            To deliver evidence-based agriculture services — soil testing, FPC promotion, fisheries
            strengthening, and capacity building — that increase farm income, build rural cooperatives, and
            create dignified employment for the next generation of agri professionals.
          </p>
        </div>
        <div
          className="rounded-[18px] p-8 ring-1 ring-black/5"
          style={{
            background: 'linear-gradient(135deg, rgba(212,180,131,0.18), var(--color-parch))',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          <div className="text-3xl mb-3">🌅</div>
          <h3 className="text-[20px] font-extrabold text-g1 mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
            Our Vision
          </h3>
          <p className="text-[14px] text-tx-d leading-relaxed">
            A central India where every small and marginal farmer is part of a strong producer
            organization — with access to fair prices, quality inputs, modern science, and government
            schemes — and where rural youth see agriculture as a career, not an escape.
          </p>
        </div>
      </section>

      {/* VALUES */}
      <section className="max-w-[1200px] mx-auto px-5 md:px-8 mt-24">
        <div className="max-w-2xl mb-10">
          <div className="sec-label">How We Work</div>
          <h2
            className="text-[28px] md:text-[36px] font-extrabold text-g1 tracking-tight"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Four principles that shape every project.
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {values.map((v) => (
            <div
              key={v.title}
              className="rounded-[16px] p-6 ring-1 ring-black/5"
              style={{ background: 'var(--color-parch)', boxShadow: 'var(--shadow-card)' }}
            >
              <div className="text-2xl mb-3">{v.icon}</div>
              <h3
                className="text-[16px] font-extrabold text-g1 mb-2"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {v.title}
              </h3>
              <p className="text-[13.5px] text-tx-d leading-relaxed">{v.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ACHIEVEMENTS */}
      <section className="max-w-[1200px] mx-auto px-5 md:px-8 mt-24">
        <div className="max-w-2xl mb-10">
          <div className="sec-label">Achievements & Recognition</div>
          <h2
            className="text-[28px] md:text-[36px] font-extrabold text-g1 tracking-tight"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            What we have built so far.
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((a) => (
            <div
              key={a.headline}
              className="rounded-[16px] ring-1 ring-black/5 relative overflow-hidden flex flex-col"
              style={{
                background: 'linear-gradient(135deg, var(--color-parch), rgba(163,205,185,0.18))',
                boxShadow: 'var(--shadow-card)',
              }}
            >
              {a.photo && (
                <div className="aspect-[16/10] overflow-hidden bg-bd">
                  <img
                    src={a.photo}
                    alt={a.headline}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}
              <div className="p-6 flex-1">
                <div className="text-3xl mb-3">{a.icon}</div>
                <div
                  className="text-[10.5px] uppercase tracking-[0.14em] font-bold text-g3 mb-1"
                  style={{ fontFamily: "'Fira Mono', monospace" }}
                >
                  {a.year}
                </div>
                <h3
                  className="text-[17px] font-extrabold text-g1 mb-2 leading-tight"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {a.headline}
                </h3>
                <p className="text-[13px] text-tx-d leading-relaxed">{a.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CORE TEAM */}
      <section className="max-w-[1200px] mx-auto px-5 md:px-8 mt-24">
        <div className="max-w-2xl mb-10">
          <div className="sec-label">Head Office Team</div>
          <h2
            className="text-[28px] md:text-[36px] font-extrabold text-g1 tracking-tight"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            The people behind the projects.
          </h2>
          <p className="text-[14.5px] text-tx-d leading-relaxed mt-3">
            Our Bhopal head office runs the project verticals — from soil and fisheries
            domain experts to FPO operations, training and IT.
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {coreTeam.map((m) => (
            <div
              key={m.role}
              className="rounded-[16px] overflow-hidden ring-1 ring-black/5 bg-parch"
              style={{ boxShadow: 'var(--shadow-card)' }}
            >
              <div className="aspect-[3/4] overflow-hidden bg-bd">
                <img
                  src={m.photo}
                  alt={m.role}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="px-4 py-3 text-center">
                <div
                  className="text-[10.5px] uppercase tracking-[0.12em] font-bold text-g3 mb-0.5"
                  style={{ fontFamily: "'Fira Mono', monospace" }}
                >
                  Role
                </div>
                <div
                  className="text-[14px] font-extrabold text-g1 leading-tight"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {m.role}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>


      {/* CTA */}
      <section className="max-w-[1200px] mx-auto px-5 md:px-8 mt-24">
        <div
          className="rounded-[24px] p-10 md:p-12 text-center ring-1 ring-black/5"
          style={{
            background: 'linear-gradient(135deg, var(--color-parch), rgba(163,205,185,0.18))',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          <h2
            className="text-[24px] md:text-[30px] font-extrabold text-g1 tracking-tight mb-4 max-w-3xl mx-auto leading-tight"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Want to know how Shakamwari can help your village or cooperative?
          </h2>
          <Link href="/contact" className="btn-primary inline-block">
            Get in Touch →
          </Link>
        </div>
      </section>
    </>
  );
}
