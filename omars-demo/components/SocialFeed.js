import Image from 'next/image';

const INSTAGRAM_POSTS = [
  { src: '/site-assets/instagram/ig-1.jpg', alt: "French dip sandwich at Omar's", href: 'https://www.instagram.com/omarsrestaurant/p/DZ_HoMTgR6f/' },
  { src: '/site-assets/instagram/ig-2.jpg', alt: "Cocktail on the patio at Omar's", href: 'https://www.instagram.com/omarsrestaurant/p/DZyMHWoklmA/' },
  { src: '/site-assets/instagram/ig-3.jpg', alt: 'Vintage photo of downtown Ashland', href: 'https://www.instagram.com/omarsrestaurant/p/DZ0zyvlgRZU/' },
  { src: '/site-assets/instagram/ig-4.jpg', alt: 'Conquer the Cut prime rib challenge', href: 'https://www.instagram.com/omarsrestaurant/p/DZtIhx5meDw/' },
];

const FACEBOOK_POSTS = [
  { src: '/site-assets/fb-cover.jpg', alt: "Omar's neon sign at night", href: 'https://www.facebook.com/omarsfreshseafoodsteaks/' },
  { src: '/site-assets/facebook/fb-1.jpg', alt: "Omar's breakfast tots", href: 'https://www.facebook.com/omarsfreshseafoodsteaks/' },
];

function FeedGrid({ posts }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {posts.map((post) => (
        <a key={post.src} href={post.href} target="_blank" rel="noreferrer" className="relative w-full h-40 block">
          <Image src={post.src} alt={post.alt} fill className="object-cover" />
        </a>
      ))}
    </div>
  );
}

export default function SocialFeed() {
  return (
    <section className="max-w-4xl mx-auto px-6 py-16">
      <h2 className="font-serif text-3xl text-brand-burgundy text-center mb-8">Follow Us</h2>
      <div className="grid sm:grid-cols-2 gap-10">
        <div>
          <div className="text-center mb-4">
            <a
              href="https://www.instagram.com/omarsrestaurant/"
              target="_blank"
              rel="noreferrer"
              className="inline-block bg-brand-burgundy text-brand-cream px-5 py-2 uppercase text-sm tracking-wide hover:bg-brand-gold hover:text-brand-dark transition"
            >
              Instagram
            </a>
          </div>
          <FeedGrid posts={INSTAGRAM_POSTS} />
        </div>
        <div>
          <div className="text-center mb-4">
            <a
              href="https://www.facebook.com/omarsfreshseafoodsteaks/"
              target="_blank"
              rel="noreferrer"
              className="inline-block bg-brand-burgundy text-brand-cream px-5 py-2 uppercase text-sm tracking-wide hover:bg-brand-gold hover:text-brand-dark transition"
            >
              Facebook
            </a>
          </div>
          <FeedGrid posts={FACEBOOK_POSTS} />
        </div>
      </div>
    </section>
  );
}
