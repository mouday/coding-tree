[返回目录](/blog/mybatis/index.md)

# 七、特殊 SQL 的执行

## 1、模糊查询

```java
public interface SqlMapper {

    /**
     * 根据用户名进行模糊查询
     * @param username
     * @return
     */
    List<User> getUserByLikeUsername(@Param("username") String username);
}
```

```xml
<!-- List<User> getUserByLikeUsername(@Param("username") String username);-->
<select id="getUserByLikeUsername" resultType="User">
    <!--select * from t_user where username like "%"#{username}"%"-->
    <!--select * from t_user where username like '%${username}%'-->
    select * from t_user where username like concat('%', #{username}, '%')
</select>

```

```java
public class SqlMapperTest {

    @Test
    public void getUserByLikeUsername() {
        SqlSession sqlSession = SqlSessionUtil.getSqlSession();
        SelectMapper mapper = sqlSession.getMapper(SelectMapper.class);
        List<User> users = mapper.getUserByLikeUsername("ad");

        JsonUtil.prettyPrint(users);
    }
}
```

转为 json 后查看

```json
[
  {
    "id": 2,
    "username": "admin",
    "password": "123456",
    "age": 23,
    "gender": "男",
    "email": "123456@qq.com"
  },
  {
    "id": 3,
    "username": "admin",
    "password": "123456",
    "age": 23,
    "gender": "男",
    "email": "123456@qq.com"
  }
]
```

## 2、批量删除

```java
public interface SqlMapper {

    /**
     * 批量删除
     * @param ids
     * @return
     */
    int deleteBatch(@Param("ids") String ids);
}
```

```xml
<!-- int deleteBatch(@Param("ids") String ids);-->
<delete id="deleteBatch">
    delete from t_user where id in (${ids})
</delete>
```

```java
public class SqlMapperTest {

    @Test
    public void deleteBatch() {
        SqlSession sqlSession = SqlSessionUtil.getSqlSession();
        SqlMapper mapper = sqlSession.getMapper(SqlMapper.class);
        int count = mapper.deleteBatch("1,2,3");

        System.out.println(count);
    }
}
```

## 3、动态设置表名

只能使用${}，因为表名不能加单引号


```java
public interface SqlMapper {

    /**
     * 查询指定表中的数据
     * @param tableName
     * @return
     */
    List<User> getUserByTable(@Param("tableName") String tableName);

}
```

```xml
<!--  List<User> getUserByTable(@Param("tableName") String tableName);-->
<select id="getUserByTable" resultType="User">
    select * from ${tableName}
</select>
```

```java
public class SqlMapperTest {

    @Test
    public void getUserByTable() {
        SqlSession sqlSession = SqlSessionUtil.getSqlSession();
        SqlMapper mapper = sqlSession.getMapper(SqlMapper.class);
        List<User> users = mapper.getUserByTable("t_user");

        JsonUtil.prettyPrint(users);
    }
}
```

```json
[
  {
    "id": 4,
    "username": "admin",
    "password": "123456",
    "age": 23,
    "gender": "男",
    "email": "123456@qq.com"
  },
  {
    "id": 5,
    "username": "admin",
    "password": "123456",
    "age": 23,
    "gender": "男",
    "email": "123456@qq.com"
  }
]
```

## 4、获取自增的主键

```java
public interface SqlMapper {

    /**
     * 新增数据
     * @param user
     */
    void insertUser(User user);

}
```

```xml
<!-- void insertUser(User user);-->
<insert id="insertUser" useGeneratedKeys="true" keyProperty="id">
    insert into t_user (
        username, password, age, gender, email
    )
    values (
        #{username}, #{password}, #{age}, #{gender}, #{email}
    )
</insert>
```

- useGeneratedKeys    设置当前标签中的sql使用了自增的主键 (id)
- keyProperty         将自增的主键的值 赋值给 传输到映射文件中的参数的某个属性（user.id）


```java
public class SqlMapperTest {

    @Test
    public void insertUser() {
        SqlSession sqlSession = SqlSessionUtil.getSqlSession();
        SqlMapper mapper = sqlSession.getMapper(SqlMapper.class);

        User user = new User();
        user.setUsername("Panda");
        user.setPassword("abcd");
        user.setAge(20);
        user.setGender("男");
        user.setEmail("abcd@qq.com");

        mapper.insertUser(user);

        JsonUtil.prettyPrint(user);

    }
}
```

```json
{
  "id" : 9,
  "username" : "Panda",
  "password" : "abcd",
  "age" : 20,
  "gender" : "男",
  "email" : "abcd@qq.com"
}
```
