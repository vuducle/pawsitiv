import Image from 'next/image'; // Next.js Image component for optimization

// This is your home page component, corresponding to the '/' route.
// In the App Router, the root page file is named `page.tsx`.
export default function HomePage() {
  const message = 'Welcome to the Pawsitiv Next.js App Router Application!';

  return (
      <div className="text-center py-16 bg-white rounded-xl shadow-lg mt-8">
        <h1 className="text-5xl font-extrabold text-blue-700 mb-4">{message}</h1>
        <p className="text-xl text-gray-700 mb-8">This page is rendered using React Server Components within Next.js App Router.</p>
        <Image
            src="/images/logo.png" // Path relative to the `public` directory
            alt="Pawsitiv Logo"
            width={250}
            height={250}
            className="mx-auto rounded-lg shadow-md"
            priority
        />
      </div>
  );
}