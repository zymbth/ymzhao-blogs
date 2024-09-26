import fs from 'node:fs'
import path from 'node:path'
import { createContentLoader } from 'vitepress'
import {
  getCategoryByUrl,
  generateTitleByPath,
} from '../.vitepress/theme/LayoutTypography/_postData/util'

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
      const title = await getFileTitle(posts[0])
      console.log('title: ', title)
    }
    // const postsData = posts.map(p => ({
    //   url: p.url,
    //   category: getCategoryByUrl(p.url),
    //   created: p.frontmatter?.created,
    //   description: p.frontmatter?.description,
    // }))
  } catch (error) {
    console.error(error)
  }
}

async function getFileTitle(postContent) {
  if (postContent.frontmatter.title) return postContent.frontmatter.title
  let title = await getTitleByReadingFile(postContent.url.slice(1) + '.md')
  if (!title) title = generateTitleByPath(postContent.url)
  return title
}

function getTitleByReadingFile(path) {
  return new Promise((resolve, reject) => {
    let title = null
    // 创建一个读取流
    const stream = fs.createReadStream(path, { start: 0, end: 2000 })
    stream.on('data', chunk => {
      const match = chunk.toString().match(/^#[^#].*$/m)
      if (match) {
        title = match[0].slice(2)
        stream.close() // 关闭流
      }
    })
    // 错误处理
    stream.on('error', error => {
      reject(error)
    })
    // 流结束时的处理
    stream.on('close', () => {
      if (title) resolve(title)
      else reject(new Error('未找到标题'))
    })
    stream.on('ready', () => stream.read())
  })
}

function getTitleByReadingFile1(path) {
  try {
    const contents = fs.readFileSync(path, 'utf8')
    // console.log('File contents:', contents)
    return contents.match(/^#[^#].*$/m)?.[0]?.slice(2)
  } catch (error) {
    console.error('Error reading the file:', error)
  }
}
