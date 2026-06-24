'use client';
import { useState } from 'react';

export default function Reserve() {
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    const form = new FormData(e.target);
    const payload = {
      name: form.get('name'),
      contact: form.get('contact'),
      date: form.get('date'),
      time: form.get('time'),
      partySize: form.get('partySize'),
      notes: form.get('notes'),
    };
    if (!payload.name || !payload.contact || !payload.date || !payload.time || !payload.partySize) {
      setError('Please fill in all required fields.');
      return;
    }
    setError('');
    setStatus('sending');
    const res = await fetch('/api/reservations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      setStatus('confirmed');
    } else {
      const data = await res.json();
      setError(data.error || 'Something went wrong.');
      setStatus('idle');
    }
  }

  if (status === 'confirmed') {
    return (
      <div className="max-w-xl mx-auto px-6 py-16 text-center">
        <h1 className="font-serif text-3xl text-brand-burgundy">Reservation confirmed</h1>
        <p className="mt-4">We look forward to seeing you at Omar&apos;s.</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-6 py-16">
      <h1 className="font-serif text-4xl text-brand-burgundy mb-8">Reserve a Table</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-700 text-sm">{error}</p>}
        <input name="name" placeholder="Name" className="w-full border border-brand-gold px-3 py-2" />
        <input name="contact" placeholder="Email or phone" className="w-full border border-brand-gold px-3 py-2" />
        <div className="flex gap-4">
          <input type="date" name="date" className="w-full border border-brand-gold px-3 py-2" />
          <input type="time" name="time" className="w-full border border-brand-gold px-3 py-2" />
        </div>
        <input type="number" name="partySize" min="1" max="20" placeholder="Party size" className="w-full border border-brand-gold px-3 py-2" />
        <textarea name="notes" placeholder="Notes (optional)" rows={3} className="w-full border border-brand-gold px-3 py-2" />
        <button
          type="submit"
          disabled={status === 'sending'}
          className="bg-brand-burgundy text-brand-cream px-5 py-2 uppercase text-sm tracking-wide hover:bg-brand-gold hover:text-brand-dark transition disabled:opacity-50"
        >
          {status === 'sending' ? 'Submitting...' : 'Reserve'}
        </button>
      </form>
    </div>
  );
}
