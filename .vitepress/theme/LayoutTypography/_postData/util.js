const categoryTree = {
  code: 'root',
  name: '无',
  children: [
    {
      code: 'front-end',
      name: '前端',
      children: [
        { code: 'basic', name: '前端基础' },
        { code: 'nodejs', name: 'Nodejs' },
        { code: 'engineering', name: '前端工程化' },
        { code: 'element-plus', name: 'Element Plus' },
        { code: 'vue', name: 'Vue' },
        { code: 'others', name: '前端杂项' },
      ],
    },
    {
      code: 'back-end',
      name: '后端',
      children: [
        { code: 'mybatis-plus', name: 'Mybatis Plus' },
        { code: 'python', name: 'Python' },
      ],
    },
    { code: 'server-end', name: '服务端' },
    { code: 'snippets', name: '代码片段' },
    {
      code: 'study',
      name: '学习',
      children: [
        { code: 'note', name: '笔记' },
        { code: 'book', name: '读书' },
        { code: 'read', name: '读文' },
        { code: 'source-code', name: '源码学习' },
        { code: 'cheatsheets', name: '速查表' },
      ],
    },
  ],
}

const categoryMap = {}

getCategoryMap(categoryTree, categoryMap)

function getCategoryMap(n, res) {
  if (!n || !res) return
  const { code, name, children } = n
  res[code] = name
  if (!Array.isArray(children) || children.length === 0) return
  for (const child of children) getCategoryMap(child, res)
}

function getCategoryByUrl(mdUrl) {
  if (!mdUrl || !/^(\/[\w-]+)+\/[\w-]+(\.html)?$/.test(mdUrl)) return []
  return (
    mdUrl
      .split('/')
      .filter(Boolean)
      .slice(0, -1)
      .reduce((prev, curr) => {
        if (curr in categoryMap) prev.push(curr)
        return prev
      }, []) || []
  )
}

// 根据post路径生成标题，例如 "/front-end/vue/vue-router.html" 生成 "Vue router(前端 / Vue)"
function generateTitleByPath(mdUrl) {
  if (!mdUrl || !/^(\/[\w-]+)+\/[\w-]+(\.html)?$/.test(mdUrl)) return mdUrl
  const urlSegs = mdUrl.split('/').filter(Boolean)
  let title = urlSegs[urlSegs.length - 1]
    .split('-')
    .filter(Boolean)
    .map((w, index) => (index ? w : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(' ')
  title += `(${urlSegs
    .slice(0, -1)
    .map(p => categoryMap[p] || p)
    .join(' / ')})`
  return title
}

Object.freeze(categoryTree)
Object.freeze(categoryMap)

export { categoryTree, categoryMap, getCategoryByUrl, generateTitleByPath }
