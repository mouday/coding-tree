[返回目录](/blog/mybatis/index.md)

# 六、MyBatis 的各种查询功能

1. 若查询出的数据`只有一条`，可以通过 实体类对象 / list 集合 / map 集合 来接收
2. 若查询处的数据`有多条`，一定不能通过实体类对象来接收，此时会抛出 TooManyResultsException

为方便查看查询结果引入 json 依赖

```xml
<!--json-->
<dependency>
    <groupId>com.fasterxml.jackson.core</groupId>
    <artifactId>jackson-databind</artifactId>
    <version>2.10.0</version>
</dependency>
```

建立工具类

```java
package com.atguigu.mybatis.utils;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;

public class JsonUtil {
    /**
     * 美化输出
     */
    public static void prettyPrint(Object obj) {
        ObjectMapper objectMapper = new ObjectMapper();

        try {
            String json = objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(obj);
            System.out.println(json);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
    }
}

```

## 1、查询一个实体类对象

```java
public interface SelectMapper {
    /**
     * 根据id查询用户信息
     */
    User getUserById(@Param("id") Integer id);
}
```

```xml
<select id="getUserById" resultType="User">
    select * from t_user where id = #{id}
</select>
```

```java
public class SelectMapperTest {

    @Test
    public void getUserById() {
        SqlSession sqlSession = SqlSessionUtil.getSqlSession();
        SelectMapper mapper = sqlSession.getMapper(SelectMapper.class);
        User user = mapper.getUserById(2);
        JsonUtil.prettyPrint(user);
    }
}
```

```json
{
  "id": 2,
  "username": "admin",
  "password": "123456",
  "age": 23,
  "gender": "男",
  "email": "123456@qq.com"
}
```

## 2、查询一个 list 集合

```java
public interface SelectMapper {
    /**
     * 查询所有用户信息
     */
    List<User> getAllUser();
}

```

```xml
<!--List<User> getAllUser();-->
<select id="getAllUser" resultType="User">
    select * from t_user
</select>
```

```java
public class SelectMapperTest {

    @Test
    public void getAllUser() {

        SqlSession sqlSession = SqlSessionUtil.getSqlSession();
        SelectMapper mapper = sqlSession.getMapper(SelectMapper.class);
        List<User> allUser = mapper.getAllUser();
        JsonUtil.prettyPrint(allUser);

    }
}
```

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

## 3、查询单个数据

```java
public interface SelectMapper {

    /**
     * 查询用户信息的总记录数
     */
    Integer getCount();
}
```

```xml
<!--Integer getCount()-->
<!-- integer写大小写都可以，写 Integer/integer/_int/_integer  都可以，都是java.lang.Integer的别名 -->
<select id="getCount" resultType="integer">
    select count(*) from t_user
</select>

```

```java
public class SelectMapperTest {

    @Test
    public void getCount() {
        SqlSession sqlSession = SqlSessionUtil.getSqlSession();
        SelectMapper mapper = sqlSession.getMapper(SelectMapper.class);
        Integer count = mapper.getCount();
        System.out.println(count);
    }
}
```

常用类型别名

| 映射的类型 | 别名             |
| ---------- | ---------------- |
| Integer    | int、integer     |
| int        | \_int、\_integer |
| Map        | map              |
| String     | string           |

类型别名

| 别名                       | 映射的类型   |
| -------------------------- | ------------ |
| \_byte                     | byte         |
| \_char (since 3.5.10)      | char         |
| \_character (since 3.5.10) | char         |
| \_long                     | long         |
| \_short                    | short        |
| \_int                      | int          |
| \_integer                  | int          |
| \_double                   | double       |
| \_float                    | float        |
| \_boolean                  | boolean      |
| string                     | String       |
| byte                       | Byte         |
| char (since 3.5.10)        | Character    |
| character (since 3.5.10)   | Character    |
| long                       | Long         |
| short                      | Short        |
| int                        | Integer      |
| integer                    | Integer      |
| double                     | Double       |
| float                      | Float        |
| boolean                    | Boolean      |
| date                       | Date         |
| decimal                    | BigDecimal   |
| bigdecimal                 | BigDecimal   |
| biginteger                 | BigInteger   |
| object                     | Object       |
| date[]                     | Date[]       |
| decimal[]                  | BigDecimal[] |
| bigdecimal[]               | BigDecimal[] |
| biginteger[]               | BigInteger[] |
| object[]                   | Object[]     |
| map                        | Map          |
| hashmap                    | HashMap      |
| list                       | List         |
| arraylist                  | ArrayList    |
| collection                 | Collection   |
| iterator                   | Iterator     |

## 4、查询一条数据为 map 集合

```java
public interface SelectMapper {

    /**
     * 根据用户id查询用户信息为map集合
     * @param id
     * @return
     */
    Map<String, Object> getUserByIdToMap(@Param("id") Integer id);
}
```

```xml
<!-- Map<String, Object> getUserByIdToMap(@Param("id") Integer id)-->
<select id="getUserByIdToMap" resultType="map">
    select * from t_user where id = #{id}
</select>
```

```java
public class SelectMapperTest {

    @Test
    public void getUserByIdToMap() {
        SqlSession sqlSession = SqlSessionUtil.getSqlSession();
        SelectMapper mapper = sqlSession.getMapper(SelectMapper.class);
        Map<String, Object> user = mapper.getUserByIdToMap(2);
        JsonUtil.prettyPrint(user);
    }
}
```

```json
{
  "password": "123456",
  "gender": "男",
  "id": 2,
  "age": 23,
  "email": "123456@qq.com",
  "username": "admin"
}
```

## 5、查询多条数据为 map 集合

```java
public interface SelectMapper {

    /**
     * 查询所有用户信息为map集合
     * @return
     */
    List<Map<String, Object>> getAllUserToMap();
}
```

```xml
<!-- List<Map<String, Object>> getAllUserToMap() -->
<select id="getAllUserToMap" resultType="map">
    select * from t_user
</select>
```

```java
public class SelectMapperTest {

    @Test
    public void getAllUserToMap() {
        SqlSession sqlSession = SqlSessionUtil.getSqlSession();
        SelectMapper mapper = sqlSession.getMapper(SelectMapper.class);
        List<Map<String, Object>> allUserToMap = mapper.getAllUserToMap();
        // allUserToMap.forEach(System.out::println);
        JsonUtil.prettyPrint(allUserToMap);
    }
}
```

```json
[
  {
    "password": "123456",
    "gender": "男",
    "id": 2,
    "age": 23,
    "email": "123456@qq.com",
    "username": "admin"
  },
  {
    "password": "123456",
    "gender": "男",
    "id": 3,
    "age": 23,
    "email": "123456@qq.com",
    "username": "admin"
  }
]
```

## 6、查询多条数据为 MapKey

通过@MapKey 注解设置 map 集合的键，值是每条数据所对应的 map 集合

```java
public interface SelectMapper {

    /**
     * 查询所有用户信息为MapKey集合
     * @return
     */
    @MapKey("id")
    Map<String, Object> getAllUserToMapKey();
}
```

```xml
<!-- Map<String, Object> getAllUserToMapKey()-->
<select id="getAllUserToMapKey" resultType="map">
    select * from t_user
</select>
```

```java
public class SelectMapperTest {

    @Test
    public void getAllUserToMapKey() throws JsonProcessingException {
        SqlSession sqlSession = SqlSessionUtil.getSqlSession();
        SelectMapper mapper = sqlSession.getMapper(SelectMapper.class);
        Map<String, Object> allUserToMapKey = mapper.getAllUserToMapKey();

        ObjectMapper objectMapper = new ObjectMapper();
        String json = objectMapper.writeValueAsString(allUserToMapKey);
        System.out.println(json);
    }
}
```

转为 json 后查看

```json
{
  "2": {
    "password": "123456",
    "gender": "男",
    "id": 2,
    "age": 23,
    "email": "123456@qq.com",
    "username": "admin"
  },
  "3": {
    "password": "123456",
    "gender": "男",
    "id": 3,
    "age": 23,
    "email": "123456@qq.com",
    "username": "admin"
  }
}
```
