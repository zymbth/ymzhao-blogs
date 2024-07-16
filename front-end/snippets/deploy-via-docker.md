---
description: docker部署前端项目
head:
  - - meta
    - name: keywords
      content: 前端,部署,docker,nginx
---

# docker部署前端项目

docker自动打包构建，将构建产物复制到容器工作目录。另外，nginx配置也拷贝至容器nginx目录下

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
  your.server.name:
    container_name: your.server.name
    image: your.server.name
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

# 清除本服务悬空镜像
.PHONY: prune
prune:
	@if docker images -f "dangling=true" --filter "label=com.docker.compose.service=your.server.name" --quiet | grep -q .; then \
		dangling_images=$$(docker images -f "dangling=true" --filter "label=com.docker.compose.service=your.server.name" --quiet); \
		if [ -n "$$dangling_images" ]; then \
			echo "Dangling images was found in service your.server.name:"; \
			echo $$dangling_images; \
			docker rmi $$dangling_images; \
		else \
			echo "No dangling images was found in service your.server.name."; \
		fi \
	else \
		echo "No dangling images was found in service your.server.name."; \
	fi

# 运行
.PHONY: run-fe
run-fe: pull-node16 pull-nginx prune
	docker-compose down
	docker-compose up --force-recreate --build --remove-orphans -d

```

:::