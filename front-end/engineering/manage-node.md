---
description: node环境管理，node作为现代前端框架的必备运行环境，对它的基本使用管理
head:
  - - meta
    - name: keywords
      content: node,npm,管理,nvm,多版本
---

# node环境管理

## 前言

对于由现代前端框架搭建的项目，都需要先装node环境，npm作为默认的包管理器

由于node版本在快速迭代中，几年前的老系统适用的运行环境可能远远落后于新系统，同时开发维护时，node版本的切换是很有必要的。

这里仅做工具梳理，不讨论安装、使用方法等

## node版本切换

window系统中，可使用 `nvm` 安装、切换使用不同版本的 node

## 包管理器

yarn / pnpm 都是很优秀的包管理器，它们的优缺点及性能对比这里不提。目前来看，个人更推荐pnpm。

pnpm 有多种安装方法，也可以实现切换 node 版本。

## npm镜像

可通过npm命令手动设置镜像地址

也可借助 `nrm` 查看、切换npm镜像地址

## package.json

可使用 `packageManager` 指定包管理器版本，不符时，会报异常并中断npm命令的执行，参考[处理packageManager的异常](/front-end/snippets/package-manager-warn)

[package-json#engines](https://docs.npmjs.com/cli/v10/configuring-npm/package-json#engines) 可指定 node/npm 范围，不符时，只会提示警告而不会异常中断。

```json
{
  "packageManager": "pnpm@8.1.0",
  "engines": {
    "node": ">=18.0.0",
    "pnpm": ">=8.1.0"
  }
}
```
