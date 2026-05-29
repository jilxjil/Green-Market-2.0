/** @type {import('tailwindcss').Config} */
/* eslint-disable @typescript-eslint/no-require-imports */

const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  extend: {
  colors: {
    background: "hsl(var(--background))",
    foreground: "hsl(var(--foreground))",

    primary: "hsl(var(--primary))",
    "primary-foreground": "hsl(var(--primary-foreground))",
    "green-accent": "hsl(var(--green-accent))",

    accent: "hsl(var(--accent))",
    "accent-foreground": "hsl(var(--accent-foreground))",

    secondary: "hsl(var(--secondary))",
    "secondary-foreground": "hsl(var(--secondary-foreground))",

    muted: "hsl(var(--muted))",
    "muted-foreground": "hsl(var(--muted-foreground))",

    border: "hsl(var(--border))",
    input: "hsl(var(--input))",
    ring: "hsl(var(--ring))",
  },
}
},
  plugins: [],
});

/*// tailwind.config.js
colors: {
  green: {
    50:  '#F0FAF2',
    100: '#C3EDCB',
    200: '#8ED99A',
    500: '#46A758',  // primary
    700: '#2D7A3E',  // hover
    900: '#1A4D25',  // text on light fills
  },
  orange: {
    50:  '#FFF4EB',
    100: '#FDDAB6',
    200: '#F9B06A',
    500: '#E07722',  // accent / warning
    700: '#A8530F',  // text on orange fills
    900: '#6B3208',
  }
}*/
