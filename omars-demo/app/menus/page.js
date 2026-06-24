import Image from 'next/image';
import { getMenuItems } from '@/lib/queries';
import MenuList from '@/components/MenuList';

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
        <p className="text-brand-dark/80 mb-10">
          It is our mission to provide our guests with the freshest and highest quality food,
          locally sourced whenever possible. We hand-cut all of our steaks and dry-age them an
          extra six weeks for tenderness and flavor. We receive three to five fish deliveries a
          week from local and global waters, and we make all of our soups, dressings, sauces, and
          stocks from scratch, from our kitchen to your plate.
        </p>
        <MenuList items={items} />
        <p className="mt-12 text-sm text-brand-dark/60">
          Omar&apos;s charges an 18% gratuity for groups of 6 or more. Due to fluctuating market
          costs, prices are subject to change without notice.
        </p>
      </div>
    </div>
  );
}
