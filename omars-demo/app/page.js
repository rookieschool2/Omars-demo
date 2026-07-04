import Image from 'next/image';
import Link from 'next/link';
import SocialFeed from '@/components/SocialFeed';

export const metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <div>
      <section className="relative isolate overflow-hidden text-brand-cream">
        <Image
          src="/site-assets/bk-home.jpg"
          alt="Omar's neon sign and classic cars outside the restaurant"
          fill
          priority
          className="object-cover -z-10"
        />
        <div className="absolute inset-0 bg-brand-dark/70 -z-10" />
        <div className="relative max-w-3xl mx-auto px-6 py-28 text-center">
          <Image
            src="/site-assets/logo.png"
            alt="Omar's Restaurant & Bar"
            width={120}
            height={114}
            className="mx-auto mb-4"
          />
          <h1 className="font-serif text-5xl text-brand-gold tracking-wide">OMAR&apos;S</h1>
          <p className="mt-4 text-lg">Est. 1946 &middot; Steaks &amp; Seafood &middot; Ashland, OR</p>
          <p className="mt-2 text-brand-cream/90 max-w-xl mx-auto">
            Ashland&apos;s oldest restaurant and first public cocktail lounge, and the longest
            continuously operating restaurant from Portland, Oregon to Redding, California.
          </p>
          <p className="mt-3 text-sm uppercase tracking-wide text-brand-gold">
            Voted Best Steaks &amp; Seafood, 1991&ndash;2018 (Sneak Preview &quot;Best of Ashland&quot; Poll)
          </p>
          <div className="mt-8 flex gap-4 justify-center">
            <Link href="/reserve" className="bg-brand-gold text-brand-dark px-6 py-3 uppercase tracking-wide text-sm hover:bg-brand-cream transition">
              Reserve a Table
            </Link>
            <Link href="/order" className="border border-brand-gold text-brand-gold px-6 py-3 uppercase tracking-wide text-sm hover:bg-brand-gold hover:text-brand-dark transition">
              Order Online
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-8">
          <h2 className="font-serif text-3xl text-brand-burgundy">Hand-cut steaks, fresh seafood</h2>
          <p className="mt-4 text-brand-dark/80 max-w-2xl mx-auto">
            We hand-cut every steak and dry-age it six weeks. Fresh fish arrives three to five
            times a week. Our soups, dressings, sauces, and stocks are made from scratch, the same
            way they were in 1946, when Omer and Hazel Hill first built this place by hand.
          </p>
          <Link href="/about" className="inline-block mt-4 text-brand-burgundy underline">
            Read our story (it involves mastodon bones and a sign painter&apos;s typo)
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="relative h-56 rounded overflow-hidden">
            <Image
              src="/site-assets/photo-scallops.jpg"
              alt="Seared scallops at Omar's"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative h-56 rounded overflow-hidden">
            <Image
              src="/site-assets/photo-crab.jpg"
              alt="Fresh crab at Omar's"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <SocialFeed />
    </div>
  );
}
