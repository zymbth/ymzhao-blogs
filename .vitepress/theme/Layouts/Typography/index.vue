<script setup>
import { useWindowSize } from '@vueuse/core'
import { useData, useRouter } from 'vitepress'
import NotFound from 'vitepress/dist/client/theme-default/NotFound.vue'
import { computed, provide, ref } from 'vue'
import CopyrightComp from './components/Copyright.vue'
import NavComp from './components/Nav.vue'
import OutlineComp from './components/Outline.vue'
import SwitchAppearance from './components/SwitchAppearance.vue'
import Home from './Home.vue'
import Page from './Page.vue'
import CustomPage from './pages/index.vue'

const { page, frontmatter } = useData()
const router = useRouter()
const mainRef = ref()
router.onAfterPageLoad = (to) => {
  const hash = to.split('#')[1]
  // Page中含hash时不滚动
  if (!frontmatter.layout && hash) return
  mainRef.value?.scrollTo({ behavior: 'smooth', top: 0, left: 0 })
}

/* resize监听 */

const { width } = useWindowSize()
const isLarge = computed(() => width.value >= 1200)
provide('isLarge', isLarge)

const isDocLy = computed(() => (frontmatter.value.layout ?? 'doc') === 'doc')
const showOutline = ref(true)
</script>

<template>
  <NotFound v-if="page.isNotFound" />
  <div v-else class="ct-wrap box-border" lg="h-screen of-y-hidden pt-40px">
    <!-- Nav -->
    <NavComp v-if="!isLarge" class="m-30px flex flex-col gap-2.5" />
    <div flex="~ items-start justify-center gap-x-20px">
      <!-- Main -->
      <main ref="mainRef" class="main max-w-prose w-full of-x-visible px-26px lg:w-prose lg:px-0">
        <Home v-if="frontmatter.layout === 'home'" />
        <CustomPage v-else-if="frontmatter.layout === 'custom'" />
        <Page v-else />
      </main>
      <!-- Large sider: Nav & Copyright -->
      <div v-show="isLarge" class="lg-sider w-160px">
        <!-- switch -->
        <template v-if="isDocLy">
          <span
            v-if="!showOutline"
            class="icon-link switch-icon i-mdi:table-of-contents h-1em w-1em"
            title="查看目录"
            @click="showOutline = true"
          />
          <span
            v-else
            class="icon-link switch-icon i-mdi:close h-1em w-1em"
            title="关闭目录"
            @click="showOutline = false"
          />
        </template>
        <div v-show="isDocLy && showOutline">
          <hgroup
            flex="~ row gap-2.5 items-center"
            class="mb-2 cursor-pointer b-b-2px b-b-tg-txt text-left duration-800 ease-in-out"
          >
            <a
              class="primary-link duration-800 ease-in-out !decoration-none"
              p="r-2 hover:l-2"
              href="/"
            >
              <h1 class="text-6 font-extrabold line-height-normal">Cornor Blog</h1>
            </a>
          </hgroup>
          <OutlineComp v-model:visible="showOutline" />
        </div>
        <div v-show="!isDocLy || !showOutline" class="h-full" flex="~ col gap-y-8">
          <NavComp v-if="isLarge" class="flex-1" flex="~ col justify-between items-start gap-2.5" />
          <CopyrightComp />
        </div>
      </div>
    </div>
    <!-- Copyright -->
    <CopyrightComp v-if="!isLarge" class="m-b-10px p-x-10px text-center" />
  </div>
  <SwitchAppearance class="right-10px top-10px z-1 !fixed" />
</template>

<style lang="scss" scoped>
.main {
  flex: 0 0 auto;
  &::-webkit-scrollbar:hover {
    background: transparent;
  }
}
.lg-sider {
  // display: inline-flex;
  position: relative;
  flex: 0 0 auto;
  &::-webkit-scrollbar {
    width: 8px !important;
    height: 8px !important;
  }
  .switch-icon {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 1;
  }
}
@screen lg {
  .main,
  .lg-sider {
    height: calc(100vh - 60px);
    overflow-y: auto;
  }
}
</style>
