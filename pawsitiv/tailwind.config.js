// tailwind.config.js
/**
 * Tailwind CSS Configuration for Pawsitiv Next.js App
 * K-pop Stan Edition: Pastel, dreamy, and glassy vibes!
 *
 * @see https://tailwindcss.com/docs/configuration
 */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/app/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        kpopPink: '#FFB7E5',
        kpopPurple: '#B5A1FF',
        kpopBlue: '#A7E0FF',
        kpopMint: '#A7FFD8',
        kpopYellow: '#FFF5A7',
        kpopGradientFrom: '#FFB7E5',
        kpopGradientVia: '#B5A1FF',
        kpopGradientTo: '#A7E0FF',
        glassWhite: 'rgba(255,255,255,0.25)',
        glassBorder: 'rgba(255,255,255,0.18)',
      },
      boxShadow: {
        glass: '0 4px 30px rgba(0, 0, 0, 0.1)',
      },
      backdropBlur: {
        glass: '12px',
      },
    },
  },
  plugins: [],
}; 