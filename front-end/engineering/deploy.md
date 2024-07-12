# 前端项目部署

## 本地服务器

一般用来本地预览、测试

本地构建：`npm run build`

### 1. vscode插件

> [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)

使用 vscode 打开 dist 或对应构建输出根目录，按说明启动 Live Server

### 2. http-server

> [repo:http-server](https://github.com/http-party/http-server)

npm全局安装 `http-server` 或经 `npx` 使用

集成终端中打开构建根目录，`http-server` 直接在本地8080端口启动一个服务器，端口等配置参考官方文档

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

### 1. sftp上传项目构建文件

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
- git权限，使用ssh连接git仓库，通过ssh密钥访问仓库，具体参考官方文档[通过 SSH 连接到 GitHub](https://docs.github.com/zh/authentication/connecting-to-github-with-ssh)

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

前三种方法最终都是分别配置nginx、构建项目，完成 nginx web服务器配置。docker可以将这两部都配置在项目中，更新更加方便，但对服务器有一定要求，不适合老旧、低配的服务器。

::: code-group

```dockerfile [/Dockerfile]
FROM node:16.20-alpine AS build-stage

# 环境变量
# ENV NODE_ENV=production

# 创建工作目录
RUN mkdir -p /app
WORKDIR /app

# 复制项目文件和目录到容器中
COPY . /app

# 安装依赖项并构建应用程序
# RUN npm cache clean --force
# RUN npm install --registry https://registry.npmmirror.com
RUN npm install
RUN npm run build

# 清理node_modules目录
RUN rm -rf ./node_modules

# 第二阶段
# FROM node:16.20-alpine AS runtime-stage

# 创建工作目录
RUN mkdir -p /app
WORKDIR /app

# 复制构建阶段生成的输出到运行时阶段
# FROM nginx:mainline
FROM nginx:stable-alpine-slim
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build-stage /app/dist /app/dist

# 暴露端口
EXPOSE 9091
```

```yml [/docker-compose.yml]
version: '3'
services:
  xxxxxx:
    container_name: xxxxxx
    image: xxxxxx
    build:
      context: ./
      dockerfile: Dockerfile
    restart: always
    ports:
      - '80:9091'
    working_dir: /app/dist
    volumes:
      - ./nginx/default.conf:/etc/nginx/conf.d/default.conf
      - ./nginx/log:/var/log/nginx
    networks:
      - prod

networks:
  prod:
    driver: bridge
    driver_opts:
      com.docker.network.driver.mtu: 1452
```

```nginx [/nginx/default.conf]
# 生产环境
server {
    listen       9091;
    server_name  site.com;
    root         /app/dist;

    #charset koi8-r;
    access_log  /var/log/nginx/host.access.log  main;
    error_log  /var/log/nginx/error.log  error;

    # gzip
    gzip  on;
    gzip_min_length 1k;
    gzip_static on;
    gzip_buffers 4 16k;
    gzip_comp_level 4;
    gzip_types text/plain application/javascript application/x-javascript text/css application/xml text/javascript application/x-httpd-php image/jpeg image/gif image/png;
    gzip_disable "MSIE [1-6]\.";

    location / {
        index  index.html index.htm;
        try_files $uri $uri/ /index.html;
    }
}
```

```yml [/Makefile]
# 镜像 node:16.20-alpine
.PHONY: pull-node16
pull-node16:
	@if ! docker images --filter reference=node:16.20-alpine --quiet | grep -q .; then \
		echo "Pulling node:16.20-alpine image..."; \
		docker pull node:16.20-alpine; \
	else \
		echo "Docker image 'node:16.20-alpine' already exists."; \
	fi

# 镜像 nginx:stable-alpine-slim
.PHONY: pull-nginx
pull-nginx:
	@if ! docker images --filter reference=nginx:stable-alpine-slim --quiet | grep -q .; then \
		echo "Pulling nginx:stable-alpine-slim image..."; \
		docker pull nginx:stable-alpine-slim; \
	else \
		echo "Docker image 'nginx:stable-alpine-slim' already exists."; \
	fi

# 清除本服务悬空镜像（测试环境）
.PHONY: prune-test
prune-test:
	@if docker images -f "dangling=true" --filter "label=com.docker.compose.service=revir.website.test" --quiet | grep -q .; then \
		dangling_images=$$(docker images -f "dangling=true" --filter "label=com.docker.compose.service=revir.website.test" --quiet); \
		if [ -n "$$dangling_images" ]; then \
			echo "Dangling images was found in service revir.website.test:"; \
			echo $$dangling_images; \
			docker rmi $$dangling_images; \
		else \
			echo "No dangling images was found in service revir.website.test."; \
		fi \
	else \
		echo "No dangling images was found in service revir.website.test."; \
	fi


# 清除本服务悬空镜像（正式环境）
.PHONY: prune
prune:
	@if docker images -f "dangling=true" --filter "label=com.docker.compose.service=revir.website" --quiet | grep -q .; then \
		dangling_images=$$(docker images -f "dangling=true" --filter "label=com.docker.compose.service=revir.website" --quiet); \
		if [ -n "$$dangling_images" ]; then \
			echo "Dangling images was found in service revir.website:"; \
			echo $$dangling_images; \
			docker rmi $$dangling_images; \
		else \
			echo "No dangling images was found in service revir.website."; \
		fi \
	else \
		echo "No dangling images was found in service revir.website."; \
	fi

# 运行
.PHONY: run-fe
run-fe: pull-node16 pull-nginx prune
	docker-compose down
	docker-compose up --force-recreate --build --remove-orphans -d

```

:::
