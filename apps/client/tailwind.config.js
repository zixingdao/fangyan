/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#D32F2F', // 长沙红
          light: '#FF5722',   // 活力橙
          dark: '#B71C1C',
        },
        secondary: {
          DEFAULT: '#1976D2', // 湘江蓝
        },
        background: {
          DEFAULT: '#FAFAFA',
          paper: '#FFFFFF',
        }
      },
      fontFamily: {
        sans: ['PingFang SC', 'Microsoft YaHei', 'sans-serif'],
        brand: ['Ma Shan Zheng', 'KaiTi', 'serif'],
      }
    },
  },
  plugins: [],
}
