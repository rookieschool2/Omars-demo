export default function MenuList({ items }) {
  const byCategory = items.reduce((acc, item) => {
    acc[item.category] = acc[item.category] || [];
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <div className="space-y-10">
      {Object.entries(byCategory).map(([category, categoryItems]) => (
        <div key={category}>
          <h3 className="font-serif text-2xl text-brand-burgundy border-b border-brand-gold pb-2 mb-4">
            {category}
          </h3>
          <ul className="space-y-3">
            {categoryItems.map((item) => (
              <li key={item.id} className="flex justify-between gap-4">
                <div>
                  <p className="font-medium">{item.name}</p>
                  {item.description && (
                    <p className="text-sm text-brand-dark/70">{item.description}</p>
                  )}
                </div>
                <p className="font-serif text-brand-gold whitespace-nowrap">
                  ${item.price.toFixed(2)}
                </p>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
