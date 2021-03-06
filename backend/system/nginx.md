---
title: Nginx
group:
  title: Web服务器
  order: 3
---

## Nginx简介

轻量级、高性能的 Web 服务器，在现今的大型应用、网站基本都离不开 Nginx，已经成为了一项必选的技术；其实可以把它理解成 **入口网关**，这里我举个例子可能更好理解:

> 当你去银行办理业务时，刚走进银行，需要到入门处的机器排队取号，然后按指令到对应的柜台办理业务，或者也有可能告诉你，今天不能排号了，回家吧！
>
> 这样一个场景中，**取号机器就是 Nginx(入口网关)**。一个个柜台就是我们的业务服务器(办理业务)；银行中的保险箱就是我们的数据库(存取数据)；🤣

![](./nginx-entry.png)

### 特点

- 轻量级，配置方便灵活，无侵入性；
- 占用内存少，启动快，性能好；
- 高并发，事件驱动，异步；
- 热部署，修改配置热生效；

### 架构模型

- 基于 **socket 与 Linux epoll (I/O 事件通知机制)**，实现了 **高并发**；
- 使用模块化、事件通知、回调函数、计时器、轮询实现非阻塞的异步模式；
- 磁盘不足的情况，可能会导致阻塞；
- **Master-worker 进程模式**:
  - Nginx 启动时会在内存中常驻一个 **Master 主进程**，功能:
    - 读取配置文件；
    - 创建、绑定、关闭 socket；
    - 启动、维护、配置 worker 进程；
    - 编译脚本、打开日志；
  - master 进程会开启配置数量的 **worker 进程**，比如根据 CPU 核数等:
    - 利用 socket 监听连接，不会新开进程或线程，节约了创建与销毁进程的成本；
    - 检查网络、存储，把新连接加入到轮询队列中，异步处理；
    - 能有效利用 cpu 多核，并避免了线程切换和锁等待；
- **热部署模式**:
  - 当我们修改配置热重启后，master 进程会以新的配置新创建 worker 进程，新连接会全部交给新进程处理；
  - 老的 worker 进程会在处理完之前的连接后被 kill 掉，逐步全替换成新配置的 worker 进程；

### 配置

- 官网下载；
- 配置文件路径： `/usr/local/etc/nginx/nginx.conf`；
- 启动: 终端输入 `nginx`，访问 `localhost:8080` 就能看到 `Welcome...`；
- `nginx -s stop`: 停止服务；
- `nginx -s reload`: 热重启服务；
- 配置代理: `proxy_pass`
- 在配置文件中配置即可完成；


```js
server {
    listen 80;
    location / {
        proxy_pass http://xxx.xxx.xx.xx:3000;
    }
}
```

## 常用场景

### 代理

其实 Nginx 可以算一层 **代理服务器**，将客户端的请求处理一层后，再转发到业务服务器，这里可以分成两种类型，其实实质就是 **请求的转发**，使用 Nginx 非常合适、高效；

### 正向代理

- 即用户通过访问这层正向代理服务器，再由代理服务器去到原始服务器请求内容后，再返回给用户；
- 例如我们常使用的 VPN 就是一种常见的正向代理模式。通常我们无法直接访问谷歌服务器，但是通过访问一台国外的服务器，再由这台服务器去请求谷歌返回给用户，用户即可访问谷歌；

**特点**
- 代理服务器属于 **客户端层**，称之为正向代理；
- 代理服务器是 **为用户服务**，对于用户是透明的，用户知道自己访问代理服务器；
- 对内容服务器来说是 **隐藏** 的，内容服务器并无法分清访问是来自用户或者代理；

![](./nginx-forward.png)

### 反向代理

用户访问头条的反向代理网关，通过网关的一层处理和调度后，再由网关将访问转发到内部的服务器上，返回内容给用户；

**特点**

- 代理服务器属于 **服务端层**，因此称为反向代理。通常代理服务器与内部内容服务器会隶属于同一内网或者集群；
- 代理服务器是 **为内容服务器服务** 的，对用户是隐藏的，用户不清楚自己访问的具体是哪台内部服务器；
- 能有效保证内部服务器的 **稳定与安全**；

![](./nginx-reverse.png)

- **反向代理的好处**:

  - **安全与权限**:
    - 用户访问必须通过反向代理服务器，也就是便可以在做这层做统一的请求校验，过滤拦截不合法、危险的请求，从而就能更好的保证服务器的安全与稳定；
  - **负载均衡**: 能有效分配流量，最大化集群的稳定性，保证用户的访问质量；

### 负载均衡

- 负载均衡是基于反向代理下实现的一种 **流量分配** 功能，目的是为了达到服务器资源的充分利用，以及更快的访问响应；
- 其实很好理解，还是以上面银行的例子来看: **通过门口的取号器，系统就可以根据每个柜台的业务排队情况进行用户的分，使每个柜台都保持在一个比较高效的运作状态，避免出现分配不均的情况**；
- 由于用户并不知道内部服务器中的队列情况，而反向代理服务器是清楚的，因此通过 Nginx，便能很简单地实现流量的均衡分配；
- Nginx 实现: `Upstream`模块， 这样当用户访问 `http://xxx` 时，流量便会被按照一定的规则分配到`upstream`中的 3 台服务器上；

```js
http {
    upstream xxx {
        server 1.1.1.1:3001;
        server 2.2.2.2:3001;
        server 3.3.3.3:3001;
    }
    server {
        listen 8080;
        location / {
            proxy_pass http://xxx;
        }
    }
}
  ```
**分配策略**

- **服务器权重(`weight`)**:

  - 可以为每台服务器配置访问权重，传入参数`weight`，例如:

  ```js
    upstream xxx {
        server 1.1.1.1:3001 weight=1;
        server 2.2.2.2:3001 weight=1;
        server 3.3.3.3:3001 weight=8;
    }
  ```

- **时间顺序(默认)**: 按用户的访问的顺序逐一的分配到正常运行的服务器上；
- **连接数优先(`least_conn`)**: 优先将访问分配到列表中连接数队列最短的服务器上；
- **响应时间优先(`fair`)**: 优先将访问分配到列表中访问响应时间最短的服务器上；
- **ip_hash**: 通过 ip_hash 指定，使每个 ip 用户都访问固定的服务器上，有利于用户特异性数据的缓存，例如本地 session 服务等；
- **url_hash**: 通过 url_hash 指定，使每个 url 都分配到固定的服务器上，有利于缓存；

## Nginx 对于前端的作用

### 快速配置静态服务器

当访问 `localhost:80` 时，就会默认访问到 `/Users/files/index.html`；

```js
server {
  listen 80;
  server_name localhost;

  location / {
    root   /Users/files;
    index  index.html;
  }
}
```

### 访问限制

可以制定一系列的规则进行访问的控制，例如直接通过 ip 限制:

```js
# 屏蔽 192.168.1.1 的访问；
# 允许 192.168.1.2 ~ 10 的访问；
location / {
      deny  192.168.1.1;
      allow 192.168.1.2/10;
      deny  all;
  }
```

### 解决跨域

其实跨域是 **浏览器的安全策略**，这意味着只要不是通过浏览器，就可以绕开跨域的问题。所以只要通过在同域下启动一个 Nginx 服务，转发请求即可；

```js
location ^~/api/ {
      # 重写请求并代理到对应域名下
      rewrite ^/api/(.*)$ /$1 break;
      proxy_pass https://www.cross-target.com/;
  }
```

### 图片处理

通过 ngx_http_image_filter_module 这个模块，可以作为一层图片服务器的代理，在访问的时候 **对图片进行特定的操作，例如裁剪，旋转，压缩等**；

### 本地代理

绕过白名单限制: 例如我们在接入一些第三方服务时经常会有一些域名白名单的限制，如果我们在本地通过`localhost`进行开发，便无法完成功能。这里我们可以做一层本地代理，便可以直接通过指定域名访问本地开发环境；

```js
server {
  listen 80;
  server_name www.toutiao.com;
  location / {
    proxy_pass http://localhost:3000;
  }
}
```

### 配置SSL证书

* 在相应证书机构进行证书申请及下载(阿里云&腾讯云)
* 将证书文件 `xxx.pem` 和 `xxx.key`文件拷贝到`/etc/ssl/`目录下

```bash
    server {
        listen       443 ssl http2 default_server;
        listen       [::]:443 ssl http2 default_server;
        server_name  api.yiketiandi.com;
        root         /usr/share/nginx/html;

        ssl_certificate "/etc/ssl/1_api.yiketiandi.com_bundle.crt";
        ssl_certificate_key "/etc/ssl/2_api.yiketiandi.com.key";
        ssl_session_cache shared:SSL:1m;
        ssl_session_timeout  10m;
        ssl_ciphers HIGH:!aNULL:!MD5;
        ssl_prefer_server_ciphers on;

        # Load configuration files for the default server block.
        include /etc/nginx/default.d/*.conf;

        location / {
        }

        error_page 404 /404.html;
            location = /40x.html {
        }

        error_page 500 502 503 504 /50x.html;
            location = /50x.html {
        }
    }
# http映射到https
    server{
        listen 80;
        server_name idrex.net;
        rewrite ^/(.*)$ https://idrex.net:443/$1 permanent;
    }
```
