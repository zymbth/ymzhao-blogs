import fs from 'node:fs'
import path from 'node:path'
import { createContentLoader } from 'vitepress'
import { getCategoryByUrl } from '../.vitepress/theme/LayoutTypography/_postData/util'

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
    const loader = createContentLoader('./{back-end,front-end,study}/**/*.md')
    /**
     * ContentData[]
     * @see https://sourcegraph.com/github.com/vuejs/vitepress/-/blob/src/node/contentLoader.ts?L64
     */
    const posts = await loader.load()
    console.log('posts: ', posts.length)
    if (posts.length) {
      console.log(Object.keys(posts[0]))
      console.log(Object.keys(posts[0].frontmatter))
      // console.log(posts.filter(p => !p.frontmatter?.created).length)
      // console.log(posts[0].excerpt)
      // console.log(posts[0].html)
      // console.log(posts[0].url, getCategoryByUrl(posts[0].url))
      // console.log(getCategoryByUrl('/front-end/basic/js/util'))
      // 读取文件内容
      // try {
      //   const contents = fs.readFileSync(posts[0].url.slice(1) + '.md', 'utf8')
      //   // console.log('File contents:', contents)
      //   const title = contents.match(/^#[^#].*$/m)?.[0]?.slice(2)
      //   console.log('标题：', title)
      // } catch (error) {
      //   console.error('Error reading the file:', error)
      // }
    }
    // const postsData = posts.map(p => ({
    //   url: p.url,
    //   category: getCategoryByUrl(p.url),
    //   created: p.frontmatter?.created,
    //   description: p.frontmatter?.description,
    // }))
  } catch (error) {
    console.error('Error:', error)
  }
}
