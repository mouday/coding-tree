# 创建项目

- SpringBoot java SpringMVC RESTful json
- Swagger 接口文档和测试页面生成工具
- 定义统一的结果 让前后端数据通信更规范
- MySQL
- MyBatis-Plus
- Vue.js

## 创建项目

阿里云脚手架：https://start.aliyun.com/

版本：SpringBoot 2.3.7

依赖

```xml
<!-- pom.xml -->
<!-- 使用web -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <!--<artifactId>spring-boot-starter</artifactId>-->
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```

配置文件

application.properties 重命名为 application.yml

```yaml
# application.yml

server:
  port: 8090

sprint:
  applicaiotn:
    # 应用名称
    name: payment-demo

```

定义测试接口

```java
package com.mouday.paymentdemo.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/product")
public class ProductController {

    @GetMapping("/test")
    public String test(){
        return "Hello";
    }
}

```


访问测试

http://localhost:8090/api/product/test


## 引入 swagger

```xml
<!-- Swagger-->
<dependency>
    <groupId>io.springfox</groupId>
    <artifactId>springfox-swagger2</artifactId>
    <version>2.9.2</version>
</dependency>

<!-- Swagger ui-->
<dependency>
    <groupId>io.springfox</groupId>
    <artifactId>springfox-swagger-ui</artifactId>
    <version>2.9.2</version>
</dependency>
```

配置文件

```java
package com.mouday.paymentdemo.config;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

@Configuration
@EnableSwagger2
public class Swagger2Config {

    @Bean
    public Docket docket() {
        return new Docket(DocumentationType.SWAGGER_2)
                .apiInfo(new ApiInfoBuilder().title("微信支付文档").build());
    }
}

```

完善接口配置
```java
package com.mouday.paymentdemo.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Api(tags = "商品管理")
@RestController
@RequestMapping("/api/product")
public class ProductController {

    @ApiOperation("测试接口")
    @GetMapping("/test")
    public String test(){
        return "Hello";
    }
}

```

查看地址：http://localhost:8090/swagger-ui.html


## 引入lombok

```xml
 <!-- lombok -->
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
</dependency>
```

## 定义统一的返回格式

```java
package com.mouday.paymentdemo.vo;

import lombok.Data;

import java.util.HashMap;
import java.util.Map;


@Data
public class Result {

    // 响应码
    private Integer code;

    //响应消息
    private String message;

    //响应数据
    private Map<String, Object> data = new HashMap<>();

    public static Result success() {
        Result result = new Result();
        result.setCode(0);
        result.setMessage("成功");
        return result;
    }

    public static Result error() {
        Result result = new Result();
        result.setCode(-1);
        result.setMessage("失败");
        return result;
    }

    public Result data(String key, Object value) {
        this.data.put(key, value);
        return this;
    }
}

```

使用
```java
package com.mouday.paymentdemo.controller;

import com.mouday.paymentdemo.vo.Result;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;

@Api(tags = "商品管理")
@RestController
@RequestMapping("/api/product")
public class ProductController {

    @ApiOperation("测试接口")
    @GetMapping("/test")
    public Result test(){
        return Result.success().data("now", new Date());
    }
}

```

返回结果
```json
{
  "code": 0,
  "message": "成功",
  "data": {
    "now": "2022-06-12T02:59:15.447+00:00"
  }
}
```

## 引入数据库依赖

```xml
 <!-- mysql -->
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <version>8.0.15</version>
</dependency>

<!-- mybatis-plus -->
<dependency>
    <groupId>com.baomidou</groupId>
    <artifactId>mybatis-plus-boot-starter</artifactId>
    <version>3.3.2</version>
</dependency>
```

创建数据库

```bash
mysql -uroot -p

create database db_payment_demo;
```
数据库信息配置

```yaml
# application.yml
sprint:
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    # 设置连接的时区和字符编码
    url: jdbc:mysql://localhost:3306/db_payment_demo?serverTimezone=Asia/Shanghai&characterEncoding=utf-8
    username: root
    password: 123456

```

实现以下类

```bash
entity
    BaseEntity.java
mapper
    /xml
service
    /impl
```

扫描mapper类

```java
package com.mouday.paymentdemo.config;


import org.mybatis.spring.annotation.MapperScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@Configuration
@MapperScan("com.mouday.paymentdemo.mapper")
// 启用事务管理
@EnableTransactionManagement
public class MyBatisPlusConfig {
    
}

```

打包xml文件

```xml
<build>
    <!-- 项目打包时，将xml文件也打包，默认只打包java文件 -->
    <resources>
        <resource>
            <directory>src/main/java</directory>
            <includes>
                <include>**/*.xml</include>
            </includes>
            <filtering>false</filtering>
        </resource>
    </resources>
</build>
```


```yaml
# 配置 mybatis-plus
mybatis-plus:
  configuratin:
    # sql日志
    log-impl: org.apache.ibatis.logging.stdout.StdOutImpl
  mapper-locations: classpath:com/mouday/paymentdemo/mapper/xml/*.xml
```

## 前端项目

安装Node.js
```
node -v
14.18.0
```

编辑工具：vscode

插件: Volar vue-helper

vue.js: https://cn.vuejs.org/index.html

```bash
# 设置淘宝镜像
npm config set registry https://registry.npm.taobao.org

# 全局安装vue-cli
npm install @vue/cli -g

# 创建vue2项目
vue create vue-demo

# 运行项目
npm run serve -- --port 8001

# 清屏
ctrl + l
```

浏览器开发工具：vue.js devtools

数据绑定
```vue
<tempalte>
    <!-- 数据绑定 -->
    <div>{{name}}</div>

    <!-- 双向数据绑定 -->
    <input v-model="name" type="text"/>

    <!-- 事件绑定 -->    
    <button @click="handleClick">支付</button>
</tempalte>

<script>
export default {
    // 数据
    data(){
        return {
            name: 'Tom'
        }
    },

    // 方法
    methods: {
        handleClick(){

        }
    }

}
</script>
```

内容

1. 引入支付参数
2. 加载商户私钥
3. 获取平台证书和验证签名
4. 获取HttpClient对象
5. API字典和接口规则
6. 内网穿透
7. API v3

```xml
<!-- 生成自定义配置的元数据信息 -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-configuration-processor</artifactId>
    <optional>true</optional>
</dependency>
```


```xml
<!-- json处理器 -->
<dependency>
    <groupId>com.google.code.gson</groupId>
    <artifactId>gson</artifactId>
</dependency>
```

