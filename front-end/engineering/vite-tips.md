---
description: vite使用tips
head:
  - - meta
    - name: keywords
      content: vite,tips
created: '2024-10-23'
isDraft: 't'
---

# vite使用tips

## ESM中使用resolve

```js
import { defineConfig } from 'vite'
import { resolve } from 'node:path'

const root = process.cwd()

function pathResolve(dir) {
  return resolve(root, '.', dir)
}

export default defineConfig({
  root: pathResolve('docs'),
})
```
