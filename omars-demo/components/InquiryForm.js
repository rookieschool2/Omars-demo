'use client';
import { useState } from 'react';

export default function InquiryForm({ subject }) {
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    const form = new FormData(e.target);
    const payload = {
      name: form.get('name'),
      contact: form.get('contact'),
      subject,
      message: form.get('message'),
    };
    if (!payload.name || !payload.contact || !payload.message) {
      setError('Please fill in all fields.');
      return;
    }
    setError('');
    setStatus('sending');
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    setStatus(res.ok ? 'sent' : 'error');
  }

  if (status === 'sent') {
    return <p className="text-brand-burgundy">Thanks, we received your message.</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-700 text-sm">{error}</p>}
      <input name="name" placeholder="Name" className="w-full border border-brand-gold px-3 py-2" />
      <input name="contact" placeholder="Email or phone" className="w-full border border-brand-gold px-3 py-2" />
      <textarea name="message" placeholder="Message" rows={4} className="w-full border border-brand-gold px-3 py-2" />
      <button
        type="submit"
        disabled={status === 'sending'}
        className="bg-brand-burgundy text-brand-cream px-5 py-2 uppercase text-sm tracking-wide hover:bg-brand-gold hover:text-brand-dark transition disabled:opacity-50"
      >
        {status === 'sending' ? 'Sending...' : 'Send'}
      </button>
    </form>
  );
}
