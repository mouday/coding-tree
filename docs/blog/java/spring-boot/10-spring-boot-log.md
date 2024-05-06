[返回目录](/blog/java/spring-boot/index.md)

# 10、SpringBoot日志

- 日志基础
- 日志输出格式控制
- 日志文件


## 日志基础

1、日志log的作用

- 开发环境调试代码
- 生产环境记录信息

2、使用日志

```java
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

private static final Logger log = LoggerFactory.getLogger(UserController.class);

// 4种常用的日志级别（一共有6中级别）
log.debug("debug");
log.info("info"); // 默认级别
log.warn("warn");
log.error("error");
```

3、设置日志输出级别

application.yml

方式一：开启调试模式

```yaml
# 开启调试模式
debug: true

```

方式二：所有包的调试信息

```yaml
# 所有包的调试信息（范围更大）
logging:
  level:
    root: debug
```

方式三：设置单个包的日志级别

```yaml
logging:
  level:
    # 设置单个包的日志级别
    com.demo.controller: debug
```

方式三：设置分组日志级别（推荐）

```yaml
logging:
  # 定义分组，多个包名逗号分隔
  group:
    controller: com.demo.controller
  # 设置分组日志级别
  level:
    controller: debug
```

4、抽取公共变量log

方式一：使用继承

定义基类

```java
package com.demo.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class BaseController {
    public Logger log;

    public BaseController() {
        this.log = LoggerFactory.getLogger(this.getClass());
    }
}


继承基类

```java
package com.demo.controller;

public class UserController extends BaseController {
    
}
```

方式二：使用注解 `@Slf4j`

引入依赖

```xml
<!--lombok-->
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
</dependency>
```

使用注解`@Slf4j`

```java
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class UserController{}
```

## 日志输出格式控制

默认格式

```
时间 日志级别 PID 所属线程 所属类/接口名 日志信息
```

日志格式

```yaml
logging:
  pattern:
    console: "%d %clr(%5p) -- [%16t] %clr(%-40.40c){cyan} : %m %n"
```

说明
- `%d` 日期
- `%m` 消息
- `%n` 换行


## 日志文件

日志输出到文件

```yaml
logging:
  file:
    name: "server.log"
```

设置滚动日志

```yaml
logging:
  logback:
    rollingpolicy:
      max-file-size: 4KB
      file-name-pattern: ${LOG_FILE}%d{yyyy-MM-dd}.%i.log
```
