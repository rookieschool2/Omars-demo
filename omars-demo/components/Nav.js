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
  return (
    <header className="bg-brand-dark text-brand-cream border-b border-brand-gold">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/site-assets/logo.png" alt="Omar's Restaurant & Bar" width={56} height={53} />
          <span className="font-serif text-xl tracking-wide text-brand-gold hidden sm:inline">
            OMAR&apos;S
          </span>
        </Link>
        <nav className="hidden md:flex gap-5 text-sm uppercase tracking-wide">
          {LINKS.map(([label, href]) => (
            <Link key={href} href={href} className="hover:text-brand-gold">
              {label}
            </Link>
          ))}
        </nav>
        <div className="flex gap-3">
          <Link
            href="/reserve"
            className="border border-brand-gold text-brand-gold px-3 py-1.5 text-sm uppercase tracking-wide hover:bg-brand-gold hover:text-brand-dark transition"
          >
            Reserve
          </Link>
          <Link
            href="/order"
            className="bg-brand-burgundy text-brand-cream px-3 py-1.5 text-sm uppercase tracking-wide hover:bg-brand-gold hover:text-brand-dark transition"
          >
            Order
          </Link>
        </div>
      </div>
    </header>
  );
}
