[返回目录](/blog/java/spring-boot/index.md)

# 9、SpringBoot多环境开发

- 多环境开发yaml
- 多环境开发properties
- 多环境开发控制

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

## 多环境分组管理

根据`功能`对配置文件中的信息进行拆分，并制作成独立的配置文件，命名规则如下

```
application.yml
application-dev.yml
application-devDB.yml
application-devMVC.yml
application-devRedis.yml
```

使用`include`加载多个配置

```yaml
# application.yml
spring:
  profiles:
    active: dev
    include: devMVC, devDB
```

顺序：后加载覆盖先加载，主文件最后加载

使用`group`替代`include`设置配置文件分组

```yaml
# application.yml
spring:
  profiles:
    active: dev
    group: 
        dev: devMVC, devDB
        pro: proMVC, proDB
        test: testMVC, testDB
```


## 多环境开发控制

Maven与SpringBoot多环境兼容

maven配置多环境属性

```yaml
<profiles>
    <!--开发环境-->
    <profile>
        <id>development</id>

        <properties>
            <profile.active>dev</profile.active>
        </properties>

        <!--默认激活-->
        <activation>
            <activeByDefault>true</activeByDefault>
        </activation>

    </profile>

    <!--生产环境-->
    <profile>
        <id>production</id>
        <properties>
            <profile.active>dev</profile.active>
        </properties>
    </profile>

    <!--测试环境-->
    <profile>
        <id>test</id>
        <properties>
            <profile.active>test</profile.active>
        </properties>
    </profile>
</profiles>
```

application.yml引入Maven属性

```yaml
spring:
  profiles:
    active: @profile.active@ # 引入Maven属性
```

maven打包后会替换为具体的环境配置名

```yaml
spring:
  profiles:
    active: dev
```

> 注意：Idea如果不能识别pom.xml配置，可以尝试执行compile，或者刷新maven



