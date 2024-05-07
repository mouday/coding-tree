[返回目录](/blog/mybatis/index.md)

# 四、MyBatis的增删改查

完整的目录结构

```bash
$ pwd
mybatis-demo

$ tree -I target
.
└── mybatis-demo-1
    ├── pom.xml
    └── src
        ├── main
        │   ├── java
        │   │   └── com
        │   │       └── atguigu
        │   │           └── mybatis
        │   │               ├── mapper
        │   │               │   ├── UserMapper.java
        │   │               │   └── xml
        │   │               │       └── UserMapper.xml
        │   │               └── pojo
        │   │                   └── User.java
        │   └── resources
        │       ├── log4j.xml
        │       └── mybatis-config.xml
        └── test
            └── java
                └── com
                    └── atguigu
                        └── mybatis
                            └── mapper
                                └── UserMapperTest.java

```

UserMapper.class

```java
package com.atguigu.mybatis.mapper;

import com.atguigu.mybatis.pojo.User;

import java.util.List;

public interface UserMapper {
    /**
     * 添加用户信息
     */
    int insertUser();

    /**
     * 更新用户信息
     * @return
     */
    int updateUser();

    /**
     * 删除用户数据
     * @return
     */
    int deleteUser();

    /**
     * 查询单个用户
     * @return
     */
    User getUserById();

    /**
     * 查询所有用户
     * @return
     */
    List<User> getAllUser();
}

```

UserMapper.xml

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.atguigu.mybatis.mapper.UserMapper">

    <!-- 添加用户信息 -->
    <insert id="insertUser">
        insert into
            t_user
            (username, password, age, gender, email)
        values
            ('admin','123456',23,'男', "123456@qq.com")
    </insert>

    <!-- 更新用户信息 -->
    <update id="updateUser">
        update
            t_user
        set
            username = "张三"
        where
            id = 1
    </update>


    <!-- 删除用户数据 -->
    <delete id="deleteUser">
        delete from
            t_user
        where
            id = 1
    </delete>

    <!-- 查询单个用户 -->
    <select id="getUserById" resultType="com.atguigu.mybatis.pojo.User">
        select
            *
        from
            t_user
        where
            id = 3
    </select>

    <!--查询所有用户-->
    <select id="getAllUser" resultType="com.atguigu.mybatis.pojo.User">
        select * from t_user
    </select>
</mapper>
```

查询功能的标签必须设置resultType或者resultMap

- resultType：设置默认的映射关系
- resultMap：设置自定义的映射关系（字段名和表头不一样）


测试类

```java
package com.atguigu.mybatis.mapper;

import com.atguigu.mybatis.pojo.User;
import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;
import org.junit.Test;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

public class UserMapperTest {
    /**
     * 添加用户信息
     * @throws IOException
     */
    @Test
    public void testInsertUser() throws IOException {
        //加载核心配置文件
        InputStream is = Resources.getResourceAsStream("mybatis-config.xml");
        //获取sqlsessionfactorybuilder
        SqlSessionFactoryBuilder sqlSessionFactoryBuilder = new SqlSessionFactoryBuilder();
        //获取factory
        SqlSessionFactory sqlSessionFactory = sqlSessionFactoryBuilder.build(is);
        //获取sqlsession
        SqlSession sqlSession = sqlSessionFactory.openSession(true);
        //获取mapper接口对象
        UserMapper mapper = sqlSession.getMapper(UserMapper.class); //代理模式

        //测试功能
        int result = mapper.insertUser();

        System.out.println("result: " + result);
        // result: 1
    }

    /**
     * 更新用户信息
     * @throws IOException
     */
    @Test
    public void testUpdate() throws IOException {
        InputStream resourceAsStream = Resources.getResourceAsStream("mybatis-config.xml");

        SqlSessionFactoryBuilder sqlSessionFactoryBuilder = new SqlSessionFactoryBuilder();
        SqlSessionFactory sqlSessionFactory = sqlSessionFactoryBuilder.build(resourceAsStream);

        SqlSession sqlSession = sqlSessionFactory.openSession(true);
        UserMapper mapper = sqlSession.getMapper(UserMapper.class);
        mapper.updateUser();

    }

    /**
     * 删除用户数据
     * @throws IOException
     */
    @Test
    public void testDelete() throws IOException {
        InputStream resourceAsStream = Resources.getResourceAsStream("mybatis-config.xml");
        SqlSessionFactoryBuilder sqlSessionFactoryBuilder = new SqlSessionFactoryBuilder();
        SqlSessionFactory sqlSessionFactory = sqlSessionFactoryBuilder.build(resourceAsStream);
        SqlSession sqlSession = sqlSessionFactory.openSession(true);
        UserMapper mapper = sqlSession.getMapper(UserMapper.class);
        mapper.deleteUser();
    }

    /**
     * 查询单个用户
     * @throws IOException
     */
    @Test
    public void testGetUserById() throws IOException {
        InputStream resourceAsStream = Resources.getResourceAsStream("mybatis-config.xml");
        SqlSessionFactoryBuilder sqlSessionFactoryBuilder = new SqlSessionFactoryBuilder();
        SqlSessionFactory sqlSessionFactory = sqlSessionFactoryBuilder.build(resourceAsStream);
        SqlSession sqlSession = sqlSessionFactory.openSession(true);
        UserMapper mapper = sqlSession.getMapper(UserMapper.class);
        User user = mapper.getUserById();
        System.out.println(user);
    }

    /**
     * 查询所有用户
     * @throws IOException
     */
    @Test
    public void testGetAllUser() throws IOException {
        InputStream resourceAsStream = Resources.getResourceAsStream("mybatis-config.xml");
        SqlSessionFactoryBuilder sqlSessionFactoryBuilder = new SqlSessionFactoryBuilder();
        SqlSessionFactory sqlSessionFactory = sqlSessionFactoryBuilder.build(resourceAsStream);
        SqlSession sqlSession = sqlSessionFactory.openSession(true);
        UserMapper mapper = sqlSession.getMapper(UserMapper.class);
        List<User> allUser = mapper.getAllUser();

        allUser.forEach(System.out::println);
    }
}
```
