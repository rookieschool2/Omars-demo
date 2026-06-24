'use client';
import Image from 'next/image';
import { useState } from 'react';

const ITEMS = [
  { id: 'gift-25', name: '$25 Gift Card', price: 25 },
  { id: 'gift-50', name: '$50 Gift Card', price: 50 },
  { id: 'gift-100', name: '$100 Gift Card', price: 100 },
];

export default function Store() {
  const [confirmed, setConfirmed] = useState(null);

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="flex items-center gap-4 mb-4">
        <Image src="/site-assets/omars-shop.png" alt="Shop Omar's Online" width={90} height={90} />
        <h1 className="font-serif text-4xl text-brand-burgundy">Gift Cards</h1>
      </div>
      <p className="mb-8 text-sm text-brand-dark/70">
        Demo only &mdash; this does not process real payments.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {ITEMS.map((item) => (
          <div key={item.id} className="border border-brand-gold p-6 text-center">
            <p className="font-serif text-2xl text-brand-burgundy">{item.name}</p>
            <button
              onClick={() => setConfirmed(item.name)}
              className="mt-4 bg-brand-burgundy text-brand-cream px-4 py-2 uppercase text-sm tracking-wide hover:bg-brand-gold hover:text-brand-dark transition"
            >
              Buy
            </button>
          </div>
        ))}
      </div>
      {confirmed && (
        <p className="mt-6 text-brand-burgundy">
          Thanks! Your {confirmed} purchase is confirmed (demo &mdash; no real charge was made).
        </p>
      )}
    </div>
  );
}
