# vue 项目中使用 svg 组件

## 参考

> [vue3 封装 svg 图标组件](https://juejin.cn/post/7213983712731906106)
>
> [vue-element-admin - Svg Icon 图标](https://panjiachen.github.io/vue-element-admin-site/zh/feature/component/svg-icon.html#%E4%BD%BF%E7%94%A8%E6%96%B9%E5%BC%8F)
>
> [手摸手，带你优雅的使用 icon](https://juejin.cn/post/6844903517564436493)

## 一、新建 SvgIcon 组件

```vue
<template>
  <div v-if="isExternal" :style="styleExternalIcon" class="svg-external-icon svg-icon" />
  <svg v-else :class="svgClass" aria-hidden="true">
    <use :xlink:href="iconName" />
  </svg>
</template>

<script>
/**
 * svg icon
 * @prop {string} iconClass svg文件名称
 * @prop {string} className icon 自定义 class
 * @example
 * // 引入 @/icons/svg/xxx.svg
 * <svg-icon iconClass="add" style="color:var(--theme-color);font-size:28px;" />
 * // 使用外链的形式引入 svg:
 * <svg-icon icon-class="https://xxxx.svg />
 */
export default {
  name: 'SvgIcon',
  props: {
    iconClass: {
      type: String,
      required: true,
    },
    className: {
      type: String,
      default: '',
    },
  },
  computed: {
    isExternal() {
      return isExternal(this.iconClass)
    },
    iconName() {
      return `#icon-${this.iconClass}`
    },
    svgClass() {
      if (this.className) {
        return 'svg-icon ' + this.className
      } else {
        return 'svg-icon'
      }
    },
    styleExternalIcon() {
      return {
        mask: `url(${this.iconClass}) no-repeat 50% 50%`,
        '-webkit-mask': `url(${this.iconClass}) no-repeat 50% 50%`,
      }
    },
    isExternal(path) {
      return /^(https?:|mailto:|tel:)/.test(path)
    },
  },
}
</script>

<style scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}

.svg-external-icon {
  background-color: currentColor;
  mask-size: cover !important;
  display: inline-block;
}
</style>
```

## 二、svg 图标存放位置

1. svg 存放在目录 src/icons/svg/ 下
2. 导入所有 svg 图标，文件 src/icons/index.js：

```javascript
const req = require.context('./svg', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)
```

3. 入口文件中引入 svg 组件及图标

main.js:

```javascript
import { createApp } from 'vue'
import App from './App.vue'
import SvgIcon from '@/components/SvgIcon'
import '@/icons'

const app = createApp(App)
app.component('svg-icon', SvgIcon)
app.mount('#app')
```

## 三、打包

1. 安装 svg-sprite-loader 处理 svg 图标

`npm install --save-dev svg-sprite-loader`
或：
`yarn add svg-sprite-loader -D`

2. 打包配置

vue.config.js:

```javascript
module.exports = {
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
  },
}
```

另一种配置会出现打包部署后，无法显示 svg 图标的 bug，不知道什么原因

```javascript
module.exports = {
  chainWebpack: config => {
    config.module.rules.delete('svg') // 重点:删除默认配置中处理svg
    config.module
      .rule('svg-sprite-loader') // rule 匹配规则
      .test(/\.svg$/) // 用正则匹配 文件
      .include // 包含
      .add(resolve('src/icons/svg')) // 处理svg目录
      .end()
      .use('svg-sprite-loader') // 配置loader  use() 使用哪个loader
      .loader('svg-sprite-loader') // 加载loader
      .options({
        // [name] 变量。一般表示匹配到的文件名 xxx.svg
        // 注意： symbolId  在  <use xlink:href="#icon-svg文件名" />
        symbolId: 'icon-[name]', // 将所有的.svg 集成到 symbol中，当使用 类名 icon-文件名
        // outputPath: '/icons',
        // publicPath: '/',
      })
  },
}
```

## 四、使用

将 add.svg 拷贝只 src/icons/svg/ 文件夹下
页面中引用全局注册的 svg-icon 组件，iconClass 对于图标文件名

```html
<svg-icon iconClass="add" />
```

## 五、总结

vue 项目中封装 svg 组件的思路大多都是这样的，细节可以自行调整。

封装的意义，一方面在于通过组件调用 svg 图标，使之可重用，封装后，调用只需一行代码。另一方面，`svg-sprite-loader` 可以压缩 svg。
由于它的实现实际上是将压缩后的 svg 图标内联到 html 上：
![Snipaste_2023-06-26_15-48-34.jpg](https://cdn.nlark.com/yuque/0/2023/jpeg/35185384/1687765813183-e3590b44-2544-4204-ba25-23018f6e42b1.jpeg#averageHue=%23fafdf8&clientId=u0e5c6024-88eb-4&from=ui&id=ue56da9a7&originHeight=368&originWidth=775&originalType=binary&ratio=1&rotation=0&showTitle=false&size=108029&status=done&style=none&taskId=uae974646-a2a6-4321-9398-1729e066b52&title=)
当项目中使用了过多的 svg 时，可能会影响性能
