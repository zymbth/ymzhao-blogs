<script setup>
import { ref } from 'vue'
import postData from '@/_plugins/post_data.json'

const posts = ref(Array.isArray(postData) ? postData : [])

const achiveList = posts.value.reduce((prev, curr) => {
  let year = new Date(curr.created).getFullYear()
  if (typeof year !== 'number' || isNaN(year)) year = 0
  const target = prev.find(item => item.year === year)
  if (target) target.posts.push(curr)
  else prev.push({ year, posts: [curr] })
  return prev
}, [])
</script>
<template>
  <dl>
    <template v-for="item in achiveList" :key="item.year">
      <dt>{{ item.year || '未归档' }}</dt>
      <dd>
        <ol>
          <li v-for="post in item.posts" :key="post.title">
            <a class="common-link" :href="post.url" v-html="post.title"></a>
          </li>
        </ol>
      </dd>
    </template>
  </dl>
</template>
