# docker部署nuxt3前端+nodejs后端

项目环境：

前端：vue, nuxt SSG 模式

后端：nodejs邮件服务

## 项目目录结构

```text
├ __service 服务目录
│ ├ dist 编译输出目录
│ │ └ mailer.cjs 编译输出js
│ ├ node_modules
│ ├ src
│ │ └ index.js 邮件服务入口js
│ │
│ ├ .dockerignore
│ ├ .gitignore
│ ├ docker-compose.yml
│ ├ Dockerfile
│ ├ package.json
│ └ webpack.config.js
│
├ dist 编译输出目录
├ .output 编译输出目录
├ node_modules
├ assets 资源
├ public 静态资源
│ ├ images
│ └ news 新闻相关图片
├ server nuxt服务
├ plugins nuxt插件
├ middleware nuxt中间件
├ composables nuxt hooks
├ components nuxt组件
├ pages nuxt页面
├ nginx nginx配置
├ app.vue nuxt应用根组件
├ .env.* 环境变量配置文件
├ .dockerignore
├ .gitignore
├ docker-compose.test.yml 测试环境
├ docker-compose.yml
├ Dockerfile
├ Dockerfile-test 测试环境
├ Makefile
├ nuxt.config.js
├ package.json
└ README.md
```

## docker 配置

### docker-compose

`docker-compose.yml`:

```yml
version: '3'
services:
  aegis.website:
    container_name: aegis.website
    image: aegis.website
    build:
      context: ./
    restart: always
    ports:
      - '80:9097'
    working_dir: /app/.output/public
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

### Dockerfile

`Dockerfile`:

```text
FROM node:18.20-alpine AS build-stage

# 设置环境变量
# ENV NODE_ENV=production
ENV COMPOSE_PROJECT_NAME=aegis-web

# 创建工作目录
RUN mkdir -p /app
WORKDIR /app

# 复制项目文件和目录到容器中
COPY . /app

# 安装依赖项并构建应用程序
# RUN npm cache clean --force
RUN npm install --registry https://registry.npmmirror.com
RUN npm run generate

# 清理node_modules目录
RUN rm -rf ./node_modules

# 第二阶段
# FROM node:18.20-alpine AS runtime-stage

# 创建工作目录
RUN mkdir -p /app
WORKDIR /app

# 复制构建阶段生成的输出到运行时阶段
# FROM nginx:mainline
FROM nginx:stable-alpine-slim
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build-stage /app/.output /app/.output

# 暴露端口
EXPOSE 9097

```

### dockerignore

`.dockerignore`:

```text
node_modules
Dockerfile*
.git
.gitignore

__service
.output
.data
.nuxt.nitro
.cache
dist

logs
*.log

.DS_Store
.fleet
.idea

# nginx/log
nginx/**/log

```

### Make

`Makefile`:

```yml
# 镜像 node:18.20-alpine
.PHONY: pull-node
pull-node:
	@if ! docker images --filter reference=node:18.20-alpine --quiet | grep -q .; then \
		echo "Pulling node:18.20-alpine image..."; \
		docker pull node:18.20-alpine; \
	else \
		echo "Docker image 'node:18.20-alpine' already exists."; \
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

# 清除前端服务悬空镜像（正式环境）
.PHONY: prune
prune:
	@if docker images -f "dangling=true" --filter "label=com.docker.compose.service=aegis.website" --quiet | grep -q .; then \
		dangling_images=$$(docker images -f "dangling=true" --filter "label=com.docker.compose.service=aegis.website" --quiet); \
		if [ -n "$$dangling_images" ]; then \
			echo "Dangling images was found in service aegis.website:"; \
			echo $$dangling_images; \
			docker rmi $$dangling_images; \
		else \
			echo "No dangling images was found in service aegis.website."; \
		fi \
	else \
		echo "No dangling images was found in service aegis.website."; \
	fi

# 清除前端服务悬空镜像（测试环境）
.PHONY: prune-test
prune-test:
	@if docker images -f "dangling=true" --filter "label=com.docker.compose.service=aegis.website.test" --quiet | grep -q .; then \
		dangling_images=$$(docker images -f "dangling=true" --filter "label=com.docker.compose.service=aegis.website.test" --quiet); \
		if [ -n "$$dangling_images" ]; then \
			echo "Dangling images was found in service aegis.website.test:"; \
			echo $$dangling_images; \
			docker rmi $$dangling_images; \
		else \
			echo "No dangling images was found in service aegis.website.test."; \
		fi \
	else \
		echo "No dangling images was found in service aegis.website.test."; \
	fi

# 清除邮件服务悬空镜像
.PHONY: prune-mailer
prune-mailer:
	@if docker images -f "dangling=true" --filter "label=com.docker.compose.service=aegis.website.mailer" --quiet | grep -q .; then \
		dangling_images=$$(docker images -f "dangling=true" --filter "label=com.docker.compose.service=aegis.website.mailer" --quiet); \
		if [ -n "$$dangling_images" ]; then \
			echo "Dangling images was found in service aegis.website.mailer:"; \
			echo $$dangling_images; \
			docker rmi $$dangling_images; \
		else \
			echo "No dangling images was found in service aegis.website.mailer."; \
		fi \
	else \
		echo "No dangling images was found in service aegis.website.mailer."; \
	fi

# 运行前端（正式环境）
.PHONY: run-fe
run-fe: pull-node pull-nginx prune
	docker-compose down
	docker-compose up --force-recreate --build --remove-orphans -d

# 运行前端（测试环境）
.PHONY: run-fe-test
run-fe-test: pull-node pull-nginx prune-test
	docker-compose -f docker-compose.test.yml down
	docker-compose -f docker-compose.test.yml up --force-recreate --build --remove-orphans -d

# 运行后端
.PHONY: run-be
run-be: pull-node prune-mailer
	docker-compose -f __service/docker-compose.yml down
	docker-compose -f __service/docker-compose.yml up --force-recreate --build --remove-orphans -d

# 运行前后端（测试环境）
.PHONY: run-all-test
run-all-test: run-fe-test run-be

# 运行前后端（正式环境）
.PHONY: run-all
run-all: run-fe run-be
```

通过 `docker images --filter` 判断，[参考](https://docs.docker.com/config/filter/)

```yml
.PHONY: check-node
check-node:
	@if ! docker images --filter reference=node:18.20-alpine --quiet | grep -q .; then \
		echo "Docker image 'node:18.20-alpine' does not exist."; \
	else \
		echo "Docker image 'node:18.20-alpine' exists."; \
	fi
```

也可以通过 `docker images --format` 更改默认输出格式，[参考](https://docs.docker.com/config/formatting/)，再使用 `grep`

```bash
# docker images --format 'table {{.ID}}\t{{.Repository}}\t{{.Tag}}'
IMAGE ID       REPOSITORY                  TAG
0ecb6a08e0df   aegis.website.test          latest
175ff0574e4c   <none>                      <none>
bfe814bd9915   <none>                      <none>
0e27a1a06a9b   <none>                      <none>
7697720a1b58   aegis.website.mailer        latest
b430f596d217   node                        18.20-alpine
ee5112eafd25   nginx                       stable-alpine-slim

# docker images --format 'table {{.Repository}}:{{.Tag}}'
REPOSITORY:TAG
aegis.website.test:latest
<none>:<none>
<none>:<none>
<none>:<none>
aegis.website.mailer:latest
node:18.20-alpine
nginx:stable-alpine-slim
```

`docker images --format 'table {{.Repository}}:{{.Tag}}' | grep -q "\bnginx:stable-alpine-slim\b"`

### 多环境部署

需要考虑多种部署环境，如：测试环境、预发布环境、生产环境等

定义 `docker-compose.test.yml`，用于在测试环境中使用`docker-compose`命令时，指定该文件构建

`docker-compose.test.yml`文件中可以指定使用的 dockerfile：

```yml
version: '3'
services:
  aegis.website.test:
    container_name: aegis.website.test
    image: aegis.website.test
    build:
      context: ./
      dockerfile: Dockerfile-test
    restart: always
    ports:
      - '9097:9097'
    working_dir: /app/.output/public
    volumes:
      - ./nginx/test/default.conf:/etc/nginx/conf.d/default.conf
      - ./nginx/log:/var/log/nginx
    networks:
      - test

networks:
  test:
    driver: bridge
    driver_opts:
      com.docker.network.driver.mtu: 1452
```
