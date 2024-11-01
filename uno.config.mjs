import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetUno,
  transformerAttributifyJsx,
  transformerDirectives,
  transformerVariantGroup,
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
  transformers: [transformerVariantGroup(), transformerDirectives(), transformerAttributifyJsx()],
  content: {
    pipeline: {
      include: [/\.(vue|svelte|[jt]sx|mdx?|astro|elm|php|phtml|html|ts)($|\?)/],
    },
  },
  theme: {
    colors: {
      tgTxt: 'var(--tg-txt-color)',
      tgTxt1: 'var(--tg-txt-color-1)',
      tgTxt2: 'var(--tg-txt-color-2)',
      tgBg: 'var(--tg-bg-color)',
    },
  },
  extendTheme: (theme) => {
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
