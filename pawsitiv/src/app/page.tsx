import Image from 'next/image'; // Next.js Image component for optimization

// This is your home page component, corresponding to the '/' route.
// In the App Router, the root page file is named `page.tsx`.
export default function HomePage() {
  const message = 'Welcome to the Pawsitiv Next.js App Router Application!';

  return (
      <div className="text-center py-16 bg-white text-black rounded-xl shadow-lg mt-8">
        <h1 className="text-5xl font-extrabold text-blue-700 mb-4">{message}</h1>
          <h2 className="title is-2">Mei</h2>
          <p>Nginx with SSL and Docker</p>
          <p>Iykyk chinese spyware</p>
          <p>App in development, Malte will change it.</p>
          <p>CAP</p>
          <Image src="/img/lickingCat.webp" className="m-auto" width={200} height={200} alt="Cat" />
      </div>
  );
}