import { getWineList } from '@/lib/queries';
import MenuList from '@/components/MenuList';

export const dynamic = 'force-dynamic';

export default function WineList() {
  const items = getWineList();
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="font-serif text-4xl text-brand-burgundy mb-4">There is no great meal without great wine</h1>
      <p className="text-brand-dark/80 mb-8">
        We&apos;ve worked to provide a truly special range of wines &mdash; classic regions and
        up-and-coming producers, local, domestic, and international &mdash; so that whatever your
        personal taste, every wine on this list is first rate.
      </p>
      <MenuList items={items} />
    </div>
  );
}
