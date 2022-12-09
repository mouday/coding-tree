# 员工管理功能

## 新增员工

需求分析

字段
- 账号
- 姓名
- 手机号
- 性别
- 身份证号码

注意点

- username登录账号必须唯一
- status 账号状态，默认1

接口地址 /employee

请求方式 POST

请求参数
```json
{
    "name":"user02",
    "phone":"15212345667",
    "sex":"1",
    "idNumber":"532923455666554434",
    "username":"user02"
}
```

响应数据

```json
{
    "code":1,
    "msg":null,
    "data":null,
    "map":{}
}
```

代码实现

```java
/**
* 添加员工账号
* 清除session
*
* @return R
*/
@PostMapping
public R<String> addEmployee(HttpServletRequest request, @RequestBody Employee employee) {
    log.info("添加员工账号: {}", employee.toString());

    // 设置默认密码，并使用md5加密处理
    employee.setPassword(DigestUtils.md5DigestAsHex("123456".getBytes()));

    employee.setCreateTime(LocalDateTime.now());
    employee.setUpdateTime(LocalDateTime.now());

    // 当前登录的用户ID
    Long employeeId = (Long)request.getSession().getAttribute("employee");
    employee.setCreateUser(employeeId);
    employee.setUpdateUser(employeeId);

    employeeService.save(employee);

    return R.success(null);
}
```

全局异常错误处理

```java
package com.github.mouday.reggie.common;


import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;


/**
 * 全局异常处理，基于AOP
 *
 */
@ControllerAdvice(annotations = {RestController.class, Controller.class})
@ResponseBody
@Slf4j
public class GlobalExceptionHandler {

    /**
     * 异常处理方法
     * @return
     */
    @ExceptionHandler
    public R<String> exceptionHandler(Exception e){
        log.error(e.getMessage());

        String message = e.getMessage();

        if(message.contains("Duplicate entry")){
            message = "数据已存在";
        } else{
            message = "未知错误";
        }

        return R.error(message);
    }
}

```
数据模型

代码开发

功能测试


## 员工信息分页查询

需求分析

- 分页查询
- 搜索姓名

接口地址 /employee/page?page=1&pageSize=10

请求方式 GET


响应数据

```json
{
    "code":1,
    "msg":null,
    "data":{
        "records":[
            {
                "id":"1594332912337494017","username":"user02","name":"user02","password":"e10adc3949ba59abbe56e057f20f883e","phone":"15212345667","sex":"1","idNumber":"532923455666554434","status":1,"createTime":"2022-11-20 22:12:42","updateTime":"2022-11-20 22:12:42","createUser":"1","updateUser":"1"
            }
        ],
        "total":4,
        "size":10,
        "current":1,
        "orders":[],
        "optimizeCountSql":true,
        "hitCount":false,
        "countId":null,
        "maxLimit":null,
        "searchCount":true,
        "pages":1
    },
    "map":{}
}
```

代码开发

配置分页插件

```java
package com.github.mouday.reggie.config;


import com.baomidou.mybatisplus.extension.plugins.MybatisPlusInterceptor;
import com.baomidou.mybatisplus.extension.plugins.inner.PaginationInnerInterceptor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * 配置分页插件
 */
@Configuration
public class MybatisPlusConfig {

    @Bean
    public MybatisPlusInterceptor mybatisPlusInterceptor() {
        MybatisPlusInterceptor interceptor = new MybatisPlusInterceptor();
        interceptor.addInnerInterceptor(new PaginationInnerInterceptor());

        return interceptor;
    }
}

```

```java
/**
* 分页查询员工信息
*
* @param page
* @param pageSize
* @param name
* @return
*/
@GetMapping("/page")
public R<Page> page(int page, int pageSize, String name) {
    log.info("page: {}, pageSize: {}, name: {}", page, pageSize, name);

    // 条件构造器
    LambdaQueryWrapper<Employee> queryWrapper = new LambdaQueryWrapper<>();

    // 添加过滤条件
    if (StringUtils.isNotEmpty(name)) {
        queryWrapper.like(Employee::getName, name);
    }

    // 添加排序
    queryWrapper.orderByDesc(Employee::getUpdateTime);

    // 分页
    Page pageInfo = new Page(page, pageSize);

    // 执行查询
    employeeService.page(pageInfo, queryWrapper);

    return R.success(pageInfo);
}
```
功能测试


## 启用/禁用员工账号

需求分析
- 禁用账号的员工不能登录
- 只有管理员admin才能对员工账号禁用/启用操作


接口地址 /employee

请求方式 PUT

请求参数

```json
{
    "id":"1594332912337494017",
    "status":0
}
```
响应数据

```json
{
    "code":1,
    "msg":null,
    "data":"更新成功",
    "map":{}
}
```

代码开发

```java
/**
 * 更新员工信息
 *
 * @return
 */
@PutMapping
public R<String> update(HttpServletRequest request, @RequestBody Employee employee) {
    // log.info("id: {}, status: {}", employee.getId(), employee.getStatus());

    // 当前登录用户
    Long employeeId = (Long) request.getSession().getAttribute("employee");
    employee.setUpdateUser(employeeId);

    // 设置更新时间
    employee.setUpdateTime(LocalDateTime.now());

    employeeService.updateById(employee);
    return R.success("更新成功");
}
```


功能测试

代码修复
- 前端js接收Long型数据，会出现越界问题，精度丢失

处理：
- 服务端返回Long型数据，统一转为String字符串

设置对象映射器

```java
package com.github.mouday.reggie.common;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.module.SimpleModule;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateDeserializer;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalTimeDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateSerializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalTimeSerializer;
import java.math.BigInteger;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import static com.fasterxml.jackson.databind.DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES;

/**
 * 对象映射器:基于jackson将Java对象转为json，或者将json转为Java对象
 * 将JSON解析为Java对象的过程称为 [从JSON反序列化Java对象]
 * 从Java对象生成JSON的过程称为 [序列化Java对象到JSON]
 */
public class JacksonObjectMapper extends ObjectMapper {

    public static final String DEFAULT_DATE_FORMAT = "yyyy-MM-dd";
    public static final String DEFAULT_DATE_TIME_FORMAT = "yyyy-MM-dd HH:mm:ss";
    public static final String DEFAULT_TIME_FORMAT = "HH:mm:ss";

    public JacksonObjectMapper() {
        super();
        //收到未知属性时不报异常
        this.configure(FAIL_ON_UNKNOWN_PROPERTIES, false);

        //反序列化时，属性不存在的兼容处理
        this.getDeserializationConfig().withoutFeatures(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);


        SimpleModule simpleModule = new SimpleModule()
                .addDeserializer(LocalDateTime.class, new LocalDateTimeDeserializer(DateTimeFormatter.ofPattern(DEFAULT_DATE_TIME_FORMAT)))
                .addDeserializer(LocalDate.class, new LocalDateDeserializer(DateTimeFormatter.ofPattern(DEFAULT_DATE_FORMAT)))
                .addDeserializer(LocalTime.class, new LocalTimeDeserializer(DateTimeFormatter.ofPattern(DEFAULT_TIME_FORMAT)))

                .addSerializer(BigInteger.class, ToStringSerializer.instance)
                .addSerializer(Long.class, ToStringSerializer.instance)
                .addSerializer(LocalDateTime.class, new LocalDateTimeSerializer(DateTimeFormatter.ofPattern(DEFAULT_DATE_TIME_FORMAT)))
                .addSerializer(LocalDate.class, new LocalDateSerializer(DateTimeFormatter.ofPattern(DEFAULT_DATE_FORMAT)))
                .addSerializer(LocalTime.class, new LocalTimeSerializer(DateTimeFormatter.ofPattern(DEFAULT_TIME_FORMAT)));

        //注册功能模块 例如，可以添加自定义序列化器和反序列化器
        this.registerModule(simpleModule);
    }
}

```

扩展消息转换器

```java
package com.github.mouday.reggie.config;

import com.github.mouday.reggie.common.JacksonObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurationSupport;

import java.util.List;

@Slf4j
@Configuration
public class WebMvcConfig extends WebMvcConfigurationSupport {

    /**
     * 扩展消息转换器
     * @param converters
     */
    @Override
    protected void extendMessageConverters(List<HttpMessageConverter<?>> converters) {
        // 创建消息转换器对象
        MappingJackson2HttpMessageConverter messageConverter = new MappingJackson2HttpMessageConverter();
        // 设置对象转换器
        messageConverter.setObjectMapper(new JacksonObjectMapper());
        // 添加到mvc框架消息转换器中，优先使用自定义转换器
        converters.add(0, messageConverter);
    }
}

```
## 编辑员工信息

需求分析

- 根据id回显到页面
- 更新数据复用update方法

接口地址 `/employee/<id>`

请求方式 GET

响应数据

```json
{
    "code":1,
    "msg":null,
    "data":{
        "id":"1594332912337494017",
        "username":"user02",
        "name":"user02",
        "password":"e10adc3949ba59abbe56e057f20f883e",
        "phone":"15212345667",
        "sex":"1",
        "idNumber":"532923455666554434",
        "status":0,
        "createTime":"2022-11-20 22:12:42",
        "updateTime":"2022-11-20 22:20:07",
        "createUser":"1",
        "updateUser":"1"
    },
    "map":{

    }
}
```

代码开发

```java
/**
 * 根据id查询员工信息
 *
 * @param id
 * @return
 */
@GetMapping("/{id}")
public R<Employee> getEmployeeById(@PathVariable Long id) {
    Employee employee = this.employeeService.getById(id);

    if (employee != null) {
        return R.success(employee);
    } else {
        return R.error("数据不存在");
    }
}
```

功能测试
