// import fs from 'node:fs'
// import path from 'node:path'
import { createContentLoader } from 'vitepress'

export default function scanPostPlugin() {
  return {
    name: 'scan-post-plugin',
    buildStart(options) {
      console.log('buildStart')
      scanPost()
    },
    buildEnd(error) {
      console.log('buildEnd', error)
    },
  }
}

async function scanPost() {
  try {
    const loader = createContentLoader('./back-end/**/*.md')
    /**
     * ContentData[]
     * @see https://sourcegraph.com/github.com/vuejs/vitepress/-/blob/src/node/contentLoader.ts?L64
     */
    const posts = await loader.load()
    console.log('posts: ', posts.length)
    if (posts.length) {
      console.log(Object.keys(posts[0]))
      console.log(posts[0])
    }
  } catch (error) {
    console.error('Error:', error)
  }
}
