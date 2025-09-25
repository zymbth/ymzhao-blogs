<template>
  <div class="weiz-title-meta">
    <div class="tags">
      <!-- <div class="created" title="发表于">
        <i class="weiz-icon weiz-icon-created gray" />
        <span>发表于 {{ firstCommit }}</span>
      </div>
      <div class="updated" title="更新于">
        <i class="weiz-icon weiz-icon-updated gray" />
        <span>更新于 {{ lastUpdated }}</span>
      </div> -->
      <div class="word" title="字数">
        <i class="weiz-icon weiz-icon-word gray" />
        <span>字数 {{ wordCount }}</span>
      </div>
      <div class="reader" title="阅读量">
        <!-- <i class="weiz-icon weiz-icon-user gray"></i> -->
        <span>阅读量 {{ count }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// import { useData } from 'vitepress'
import { onMounted, ref } from 'vue'
import { countTransK, countWord/* , formatDate */ } from '../utils/tools.ts'

// const { frontmatter, page } = useData()
const wordCount = ref('')
// const firstCommit = ref('')
// const lastUpdated = ref('')
const count = ref('')

onMounted(() => {
  // const dateOption = formatDate()
  // firstCommit.value = dateOption.format(new Date(frontmatter.value.firstCommit!)).replace(/\//g, '-')
  // lastUpdated.value = dateOption.format(new Date(frontmatter.value.lastUpdated || page.value.lastUpdated!)).replace(/\//g, '-')

  const docDomContainer = window.document.querySelector('.vp-doc')
  const words = docDomContainer?.querySelector('.content-container .main')?.textContent || ''
  wordCount.value = countTransK(countWord(words))

  // 获取当前页面的路径，例如 "/posts/abc.html"
  const path = window.location.pathname

  // 使用 encodeURIComponent 对路径进行编码，防止路径中包含特殊字符 (&, ?, /) 导致解析错误
  const encodedPath = encodeURIComponent(path)

  // 通过 'path' 查询参数将编码后的路径传递给 Worker
  fetch(`https://api-site-statistics.ymzhao.work/?path=${encodedPath}`)
    .then(res => res.json())
    .then((res) => {
      console.log('Fetched data', res)
      count.value = res?.count
    })
    .catch((err) => {
      console.warn('Fetch error')
      console.error(err)
    })
})
</script>

<style lang="scss" scoped>
.weiz-title-meta {
  .tags {
    display: flex;
    flex-wrap: wrap;
    margin: 0 0 32px;
    color: var(--vp-c-text-2);
    font-weight: 500;
    line-height: 18px;
    word-break: keep-all;
    > div {
      display: flex;
      align-items: center;
      margin-top: 16px;
      margin-right: 6px;
      &:last-child {
        margin-right: 0;
      }
    }
  }
  .weiz-icon {
    margin-right: 2px;
  }
}

@media (min-width: 768px) {
  .weiz-title-meta .tags > div {
    margin-right: 16px;
  }
}
</style>
