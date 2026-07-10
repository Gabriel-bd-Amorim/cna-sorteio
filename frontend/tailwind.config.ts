import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cna: {
          blue: '#0B3D91',
          red: '#E4032E',
          yellow: '#FFC72C',
        },
      },
    },
  },
  plugins: [],
};
export default config;
