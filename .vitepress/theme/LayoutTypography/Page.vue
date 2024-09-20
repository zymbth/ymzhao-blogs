<script setup>
import { computed } from 'vue'
import { useData, useRoute } from 'vitepress'
import Comment from '../Comment.vue'

const { page } = useData()

const route = useRoute()
const pageName = computed(() => route.path.replace(/[./]+/g, '_').replace(/_html$/, ''))
</script>
<template>
  <main class="main">
    <Content class="vp-doc" :class="[pageName]" />
  </main>
  <Comment :key="page.relativePath" />
</template>
