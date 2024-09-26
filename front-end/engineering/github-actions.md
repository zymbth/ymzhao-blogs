---
description: Github Actions使用记录,收集了部分使用Github Actions实现自动构建发布项目的案例
head:
  - - meta
    - name: keywords
      content: Github Actions,实践,vue,nuxt,vitepress
created: '2024-06-27'
---

# Github Actions 使用记录

> 相关链接：
>
> [GitHub Pages 文档](https://docs.github.com/zh/pages)
>
> [GitHub Actions 文档](https://docs.github.com/zh/actions)
>
> [GitHub Actions 的指南](https://docs.github.com/zh/actions/guides)
>
> [Marketplace - Actions](https://github.com/marketplace?type=actions)
>
> [awesome-actions](https://github.com/sdras/awesome-actions)

Github Pages 从 actions 中执行自动构建部署时，最终的路径中，域名是固定的，后面会加上项目名。对于 vue 项目来说，action中打包需指定 base 为项目的GitHub路径名。例如：

```json{5}
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "build-github": "vite build --base /repo-name/"
  },
}
```

## 示例记录

仅供快速拷贝使用，具体应用到项目中时，还需根据实际情况调整配置，node版本、包管理器、路径、具体安装构建等流程等等

### vitepress项目

> [参考](https://vitepress.dev/zh/guide/deploy#github-pages)

::: details

```yml{37,52,57}
# 构建 VitePress 站点并将其部署到 GitHub Pages 的示例工作流程
#
name: Deploy VitePress site to Pages

on:
  # 在指定分支的推送上运行
  push:
    branches: ['master']

  # 允许你从 Actions 选项卡手动运行此工作流程
  workflow_dispatch:

# 设置 GITHUB_TOKEN 的权限，以允许部署到 GitHub Pages
permissions:
  contents: read
  pages: write
  id-token: write

# 只允许同时进行一次部署，跳过正在运行和最新队列之间的运行队列
# 但是，不要取消正在进行的运行，因为我们希望允许这些生产部署完成
concurrency:
  group: 'pages'
  cancel-in-progress: false

jobs:
  # 构建工作
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0 # 如果未启用 lastUpdated，则不需要
      # - uses: wyvox/action-setup-pnpm@v3
      #   with:
      #     node-version: 18
      - uses: pnpm/action-setup@v3
        with:
          version: 9
      # - uses: oven-sh/setup-bun@v1 # 如果使用 Bun，请取消注释
      # - name: Setup Node
      #   uses: actions/setup-node@v4
      #   with:
      #     node-version: 18
      #     cache: yarn # npm or pnpm / yarn
      - name: Setup Pages
        uses: actions/configure-pages@v3
      - name: Install dependencies
        run: pnpm install # npm ci or pnpm install / yarn install / bun install
      - name: Build with VitePress
        run: |
          pnpm docs-git:build # npm run docs:build or pnpm docs:build / yarn docs:build / bun run docs:build
          touch .vitepress/dist/.nojekyll
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: .vitepress/dist

  # 部署工作
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    needs: build
    runs-on: ubuntu-latest
    name: Deploy
    steps:
      # - name: Checkout
      #   uses: actions/checkout@v3
      # - name: Setup Pages
      #   uses: actions/configure-pages@v3
      # - name: Upload artifact
      #   uses: actions/upload-pages-artifact@v1
      #   with:
      #     # Upload entire repository
      #     path: './.vitepress/dist'
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4

```

**注意**：这里使用了 `pnpm`，另外，`path` 需要根据项目实际路径设置

```json{5}
{
  "scripts": {
    "docs:dev": "vitepress dev",
    "docs:build": "vitepress build",
    "docs-git:build": "vitepress build --base /repo-name/",
  }
}
```

:::

### vue spa

::: details

```yml{39,46}
# Simple workflow for deploying static content to GitHub Pages
name: Deploy Project to Pages

on:
  # Runs on pushes targeting the default branch
  push:
    branches: ['master']

  # Allows you to run this workflow manually from the Actions tab
  workflow_dispatch:

# Sets permissions of the GITHUB_TOKEN to allow deployment to GitHub Pages
permissions:
  contents: read
  pages: write
  id-token: write

# Allow only one concurrent deployment, skipping runs queued between the run in-progress and latest queued.
# However, do NOT cancel in-progress runs as we want to allow these production deployments to complete.
concurrency:
  group: 'pages'
  cancel-in-progress: false

jobs:
  # Build job
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3
        with:
          fetch-depth: 0 # Not needed if lastUpdated is not enabled
      # - uses: pnpm/action-setup@v2 # Uncomment this if you're using pnpm
      # - uses: oven-sh/setup-bun@v1 # Uncomment this if you're using Bun
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: yarn # npm or pnpm / yarn
      - name: Setup Pages
        uses: actions/configure-pages@v3
      - name: Install dependencies
        run: yarn install # npm ci or pnpm install / yarn install / bun install
      - name: Build Project
        run: |
          yarn build-github # npm run build or pnpm build / yarn build / bun run build
          touch dist/.nojekyll
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v2
        with:
          path: dist

  # Deployment job
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    needs: build
    runs-on: ubuntu-latest
    name: Deploy
    steps:
      # - name: Checkout
      #   uses: actions/checkout@v3
      # - name: Setup Pages
      #   uses: actions/configure-pages@v3
      # - name: Upload artifact
      #   uses: actions/upload-pages-artifact@v1
      #   with:
      #     # Upload entire repository
      #     path: './dist'
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v2

```

**注意**：上面的配置中使用 `yarn`，且运行的是添加的 npm 命令 `build-github`：

```json{5}
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "build-github": "vite build --base /repo-name/"
  },
}
```

:::

### 无需构建，直接指定主页

::: details

```yml{40}
# Simple workflow for deploying static content to GitHub Pages
name: Deploy static content to Pages

on:
  # Runs on pushes targeting the default branch
  push:
    branches: ["master"]

  # Allows you to run this workflow manually from the Actions tab
  workflow_dispatch:

# Sets permissions of the GITHUB_TOKEN to allow deployment to GitHub Pages
permissions:
  contents: read
  pages: write
  id-token: write

# Allow only one concurrent deployment, skipping runs queued between the run in-progress and latest queued.
# However, do NOT cancel in-progress runs as we want to allow these production deployments to complete.
concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  # Single deploy job since we're just deploying
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3
      - name: Setup Pages
        uses: actions/configure-pages@v3
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v1
        with:
          # Upload entire repository
          path: './demo'
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v2

```

:::

### nuxt项目

::: details

```yml{36,43,47}
# Simple workflow for deploying static content to GitHub Pages
name: Deploy Project to Github Pages

on:
  # Runs on pushes targeting the default branch
  push:
    branches: ['master']

  # Allows you to run this workflow manually from the Actions tab
  workflow_dispatch:

# Sets permissions of the GITHUB_TOKEN to allow deployment to GitHub Pages
permissions:
  contents: read
  pages: write
  id-token: write

# Allow only one concurrent deployment, skipping runs queued between the run in-progress and latest queued.
# However, do NOT cancel in-progress runs as we want to allow these production deployments to complete.
concurrency:
  group: 'pages'
  cancel-in-progress: false

jobs:
  # Build job
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3
        with:
          fetch-depth: 0 # Not needed if lastUpdated is not enabled
      # - run: corepack enable
      # - uses: pnpm/action-setup@v2 # Uncomment this if you're using pnpm
      # - uses: oven-sh/setup-bun@v1 # Uncomment this if you're using Bun
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: 18
      - name: Install dependencies
        run: npm install
      - name: Build Project
        run: npm run generate-github
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v2
        with:
          path: ./.output/public

  # Deployment job
  deploy:
    environment:
      name: github_pages
      url: ${{ steps.deployment.outputs.page_url }}
    needs: build
    runs-on: ubuntu-latest
    name: Deploy
    steps:
      # - name: Checkout
      #   uses: actions/checkout@v3
      # - name: Setup Pages
      #   uses: actions/configure-pages@v3
      # - name: Upload artifact
      #   uses: actions/upload-pages-artifact@v1
      #   with:
      #     # Upload entire repository
      #     path: './dist'
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v2

```

**注意**：此配置使用 `npm` 完成项目的依赖安装与构建，使用 `nuxt generate` 静态生成网页，即 `SSG` 模式。`SSR` 模式使用 build 命令。npm 脚本如下：

```json{5,7}
{
  "scripts": {
    "dev": "nuxt dev",
    "build": "nuxt build",
    "build-github": "NUXT_APP_BASE_URL=/repo-name/ nuxt build --preset github_pages",
    "generate": "nuxt generate",
    "generate-github": "NUXT_APP_BASE_URL=/repo-name/ nuxt generate --preset github_pages"
  },
}
```

:::
