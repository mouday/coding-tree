[返回目录](/blog/mybatis/index.md)

# 三、核心配置文件参数详解

## environments

1、environments：设置多个连接数据库的环境

属性：

- default：设置默认使用的环境的 id

2、environment：设置具体的连接数据库的环境信息

属性：

- id：设置环境的唯一标识，可通过 environments 标签中的 default 设置某一个环境的 id，表示默认使用的环境

3、transactionManager：设置事务管理方式

属性：

- type：设置事务管理方式，type="JDBC|MANAGED"
  - type="JDBC"：设置当前环境的事务管理都必须手动处理
  - type="MANAGED"：设置事务被管理，例如 spring 中的 AOP

4、dataSource：设置数据源

属性：

- type：设置数据源的类型，type="POOLED|UNPOOLED|JNDI"
  - type="POOLED"：使用数据库连接池，即会将创建的连接进行缓存，下次使用可以从缓存中直接获取，不需要重新创建
  - type="UNPOOLED"：不使用数据库连接池，即每次使用连接都需要重新创建
  - type="JNDI"：调用上下文中的数据源

5、property

- driver 设置驱动类的全类名
- url 设置连接数据库的连接地址
- username 设置连接数据库的用户名
- password 设置连接数据库的密码

示例

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration
        PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-config.dtd">
<configuration>
    <environments default="development">
        <environment id="development">
            <transactionManager type="JDBC"/>
            <dataSource type="POOLED">
                <property name="driver" value="com.mysql.cj.jdbc.Driver"/>
                <property name="url" value="jdbc:mysql://localhost:3306/MyBatis"/>
                <property name="username" value="root"/>
                <property name="password" value="123456"/>
            </dataSource>
        </environment>
    </environments>
</configuration>
```

## 2、properties

新建属性配置文件

/src/main/resources/jdbc.properties

```bash
jdbc.driver=com.mysql.cj.jdbc.Driver
jdbc.url=jdbc:mysql://localhost:3306/MyBatis
jdbc.username=root
jdbc.password=123456
```

修改配置文件

使用`${key}` 的格式读取属性文件的值

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration
        PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-config.dtd">
<configuration>

    <!--引入properties文件，此时就可以${属性名}的方式访问属性值-->
    <properties resource="jdbc.properties"></properties>

    <!--设置连接数据库的环境-->
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
</configuration>
```

## 3、typeAliases

typeAlias：设置某个具体的类型的别名

属性：
- type：需要设置别名的类型的全类名
- alias：设置此类型的别名，且别名不区分大小写。若不设置此属性，该类型拥有默认的别名，即类名
    
```xml
<typeAliases>
    <typeAlias type="com.atguigu.mybatis.pojo.User" alias="User"></typeAlias>
</typeAliases>

```

UserMapper.xml 中可以简写类名

```xml
<select id="getAllUser" resultType="com.atguigu.mybatis.pojo.User">
    select * from t_user
</select>

<!-- 简写为 -->
<select id="getAllUser" resultType="User">
    select * from t_user
</select>
```

package：以包为单位，将包下所有的类型设置默认的类型别名且不区分大小写

```xml
<typeAliases>
    <package name="com.atguigu.mybatis.pojo"/>
</typeAliases>
```

## 4、mappers

```xml
<!--引入映射文件-->
<mappers>
    <!-- 使用相对于类路径的资源引用 -->
    <mapper resource="com/atguigu/mybatis/mapper/xml/UserMapper.xml"/>
</mappers>
```

以包为单位，将包下所有的映射文件引入核心配置文件

注意：
1. 此方式必须保证mapper接口和mapper映射文件必须在相同的包下
2. mapper接口要和mapper映射文件的名字一致

```xml
<mappers>
    <!-- 文件路径：src/main/resources/com/atguigu/mybatis/mapper -->
    <package name="com.atguigu.mybatis.mapper"/>
</mappers>
```