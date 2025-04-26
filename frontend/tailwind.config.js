/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6', // Tailwind Blue 500
        secondary: '#93C5FD',
        accent: '#10B981',
        error: '#EF4444',
        background: '#F9FAFB',
        text: '#1F2937',
        textSecondary: '#6B7280',
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
} 