"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { FiMenu, FiX } from "react-icons/fi";

export default function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Hello Page", href: "/hello" },
    { name: "Cat Profile", href: "/catProfile" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  return (
    <>
      <header
        className={`fixed w-full z-50 transition-all duration-300 ${
          scrolled
            ? "bg-blue-800 shadow-lg"
            : "bg-gradient-to-r from-blue-600 to-blue-800"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link
              href="/"
              className="text-2xl md:text-3xl font-extrabold tracking-tight text-white hover:text-blue-200 transition-colors"
            >
              Pawsitiv<span className="text-blue-200">Next</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-1 py-2 text-sm font-medium transition-colors ${
                    pathname === link.href
                      ? "text-blue-200 border-b-2 border-blue-200"
                      : "text-white hover:text-blue-200"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <a
                href="/api/users"
                className="px-3 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-600 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                View API
              </a>
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-blue-200 focus:outline-none"
                aria-expanded={isOpen}
                aria-label="Toggle menu"
              >
                {isOpen ? (
                  <FiX className="h-6 w-6" />
                ) : (
                  <FiMenu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Overlay */}
      <div
        className={`fixed inset-0 z-40 transition-all duration-300 ease-in-out ${
          isOpen ? "visible bg-black/50" : "invisible bg-transparent"
        }`}
        onClick={() => setIsOpen(false)}
      ></div>

      {/* Mobile Navigation Panel */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-4/5 max-w-sm bg-blue-800 shadow-2xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-blue-700">
            <Link
              href="/"
              className="text-xl font-bold text-white"
              onClick={() => setIsOpen(false)}
            >
              PawsitivNext
            </Link>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-md text-white hover:bg-blue-700 focus:outline-none"
              aria-label="Close menu"
            >
              <FiX className="h-6 w-6" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`block px-4 py-3 rounded-lg text-lg font-medium transition-colors ${
                  pathname === link.href
                    ? "bg-blue-700 text-white"
                    : "text-white hover:bg-blue-700"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <a
              href="/api/users"
              className="block px-4 py-3 rounded-lg text-lg font-medium text-white bg-blue-600 hover:bg-blue-500 mt-4"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
            >
              View API
            </a>
          </nav>

          <div className="p-4 border-t border-blue-700">
            <p className="text-blue-200 text-sm">
              © {new Date().getFullYear()} Pawsitiv
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
