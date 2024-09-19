<script setup>
import { nextTick, provide, computed } from 'vue'
import { useData, useRoute } from 'vitepress'
import Comment from '../Comment.vue'

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

const route = useRoute()
const pageName = computed(() => route.path.replace(/[./]+/g, '_').replace(/_html$/, ''))
</script>
<template>
  <div v-if="frontmatter.layout !== false" class="Layout" :class="frontmatter.pageClass">
    <div class="VPContent" id="VPContent" :class="{ 'is-home': frontmatter.layout === 'home' }">
      <div class="content">
        <div class="content-container">
          <main class="main">
            <Content class="vp-doc" :class="[pageName]" />
          </main>
          <Comment :key="page.relativePath" />
        </div>
      </div>
    </div>
  </div>
  <Content v-else />
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
