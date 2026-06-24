import InquiryForm from '@/components/InquiryForm';

export default function Contact() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="font-serif text-4xl text-brand-burgundy mb-2">Contact Us</h1>
      <p className="text-sm uppercase tracking-wide text-brand-gold mb-6">
        Ashland&apos;s Original Steak and Seafood House
      </p>

      <p className="mb-2">1380 Siskiyou Blvd, Ashland, Oregon 97520</p>
      <p className="mb-2">Tel: 541.482.1281 &middot; omarsrestaurant@gmail.com</p>
      <p className="mb-2">Open 7 days a week, 11am&ndash;10pm for dine-in and take-out.</p>
      <p className="mb-2">
        Dinner served nightly from 5:00 PM. Closed for dinner on Thanksgiving, Christmas Day, and
        New Year&apos;s Day.
      </p>
      <p className="mb-8">Cocktail lounge open until 8pm &mdash; first come, first served.</p>

      <p className="italic text-brand-dark/70 mb-8">
        &quot;1991, &apos;92, &apos;93 &hellip; 2018 &mdash; locals have voted Omar&apos;s as the
        Best Steaks &amp; Seafood.&quot; &mdash; Sneak Preview, Annual &quot;Best of Ashland&quot;
        Poll
      </p>

      <div className="mb-10 border border-brand-gold">
        <iframe
          title="Omar's Restaurant location map"
          width="100%"
          height="300"
          style={{ border: 0 }}
          loading="lazy"
          src="https://maps.google.com/maps?q=1380+Siskiyou+Blvd,+Ashland,+OR+97520&output=embed"
        />
      </div>

      <InquiryForm subject="general" />
    </div>
  );
}
