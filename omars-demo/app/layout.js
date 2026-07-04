import { Playfair_Display } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { BUSINESS } from "@/lib/business";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-playfair",
});

export const metadata = {
  metadataBase: new URL(BUSINESS.siteUrl),
  title: {
    default: "Omar's Fresh Seafood & Steaks - Ashland, OR - Since 1946",
    template: "%s | Omar's Fresh Seafood & Steaks",
  },
  description:
    "Ashland's oldest restaurant and first public cocktail lounge. Fresh seafood, hand-cut steaks, and a full bar at 1380 Siskiyou Blvd. Open daily 11am to 10pm.",
  openGraph: {
    type: "website",
    siteName: "Omar's Fresh Seafood & Steaks",
    locale: "en_US",
    images: ["/site-assets/og-image.jpg"],
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={playfair.variable}>
      <body className="bg-brand-cream text-brand-dark font-sans">
        <JsonLd />
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
