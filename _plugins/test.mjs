import fs from 'node:fs'
// import path from 'node:path'
import { globSync } from 'glob'

/* fs */

// 识别指定目录下所有markdown文件 ../front-end/basic/css/*.md

// 指定目录路径
// const dirPath = './front-end/basic/css'

// fs.readdir(dirPath, { withFileTypes: true }, (err, files) => {
//   if (err) {
//     console.error('Error reading the directory:', err)
//     return
//   }

//   // 过滤出 Markdown 文件
//   const markdownFiles = files
//     .filter(dirent => dirent.isFile() && dirent.name.endsWith('.md'))
//     .map(dirent => path.join(dirPath, dirent.name))

//   console.log('Markdown files:', markdownFiles)
// })

/* glob */

let mdFiles = []
// 使用 glob 查找匹配的文件
const pattern = './back-end/**/*.md'
try {
  // const mdFiles = await glob(pattern)
  mdFiles = globSync(pattern)
} catch (error) {
  console.error('Failed to process glob pattern:', error)
}
console.log(mdFiles)

// 读取 mdFiles 中的内容
for (const file of mdFiles.slice(3, 5)) {
  // 读取文件内容
  try {
    const contents = fs.readFileSync(file, 'utf8')
    console.log('File contents:', contents)
  } catch (error) {
    console.error('Error reading the file:', error)
  }
}
