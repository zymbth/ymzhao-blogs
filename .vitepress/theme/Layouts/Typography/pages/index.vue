<script setup lang="jsx">
import { useData } from 'vitepress'
import Achive from './Achive.vue'
import Category from './Category.vue'

const { frontmatter } = useData()

const FinalComp = ({ name }) => {
  switch (name) {
    case 'Achive':
      return <Achive />
    case 'Category':
      return <Category />
    default:
      return null
  }
}
</script>
<template>
  <FinalComp :name="frontmatter._component" />
</template>
