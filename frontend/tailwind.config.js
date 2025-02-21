/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class', // Enables dark mode with a CSS class
    content: [
      "./src/**/*.{js,jsx,ts,tsx}", // Make sure Tailwind scans your components
    ],
    theme: {
      extend: {
        colors: {
          primary: '#FF7F50', // Coral color
          secondary: '#00BFFF', // Deep sky blue
          background: '#F3F4F6', // Light gray background
          dark: '#1A1A1A', // Dark mode background
        },
      },
    },
    plugins: [],
  };
  