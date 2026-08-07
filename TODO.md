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

## 2. 构建与依赖管理

### 2.1 升级 VitePress
- 当前版本：`2.0.0-alpha.15`（alpha 版本 API 不稳定）。
- 关注正式版发布节奏，适时升级到稳定版 `v2`。

### 2.2 清理 pnpm workspace
- `pnpm-workspace.yaml` 当前只声明 `onlyBuiltDependencies`，无实际多包结构。
- 若未来不拆分子包，可删除该文件；
- 若确有规划，建议将公共组件/插件抽离为 workspace 包。

### 2.3 统一 CI 中的 pnpm 版本
- 当前 CI 写死 pnpm 版本 9：
  ```yaml
  - uses: pnpm/action-setup@v3
    with:
      version: 9
  ```
- 本地 Volta 锁定 pnpm 为 `10.15.0`，建议 CI 也保持一致，避免版本漂移。

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

### 4.1 修正 GitHub Actions 配置
- `.github/workflows/static.yml` 中 `pnpm docs-git:build` 这个命令在 `package.json` 中不存在。
- 实际脚本名是 `build` / `build:upd`，需要修正。
- 若项目已改用 Cloudflare 部署，此 workflow 可删除或重命名；
- 若保留 GitHub Pages 部署，需修正 build 命令并设置正确的 `base` 路径。

### 4.2 增加 CI 检查步骤
- 目前 CI 只有部署，建议增加：
  - `pnpm lint:eslint-ck`
  - 构建验证
  - `UPD_POST=t pnpm build` 检查扫描产物是否正常生成

---

## 5. 代码规范

### 5.1 逐步收紧 ESLint 规则
- 当前 `eslint.config.js` 关闭了大量 Vue 和 TS 相关规则。
- 长期看不利于代码质量，建议逐步开启：
  - `vue/attributes-order`
  - `vue/block-order`
  - `eqeqeq`
  - `vue/eqeqeq`

### 5.2 统一 `.vue` 组件风格
- 优先使用 `<script setup>` + TypeScript；
- 复杂逻辑用组合式函数拆分。

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

### 7.2 功能页面与内容分离
- `pages/` 下为功能页面（archive、category、site-statistics），其他目录为内容。
- 当前结构较清晰；若功能页面继续增加，可保持独立管理。

---

## 近期重点（Top 3）

1. 修正 CI workflow 和 PWA manifest 拼写。
2. 让 `post_data.json` 在构建时自动生成，不再提交到仓库。
3. 统一 Node / pnpm 版本，CI 使用与本地一致的 pnpm 版本。

> 这些改动成本不高，但能显著提升工程化水平和部署可靠性。
