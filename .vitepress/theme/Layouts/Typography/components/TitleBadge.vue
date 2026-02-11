<script setup>
import { useData } from 'vitepress'
import Badge from 'vitepress/dist/client/theme-default/components/VPBadge.vue'

/**
 * @description 文章徽标(Badge)，多个标签用英文逗号隔开
 *
 * frontmatter:
 *   badge: 'BUG'
 */

const { frontmatter } = useData()
const types = ['info', 'tip', 'warning', 'danger']
const typeMap = {
  BUG: types[3]
}

const badges = frontmatter.value.badge?.split(',').map((b) => {
  b = b.trim()
  return {
    text: b,
    type: b ? typeMap[b] : 'tip'
  }
}) || []
</script>

<template>
  <Badge v-for="(b, index) in badges" :key="index" v-bind="b" />
</template>
