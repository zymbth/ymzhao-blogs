---
description: 网页移动端样式适配，基于css媒体查询与rem实现
head:
  - - meta
    - name: keywords
      content: css,h5,移动端,适配,媒体查询,rem
created: '2022-04-14'
---

# CSS移动端适配

## 前言

现在很多前端项目都是移动优先，要不就是移动端样式也需要一套。总之，移动端的样式适配是少不了的。

## 1、布局

[Bootstrap](https://v4.bootcss.com/docs/layout/grid/) 的栅格系统，CSS的flex布局，grid布局，都能通过调整布局来适配移动端的窄屏幕

## 2、CSS媒体查询

使用CSS媒体查询，设定移动端的样式

例如：

```css
@media screen and (max-width: 425px) {}
@media screen and (min-width: 426px) and (max-width: 750px) {}
@media screen and (min-width: 751px) and (max-width: 1200px) {}
```

以上设置了三个媒体查询，分别有其作用范围

## 3、适配单位

桌面端常用的px单位，放在各种尺寸的移动设配上，大小、比例都会大变样。按设计稿等比例得呈现是最理想的

- 元素的尺寸可以使用百分比、`vw`、`vh`等来表示

- 使用`rem`

`em`表示当前元素的字体大小，`1em` = 1倍字体大小

而`rem`表示根元素的字体大小

于是，我们可以使用`rem`来表示字号、行高、内外边距等

具体参考：[css移动端适配 - rem适配方案](https://www.cnblogs.com/smart-elwin/p/15087529.html)

设计稿是750px，使用1：100的比例设置rem：

`1 rem = 100 * (clientWidth / 750) + 'px'`

屏幕宽度为750px时，1rem = 100px

屏幕宽度为1500px时，1rem = 200px

屏幕宽度为375px时，1rem = 50px

假设设计稿是750px，那么，

`18px`的字体大小可以在对应的媒体查询中设置为`0.18rem`

`20px`的边距可以设置为`0.2rem`

诸如蓝湖等网站的设计图都可以方便的设置rem，将`px`自动换算为`rem`

### 注意

设置根元素(html)字体大小，部分元素继承该字号，可能会出现意料外的样式。设置该元素字号为12px或0都能解决问题

不过，为了根本上解决这个问题，可以设置body的字号为12px。这样，rem不会影响部分元素的字号继承

## 4、总结

一般桌面和移动端会各自一套设计稿，不可共用的样式需要写两套。两套样式需要注意优先级问题，不建议为了这个目的去添加`!important`。选择器相同的情况下，媒体查询放后面，自然会覆盖前面的样式

例如：

```css
<style lang="scss" scoped>
.container {
  padding: 20px;
  .content-title {
  	font-family: 'HelveticaNeue-Bold';
  	font-weight: bold;
  	font-size: 30px;
  	line-height: 36px;
  }
}
@media screen and (max-width: 750px) {
  .container {
  	padding: 0.2rem;
  	.content-title {
  	  font-size: 0.3rem;
  	  line-height: 0.36rem;
  	}
  }
}
</style>
```

如果无需考虑桌面端，可以直接采用`rem`的适配方案，能在不同的移动设备上展现同设计稿一样的样式

大尺寸屏幕下，`rem`会让样式放大过度，失去了设计的味道。
