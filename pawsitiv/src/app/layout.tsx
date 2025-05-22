import Head from 'next/head';
import Header from './components/Header'; // Import the Header component (replaces header.hbs)
import Footer from './components/Footer'; // Import the Footer component (replaces footer.hbs)
import './globals.css'; // Global CSS for the entire application

export const metadata = {
    title: 'Pawsitiv Next.js App',
    description: 'A modern web application for animal lovers built with Next.js App Router and TypeScript.',
};

// This is the root layout component for your entire application.
// It replaces _app.js and the global Layout.js from the Pages Router.
// It defines the <html> and <body> tags and wraps all pages.
export default function RootLayout({
                                       children // This prop will contain the content of the current page or nested layout
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
        <body className="flex flex-col min-h-screen font-inter bg-gray-100 text-gray-800">
        {/* Header and Footer are now part of the root layout */}
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
            {children} {/* Renders the current page content */}
        </main>
        <Footer />
        </body>
        </html>
    );
}