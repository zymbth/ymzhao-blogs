<script setup lang="jsx">
import postData from '@/_plugins/post_data.json'
import { categoryTree } from '@/_plugins/util.js'
import { ref } from 'vue'

const posts = ref(Array.isArray(postData) ? postData : [])

const catTree = JSON.parse(JSON.stringify(categoryTree.children))
const othersCat = { code: 'others', name: '其它', posts: [] }
catTree.push(othersCat)

// 遍历post列表，将其按分类列表插入到catTree对应节点的posts列表中
for (const post of posts.value) {
  const node = findNode(post.categories, catTree)
  if (!node) {
    othersCat.posts.push(post)
    continue
  }
  if (!node.posts) node.posts = []
  node.posts.push(post)
}
if (othersCat.posts.length === 0) catTree.pop()

// 根据分类列表找到catTree对应节点
function findNode(categories, tree) {
  let node
  for (const cat of categories) {
    node = tree.find(item => item.code === cat)
    if (node) tree = node.children
    else return null
  }
  return node
}

const CategoryComp = ({ data, depth = 0 }) => {
  return (
    <div class={{ 'indent-1em': depth > 0 }}>
      {depth ? ' > ' : '# '}
      {data.name}
      {data.posts
        ? (
            <details class="my-10px px-20px indent-0 color-#999" b="1 gray solid">
              <summary class="cursor-pointer">
                {data.posts.length}
                {' '}
                post
                {data.posts.length > 1 ? 's' : ''}
              </summary>
              <ol class="initial-type">
                {data.posts.map(post => (
                  <li>
                    <a class="primary-link" href={post.url} v-html={post.title}></a>
                  </li>
                ))}
              </ol>
            </details>
          )
        : (
            ''
          )}
      {data.children?.map(c => CategoryComp({ data: c, depth: depth + 1 })) || ''}
    </div>
  )
}
</script>

<template>
  <div v-for="c in catTree" :key="c.code" class="mb-1em">
    <CategoryComp :data="c" />
  </div>
</template>

<style lang="scss" scoped>
:deep(details:not([open])) {
  display: inline-block;
  margin-left: 1em;
  margin-top: 0;
  margin-bottom: 0;
  padding: 0;
  border: none;
  summary {
    margin: 0;
  }
}
</style>
