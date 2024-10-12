<script setup>
import { computed } from 'vue'
import { useRoute } from 'vitepress'

const route = useRoute()
const pageName = computed(() => route.path.replace(/[./]+/g, '_').replace(/_html$/, ''))
</script>
<template>
  <Content class="vp-doc" :class="[pageName]" />
</template>
