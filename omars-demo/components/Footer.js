import NewsletterSignup from './NewsletterSignup';

export default function Footer() {
  return (
    <footer className="bg-brand-dark text-brand-cream border-t border-brand-gold mt-16">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row justify-between gap-6">
        <div>
          <p className="font-serif text-xl text-brand-gold">OMAR&apos;S</p>
          <p className="text-sm mt-2">1380 Siskiyou Blvd, Ashland, OR 97520</p>
          <p className="text-sm">541.482.1281</p>
          <p className="text-sm mt-2">Est. 1946 &middot; Ashland&apos;s oldest restaurant</p>
        </div>
        <div className="flex gap-4 items-start">
          <a
            href="https://www.instagram.com/omarsrestaurant/"
            target="_blank"
            rel="noreferrer"
            className="text-brand-gold hover:text-brand-cream"
          >
            Instagram
          </a>
          <a
            href="https://www.facebook.com/omarsfreshseafoodsteaks/"
            target="_blank"
            rel="noreferrer"
            className="text-brand-gold hover:text-brand-cream"
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
