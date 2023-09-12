[返回目录](/blog/mybatis/index.md)

# 八、自定义映射resultMap

## 搭建项目环境

初始化数据表：

```sql
-- 部门表
create table t_dept(
  did int primary key not null auto_increment,
  dept_name varchar(50)
) comment '部门表';


-- 员工表
create table t_emp(
  eid int primary key not null auto_increment,
  emp_name varchar(50),
  age int,
  sex char(1),
  email varchar(50),
  did int
) comment '员工表';

```

插入测试数据

```sql
-- 部门表
INSERT INTO MyBatis.t_dept (did, dept_name) VALUES (1, '财务部');
INSERT INTO MyBatis.t_dept (did, dept_name) VALUES (2, '技术部');
INSERT INTO MyBatis.t_dept (did, dept_name) VALUES (3, '销售部');

-- 员工表
INSERT INTO MyBatis.t_emp (eid, emp_name, age, sex, email, did) VALUES (1, '曹操', 20, '男', '123456@qq.com', 1);
INSERT INTO MyBatis.t_emp (eid, emp_name, age, sex, email, did) VALUES (2, '刘备', 24, '男', 'liubei@qq.com', 2);
INSERT INTO MyBatis.t_emp (eid, emp_name, age, sex, email, did) VALUES (3, '孙尚香', 20, '女', 'sun@qq.com', 3);
INSERT INTO MyBatis.t_emp (eid, emp_name, age, sex, email, did) VALUES (4, '张飞', 22, '男', 'zhang@163.com', 2);
INSERT INTO MyBatis.t_emp (eid, emp_name, age, sex, email, did) VALUES (5, '关羽', 23, '男', 'guan@126.com', 1);
```

项目结构

```bash
$ tree mybatis-demo-3
mybatis-demo-3
├── mybatis-demo-3.iml
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
    │       ├── jdbc.properties
    │       ├── log4j.xml
    │       └── mybatis-config.xml
    └── test
        └── java

```

resources 中的配置文件同[模块2](/blog/mybatis/mybatis-5.1.md)

pom.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.demo</groupId>
    <artifactId>mybatis-demo-3</artifactId>
    <version>1.0-SNAPSHOT</version>

    <packaging>jar</packaging>
    
    <dependencies>
        <!-- Mybatis核心 -->
        <dependency>
            <groupId>org.mybatis</groupId>
            <artifactId>mybatis</artifactId>
            <version>3.5.7</version>
        </dependency>

        <!-- junit测试 -->
        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>4.12</version>
            <scope>test</scope>
        </dependency>

        <!-- MySQL驱动 -->
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <!--mysql 8.0 -->
            <version>8.0.20</version>
            <!--mysql 5.7 -->
            <!--<version>5.1.3</version>-->
        </dependency>

        <!-- log4j日志 -->
        <dependency>
            <groupId>log4j</groupId>
            <artifactId>log4j</artifactId>
            <version>1.2.17</version>
        </dependency>

        <!--json-->
        <dependency>
            <groupId>com.fasterxml.jackson.core</groupId>
            <artifactId>jackson-databind</artifactId>
            <version>2.10.0</version>
        </dependency>
    </dependencies>
</project>
```


实体类

Dept.java

```java
/**
 * 部门
 */
public class Dept {
    private Integer did;

    private String deptName;

    // 省略setter / getter
}

```
Emp.java

```java
/**
 * 员工
 */
public class Emp {
    private Integer eid;

    private String empName;

    private Integer age;

    private String sex;

    private String email;

    // 省略setter / getter
}

```

Mapper接口

DeptMapper.java

```java
public interface DeptMapper {
}
```

EmpMapper.java
```java
public interface EmpMapper {
}
```

SQL Mapper

DeptMapper.xml
```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "https://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.atguigu.mybatis.mapper.DeptMapper">

</mapper>
```

EmpMapper.xml
```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "https://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.atguigu.mybatis.mapper.EmpMapper">

</mapper>
```

## 处理字段名和实体类中的属性不一致的情况

1、可以通过为字段起别名的方式，保证和实体类中的属性名保持一致

```xml
<!-- List<Emp> getAllEmp() -->
<select id="getAllEmp" resultType="Emp">
    select eid, emp_name empName, age, sex, email, did from t_emp
</select>
```

2、设置一个全局配置，自动将下划线命名的字段名转换为驼峰

mybatis-config.xml

```xml
<configuration>
    <settings>
        <setting name="mapUnderscoreToCamelCase" value="true"/>
    </settings>
</configuration>
```

```xml
<!-- List<Emp> getAllEmp() -->
<select id="getAllEmp" resultType="Emp">
    select * from t_emp
</select>
```
