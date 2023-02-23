
[返回目录](/blog/microservices/index)

# Nacos配置管理

## 1、统一配置管理

1.1、在nacos中添加配置文件

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

1.2、从微服务拉取配置

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


## 配置热更新

方式一：`@RefreshScope`

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

方式二：`@ConfigurationProperties`

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

## 配置共享

## 搭建Nacos集群


