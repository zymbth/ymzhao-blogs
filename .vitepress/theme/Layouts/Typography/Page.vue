<script setup>
import { onContentUpdated, useData, useRoute } from 'vitepress'
import { computed/* , onMounted, ref */ } from 'vue'
import Comment from '../components/Comment.vue'
// import VPDocFooterLastUpdated from 'vitepress/dist/client/theme-default/components/VPDocFooterLastUpdated.vue'
import DocFooterCreated from './components/DocFooterCreated.vue'
import { jumpToHash } from './utils/doc-page'

const { page, frontmatter } = useData()

const route = useRoute()
const pageName = computed(() => route.path.replace(/[./]+/g, '_').replace(/_html$/, ''))

onContentUpdated(() => {
  setTimeout(jumpToHash, 500)
})

// const count = ref('')
// onMounted(() => {
//   // 获取当前页面的路径，例如 "/posts/abc.html"
//   const path = window.location.pathname

//   // 使用 encodeURIComponent 对路径进行编码，防止路径中包含特殊字符 (&, ?, /) 导致解析错误
//   const encodedPath = encodeURIComponent(path)

//   // 通过 'path' 查询参数将编码后的路径传递给 Worker
//   fetch(`https://api-site-statistics.ymzhao.work/?path=${encodedPath}`)
//     .then(res => res.json())
//     .then((res) => {
//       console.log('Fetched data', res)
//     })
//     .catch((err) => {
//       console.warn('Fetch error')
//       console.error(err)
//     })
// })
</script>

<template>
  <Content class="vp-doc VPDoc" :class="[pageName]" />
  <DocFooterCreated :title="`创建于: ${frontmatter.created}`" />
  <Comment :key="page.relativePath" class="mt-24px" />
</template>
