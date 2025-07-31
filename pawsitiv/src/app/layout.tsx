import Header from "./components/Header"; // Import the Header component (replaces header.hbs)
import Footer from "./components/Footer"; // Import the Footer component (replaces footer.hbs)
import AuthInitializer from "./components/AuthInitializer"; // Import the AuthInitializer
import "./globals.css"; // Global CSS for the entire application

export const metadata = {
  title: "Pawsitiv Next.js App",
  description:
    "A modern web application for animal lovers built with Next.js App Router and TypeScript.",
};

/**
 * Root layout component for the entire application
 *
 * This component:
 * - Defines the HTML structure
 * - Provides global styling
 * - Initializes authentication state
 * - Renders header, main content, and footer
 *
 * @param children - The content of the current page or nested layout
 */
export default function RootLayout({
  children, // This prop will contain the content of the current page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen font-inter">
        {/* AuthInitializer checks authentication on app start */}
        <AuthInitializer />

        {/* Header and Footer are now part of the root layout */}
        <Header />
        <main className="flex-grow">
          {children} {/* Renders the current page content */}
        </main>
        <Footer />
      </body>
    </html>
  );
}
