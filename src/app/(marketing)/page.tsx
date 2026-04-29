import Link from 'next/link';
import type { Metadata } from 'next';
import { MP_DISTRICTS } from '@/lib/mpDistricts';
import { INDIA_STATES } from '@/lib/indiaStates';
import CountUp from '@/components/marketing/CountUp';

const ACTIVE_DISTRICTS = new Set([
  'Agar Malwa', 'Anuppur', 'Balaghat', 'Barwani', 'Betul', 'Bhind', 'Chhindwara',
  'Datia', 'Dewas', 'Guna', 'Gwalior', 'Harda', 'Khandwa', 'East Nimar', 'Morena',
  'Neemuch', 'Raisen', 'Rajgarh', 'Ratlam', 'Rewa', 'Satna', 'Sehore', 'Seoni',
  'Shahdol', 'Sheopur', 'Shivpuri', 'Sidhi', 'Singrauli', 'Ujjain',
]);

export const metadata: Metadata = {
  title: 'Shakamwari Agro India Pvt Ltd — Empowering Agriculture, Enriching Lives',
  description:
    'Agriculture services company working in MP & UP since 2016. Soil testing labs (45 across MP), 25 SFAC-allotted Farmer Producer Companies, and PM-MKSSY fisheries cooperatives strengthening.',
};

const stats = [
  { value: 45, decimals: 0, suffix: '', label: 'Soil Testing Labs', icon: '🔬' },
  { value: 1.35, decimals: 2, suffix: ' Lakh', label: 'Farmers Reached', icon: '🌾' },
  { value: 25, decimals: 0, suffix: '', label: 'FPC Project', icon: '🏢' },
  { value: 45, decimals: 0, suffix: '', label: 'Fisheries Societies', icon: '🐟' },
  { value: 10, decimals: 0, suffix: '+', label: 'Years of Experience', icon: '🎯' },
];

const verticals = [
  {
    id: 'soil-labs',
    title: 'Soil Testing Labs',
    blurb:
      'Working as consultants for 45 soil testing laboratories across Madhya Pradesh — helping farmers understand their soil and choose the right inputs for healthier, more profitable harvests.',
    image: '/images/work/soil-lab-vijaypur-building.jpg',
    icon: '🔬',
    tag: 'Consultancy · 45 Labs',
  },
  {
    id: 'fpc',
    title: 'Farmer Producer Companies',
    blurb:
      'In 2022, SFAC allotted 25 Farmer Producer Companies (FPCs) to Shakamwari for promotion and incubation — including 6 dedicated natural farming FPOs. We handle formation, training, market linkages and equity grants.',
    image: '/images/work/fpc-natural-farming-field.jpg',
    icon: '🌾',
    tag: 'SFAC · 25 FPCs',
  },
  {
    id: 'fisheries',
    title: 'PM-MKSSY Fisheries',
    blurb:
      'Since 2025, we are an SFAC-allotted Cluster Based Business Organization for PM-MKSSY — strengthening fisheries cooperatives across MP to function as Fish Farmer Producer Organizations (FFPOs).',
    image: '/images/work/fisheries-customer-service-point.jpg',
    icon: '🐟',
    tag: 'PM-MKSSY · 45 Societies',
  },
];

const partners = [
  { name: 'SFAC', logo: '/images/partners/sfac.jpeg', note: 'Small Farmers Agri-Business Consortium' },
  { name: 'APEDA', logo: '/images/partners/apeda.jpeg', note: 'Agricultural & Processed Food Products Export Authority' },
  { name: 'NCCF', logo: '/images/partners/nccf.jpeg', note: 'National Cooperative Consumers Federation' },
  { name: 'FPO Scheme', logo: '/images/partners/fpo.jpeg', note: '10,000 FPO Scheme, Govt. of India' },
  { name: 'IFFCO', logo: '/images/partners/iffco.jpeg', note: 'Indian Farmers Fertiliser Cooperative Limited' },
  { name: 'NABKISAN', logo: '/images/partners/nabkisan.jpeg', note: 'NABKISAN Finance Limited' },
  { name: 'FSSAI', logo: '/images/partners/fssai.jpeg', note: 'Food Safety & Standards Authority of India' },
  { name: 'Bank of Maharashtra', logo: '/images/partners/bank-of-maharashtra.jpeg', note: 'Banking partner' },
  { name: 'Mystore', logo: '/images/partners/mystore.jpeg', note: 'ONDC Mystore — FPO marketplace' },
  { name: 'Amul', logo: '/images/partners/amul.jpeg', note: 'Dairy & cooperative linkages' },
];

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              'radial-gradient(circle at 20% 0%, rgba(163,205,185,0.45), transparent 50%), radial-gradient(circle at 90% 30%, rgba(212,180,131,0.25), transparent 45%), var(--color-cream)',
          }}
        />
        <div className="max-w-[1200px] mx-auto px-5 md:px-8 pt-16 md:pt-24 pb-20 md:pb-28 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7">
            <div className="sec-label">Empowering Agriculture, Enriching Lives</div>
            <h1
              className="text-[40px] md:text-[58px] leading-[1.05] font-extrabold text-g1 tracking-tight mb-6"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Building stronger
              <br />
              <span className="text-g3">farmer-owned</span> agriculture
              <br />
              across India.
            </h1>
            <p className="text-[16px] md:text-[17px] leading-relaxed text-tx-d max-w-2xl mb-8">
              For nearly a decade, Shakamwari Agro has worked at the ground level with farmers,
              cooperatives and government schemes — running <strong className="text-g2">soil testing labs</strong>,
              promoting <strong className="text-g2">Farmer Producer Companies</strong>, and now strengthening
              <strong className="text-g2"> fisheries cooperatives under PM-MKSSY</strong>.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/services" className="btn-primary">
                Explore Our Work →
              </Link>
              <Link
                href="/contact"
                className="px-4 py-2 rounded-[12px] text-[13px] font-bold border border-bd2 text-g1 hover:bg-white/40 transition-colors"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Get in Touch
              </Link>
            </div>

            <div className="mt-10 flex items-center gap-6 text-[12px] text-tx-d">
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div
              className="relative rounded-[20px] overflow-hidden ring-1 ring-black/5"
              style={{ boxShadow: 'var(--shadow-card-hover)' }}
            >
              <img
                src="/images/team/team-group-evening.jpg"
                alt="Shakamwari Agro team"
                className="w-full h-[420px] md:h-[520px] object-cover"
              />
            </div>

          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="max-w-[1200px] mx-auto px-5 md:px-8 mt-16 md:mt-20">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-8">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col items-center text-center">
              <div className="flex items-center gap-3 mb-3 whitespace-nowrap">
                <div
                  className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full text-2xl md:text-3xl flex-shrink-0"
                  style={{ background: 'rgba(123,179,156,0.15)' }}
                >
                  {s.icon}
                </div>
                <div
                  className="text-[34px] md:text-[42px] font-extrabold text-g1 leading-none tracking-tight"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  <CountUp end={s.value} decimals={s.decimals} />
                  {s.suffix && (
                    <span className="text-[16px] md:text-[20px] text-g3 font-bold ml-1">{s.suffix}</span>
                  )}
                </div>
              </div>
              <div
                className="text-[14px] md:text-[15px] font-bold text-g1 mb-2 min-h-[40px] flex items-center justify-center"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {s.label}
              </div>
              <div className="h-[3px] w-12 rounded-full" style={{ background: 'var(--color-g3)' }} />
            </div>
          ))}
        </div>
      </section>

      {/* VERTICALS */}
      <section className="max-w-[1200px] mx-auto px-5 md:px-8 mt-24">
        <div className="max-w-2xl mb-10">
          <div className="sec-label">What We Do</div>
          <h2
            className="text-[30px] md:text-[40px] font-extrabold text-g1 tracking-tight leading-tight"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Three project verticals.
            <br />
            One mission — empower the farmer.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {verticals.map((v) => (
            <Link
              key={v.id}
              href={`/services#${v.id}`}
              className="group rounded-[18px] overflow-hidden ring-1 ring-black/5 bg-parch transition-all duration-300 hover:-translate-y-1"
              style={{ boxShadow: 'var(--shadow-card)' }}
            >
              <div className="relative h-[200px] overflow-hidden">
                <img
                  src={v.image}
                  alt={v.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  style={{ objectPosition: v.id === 'soil-labs' ? 'center 35%' : 'center' }}
                />
                <div
                  className="absolute inset-0"
                  style={{ background: 'linear-gradient(180deg, transparent 40%, rgba(31,58,46,0.35) 100%)' }}
                />
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 text-[10.5px] font-bold text-g2 uppercase tracking-wider">
                  {v.tag}
                </div>
                <div className="absolute bottom-3 left-3 text-3xl">{v.icon}</div>
              </div>
              <div className="p-6">
                <h3
                  className="text-[18px] font-extrabold text-g1 mb-2"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {v.title}
                </h3>
                <p className="text-[13.5px] text-tx-d leading-relaxed mb-4">{v.blurb}</p>
                <div className="text-[12px] font-bold text-g3 group-hover:text-g2 transition-colors">
                  Learn more →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* IMPACT BAND */}
      <section className="mt-24">
        <div
          className="relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #1f3a2e 0%, #2d5545 100%)' }}
        >
          <div
            className="absolute inset-0 opacity-25"
            style={{
              background:
                'radial-gradient(circle at 10% 0%, rgba(163,205,185,0.4), transparent 45%), radial-gradient(circle at 90% 100%, rgba(212,180,131,0.3), transparent 40%)',
            }}
          />
          <div className="relative max-w-[1200px] mx-auto px-5 md:px-8 py-16 md:py-20">
            <div className="text-center mb-12">
              <div
                className="text-[10.5px] uppercase tracking-[0.14em] font-bold text-g6 mb-3"
                style={{ fontFamily: "'Fira Mono', monospace" }}
              >
                Where We Work
              </div>
              <h2
                className="text-[28px] md:text-[36px] font-extrabold text-white tracking-tight leading-tight"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                On the ground across <span className="text-g6">two states</span> and{' '}
                <span className="text-g6">40+ districts</span>.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
              {/* INDIA MAP */}
              <div
                className="rounded-[18px] p-6 md:p-8 flex flex-col"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.10)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <div
                  className="text-[10.5px] uppercase tracking-[0.14em] font-bold text-g6 mb-1"
                  style={{ fontFamily: "'Fira Mono', monospace" }}
                >
                  India
                </div>
                <div
                  className="text-[18px] font-extrabold text-white mb-5"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Active in 2 states — MP & UP
                </div>

                <div className="flex-1 flex items-center justify-center">
                  <svg viewBox="0 0 800 800" className="w-full max-w-[400px] h-auto">
                    {INDIA_STATES.map((s) => {
                      const active = s.name === 'Madhya Pradesh' || s.name === 'Uttar Pradesh';
                      return (
                        <path
                          key={s.name}
                          d={s.d}
                          fill={active ? '#7bb39c' : 'rgba(255,255,255,0.08)'}
                          stroke={active ? '#a3cdb9' : 'rgba(255,255,255,0.35)'}
                          strokeWidth="1"
                        >
                          <title>{s.name}</title>
                        </path>
                      );
                    })}
                    {INDIA_STATES.filter((s) => s.name === 'Madhya Pradesh' || s.name === 'Uttar Pradesh').map((s) => (
                      <text
                        key={'lbl-' + s.name}
                        x={s.cx}
                        y={s.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill="#0f2a20"
                        fontSize="14"
                        fontWeight="800"
                        style={{ fontFamily: 'var(--font-heading)' }}
                        pointerEvents="none"
                      >
                        {s.name === 'Madhya Pradesh' ? 'MP' : 'UP'}
                      </text>
                    ))}
                  </svg>
                </div>

                <div className="flex flex-wrap gap-3 mt-6 justify-center">
                  <div className="flex items-center gap-2 text-[12px] text-g7">
                    <span className="w-3 h-3 rounded-sm" style={{ background: '#7bb39c' }} />
                    Active project states
                  </div>
                  <div className="flex items-center gap-2 text-[12px] text-g7">
                    <span className="w-3 h-3 rounded-sm" style={{ background: 'rgba(255,255,255,0.15)' }} />
                    Rest of India
                  </div>
                </div>
              </div>

              {/* MP DISTRICTS MAP */}
              <div
                className="rounded-[18px] p-6 md:p-8 flex flex-col"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.10)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <div
                  className="text-[10.5px] uppercase tracking-[0.14em] font-bold text-g6 mb-1"
                  style={{ fontFamily: "'Fira Mono', monospace" }}
                >
                  Madhya Pradesh
                </div>
                <div
                  className="text-[18px] font-extrabold text-white mb-5"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  28 of MP&apos;s districts covered
                </div>

                <div className="flex-1 flex items-center justify-center">
                  <svg viewBox="0 0 800 600" className="w-full max-w-[480px] h-auto">
                    {MP_DISTRICTS.map((d) => {
                      const active = ACTIVE_DISTRICTS.has(d.name);
                      return (
                        <path
                          key={d.name}
                          d={d.d}
                          fill={active ? '#7bb39c' : 'rgba(255,255,255,0.10)'}
                          stroke={active ? '#a3cdb9' : 'rgba(255,255,255,0.4)'}
                          strokeWidth="1"
                        >
                          <title>{d.name}</title>
                        </path>
                      );
                    })}
                    {MP_DISTRICTS.map((d) => (
                      <text
                        key={'lbl-' + d.name}
                        x={d.cx}
                        y={d.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize="9"
                        fill={ACTIVE_DISTRICTS.has(d.name) ? '#0f2a20' : 'rgba(255,255,255,0.6)'}
                        fontWeight={ACTIVE_DISTRICTS.has(d.name) ? '700' : '500'}
                        pointerEvents="none"
                      >
                        {d.name}
                      </text>
                    ))}
                  </svg>
                </div>

                <div className="flex flex-wrap gap-3 mt-6 justify-center">
                  <div className="flex items-center gap-2 text-[12px] text-g7">
                    <span className="w-3 h-3 rounded-full" style={{ background: '#7bb39c' }} />
                    Districts we work in
                  </div>
                  <div className="flex items-center gap-2 text-[12px] text-g7">
                    <span className="w-3 h-3 rounded-full" style={{ background: 'rgba(255,255,255,0.18)' }} />
                    Other districts
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PARTNERS */}
      <section className="max-w-[1200px] mx-auto px-5 md:px-8 mt-24">
        <div className="text-center mb-10">
          <div className="sec-label justify-center" style={{ display: 'inline-flex' }}>Our Partners</div>
          <h2
            className="text-[28px] md:text-[36px] font-extrabold text-g1 tracking-tight mt-3"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Trusted by leading agri institutions.
          </h2>
          <p className="text-[14.5px] text-tx-d max-w-2xl mx-auto mt-3">
            We collaborate with government bodies, cooperatives and national agencies that
            shape India&apos;s farmer economy.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {partners.map((p) => (
            <div
              key={p.name}
              title={p.note}
              className="group rounded-[14px] bg-white ring-1 ring-black/5 hover:ring-g4 transition-all flex items-center justify-center p-5 aspect-[3/2]"
              style={{ boxShadow: 'var(--shadow-card)' }}
            >
              <img
                src={p.logo}
                alt={`${p.name} logo`}
                className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
              />
            </div>
          ))}
        </div>
      </section>

      {/* PHOTO GALLERY */}
      <section className="max-w-[1200px] mx-auto px-5 md:px-8 mt-24">
        <div className="max-w-2xl mb-8">
          <div className="sec-label">Photo Gallery</div>
          <h2
            className="text-[28px] md:text-[36px] font-extrabold text-g1 tracking-tight"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Photo Gallery
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-[180px] md:auto-rows-[220px]">
          <div
            className="md:col-span-2 md:row-span-2 col-span-2 rounded-[18px] overflow-hidden ring-1 ring-black/5"
            style={{ boxShadow: 'var(--shadow-card)' }}
          >
            <img
              src="/images/team/team-govt-building.jpg"
              alt="Team at government building"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
          {[
            { src: '/images/team/team-bhopal-lake.jpg', alt: 'Team at the lakeside' },
            { src: '/images/team/team-group-evening.jpg', alt: 'Team group photo at sunset' },
            { src: '/images/team/team-festive.jpg', alt: 'Team at a festive gathering' },
            { src: '/images/team/team-office-meeting.jpg', alt: 'Team in an office training session' },
          ].map((p) => (
            <div
              key={p.src}
              className="rounded-[18px] overflow-hidden ring-1 ring-black/5"
              style={{ boxShadow: 'var(--shadow-card)' }}
            >
              <img
                src={p.src}
                alt={p.alt}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-[1200px] mx-auto px-5 md:px-8 mt-24">
        <div
          className="rounded-[24px] p-10 md:p-14 text-center relative overflow-hidden ring-1 ring-black/5"
          style={{
            background:
              'linear-gradient(135deg, var(--color-parch), rgba(163,205,185,0.18))',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          <div className="sec-label justify-center" style={{ display: 'inline-flex' }}>Get Involved</div>
          <h2
            className="text-[26px] md:text-[34px] font-extrabold text-g1 tracking-tight mb-4 max-w-3xl mx-auto leading-tight"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Looking to start an FPC, partner with us, or hire our consulting services?
          </h2>
          <p className="text-[15px] text-tx-d max-w-xl mx-auto mb-7">
            We work with farmers, cooperatives, government departments, and agri-businesses
            across MP and UP. Tell us about your project — we'd love to help.
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
