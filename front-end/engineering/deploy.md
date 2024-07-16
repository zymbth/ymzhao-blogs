---
description: 前端常见的几种项目部署方式，包括本地服务器、nginx web服务器、docker自动部署
head:
  - - meta
    - name: keywords
      content: 前端,部署,docker,服务器
---

# 前端项目部署

## 本地服务器

一般用来本地构建产物的预览、测试

本地构建：`npm run build`

### 1. vscode插件

> [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)

使用 vscode 打开 dist 或对应构建输出根目录，按说明启动 Live Server

### 2. http-server

> [repo:http-server](https://github.com/http-party/http-server)

npm全局安装 `http-server` 或经 `npx` 使用

集成终端中打开构建根目录，`http-server` 直接在本地8080端口启动一个服务器，端口等配置参考官方文档

### 3. vite preview

vite 项目中可使用 [preview](https://cn.vitejs.dev/guide/cli.html#vite-preview) 命令预览构建产物

## 远程服务器

在远程服务器上，根据项目构建文件，配置web服务器

- **nginx配置web服务器**

自行搜索。例如下面创建了一个静态 web 服务器：

```text
server {
	listen 80;
	listen [::]:80;

	server_name localhost;
	# server_name yoursite.com;

	root /home/ubuntu/project-root/dist;
	index index.html index.htm;

	location / {
		try_files $uri $uri/ /index.html;
	}
}
```

### 1. sftp上传项目构建产物

前端本地构建好，将文件上传至服务器。

优点在于操作简单，对服务器的运行环境及配置要求也低，缺点在于不“优雅”。

同远程服务器建立一个sftp连接的方法很多，vscode插件和各种客户端工具都行。

- [WinSCP](https://winscp.net/eng/docs/lang:chs)：文件传输速度快
- [MobaXterm](https://mobaxterm.mobatek.net/)：多功能的 SSH 客户端
- [Xshell](https://www.netsarang.com/en/xshell/)：强大的 SSH 客户端

### 2. 服务器运行构建

```shell
cd /path/to/clone/project
git clone repourl
cd project-name
npm install
npm run build
```

### 3. shell脚本自动更新构建

可编写shell脚本完成上一过程，但存在几个问题要注意：

- shell脚本文件本身需赋予可执行权限
- git权限，使用ssh连接git仓库，通过ssh密钥访问仓库，具体参考官方文档[通过 SSH 连接到 GitHub](https://docs.github.com/zh/authentication/connecting-to-github-with-ssh)。按说明将生成的一对密钥保存在 `~/.ssh/` 下。

```shell
#!/bin/bash

cd /path/to/project

eval "$(ssh-agent -s)"
ssh-add ~/.ssh/private-key

git pull

npm install

npm run build
```

### 4. docker部署

前三种方法最终都是分别配置nginx、构建项目，完成 nginx web服务器配置。

docker完全可以完成这两步，更新也更加方便，但对服务器有一定要求，不适合老旧、低配的服务器。

docker部署方法很多，最好自行查询文档攻略编写。

这里提供一个[代码片段](/front-end/snippets/deploy-via-docker)仅供参考。
