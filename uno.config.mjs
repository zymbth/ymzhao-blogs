import {
  defineConfig,
  presetUno,
  presetAttributify,
  transformerAttributifyJsx,
  presetIcons,
} from 'unocss'
import transformerVariantGroup from '@unocss/transformer-variant-group'

export default defineConfig({
  // ...UnoCSS options
  // rules: [],
  presets: [
    presetUno({ dark: 'class', attributify: false }),
    presetAttributify({ nonValuedAttribute: false }),
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
})
