<script setup lang="jsx">
import { defineAsyncComponent, shallowRef, watch } from 'vue'
import NotFound from 'vitepress/dist/client/theme-default/NotFound.vue'
import { useData, useRoute } from 'vitepress'

const route = useRoute()
const { frontmatter } = useData()

const CustomPage = shallowRef()
watch(
  () => route.path,
  () => {
    CustomPage.value = defineAsyncComponent({
      loader: () => import(/* @vite-ignore */ `./${frontmatter.value._component}.vue`),
      errorComponent: NotFound,
    })
  },
  { immediate: true }
)
</script>
<template>
  <component :is="CustomPage" />
</template>
