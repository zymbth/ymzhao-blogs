import {
  defineConfig,
  presetUno,
  presetAttributify,
  presetIcons,
  transformerVariantGroup,
  transformerAttributifyJsx,
} from 'unocss'

export default defineConfig({
  // ...UnoCSS options
  // rules: [],
  presets: [
    presetUno({ dark: 'class', attributify: false }),
    presetAttributify({ nonValuedAttribute: true }),
    presetIcons({
      collections: {
        mdi: () => import('@iconify-json/mdi/icons.json').then(i => i.default),
      },
    }),
  ],
  transformers: [transformerVariantGroup(), transformerAttributifyJsx()],
  content: {
    pipeline: {
      include: [/\.(vue|svelte|[jt]sx|mdx?|astro|elm|php|phtml|html|ts)($|\?)/],
    },
  },
  extendTheme: theme => {
    return {
      ...theme,
      breakpoints: {
        ...theme.breakpoints,
        md: '750px',
        lg: '1200px',
      },
    }
  },
})
