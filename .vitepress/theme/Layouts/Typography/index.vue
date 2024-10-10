<script setup>
import { nextTick, provide } from 'vue'
import { useData } from 'vitepress'
import NavComp from './components/Nav.vue'
import CopyrightComp from './components/Copyright.vue'
import NotFound from 'vitepress/dist/client/theme-default/NotFound.vue'
import Home from './Home.vue'
import Page from './Page.vue'

const { page, isDark, frontmatter } = useData()

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
  <!-- <div v-else class="px-7 py-10 of-x-hidden"> -->
  <div
    v-else
    class="max-w-1200px mx-a of-x-hidden"
    p="7.5 lg:y-0 lg:x-20"
    lg="grid gap-x-6 cols-[3fr_1fr] rows-[1fr_9rem]">
    <NavComp
      class="transition-swup-header flex flex-col gap-2.5"
      m="7.5 lg:x-0 lg:t-20 lg:b-4"
      lg="row-1-2 col-2-3 justify-between items-start" />
    <main class="transition-swup-main w-prose m-auto" lg="row-1-3 col-1-2 py-20 ">
      <Home v-if="frontmatter.layout === 'home'" />
      <Page v-else />
    </main>
    <CopyrightComp class="transition-swup-footer py-7.5" lg="row-2-3 col-2-3" />
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
