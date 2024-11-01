<script setup lang="jsx">
import { useData, useRoute } from 'vitepress'
import NotFound from 'vitepress/dist/client/theme-default/NotFound.vue'
import { defineAsyncComponent, shallowRef, watch } from 'vue'

const route = useRoute()
const { frontmatter } = useData()

const CustomPage = shallowRef()

const CustomPages = shallowRef({})
const components = import.meta.glob('./*.vue')
for (const path in components) {
  if (path.includes('index')) continue
  const name = path.match(/\.\/(.*)\.vue$/)[1]
  CustomPages.value[name] = defineAsyncComponent(components[path])
}

watch(
  () => route.path,
  () => {
    // CustomPage.value = defineAsyncComponent({
    //   loader: () => import(/* @vite-ignore */ `./${frontmatter.value._component}.vue`),
    //   errorComponent: NotFound,
    // })
    CustomPage.value = CustomPages.value[frontmatter.value._component] || NotFound
  },
  { immediate: true }
)
</script>

<template>
  <component :is="CustomPage" />
</template>
