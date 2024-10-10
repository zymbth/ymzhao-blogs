import { defineConfig, presetUno, presetAttributify, transformerAttributifyJsx } from 'unocss'
import transformerVariantGroup from '@unocss/transformer-variant-group'

export default defineConfig({
  // ...UnoCSS options
  // rules: [],
  presets: [
    presetUno({ dark: 'class', attributify: false }),
    presetAttributify({ nonValuedAttribute: false }),
  ],
  transformers: [transformerVariantGroup(), transformerAttributifyJsx()],
  content: {
    pipeline: {
      include: [/\.(vue|svelte|[jt]sx|mdx?|astro|elm|php|phtml|html|ts)($|\?)/],
    },
  },
})
