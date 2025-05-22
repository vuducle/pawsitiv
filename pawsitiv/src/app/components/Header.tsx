"use client"; // This component uses Next.js Link, which needs to be a Client Component

import Link from 'next/link';
import { usePathname } from 'next/navigation'; // Hook to get current path for active links

// This component represents the header section of your application.
export default function Header() {
    const pathname = usePathname(); // Get the current path

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'Hello Page', href: '/hello' },
        { name: 'Cat Profile', href: '/catProfile' },
    ];

    return (
        <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 shadow-xl rounded-b-xl">
            <nav className="container mx-auto flex justify-between items-center">
                <Link href="/" className="text-3xl font-extrabold tracking-wide hover:text-blue-200 transition-colors duration-300">
                    Pawsitiv Next
                </Link>
                <ul className="flex space-x-6">
                    {navLinks.map((link) => (
                        <li key={link.name}>
                            <Link
                                href={link.href}
                                className={`text-lg font-medium hover:underline hover:text-blue-200 transition-colors duration-300 ${
                                    pathname === link.href ? 'underline text-blue-200' : '' // Apply active style
                                }`}
                            >
                                {link.name}
                            </Link>
                        </li>
                    ))}
                    <li>
                        <a href="/api/users" className="text-lg font-medium hover:underline hover:text-blue-200 transition-colors duration-300" target="_blank" rel="noopener noreferrer">
                            View Users API
                        </a>
                    </li>
                </ul>
            </nav>
        </header>
    );
}