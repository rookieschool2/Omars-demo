import InquiryForm from '@/components/InquiryForm';

export default function Catering() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="font-serif text-4xl text-brand-burgundy mb-4">Catering</h1>
      <p className="mb-8">
        Let Omar&apos;s cater your next gathering &mdash; from office lunches to full-service events.
        Tell us about your event below and we&apos;ll follow up.
      </p>
      <InquiryForm subject="catering" />
    </div>
  );
}
