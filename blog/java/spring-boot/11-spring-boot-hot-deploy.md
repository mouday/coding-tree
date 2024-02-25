[返回目录](/blog/java/spring-boot/index.md)

# 11、SpringBoot热部署

## 手动启动热部署

1、引入依赖

```xml
<!--热部署-->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-devtools</artifactId>
    <optional>true</optional>
</dependency>
```

2、激活热部署

修改完代码，需要重新构建项目

默认快捷键：`Ctrl + F9`

3、关于热部署

- 重启 restart 开发者自定义的开发资源(热部署)
- 重载 reload jar包

## 自动启动热部署

第一步：配置自动构建项目

1、IDEA 打开设置: Preferences 

2、选择 Build,Execution,Deployment 

3、选择 Compiler

4、勾选 Build project automatically


第二步：配置允许自动编译

1、IDEA 打开 Maintenance

快捷键 (一起按下四个按键)

```
windows: Ctrl + Shift +Alt + /
Mac : command + shift + option + /
```

2、选择 `1.Register`

3、勾选 compiler.automake.allow.when.app.running

第三步：激活自动构建

修改代码，IDEA失去焦点，大约5秒后，代码会自动构建

## 热部署范围配置

默认不触发重启的目录列表

```
/META-INF/maven
/META-INF/resources
/resources
/static
/public
/templates
```

设置不参与热部署的文件或文件夹

```yaml
spring:
  devtools:
    restart:
      exclude: /static/**,/public/**
```

## 关闭热部署

```yaml
spring:
  devtools:
    restart:
      enabled: false
```

设置高优先级的属性禁用热部署

```java
package com.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class Application {

    public static void main(String[] args) {
        System.setProperty("spring.devtools.restart.enabled", "false");
        SpringApplication.run(Application.class);
    }
}
```