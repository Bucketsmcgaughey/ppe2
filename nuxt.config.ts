// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  ssr: true,
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
    app: {
    head: {
      title: 'Prenzlbogen Pakete', // default fallback title
      htmlAttrs: {
        lang: 'en',
      },
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.svg' },
      ],
    },
  },
  // css: ['~/assets/css/globals.scss'],
  modules: [
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/scripts',
    'nuxt-users',
    'vuetify-nuxt-module',
    '@nuxtjs/i18n',
  ],
  nuxtUsers: {
    connector: {
      name: 'sqlite', // | 'mysql' | 'postgresql'
      options: {
        path: './data/users.sqlite3'
      }
    },
    auth: {
      whitelist: [
        '/signup',
        '/api/_hub/*',
        '/api/nuxt-users/register',
      ],
      permissions: {
        // user: ["*"],
        user: [
          '/',
          '/account',
          '/dashboard',
          '/en',
          '/en/dashboard',
          '/en/account',
          { path: '/api/nuxt-users*', methods: ['GET', 'POST', 'PATCH'] },
          { path: '/api/residents', methods: ['GET', 'POST', 'PATCH'] },
          { path: '/api/parcels', methods: ['GET', 'POST', 'PATCH'] }
        ],
        admin: [
          '*'
        ]
      },
      tokenExpiration: 40320, // 1 month (in minutes)

    },
    passwordResetUrl: '/resetpassword', // URL path for password reset page

  },
  i18n: {
    defaultLocale: 'de',
    locales: [
      { code: 'de', name: 'Deutsch', file: 'de.json' },
      { code: 'en', name: 'English', file: 'en.json' }

    ]
  },
  vuetify: {
    vuetifyOptions: {
            icons: {
        defaultSet: 'mdi'
      },
      theme: {
        dark: false,
        light: true,
      themes: {
        light: {
          colors: {
            primary: "#333"
          }
        }
      }
      }
    },
  },
    nitro: {
    compressPublicAssets: {
      gzip: true,
      brotli: true
    }
  },
})
