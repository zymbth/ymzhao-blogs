---
description: 使用多种图片处理策略提升网页性能，包括压缩、云存储、预加载、懒加载、渐进式图片
head:
  - - meta
    - name: keywords
      content: 图片,性能优化,懒加载,预加载,渐进式图片
---

# 网页性能优化——图片，使用多种图片处理策略提升性能，包括压缩、云存储、预加载、懒加载、渐进式图片

## 前言

网站如果包含很多图片，那不仅打包后的文件会非常大，浏览器加载图片的过程可能会极大的降低网站性能，不做处理会导致非常糟糕的用户体验。

如下图所示，网络状况良好，测试服务器性能偏低（新用户一百一年的那种）。清空浏览器缓存，首屏加载的情景下，一张353kB的图片加载时间是很长的

![在这里插入图片描述](./assets/05e6325d72e141069611a8c052bcf2ee.png)

图片是如何影响网站性能的呢？

- 图片大小
除开icon/logo，图片资源一般都不会小，上图中353kb的图片除开http响应时间，排队耗时3.97秒，下载耗时3.25秒。前端常用的一些大插件gzip压缩后才多大呢？
- 服务器性能
中小企业的各类网站所部署的云服务器性能可能并不会很好，图片下载时间很长
- 浏览器接口并行上限
网站首屏加载时，可能会有几十个 html，js，css，图片等资源文件需要浏览器从服务器上请求。而浏览器的请求是有并行上限的，超出并行上限了就要排队。浏览器通常会优先加载HTML、CSS和JS等对页面有关键作用的资源，但当页面存在大量正在请求的图片，此时点击跳转页面，新的关键资源会“插队”，但不会要求响应中的http请求中断。这种情况下，即便浏览器接口并行上限未被占满，也会影响新页面的渲染。

本文所包含的图片处理策略正对应这几方面

## 一、图片处理

### 压缩

首先就是压缩静态资源的大小。相机照片一张就能轻松破10M，微信、钉钉等都会自动压缩图片视频。

[TinyPNG](https://tinypng.com/) : 傻瓜式操作，一键压缩，画质不变

[squoosh](https://squoosh.app/) : 简单好用的在线图片压缩工具，功能强大，可自由设置画质、尺寸等参数，还可转换图片格式

[img-compressor](https://github.com/IronPans/img-compressor) : 一个简单高效的JS图片压缩库

过度压缩会影响清晰度，另外，网站图片过多时，效果受限，也无法从根本上解决

### 渐进式图片

> [渐进式jpeg(progressive jpeg)图片及其相关](https://www.zhangxinxu.com/wordpress/2013/01/progressive-jpeg-image-and-so-on/)
>
> [图片渐进加载优化](https://juejin.cn/post/7016317182766383141)

**注意**，渐进式图像的大小通常更大，但是它们针对Web使用进行了优化，可以提供更好的用户体验。

#### 使用ps生成

使用ps打开图片，点击文件 -> 存储为web所用格式 

![在这里插入图片描述](./assets/43261a631c1d4b32aacb44bbabb345e8.jpeg)

勾选连续，就会保存为渐进式JPEG图片

#### npm库

::: details AI回答，未验证

There are several npm libraries that can convert images into progressive images. Here are a few examples:

- sharp: This is a popular image processing library for Node.js that can be used to convert images into progressive images. You can use the sharp command with the interlace option set to plane to convert an image into a progressive image.
- jimp: This is a JavaScript library for image processing that can be used to convert images into progressive images. You can use the jimp command with the interlace option set to plane to convert an image into a progressive image.
- imagemin: This is a npm library that can be used to compress and optimize images. It can also be used to convert images into progressive images by setting the interlace option to plane.
- gm: This is a npm library that can be used to convert images into progressive images. It can be used with the gm command and the interlace option set to plane to convert an image into a progressive image.

Here's an example of how you might use the sharp library to convert an image into a progressive image:

```js
const sharp = require('sharp');

sharp('input.jpg')
  .interlace('plane')
  .toFile('output.jpg', (err, info) => {
    if (err) {
      console.error(err);
    } else {
      console.log(info);
    }
  });
```

This code will convert the input.jpg image into a progressive image and save it as output.jpg. The interlace option is set to plane to indicate that the image should be converted into a progressive image.

:::

## 二、云存储

将图片等资源存储在云上，使用外链方式引入

云存储服务供应商的服务器性能肯定比普通云服务器强，但仍然需要下载。存在数据安全风险、服务可用性风险、成本风险、服务质量风险、依赖风险等。

## 三、懒加载

[HTMLImageElement.loading](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLImageElement/loading) : 图片可以通过设置 `loading` 属性值为 lazy 的方式，实现图片的懒加载（图片仅在马上要出现在可视视口中时开始加载）

`<img src="@/assets/images/tech-3.png" loading="lazy"/>`

## 四、图片预加载

图片预加载就是在当前页面加载完毕后，预先加载其它页面所需的图片，这样，切换到该页面时，浏览器就不需要再去请求该图片，直接渲染即可

### 实现

参考：

> [3种Javascript图片预加载的方法详解](https://zhuanlan.zhihu.com/p/453000943)

以vue项目为例，window.onload完毕后，开始预加载图片

使用 [require.context](https://webpack.docschina.org/guides/dependency-management/#requirecontext) 批量引入图片

然后使用每一张图片：`new Image().src = curr_image`

```javascript
export default {
  name: 'App',
  created() {
    window.onload = () => {
      const firstPriorityImgs = require.context('@/assets/images/preload/first', false, /\.(jpg|jpeg|png)$/)
      const secondPriorityImgs = require.context('@/assets/images/preload/second', false, /\.(jpg|jpeg|png)$/)
      const otherImgs = require.context('@/assets/images/preload', false, /\.(jpg|jpeg|png)$/)
      const avatars = require.context('@/assets/images/avatars', false, /\.(jpg|jpeg|png)$/)
      this.preloadImg(firstPriorityImgs)
      this.preloadImg(secondPriorityImgs)
      this.preloadImg(avatars)
      this.preloadImg(otherImgs)
    }
  },
  methods: {
    preloadImg (preloadImgs) {
      preloadImgs?.keys()?.forEach(img => {
        new Image().src = preloadImgs(img)
      })
    }
  }
}
```

首屏包含的图片无需预加载，window.onload意味着文档及图片加载完毕，也就是说，首屏加载完毕时才会去执行上述的图片预加载代码

具体效果，可以使用浏览器调试工具查看

**注意**：适当的预加载图片可以提升用户体验，但它不会提高网站的性能。将大量的图片都预加载，可能会阻塞后续异步产生的关键资源的请求！

## 五、延迟加载

> [图片延迟加载策略](https://juejin.cn/post/6844903469950697485)

首屏的加载速度至关重要，当首页的图片过多时，可以只加载首屏可见区域的图片，其它延迟加载

HTMLImageElement 本身的懒加载也是延迟加载

参考文章中的延迟加载策略，可以自定义一些策略，比如：

图片先全部使用默认图片替换

通过延迟、使用[MutationObserver](https://developer.mozilla.org/zh-CN/docs/Web/API/MutationObserver)接口、监听window.scroll事件替换上图片的真实url

已有此类封装的懒加载组件，或自行封装

## 总结

方案各有限制或不足，可组合使用。实际项目中需自行分析选用
