import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <section className="bg-brand-dark text-brand-cream py-24 px-6 text-center">
        <h1 className="font-serif text-5xl text-brand-gold tracking-wide">OMAR&apos;S</h1>
        <p className="mt-4 text-lg">Est. 1946 &middot; Steaks &amp; Seafood &middot; Ashland, OR</p>
        <p className="mt-2 text-brand-cream/80 max-w-xl mx-auto">
          Ashland&apos;s oldest restaurant and first public cocktail lounge &mdash; the longest
          continuously operating restaurant from Portland, Oregon to Redding, California.
        </p>
        <div className="mt-8 flex gap-4 justify-center">
          <Link href="/reserve" className="bg-brand-gold text-brand-dark px-6 py-3 uppercase tracking-wide text-sm hover:bg-brand-cream transition">
            Reserve a Table
          </Link>
          <Link href="/order" className="border border-brand-gold text-brand-gold px-6 py-3 uppercase tracking-wide text-sm hover:bg-brand-gold hover:text-brand-dark transition">
            Order Online
          </Link>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-16 text-center">
        <h2 className="font-serif text-3xl text-brand-burgundy">Hand-cut steaks, fresh seafood</h2>
        <p className="mt-4 text-brand-dark/80">
          Our steaks are hand-cut and dry-aged six weeks. Fish arrives fresh three to five times a
          week. Soups, dressings, sauces, and stocks are made from scratch &mdash; the way they have
          been since 1946.
        </p>
        <Link href="/about" className="inline-block mt-4 text-brand-burgundy underline">
          Read our story
        </Link>
      </section>
    </div>
  );
}
