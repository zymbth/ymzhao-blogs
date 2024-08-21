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

## volta

[VOLTA](https://volta.sh/) 是一个非常好用的工具，它允许你在项目内配置不同的 Node 版本、包管理器及其版本，而无需提前安装项目所需的 Node 及包管理器。（通过在package.json中添加volta配置实现，该配置非官方规范）

缺陷在于对 pnpm 的支持目前还在实验阶段，按官网描述添加环境变量以开启对 pnpm 的支持。需要注意的是，pnpm 的全局安装目前不被允许。

为了避免各种不可预知的bug，在安装使用 volta 前，最好移除已安装的 node, nvm 等，移除相关的 node 环境变量路径。
