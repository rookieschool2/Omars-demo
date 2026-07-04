import Image from 'next/image';
import Link from 'next/link';
import { getMenuItems } from '@/lib/queries';
import OrderableMenuList from '@/components/OrderableMenuList';

export const metadata = {
  title: 'Steak & Seafood Menu',
  description:
    "Hand-cut steaks, fresh seafood, and house favorites made from scratch since 1946. Browse the full menu at Omar's in Ashland, Oregon.",
  alternates: { canonical: '/menus' },
};

export const dynamic = 'force-dynamic';

export default function Menus() {
  const items = getMenuItems();
  return (
    <div>
      <div className="max-w-3xl mx-auto px-6 pt-10">
        <div className="relative h-56 rounded overflow-hidden">
          <Image
            src="/site-assets/photo-scallops.jpg"
            alt="Seared scallops at Omar's"
            fill
            className="object-cover"
          />
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="font-serif text-4xl text-brand-burgundy mb-4">Menu</h1>
        <div className="flex flex-wrap gap-4 mb-8">
          <Link
            href="/order"
            className="bg-brand-burgundy text-brand-cream px-5 py-2.5 uppercase text-sm tracking-wide hover:bg-brand-gold hover:text-brand-dark transition"
          >
            Order Online
          </Link>
          <a
            href="/site-assets/omars-menu.pdf"
            target="_blank"
            rel="noreferrer"
            className="border border-brand-gold text-brand-burgundy px-5 py-2.5 uppercase text-sm tracking-wide hover:bg-brand-gold hover:text-brand-dark transition"
          >
            View PDF Menu
          </a>
        </div>
        <p className="text-brand-dark/80 mb-10">
          It is our mission to provide our guests with the freshest and highest quality food,
          locally sourced whenever possible. We hand-cut all of our steaks and dry-age them an
          extra six weeks for tenderness and flavor. We receive three to five fish deliveries a
          week from local and global waters, and we make all of our soups, dressings, sauces, and
          stocks from scratch, from our kitchen to your plate.
        </p>
        <OrderableMenuList items={items} />
        <p className="mt-12 text-sm text-brand-dark/60">
          Omar&apos;s charges an 18% gratuity for groups of 6 or more. Due to fluctuating market
          costs, prices are subject to change without notice.
        </p>
      </div>
    </div>
  );
}
