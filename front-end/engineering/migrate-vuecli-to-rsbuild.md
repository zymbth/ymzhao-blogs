---
description: vuecli项目迁移到rsbuild
head:
  - - meta
    - name: keywords
      content: vue,vuecli,rsbuild
created: '2025-06-26'
---

# vuecli项目迁移到rsbuild

## 前言

有些使用Vue CLI构建的老项目存在冷启动、热更新、构建上的性能问题，首先想到的就是使用 `webpack` 或 `vite` 重构，但前者收益不大，后者可能存在更多的兼容性问题。

前段时间偶然看到一篇经验分享，字节开发的 `rsbuild` 能快速实现迁移且无太多兼容性问题。

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
