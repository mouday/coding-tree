[返回目录](/blog/mybatis/index.md)

# 十二、MyBatis 的分页插件

添加依赖

```xml
<!-- 分页插件 -->
<dependency>
    <groupId>com.github.pagehelper</groupId>
    <artifactId>pagehelper</artifactId>
    <version>5.2.0</version>
</dependency>
```

配置分页插件

在 MyBatis 的核心配置文件（mybatis-config.xml）中配置插件

```xml
<plugins>
    <!--设置分页插件-->
    <plugin interceptor="com.github.pagehelper.PageInterceptor"></plugin>
</plugins>
```

方法签名

```java
/**
 * 开始分页
 *
 * @param pageNum  页码
 * @param pageSize 每页显示数量
 */
public static <E> Page<E> startPage(int pageNum, int pageSize);
```

使用示例

使用 PageHelper

```java

public class EmpMapperTest {

    @Test
    public void selectByExamplePage() {
        SqlSession sqlSession = SqlSessionUtil.getSqlSession();
        EmpMapper mapper = sqlSession.getMapper(EmpMapper.class);

        mapper.selectByExample(null);
        // select eid, emp_name, age, sex, email, did from t_emp

        // 使用分页
        PageHelper.startPage(3, 2);
        mapper.selectByExample(null);
        // SELECT count(0) FROM t_emp
        // select eid, emp_name, age, sex, email, did from t_emp LIMIT ?, ?
        // 4, 2
    }
}
```

使用 PageInfo

```java
public class EmpMapperTest {

    @Test
    public void selectByExamplePage() {
        SqlSession sqlSession = SqlSessionUtil.getSqlSession();
        EmpMapper mapper = sqlSession.getMapper(EmpMapper.class);

        // 使用分页
        Page<Emp> page = PageHelper.startPage(3, 2);
        mapper.selectByExample(null);
        // SELECT count(0) FROM t_emp
        // select eid, emp_name, age, sex, email, did from t_emp LIMIT ?, ?
        // 4, 2
        // 
        PageInfo<Emp> pageInfo = page.toPageInfo();

        JsonUtil.prettyPrint(pageInfo);

    }
}
```

输出结果

```json
{
  "total": 8,
  "list": [
    {
      "eid": 5,
      "empName": "关羽",
      "age": 23,
      "sex": "男",
      "email": "guan@126.com",
      "did": 1
    },
    {
      "eid": 6,
      "empName": "Tom",
      "age": 12,
      "sex": "女",
      "email": "123@gmail.com",
      "did": null
    }
  ],
  "pageNum": 3,
  "pageSize": 2,
  "size": 2,
  "startRow": 5,
  "endRow": 6,
  "pages": 4,
  "prePage": 2,
  "nextPage": 4,
  "isFirstPage": false,
  "isLastPage": false,
  "hasPreviousPage": true,
  "hasNextPage": true,
  "navigatePages": 8,
  "navigatepageNums": [1, 2, 3, 4],
  "navigateFirstPage": 1,
  "navigateLastPage": 4
}
```

常用数据：

- pageNum：当前页的页码
- pageSize：每页显示的条数
- size：当前页显示的真实条数
- total：总记录数
- pages：总页数
- prePage：上一页的页码
- nextPage：下一页的页码
- isFirstPage/isLastPage：是否为第一页/最后一页
- hasPreviousPage/hasNextPage：是否存在上一页/下一页
- navigatePages：导航分页的页码数
- navigatepageNums：导航分页的页码，`[1,2,3,4,5]`

