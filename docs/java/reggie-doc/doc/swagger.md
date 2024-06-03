# Swagger

官网：https://swagger.io/

- Swagger 生成接口文档
- knife4j 集成Swagger生成API文档的增强解决方案


1、引入Maven坐标 pom.xml

```xml
<dependency>
    <groupId>com.github.xiaoymin</groupId>
    <artifactId>knife4j-spring-boot-starter</artifactId>
    <version>3.0.3</version>
</dependency>
```

2、修改配置 application.yml

```yaml
spring:
  mvc:
    pathmatch:
      matching-strategy: ANT_PATH_MATCHER
```

3、配置 Knife4j + Swagger

```java
package com.example.demo.config;


import com.github.xiaoymin.knife4j.spring.annotations.EnableKnife4j;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

@Configuration
@EnableSwagger2
@EnableKnife4j
@Slf4j
public class SwaggerConfig {
    @Bean
    public Docket docket() {

        // 扫描指定接口所在路径
        return new Docket(DocumentationType.SWAGGER_2)
                .apiInfo(apiInfo())
                .select()
                .apis(RequestHandlerSelectors.basePackage("com.example.demo.controller"))
                .paths(PathSelectors.any())
                .build();
    }

    // swagger 信息
    private ApiInfo apiInfo() {
        return new ApiInfoBuilder()
                .title("利用swagger2构建的API文档")
                .description("用restful风格写接口")
                .version("1.0")
                .build();
    }
}

```

4、创建实体类
```java
package com.example.demo.entity;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
@ApiModel("用户")
public class User {
    @ApiModelProperty("主键")
    private Integer id;

    @ApiModelProperty("姓名")
    private String name;

    @ApiModelProperty("年龄")
    private Integer age;
}

```

5、创建控制器
```java
package com.example.demo.controller;

import com.example.demo.entity.User;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Api(tags = "用户相关接口")
public class UserController {
    @GetMapping("/api/getUser")
    @ApiOperation("获取用户信息")
    @ApiImplicitParams(
            @ApiImplicitParam(name="userId", value = "用户id", required = true, type = "String")
    )
    public User getUser(Integer userId) {
        User user = new User();
        user.setId(userId);
        user.setAge(20);
        user.setName("Tom");
        return user;
    }
}
```

浏览器打开: http://127.0.0.1:8080/doc.html

Swagger常用注解

注解 | 说明
- | -
@Api | 对Controller请求类说明
@ApiModel | 描述实体类，表示返回响应数据的信息
@ApiModelProperty | 描述响应属性
@ApiOperation | 请求方法
@ApiImplicitParams | 请求方法的一组参数
@ApiImplicitParam | 请求参数
