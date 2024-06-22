// from https://github.com/vitest-dev/vitest/blob/main/docs/.vitepress/meta.ts
// const googleapis = 'https://fonts.googleapis.com'
// const gstatic = 'https://fonts.gstatic.com'
// const pwaFontsRegex = new RegExp(`^${googleapis}/.*`, 'i')
// const pwaFontStylesRegex = new RegExp(`^${gstatic}/.*`, 'i')
// const githubusercontentRegex = new RegExp(
//   '^https://((i.ibb.co)|((raw|user-images).githubusercontent.com))/.*',
//   'i'
// )

export const pwa = {
  outDir: '.vitepress/dist',
  registerType: 'autoUpdate',
  // include all static assets under public/
  manifest: {
    id: '/',
    name: 'Cornor Blog',
    short_name: 'Cornor Blog',
    description: '个人技术思考与经验分享',
    theme_color: '#ffffff',
    background_color: '#ffffff',
    icons: [
      {
        src: '/icon.svg',
        sizes: '192x192',
        type: 'image/svg+xml',
      },
    ],
  },
  workbox: {
    navigateFallbackDenylist: [/^\/new$/],
    globPatterns: ['**/*.{css,js,html,png,svg,ico,txt,woff2}'],
  },
}
