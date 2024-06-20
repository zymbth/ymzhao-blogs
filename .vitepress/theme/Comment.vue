<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  const script = document.createElement('script')
  script.src = 'https://utteranc.es/client.js'
  script.setAttribute('repo', 'zymbth/ymzhao-blogs')
  script.setAttribute('issue-term', 'pathname')
  script.setAttribute('theme', 'preferred-color-scheme')
  script.setAttribute('label', 'comment')
  script.async = true
  script.crossOrigin = 'anonymous'
  document.querySelector('#comment').appendChild(script)
})
</script>
<template>
  <div id="comment"></div>
</template>
