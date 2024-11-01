<script setup>
import postData from '@/_plugins/post_data.json'
import { ref } from 'vue'

const posts = ref(Array.isArray(postData) ? postData : [])

const achiveList = posts.value.reduce((prev, curr) => {
  let year = new Date(curr.created).getFullYear()
  if (typeof year !== 'number' || Number.isNaN(year)) year = 0
  const target = prev.find(item => item.year === year)
  if (target) target.posts.push(curr)
  else prev.push({ year, posts: [curr] })
  return prev
}, [])
</script>

<template>
  <dl>
    <template v-for="item in achiveList" :key="item.year">
      <dt class="my-1em text-20px font-bold">
        {{ item.year || '未归档' }}
      </dt>
      <dd class="text-16px">
        <ol class="initial-type">
          <li v-for="post in item.posts" :key="post.title">
            <a class="primary-link" :href="post.url" v-html="post.title" />
          </li>
        </ol>
      </dd>
    </template>
  </dl>
</template>
