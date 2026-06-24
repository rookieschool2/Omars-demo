import Image from 'next/image';

const PHOTOS = [
  { src: '/site-assets/photo-sign-night.jpg', alt: "Omar's neon sign at night" },
  { src: '/site-assets/photo-exterior-night.jpg', alt: "Omar's exterior at night" },
  { src: '/site-assets/photo-scallops.jpg', alt: 'Seared scallops at Omar\'s' },
  { src: '/site-assets/photo-crab.jpg', alt: "Fresh crab at Omar's" },
];

export default function SocialFeed() {
  return (
    <section className="max-w-4xl mx-auto px-6 py-16">
      <h2 className="font-serif text-3xl text-brand-burgundy text-center mb-2">Follow Us</h2>
      <p className="text-center text-sm text-brand-dark/60 mb-8">
        See more on{' '}
        <a href="https://www.instagram.com/omarsrestaurant/" target="_blank" rel="noreferrer" className="underline">
          Instagram
        </a>{' '}
        and{' '}
        <a href="https://www.facebook.com/omarsfreshseafoodsteaks/" target="_blank" rel="noreferrer" className="underline">
          Facebook
        </a>
        .
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {PHOTOS.map((photo) => (
          <div key={photo.src} className="relative w-full h-40">
            <Image src={photo.src} alt={photo.alt} fill className="object-cover" />
          </div>
        ))}
      </div>
    </section>
  );
}
