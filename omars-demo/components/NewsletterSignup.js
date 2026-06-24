'use client';
import { useState } from 'react';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    const res = await fetch('/api/newsletter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    if (res.ok) {
      setStatus('done');
      setError('');
    } else {
      const data = await res.json();
      setError(data.error || 'Something went wrong.');
    }
  }

  if (status === 'done') {
    return <p className="text-sm text-brand-gold">Thanks for signing up.</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 max-w-xs">
      <p className="text-sm">Sign up for our newsletter. We do not share our email list.</p>
      {error && <p className="text-red-300 text-xs">{error}</p>}
      <div className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="flex-1 px-2 py-1 text-brand-dark"
        />
        <button type="submit" className="bg-brand-gold text-brand-dark px-3 py-1 text-sm uppercase">
          Sign Up
        </button>
      </div>
    </form>
  );
}
