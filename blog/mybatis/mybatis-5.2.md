[返回目录](/blog/mybatis/index.md)

# 五、MyBatis获取参数值的两种方式

- `${}` 本质就是字符串拼接
- `#{}` 本质就是占位符赋值（优先使用，避免SQL注入）

## 1、单个字面量类型的参数

若mapper接口中的方法参数为单个的字面量类型

此时可以使用`${}` 和`#{}` 以任意的名称获取参数的值，注意`${}` 需要手动加单引号

Mapper接口

```java
public interface ParameterMapper {

    /**
     * 通过用户名获取用户
     * @return
     */
    User getUserByUsername(String username);
}

```

占位符

```xml
<select id="getUserByUsername" resultType="User">
    select * from t_user where username = #{username} limit 1
</select>
```

输出结果

```sql
select * from t_user where username = ? limit 1
```

字符串拼接

```xml
<select id="getUserByUsername" resultType="User">
    select * from t_user where username = '${username}' limit 1
</select>
```

输出结果

```sql
select * from t_user where username = 'admin' limit 1
```

## 2、多个字面量类型的参数

若mapper接口中的方法参数为多个时

此时MyBatis会自动将这些参数放在一个map集合中

- 以arg0,arg1…为键，以参数为值;
- 以 param1,param2…为键，以参数为值;

因此只需要通过${}和#{}访问map集合的键就可以获取相对应的 值，注意${}需要手动加单引号

```java
public interface ParameterMapper {

    /**
     * 用户登录
     * @return
     */
    User checkLogin(String username, String password);
}

```

```xml
<!--User checkLogin(String username, String password);-->
<select id="checkLogin" resultType="User">
    select * from t_user where username = #{arg0} and password = #{arg1} limit 1
</select>
```

sql

```sql
select * from t_user where username = ? and password = ? limit 1
```

## 3、map集合类型的参数

若mapper接口中的方法需要的参数为多个时，此时可以手动创建map集合，

将这些数据放在map中只需要通过`${}` 和`#{}` 访问map集合的键就可以获取相对应的值，注意`${}` 需要手动加单引号

```java

public interface ParameterMapper {

    /**
     * 用户登录
     * @param map
     * @return
     */
    User checkLoginByMap(Map<String, Object> map);
}

```

测试类

```java
public class TestParameterMapper {
    @Test
    public void checkLoginByMap(){
        SqlSession sqlSession = SqlSessionUtil.getSqlSession();
        ParameterMapper mapper = sqlSession.getMapper(ParameterMapper.class);

        Map<String, Object> map = new HashMap<>();
        map.put("username", "admin");
        map.put("password", "123456");

        User user = mapper.checkLoginByMap(map);

        System.out.println(user);
    }
}

```

```xml
<!--User checkLoginByMap(Map<String, Object> map);-->
<select id="checkLoginByMap" resultType="User">
    select * from t_user where username = #{username} and password = #{password} limit 1
</select>
```


```sql
select * from t_user where username = ? and password = ? limit 1
```

## 4、实体类类型的参数

若mapper接口中的方法参数为实体类对象时此时可以使用`${}` 和`#{}`

通过访问实体类对象中的属性名获取属性值，注意`${}` 需要手动加单引号


ParameterMapper接口：

```java
public interface ParameterMapper {
    /**
     * 添加用户信息
     */
    int insertUser(User user);
}

```

对应在ParameterMapper.xml中配置

```xml
<!-- int insertUser(User user);-->
<insert id="insertUser">
    insert into t_user (
        username, password, age, gender, email
    )
    values (
        #{username}, #{password}, #{age}, #{gender}, #{email}
    )
</insert>
```

测试类：

```java
public class TestParameterMapper {

    @Test
    public void insertUser(){
        SqlSession sqlSession = SqlSessionUtil.getSqlSession();
        ParameterMapper mapper = sqlSession.getMapper(ParameterMapper.class);

        User user = new User();
        user.setUsername("Panda");
        user.setPassword("abcd");
        user.setAge(20);
        user.setGender("男");
        user.setEmail("abcd@qq.com");

        mapper.insertUser(user);
    }
}

```

## 5、使用@Param标识参数

可以通过@Param注解标识mapper接口中的方法参数

此时，会将这些参数放在map集合中，以`@Param` 注解的value属性值为键，以参数为值;
以 param1,param2...为键，以参数为值;
只需要通过`${}`和`#{}`访问map集合的键就可以获取相对应的值， 注意`${}`需要手动加单引号

ParameterMapper接口：

```java
public interface ParameterMapper {

    /**
     * 用户登录
     *
     * @param username
     * @param password
     * @return
     */
    User checkLoginByParam(
            @Param("username") String username,
            @Param("password") String password
    );
}

```

对应在ParameterMapper.xml中配置

```xml
<select id="checkLoginByParam" resultType="User">
    select * from t_user where username = #{username} and password = #{password} limit 1
</select>
```

测试类：

```java
public class TestParameterMapper {

    @Test
    public void checkLoginByParam(){
        SqlSession sqlSession = SqlSessionUtil.getSqlSession();
        ParameterMapper mapper = sqlSession.getMapper(ParameterMapper.class);
        User user = mapper.checkLoginByParam("admin", "123456");

        System.out.println(user);
    }
}

```


## 6、总结

建议分成两种情况进行处理

- 实体类类型的参数
- 使用@Param标识参数