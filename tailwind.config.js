module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'media',
  theme: {
    extend: {
      borderRadius: {
        '2xl': '1rem'
      },
      colors: {
        accent: {
          50: '#f5fbff',
          100: '#e6f6ff',
          500: '#0ea5e9'
        }
      }
    }
  },
  plugins: [require('@tailwindcss/typography'), require('@tailwindcss/forms')]
}
