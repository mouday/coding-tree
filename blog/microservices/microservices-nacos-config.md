
[返回目录](/blog/microservices/index)

# Nacos配置管理

## 一、统一配置管理

### 1.1、在nacos中添加配置文件

Nacos管理后台【配置管理】/【配置列表】/【新建配置】

Data ID： 服务名称-当前环境.文件后缀

eg: 

```
userservice-dev.yml
```

配置内容

```yaml
pattern:
    dateformat: yyyy-MM-dd HH-mm-ss
```

注意：需要热更新的配置才放到nacos管理

### 1.2、从微服务拉取配置

1）引入nacos-config依赖
```xml
<!--nacos配置管理依赖-->
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-nacos-config</artifactId>
</dependency>
```


2）添加bootstrap.yml

```yaml
spring:
  application:
    name: userservice # 服务名称
  profiles:
    active: dev #开发环境，这里是dev 
  cloud:
    nacos:
      server-addr: localhost:8848 # Nacos地址
      config:
        file-extension: yml # 文件后缀名
```

文件id
```
${spring.application.name}-${spring.profiles.active}.${spring.cloud.nacos.config.file-extension}
```

3）读取nacos配置

```java
package cn.itcast.user.web;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@RestController
public class TimeController {

    @Value("${pattern.dateformat}")
    private String dateFormat;

    @GetMapping("/now")
    public String getNow(){
        return LocalDateTime.now().format(DateTimeFormatter.ofPattern(this.dateFormat));
    }
}

```


## 二、配置热更新

### 方式一：`@RefreshScope`

```java
package cn.itcast.user.web;

import cn.itcast.user.config.PatternProperties;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@RestController
@RefreshScope
public class TimeController {

    // pattern.dateformat
    @Value("${pattern.dateformat}")
    private String dateFormat;

    @GetMapping("/now")
    public String getNow(){
        return LocalDateTime.now().format(DateTimeFormatter.ofPattern(this.dateFormat));
    }
}
```

### 方式二：`@ConfigurationProperties`

```java
package cn.itcast.user.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@Data
@ConfigurationProperties(prefix = "pattern")
public class PatternProperties {

    private String dateFormat;
}

```

使用配置

```java
package cn.itcast.user.web;

import cn.itcast.user.config.PatternProperties;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@RestController
@RefreshScope
public class TimeController {

    @Autowired
    private PatternProperties patternProperties;

    @GetMapping("/now")
    public String getNow(){
        return LocalDateTime.now().format(DateTimeFormatter.ofPattern(patternProperties.getDateFormat()));
    }
}
```

## 三、配置共享


- 与环境无关：`[spring.application.name].yaml` 共享配置
- 与环境有关：`[spring.application.name]-[spring.profiles.active].yaml`

配置文件优先级

```
服务名-profile.yaml > 服务名.yaml > 本地配置
```

## 四、搭建Nacos集群

集群结构图

![](img/nacos-cluster.png)

| 节点   | ip            | port |
| ------ | ------------- | ---- |
| nacos1 | 127.0.0.1 | 8845 |
| nacos2 | 127.0.0.1 | 8846 |
| nacos3 | 127.0.0.1 | 8847 |


搭建集群的基本步骤：

- 搭建数据库，初始化数据库表结构
- 配置nacos
- 启动nacos集群
- nginx反向代理

### 1、搭建数据库，初始化数据库表结构

建库

```sql
create database nacos_config;
```

建表语句 config/nacos-mysql.sql

### 2、配置nacos

修改 conf/cluster.conf
```bash
cp conf/cluster.conf.example conf/cluster.conf

#example
127.0.0.1:8848
127.0.0.1:8858
127.0.0.1:8868
```

修改nacos配置

conf/application.properties
```bash
spring.datasource.platform=mysql

db.num=1

db.url.0=jdbc:mysql://127.0.0.1:3306/nacos_config?characterEncoding=utf8&connectTimeout=1000&socketTimeout=3000&autoReconnect=true&useUnicode=true&useSSL=false&serverTimezone=UTC
db.user.0=root
db.password.0=123456
```

### 3、启动集群的三个nacos节点


复制三份 nacos-server

config/application.properties

```bash
# nacos-server-node1
server.port=8845

# nacos-server-node2
server.port=8846

# nacos-server-node3
server.port=8847
```

分别启动三个节点

```bash
$ ./startup.sh

# 查看启动日志
$ tail -f /logs/start.out

Nacos started successfully in cluster mode. use external storage
```

### 4、nginx反向代理

nacos-cluster.conf

```bash
upstream nacos-cluster {
    server 127.0.0.1:8848;
	server 127.0.0.1:8858;
	server 127.0.0.1:8868;
}

server {
    listen       80;
    server_name  localhost;

    location /nacos {
        proxy_pass http://nacos-cluster;
    }
}
```

浏览器访问：http://localhost/nacos

代码中application.yml文件配置如下：

```yaml
spring:
  cloud:
    nacos:
      server-addr: localhost:80 # Nacos地址
```