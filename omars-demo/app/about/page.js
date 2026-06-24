import Image from 'next/image';

export default function About() {
  return (
    <div>
      <div className="relative h-72">
        <Image
          src="/site-assets/bk-home.jpg"
          alt="Omar's neon sign and classic cars outside the restaurant"
          fill
          className="object-cover"
        />
      </div>

      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="font-serif text-4xl text-brand-burgundy mb-2">Our Story</h1>
        <p className="text-sm uppercase tracking-wide text-brand-gold mb-6">
          Ashland&apos;s oldest restaurant &middot; first public cocktail lounge &middot; Est. 1946
        </p>

        <p className="mb-4">
          In 1946, Omer and Hazel Hill personally constructed Omar&apos;s Steak &amp; Chicken House
          on the former Berkeley Hot Springs site &mdash; finding numerous mastodon bones during
          the excavation. Omer had earned his trade working at the Harvey railroad houses, the
          Brown Derby, and the Savoy Hotel in Hollywood, and that top-caliber experience quickly
          established Omar&apos;s as one of the premier dining spots in Southern Oregon.
        </p>
        <p className="mb-4">
          The world has changed a great deal since Omar&apos;s flipped its first burger &mdash;
          television, the moon landing, cell phones, cars that talk back. Omar&apos;s has gone
          through its share of transitions too: seven decades have seen a variety of owners and
          partnerships manage this popular little roadhouse. Ownership styles may differ, but one
          thread runs through all of them &mdash; a dedication to a comfortable atmosphere, friendly
          service, and consistently great food and drink at a reasonable price.
        </p>
        <p className="mb-4 italic">Isn&apos;t it nice to know some things don&apos;t change.</p>
        <p>
          Today, Omar&apos;s is the longest continuously operating restaurant from Portland,
          Oregon to Redding, California &mdash; voted Best Steaks &amp; Seafood by locals nearly
          every year from 1991 to 2018 in the Sneak Preview &quot;Best of Ashland&quot; poll.
        </p>
      </div>
    </div>
  );
}
