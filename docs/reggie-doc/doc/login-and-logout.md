

## 后台功能开发

### 登录功能

接口地址 /employee/login

请求方式 POST

请求参数

| 参数 | 类型 | 必须 | 说明
| -  | - | - | -
| username | string | 是 | 用户名
| password | string | 是 | 密码

响应数据

| 参数 | 类型 |  说明
| -  | - | -
| code | int | 用户名
| msg | string | 消息
| data  | string | 数据

代码实现

Entity

```java
package com.github.mouday.reggie.entity;

import com.baomidou.mybatisplus.annotation.FieldFill;
import com.baomidou.mybatisplus.annotation.TableField;
import lombok.Data;
import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 员工实体类
 */
@Data
public class Employee implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long id;

    private String username;

    private String name;

    private String password;

    private String phone;

    private String sex;

    private String idNumber;

    private Integer status;

    private LocalDateTime createTime;

    private LocalDateTime updateTime;

    @TableField(fill = FieldFill.INSERT)
    private Long createUser;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private Long updateUser;

}

```
Mapper

```java
package com.github.mouday.reggie.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.github.mouday.reggie.entity.Employee;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface EmployeeMapper extends BaseMapper<Employee> {
}

```

Service接口

```java
package com.github.mouday.reggie.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.github.mouday.reggie.entity.Employee;

public interface EmployeeService extends IService<Employee> {
}

```

ServiceImpl

```java
package com.github.mouday.reggie.service.impl;


import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.github.mouday.reggie.entity.Employee;
import com.github.mouday.reggie.mapper.EmployeeMapper;
import com.github.mouday.reggie.service.EmployeeService;
import org.springframework.stereotype.Service;

@Service
public class EmployeeServiceImpl
        extends ServiceImpl<EmployeeMapper, Employee>
        implements EmployeeService {
}


```

Controller

```java
package com.github.mouday.reggie.controller;


import com.github.mouday.reggie.service.EmployeeService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/employee")
public class EmployeeController {

    @Autowired
    private EmployeeService employeeService;

}

```

通用返回结果

```java
package com.github.mouday.reggie.common;

import lombok.Data;
import java.util.HashMap;
import java.util.Map;

/**
 * 通用返回结果
 * @param <T>
 */
@Data
public class R<T> {

    private Integer code; //编码：1成功，0和其它数字为失败

    private String msg; //错误信息

    private T data; //数据

    private Map map = new HashMap(); //动态数据

    public static <T> R<T> success(T object) {
        R<T> r = new R<T>();
        r.data = object;
        r.code = 1;
        return r;
    }

    public static <T> R<T> error(String msg) {
        R r = new R();
        r.msg = msg;
        r.code = 0;
        return r;
    }

    public R<T> add(String key, Object value) {
        this.map.put(key, value);
        return this;
    }

}

```

登录页面

http://127.0.0.1:8080/backend/page/login/login.html

登录逻辑实现

```java
/**
* 登录逻辑
* 1、通过username查数据库
* 2、校验密码password md5加密
* 3、判断账号是否可用 status
* 4、登录成功
*
* @param employee
* @return
*/
@PostMapping("/login")
public R<Employee> login(HttpServletRequest request, @RequestBody Employee employee) {
    // 1、通过username查数据库
    LambdaQueryWrapper<Employee> queryWrapper = new LambdaQueryWrapper<>();
    queryWrapper.eq(Employee::getUsername, employee.getUsername());
    Employee employeeRow = employeeService.getOne(queryWrapper);

    if (employeeRow == null) {
        return R.error("登录失败");
    }

    // 2、校验密码password md5加密
    String password = employee.getPassword();
    password = DigestUtils.md5DigestAsHex(password.getBytes());

    if (!employeeRow.getPassword().equals(password)) {
        return R.error("登录失败");
    }

    // 3、判断账号是否可用 status
    if (employeeRow.getStatus() == 0) {
        return R.error("账号已禁用");
    }

    // 4、登录成功
    request.getSession().setAttribute("employee", employeeRow.getId());

    return R.success(employeeRow);
}
```

### 退出功能

接口地址 /employee/logout

请求方式 POST

请求参数

无

响应数据

无

代码实现
```java
/**
* 退出逻辑
* 清除session
*
* @return R
*/
@PostMapping("/logout")
public R<Employee> logout(HttpServletRequest request) {

    request.getSession().removeAttribute("employee");

    return R.success(null);
}
```

### 完善登录功能

过滤器或者拦截器限制未登录用户查看页面

登录拦截器

```java
package com.github.mouday.reggie.filter;

import com.alibaba.fastjson.JSON;
import com.github.mouday.reggie.common.R;
import lombok.extern.slf4j.Slf4j;
import org.springframework.util.AntPathMatcher;

import javax.servlet.*;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * 检查用户是否已登录
 */
@WebFilter(filterName = "loginCheckFilter", urlPatterns = "/*")
@Slf4j
public class LoginCheckFilter implements Filter {

    // 路径匹配器
    private static final AntPathMatcher PATH_MATCHER = new AntPathMatcher();

    // 白名单
    private static String[] whiteListUrls = new String[]{
            "/employee/login",
            "/employee/logout",
            "/backend/**",
            "/front/**",
    };

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {

        HttpServletRequest request = (HttpServletRequest) servletRequest;
        HttpServletResponse response = (HttpServletResponse) servletResponse;


        // 1、获取请求uri
        String requestURI = request.getRequestURI();
        log.info("LoginCheckFilter requestURI: {}", requestURI);


        // 2、白名单放行
        if (this.isWhiteUrl(requestURI)) {
            filterChain.doFilter(request, response);
            return;
        }

        // 3、非白名单登录后放行
        if(request.getSession().getAttribute("employee") != null){
            filterChain.doFilter(request, response);
            return;
        }

        // 4、未登录，返回与前端约定好跳转登录的标识
        response.getWriter().write(JSON.toJSONString(R.error("NOTLOGIN")));

    }

    /**
     * 检查路径是否是白名单
     *
     * @param url
     * @return
     */
    private boolean isWhiteUrl(String url) {
        for (String whiteUrl : whiteListUrls) {
            boolean match = PATH_MATCHER.match(whiteUrl, url);
            if (match) {
                return true;
            }

        }

        return false;
    }
}

```

启动类添加注解`ServletComponentScan`

```java
package com.github.mouday.reggie;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.ServletComponentScan;


@Slf4j
@SpringBootApplication
@ServletComponentScan
public class ReggieApplication {
    public static void main(String[] args) {
        SpringApplication.run(ReggieApplication.class, args);
        log.info("项目启动成功：http://127.0.0.1:8080");
    }
}

```