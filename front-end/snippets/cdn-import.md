---
description: vue-cli项目中使用cdn外链引入依赖，外部依赖的cdn实现方案
head:
  - - meta
    - name: keywords
      content: vue-cli,webpack,cdn,externals,外部依赖,外链
---

# vue-cli项目中使用cdn外链引入依赖

以 `vue`, `element-plus` 为例

::: code-group

```html{8-10} [index.html]
<!DOCTYPE html>
<html lang="">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    <link rel="icon" href="<%= BASE_URL %>favicon.ico">
    <script src="https://unpkg.com/vue@3.2.19"></script>
    <link rel="stylesheet" href="https://unpkg.com/element-plus@1.1.0-beta.12/dist/index.css">
    <script src="https://unpkg.com/element-plus@1.1.0-beta.12"></script>
  </head>
  <body>
    <div id="app"></div>
  </body>
</html>

```

```json{3,4} [package.json]
{
  "dependencies": {
    "element-plus": "1.1.0-beta.12",
    "vue": "^3.2.19"
  }
}
```

```js{5,6} [vue.config.js]
module.exports = {
  configureWebpack: {
    // @see https://www.webpackjs.com/configuration/externals/
    externals: {
      vue: 'Vue',
      'element-plus': 'ElementPlus',
    },
  }
}
```

```js{1-2,6} [main.js]
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import App from './App.vue'

const app = createApp(App)
app.use(ElementPlus)
app.mount('#app')
```

:::

按 webpack 官网的定义，[外部拓展](https://www.webpackjs.com/configuration/externals/)，顾名思义，非项目本地安装的依赖。vue首页中以 cdn 等外链方式引入的依赖作为项目的外部依赖。

开发项目具体页面时，正常按本地依赖引入，使用的是安装在本地 `node_modules` 中的资源。

但在构建输出 bundle 时，vue-cli/webpack 会排除 `externals` 中指定的依赖。构建产物运行时按配置的属性值寻找对应全局变量（CommonJS/AMD规范参考官网[配置](https://www.webpackjs.com/configuration/externals/#object)）。
