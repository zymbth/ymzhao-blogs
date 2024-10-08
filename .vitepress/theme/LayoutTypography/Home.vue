<script setup>
import { ref } from 'vue'
// const modules = import.meta.glob('../../../front-end/basic/css/*.md')
// for (const path in modules) {
//   modules[path]().then(mod => {
//     console.log(mod.__pageData)
//   })
// }

const posts = ref([])

fetch('../../../_plugins/post_data.json')
  .then(res => res.json())
  .then(res => (posts.value = Array.isArray(res) ? res : []))
  .catch(err => console.error(err))
</script>
<template>
  <main class="px-7 py-10 of-x-hidden">
    <div class="w-prose m-auto">
      <Content class="vp-home" />
      <h1>Posts</h1>
      <div v-for="p in posts" :key="p.url" class="my-0.5em hover:(bg-#00000022 shadow)">
        <h2>
          <a :href="p.url">{{ p.title }}</a>
        </h2>
        <p class="font-size-14px color-#666">{{ p.description }}</p>
      </div>
    </div>
  </main>
</template>
