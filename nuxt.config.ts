// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { 
    enabled: true,
    timeline: {
      enabled: true,
    },
  },
  modules: ['@nuxt/ui'],
  css: [
    '@/assets/global.css',
  ],
  imports: {
    dirs: ["types"],
  }
})
