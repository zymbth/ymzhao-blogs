<script setup>
import { ref, computed, provide } from 'vue'
import { useWindowSize } from '@vueuse/core'
import { useData } from 'vitepress'
import NotFound from 'vitepress/dist/client/theme-default/NotFound.vue'
import NavComp from './components/Nav.vue'
import CopyrightComp from './components/Copyright.vue'
import OutlineComp from './components/Outline.vue'
import Home from './Home.vue'
import Page from './Page.vue'
import CustomPage from './pages/index.vue'

const { page, isDark, frontmatter } = useData()

/* resize监听 */

const { width } = useWindowSize()
const isLarge = computed(() => width.value >= 1200)
provide('isLarge', isLarge)

const isDocLy = computed(() => (frontmatter.value.layout ?? 'doc') === 'doc')
const showOutline = ref(true)

/* 主题切换 */

// const enableTransitions = () =>
//   'startViewTransition' in document &&
//   window.matchMedia('(prefers-reduced-motion: no-preference)').matches

// provide('toggle-appearance', async ({ clientX: x, clientY: y }) => {
//   if (!enableTransitions()) {
//     isDark.value = !isDark.value
//     return
//   }

//   const clipPath = [
//     `circle(0px at ${x}px ${y}px)`,
//     `circle(${Math.hypot(
//       Math.max(x, innerWidth - x),
//       Math.max(y, innerHeight - y)
//     )}px at ${x}px ${y}px)`,
//   ]

//   await document.startViewTransition(async () => {
//     isDark.value = !isDark.value
//     await nextTick()
//   }).ready

//   document.documentElement.animate(
//     { clipPath: isDark.value ? clipPath.reverse() : clipPath },
//     {
//       duration: 300,
//       easing: 'ease-in',
//       pseudoElement: `::view-transition-${isDark.value ? 'old' : 'new'}(root)`,
//     }
//   )
// })
</script>
<template>
  <NotFound v-if="page.isNotFound" />
  <div v-else class="relative min-h-screen box-border of-x-hidden pb-40px" lg="pt-40px pb-0">
    <!-- Nav -->
    <NavComp v-if="!isLarge" class="flex flex-col gap-2.5 m-30px" />
    <!-- Content -->
    <div class="ct-wrap">
      <div class="ct-inner-wrap">
        <!-- Main -->
        <main class="w-prose m-auto" lg="m-0 inline-block">
          <Home v-if="frontmatter.layout === 'home'" />
          <CustomPage v-else-if="frontmatter.layout === 'custom'" />
          <Page v-else />
        </main>
        <!-- Placeholder -->
        <div v-show="isLarge" class="w-160px inline-block"></div>
        <!-- Large sider: Nav & Copyright -->
        <div
          v-show="isLarge"
          class="lg-sider h-[calc(100vh-60px)] w-160px m-l-20px of-y-auto"
          flex="col gap-y-8">
          <!-- switch -->
          <template v-if="isDocLy">
            <span
              v-if="!showOutline"
              class="i-mdi:table-of-contents w-1em h-1em switch-icon"
              title="查看目录"
              @click="showOutline = true"></span>
            <span
              v-else
              class="i-mdi:close w-1em h-1em switch-icon"
              title="关闭目录"
              @click="showOutline = false"></span>
          </template>
          <OutlineComp v-show="isDocLy && showOutline" />
          <template v-if="!isDocLy || !showOutline">
            <NavComp class="flex-1" flex="~ col justify-between items-start gap-2.5" />
            <CopyrightComp />
          </template>
        </div>
      </div>
    </div>
    <!-- Copyright -->
    <CopyrightComp
      v-if="!isLarge"
      class="text-center absolute bottom-8px left-50% transform-translate-x-[-50%]" />
  </div>
</template>
<style lang="scss" scoped>
// Content 居中，宽度自适应
.ct-wrap {
  text-align: center;
}
.ct-inner-wrap {
  display: inline-block;
  text-align: initial;
  margin: 0 auto;
  white-space: nowrap;
  main,
  div {
    white-space: normal;
  }
}
// 右侧固定
.lg-sider {
  display: inline-flex;
  position: fixed;
  top: 40px;
  transform: translateX(-100%);
  &::-webkit-scrollbar {
    width: 8px !important;
    height: 8px !important;
  }
  .switch-icon {
    position: absolute;
    top: 0;
    right: 0;
    cursor: pointer;
    z-index: 1;
  }
}
</style>
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
