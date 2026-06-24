'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const LINKS = [
  ['Home', '/'],
  ['Menus', '/menus'],
  ['Specials', '/specials'],
  ['Wine List', '/wine-list'],
  ['About', '/about'],
  ['Catering', '/catering'],
  ['Events', '/events'],
  ['Store', '/store'],
  ['Contact', '/contact'],
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-brand-dark text-brand-cream border-b border-brand-gold">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/site-assets/logo.png" alt="Omar's Restaurant & Bar" width={56} height={53} />
          <span className="font-serif text-xl tracking-wide text-brand-gold hidden sm:inline">
            OMAR&apos;S
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/reserve"
            className="hidden sm:inline border border-brand-gold text-brand-gold px-3 py-1.5 text-sm uppercase tracking-wide hover:bg-brand-gold hover:text-brand-dark transition"
          >
            Reserve
          </Link>
          <Link
            href="/order"
            className="hidden sm:inline bg-brand-burgundy text-brand-cream px-3 py-1.5 text-sm uppercase tracking-wide hover:bg-brand-gold hover:text-brand-dark transition"
          >
            Order
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
            className="flex flex-col gap-1.5 p-2"
          >
            <span className="block w-6 h-0.5 bg-brand-gold" />
            <span className="block w-6 h-0.5 bg-brand-gold" />
            <span className="block w-6 h-0.5 bg-brand-gold" />
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-brand-gold px-6 py-4">
          <div className="max-w-6xl mx-auto flex flex-wrap gap-x-6 gap-y-3 text-sm uppercase tracking-wide">
            {LINKS.map(([label, href]) => (
              <Link key={href} href={href} className="hover:text-brand-gold" onClick={() => setOpen(false)}>
                {label}
              </Link>
            ))}
            <Link href="/reserve" className="sm:hidden hover:text-brand-gold" onClick={() => setOpen(false)}>
              Reserve
            </Link>
            <Link href="/order" className="sm:hidden hover:text-brand-gold" onClick={() => setOpen(false)}>
              Order
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
