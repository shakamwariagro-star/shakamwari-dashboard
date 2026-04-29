'use client';

import { useState } from 'react';

const interests = [
  'Soil Testing Lab Consultancy',
  'Farmer Producer Company (FPC)',
  'PM-MKSSY Fisheries',
  'Training / Capacity Building',
  'Internship / Career',
  'Other',
];

export default function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [interest, setInterest] = useState(interests[0]);
  const [message, setMessage] = useState('');

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`[Website Inquiry] ${interest} — ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nInterested in: ${interest}\n\nMessage:\n${message}`
    );
    window.location.href = `mailto:shakamwariagro@gmail.com?subject=${subject}&body=${body}`;
  };

  const inputBase =
    'w-full px-4 py-2.5 rounded-[10px] text-[13.5px] bg-white/60 border border-bd2 focus:border-g4 focus:outline-none focus:ring-2 focus:ring-g6/40 transition-colors text-tx';
  const labelBase = 'block text-[12px] font-bold text-g2 mb-1.5 uppercase tracking-[0.06em]';

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelBase} htmlFor="name">Your Name</label>
          <input
            id="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputBase}
            placeholder="Ramesh Patel"
          />
        </div>
        <div>
          <label className={labelBase} htmlFor="phone">Phone</label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={inputBase}
            placeholder="+91 9XXXX XXXXX"
          />
        </div>
      </div>

      <div>
        <label className={labelBase} htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputBase}
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label className={labelBase} htmlFor="interest">Interested in</label>
        <select
          id="interest"
          value={interest}
          onChange={(e) => setInterest(e.target.value)}
          className={inputBase}
        >
          {interests.map((i) => (
            <option key={i} value={i}>{i}</option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelBase} htmlFor="message">Message</label>
        <textarea
          id="message"
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={inputBase + ' resize-y'}
          placeholder="Tell us about your village, FPC, or project..."
        />
      </div>

      <div className="flex flex-wrap gap-3 items-center pt-2">
        <button type="submit" className="btn-primary">
          Open Email & Send →
        </button>
        <p className="text-[11.5px] text-tx-f">
          This will open your email app with the message pre-filled.
        </p>
      </div>
    </form>
  );
}
