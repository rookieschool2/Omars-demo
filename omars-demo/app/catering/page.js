import Image from 'next/image';
import InquiryForm from '@/components/InquiryForm';

export default function Catering() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <div className="flex items-center gap-4 mb-6">
        <Image src="/site-assets/omars-catering.png" alt="Omar's Catering" width={90} height={90} />
        <h1 className="font-serif text-4xl text-brand-burgundy">Catering</h1>
      </div>
      <p className="mb-6">
        Let Omar&apos;s make your next event or gathering memorable. Our professional service
        staff can set up an elegantly decorated buffet, serve, and clean up, during the party or
        after.
      </p>

      <h2 className="font-serif text-2xl text-brand-burgundy mb-3">Hors d&apos;Oeuvres</h2>
      <p className="mb-6 text-brand-dark/80">
        Priced by the portion, with most choices at $1.95 each. Prices include platters, chafing
        dishes, disposable plates, napkins, and flatware. For medium to heavy hors d&apos;oeuvres
        events, we suggest 6 to 8 portions per person. A 5% meals tax applies to food and
        non-alcohol beverages served within the City of Ashland.
      </p>

      <h2 className="font-serif text-2xl text-brand-burgundy mb-3">Party Information</h2>
      <ul className="mb-6 text-brand-dark/80 list-disc pl-5 space-y-1">
        <li>Each event is priced by the number of servers needed, hours, and travel time</li>
        <li>Each server is $15.00 per hour; a 15% service charge is added for staffed parties</li>
        <li>Fully licensed and insured. &quot;Hosted&quot; or &quot;no host&quot; alcohol service available</li>
        <li>A $100.00 non-refundable deposit (applied to your balance) confirms your date</li>
        <li>50% of the total party cost is due 30 days in advance, balance due 3 days before</li>
      </ul>

      <p className="mb-8">Thank you for considering Omar&apos;s Catering Services.</p>
      <InquiryForm subject="catering" />
    </div>
  );
}
