import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Omar's Restaurant — Ashland, OR",
  description: "Steaks & seafood since 1946.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-brand-cream text-brand-dark font-sans">
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
