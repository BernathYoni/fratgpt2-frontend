import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#FFFFFF',
        surface: '#FAFBFC',
        'surface-hover': '#F5F7FA',
        border: '#E1E4E8',
        'text-primary': '#24292E',
        'text-secondary': '#586069',
        'text-muted': '#959DA5',
        accent: '#0366D6',
        'accent-hover': '#0256C5',
        error: '#D73A49',
        success: '#28A745',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
