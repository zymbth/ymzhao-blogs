---
description: 从 State of JavaScript 2024 调查中看看有哪些新功能没有听说过？
head:
  - - meta
    - name: keywords
      content: State of JavaScript,2024,survey,js
created: '2024-11-20'
tag: '摘录'
---

# State of JavaScript 2024

**不只是问卷，整个问卷[阅读🔗](https://2024.stateofjs.com/)下来，相信必有收获！**

> 本文全文摘录自[调查问卷 / State of JavaScript 2024](https://survey.devographics.com/zh-Hans/survey/state-of-js/2024)，填写时发现很多新特性、框架等没有使用乃至听说过，特摘录下来以供个人学习查阅。
>
> 已出调查报告：
>
> - [State of JavaScript 2024](https://2024.stateofjs.com/)
> - [State of HTML 2024](https://2024.stateofhtml.com/)
> - [State of CSS 2024](https://2024.stateofcss.com/)
> - [State of HTML 2023](https://2023.stateofhtml.com/)
> - [State of JS 2023](https://2023.stateofjs.com/)
> - [State of CSS 2023](https://2023.stateofcss.com/)

*"在我们忙于决定下一个前端库的选择时，JavaScript 本身也在经历着自身的演变。<br/>新的 TC39 提案正在社区中引起轰动，而其他提案已经处于即将在各大浏览器中实施的边缘。同时，TypeScript 的流行使得未来某个时候原生类型支持的可能性变得真实。<br/>可以肯定的是——尽管 2024 年的 JavaScript 仍然感觉很熟悉，但我们无法保证五年后我们还能对所写的语言有同样的感受。<br/>在此之前，您可以通过参与今年的 JavaScript 现状调查来帮助我们绘制未来的路径！"*

## 1. 特性

### 您使用过以下哪些语法特性？

- [ ] Dynamic Import
Load a module asynchronously and dynamically.
- [ ] Nullish Coalescing
Return first value, or second value if first value is null or undefined.
- [ ] Private Properties
Properties that cannot be legally referenced outside of the class.
- [ ] Logical Assignment
Operators to assign a value to a variable based on its own truthy/falsy status.
- [ ] error.cause
Indicate the specific original cause of the error.
- [ ] Hashbang Grammar
Provide the path to a specific JavaScript interpreter that you want to use to execute the script.
- [ ] 无

### 您使用过以下哪些字符串特性？

- [ ] string.replaceAll()
Replace all instances of a string.
- [ ] string.matchAll()
Return an iterator of all results matching this string against a regular expression.
- [ ] Regexp Match Indices
Store the start and end positions of each matched capture group.
- [ ] 无

### 您使用过以下哪些数组特性？

- [ ] array.findLast()
Returns the value of the last element that satisfies the testing function.
- [ ] array.toSorted()
Sort without mutating the original array.
- [ ] array.toReversed()
Reverse without mutating the original array.
- [ ] array.with()
Returns a new array with the element at the given index replaced with the given value.
- [ ] array.toSpliced()
Splice without mutating the original array.
- [ ] array.fromAsync()
Similar to Array.from but for async iterators.
- [ ] 无

### Which of these Set features have you used? (2024年新增)

- [ ] set.intersection()
Returns a new set containing elements in both this set and the given set.
- [ ] set.union()
Returns a new set containing elements of both this set and the given set.
- [ ] set.difference()
Returns a new set containing elements in this set but not in the given set.
- [ ] set.symmetricDifference()
Returns a new set containing elements which are in either this set or the given set, but not in both.
- [ ] set.isSubsetOf()
Returns a boolean indicating if all elements of this set are in the given set.
- [ ] set.isSupersetOf()
Returns a boolean indicating if all elements of the given set are in this set.
- [ ] set.isDisjointFrom()
Returns a boolean indicating if this set has no elements in common with the given set.
- [ ] 无

### Which of these Object features have you used? (2024年新增)

- [ ] Object.groupBy()
Group the elements of a given iterable according to the string values returned by a provided function.
- [ ] 无

### 您使用过以下哪些异步特性？

- [ ] Promise.allSettled()
Returns a single Promise that fulfills when all of the input's promises fulfills.
- [ ] Promise.any()
Returns a single Promise that fulfills when any of the input's promises fulfills.
- [ ] Promise.try()
Take a callback of any kind and wrap its result in a Promise.
- [ ] 无

### 您使用过以下哪些浏览器 API？

- [ ] WebGL
- [ ] Web Animations
- [ ] WebRTC
- [ ] Web Speech API
- [ ] WebSocket
- [ ] Page Visibility API
- [ ] Broadcast Channel API
- [ ] Geolocation API
- [ ] WebXR Device API
- [ ] Temporal
Provides standard objects and functions for working with dates and times.
- [ ] Gamepad API
- [ ] Web Authentication API
- [ ] Progressive Web Apps
- [ ] WebAssembly (WASM)
- [ ] 无

## 2. 前端框架

> 调查框架使用情况

- React
- Vue.js
- Angular（请注意，此问题仅针对 Angular 的用户体验， 而不是 已经弃用的 AngularJS.）
- Preact
- Svelte
- Alpine.js
- Lit
- Solid
- Qwik
- Stencil
- HTMX

## 3. 元框架

> 调查元框架使用情况

- Next.js
- Nuxt
- Gatsby
- Remix
- Astro
- SvelteKit
- Docusaurus
- SolidStart
- Deno Fresh

## 4. 测试工具

> 调查元框架使用情况

- Jest
- Mocha
- Storybook
- Cypress
- Puppeteer
- Testing Library
- Playwright
- WebdriverIO
- Vitest
- Selenium
- TestCafe
- Mock Service Worker
- Node Test Runner

## 5. 构建工具

> 调查构建工具使用情况

- webpack
- Parcel
- Rollup
- tsc CLI
- SWC
- esbuild
- Vite
- Turbopack
- tsup
- Biome
- Rspack
- Rolldown

## 6. Monorepo 工具

> 调查 Monorepo 工具使用情况

- Rush
- Turborepo
- Yarn Workspaces
- Yalc
- Lerna
- npm Workspaces
- pnpm
- Nx

## 7. 其他工具

### 您经常使用哪些工具库？

- [ ] Immer
- [ ] Lodash
- [ ] Underscore.js
- [ ] Ramda
- [ ] jQuery
- [ ] RxJS
- [ ] stdlib
- [ ] Zod
- [ ] core-js
- [ ] Partytown
- [ ] Mitosis
- [ ] Moment
- [ ] Day.js
- [ ] date-fns
- [ ] Luxon
- [ ] Yup
- [ ] 其他
- [ ] 无

### 专用于图形和动画的库

- [ ] Popmotion
- [ ] PixiJS
- [ ] Theatre.js
- [ ] Lottie
- [ ] Anime.js
- [ ] Three.js
- [ ] GSAP
- [ ] React-Spring
- [ ] Framer Motion
- [ ] Motion One
- [ ] D3
- [ ] 其他
- [ ] 无

### 后端框架

生成 API 和管理后端的框架

- [ ] Express
- [ ] Nest
- [ ] Strapi
- [ ] Fastify
- [ ] Meteor
- [ ] Hapi
- [ ] Koa
- [ ] Adonis
- [ ] Keystone
- [ ] Redwood
- [ ] Sails
- [ ] Directus
- [ ] Amplication
- [ ] Blitz
- [ ] Hono
- [ ] ElysiaJS
- [ ] 其他
- [ ] 无

### 你最常使用哪个引擎/运行时/执行环境？

- [ ] Browser
- [ ] Node.js
- [ ] Deno
- [ ] ChakraCore
- [ ] Hermes
- [ ] Service Workers
navigator.serviceWorker.register("/sw.js")
- [ ] Bun
- [ ] 其他
- [ ] 无

### 您经常使用哪些边缘或无服务器运行时？

- [ ] AWS Lambda
- [ ] Cloudflare Workers
- [ ] Netlify Edge Functions
- [ ] Google Cloud Functions
- [ ] Vercel Edge Runtime
- [ ] Fly.io
- [ ] Digital Ocean Functions
- [ ] Azure Functions
- [ ] Deno
- [ ] 其他
- [ ] 无

### 您经常使用哪些非 JavaScript 语言?

Other than JavaScript or TypeScript.

- [ ] PHP
- [ ] Ruby
- [ ] Python
- [ ] Go
- [ ] Rust
- [ ] Java
- [ ] C/C++
- [ ] Objective-C
- [ ] Scala
- [ ] Swift
- [ ] C#
- [ ] Haskell
- [ ] OCaml
- [ ] Dart
- [ ] Kotlin
- [ ] Elixir
- [ ] Bash
- [ ] Clojure
- [ ] Elm
- [ ] Julia
- [ ] 其他
- [ ] 无

### 您经常使用哪些人工智能工具来帮助您编写代码？

- [ ] Amazon CodeWhisperer
- [ ] v0
- [ ] JetBrains AI
- [ ] Codium
- [ ] Google Gemini
- [ ] ChatGPT
- [ ] Codeium
- [ ] Microsoft Bing
- [ ] Cursor
- [ ] Perplexity
- [ ] Copilot
- [ ] Tabnine
AI assistant for software developers
- [ ] Phind
- [ ] Cody
- [ ] Llama
- [ ] Claude
- [ ] 其他
- [ ] 无

### 您使用过哪些服务来托管 JavaScript 应用程序？

- [ ] AWS
- [ ] Azure
- [ ] Cloudflare
- [ ] Digital Ocean
- [ ] Fastly
- [ ] Fly.io
- [ ] GitHub Pages
- [ ] Google Cloud
- [ ] Heroku
- [ ] Netlify
- [ ] Render
- [ ] Vercel
- [ ] Railway
- [ ] 其他
- [ ] 无

## 8. 使用情况

- JavaScript/TypeScript 平衡
- Compiled Code Balance
- AI Code Generation
- JavaScript 使用情况
- 行业
- 应用范式
- JavaScript 痛点
- New Proposals
- 缺失的功能
- Native Types
- Web 技术满意度
- JavaScript 满意度

## 9. 资料

### Which newsletters do you read to stay up to date with web development news?

> 前端资讯

- [ ] Frontend Horse
- [ ] JavaScript Weekly
- [ ] Node Weekly
- [ ] Frontend Focus
- [ ] Bytes
- [ ] This Week In React
- [ ] TLDR
- [ ] CSS-Tricks
- [ ] SitePoint
- [ ] Web Design Weekly
- [ ] Vue News
- [ ] 其他
- [ ] 无

### 订阅了哪些编程相关的播客？

- [ ] Syntax
- [ ] JS Party
- [ ] Web Standards
- [ ] The Changelog
- [ ] Shop Talk Show
- [ ] JavaScript Jabber
- [ ] Miguel Ángel Durán
- [ ] PodRocket
- [ ] DevTalles
- [ ] Front End Happy Hour
- [ ] The Primeagen
- [ ] The CSS Podcast
- [ ] Stack Overflow Podcast
- [ ] Svelte Radio
- [ ] DevtoolsFM
- [ ] 其他
- [ ] 🚫 无
