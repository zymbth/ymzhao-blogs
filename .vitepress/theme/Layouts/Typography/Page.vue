<script setup>
import { computed } from 'vue'
import { useData, useRoute } from 'vitepress'
import Comment from '../components/Comment.vue'

const { page } = useData()
// console.log('created: ', page.value?.frontmatter?.created)

const route = useRoute()
const pageName = computed(() => route.path.replace(/[./]+/g, '_').replace(/_html$/, ''))
</script>
<template>
  <Content class="vp-doc" :class="[pageName]" />
  <Comment :key="page.relativePath" class="mt-24px" />
</template>
