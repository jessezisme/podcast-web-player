import { _fontFamily } from '#tailwind-config/theme';

module.exports = {
  corePlugins: {
    fontWeight: false,
  },
  plugins: [require('./tailwind/plugins/font-variation-plugin.js')],
  theme: {
    container: {
      center: true,
      padding: '1rem',
    },
    fontFamily: {
      sans: ["'Inter Var'", 'sans-serif'],
      body: ["'Inter Var'", 'sans-serif'],
    },
  },
};
