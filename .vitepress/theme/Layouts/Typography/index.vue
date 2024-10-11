<script setup>
import { ref, watch, nextTick, provide } from 'vue'
import { useWindowSize } from '@vueuse/core'
import { useData } from 'vitepress'
import NavComp from './components/Nav.vue'
import CopyrightComp from './components/Copyright.vue'
import NotFound from 'vitepress/dist/client/theme-default/NotFound.vue'
import Home from './Home.vue'
import Page from './Page.vue'

const { page, isDark, frontmatter } = useData()

/* resize监听 */

const isLarge = ref(true)
const { width } = useWindowSize()
watch(
  width,
  val => {
    if (!page.isNotFound) isLarge.value = val >= 1200
  },
  { immediate: true }
)

/* 主题切换 */

const enableTransitions = () =>
  'startViewTransition' in document &&
  window.matchMedia('(prefers-reduced-motion: no-preference)').matches

provide('toggle-appearance', async ({ clientX: x, clientY: y }) => {
  if (!enableTransitions()) {
    isDark.value = !isDark.value
    return
  }

  const clipPath = [
    `circle(0px at ${x}px ${y}px)`,
    `circle(${Math.hypot(
      Math.max(x, innerWidth - x),
      Math.max(y, innerHeight - y)
    )}px at ${x}px ${y}px)`,
  ]

  await document.startViewTransition(async () => {
    isDark.value = !isDark.value
    await nextTick()
  }).ready

  document.documentElement.animate(
    { clipPath: isDark.value ? clipPath.reverse() : clipPath },
    {
      duration: 300,
      easing: 'ease-in',
      pseudoElement: `::view-transition-${isDark.value ? 'old' : 'new'}(root)`,
    }
  )
})
</script>
<template>
  <NotFound v-if="page.isNotFound" />
  <div v-else class="box-border py-40px of-x-hidden">
    <NavComp v-if="!isLarge" class="flex flex-col gap-2.5 m-7.5" />
    <div class="max-w-[calc(65ch+200px)] mx-a whitespace-nowrap" p="y-7.5 lg:y-0">
      <main class="w-prose m-auto" lg="m-0 m-r-5 inline-block">
        <Home v-if="frontmatter.layout === 'home'" />
        <Page v-else />
      </main>
      <div
        v-if="isLarge"
        class="inline-flex h-[calc(100vh-80px)] fixed top-0 w-160px"
        flex="col gap-y-6">
        <NavComp class="flex-1" flex="~ col justify-between items-start gap-2.5" />
        <CopyrightComp />
      </div>
    </div>
    <CopyrightComp v-if="!isLarge" />
  </div>
</template>
<style>
.Layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
  mix-blend-mode: normal;
}

::view-transition-old(root),
.dark::view-transition-new(root) {
  z-index: 1;
}

::view-transition-new(root),
.dark::view-transition-old(root) {
  z-index: 9999;
}

.VPSwitchAppearance {
  width: 22px !important;
}

.VPSwitchAppearance .check {
  transform: none !important;
}
</style>
