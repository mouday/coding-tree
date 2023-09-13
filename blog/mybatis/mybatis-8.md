[返回目录](/blog/mybatis/index.md)

# 八、自定义映射 resultMap

## 1、搭建项目环境

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

## 2、项目结构

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

resources 中的配置文件同[模块 2](/blog/mybatis/mybatis-5.1.md)

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

Mapper 接口

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

## 3、处理字段名和实体类中的属性不一致的情况

1、可以通过`字段别名`的方式，保证和实体类中的属性名保持一致

```xml
<!-- List<Emp> getAllEmp() -->
<select id="getAllEmp" resultType="Emp">
    select eid, emp_name empName, age, sex, email, did from t_emp
</select>
```

2、设置一个`全局配置`，自动将下划线命名的字段名转换为驼峰

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

3、设置`resultMap` 映射关系

resultMap 设置自定义映射关系

- id 唯一标识
- type 映射的实体类型
- 子标签：
  - id 设置主键的映射关系， result 设置其他的映射关系
  - property 设置映射关系中的属性名，必须是 type 属性所设置的实体类类型的属性名
  - column 设置映射关系中的字段名，必须是 sql 语句查询出来的字段名

如果使用 resultMap，就所有属性都需要设置

```xml
<resultMap id="empResultMap" type="Emp">
    <id property="eid" column="eid"></id>
    <result property="empName" column="emp_name"></result>
    <result property="age" column="age"></result>
    <result property="sex" column="sex"></result>
    <result property="email" column="email"></result>
</resultMap>

<select id="getAllEmpFromResultMap" resultMap="empResultMap">
    select * from t_emp
</select>
```

## 4、多对一映射关系

```java
public class Emp {
    private Integer eid;

    private String empName;

    private Integer age;

    private String sex;

    private String email;

    private Dept dept;
    // 省略setter/getter
}
```

### 4.1、级联属性赋值

```java
public interface EmpMapper {
    /**
     * 查询员工及其所对应的部门信息
     * @param eid
     * @return
     */
    Emp getEmpAndDept(@Param("eid") Integer eid);
}

```

```xml
<resultMap id="getEmpAndDeptResultMapOne" type="Emp">
    <id property="eid" column="eid"></id>
    <result property="empName" column="emp_name"></result>
    <result property="age" column="age"></result>
    <result property="sex" column="sex"></result>
    <result property="email" column="email"></result>
    <result property="dept.did" column="did"></result>
    <result property="dept.deptName" column="dept_name"></result>
</resultMap>

<!--Emp getEmpAndDept(@Param("eid") Integer eid);-->
<select id="getEmpAndDept" resultMap="getEmpAndDeptResultMapOne">
    select * from
    t_emp
    left join
    t_dept
    on
    t_emp.did = t_dept.did
    where
    t_emp.eid = #{eid}
</select>
```

### 4.2、association

association：处理多对一的映射关系

- property：需要处理多对的映射关系的属性名
- javaType：该属性的类型

```xml
<resultMap id="getEmpAndDeptResultMapTwo" type="Emp">
    <id property="eid" column="eid"></id>
    <result property="empName" column="emp_name"></result>
    <result property="age" column="age"></result>
    <result property="sex" column="sex"></result>
    <result property="email" column="email"></result>

    <association property="dept" javaType="Dept">
        <id property="did" column="did"></id>
        <result property="deptName" column="dept_name"></result>
    </association>
</resultMap>

<!--Emp getEmpAndDept(@Param("eid") Integer eid);-->
<select id="getEmpAndDept" resultMap="getEmpAndDeptResultMapTwo">
    select * from
    t_emp
    left join
    t_dept
    on
    t_emp.did = t_dept.did
    where
    t_emp.eid = #{eid}
</select>
```

### 4.3、分步查询

分两步查询：

1. 查询员工信息
2. 查询部门信息

mapper 接口

```java

public interface EmpMapper {

    /**
     * 通过分步查询，员工及所对应的部门信息
     * 分步查询第一步：查询员工信息
     * @param eid
     * @return
     */
    Emp getEmpAndDeptByStepOne(@Param("eid") Integer eid);
}
```

```java
public interface DeptMapper {

    /**
     * 通过分步查询，员工及所对应的部门信息
     * 分步查询第二步：通过did查询员工对应的部门信息
     * @param did
     * @return
     */
    Dept getEmpAndDeptByStepTwo(@Param("did") Integer did);
}
```

sql 语句和字段映射

```xml
<resultMap id="empAndDeptByStepResultMap" type="Emp">
    <id property="eid" column="eid"></id>
    <result property="empName" column="emp_name"></result>
    <result property="age" column="age"></result>
    <result property="sex" column="sex"></result>
    <result property="email" column="email"></result>

    <association property="dept"
                    select="com.atguigu.mybatis.mapper.DeptMapper.getEmpAndDeptByStepTwo"
                    column="did"></association>
</resultMap>

<!--Emp getEmpAndDeptByStepOne(@Param("eid") Integer eid);-->
<select id="getEmpAndDeptByStepOne" resultMap="empAndDeptByStepResultMap">
    select * from t_emp where eid = #{eid}
</select>
```

```xml
 <!--此处的resultMap仅是处理字段和属性的映射关系-->
<resultMap id="EmpAndDeptByStepTwoResultMap" type="Dept">
    <id property="did" column="did"></id>
    <result property="deptName" column="dept_name"></result>
</resultMap>

<!--Dept getEmpAndDeptByStepTwo(@Param("did") Integer did);-->
<select id="getEmpAndDeptByStepTwo" resultMap="EmpAndDeptByStepTwoResultMap">
    select * from t_dept where did = #{did}
</select>
```

测试类

```java
public class EmpMapperTest {

    @Test
    public void getEmpAndDeptByStepOne() {
        SqlSession sqlSession = SqlSessionUtil.getSqlSession();
        EmpMapper mapper = sqlSession.getMapper(EmpMapper.class);
        Emp emp = mapper.getEmpAndDeptByStepOne(1);
        JsonUtil.prettyPrint(emp);
    }
}
```

输出结果

```json
{
  "eid": 1,
  "empName": "曹操",
  "age": 20,
  "sex": "男",
  "email": "123456@qq.com",
  "dept": {
    "did": 1,
    "deptName": "财务部"
  }
}
```

## 5、一对多映射关系

### 5.1、collection

- collection：用来处理一对多的映射关系
- ofType：表示该属性对应的集合中存储的数据的类型

```java
public class Dept {
    private Integer did;

    private String deptName;

    private List<Emp> emps;

    // getter and setter
}
```

```xml
<resultMap id="DeptAndEmpResultMap" type="Dept">
    <id property="did" column="did"></id>
    <result property="deptName" column="dept_name"></result>

    <collection property="emps" ofType="Emp">
        <id property="eid" column="eid"></id>
        <result property="empName" column="emp_name"></result>
        <result property="age" column="age"></result>
        <result property="sex" column="sex"></result>
        <result property="email" column="email"></result>
    </collection>
</resultMap>

<!--Dept getDeptAndEmp(@Param("did") Integer did);-->
<select id="getDeptAndEmp" resultMap="DeptAndEmpResultMap">
    select * from t_dept
    left join t_emp
    on t_dept.did = t_emp.did
    where t_dept.did = #{did}
</select>
```
查询结果

```json
{
  "did": 1,
  "deptName": "财务部",
  "emps": [
    {
      "eid": 1,
      "empName": "曹操",
      "age": 20,
      "sex": "男",
      "email": "123456@qq.com",
      "dept": null
    },
    {
      "eid": 5,
      "empName": "关羽",
      "age": 23,
      "sex": "男",
      "email": "guan@126.com",
      "dept": null
    }
  ]
}
```

### 5.2、分步查询

1、查询部门信息
```java
public interface DeptMapper {
    /**
     * 分步查询 查询部门及其所有的员工信息
     * 第一步  查询部门信息
     */
    Dept getDeptAndEmpByStepOne(@Param("did") Integer did);
}
```

```xml
<!-- 分步查询-->
<resultMap id="deptAndEmpByStepOneMap" type="Dept">
    <id property="did" column="did"></id>
    <result property="deptName" column="dept_name"></result>
    <collection property="emps"
                select="com.atguigu.mybatis.mapper.EmpMapper.getDeptAndEmpByStepTwo"
                column="did">
    </collection>
</resultMap>

<!-- Dept getDeptAndEmoByStepOne(@Param("did") Integer did);-->
<select id="getDeptAndEmpByStepOne" resultMap="deptAndEmpByStepOneMap">
    select * from t_dept where did = #{did}
</select>

```

2、根据部门id查询部门中的所有员工

```java
public interface EmpMapper {
    /**
     * 分步查询 查询部门及其所有的员工信息
     * 第一步  查询部门信息
     * 第二步  根据查询员工信息
     */
    List<Emp> getDeptAndEmpByStepTwo(@Param("did") Integer did);
}
```

```xml
<!--    分步查询-->
<!-- List<Emp> getDeptAndEmpByStepTwo(@Param("did") Integer did);-->
<select id="getDeptAndEmpByStepTwo" resultType="Emp">
    select * from t_emp where did = #{did}
</select>
```
测试类

```java

public class DeptMapperTest {
    @Test
    public void getDeptAndEmoByStepOne() {
        SqlSession sqlSession = SqlSessionUtil.getSqlSession();
        DeptMapper mapper = sqlSession.getMapper(DeptMapper.class);
        Dept deptAndEmp = mapper.getDeptAndEmpByStepOne(1);
        JsonUtil.prettyPrint(deptAndEmp);
    }
}
```

## 6、延迟加载

分步查询的优点:可以实现延迟加载，但是必须在核心配置文件中设置全局配置信息:

- lazyLoadingEnabled: 延迟加载的全局开关。当开启时，所有关联对象都会延迟加载
- aggressiveLazyLoading: 当开启时，任何方法的调用都会加载该对象的所有属性。 否则，每个属性会按需加载

此时就可以实现按需加载，获取的数据是什么，就只会执行相应的 sql。此时可通过 association 和 collection 中的 fetchType 属性设置当前的分步查询是否使用延迟加载

- fetchType=“lazy(延迟加 载)|eager(立即加载)”

全局配置

```xml
<!--开启延迟加载-->
<setting name="lazyLoadingEnabled" value="true"/>
```

局部配置

```xml
<resultMap id="empAndDeptByStepResultMap" type="Emp">
	<id property="eid" column="eid"></id>
	<result property="empName" column="emp_name"></result>
	<result property="age" column="age"></result>
	<result property="sex" column="sex"></result>
	<result property="email" column="email"></result>
	<association property="dept"
				 select="com.atguigu.mybatis.mapper.DeptMapper.getEmpAndDeptByStepTwo"
				 column="did"
				 fetchType="lazy"></association>
</resultMap>
```
