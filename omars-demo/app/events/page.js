import InquiryForm from '@/components/InquiryForm';

export default function Events() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="font-serif text-4xl text-brand-burgundy mb-4">Private Events</h1>
      <p className="mb-4">
        Let Omar&apos;s host your private party! We do the cooking and cleaning, you just get to
        party. Have an event you need catered? Call us at 541.482.1281 and we can answer your
        questions and help plan your event.
      </p>
      <p className="mb-8">
        <strong>Tuesdays &amp; Wednesdays:</strong> no corkage fee, no room rental fee, and the
        ability to build your own menu &mdash; formal dining or buffet style, for parties of 20 or
        more. Email omarsrestaurant@gmail.com for details.
      </p>

      <div className="border border-brand-gold p-6 mb-8">
        <h2 className="font-serif text-2xl text-brand-burgundy mb-2">Can You Conquer the Cut?</h2>
        <p className="text-sm uppercase tracking-wide text-brand-gold mb-4">
          The brave will try, the legends survive
        </p>
        <p className="mb-4">
          A 72oz prime rib (cooked rare or medium rare), topped with grilled onions, mushrooms,
          and two house-made onion rings. A loaded baked potato with cheese, bacon, sour cream,
          and chives. A dinner salad or cup of soup. Celery and carrot sticks, green olives, pickle
          spears. Half a loaf of baguette. Coffee, tea, or soda to top it off &mdash; and a Coupe
          Denmark.
        </p>
        <h3 className="font-serif text-lg text-brand-burgundy mb-2">The Rules</h3>
        <ul className="mb-4 list-disc pl-5 space-y-1 text-brand-dark/80">
          <li>Finish everything in one hour</li>
          <li>No leaving the table once you start</li>
          <li>No help from friends</li>
          <li>Must swallow every last bite</li>
          <li>Can&apos;t share with friends (can take leftovers to go)</li>
          <li>Must pre-pay</li>
        </ul>
        <h3 className="font-serif text-lg text-brand-burgundy mb-2">The Reward</h3>
        <ul className="list-disc pl-5 space-y-1 text-brand-dark/80">
          <li>A free meal (normally $125.00)</li>
          <li>A commemorative t-shirt</li>
          <li>Your name on our Wall of Fame, forever</li>
          <li>Bragging rights that&apos;ll last a lifetime</li>
        </ul>
      </div>

      <InquiryForm subject="events" />
    </div>
  );
}
