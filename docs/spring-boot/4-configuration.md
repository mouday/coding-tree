[返回目录](/blog/java/spring-boot/index.md)

# 4、SpringBoot配置管理-application.yml

## 复制工程

- 保留工程基础结构
- 抹掉原始工程痕迹

## SpringBoot默认配置文件

src/main/resources/application.properties

```bash
# 修改服务器端口
server.port=8081

# 关闭banner
spring.main.banner-mode=off

# 设置日志级别
logging.level.root=debug
```

通用的配置属性：[https://docs.spring.io/spring-boot/docs/2.7.18/reference/html/application-properties.html](https://docs.spring.io/spring-boot/docs/2.7.18/reference/html/application-properties.html)


## SpringBoot配置文件格式

3种配置文件格式

1、application.properties（传统，默认）

```bash
# 修改服务器端口
server.port=8081
```

2、application.yml（推荐）

```yaml
# 修改服务器端口
server:
  port: 8082
```

3、application.yaml

```yaml
# 修改服务器端口
server:
  port: 8083
```

如果同时存在3种配置文件，优先级（由高到低）：

```
application.properties（最高）
application.yml
application.yaml （最低）
```

## 自动提示配置

如果yaml文件没有配置提示，可以设置项目的配置文件

添加路径

```
Project Structure 
-> Project Settings 
-> Facets 
-> Spring 
-> Configuration Files
```

## yaml语法

Yaml 一种数据序列化格式

### YAML文件扩展名

- yml（主流）
- yaml

### yaml语法规则

- 大小写敏感

- 属性层级关系使用多行描述，每行结尾使用冒号结束

- 使用缩进表示层级关系，同层级左侧对齐，只允许使用空格(不允许使用Tab键)

- 属性值前面添加空格(属性名与属性值之间使用`冒号+空格`作为分隔)

- `#`表示注释

核心规则：数据前面要加空格与冒号隔开

yaml示例

``yaml
# 数字
port: 8080

# 字符串
city: beijing

# 对象
user:
  name: Tom
  age: 20


# 数组(写法一)
likes:
  - game
  - music
  - sleep

# 数组(写法二)
likes: [game, music, sleep]


# 对象数组(写法一)
users:
  - name: Tom
    age: 18
  - name: Jack
    age: 20

# 对象数组(写法二)
users:
  - 
    name: Tom
    age: 18
  - 
    name: Jack
    age: 20

# 对象数组(写法三)
users: [{name:Tom,age:18},{name:Jack,age:20}]
```

字面值表示方式

```yaml
boolean: TRUE          # TRUE,true,True,FALSE,false,False 都可以
float: 3.14            # 支持科学计数法 3.14e+5
int: 123               # 支持二进制、八进制、十六进制 0b000_1111_1010_1110
null: ~                 # ~表示null
string: HelloWorld      # 直接书写字符串
string: "Hello World"   # 可以使用双引号包裹特殊字符串
date: 2024-10-20        # 日期必须使用yyyy-MM-dd格式
datetime: 2024-10-20T10:20:02+08:00 # 带有时区
```

### 其他常见数据格式

xml

```xml
<user>
    <name>Tom</name>
    <age>20</age>
</user>
```

properties

```bash
user.name=Tom
user.age=20
```


## yaml数据读取

### 读取单个数据

```yaml
server:
  port: 8082
```

读取方式(SpEL)

```java
import org.springframework.beans.factory.annotation.Value;

// @Value("${一级属性名.二级属性名}")
@Value("${server.port}")
private Integer port;
```

### 引用数据

使用`${属性名}`引用数据

```yaml
server:
  port: 8081

# 引用数据
server-address: http://localhost:${server.port}
```

```java
// 读取结果：http://localhost:8081
@Value("${server-address}")
private String serverAddress;
```

使用双引号包裹的字符串可以转义字符

### 使用Environment封装全部配置信息

```java
// 1、封装所有配置信息
import org.springframework.core.env.Environment;

@Autowired
private Environment environment;

// 2、读取单个配置信息
environment.getProperty("server.port");
```

### 按照前缀读取配置信息

```yaml
person:
  name: Tom
  age: 20
```

```java
package com.example.demo;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Data
@Component
@ConfigurationProperties(prefix = "person")
public class PersonConfig {
    private String name;
    private Integer age;
}

```