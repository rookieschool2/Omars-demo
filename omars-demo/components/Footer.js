import Image from 'next/image';
import NewsletterSignup from './NewsletterSignup';

export default function Footer() {
  return (
    <footer className="bg-brand-dark text-brand-cream border-t border-brand-gold mt-16">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row justify-between gap-6">
        <div>
          <Image src="/site-assets/logo.png" alt="Omar's Restaurant & Bar" width={64} height={61} />
          <p className="text-sm mt-3">1380 Siskiyou Blvd, Ashland, OR 97520</p>
          <p className="text-sm">541.482.1281 &middot; omarsrestaurant@gmail.com</p>
          <p className="text-sm mt-2">Est. 1946 &middot; Ashland&apos;s oldest restaurant</p>
        </div>
        <div className="flex gap-4 items-start">
          <a
            href="https://www.instagram.com/omarsrestaurant/"
            target="_blank"
            rel="noreferrer"
            className="inline-block border border-brand-gold text-brand-gold px-4 py-2 uppercase text-sm tracking-wide hover:bg-brand-gold hover:text-brand-dark transition"
          >
            Instagram
          </a>
          <a
            href="https://www.facebook.com/omarsfreshseafoodsteaks/"
            target="_blank"
            rel="noreferrer"
            className="inline-block border border-brand-gold text-brand-gold px-4 py-2 uppercase text-sm tracking-wide hover:bg-brand-gold hover:text-brand-dark transition"
          >
            Facebook
          </a>
        </div>
        <div>
          <NewsletterSignup />
        </div>
      </div>
    </footer>
  );
}
