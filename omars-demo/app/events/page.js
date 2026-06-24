import InquiryForm from '@/components/InquiryForm';

export default function Events() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="font-serif text-4xl text-brand-burgundy mb-4">Private Events</h1>
      <p className="mb-8">
        Host your next private event in our dining room. Tell us a bit about what you&apos;re
        planning and we&apos;ll be in touch.
      </p>
      <InquiryForm subject="events" />
    </div>
  );
}
