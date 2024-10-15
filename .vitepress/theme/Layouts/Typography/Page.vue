<script setup>
import { computed } from 'vue'
import { useData, useRoute, onContentUpdated } from 'vitepress'
import { jumpToHash } from './utils/doc-page'
import Comment from '../components/Comment.vue'
import VPDocFooterLastUpdated from 'vitepress/dist/client/theme-default/components/VPDocFooterLastUpdated.vue'

const { page, frontmatter } = useData()

const route = useRoute()
const pageName = computed(() => route.path.replace(/[./]+/g, '_').replace(/_html$/, ''))

onContentUpdated(() => {
  setTimeout(jumpToHash, 500)
})
</script>
<template>
  <Content class="vp-doc VPDoc" :class="[pageName]" />
  <VPDocFooterLastUpdated :title="`创建于: ${frontmatter.created}`" />
  <Comment :key="page.relativePath" class="mt-24px" />
</template>
