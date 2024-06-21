<script setup>
import { useData } from 'vitepress'
import Theme from 'vitepress/theme'
import Comment from './Comment.vue'

const { Layout } = Theme
const { page } = useData()
</script>
<template>
  <Layout>
    <template #doc-after>
      <Comment :key="page.relativePath" />
    </template>
  </Layout>
</template>
