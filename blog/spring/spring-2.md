[返回目录](/blog/spring/index.md)

# 二、Spring入门

入门案例开发步骤

1. 引入Spring相关依赖
2. 创建类，定义属性和方法
3. 按照Spring要求出创建配置文件（xml格式）
4. 在Spring配置文件配置相关信息
5. 进行最终测试

项目结构
```bash
$ tree -I target
.
├── pom.xml
└── spring-first
    ├── pom.xml
    └── src
        ├── main
        │   ├── java
        │   │   └── com
        │   │       └── atguigu
        │   │           └── spring6
        │   │               └── User.java
        │   └── resources
        │       └── bean.xml
        └── test
            └── java
                └── com
                    └── atguigu
                        └── spring6
                            └── UserTest.java

```

pom.xml
```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <parent>
        <artifactId>spring-demo</artifactId>
        <groupId>com.atguigu</groupId>
        <version>1.0-SNAPSHOT</version>
    </parent>
    <modelVersion>4.0.0</modelVersion>

    <artifactId>spring-first</artifactId>

    <properties>
        <maven.compiler.source>17</maven.compiler.source>
        <maven.compiler.target>17</maven.compiler.target>
    </properties>

    <dependencies>
        <!-- spring context -->
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-context</artifactId>
            <version>6.0.2</version>
        </dependency>

        <!-- junit -->
        <dependency>
            <groupId>org.junit.jupiter</groupId>
            <artifactId>junit-jupiter-api</artifactId>
            <version>5.6.3</version>
            <scope>test</scope>
        </dependency>
    </dependencies>

</project>
```

User.java
```java
package com.atguigu.spring6;

public class User {

    public void add(){
        System.out.println("add...");
    }
}

```

创建对象

bean标签

- id属性：唯一标识
- class属性：创建对象类的全路径（包名+类名）


bean.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean id="user" class="com.atguigu.spring6.User"></bean>
</beans>
```
UserTest.java

```java
package com.atguigu.spring6;

import org.junit.jupiter.api.Test;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

class UserTest {

    @Test
    void add() {
        //加载spring配置文件，创建对象
        ApplicationContext context = new ClassPathXmlApplicationContext("bean.xml");

        //获取创建的对象
        User user = (User) context.getBean("user");

        //调用对象的方法
        user.add();

    }
}
```


https://www.bilibili.com/video/BV1kR4y1b7Qc/?p=8&spm_id_from=pageDriver&vd_source=efbb4dc944fa761b6e016ce2ca5933da