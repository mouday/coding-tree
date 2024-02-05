[返回目录](/blog/java/spring-boot/index.md)

# 9、SpringBoot多环境开发

多环境开发yaml
多环境开发properties
多环境开发控制

## 多环境开发yaml

区分开发、测试、生产环境

### 单文件配置多环境开发

使用`---` 区分环境，设置环境边界

application.yml

```yaml
# 配置环境
spring:
  profiles:
    active: test # 指定启动环境

# 其他公共配置

---
# 生产环境
spring:
  profiles: pro

server:
  port: 8080

---

# 开发环境
spring:
  profiles: dev

server:
  port: 8081

---

# 测试环境
spring:
  profiles: test

server:
  port: 8082

```

新的配置方式

```yaml
# 过时方式
spring:
  profiles: pro

# 新的方式
spring:
  config:
    activate:
      on-profile: pro

```

### 多文件配置多环境开发

文件命名格式：`application-{profile}.yml`

目录下的4个文件

```
application.yml
application-dev.yml
application-test.yml
application-pro.yml
```

application.yml
```yaml
# 配置环境
spring:
  profiles:
    active: test # 指定启动环境

# 其他公共配置
```

application-dev.yml
```yaml
# 开发环境
server:
  port: 8081
```

application-test.yml
```yaml
# 测试环境
server:
  port: 8082
```

application-pro.yml
```yaml
# 生产环境
server:
  port: 8080
```


## 多环境开发properties

文件命名格式：`application-{profile}.properties`

目录下的4个文件

```
application.properties
application-dev.properties
application-test.properties
application-pro.properties
```

application.properties
```bash
# 配置环境
spring.profiles.active=test # 指定启动环境
# 其他公共配置
```

application-dev.properties
```bash
# 开发环境
server.port=8081
```

application-test.properties
```bash
# 测试环境
server.port=8082
```

application-pro.properties
```bash
# 生产环境
server.port=8080
```




## 多环境开发控制
