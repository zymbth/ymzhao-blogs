<script setup>
import { computed } from 'vue'
import { useData, useRoute, onContentUpdated } from 'vitepress'
import { jumpToHash } from './utils/doc-page'
import Comment from '../components/Comment.vue'
import VPDocFooterLastUpdated from 'vitepress/dist/client/theme-default/components/VPDocFooterLastUpdated.vue'

const { page } = useData()
// console.log('created: ', page.value?.frontmatter?.created)

const route = useRoute()
const pageName = computed(() => route.path.replace(/[./]+/g, '_').replace(/_html$/, ''))

onContentUpdated(() => {
  setTimeout(jumpToHash, 500)
})
</script>
<template>
  <Content class="vp-doc VPDoc" :class="[pageName]" />
  <VPDocFooterLastUpdated />
  <Comment :key="page.relativePath" class="mt-24px" />
</template>
