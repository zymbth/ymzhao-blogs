import fs from 'node:fs'
// import path from 'node:path'
import { createContentLoader } from 'vitepress'
import { generateTitleByPath, getCategoryByUrl } from './util.mjs'

export default function scanPostPlugin({ flag } = {}) {
  return flag === 't'
    ? {
        name: 'scan-post-plugin',
        buildStart(_options) {
          scanPost()
        },
      }
    : { name: 'scan-post-plugin' }
}

async function scanPost() {
  try {
    console.log('Start scanning posts...')
    const loader = createContentLoader('./{back-end,front-end,server-end,snippets,study}/**/*.md')
    /**
     * ContentData[]
     * @see https://sourcegraph.com/github.com/vuejs/vitepress/-/blob/src/node/contentLoader.ts?L64
     */
    const posts = await loader.load()
    console.log(`Globbed ${posts.length} posts.`)
    console.time('Scan posts')
    const postsData = []
    for (const post of posts) {
      if (post.frontmatter?.isDraft === 't') continue
      const title = await getFileTitle(post)
      const categories = getCategoryByUrl(post.url)
      postsData.push({
        url: post.url,
        categories,
        category: categories[categories.length - 1],
        created: post.frontmatter?.created,
        intro: post.frontmatter?.intro,
        title,
        // hidden: post.frontmatter?.isDraft === 't',
      })
    }
    postsData.sort((a, b) => {
      try {
        return new Date(b.created).getTime() - new Date(a.created).getTime()
      } catch {
        return 0
      }
    })
    console.timeEnd('Scan posts')
    // 将 postsData 写入到文件 /_plugins/post_data.json
    // 判断文件是否存在
    if (fs.existsSync('./_plugins/post_data.json')) {
      console.log('Target file exists, skipping creation.')
    }
    fs.writeFileSync('./_plugins/post_data.json', JSON.stringify(postsData))
    console.log('Posts data written to file.')
  } catch (error) {
    console.error(error)
  }
}

// 获取post title，优先从 frontmatter 中获取，如果没有则从文件内容中获取，如果还没有则根据post路径生成
async function getFileTitle(postContent) {
  if (postContent.frontmatter.title) return postContent.frontmatter.title
  let title = await getTitleByReadingFile(`${postContent.url.slice(1)}.md`)
  if (!title) title = generateTitleByPath(postContent.url)
  return title
}

// 使用 fs 读取文件数据流，获取 title
function getTitleByReadingFile(path) {
  return new Promise((resolve, reject) => {
    let title = null
    // 创建一个读取流
    const stream = fs.createReadStream(path, { start: 0, end: 2000 })
    // 监听数据流
    stream.on('data', (chunk) => {
      const match = chunk.toString().match(/^#[^#].*$/m)
      if (match) {
        title = match[0].slice(2)
        stream.close() // 关闭流
      }
    })
    // 错误处理
    stream.on('error', reject)
    // 流结束时的处理
    stream.on('close', () => {
      if (title) resolve(title)
      else reject(new Error('未找到标题'))
    })
    stream.on('ready', () => stream.read())
  })
}

/* function getTitleByReadingFile1(path) {
  try {
    const contents = fs.readFileSync(path, 'utf8')
    // console.log('File contents:', contents)
    return contents.match(/^#[^#].*$/m)?.[0]?.slice(2)
  } catch (error) {
    console.error('Error reading the file:', error)
  }
} */
