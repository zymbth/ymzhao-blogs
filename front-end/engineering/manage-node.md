---
description: node环境管理，node作为现代前端框架的必备运行环境，对它的基本使用管理
head:
  - - meta
    - name: keywords
      content: node,npm,volta,nvm,多版本
created: '2024-07-17'
---

# node环境管理

## 一、前言

对于由现代前端框架搭建的项目，都需要先装node环境，npm作为默认的包管理器

由于node版本在快速迭代中，几年前的老系统适用的运行环境可能远远落后于新系统，同时开发维护时，node版本的切换是很有必要的。

这里仅做工具梳理，不讨论安装、使用方法等

## 二、包管理器

yarn / pnpm 都是很优秀的包管理器，它们的优缺点及性能对比这里不提。目前来看，个人更推荐pnpm。

## 三、npm镜像

可通过npm命令手动设置镜像地址，提高在国内网络下的下载速度

```bash
> npm config get registry
https://registry.npmjs.org/
> npm config set registry https://registry.npmmirror.com/
```

也可借助 `nrm` 查看、切换npm镜像地址

```bash
> npm install -g nrm
> nrm ls
* npm ---------- https://registry.npmjs.org/
  yarn --------- https://registry.yarnpkg.com/
  tencent ------ https://mirrors.tencent.com/npm/
  cnpm --------- https://r.cnpmjs.org/
  taobao ------- https://registry.npmmirror.com/
  npmMirror ---- https://skimdb.npmjs.com/registry/
  huawei ------- https://repo.huaweicloud.com/repository/npm/
> nrm use taobao
 SUCCESS  The registry has been changed to 'taobao'.
```

## 四、node版本管理

### 1. nvm

一个简洁、古老的 Node.js 版本管理工具，支持 unix, macOS。Windows系统可安装[NVM for Windows](https://github.com/coreybutler/nvm-windows)。

使用 `nvm` 命令自行安装、切换本地 Node.js 版本。

### 2. volta

[VOLTA](https://volta.sh/) 是一种无需繁琐操作即可管理 JavaScript 命令行工具的工具。它允许你将 node 及包管理器的版本锁定在项目中，无需手动切换，减轻一项心智成本。

::: details 注意

- 安装使用 volta 前，需移除已安装的 node, nvm 等，移除相关的 node 环境变量路径
- volta 对 pnpm 的支持还在实验阶段，按官网描述添加环境变量以开启对 pnpm 的支持
- pnpm 的全局安装目前不被允许，但可以通过 `volta run --pnpm <version> <COMMAND>...` 执行（例如：`volta run --pnpm 10.15.0 pnpm create vite test-pm --template vue`）
- 指定版本(pin)时，pnpm需要在node之后，即，先 pin node，再 pin pnpm

打印 Volta 管理的工具链：

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

### 3. mise

Volta 已经不再维护了，官方建议当发现 volta 已经跟不上变化时，迁移到 [`mise`](https://mise.jdx.dev/)。

> [!IMPORTANT]
> **Volta is unmaintained.** Everything that works today should continue to do so for the foreseeable future, so if it is working for you, there is no particular _urgency_ to migrate to another tool, but we will not be able to address breakages from new OS releases or other changes in the ecosystem, so you should put it on your maintenance roadmap at some point. We recommend migrating to [`mise`](https://mise.jdx.dev/). See [issue #2080](https://github.com/volta-cli/volta/issues/2080).

Volta 目前足够使用，暂未体验。mise 是 volta 的超集，在工具版本管理上的区别：

- mise 可以管理 node, pnpm, deno, bun, java, python, uv 等等
- mise 会创建额外的配置文件，而不是将配置放在 package.json 中

### 4. pnpm

pnpm 很早就内置了 Node 版本管理（`pnpm env use --global <version>`），v10.14 起进一步支持以 `devEngines.runtime` 声明式地安装、锁定运行时，在项目指定使用 pnpm 作为包管理器时是最推荐的选择之一。

示例：

```json
{
  "engines": {
    "node": "^26.0.0",
    "pnpm": "^11.0.0"
  },
  "devEngines": {
    "runtime": {
      "name": "node",
      "version": "^26.0.0",
      "onFail": "download"
    },
    "packageManager": {
      "name": "pnpm",
      "version": "^11.0.0",
      "onFail": "error"
    }
  }
}
```

pnpm 与 volta/nvm 不是互斥的，各有用途。

### 5. Corepack

Node 默认分发的一个工具，随 Node 分发的区间是 **14.19.0 起、到 25.0.0 之前**，之后仍可 `npm i -g corepack` 单独安装。

它的作用在于根据 `packageManager` 属性管理包管理器及版本，但无法管理 Node 版本。新版 Corepack 也会读 `devEngines.packageManager`，并在缺少顶层 `packageManager` 时以它为准；其 `onFail` 语义为 `ignore` 静默 / 未设或 `error` 报错 / `warn` 及其它值仅警告 —— 不实现 `download`。

### 对比

| 工具     | 主要功能                                          | 缺陷                                                                  |
| -------- | ------------------------------------------------- | --------------------------------------------------------------------- |
| nvm      | 全局 node 版本管理                                | 跨项目需手动切换node版本；不管理包管理器版本                          |
| volta    | 全局 & 项目级 node 版本、包管理器及其它工具链管理 | 不支持全局安装 pnpm                                                   |
| pnpm     | 全局 & 项目级 node 版本、pnpm 版本管理            | 需先有一个可用的 pnpm；旧版 pnpm（<v10.14）不支持；非 pnpm 项目用不上 |
| corepack | 项目级包管理器管理                                | 用途窄；Node 25 起需自行安装                                          |

## 五、pnpm

pnpm 的强大足以单列一节。

pnpm 很早就内置了 Node 版本管理（`pnpm env use --global <version>`），v10.14 起进一步支持以 `devEngines.runtime` 声明式地安装、锁定运行时，在项目指定使用 pnpm 作为包管理器时是最推荐的选择之一。

v12 起 `pnpm env` 已废弃，改用 `pnpm runtime`（pnpm 11.25 中已可用）：

```bash
pnpm runtime set node 26 -g   # 全局安装并切换，支持 node / deno / bun
pnpm runtime set node 26      # 默认 -D，写入 devEngines.runtime；-P 写入 engines.runtime
```

核心配置项：

| 配置项                                                                               | npm                                                                                                                                                                                                                 | pnpm                                                                                                                     |
| ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| [engines](https://docs.npmjs.com/cli/v12/configuring-npm/package-json#engines)       | 指定适用的 node/npm 版本                                                                                                                                                                                            | 除 `engines.node` 外还会处理 `engines.pnpm`，且两者严格程度不同（见下）                                                  |
| [devEngines](https://docs.npmjs.com/cli/v12/configuring-npm/package-json#devengines) | 指定开发环境下适用的工具，包括 `cpu`, `os`, `libc`, `runtime`, `packageManager`。每个属性可以是对象或对象数组。对象必须包含 `name`，可选地可以指定 `version` 和 `onFail`。`onFail` 可以是 `error(默认)/warn/ignore` | 各字段被解析的起始版本不同（见下）。`onFail` 可以设置为 `download`，表示自动下载并使用；且无需 `engineStrict` 即自带强制 |
| packageManager                                                                       | 声明项目期望使用的包管理器及版本，由 Corepack 使用                                                                                                                                                                  | pnpm 读到后的默认行为是**下载并切换**到该版本（`pmOnFail` 默认为 `download`）；与 `devEngines.packageManager` 不能并存   |

pnpm 对 `engines` 的两档行为差异（pnpm 11.25 实测）：

- `engines.pnpm`：任何 pnpm 版本都会硬失败（`ERR_PNPM_UNSUPPORTED_ENGINE`），不受 `engineStrict` 影响，也没有配置项可以关闭。这是唯一能拦住 pnpm ≤10 的手段。
- `engines.node`：未开启 `engineStrict` 时只输出 `[WARN] Unsupported engine`；在 `pnpm-workspace.yaml` 中写入 `engineStrict: true` 后升级为硬失败。官方文档措辞是“项目自身不兼容一律失败”，与实测存在出入，建议显式开启 `engineStrict`。
- `devEngines.runtime` / `devEngines.packageManager`：pnpm 11 自带强制，不需要 `engineStrict`，报错时会提示可用 `--runtime-on-fail=ignore` / `--pm-on-fail=ignore` 绕过。

`packageManager` 与 `devEngines.packageManager` 同时存在时，pnpm 会警告并**忽略前者**：`[WARN] Cannot use both "packageManager" and "devEngines.packageManager" in package.json. "packageManager" will be ignored`。所以“用 `packageManager` 为老版本兜底”在两者并存时并不成立，真正的兜底是 `engines.pnpm`。

npm 自定义设置使用 [.npmrc](https://docs.npmjs.com/cli/v12/configuring-npm/npmrc) 文件，与版本约束相关的是 `engine-strict`（`package-manager-strict`、`package-manager-strict-version` 并非 npm 配置项，而是 pnpm 的旧设置，且已在 pnpm 12 中移除）

pnpm 自定义设置使用 [pnpm-workspace.yaml](https://pnpm.io/zh/settings) 文件，例如 `engineStrict`、`pmOnFail`、`runtimeOnFail`、`nodeDownloadMirrors`。pnpm 仅从 `.npmrc` 中读取 auth/registry 设置，且自 v11 起也不再读取 `package.json` 中的 `pnpm` 字段

pnpm 12 的设置迁移对照：

| 旧设置                                | 新设置                       |
| ------------------------------------- | ---------------------------- |
| `managePackageManagerVersions: true`  | `pmOnFail: download`（默认） |
| `managePackageManagerVersions: false` | `pmOnFail: ignore`           |
| `packageManagerStrict: false`         | `pmOnFail: warn`             |
| `packageManagerStrictVersion: true`   | `pmOnFail: error`            |
| `COREPACK_ENABLE_STRICT=0`            | `pmOnFail: warn`             |

#### devEngines

无论是使用 npm 还是 pnpm，`devEngines` 都是更现代的管理包管理器的方式。

devEngines 每个属性可以是对象或对象数组。数组的判定逻辑见 [npm-install-checks/lib/dev-engines.js](https://github.com/npm/npm-install-checks/blob/main/lib/dev-engines.js)：

- `const invalid = depErrors.length === dependencies.length` —— **全部不匹配才算失败**，即数组是“或”关系，可以实现 name 的“放宽”（`version` 里的 `||` 只能放宽版本，放宽不了 name）；
- 失败时采用的 `onFail` 取自 `dependencies[dependencies.length - 1].onFail`，即**数组最后一个元素**，而不是逐项各用各的。

但 pnpm 的处理有些差异，onFail=download 时，官方示例中，对 runtime 数组的用法是“都装”。

各字段被 pnpm 解析的起始版本并不相同：

| 字段                        | pnpm 起始版本 |
| --------------------------- | ------------- |
| `devEngines.runtime`        | v10.14        |
| `engines.runtime`           | v10.21        |
| `devEngines.packageManager` | v11.0.0       |

实测：pnpm 10.34.5 在只声明了 `devEngines.packageManager` 的项目里安装成功、完全忽略该字段；pnpm 9.15.9 同样忽略，并改写了 lockfile。能拦住 pnpm ≤10 的只有 `engines.pnpm`。

示例：

```json
{
  "devEngines": {
    "runtime": {
      "name": "node",
      "version": "^26.0.0",
      "onFail": "download"
    },
    "packageManager": {
      "name": "pnpm",
      "version": "^11.0.0",
      "onFail": "download"
    }
  }
}
```

onFail=download 在源码中是规范内的值，但 npm 把它降级为 error，文档中也暂未提及。download 语义由包管理器自行实现，pnpm 真正实现了（runtime / packageManager），而 os / cpu / libc 无从下载，仍等同于 error。

pnpm 自 v12.0.0-rc.6 起支持安装其他包管理器，包括 npm、Yarn Classic、Yarn Berry、Yarn 6 (yarnpkg/zpm) 和 Bun。registry 发布的那几个走与 pnpm 自身引擎相同的解析-验签-安装管线（按 npm 签名校验确切版本），Yarn 6 与 Bun 则是各自项目的平台归档、以发布者校验和锁定；**每个包管理器解析进 pnpm home 下各自独立的 environment lockfile**，非 pnpm 的版本不会写进项目的 `pnpm-lock.yaml`（只有 pnpm 自己的 pin 记在 `packageManagerDependencies`），因此不会影响项目外。详见 [pnpm 12 - 命名软件包管理器](https://pnpm.io/zh/blog/whats-different-in-pnpm-12)

上例中，当 packageManager.name=pnpm 时，指定的 pnpm 版本与项目当前生效的 pnpm 版本不符合时，会下载合适的版本并启用，无论是升级还是降级。假设当前为 11.25，声明 ^12，下载 pnpm 12 并交由它执行；声明 ~10.34，下载 pnpm 10.34.x 并交由它执行。只是，升降级后 lockfile 可能会被重写，workspace配置也存在差异。

`devEngines.runtime` 配合 `onFail: download` 的实测效果（pnpm 11.25 + volta 提供的系统 node 26.7.0）：

```bash
> pnpm install
devDependencies:
+ node 26.8.1

> pnpm exec node -v
v26.8.1   # pnpm 管理的运行时
> node -v
v26.7.0   # volta 提供的系统 node
```

lockfile 中写入的是 `specifier: runtime:^26.0.0` / `version: runtime:26.8.1`，并按 `cpu`/`os` 列出各平台的下载地址与 sha256 校验值，所以同一份 lock 可跨平台使用。

::: warning 组合建议

`engines.pnpm` 拦老版本（唯一手段）+ `devEngines` 做精确切换与自动下载。但若要启用 `packageManager.onFail: download` 自动切 pnpm 版本，必须同时放宽 `engines.pnpm`（例如改为 `>=11`），否则版本不符的人会先被 engines 硬失败拦下，永远走不到 download 那一步。

反之，若希望完全由 volta / mise 接管版本、禁止 pnpm 自作主张，在 `pnpm-workspace.yaml` 中设 `pmOnFail: ignore` 与 `runtimeOnFail: ignore`。

:::

::: tip

node, pnpm 都在快速迭代中，标准与配置随版本也在不断更新

:::
