import { Playfair_Display } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-playfair",
});

export const metadata = {
  title: "Omar's Restaurant, Ashland, OR",
  description: "Steaks & seafood since 1946.",
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
