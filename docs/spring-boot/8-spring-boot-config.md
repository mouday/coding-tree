[返回目录](/blog/java/spring-boot/index.md)

# 8、SpringBoot配置高级

## 临时属性

```bash
# 临时属性
java -jar app.jar --server.port=8080
```

多个属性，空格分隔

## 配置优先级

文档：[https://docs.spring.io/spring-boot/docs/2.7.18/reference/html/features.html#features.external-config](https://docs.spring.io/spring-boot/docs/2.7.18/reference/html/features.html#features.external-config)

配置优先级（由低到高）

1. Default properties (specified by setting SpringApplication.setDefaultProperties).

2. @PropertySource annotations on your @Configuration classes. Please note that such property sources are not added to the Environment until the application context is being refreshed. This is too late to configure certain properties such as logging.* and spring.main.* which are read before refresh begins.

3. Config data (such as `application.properties` files).

4. A RandomValuePropertySource that has properties only in random.*.

5. OS environment variables.

6. Java System properties (System.getProperties()).

7. JNDI attributes from java:comp/env.

8. ServletContext init parameters.

9. ServletConfig init parameters.

10. Properties from SPRING_APPLICATION_JSON (inline JSON embedded in an environment variable or system property).

11. Command line arguments.

12. properties attribute on your tests. Available on @SpringBootTest and the test annotations for testing a particular slice of your application.

13. @DynamicPropertySource annotations in your tests.

14. @TestPropertySource annotations on your tests.

15. Devtools global settings properties in the $HOME/.config/spring-boot directory when devtools is active.

配置文件的优先级（由低到高）

1. Application properties packaged inside your jar (`application.properties` and YAML variants).

2. Profile-specific application properties packaged inside your jar (`application-{profile}.properties` and YAML variants).

3. Application properties outside of your packaged jar (`application.properties` and YAML variants).

4. Profile-specific application properties outside of your packaged jar (`application-{profile}.properties` and YAML variants).

开发环境设置临时参数

通过编程的方式修改SpringBoot运行参数

```java
@SpringBootApplication
public class Application {

    public static void main(String[] args) {
        String[] params = new String[]{"--server.port=8081"};
        SpringApplication.run(Application.class, params);
    }
}
```

可以不带参数运行SpringBoot程序，较为安全

```java
@SpringBootApplication
public class Application {

    public static void main(String[] args) {
        SpringApplication.run(Application.class);
    }
}
```

## 配置文件分类

SpringBoot中的4级配置文件（由高到低）

- file:config/application.yml
- file:application.yml
- classpath:config/application.yml
- classpath:application.yml

作用：

- file级别用于线上配置
- classpath级别用于开发配置

多层级配置文件间采用叠加并覆盖的形式作用于程序


## 自定义配置文件

```bash
# 指定文件名 configFileName.properties 或者 configFileName.yml
--spring.config.name=configFileName

# 指定全路径名
--spring.config.location=classpath:/configFileName.yml

# 指定全路径名，多个配置文件逗号分隔
--spring.config.location=classpath:/configFileName1.yml,classpath:/configFileName2.yml

```

- 单服务器项目
- 多服务器项目
- 微服务项目使用配置中心管理
