<script setup>
import { useData } from 'vitepress'
import { ref, watch } from 'vue'

/**
 * iframe
 *
 * @example
 * <ClientOnly>
 *   <FullScreen>
 *     <DemoIframe title="Demo Title" src="https://play.vuejs.org/" />
 *   </FullScreen>
 * </ClientOnly>
 */

const props = defineProps({
  height: { type: [String, Number], default: 500 },
  src: { type: String, required: true },
  title: { type: String, default: 'Demo via ifame' },
  // 仅在第三方网站模式依赖于class的时候使用
  watchTheme: { type: Boolean, default: false },
})

const { isDark } = useData()

if (props.watchTheme) watch(isDark, reloadIframe)

const iframeRef = ref()
function reloadIframe() {
  if (!iframeRef.value?.src) return
  const url = new URL(iframeRef.value.src)
  url.searchParams.set('_theme_refresh', String(Date.now()))
  iframeRef.value.src = url.toString()
}
</script>

<template>
  <iframe
    ref="iframeRef"
    :height
    style="width: 100%;"
    scrolling="no"
    :title
    :src
    frameborder="no"
    loading="lazy"
    allowtransparency="true"
    allowfullscreen="true"
  >
    Failed to load this demo({{ src }}).
  </iframe>
</template>
