import InquiryForm from '@/components/InquiryForm';

export default function Contact() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="font-serif text-4xl text-brand-burgundy mb-4">Contact</h1>
      <p className="mb-2">1380 Siskiyou Blvd, Ashland, OR 97520</p>
      <p className="mb-2">541.482.1281</p>
      <p className="mb-8">Open 7 days a week, 11am&ndash;10pm. Closed legal holidays.</p>
      <InquiryForm subject="general" />
    </div>
  );
}
