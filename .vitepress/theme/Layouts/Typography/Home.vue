<script setup>
import postData from '@/_plugins/post_data.json'
import qs from 'qs'
import { computed, onMounted, ref, watch } from 'vue'
import CategoryBreadcrumbs from './components/CategoryBreadcrumbs.jsx'
import PostTag from './components/PostTag.vue'

const posts = ref(Array.isArray(postData) ? postData : [])
let search = {}
try {
  search = qs.parse(window.location.search, { ignoreQueryPrefix: true })
  if (search.c) search.c = decodeURIComponent(search.c).split(',')
  if (search.p && !Number.isNaN(Number.parseInt(search.p))) search.p = Number.parseInt(search.p)
} catch (error) {
  console.error(error)
}

/**
 * 根据当前分类过滤博文
 */

const currCats = ref(search.c || [])
const currCat = computed(() => currCats.value?.[currCats.value.length - 1] || '')
const filteredPosts = computed(() => {
  if (!currCat.value) return posts.value.slice(0)
  return posts.value.filter(p => p.categories?.includes(currCat.value))
})

// 面包屑导航
function handleSelectCat(category, categories = currCats.value) {
  if (currCat.value === category) return
  // 更新当前分类及面包屑导航
  const index = categories?.indexOf(category)
  currCats.value = index > -1 ? categories.slice(0, index + 1) : []
  // 重置分页页码
  currentPage.value = 1
}

/**
 * posts 分页功能设计
 *
 * 一次显示十条博文
 * 分页器包括三部分：上一页、下一页链接，当前页及总页数
 */
const pageSize = 20
const currentPage = ref(search.p || 1)
const totalPages = computed(() => Math.ceil(filteredPosts.value.length / pageSize))
const currPosts = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize
  const endIndex = startIndex + pageSize
  return filteredPosts.value.slice(startIndex, endIndex)
})

function updSearch() {
  const q = {}
  if (currentPage.value !== 1) q.p = currentPage.value
  if (currCats.value.length > 0) q.c = currCats.value.join(',')
  const newSearch = qs.stringify(q)
  let newUrl = `${window.location.origin}${window.location.pathname}`
  if (newSearch) newUrl += `?${newSearch}`
  history.replaceState({}, '', newUrl)
}
onMounted(() => {
  watch([currCats, currentPage], updSearch)
})
</script>

<template>
  <Content class="vp-home" />
  <section class="contain-layout flex flex-col gap-1.5">
    <h1 v-show="currCat" class="text-20px font-bold line-height-1.8em" flex="~ gap-6px">
      <CategoryBreadcrumbs :modelValue="currCats" @select="handleSelectCat" />
      <span class="inline-block transform-rotate-45 cursor-pointer" @click="currCats = []">+</span>
    </h1>
    <article v-for="p in currPosts" :key="p.url">
      <header flex="~ col">
        <h2 class="m-0 text-18px font-bold line-height-1.5em">
          <PostTag v-if="p.tag" :tag="p.tag" />
          <a class="primary-link" :href="p.url" v-html="p.title" />
        </h2>
        <div class="text-14px text-tg-txt" flex="~ items-center gap-6px">
          <span>发布于</span>
          <time>{{ p.created }}</time>
          <CategoryBreadcrumbs
            :modelValue="p.categories"
            enableLast="true"
            @select="val => handleSelectCat(val, p.categories)"
          />
        </div>
      </header>
      <p v-if="p.intro" class="line-clamp-4 text-14px color-#666">
        {{ p.intro }}
      </p>
    </article>
  </section>
  <footer class="my-7.5">
    <div class="mb-2.5">
      第 {{ currentPage }} 页 / 共 {{ totalPages }} 页
    </div>
    <div flex="~ items-center gap-2">
      <a v-show="currentPage > 1" href="javascript:void(0)" @click="currentPage--">&lt;&lt; 上一页</a>
      <a v-show="currentPage < totalPages" href="javascript:void(0)" @click="currentPage++">下一页 &gt;&gt;</a>
    </div>
  </footer>
</template>
