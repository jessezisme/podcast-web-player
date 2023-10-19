import { build } from 'nuxt';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxt/ui', '@vueuse/nuxt', '@pinia/nuxt'],
  ui: {
    global: true,
    icons: ['heroicons'],
  },
  ssr: false,
  imports: {
    dirs: [
      // Scan top-level modules
      'composables',
      // ... or scan modules nested one level deep with a specific name and file extension
      'composables/*/index.{ts,js,mjs,mts}',
      // ... or scan all modules within given directory
      'composables/**',
    ],
  },
  postcss: {
    plugins: {
      'postcss-import': {},
    },
  },
  tailwindcss: {
    cssPath: '@/assets/style/main.scss',
  },
  // css: ['@/assets/style/main.css'],
});
