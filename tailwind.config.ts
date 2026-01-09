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
          brownDark: '#492F1E',
          brownMedium: '#AF7978',
          cream: '#EAD4C4',
          olive: '#676930',
          pinkLight: '#D3A5A5',
          pinkMedium: '#AF7978',
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
