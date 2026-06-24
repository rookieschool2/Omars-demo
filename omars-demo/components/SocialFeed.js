const PHOTOS = [
  'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1432139509613-5c4255815697?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&h=400&fit=crop',
];

export default function SocialFeed() {
  return (
    <section className="max-w-4xl mx-auto px-6 py-16">
      <h2 className="font-serif text-3xl text-brand-burgundy text-center mb-2">Follow Us</h2>
      <p className="text-center text-sm text-brand-dark/60 mb-8">
        Sample photos &mdash; see our real feed on{' '}
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
        {PHOTOS.map((src) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={src} src={src} alt="Omar's restaurant" className="w-full h-40 object-cover" />
        ))}
      </div>
    </section>
  );
}
