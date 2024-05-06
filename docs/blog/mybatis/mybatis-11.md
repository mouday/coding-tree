[返回目录](/blog/mybatis/index.md)

# 十一、MyBatis的逆向工程


MyBatis Generator: 

[https://mybatis.org/generator/](https://mybatis.org/generator/)

- 正向工程：先创建Java实体类，由框架负责根据实体类生成数据库表。Hibernate是支持正向工程的
- 逆向工程：先创建数据库表，由框架负责根据数据库表，反向生成如下资源：
    - Java实体类
    - Mapper接口
    - Mapper映射文件

## 创建逆向工程的步骤


项目结构

```bash
$ tree 
.
├── pom.xml
└── src
    ├── main
    │   ├── java
    │   └── resources
    │       ├── generatorConfig.xml
    │       ├── jdbc.properties
    │       ├── log4j.xml
    │       └── mybatis-config.xml
    └── test
        └── java

```

依赖 pom.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.demo</groupId>
    <artifactId>mybatis-demo-4</artifactId>
    <version>1.0-SNAPSHOT</version>


    <dependencies>
        <!-- MyBatis核心依赖包 -->
        <dependency>
            <groupId>org.mybatis</groupId>
            <artifactId>mybatis</artifactId>
            <version>3.5.9</version>
        </dependency>
        <!-- junit测试 -->
        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>4.13.2</version>
            <scope>test</scope>
        </dependency>
        <!-- MySQL驱动 -->
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <version>8.0.27</version>
        </dependency>
        <!-- log4j日志 -->
        <dependency>
            <groupId>log4j</groupId>
            <artifactId>log4j</artifactId>
            <version>1.2.17</version>
        </dependency>
    </dependencies>


    <!-- 控制Maven在构建过程中相关配置 -->
    <build>
        <!-- 构建过程中用到的插件 -->
        <plugins>
            <!-- 具体插件，逆向工程的操作是以构建过程中插件形式出现的 -->
            <plugin>
                <groupId>org.mybatis.generator</groupId>
                <artifactId>mybatis-generator-maven-plugin</artifactId>
                <version>1.3.2</version>
                <!-- 插件的依赖 -->
                <dependencies>
                    <!-- 逆向工程的核心依赖 -->
                    <dependency>
                        <groupId>org.mybatis.generator</groupId>
                        <artifactId>mybatis-generator-core</artifactId>
                        <version>1.3.2</version>
                    </dependency>
                    <!-- 数据库连接池 -->
                    <dependency>
                        <groupId>com.mchange</groupId>
                        <artifactId>c3p0</artifactId>
                        <version>0.9.2</version>
                    </dependency>
                    <!-- MySQL驱动 -->
                    <dependency>
                        <groupId>mysql</groupId>
                        <artifactId>mysql-connector-java</artifactId>
                        <version>8.0.27</version>
                    </dependency>
                </dependencies>
            </plugin>
        </plugins>
    </build>

</project>
```

generatorConfig.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE generatorConfiguration
        PUBLIC "-//mybatis.org//DTD MyBatis Generator Configuration 1.0//EN"
        "http://mybatis.org/dtd/mybatis-generator-config_1_0.dtd">
<generatorConfiguration>

    <properties resource="jdbc.properties"/>

    <!--
    targetRuntime: 执行生成的逆向工程的版本
    MyBatis3Simple: 生成基本的CRUD（清新简洁版）
    MyBatis3: 生成带条件的CRUD（奢华尊享版）
    -->
    <context id="DB2Tables" targetRuntime="MyBatis3Simple">
        <!-- 数据库的连接信息 -->
        <jdbcConnection driverClass="${jdbc.driver}"
                        connectionURL="${jdbc.url}"
                        userId="${jdbc.username}"
                        password="${jdbc.password}">
        </jdbcConnection>

        <!-- javaBean的生成策略-->
        <javaModelGenerator targetPackage="com.atguigu.mybatis.pojo"
                            targetProject="./src/main/java">
            <property name="enableSubPackages" value="true" />
            <property name="trimStrings" value="true" />
        </javaModelGenerator>

        <!-- SQL映射文件的生成策略 -->
        <sqlMapGenerator targetPackage="com.atguigu.mybatis.mapper"
                         targetProject="./src/main/resources">
            <property name="enableSubPackages" value="true" />
        </sqlMapGenerator>

        <!-- Mapper接口的生成策略 -->
        <javaClientGenerator type="XMLMAPPER"
                             targetPackage="com.atguigu.mybatis.mapper"
                             targetProject="./src/main/java">
            <property name="enableSubPackages" value="true" />
        </javaClientGenerator>

        <!-- 逆向分析的表 -->
        <!-- tableName设置为*号，可以对应所有表，此时不写domainObjectName -->
        <!-- domainObjectName属性指定生成出来的实体类的类名 -->
        <table tableName="t_emp" domainObjectName="Emp"/>
        <table tableName="t_dept" domainObjectName="Dept"/>

    </context>
</generatorConfiguration>

```
jdbc.properties
```bash
jdbc.driver=com.mysql.cj.jdbc.Driver
jdbc.url=jdbc:mysql://localhost:3306/MyBatis?nullCatalogMeansCurrent=true
jdbc.username=root
jdbc.password=123456
```

日志配置 log4j.xml

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE log4j:configuration SYSTEM "log4j.dtd">
<log4j:configuration xmlns:log4j="http://jakarta.apache.org/log4j/">
    <appender name="STDOUT" class="org.apache.log4j.ConsoleAppender">
        <param name="Encoding" value="UTF-8" />
        <layout class="org.apache.log4j.PatternLayout">
            <param name="ConversionPattern" value="%-5p %d{MM-dd HH:mm:ss} %m (%F:%L) \n" />
        </layout>
    </appender>
    <logger name="java.sql">
        <level value="debug" />
    </logger>
    <logger name="org.apache.ibatis">
        <level value="info" />
    </logger>
    <root>
        <level value="debug" />
        <appender-ref ref="STDOUT" />
    </root>
</log4j:configuration>

```

mybatis-config.xml

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration
        PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-config.dtd">
<configuration>
    <properties resource="jdbc.properties"/>

    <typeAliases>
        <package name="com.atguigu.mybatis.pojo"/>
    </typeAliases>

    <environments default="development">
        <environment id="development">
            <transactionManager type="JDBC"/>
            <dataSource type="POOLED">
                <property name="driver" value="${jdbc.driver}"/>
                <property name="url" value="${jdbc.url}"/>
                <property name="username" value="${jdbc.username}"/>
                <property name="password" value="${jdbc.password}"/>
            </dataSource>
        </environment>
    </environments>

    <mappers>
        <package name="com.atguigu.mybatis.mapper"/>
    </mappers>
</configuration>

```
注意不同环境下的路径写法

```bash
# mac环境下
targetProject="./src/main/java"

# windows
targetProject=".\src\main\java"
```

进入模块目录

```bash
$ mvn mybatis-generator:generate
```

此时，自动生成了文件
```bash
$ tree
.
├── pom.xml
└── src
    ├── main
    │   ├── java
    │   │   └── com
    │   │       └── atguigu
    │   │           └── mybatis
    │   │               ├── mapper
    │   │               │   ├── DeptMapper.java
    │   │               │   └── EmpMapper.java
    │   │               └── pojo
    │   │                   ├── Dept.java
    │   │                   └── Emp.java
    │   └── resources
    │       ├── com
    │       │   └── atguigu
    │       │       └── mybatis
    │       │           └── mapper
    │       │               ├── DeptMapper.xml
    │       │               └── EmpMapper.xml
    │       ├── generatorConfig.xml
    │       ├── jdbc.properties
    │       ├── log4j.xml
    │       └── mybatis-config.xml
    └── test
        └── java

```


## 遇到的问题

1、resource文件不存在

generatorConfig.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE generatorConfiguration
        PUBLIC "-//mybatis.org//DTD MyBatis Generator Configuration 1.0//EN"
        "http://mybatis.org/dtd/mybatis-generator-config_1_0.dtd">
<generatorConfiguration>
    <properties resource="jdbc.properties"/>
</generatorConfiguration>
```

报错如下

```
<properties> resource jdbc.properties does not exist
```

原来的配置

```xml
<plugin>
    <groupId>org.mybatis.generator</groupId>
    <artifactId>mybatis-generator-maven-plugin</artifactId>
    <version>1.3.0</version>
    <!-- 插件的依赖 -->
    <dependencies>
        <!-- 逆向工程的核心依赖 -->
        <dependency>
            <groupId>org.mybatis.generator</groupId>
            <artifactId>mybatis-generator-core</artifactId>
            <version>1.3.2</version>
        </dependency>
        <!-- 省略其他依赖 -->
</plugin>

```

修改如下：将版本修改一致

```xml
<plugin>
    <groupId>org.mybatis.generator</groupId>
    <artifactId>mybatis-generator-maven-plugin</artifactId>
    <version>1.3.2</version>
    <!-- 插件的依赖 -->
    <dependencies>
        <!-- 逆向工程的核心依赖 -->
        <dependency>
            <groupId>org.mybatis.generator</groupId>
            <artifactId>mybatis-generator-core</artifactId>
            <version>1.3.2</version>
        </dependency>
        <!-- 省略其他依赖 -->
</plugin>

```

参考：[关于mybatis逆向工程generator.xml读取不了＜properties＞](https://blog.csdn.net/nin_9_6Ix/article/details/127951434)


问题2、重复生成文件

```bash
$ tree 
.
├── mybatis-demo-4.iml
├── pom.xml
└── src
    ├── main
    │   ├── java
    │   │   └── com
    │   │       └── atguigu
    │   │           └── mybatis
    │   │               ├── mapper
    │   │               │   ├── DeptMapper.java
    │   │               │   ├── EmpMapper.java
    │   │               │   ├── EmpMapper.java.1
    │   │               │   └── EmpMapper.java.2
    │   │               └── pojo
    │   │                   ├── Dept.java
    │   │                   ├── Emp.java
    │   │                   ├── Emp.java.1
    │   │                   └── Emp.java.2
    │   └── resources
    │       ├── com
    │       │   └── atguigu
    │       │       └── mybatis
    │       │           └── mapper
    │       │               ├── DeptMapper.xml
    │       │               └── EmpMapper.xml
    │       ├── generatorConfig.xml
    │       ├── jdbc.properties
    │       ├── log4j.xml
    │       └── mybatis-config.xml
    └── test
        └── java

```

修改配置`generatorConfig.xml`如下

```xml
<table tableName="t_emp" domainObjectName="Emp" catalog="MyBatis">
            <property name="ignoreQualifiersAtRuntime" value="true"></property>
        </table>
```

或者 

修改数据库链接参数`nullCatalogMeansCurrent=true`

```bash
jdbc.url=jdbc:mysql://localhost:3306/MyBatis?nullCatalogMeansCurrent=true
```

参考：
1. [mybatis-generator 生成多次重复代码 简单完美解决方案](https://blog.csdn.net/weixin_49610478/article/details/112694508)
2. [Mybatis generator 生成多个重复类](https://blog.csdn.net/qq_45185727/article/details/110076421)


## QBC查询

QBC 即 Query By Criteria测试生成的接口

查询数据

```java
public class EmpMapperTest {

    @Test
    public void selectByExample() {
        SqlSession sqlSession = SqlSessionUtil.getSqlSession();
        EmpMapper mapper = sqlSession.getMapper(EmpMapper.class);
        EmpExample example = new EmpExample();
        example.createCriteria()
                .andEmpNameEqualTo("张三")
                .andAgeGreaterThan(20);

        mapper.selectByExample(example);
        // select eid, emp_name, age, sex, email, did from t_emp WHERE ( emp_name = ? and age > ? )
    }
}
```

修改数据

```java
public class EmpMapperTest {

    @Test
    public void updateByPrimaryKeySelective() {
        SqlSession sqlSession = SqlSessionUtil.getSqlSession();
        EmpMapper mapper = sqlSession.getMapper(EmpMapper.class);

        Emp record = new Emp();
        record.setEid(1);
        record.setAge(18);

        mapper.updateByPrimaryKeySelective(record);
        //  update t_emp SET age = ? where eid = ?
    }
}
```