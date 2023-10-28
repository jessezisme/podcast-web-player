import { build } from 'nuxt';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: 'Pod Nexus',
      meta: [
        { name: 'robots', content: 'noindex, nofollow' },
        { name: 'description', content: 'Listen to all your favorite podcasts with Pod Nexus' },
      ],
    },
  },
  runtimeConfig: {
    public: {
      appName: 'Pod Nexus',
    },
    ApiKeyListenNotes: process.env.API_KEY_LISTEN_NOTES,
  },
  devtools: { enabled: true },
  modules: ['@nuxt/ui', '@vueuse/nuxt', '@pinia/nuxt', '@nuxt/image'],
  alias: {
    '~': `${__dirname}`,
    '@': `${__dirname}`,
  },
  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],
  ui: {
    global: true,
    icons: ['heroicons', 'mdi'],
  },
  imports: {
    dirs: ['composables', 'composables/*/index.{ts,js,mjs,mts}', 'composables/**'],
  },
  plugins: [],
  postcss: {
    plugins: {
      'postcss-import': {},
    },
  },
  tailwindcss: {
    cssPath: '@/assets/style/main.scss',
  },
});
