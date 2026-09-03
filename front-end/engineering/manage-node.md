---
description: node环境管理，node作为现代前端框架的必备运行环境，对它的基本使用管理
head:
  - - meta
    - name: keywords
      content: node,npm,volta,nvm,多版本
created: '2024-07-17'
---

# node环境管理

## 前言

对于由现代前端框架搭建的项目，都需要先装node环境，npm作为默认的包管理器

由于node版本在快速迭代中，几年前的老系统适用的运行环境可能远远落后于新系统，同时开发维护时，node版本的切换是很有必要的。

这里仅做工具梳理，不讨论安装、使用方法等

## 包管理器

yarn / pnpm 都是很优秀的包管理器，它们的优缺点及性能对比这里不提。目前来看，个人更推荐pnpm。

pnpm 有多种安装方法，也可以实现切换 node 版本。

## npm镜像

可通过npm命令手动设置镜像地址

也可借助 `nrm` 查看、切换npm镜像地址

## node版本管理

### nvm

window系统中，可使用 `nvm` 安装、切换使用不同版本的 node。

切换工作项目时，可以根据项目所需切换对应版本的 node。

### volta

[VOLTA](https://volta.sh/) 是一种无需繁琐操作即可管理 JavaScript 命令行工具的工具。它允许你将 node 及包管理器的版本锁定在项目中，无需手动切换，减轻一项心智成本。

::: details 注意

- 安装使用 volta 前，需移除已安装的 node, nvm 等，移除相关的 node 环境变量路径
- volta 对 pnpm 的支持还在实验阶段，按官网描述添加环境变量以开启对 pnpm 的支持
- pnpm 的全局安装目前不被允许，但可以通过 `volta run --pnpm <version> <COMMAND>...` 执行（例如：`volta run --pnpm 10.15.0 pnpm create vite test-pm --template vue`）
- 指定版本(pin)时，pnpm需要在node之后，即，先 pin node，再 pin pnpm

打印 Volta 工具链：

```pwsh
volta list
⚡️ Currently active tools:

    Node: v20.20.2 (default)
    Yarn: v1.22.22 (default)
    Tool binaries available:
        claude (default)
        copilot (default)
        http-server (default)
        npkill (default)
        nrm (default)
        pnpm, pnpx (default)
         (default)
        skills, add-skill (default)
```

在 Volta 中，pnpm 是作为工具包而不是包管理器，这解释了它对 pnpm 的有限支持

:::

- 对比 nvm

假设有三个项目，volta 仅需要在 package.json 中添加一个配置属性 volta 即可自动切换工具链

::: code-group

```json [Project1]
{
  "volta": {
    "node": "22.21.1",
    "pnpm": "10.15.0"
  }
}
```

```json [Project2]
{
  "volta": {
    "node": "20.20.2",
    "pnpm": "9.15.9"
  }
}
```

```json [Project3]
{
  "volta": {
    "node": "16.20.2",
    "pnpm": "8.15.9"
  }
}
```

:::

Volta 已经不再维护了，官方建议当发现 volta 已经跟不上变化时，迁移到 [`mise`](https://mise.jdx.dev/)。

> [!IMPORTANT]
> **Volta is unmaintained.** Everything that works today should continue to do so for the foreseeable future, so if it is working for you, there is no particular *urgency* to migrate to another tool, but we will not be able to address breakages from new OS releases or other changes in the ecosystem, so you should put it on your maintenance roadmap at some point. We recommend migrating to [`mise`](https://mise.jdx.dev/). See [issue #2080](https://github.com/volta-cli/volta/issues/2080).

Volta 目前足够使用，暂未体验，感兴趣的可以先看看。

### pnpm

pnpm 自带 node 运行时管理功能，在项目指定使用 pnpm 作为包管理器时也是最推荐的选择之一。

示例：

```json
{
  "engines": {
    "node": ">=22.0.0 <23.0.0"
  },
  "packageManager": "pnpm@10.15.0",
  "devEngines": {
    "runtime": {
      "name": "node",
      "version": "22.21.1",
      "onFail": "error"
    },
    "packageManager": {
      "name": "pnpm",
      "version": "10.15.0",
      "onFail": "error"
    }
  }
}
```

相关配置项：

- [engines](https://docs.npmjs.com/cli/v12/configuring-npm/package-json#engines): 指定适用的 node/npm 版本
- [devEngines](https://docs.npmjs.com/cli/v12/configuring-npm/package-json#devengines): 指定开发环境下适用的工具，包括 `cpu`, `os`, `libc`, `runtime`, `packageManager`
- packageManager: 声明项目期望使用的包管理器及版本，主要由 Corepack 适用，但 pnpm 也会读取并约束版本

> pnpm 自身也提供了相关配置，例如，packageManagerStrict，packageManagerStrictVersion，以及 v11 后提供的命令行参数 [pmOnFail](https://pnpm.io/zh/settings/cli#pmonfail)
>
> pnpm v11 后的 devEngines.packageManager 已经支持版本范围，并可以把解析后的版本写入 lockfile。除非锁定的 pnpm 版本为 v12 或更高版本，通过旧版 packageManager 字段声明 pnpm 时，其解析信息不会写入 lockfile

`devEngines` 是更现代的管理包管理器的方式

### Corepack

Node 默认分发的一个工具，自 v25 后不再内置。作用在于根据 packageManager 属性管理包管理器及版本，但无法管理 Node 版本。

### 对比

| 工具 | 主要功能 | 缺陷 |
|---|---|---|
| nvm | 全局 node 版本管理 | 跨项目需手动切换node版本；不管理包管理器版本 |
| volta | 全局 & 项目级 node 版本、包管理器及其它工具链管理 | 不支持全局安装 pnpm |
| pnpm | 项目级 node 版本、pnpm 版本管理 | 适用于 pnpm 项目；不管理全局 node 版本 |
| corepack | 项目级包管理器管理 | 用途窄 |
