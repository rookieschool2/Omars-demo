import { getWineList } from '@/lib/queries';
import MenuList from '@/components/MenuList';

export const dynamic = 'force-dynamic';

export default function WineList() {
  const items = getWineList();
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="font-serif text-4xl text-brand-burgundy mb-8">Wine List</h1>
      <MenuList items={items} />
    </div>
  );
}
