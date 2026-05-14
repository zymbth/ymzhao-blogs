# AGENTS.md

适用于此项目所有 AI agent 的通用指导。

## 语言

始终使用 zh-CN 回复。技术术语和代码标识符保持原文。

## Project

Personal blog (Corner Blog) built with VitePress, deployed on Cloudflare. Chinese-language tech blog.

## Commands

```bash
pnpm dev              # Dev server (port 5200)
pnpm dev:upd          # Dev server + update post data
pnpm build            # Build (clears cache first)
pnpm build:upd        # Build + update post data
pnpm preview          # Preview built site
pnpm lint:eslint-fix  # Fix linting
pnpm commit           # Interactive commit (commitizen)
pnpm merge            # Merge dev → master, push both, return to dev
```

## Git

- **dev** = active development, **master** = production
- `pnpm merge` automates dev → master sync (requires clean working tree on dev)
- Commit convention: conventional commits (`feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`)

## Architecture

- **Typography layout** (`~/.vitepress/theme/Layouts/Typography/`): primary layout with responsive sidebar (>=1200px) and mobile nav. `Home.vue` = post listing, `Page.vue` = doc pages.
- **Post data system**: `_plugins/vitepress-plugin-scan-post.js` scans markdown and generates `_plugins/post_data.json`. Only runs with `UPD_POST=t` env. Category tree defined in `_plugins/util.js`.
- **Custom pages** (`pages/`): use `layout: custom` + `_component` frontmatter to render Vue components as pages.
- **Path alias**: `@/` → project root.

## Key Config

- UnoCSS custom breakpoints: `md=750px`, `lg=1200px` (differs from defaults)
- UnoCSS custom theme colors (`tgTxt`, `tgTxt1`, `tgTxt2`, `tgBg`) reference CSS variables
- Active config: `.vitepress/config.mjs` (uses scanPostPlugin for dynamic sidebar)

## Code Style

- ESLint 配置基于 @antfu/eslint-config（Vue + UnoCSS），直接执行 `pnpm lint:eslint-fix` 修复格式问题，不要手动猜测风格
- 样式优先使用 UnoCSS 原子类，复杂样式用 Sass
- Vue 组件使用 `<script setup>` 组合式 API
- 不要给 markdown 文件（`**/*.md`）运行 ESLint，它们已被 ESLint ignore