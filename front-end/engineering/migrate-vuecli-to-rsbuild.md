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

> 参考文档：
>
> - [Rsbuild 官网](https://rsbuild.dev/)
> - [Rsbuild - Vue CLI 迁移指南](https://rsbuild.dev/zh/guide/migration/vue-cli): 必读
> - [从 VueCLI 迁移到 Rsbuild](https://juejin.cn/post/7395127149912047635)
> - [如何评价字节 Web Infra 团队开源的 rspack？ - 卡罗的回答](https://www.zhihu.com/question/588449030/answer/3390521545)
> - [从@vue/cli项目迁移到Rsbuild](https://zhuanlan.zhihu.com/p/16005373040)
> - [Webpack迁移Rsbuild 指南（VUE2）](https://icepaper.work/archives/573)

## 迁移

请先查阅并按上面的官方迁移指南一步步进行，指南内提及的不再粘到此处

- 安装依赖

删除与 @vue/cli 相关的依赖

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

- 更新 npm scripts
- 创建配置文件

完成配置后，可删除 `vue.config.js`, `babel.config.js` 多余的配置文件

- HTML 模板
- 配置迁移

参照官方提供的 Vue CLI 配置对应的 Rsbuild 配置进行迁移。例如，在 Vue CLI 中配置(`chainWebpack`)的svg加载器迁移到 Rsbuild 的 `tools.bundlerChain` 中即可：

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

Vue CLI 中自定义的插件 `configureWebpack.plugins` 对应 Rsbuild 的配置为 `tools.rspack.plugins`。

简单的自定义插件也可考虑按 Rsbuild 的[插件](https://rsbuild.dev/zh/plugins/dev/)语法转换下。

- 环境变量

之后在代码里如果想要使用之前的全局变量可直接使用 `process.env` 或 `import.meta.env`

Rsbuild也支持读取env模式，不同于Vue CLI使用的`--mode`，Rsbuild需要使用`--env-mode`

## 其他

实际项目中可能还有很多需要迁移的工作，具体参照上面的几篇文章

- 生产环境cdn
- 安装 JSX、Less 和 SCSS 支持及相关css语法调整
- Node Polyfill
- polyfill 按需注入
- 删除 console、debugger
- 编译 node_modules 下的包

## 总结

总的来说，迁移代价很低，老项目焕新
