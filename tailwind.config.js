/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#7C5DFA',
        'primary-light': '#9277FF',
        'primary-soft': '#DE3FFA',
        muted: '#888EB0',
        'muted-dark': '#7E88C3',
        'dark-1': '#252945',
        'dark-2': '#0C0E16',
        'dark-light': '#373B53',
        danger: '#EC5757',
        'danger-light': '#FF9797',
        light: '#F8F8FB',
        'dark-gray': '#7E88C3',
        'gray-1': '#DFE3FA',
        'gray-2': '#888EB0',
        'gray-light': '#E4E7F7',
        'gray-super-light': '#F4F4F5',
        'green-1': '#33D69F',
        'green-light': '#F5FDFA',
        'orange-1': '#FF8F00',
        'orange-light': '#FEFAF1',

      },
      fontFamily: {
        'league-spartan': ['"League Spartan"', 'sans-serif'],
      },
      fontSize: {
        'heading-l': ['36px', {
          lineHeight: 'normal',
          letterSpacing: '-1.125px',
          fontWeight: '700',
        }],
        'heading-m': ['24px', {
          lineHeight: 'normal',
          letterSpacing: '-0.75px',
          fontWeight: '700',
        }],
        'heading-s': ['15px', {
          lineHeight: '24px',
          letterSpacing: '-0.25px',
          fontWeight: '700',
        }],
        'heading-s-nobold': ['15px', {
          lineHeight: '24px',
          letterSpacing: '-0.25px',
          fontWeight: '500',
        }],
        'body': ['13px', {
          lineHeight: '18px',
          letterSpacing: '-0.1px',
          fontWeight: '500',
        }],
        'body-bold': ['13px', {
          lineHeight: '18px',
          letterSpacing: '-0.1px',
          fontWeight: '700',
        }],
      },
    },
  },
  plugins: [],
} 