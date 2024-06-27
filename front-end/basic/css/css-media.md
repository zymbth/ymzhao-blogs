---
description: css媒体查询总结，包括定义、语法、屏幕宽度断点
head:
  - - meta
    - name: keywords
      content: css,media,媒体查询,宽度断点
---

# css媒体查询总结

## 一、定义及基本用法

> [CSS3 @media 查询](https://www.runoob.com/cssref/css3-pr-mediaquery.html)

### 1. 定义

使用 @media 查询，你可以针对不同的媒体类型定义不同的样式。

@media 可以针对不同的屏幕尺寸设置不同的样式，特别是如果你需要设置设计响应式的页面，@media 是非常有用的。

当你重置浏览器大小的过程中，页面也会根据浏览器的宽度和高度重新渲染页面。

### 2. 语法

mediatype：媒体类型

and|not|only：运算符

(media feature)：媒体功能

```css
@media mediatype and|not|only (media feature) {
  CSS-Code;
}
```

也可以针对不同的媒体使用不同 stylesheets :

```html
<link rel="stylesheet" media="mediatype and|not|only (media feature)" href="mystylesheet.css">
```

### 3. 实例

如果文档宽度小于 300 像素则修改背景颜色：

```css
@media screen and (max-width: 300px) {
  body {
      background-color:lightblue;
  }
}
```

### 4. 媒体类型（mediatype）

| 值| 描述 |
| ------ | ------ |
| all | 用于所有设备|
| print  | 用于打印机和打印预览 |
| screen | 用于电脑屏幕，平板电脑，智能手机等。 |
| speech | 应用于屏幕阅读器等发声设备 |

### 5. 媒体功能（media feature）

| 值| 描述 |
| ------ | ------ |
| aspect-ratio| 定义输出设备中的页面可见区域宽度与高度的比率|
| color | 定义输出设备每一组彩色原件的个数。如果不是彩色设备，则值等于0|
| color-index| 定义在输出设备的彩色查询表中的条目数。如果没有使用彩色查询表，则值等于0|
| device-aspect-ratio| 定义输出设备的屏幕可见宽度与高度的比率。|
| device-height| 定义输出设备的屏幕可见高度。|
| device-width| 定义输出设备的屏幕可见宽度。|
| grid | 用来查询输出设备是否使用栅格或点阵。|
| height | 定义输出设备中的页面可见区域高度。|
| max-aspect-ratio| 定义输出设备的屏幕可见宽度与高度的最大比率。|
| max-color| 定义输出设备每一组彩色原件的最大个数。|
| max-color-index| 定义在输出设备的彩色查询表中的最大条目数。|
| max-device-aspect-ratio| 定义输出设备的屏幕可见宽度与高度的最大比率。|
| max-device-height| 定义输出设备的屏幕可见的最大高度。|
| max-device-width| 定义输出设备的屏幕最大可见宽度。|
| **max-height** | **定义输出设备中的页面最大可见区域高度。** |
| max-monochrome| 定义在一个单色框架缓冲区中每像素包含的最大单色原件个数。|
| max-resolution| 定义设备的最大分辨率。|
| **max-width** | **定义输出设备中的页面最大可见区域宽度。** |
| min-aspect-ratio| 定义输出设备中的页面可见区域宽度与高度的最小比率。|
| min-color| 定义输出设备每一组彩色原件的最小个数。|
| min-color-index| 定义在输出设备的彩色查询表中的最小条目数。|
| min-device-aspect-ratio| 定义输出设备的屏幕可见宽度与高度的最小比率。|
| min-device-width| 定义输出设备的屏幕最小可见宽度。|
| min-device-height| 定义输出设备的屏幕的最小可见高度。|
| **min-height** | **定义输出设备中的页面最小可见区域高度。** |
| min-monochrome| 定义在一个单色框架缓冲区中每像素包含的最小单色原件个数|
| min-resolution| 定义设备的最小分辨率。 |
| **min-width** | **定义输出设备中的页面最小可见区域宽度。** |
| monochrome | 定义在一个单色框架缓冲区中每像素包含的单色原件个数。如果不是单色设备，则值等于0|
| orientation |定义输出设备中的页面可见区域高度是否大于或等于宽度。 |
| resolution | 定义设备的分辨率。如：96dpi, 300dpi, 118dpcm|
| scan | 定义电视类设备的扫描工序。|
| width | 定义输出设备中的页面可见区域宽度。|

## 二、媒体查询

### 1. 宽度断点

额外的小设备（手机，小于 768px）：@media (max-width: 767px)

小型设备（平板电脑，768px 起）：@media (min-width: 768px) and (max-width: 991px)

中型设备（台式电脑，992px 起）：@media (min-width: 992px) and (max-width: 1199px)

大型设备（大台式电脑，1200px 起）：@media (min-width: 1200px)

### 2. bootstrap

Bootstrap定义好了分界点：

在栅格系统中，我们在 Less 文件中使用以下媒体查询（media query）来创建关键的分界点阈值。

```css
/* 超小屏幕（手机，小于 768px） */
/* 没有任何媒体查询相关的代码，因为这在 Bootstrap 中是默认的（还记得 Bootstrap 是移动设备优先的吗？） */
/* 小屏幕（平板，大于等于 768px） */
@media (min-width: @screen-sm-min) { ... }
/* 中等屏幕（桌面显示器，大于等于 992px） */
@media (min-width: @screen-md-min) { ... }
/* 大屏幕（大桌面显示器，大于等于 1200px） */
@media (min-width: @screen-lg-min) { ... }
```

我们偶尔也会在媒体查询代码中包含 max-width 从而将 CSS 的影响限制在更小范围的屏幕大小之内。

```css
@media (max-width: @screen-xs-max) { ... }
@media (min-width: @screen-sm-min) and (max-width: @screen-sm-max) { ... }
@media (min-width: @screen-md-min) and (max-width: @screen-md-max) { ... }
@media (min-width: @screen-lg-min) { ... }
```

### 3. element UI

| 值| 描述 |
| ------ | ------ |
| xs| <768px|
| sm | ≥768px|
| md |≥992px|
| lg |  ≥1200px|
| xl | ≥1920px|
