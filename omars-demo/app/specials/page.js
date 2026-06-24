import { getSpecials } from '@/lib/queries';

export const dynamic = 'force-dynamic';

export default function Specials() {
  const specials = getSpecials();
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="font-serif text-4xl text-brand-burgundy mb-2">Specials</h1>
      <p className="text-sm text-brand-dark/60 mb-8">
        Our specials change daily. Here&apos;s what&apos;s on the board.
      </p>
      <ul className="space-y-6">
        {specials.map((s) => (
          <li key={s.id} className="border-b border-brand-gold pb-4">
            <div className="flex justify-between">
              <p className="font-serif text-xl">{s.name}</p>
              <p className="font-serif text-brand-gold">${s.price.toFixed(2)}</p>
            </div>
            <p className="text-sm text-brand-dark/70">{s.description}</p>
            {s.active_range && (
              <p className="text-xs uppercase text-brand-burgundy mt-1">{s.active_range}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
