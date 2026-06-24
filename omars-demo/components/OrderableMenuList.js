'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getCart, addToCart, cartCount } from '@/lib/cart';

export default function OrderableMenuList({ items }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(cartCount(getCart()));
  }, []);

  function handleAdd(item) {
    const cart = addToCart(item);
    setCount(cartCount(cart));
  }

  const byCategory = items.reduce((acc, item) => {
    acc[item.category] = acc[item.category] || [];
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <div>
      {count > 0 && (
        <div className="sticky top-0 z-10 bg-brand-gold text-brand-dark text-sm px-4 py-2 mb-6 flex justify-between items-center">
          <span>{count} item{count === 1 ? '' : 's'} in your order</span>
          <Link href="/order" className="underline font-medium">
            View Order
          </Link>
        </div>
      )}
      <div className="space-y-10">
        {Object.entries(byCategory).map(([category, categoryItems]) => (
          <div key={category}>
            <h3 className="font-serif text-2xl text-brand-burgundy border-b border-brand-gold pb-2 mb-4">
              {category}
            </h3>
            <ul className="space-y-3">
              {categoryItems.map((item) => (
                <li key={item.id} className="flex justify-between items-start gap-4">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    {item.description && (
                      <p className="text-sm text-brand-dark/70">{item.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-3 whitespace-nowrap">
                    <p className="font-serif text-brand-gold">${item.price.toFixed(2)}</p>
                    <button
                      onClick={() => handleAdd(item)}
                      className="border border-brand-gold text-brand-burgundy px-2 py-1 text-xs uppercase hover:bg-brand-gold hover:text-brand-dark transition"
                    >
                      Add
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
