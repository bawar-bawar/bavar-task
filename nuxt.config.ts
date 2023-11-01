// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  head :{
  link: [
    {
      rel:'stylesheet',
      href:'https://fonts.googleapis.com/css2?family=Commissioner:wght@300;400;500&display=swap'
    }
 ]
  },
  modules: [
    '@nuxtjs/tailwindcss',
    'nuxt-icon'
  ],
  devtools: { enabled: true }
})
