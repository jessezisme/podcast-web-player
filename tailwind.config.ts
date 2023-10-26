import type { Config } from 'tailwindcss';
import { _fontFamily } from '#tailwind-config/theme';

const defaultTheme = require('tailwindcss/defaultTheme');
const defaultColors = { ...defaultTheme.colors };

const themeColors = {
  // blue
  brand1: {
    '50': '#f0f6fe',
    '100': '#dceafd',
    '200': '#c1dbfc',
    '300': '#97c5f9',
    '400': '#66a6f4',
    '500': '#4284ef',
    '600': '#2c67e4',
    '700': '#2451d1',
    '800': '#2343aa',
    '900': '#233e8a',
    '950': '#192652',
  },
  // violet
  brand2: {
    '50': '#fbf5fe',
    '100': '#f7eafd',
    '200': '#e7c6f7',
    '300': '#e2b4f3',
    '400': '#d187eb',
    '500': '#bb58dd',
    '600': '#a038c1',
    '700': '#862c9f',
    '800': '#6f2682',
    '900': '#5e246b',
    '950': '#3b0c46',
  },
  // error state
  error: { ...defaultColors.red },
  // success state
  success: { ...defaultColors.emerald },
  // warn state
  warn: { ...defaultColors.yellow },
};

module.exports = {
  content: ['./pages/**/*.{vue,html,js}', './components/**/*.{vue,html,js}'],
  corePlugins: {
    fontWeight: false,
  },
  plugins: [require('./tailwind/plugins/font-variation-plugin.js')],
  theme: {
    container: {
      center: true,
      padding: '1rem',
    },
    extend: {
      colors: { ...themeColors },
      textColor: ({ theme }) => ({
        body: {
          DEFAULT: theme('colors')['gray']['950'],
          v1: theme('colors')['gray']['800'],
          v2: theme('colors')['gray']['600'],
          inv: {
            DEFAULT: '#fff',
            v1: theme('colors')['gray']['200'],
            v2: theme('colors')['gray']['400'],
          },
        },
        link: {
          DEFAULT: theme('colors')['brand2']['700'],
          v1: theme('colors')['brand2']['800'],
          v2: theme('colors')['brand2']['900'],
          inv: {
            DEFAULT: theme('colors')['brand2']['300'],
            v1: theme('colors')['brand2']['200'],
            v2: theme('colors')['brand2']['100'],
          }
        }
      }),
    },
  },
} satisfies Config;
