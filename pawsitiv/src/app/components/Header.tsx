"use client";

/**
 * @file Header.tsx
 * @description
 * K-pop Stan Edition Header for Pawsitiv Next.js App
 * Features glassmorphism, pastel K-pop color theme, and mobile nav.
 *
 * 💖 Stan your bias, stan your cats, stan this UI! 💖
 *
 * @author Pawsitiv Team
 */

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { FiMenu, FiX, FiUser, FiLogOut } from "react-icons/fi";
import { useAuthStore } from "../../stores/authStore";

/**
 * Navigation links for the main header.
 * @type {{ name: string; href: string }[] }
 */
const navLinks = [
  { name: "Home", href: "/" },
  { name: "Cat Collection", href: "/catCollection" },
  { name: "Cat Profile", href: "/catProfile" },
];

/**
 * The main site header with glassmorphism and K-pop vibes.
 *
 * @returns {React.ReactElement} The header component.
 */
export default function Header(): React.ReactElement {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();

  // Stan your scroll: add shadow and glass when scrolled
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
  }, [isOpen]);

  return (
    <>
      {/* K-pop glassy header */}
      <header
        className={`fixed w-full z-50 transition-all duration-300 ${
          scrolled
            ? "shadow-lg glass backdrop-blur-lg"
            : "glass backdrop-blur-lg"
        }`}
        style={{
          background: scrolled
            ? "var(--glass-white)"
            : "linear-gradient(90deg, var(--kpop-pink), var(--kpop-purple), var(--kpop-blue))",
          borderBottom: "1.5px solid var(--glass-border)",
        }}
        aria-label="Main navigation header"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo - Stan your brand! */}
            <Link
              href="/"
              className="text-2xl md:text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-kpopPink via-kpopPurple to-kpopBlue drop-shadow-lg"
              aria-label="Pawsitiv Home"
            >
              Pawsitiv<span className="text-kpopPink">Next</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3 py-2 text-base font-semibold rounded-lg transition-colors duration-200 ${
                    pathname === link.href
                      ? "bg-kpopPink text-kpopPurple shadow-glass"
                      : "text-kpopBlue hover:bg-kpopPurple hover:text-white"
                  }`}
                  aria-current={pathname === link.href ? "page" : undefined}
                >
                  {link.name}
                </Link>
              ))}

              {/* Auth Links */}
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <Link
                    href="/profile"
                    className="flex items-center space-x-2 text-kpopPurple hover:text-kpopPink transition-colors duration-200"
                  >
                    <FiUser className="h-4 w-4" />
                    <span className="text-sm font-medium">{user?.name}</span>
                  </Link>
                  <button
                    onClick={logout}
                    className="px-3 py-2 text-base font-semibold rounded-lg transition-colors duration-200 text-kpopBlue hover:bg-kpopPurple hover:text-white flex items-center space-x-2"
                  >
                    <FiLogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    href="/login"
                    className="px-3 py-2 text-base font-semibold rounded-lg transition-colors duration-200 text-kpopBlue hover:bg-kpopPurple hover:text-white"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 py-2 text-base font-semibold rounded-lg transition-colors duration-200 bg-gradient-to-r from-kpopPink to-kpopPurple text-white hover:from-kpopPurple hover:to-kpopPink shadow-glass"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-kpopPurple hover:text-kpopPink focus:outline-none"
                aria-expanded={isOpen}
                aria-label="Toggle menu"
              >
                {isOpen ? (
                  <FiX className="h-7 w-7" />
                ) : (
                  <FiMenu className="h-7 w-7" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation - Only render on mobile */}
      {isOpen && (
        <>
          {/* Mobile Navigation Overlay */}
          <div
            className="fixed inset-0 z-40 transition-all duration-300 ease-in-out visible bg-black/40"
            onClick={() => setIsOpen(false)}
            aria-hidden={false}
          ></div>

          {/* Mobile Navigation Panel - Glassy, pastel, and dreamy */}
          <div
            className="fixed top-0 right-0 z-50 h-full w-4/5 max-w-sm glass shadow-2xl transform translate-x-0 transition-transform duration-300 ease-in-out"
            style={{
              background:
                "linear-gradient(120deg, var(--kpop-pink) 0%, var(--kpop-purple) 50%, var(--kpop-blue) 100%)",
              borderLeft: "1.5px solid var(--glass-border)",
            }}
            aria-label="Mobile navigation panel"
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-4 border-b border-kpopPurple/30">
                <Link
                  href="/"
                  className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-kpopPink via-kpopPurple to-kpopBlue"
                  onClick={() => setIsOpen(false)}
                  aria-label="Pawsitiv Home"
                >
                  PawsitivNext
                </Link>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-md text-kpopPurple hover:bg-kpopPink focus:outline-none"
                  aria-label="Close menu"
                >
                  <FiX className="h-7 w-7" />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto p-4 space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`block px-4 py-3 rounded-lg text-lg font-semibold transition-colors duration-200 ${
                      pathname === link.href
                        ? "bg-kpopPurple text-white shadow-glass"
                        : "text-kpopBlue hover:bg-kpopPink hover:text-kpopPurple"
                    }`}
                    onClick={() => setIsOpen(false)}
                    aria-current={pathname === link.href ? "page" : undefined}
                  >
                    {link.name}
                  </Link>
                ))}

                {/* Mobile Auth Links */}
                {isAuthenticated ? (
                  <>
                    <Link
                      href="/profile"
                      className="px-4 py-3 text-kpopPurple border-t border-kpopPurple/30 mt-4 block"
                      onClick={() => setIsOpen(false)}
                    >
                      <div className="flex items-center space-x-2">
                        <FiUser className="h-4 w-4" />
                        <span className="text-sm font-medium">
                          {user?.name}
                        </span>
                      </div>
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 rounded-lg text-lg font-semibold transition-colors duration-200 text-kpopBlue hover:bg-kpopPink hover:text-kpopPurple flex items-center space-x-2"
                    >
                      <FiLogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="block px-4 py-3 rounded-lg text-lg font-semibold transition-colors duration-200 text-kpopBlue hover:bg-kpopPink hover:text-kpopPurple"
                      onClick={() => setIsOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      className="block px-4 py-3 rounded-lg text-lg font-semibold transition-colors duration-200 text-white bg-gradient-to-r from-kpopPink to-kpopPurple hover:from-kpopPurple hover:to-kpopPink shadow-glass"
                      onClick={() => setIsOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </>
                )}

                <a
                  href="/api/users"
                  className="block px-4 py-3 rounded-lg text-lg font-semibold text-white bg-gradient-to-r from-kpopPink via-kpopPurple to-kpopBlue hover:from-kpopBlue hover:to-kpopPink mt-4 shadow-glass"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsOpen(false)}
                >
                  View API
                </a>
              </nav>

              <div className="p-4 border-t border-kpopPurple/30">
                <p className="text-kpopPurple text-sm text-center">
                  © {new Date().getFullYear()} Pawsitiv — Stan responsibly!
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
