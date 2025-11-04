<script setup>
import { useData } from 'vitepress'
import { onMounted, onUnmounted, ref, watch } from 'vue'
import FullScreen from './FullScreen.vue'

/**
 * Demo via iframe
 *
 * @example
 * <DemoIframe title="Demo Title" src="https://play.vuejs.org/" />
 */

const props = defineProps({
  height: { type: [String, Number], default: 500 },
  src: { type: String, required: true },
  title: { type: String, default: 'Demo via ifame' },
  // 仅在第三方网站模式依赖于class的时候使用
  watchTheme: { type: Boolean, default: false },
})

const { isDark } = useData()

const targetRef = ref()
/** @type {IntersectionObserver | null} */
let observer = null
const inView = ref(false) // 状态：是否已进入视口

onMounted(() => {
  if (props.watchTheme) watch(isDark, reloadIframe)

  observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        inView.value = true
        observer?.unobserve(targetRef.value)
        observer?.disconnect()
      }
    },
    { threshold: 0.1 }
  )

  if (targetRef.value) observer.observe(targetRef.value)
})

onUnmounted(() => {
  if (observer) observer.disconnect()
})

const iframeRef = ref()
const loaded = ref(false)

function reloadIframe() {
  if (!loaded.value || !iframeRef.value?.src) return
  const url = new URL(iframeRef.value.src)
  url.searchParams.set('_theme_refresh', String(Date.now()))
  iframeRef.value.src = url.toString()
}
</script>

<template>
  <FullScreen>
    <div ref="targetRef" class="demo-wrap">
      <iframe
        v-if="inView"
        ref="iframeRef"
        :height
        style="width:100%"
        scrolling="no"
        :title
        :src
        frameborder="no"
        loading="lazy"
        allowtransparency="true"
        allowfullscreen="true"
        @load="loaded = true"
      >
        Failed to load this demo({{ src }}).
      </iframe>
      <div v-show="!loaded" class="placeholder" />
    </div>
  </FullScreen>
</template>

<style lang="scss" scoped>
.demo-wrap {
  position: relative;
}
.placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: linear-gradient(90deg, rgba(0, 0, 0, 0.04) 33%, rgba(0, 0, 0, 0.1) 50%, rgba(0, 0, 0, 0.04) 66%);
  background-color: var(--tg-bg-color);
  background-size: 300% 100%;
  animation: loading 1s infinite linear;
}
.dark .placeholder {
  background-image: linear-gradient(90deg, rgba(0, 0, 0, 0.04) 33%, rgba(0, 0, 0, 0.1) 50%, rgba(0, 0, 0, 0.04) 66%);
}
.fullscreened .demo-wrap, .fullscreened .demo-wrap iframe {
  height: 100%;
}
@keyframes loading {
  0% {
    background-position: right;
  }
}
</style>
