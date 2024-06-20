<script setup>
import { useData } from 'vitepress'
import Theme from 'vitepress/theme'
import Comment from './Comment.vue'

const { Layout } = Theme
const { theme, frontmatter, page } = useData()
</script>
<template>
  <Layout>
    <template #doc-footer-before>
      <Comment :key="page.relativePath" />
    </template>
  </Layout>
</template>
