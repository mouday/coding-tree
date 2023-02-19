[返回目录](/blog/microservices/index)

# nacos注册中心

文档

- [https://nacos.io/zh-cn/index.html](https://nacos.io/zh-cn/index.html)
- [https://github.com/alibaba/nacos](https://github.com/alibaba/nacos)

## 认识和安装Nacos

官网简介：一个更易于构建云原生应用的动态服务发现、配置管理和服务管理平台。

下载页面

- [https://github.com/alibaba/nacos/releases/tag/1.4.1](https://github.com/alibaba/nacos/releases/tag/1.4.1)

下载安装

```bash
# 使用加速下载
wget https://ghproxy.com/https://github.com/alibaba/nacos/releases/download/1.4.1/nacos-server-1.4.1.tar.gz

# 解压
tar -zxvf nacos-server-1.4.1.tar.gz

# 启动命令(standalone代表着单机模式运行，非集群模式)
sh ./bin/startup.sh -m standalone

# 关闭服务器
sh shutdown.sh

# 查看日志
tail -f ./logs/start.out
```

管理后台

- web地址：[http://localhost:8848/nacos/](http://localhost:8848/nacos/)
- 账号：nacos
- 密码：nacos

## Nacos快速入门


1、父工程的pom文件中中引入SpringCloudAlibaba的依赖：

```xml
<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>com.alibaba.cloud</groupId>
            <artifactId>spring-cloud-alibaba-dependencies</artifactId>
            <version>2.2.6.RELEASE</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>
```

2、在子模块pom文件中引入nacos客户端依赖：

```xml
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
</dependency>
```


3、子模块配置文件application.yml中添加nacos服务配置

```yaml
spring:
  # nacos 服务地址
  cloud:
    nacos:
      server-addr: localhost:8848

```

4、注释掉eureka的依赖和配置

5、重启子项目

## Nacos服务分级存储模型

## Nacos环境隔离