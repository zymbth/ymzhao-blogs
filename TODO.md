# 项目架构与工程化优化建议

> 本文件记录当前项目（VitePress + Vue 3 静态博客）可执行的优化建议，按优先级排序。

---

## 1. 类型安全与工程健壮性

### 1.1 迁移到 TypeScript

- 当前插件、工具类、脚本均为纯 JS，随规模扩大维护成本会升高。
- 优先给以下目录添加 TypeScript 支持：
  - `_plugins/`
  - `.vitepress/theme/`
  - `pages/`
- VitePress 与 Vue 3 对 TypeScript 支持良好，类型提示可显著降低维护成本。

### 1.2 启用 `vue-tsc` / `tsc` 类型检查

- 即使不立刻全面改写，也建议引入 `vue-tsc` 作为类型检查工具。
- 在提交前 / CI 中加入类型检查步骤，提升代码健壮性。

---

## 3. 自定义文章扫描插件

### 3.1 扫描结果不应仅由环境变量控制

- `scanPostPlugin` 在 `UPD_POST !== 't'` 时几乎空转，但 `post_data.json` 又依赖它生成。
- 风险：新 clone 仓库或 CI 中若忘记设置 `UPD_POST=t`，sidebar/category 数据可能是旧的。
- 建议：
  - `build` 阶段默认触发扫描；
  - `UPD_POST=t` 仅用于 dev 增量更新。

### 3.2 `post_data.json` 不应提交到仓库

- 它是构建产物，应加入 `.gitignore`。
- 在 build 流程中自动生成，避免人为忘记更新导致数据不一致。

### 3.3 进一步利用 `createContentLoader`

- VitePress 2 提供了官方的 `createContentLoader`，当前已使用。
- 可进一步利用其 `excerpt`、`transform` 能力，减少手写文件流读取逻辑。

---

## 4. 部署与 CI

### 4.2 增加 CI 检查步骤

- 目前 CI 只有部署，建议增加：
  - `pnpm lint:eslint-ck`
  - 构建验证
  - `UPD_POST=t pnpm build` 检查扫描产物是否正常生成

---

## 6. PWA 与性能

### 6.1 修正 PWA manifest 拼写

- `.vitepress/pwa.js` 中 `name` 和 `short_name` 写成了 `Cornor Blog`。
- 站点实际名称为 `Corner Blog`，建议修正。

### 6.2 优化 PWA 缓存策略

- `globPatterns` 中包含 `**/*.html`，但 VitePress 启用 `cleanUrls: true` 后 URL 不带 `.html`。
- 建议确认 `navigateFallback` 和 `globPatterns` 是否与实际路由结构匹配。

---

## 7. 目录与架构

### 7.1 分类树与目录结构

- 分类树硬编码在 `_plugins/util.js` 中，若分类经常调整，手动维护成本较高。
- 可考虑根据目录结构自动生成 `categoryTree`，减少硬编码。
