<script setup>
import { onMounted, watch } from 'vue'
import { useData } from 'vitepress'

const { isDark } = useData()

onMounted(() => {
  const script = document.createElement('script')
  script.src = 'https://utteranc.es/client.js'
  script.setAttribute('repo', 'zymbth/ymzhao-blogs')
  script.setAttribute('issue-term', 'title') // pathname
  script.setAttribute('theme', isDark.value ? 'github-dark' : 'github-light')
  script.setAttribute('label', 'comment')
  script.async = true
  script.crossOrigin = 'anonymous'
  document.querySelector('#comment').appendChild(script)

  watch(isDark, debounce(updUtteranceTheme, 300))
})

function updUtteranceTheme(isDark) {
  const utterances = document.querySelector('#comment iframe')
  if (!utterances) return
  utterances.contentWindow.postMessage(
    { type: 'set-theme', theme: isDark ? 'github-dark' : 'github-light' },
    'https://utteranc.es'
  )
}

function debounce(fn, delay = 300, _this) {
  let timer
  return (...args) => {
    const context = _this
    clearTimeout(timer)
    timer = setTimeout(function () {
      context ? fn.apply(context, args) : fn(...args)
    }, delay)
  }
}
</script>
<template>
  <div id="comment"></div>
</template>
