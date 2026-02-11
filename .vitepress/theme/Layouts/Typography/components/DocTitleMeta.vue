<template>
  <div class="doc-title-meta">
    <div v-if="frontmatter.tag">
      <PostTag :tag="frontmatter.tag" />
    </div>
    <div v-if="createdDateTime">
      <span>📖发表于 <time :datetime="createdIsoDatetime">{{ createdDateTime }}</time></span>
    </div>
    <!-- <div v-if="lastUpdatedDateTime">
      <span>✍更新于 <time :datetime="lastUpdatedIsoDatetime">{{ lastUpdatedDateTime }}</time></span>
    </div> -->
    <div v-if="wordCount">
      <span>📄字数 {{ wordCount }}</span>
    </div>
    <div v-if="count || count === 0">
      <span>👀阅读量 {{ count }}</span>
    </div>
    <CategoryBreadcrumbs
      v-if="currPost"
      :modelValue="currPost.categories"
      enableLast="true"
      @select="handleSelectCat"
    />
  </div>
</template>

<script setup lang="ts">
import qs from 'qs'
import { onContentUpdated, useData, useRouter } from 'vitepress'
import { computed, onMounted, ref, watchEffect } from 'vue'
import postData from '@/_plugins/post_data.json'
import { countTransK, countWord, formatMoney/* , formatDate */ } from '../utils/tools.ts'
import CategoryBreadcrumbs from './CategoryBreadcrumbs.jsx'
import PostTag from './PostTag.vue'

/**
 * @description 文章元数据，包括：
 *
 * - 标签: frontmatter.tag，手动标记文章的特殊类型信息，例如，AI、转载、摘录
 * - 创建时间: frontmatter.created，手动标记文章创建时间
 * - 更新时间: page.value.lastUpdated，自动读取（部署后存在bug，暂时隐藏）
 * - 字数: 手动计算内容字数
 * - 阅读量: 自行部署的 serverless 服务，可使用免费的服务，如 “朴算子”
 * - 分类面包屑导航: 分类面包屑导航，点击可跳转至指定分类页
 *
 * - 徽标：需要放置在标题文字后，独立出去
 *
 * TODO:
 * - 专栏: 专栏信息
 *
 * frontmatter:
 *   created: '2024-09-27'
 *   tag: 'AI'
 */

const { theme, frontmatter, page, lang } = useData()
const router = useRouter()

/* 分类面包屑导航 */

const posts = Array.isArray(postData) ? postData : []
const currPostUrl = `/${page.value.filePath?.match(/\/?(.+)\.md/)?.[1] || ''}`
const currPost = posts.find(p => p.url === currPostUrl)
function handleSelectCat(cat) {
  const index = currPost.categories.indexOf(cat)
  if (index === -1) return
  const currCats = index > -1 ? currPost.categories.slice(0, index + 1) : []
  router.go(`/?${qs.stringify({ c: currCats.join(',') })}`)
}

// 字数
const wordCount = ref('')
// 创建时间
const createdDate = computed(() => new Date(frontmatter.value.created))
const createdIsoDatetime = computed(() => createdDate.value.toISOString())
const createdDateTime = ref('')
// 最后更新时间
// const lastUpdatedDate = computed(() => new Date(page.value.lastUpdated))
// const lastUpdatedIsoDatetime = computed(() => lastUpdatedDate.value.toISOString())
// const lastUpdatedDateTime = ref('')
// 阅读量
const count = ref('')

onContentUpdated(() => {
  const words = document.querySelector('.vp-doc')?.textContent || ''
  wordCount.value = countTransK(countWord(words))
})

onMounted(async () => {
  watchEffect(() => {
    createdDateTime.value = formateDatetime(createdDate.value)
    // lastUpdatedDateTime.value = formateDatetime(lastUpdatedDate.value)
  })

  getCount()
})

function formateDatetime(date) {
  return new Intl.DateTimeFormat(
    theme.value.lastUpdated?.formatOptions?.forceLocale ? lang.value : undefined,
    theme.value.lastUpdated?.formatOptions ?? { dateStyle: 'short'/* , timeStyle: 'short' */ }
  ).format(date)
}

function getCount() {
  // 获取当前页面的路径，例如 "/posts/abc.html"
  const path = window.location.pathname

  // 使用 encodeURIComponent 对路径进行编码，防止路径中包含特殊字符 (&, ?, /) 导致解析错误
  const encodedPath = encodeURIComponent(path)

  // 通过 'path' 查询参数将编码后的路径传递给 Worker
  fetch(`https://api-site-statistics.ymzhao.work/?path=${encodedPath}`)
    .then(res => res.json())
    .then((res) => {
      if (res?.count || res?.count === 0) {
        count.value = formatMoney(res.count)
      }
    })
    .catch((err) => {
      console.warn('Fetch error')
      console.error(err)
    })
}
</script>

<style lang="scss" scoped>
.doc-title-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 12px;
  font-size: 14px;
  color: var(--vp-c-text-2);
  margin-top: 1em;
  line-height: 1.4em;
  word-break: keep-all;
  > div {
    display: flex;
    align-items: center;
    column-gap: 2px;
  }
}
</style>
