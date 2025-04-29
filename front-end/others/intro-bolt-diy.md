---
description: 使用bolt.diy根据提示词在线创建项目，可线上运行，也可反复提示完善
head:
  - - meta
    - name: keywords
      content: bolt.diy,LLM,deepseek,ai,prompt
created: '2025-04-29'
---

# 使用bolt.diy根据提示词在线创建项目

相关链接：

- 源仓库：[bolt.diy - Repo](https://github.com/stackblitz-labs/bolt.diy)
- 文档：[bolt.diy Docs](https://stackblitz-labs.github.io/bolt.diy/)

## 介绍

简单地说，`bolt.diy`可选择LLM模型，输入提示词，然后自动为你生成一个项目。你可以不断地输入以新增功能模块、进行修改完善或删除等调整。

> *"bolt.diy allows you to choose the LLM that you use for each prompt! Currently, you can use OpenAI, Anthropic, Ollama, OpenRouter, Gemini, LMStudio, Mistral, xAI, HuggingFace, DeepSeek, or Groq models - and it is easily extended to use any other model supported by the Vercel AI SDK! See the instructions below for running this locally and extending it to include more models."*

功能特性:

- AI驱动的全栈开发：使用大模型直接在浏览器中完成全栈（前端和后端）的开发工作，无需复杂的本地开发环境搭建
- 多LLM支持与可扩展架构：支持多种语言模型（LLM），并且具有可扩展的架构
- 图片辅助理解：可以附加图片，帮助语言模型更好地理解上下文
- 集成终端：内置了终端，可以直接运行生成的项目，查看输出结果
- 代码版本回溯：能够将代码回退到早期版本
- 项目打包下载：可以将项目打包成ZIP格式进行下载，便于项目的携带和迁移
- Docker集成支持

支持 DeepSeek 模型

::: details 可先使用免费2000万Tokens体验下

DeepSeek的VSCode插件首页上放了两个合作的服务商，>>[硅基流动](https://cloud.siliconflow.cn/i/scFXHmf2)<< 注册后赠送2000万 Tokens，可以用它先体验下（邀人再送tokens，[可薅](https://cloud.siliconflow.cn/i/scFXHmf2)）。

:::

## 演示

![demo](./assets/demo-bolt-diy-1.gif)

## 安装使用

::: details 参考链接

- 完整视频教程：[How to Install BOLT.DIY on Windows in UNDER 30 minutes!](https://www.youtube.com/watch?v=CyIsupMHvew&t=1173s)
- 安装清单：[Installation Checklist](https://gist.github.com/leex279/832246dc64f078162de1bf00997238a9)
- 社区：[Communitiy](https://thinktank.ottomator.ai/)
- 其它有用的内容：[Videos / Tutorial / Helpful Content](https://thinktank.ottomator.ai/t/videos-tutorial-helpful-content/3243)

:::

- 前置环境准备

```json
{
  "node": "20.17.0",
  "pnpm": "9.15.0"
}
```

- 源代码：fork或直接copy源代码
- 项目运行在5173端口，确保未被占用 `netstat -ano | findstr :5173`
- 重命名 `.env.example` 为 `.env.local`，在文件中找到对应LLM的环境变量，并填入你的apikey
- 安装最新的Visual C++ Redistributable以兼容`wrangler`

点击[Microsoft Visual C++ Redistributable latest supported downloads](https://learn.microsoft.com/en-us/cpp/windows/latest-supported-vc-redist?view=msvc-170#latest-microsoft-visual-c-redistributable-version)，安装对应版本包。否则，`wrangler`的版本需要降低到`3.61.0`

- 安装依赖

`pnpm install`, electron安装可能会因为网络超时报错，如果是它的问题，可更换镜像源或多试几次

- 运行：`pnpm run dev`
- 使用 OpenAILike 模型

设置环境变量 `OPENAI_LIKE_API_BASE_URL`, `OPENAI_LIKE_API_KEY`

页面中鼠标移至屏幕左侧打开面板 -> 设置 -> Local Providers -> OpenAILike -> 开启并输入服务商提供的 baseurl

以上面提到的>>[硅基流动](https://cloud.siliconflow.cn/i/scFXHmf2)<<为例，它的`base_url`为`https://api.siliconflow.cn/v1`

## 部署

官方已经提供了很多部署方案，可像单页应用一样构建，然后自行部署到自己的服务器或GitHub Pages上。也可以使用`wrangler`部署到Netlify、Vercel、Cloudflare等平台。

可使用 Electron 创建桌面应用

构建项目时，需要注意本地环境变量文件未被添加到git版本控制中，这是为了避免你的apikey泄露。

::: details wrangler部署到Cloudflare参考

- 全局安装wrangler
- `wrangler login`: 登录wrangler
- 环境变量

`.env.local`未被追踪，也不建议将自己的apikey放在`.env.production`中，除非将仓库设为私密。

环境变量可在cloudflare中设置。进入Cloudflare Pages，找到新创建的Page，点击进去再点击设置，添加上面提到的环境变量。不填的话部署没问题但网页会无法访问

- `pnpm run deploy`: 构建并部署

:::

## 总结

适合快速搭建项目

也适合做一些小玩意儿，在线生成、运行、调试，极速迭代，必要时亲自调整代码
