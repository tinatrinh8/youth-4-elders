// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          pink: '#ec4899',   // tailwind pink-500
          orange: '#f97316', // tailwind orange-500
        },
      },
      spacing: {
        // ensures md:pl-72 matches your sidebar width
        72: '18rem',
      },
    },
  },
  plugins: [],
}
export default config
