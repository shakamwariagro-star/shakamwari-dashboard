import type { Metadata } from 'next';
import ContactForm from '@/components/marketing/ContactForm';

export const metadata: Metadata = {
  title: 'Contact — Shakamwari Agro India Pvt Ltd',
  description:
    'Get in touch with Shakamwari Agro. Office in Bhopal, MP. Email shakamwariagro@gmail.com or call +91 99813 61626.',
};

export default function ContactPage() {
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
        <div className="max-w-[1200px] mx-auto px-5 md:px-8 pt-16 md:pt-24 pb-10">
          <div className="sec-label">Get in Touch</div>
          <h1
            className="text-[38px] md:text-[54px] leading-[1.05] font-extrabold text-g1 tracking-tight max-w-3xl mb-5"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            We'd love to hear about
            <br />
            <span className="text-g3">your project, village, or cooperative.</span>
          </h1>
          <p className="text-[16px] text-tx-d max-w-2xl">
            Whether you're a farmer, cooperative office bearer, government department,
            agri-business, or a student looking for an internship — drop us a line.
          </p>
        </div>
      </section>

      {/* CONTACT GRID */}
      <section className="max-w-[1200px] mx-auto px-5 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* CARDS */}
        <div className="lg:col-span-5 space-y-4">
          <div
            className="rounded-[16px] p-6 ring-1 ring-black/5"
            style={{ background: 'var(--color-parch)', boxShadow: 'var(--shadow-card)' }}
          >
            <div className="text-2xl mb-3">📍</div>
            <h3 className="text-[15px] font-extrabold text-g1 mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
              Registered Office
            </h3>
            <p className="text-[13.5px] text-tx-d leading-relaxed">
              B-99, Priyadarshini Colony,<br />
              Bagsewaniya, Bhopal,<br />
              Madhya Pradesh — 462043, India
            </p>
          </div>

          <div
            className="rounded-[16px] p-6 ring-1 ring-black/5"
            style={{ background: 'var(--color-parch)', boxShadow: 'var(--shadow-card)' }}
          >
            <div className="text-2xl mb-3">📞</div>
            <h3 className="text-[15px] font-extrabold text-g1 mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
              Phone & WhatsApp
            </h3>
            <a
              href="tel:+919981361626"
              className="text-[16px] font-bold text-g2 hover:text-g3 transition-colors block"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              +91 99813 61626
            </a>
            <p className="text-[12px] text-tx-f mt-1">Mon – Sat · 9 AM to 7 PM IST</p>
          </div>

          <div
            className="rounded-[16px] p-6 ring-1 ring-black/5"
            style={{ background: 'var(--color-parch)', boxShadow: 'var(--shadow-card)' }}
          >
            <div className="text-2xl mb-3">✉️</div>
            <h3 className="text-[15px] font-extrabold text-g1 mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
              Email
            </h3>
            <a
              href="mailto:shakamwariagro@gmail.com"
              className="text-[14px] font-semibold text-g2 hover:text-g3 transition-colors break-all"
            >
              shakamwariagro@gmail.com
            </a>
            <p className="text-[12px] text-tx-f mt-1">We reply within 48 hours</p>
          </div>

          <div
            className="rounded-[16px] p-6 ring-1 ring-black/5"
            style={{
              background: 'linear-gradient(135deg, rgba(163,205,185,0.18), var(--color-parch))',
              boxShadow: 'var(--shadow-card)',
            }}
          >
            <div className="text-2xl mb-3">🏢</div>
            <h3 className="text-[15px] font-extrabold text-g1 mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
              Company Details
            </h3>
            <dl className="text-[12.5px] text-tx-d space-y-1.5">
              <div className="flex gap-2">
                <dt className="font-bold text-g2 w-24 flex-shrink-0">CIN:</dt>
                <dd className="break-all">U01100MP2016PTC041775</dd>
              </div>
              <div className="flex gap-2">
                <dt className="font-bold text-g2 w-24 flex-shrink-0">Founded:</dt>
                <dd>3 December 2016</dd>
              </div>
              <div className="flex gap-2">
                <dt className="font-bold text-g2 w-24 flex-shrink-0">Head Office:</dt>
                <dd>Bhopal, Madhya Pradesh</dd>
              </div>
              <div className="flex gap-2">
                <dt className="font-bold text-g2 w-24 flex-shrink-0">Director:</dt>
                <dd>Mukesh Raghuwanshi</dd>
              </div>
            </dl>
          </div>
        </div>

        {/* FORM */}
        <div className="lg:col-span-7">
          <div
            className="rounded-[20px] p-7 md:p-9 ring-1 ring-black/5"
            style={{ background: 'var(--color-parch)', boxShadow: 'var(--shadow-card)' }}
          >
            <h2 className="text-[22px] font-extrabold text-g1 mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
              Send us a message
            </h2>
            <p className="text-[13px] text-tx-d mb-6">
              Fill the form — we'll open your email app with the message ready to send.
            </p>
            <ContactForm />
          </div>
        </div>
      </section>

      {/* MAP */}
      <section className="max-w-[1200px] mx-auto px-5 md:px-8 mt-16">
        <div
          className="rounded-[20px] overflow-hidden ring-1 ring-black/5"
          style={{ boxShadow: 'var(--shadow-card)' }}
        >
          <iframe
            title="Shakamwari Agro Office Map"
            src="https://www.google.com/maps?q=Priyadarshini+Colony+Bagsewaniya+Bhopal+462043&output=embed"
            width="100%"
            height="380"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>

      {/* FAQ-LITE / NEXT STEPS */}
      <section className="max-w-[1200px] mx-auto px-5 md:px-8 mt-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              icon: '🌾',
              title: 'I want to start an FPC',
              body: 'Tell us your district, the crops you grow, and how many farmers can join. We\'ll guide you through SFAC registration.',
            },
            {
              icon: '🐟',
              title: "I'm in a fisheries cooperative",
              body: 'If you\'re part of a primary fisheries cooperative in MP, reach out — we may be able to help under PM-MKSSY.',
            },
            {
              icon: '🎓',
              title: "I'm an agriculture student",
              body: 'We hire interns and field staff regularly. Send your CV and the district where you can work.',
            },
          ].map((q) => (
            <div
              key={q.title}
              className="rounded-[16px] p-6 ring-1 ring-black/5"
              style={{ background: 'var(--color-parch)', boxShadow: 'var(--shadow-card)' }}
            >
              <div className="text-2xl mb-3">{q.icon}</div>
              <h3
                className="text-[15px] font-extrabold text-g1 mb-2"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {q.title}
              </h3>
              <p className="text-[13px] text-tx-d leading-relaxed">{q.body}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
