---
description: 从 State of HTML 2024 调查中看看有哪些新API没有听说过？
head:
  - - meta
    - name: keywords
      content: State of HTML,2024,survey,html
created: '2024-11-01'
tag: '摘录'
---

# State of HTML 2024

> 本文全文摘录自[调查问卷 / State of HTML 2024](https://survey.devographics.com/zh-Hans/survey/state-of-html/2024)，填写时发现太多 HTML 新 API 没有使用乃至听说过，特摘录下来以供个人学习查阅。
>
> 感兴趣的可以前往填写问卷，摸摸底，了解学习html新功能及其浏览器兼容性。待官方公布问卷调查结果后，可移步至 `https://2024.stateofhtml.com/` 查看，相关文档会更加全面（官方未公布时不可访问）。
>
> 已出调查报告：
>
> - [State of CSS 2024](https://2024.stateofcss.com/)
> - [State of HTML 2023](https://2023.stateofhtml.com/)
> - [State of JS 2023](https://2023.stateofjs.com/)
> - [State of CSS 2023](https://2023.stateofcss.com/)

> The State of HTML 2024 survey is currently open! Take the survey now [→](https://survey.devographics.com/en-US/survey/state-of-html/2024/?source=css2024)

HTML 是最初的 Web 技术，三十年后它依然与时俱进，这着实令人惊叹。

尽管名为 HTML 调查，但实际上我们的范围远不止于此，而是涵盖了整个 Web 平台的所有领域——内容之丰富，不胜枚举！

因此，设计这样一份调查问卷难免需要做出一些取舍。今年，我们决定聚焦于新兴和即将到来的功能，以帮助您紧跟潮流；同时也关注浏览器厂商最感兴趣的领域。

这意味着您的回答可能会直接影响到您正在使用的浏览器的未来发展路线图。正因如此，我非常高兴能够开启这第二届 HTML 现状调查！

## 1. 表单

### `<datalist>`

Method of providing a list of presets for a user to select in a form control, while still allowing custom options.

```html
<input name="country" list="countries">
<datalist id="countries">
  <option>Afghanistan</option>
  <!-- ... -->
</datalist>
```

### `autocomplete` attribute

Provide hints about what kind of information is expected, e.g. `name`, `honorific-prefix`, `tel`, `cc-number` etc

`<input name="address_firstline" autocomplete="billing street-address" />`

### HTML 媒体捕获

Capture input from the user’s camera.

`<input type="file" accept="video/*" capture>`

### `input.showPicker()`

Programmatically open the picker of form controls that have one (color pickers, date inputs etc).

```html
<input id="dateInput" type="date">
<button onclick="dateInput.showPicker()">Select date</button>
```

### FormData API

API to more easily extract and manipulate form data values via JS

```js
let fd = new FormData(form);
let data = JSON.stringify(Object.fromEntries(fd));
```

### Customizable Select

Stylable, customizable dropdown control. Previously `<selectlist>` and `<selectmenu>`.

```css
select,
::picker(select) {
  appearance: base-select;
}
```

### 用于 `contenteditable` 的 `plaintext-only` 值

Permits editing of the element's raw text, but not rich text formatting.

`<h2 class="title" contenteditable="plaintext-only"></h2>`

### EditContext (2024年新增)

The EditContext interface represents the text edit context of an element that was made editable by using the EditContext API.

```js
const canvas = document.createElement("canvas");
const editContext = new EditContext();
canvas.editContext = editContext;
```

### caretPositionFromPoint (2024年新增)

The caretPositionFromPoint() method returns the caret's character offset.

```js
const range = document.caretPositionFromPoint(e.clientX, e.clientY);
const textNode = range.offsetNode;
const offset = range.offset;
```

## 2. 交互性

### `<dialog>`

For dialog boxes or other interactive components, such as a dismissible alerts, or subwindows.

```html
<dialog id="confirm">
  <form method="dialog">
    Are you sure?
    <button value="1">Yes</button>
    <button value="0">No</button>
  </form>
</dialog>
```

### `<details>` 和 `<summary>`

A disclosure widget that can be toggled to hide or show content interactively.

```html
<details>
  <summary>Details</summary>
  Longer content
</details>
```

### Exclusive accordion

Group `<details>` elements so that only up to one in the group can be open at a time.

```html
<details open name="sidebar_panel" id="main_info">
  <summary>Main info</summary>
  <!-- controls -->
</details>
<details name="sidebar_panel" id="style_settings">
  <summary>Style</summary>
  <!-- controls -->
</details>
```

### 弹出窗口（popover） API

HTML syntax and JS API facilitating popovers such as overlays, popups, menus etc.

```html
<button popovertarget="foo">Toggle the popover</button>
<div id="foo" popover>Popover content</div>
```

### inert 属性

Attribute to make an element and its descendants non-interactive, and invisible to assistive technology.

```html
<div id=app inert class=loading>
  <!-- ... -->
</div>
```

### Clipboard API (2024年新增)

Provides the ability to respond to clipboard commands (cut, copy, and paste), as well as to asynchronously read from and write to the system clipboard.

```js
navigator.clipboard
  .readText()
  .then(
    (clipText) => (document.querySelector(".editor").innerText += clipText),
  );
```

## 3. 内容

### 懒加载

Load certain resources only when needed.

```html
<img src="picture.jpg" loading="lazy" />
<iframe src="supplementary.html" loading="lazy"></iframe>
```

### `srcset` and `sizes` attributes

Attributes that allow providing several source images with hints to help the browser pick the right one.

```html
<img
  srcset="fairy-med.jpg 480w, fairy-large.jpg 800w"
  sizes="(max-width: 600px) 480px, 800px"
  src="fairy-large.jpg"
  alt="Elva dressed as a fairy" />
```

### 资源提示（全部）

Begin work on certain resources early to improve performance. Syntax: `<link rel="pre* | dns-prefetch | modulepreload">`.

```html
<link rel="preload" href="picture.jpg" />
<link rel="dns-prefetch" href="https://fonts.googleapis.com/" />
```

### Content-Security Policy (CSP)

An added layer of security that helps to detect and mitigate XSS and other attacks.

```http
Content-Security-Policy: default-src 'self'
```

### `fetchpriority` attribute

Allows specifying a hint to help the browser prioritize fetching various resources.

`<img src="logo.svg" fetchpriority="high" />`

### `blocking="render"`

Specify that resources (scripts, stylesheets etc) should block rendering until loaded.

```html
<script blocking="render" async src="async-script.js"></script>
```

### 用于 AR/VR/3D 内容的 `<model>`

Allows embedding 3D graphical content into HTML.

`<model src="3d-assets/car"></model>`

### `controlslist` attribute

Prevent certain controls from appearing in the toolbar of a media element.

`<video src="fun.mp4" controlslist="nodownload"></video>`

### CSS Custom Highlight API (2024年新增)

Provides a mechanism for styling arbitrary text ranges on a document by using JavaScript to create the ranges, and CSS to style them.

```js
// css
::highlight(my-custom-highlight) {
  background-color: blue;
}

// js
const parentNode = document.getElementById("foo");
const range1 = new Range();
range1.setStart(parentNode, 10);
range1.setEnd(parentNode, 20);
const highlight = new Highlight(range1);
CSS.highlights.set("my-custom-highlight", highlight);
```

### `setHtmlUnsafe()` (2024年新增)

Used to parse a string of HTML into a DocumentFragment, which then replaces the element's subtree in the DOM.

```js
const value = "<p>This is a string of text</p>";
document.getElementById("target").setHTMLUnsafe(value);
```

### `parseHtmlUnsafe()` (2024年新增)

Used to parse a string of HTML, which may contain declarative shadow roots, in order to create a new Document instance.

`Document.parseHTMLUnsafe(input)`

### `Intl.Segmenter` API (2024年新增)

Language-sensitive segmentation of text into graphemes, words or sentences.

## 4. Web组件

### `<template>`

A mechanism for holding HTML that is not to be rendered immediately but may be utilized later via JS.

```html
<template id="counter">
  <div class="counter">Clicked {{ times }} times</div>
</template>
```

### 使用自定义元素

Using custom elements, that you or someone else defined.

```html
<sl-switch>Switch</sl-switch>
```

### 定义自定义元素

Defining custom elements for use by others.

```js
class MyElement extends HTMLElement { … }
customElements.define("my-element", MyElement);
```

### 作用域自定义元素注册表

Allow multiple custom element definitions for a single tag name to exist within a page.

```js
const registry = new CustomElementRegistry();
registry.define('sub-element', SubElement);
```

### Shadow DOM

Encapsulate elements not visible from the outside, and style them with CSS not affecting the rest of the page.

`this.shadowRoot = this.attachShadow({mode: "open"});`

### Declarative Shadow DOM

Define shadow trees with HTML.

```html
<host-element>
  <template shadowrootmode="open">
    <!-- Shadow content -->
  </template>
</host-element>
```

### Named slot assignment

`slot="slot_name"` attribute

### 命令式插槽分配

A way to assign elements to slots manually via JS, so that slot assignment does not have to be managed by the component consumers.

```js
this.attachShadow({mode: "open", slotAssignment: "manual" });
this.shadowRoot.querySelector("slot[name=foo]").assign(element);
```

### `ElementInternals` API

Assign hidden semantics to custom elements, facilitating accessibility and allowing them to participate fully in forms.

```js
this.#internals = this.attachInternals()
this.#internals.ariaChecked = true;
```

### DOM Parts

A cacheable representation of a part of the DOM that can be updated performantly.

### HTML 模块

Import HTML files via JS imports and access their elements and JS exports.

```html
<script type="module">
  import { TabList } from "./tablist.html" with { type: 'html' };
  customElements.define("tab-list", TabList);
</script>
```

### 您有使用过 Web 组件库吗？

- [ ] Shoelace

- [ ] Spectrum Web Components

- [ ] Lightning Web Components

- [ ] FAST

- [ ] Elix

- [ ] Lion

- [ ] Material Web

- [ ] Lit

- [ ] Stencil

- [ ] Polymer

- [ ] Svelte

- [ ] Ionic

- [ ] 其他

- [ ] 无

## 5. 无障碍

### Landmark elements

`<main>`, `<nav>`, `<aside>`, `<header>`, `<footer>`, `<section>`

### tabindex attribute

Make HTML elements focusable, allow or prevent them from being sequentially focusable

```html
<div role="button" tabindex="0">I’m Tabbable</div>
```

### focusgroup attribute

Facilitate keyboard focus navigation using the keyboard arrow keys among a set of focusable elements.

```html
<div focusgroup="wrap horizontal">
  <!-- child elements -->
</div>
```

### `<search>`

Semantic element for wrapping search UI.

```html
<search>
  <form action="search.php">
    <label>Find: <input name="q" type="search"></label>
    <button>Go!</button>
  </form>
</search>
```

### 在制作网站时，您会考虑到哪些用户残疾问题？

- [ ] 低视力
失明、高度近视等。

- [ ] 色觉异常
色盲

- [ ] 行动障碍
关节炎、腕管炎等。

- [ ] 前庭失调
癫痫、眩晕等。

- [ ] 学习障碍
阅读障碍、计算障碍等。

- [ ] 其他认知障碍
焦虑症、自闭症、强迫症、多动症等。

- [ ] 听力障碍
失聪、耳鸣等。

- [ ] 其他

- [ ] 无

### 在您的常规无障碍策略中，还有哪些其他技巧？

- [ ] 直观的键盘导航
除标签顺序外。

- [ ] 描述性 `alt` 文本
提供描述图片目的或内容的 `alt` 文本。

- [ ] 跳转到内容的链接
让用户直接跳转到页面的主要内容。

- [ ] `<fieldset>` 和 `<legend>`
使用 `<fieldset>` 和 `<legend>` 对相关表单元素进行分组。

- [ ] 信息层次结构
使用正确表示页面信息层次的标题（`<h1>` - `<h6>`）。

- [ ] 有意义的链接文本
确保链接文本在脱离上下文的情况下仍有意义

- [ ] 表单控制标签
确保每个表单控件都有一个 `<label>`（或 `aria-label` 等）。

- [ ] 可视焦点环
确保焦点环轮廓在需要时清晰可见。

- [ ] 不只依赖指针
确保指针交互（如悬停）有键盘替代方式。

- [ ] 足够的对比度
使用对比度检查器确保足够的色彩对比度。

- [ ] 不仅仅依赖颜色
确保不只通过颜色来传递信息。

- [ ] `prefers-reduced-motion` 媒体查询
为喜欢减少动效的用户提供替代 CSS。

- [ ] `prefers-contrast` 媒体查询
为喜欢增加对比度的用户提供替代 CSS。

- [ ] `prefers-color-scheme`

- [ ] 其他

- [ ] 无

### 您使用哪种屏幕阅读器进行无障碍性测试？

- [ ] VoiceOver

- [ ] JAWS

- [ ] TalkBack

- [ ] NVDA

- [ ] Narrator

- [ ] Orca

- [ ] Chrome DevTools

- [ ] Chromevox

- [ ] WAVE

- [ ] 其他

- [ ] 无

### 您使用什么工具进行无障碍性测试？

- [ ] Accessibility Insights

- [ ] Arc

- [ ] Assistiv Labs

- [ ] Axe

- [ ] browser_devtools

- [ ] Firefox Accessibility Inspector

- [ ] Guidepup

- [ ] IBM Equal Access Accessibility Checker

- [ ] Lighthouse

- [ ] Pa11y

- [ ] Polypane

- [ ] Siteimprove

- [ ] Storybook

- [ ] VoiceOver.js

- [ ] WAVE

- [ ] 其他

- [ ] 无

## 6. 类原生的Web应用

### File System Access API

Access files and directories on the user's local device.

```js
const handle = await window.showSaveFilePicker(opts);
```

### Badging API

Set a badge on the web application’s icon to notify about updated state in a less intrusive, persistent way.

```js
navigator.setAppBadge(unreadCount)
```

### Web Share API

Exposes a mechanism for sharing content to various user-selected targets.

```js
navigator.share(shareData)
```

### Launch Handler API

Allows PWAs to control how they are launched, e.g. in a new window or tab.

```json
"launch_handler": {"client_mode": "navigate-new"}
```

### File Handling API

Allows PWAs to register themselves as handlers for certain file types.

```json
"file_handlers": [{
    "action": "/open-file",
    "accept": {
      "image/svg+xml": ".svg",
      "image/png": ".png"
    }
  }]
```

### Window Controls Overlay API

Allows PWAs to display custom content over the title bar area, whose controls become an overlay.

```json
"display_override": ["window-controls-overlay"]
```

### Isolated Web Apps

Native-like packaging, permissions and signed updates for PWAs.

`isolated-app://4tkr2qbhf7rlz2a3wo3rh4wqaaic/index.html`

### 您是否使用过这些工具来构建原生应用程序？

- [ ] 不包括脚本、命令行应用程序、服务器端代码等。

- [ ] 基于 JavaScript 的框架
React Native, Ionic, Electron 等等。

- [ ] 非 JavaScript 框架
Tauri, Flutter 等等。

- [ ] 原生技术
Objective-C, Swift, Kotlin, .NET, 等等。

- [ ] 其他

- [ ] 🚫 我没有开发过原生应用程序

## 7. 其他工具和功能

### 您经常使用哪些静态或动态网站生成器？

- [ ] Jekyll

- [ ] Eleventy

- [ ] Hugo

- [ ] Gatsby

- [ ] Next.js

- [ ] Nuxt

- [ ] Astro

- [ ] SvelteKit

- [ ] Remix

- [ ] 其他

- [ ] 无

### Which of these validation tools do you regularly use?

- [ ] W3C Validator

- [ ] Validator.nu HTML Checker

- [ ] HTML-validate

- [ ] HTMLHint

- [ ] 其他

- [ ] 无

### What tools & services do you use to track and improve the performance of your websites?

- [ ] Lighthouse

- [ ] Browser Devtools

- [ ] PageSpeed Insights

- [ ] WebPageTest

- [ ] Pingdom

- [ ] 其他

- [ ] 无

### What analytics tools & services do you use to monitor your websites?

- [ ] Google Analytics

- [ ] Plausible Analytics

- [ ] Fathom Analytics

- [ ] New Relic

- [ ] Mixpanel

- [ ] Clicky

- [ ] Matomo

- [ ] Heap

- [ ] Datadog

- [ ] 其他

- [ ] 无

### Which browser(s) do you primarily work in during initial development?

- [ ] Edge

- [ ] Chrome

- [ ] Safari

- [ ] Firefox

- [ ] Internet Explorer 11

- [ ] Internet Explorer 8/9/10

- [ ] Opera Mini

- [ ] Safari iOS

- [ ] Chrome iOS

- [ ] Chrome Android

- [ ] Firefox Android

- [ ] Samsung Internet

- [ ] Vivaldi

- [ ] Brave

- [ ] UC Browser

- [ ] Opera

- [ ] Polypane

- [ ] Arc

- [ ] ladybird

- [ ] 其他

### Which of these resources do you consult to stay informed about web platform features?

- [ ] W3C

- [ ] MDN

- [ ] Web.dev

- [ ] Can I Use

- [ ] Chrome Platform Status

- [ ] WebKit Blog

- [ ] HTTP Archive

- [ ] Web Features Explorer

- [ ] 其他
