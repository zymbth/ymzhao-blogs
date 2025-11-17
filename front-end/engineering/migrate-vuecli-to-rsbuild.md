---
description: Vue CLI项目迁移到Rsbuild
head:
  - - meta
    - name: keywords
      content: vue,vuecli,rsbuild,迁移
created: '2025-06-26'
---

# Vue CLI项目迁移到Rsbuild

## 前言

有些使用Vue CLI构建的老项目存在冷启动、热更新、构建上的性能问题，首先想到的就是使用 Webpack 或 Vite 重构，但前者收益不大，后者可能存在更多的兼容性问题。

前段时间偶然看到一篇经验分享，字节开发的 Rsbuild 能快速实现迁移且无太多兼容性问题。

| Vite v5 | Vite v5          | Vite v7                | Rsbuild < 1.5  | Rsbuild >= 1.5 |
| ------- | ---------------- | ---------------------- | -------------- | -------------- |
| Node18+ | Node.js 18+, 20+ | Node.js 20.19+, 22.12+ | Node.js 16.10+ | Node.js 18.12+ |

项目要求Node16的话，使用时注意锁定版本号在1.5以下

> 参考文档：
>
> - ⭐[Rsbuild 官网](https://rsbuild.dev/)
> - ⭐[Rsbuild - Vue CLI 迁移指南](https://rsbuild.dev/zh/guide/migration/vue-cli): 必读
> - [从 VueCLI 迁移到 Rsbuild](https://juejin.cn/post/7395127149912047635)
> - [如何评价字节 Web Infra 团队开源的 rspack？ - 卡罗的回答](https://www.zhihu.com/question/588449030/answer/3390521545)
> - [从@vue/cli项目迁移到Rsbuild](https://zhuanlan.zhihu.com/p/16005373040)
> - [Webpack迁移Rsbuild 指南（VUE2）](https://icepaper.work/archives/573)

## 迁移

请先查阅并按[官方迁移指南](https://rsbuild.dev/zh/guide/migration/vue-cli)一步步进行，**指南内提及的不再粘到此处**

- 安装依赖

删除与 `@vue/cli` 相关的依赖

除了Vue插件外，根据项目情况可能还需要一些额外的插件支持。

::: details [官方插件列表](https://rsbuild.rs/zh/plugins/list/)

适用于 Vue 框架的插件有：

- `@rsbuild/plugin-vue`：提供对 Vue 3 SFC（单文件组件）的支持。
- `@rsbuild/plugin-vue-jsx`：提供对 Vue 3 JSX / TSX 语法的支持。
- `@rsbuild/plugin-vue2`：提供对 Vue 2 SFC（单文件组件）的支持。
- `@rsbuild/plugin-vue2-jsx`：提供对 Vue 2 JSX / TSX 语法的支持。

以下是与框架无关的通用插件：

- `@rsbuild/plugin-assets-retry`：用于在静态资源加载失败时自动发起重试请求。
- `@rsbuild/plugin-babel`：提供对 Babel 转译能力的支持。
- `@rsbuild/plugin-sass`：使用 Sass 作为 CSS 预处理器。
- `@rsbuild/plugin-less`：使用 Less 作为 CSS 预处理器。
- `@rsbuild/plugin-stylus`：使用 Stylus 作为 CSS 预处理器。
- `@rsbuild/plugin-basic-ssl`：为 HTTPS server 生成不受信任的自签名证书。
- `@rsbuild/plugin-eslint`：用于在编译过程中运行 ESLint 检查。
- `@rsbuild/plugin-type-check`：用于在单独的进程中运行 TypeScript 类型检查。
- `@rsbuild/plugin-image-compress`：压缩图片资源。
- `@rsbuild/plugin-mdx`：提供 MDX 支持。
- `@rsbuild/plugin-node-polyfill`：用于注入 Node 核心模块在浏览器端的 polyfills。
- `@rsbuild/plugin-source-build`：用于 monorepo 场景，支持引用其他子目录的源代码，并完成构建和热更新。
- `@rsbuild/plugin-check-syntax`：检查构建产物的语法兼容性，判断是否存在导致兼容性问题的高级语法。
- `@rsbuild/plugin-css-minimizer`：用于自定义 CSS 压缩工具，切换到 cssnano 或其他工具进行 CSS 压缩。
- `@rsbuild/plugin-typed-css-modules`：用于为 CSS Modules 文件生成类型声明。
- `@rsbuild/plugin-pug`：提供对 Pug 模板引擎的支持。
- `@rsbuild/plugin-rem`：用于实现移动端页面的 rem 自适应布局。
- `@rsbuild/plugin-umd`：用于构建 UMD 格式的产物。
- `@rsbuild/plugin-yaml`：引用 YAML 文件，并将其转换为 JavaScript 对象。
- `@rsbuild/plugin-toml`：引用 TOML 文件，并将其转换为 JavaScript 对象。

:::

vue3 setup语法糖的jsx/tsx支持需要添加`@rsbuild/plugin-babel`插件，详情及配置参考[插件官方说明](https://github.com/rspack-contrib/rsbuild-plugin-vue-jsx)

::: details

```js {8}
import { defineConfig } from '@rsbuild/core'
import { pluginBabel } from '@rsbuild/plugin-babel'
import { pluginVue } from '@rsbuild/plugin-vue'
import { pluginVueJsx } from '@rsbuild/plugin-vue-jsx'

export default defineConfig({
  plugins: [
    pluginBabel({ include: /\.(?:jsx|tsx)$/ }),
    pluginVue(),
    pluginVueJsx()
  ]
})
```

:::

- 更新 npm scripts

`--mode`替换为`--env-mode`

- 创建配置文件

完成配置后，可删除 `vue.config.js`, `babel.config.js` 多余的配置文件

- HTML 模板
- 环境变量

之后在代码里如果想要使用之前的全局变量可直接使用 `process.env` 或 `import.meta.env`

Rsbuild也支持读取env模式，不同于Vue CLI使用的`--mode`，Rsbuild需要使用`--env-mode`

- 配置迁移

参照官方提供的[配置迁移表格](https://rsbuild.rs/zh/guide/migration/vue-cli#%E9%85%8D%E7%BD%AE%E8%BF%81%E7%A7%BB)。例如，Vue CLI 中自定义的插件 `configureWebpack.plugins` 对应 Rsbuild 的配置为 `tools.rspack.plugins`。简单的自定义插件也可考虑按 Rsbuild 的[插件](https://rsbuild.dev/zh/plugins/dev/)语法转换下。

示例1：在 Vue CLI 中配置(`chainWebpack`)的svg加载器直接迁移到 Rsbuild 的 `tools.bundlerChain` 中即可：

::: details

```json
{
  chainWebpack: config => {
    config.module.rule('svg').exclude.add(resolve('src/icons')).end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({ symbolId: 'icon-[name]' })
      .end()
  }
}
```

:::

示例2：添加csv-loader

::: details csv-loader

Rsbuild 中使用 `addRules` 添加 CSV 规则

::: code-group

```js [vue-cli]
module.exports = {
  chainWebpack: config => {
    config.module
      .rule('csv')
      .test(/\.csv$/)
      .use('csv-loader')
      .loader('csv-loader')
      .end()
  }
}
```

```js [rsbuild]
export default defineConfig({
  tools: {
    rspack: (config, { addRules }) => {
      // 添加 CSV 规则
      addRules([
        {
          test: /\.csv$/,
          type: 'javascript/auto',
          use: ['csv-loader'],
        },
      ])
    },
  }
})
```

:::

## 常见配置

[Rsbuild官网](https://rsbuild.dev/)文档挺完善的，`Ctrl+K`输入关键词在线查找。

代码拆分(performance.chunkSplit)、最小化(output.minify)、移除打印(performance.removeConsole)、构建产物分析(webpack-bundle-analyzer/rsdoctor)、source-map(output.sourceMap,tools.rspack.devtools)等配置都有详尽说明。

## 注意

- 静态资源路径

默认会将js/css等文件输出到 `dist/static` 目录下，`static`可能和后端静态资源目录或web服务器配置冲突。如果需要修改，可配置 `output.distPath`

- 环境变量

参照教程加载环境变量并加入[`define`](https://rsbuild.rs/zh/config/source/define#sourcedefine)中，默认的模式可能会导致加载额外的环境变量，示例如下：

::: code-group

```js{3,7} [rsbuild.config.js]
import { defineConfig, loadEnv } from '@rsbuild/core'

const { publicVars } = loadEnv({ prefixes: ['VUE_APP_'] })

export default defineConfig({
  source: {
    define: publicVars,
  },
})
```

```text [.env.production]
# 生产环境
VUE_APP_NODE_ENV = 'production'
VUE_APP_ENV = 'production'
VUE_APP_SOME_VAR = 'xxxxx'
```

```text [.env.test]
# 测试环境
VUE_APP_NODE_ENV = 'production'
VUE_APP_ENV = 'test'
```

:::

上面的示例中，如果执行命令 `rsbuild build --env-mode dev`, `publicVars`会包含 `VUE_APP_SOME_VAR` 这个变量。

添加测试代码：`const { rawPublicVars } = loadEnv({ prefixes: ['VUE_APP_'] })`

打印结果如下：

```text{4}
rawPublicVars:  {
  VUE_APP_ENV: 'test',
  VUE_APP_NODE_ENV: 'production',
  VUE_APP_SOME_VAR: 'xxxxx'
}
```

参照 [loadEnv](https://rsbuild.rs/zh/api/javascript-api/core#loadenv) API文档，mode默认值为`process.env.NODE_ENV`，这就是为什么 .env.production 内的额外变量被读取了。

两种解决方案，一是指定 loadEnv 的 mode；二是将环境变量定义在每个环境变量文件中，不用担心取到“默认值”。

导出配置函数可指定mode：

```js{6} [rsbuild.config.js]
import { defineConfig, loadEnv } from '@rsbuild/core'

const { publicVars } = loadEnv({ prefixes: ['VUE_APP_'] })

export default defineConfig(({ envMode }) => {
  const { publicVars } = loadEnv({ prefixes: ['VUE_APP_'], mode: envMode })
  return {
    // 其他配置项
    source: {
      define: publicVars,
    },
  }
})
```

## 其他

上面的几篇文章分享了很多具体案例：

- 生产环境cdn
- 安装 JSX、Less 和 SCSS 支持及相关css语法调整
- Node Polyfill
- polyfill 按需注入
- 删除 console、debugger
- 编译 node_modules 下的包

实际重构过程中可能还有很多需要迁移的工作。

## 总结

项目页面、组件多不是迁移障碍，脑力消耗完全取决于构建工具的配置复杂程度。

已经将两个Node14/16的项目使用Rsbuild重构了，体会到Rsbuild对VueCli/Webpack4的降维打击。

另外，如果项目相关依赖兼容node高版本，可以顺便升级下node版本，一些api语法需更新调整。

总的来说，迁移代价很低，老项目焕然一新。
