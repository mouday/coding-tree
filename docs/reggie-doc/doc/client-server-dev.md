# 前后端分离开发

- 前后端分离开发
- Yapi
- Swagger
- 项目部署

## 前后端分离开发

### 介绍

- 前端开发人员负责前端代码
- 后端开发人员负责后端代码

```bash
Java代码、html、css、js

拆分 =>

后端工程 java          => 打包部署 Tomcat
前端工程 html、css、js  => 打包部署 Nginx
```

### 开发流程

```
定制接口API（请求路径、请求方式、请求参数、响应数据）【关键步骤】

前端开发（mock） <= 并行开发 => 后端开发

联调

提测
```

### 前端技术栈

开发工具

- Visual Studio Code
- HBuilder

技术框架

- Nodejs
- Vuejs
- ElementUI
- Mock
- Webpack

## Yapi

介绍

高效易用API管理平台

- https://github.com/YMFE/yapi
- http://yapi.smart-xwork.cn/

使用

## Swagger

[Swagger](blog/reggie-doc/doc/swagger.md)

## 项目部署

部署架构

```
客户端 Browser
服务端 Nginx 反向代理
业务层 Tomcat、JDK、Git、Maven、jar包
数据层 Redis MySQL
```

nginx.conf配置文件

```bash
server{
    listen 80;
    server_name localhost;

    # 前端资源
    location / {
        root www
        index index.html
    }

    # 反向代理接口
    location ^~ /api/ {
        rewrite ^/api/(.*)$ /$1 break;
        proxy_pass http://192.168.0.2:8080
    }
}
```

运行环境

```bash
java -v
mvn -v
git -v
```
