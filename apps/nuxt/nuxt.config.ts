// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  nitro: {
    esbuild: {
      options: {
        target: 'es2019'
      }
    }
  }
})
