/**
 * @file Footer.tsx
 * @description
 * K-pop Stan Edition Footer for Pawsitiv Next.js App
 * Features glassmorphism and pastel K-pop color theme.
 *
 * 💖 Stan your cats, stan your code, stan this footer! 💖
 *
 * @author Pawsitiv Team
 */

import * as React from "react";

/**
 * The main site footer with glassmorphism and K-pop vibes.
 *
 * @returns {React.ReactElement} The footer component.
 */
export default function Footer(): React.ReactElement {
  return (
    <footer
      className="glass backdrop-blur-lg mt-12 text-center rounded-t-xl shadow-glass border-t border-kpopPurple/30"
      style={{
        background:
          "linear-gradient(90deg, var(--kpop-pink), var(--kpop-purple), var(--kpop-blue))",
      }}
      aria-label="Site footer"
    >
      <div className="container mx-auto p-6">
        <p className="text-sm text-kpopPurple font-semibold">
          &copy; {new Date().getFullYear()} Pawsitiv Next. All rights reserved.
        </p>
        <p className="text-xs mt-2 text-kpopBlue">
          Powered by Next.js and Tailwind CSS — Stan responsibly! 💖
        </p>
      </div>
    </footer>
  );
}
