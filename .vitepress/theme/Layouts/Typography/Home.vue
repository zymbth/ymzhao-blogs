<script setup>
import { ref, computed } from 'vue'
import { categoryMap } from '../../../../_plugins/util.mjs'
import postData from '../../../../_plugins/post_data.json'
// import VPBadge from 'vitepress/dist/client/theme-default/components/VPBadge.vue'
// import routes from '~pages'

const posts = ref(Array.isArray(postData) ? postData : [])

/**
 * 根据当前分类过滤博文
 */

const currCat = ref('')
const filteredPosts = computed(() =>
  posts.value.filter(p => !currCat.value || p.category === currCat.value)
)

function handleClickTag({ category }) {
  if (currCat.value === category) return
  currCat.value = category
  currentPage.value = 1
}

/**
 * posts 分页功能设计
 *
 * 一次显示十条博文
 * 分页器包括三部分：上一页、下一页链接，当前页及总页数
 */
const pageSize = 10
const currentPage = ref(1)
const totalPages = computed(() => Math.ceil(filteredPosts.value.length / pageSize))
const currPosts = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize
  const endIndex = startIndex + pageSize
  return filteredPosts.value.slice(startIndex, endIndex)
})
</script>
<template>
  <main class="px-7 py-10 of-x-hidden">
    <div class="w-prose m-auto">
      <Content class="vp-home" />
      <section class="contain-layout flex flex-col gap-5">
        <h1 v-show="currCat" class="text-20px font-bold line-height-1.8em">
          # {{ categoryMap[currCat] || currCat }}
          <span class="inline-block cursor-pointer transform-rotate-45" @click="currCat = ''"
            >+</span
          >
        </h1>
        <article v-for="p in currPosts" :key="p.url">
          <header flex="~ col gap-2">
            <h2 class="m-0 text-20px font-bold line-height-1.5em">
              <a :href="p.url" v-html="p.title"></a>
            </h2>
            <div class="text-14px">
              <span>发布于</span>
              <time>{{ p.created }}</time>
              <a @click="handleClickTag(p)" href="javascript:void(0)">
                # {{ categoryMap[p.category] || p.category }}
              </a>
            </div>
          </header>
          <p v-if="p.intro" class="line-clamp-4 text-14px color-#666">{{ p.intro }}</p>
        </article>
      </section>
      <footer class="mt-7.5">
        <div class="mb-2.5">第 {{ currentPage }} 页 / 共 {{ totalPages }} 页</div>
        <div flex="~ items-center gap-2">
          <a v-show="currentPage > 1" href="javascript:void(0)" @click="currentPage--"><< 上一页</a>
          <a v-show="currentPage < totalPages" href="javascript:void(0)" @click="currentPage++"
            >下一页 >></a
          >
        </div>
      </footer>
    </div>
  </main>
</template>
<style lang="scss" scoped>
article a {
  padding: 1.5px;
  text-decoration-line: underline;
  text-decoration-thickness: 0.1em;
  text-underline-offset: 2px;
  transition-duration: 0.3s;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
article a:hover {
  background-color: rgb(var(--un-preset-theme-colors-primary) / 1);
  color: rgb(var(--un-preset-theme-colors-background) / 1);
  -webkit-text-decoration-color: rgb(var(--un-preset-theme-colors-primary) / 1);
  text-decoration-color: rgb(var(--un-preset-theme-colors-primary) / 1);
}
</style>
