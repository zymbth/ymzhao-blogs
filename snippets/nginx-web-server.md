---
description: 最佳实践：使用 nginx 为多个前端项目搭建web服务器
head:
  - - meta
    - name: keywords
      content: nginx,web server,web服务器,最佳实践
created: '2025-09-01'
---

# 最佳实践：使用 nginx 为多个前端项目搭建web服务器

## 介绍

最佳实践：使用 nginx 为多个前端项目搭建web服务器。

详细nginx配置，防火墙、文件权限、日志等配置请自行查阅。

## 项目

项目目录：

<div class="code-JetBrains"/>

```text
/home/ubuntu/
├─ project1/
└─ project2/
```

项目各自首页：`/dist/index.html`

域名：`example.com`，项目1：`site1.example.com`，项目2：`site2.example.com`

## nginx配置

为每个项目创建独立的配置文件，放在 `/etc/nginx/sites-available/` 目录下，并创建软链接到 `/etc/nginx/sites-enabled/` 下。

nginx.conf 配置文件中将 `sites-enabled` 目录下的配置文件引入。

下面使用两个网站作为示范，项目2使用ssl证书，可使用https访问。

<div class="code-JetBrains"/>

::: code-group

```text [目录结构]
/etc/nginx/ # nginx目录
├─ sites-available
│  ├─ site1.example.com.conf
│  └─ site2.example.com.conf
├─ sites-enabled
│  ├─ site1.example.com.conf # ./sites-available/site1.example.com.conf 的软链接
│  └─ site2.example.com.conf # ./sites-available/site2.example.com.conf 的软链接
├─ example.com.key # ssl证书
├─ example.com.pem # ssl证书
└─ nginx.conf
```

```nginx{18} [nginx.conf]
http {
	sendfile on;
	tcp_nopush on;
	types_hash_max_size 2048;

	include /etc/nginx/mime.types;
	default_type application/octet-stream;

	ssl_protocols TLSv1 TLSv1.1 TLSv1.2 TLSv1.3; # Dropping SSLv3, ref: POODLE
	ssl_prefer_server_ciphers on;

	access_log /var/log/nginx/access.log;
	error_log /var/log/nginx/error.log;

	gzip on;

	include /etc/nginx/conf.d/*.conf;
	include /etc/nginx/sites-enabled/*;
}
```

```nginx [site1.example.com.conf]
server {
	listen 8000;
	listen [::]:8000;

	server_name site1.example.com;

	root /home/ubuntu/project1/dist;
	index index.html index.htm;

	location / {
		try_files $uri $uri/ /index.html;
	}
}
```

```nginx{2-6} [site2.example.com.conf]
server {
	listen 443 ssl;
	listen [::]:443 ssl;
	server_name site2.example.com;
	ssl_certificate /etc/nginx/site2.example.com.pem;
	ssl_certificate_key /etc/nginx/site2.example.com.key;
	ssl_session_cache shared:SSL:1m;
	ssl_session_timeout 10m;
	ssl_ciphers HIGH:!aNULL:!MD5;
	ssl_prefer_server_ciphers on;

	root /home/ubuntu/site2/dist;

	location / {
		index index.html index.htm;
		try_files $uri $uri/ /index.html;
	}
}

server {
	listen 80;
	listen [::]:80;

	server_name site2.example.com;

	# rewrite ^(.*) https://$server_name$1 permanent;

	root /home/ubuntu/site2/dist;
	index index.html index.htm;

	location / {
		try_files $uri $uri/ /index.html;
	}
}
```

:::
