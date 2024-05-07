[返回目录](/blog/java/spring-boot/index.md)

# 3、REST开发

## REST风格

全称：Representational State Transfer 表现形式状态转换

是一种约定，不是规范

描述模块的名称通常使用复数，表示一类资源，例如：users、books...

根据REST风格对资源进行访问称为RESTful

1、传统风格

```
GET http://localhost/user/getUserById?id=1
POST http://localhost/user/saveUser
```

2、REST风格

使用行为动作区分对资源的操作

```
GET http://localhost/users        查询全部用户信息
GET http://localhost/users/1      查询指定用户信息
POST http://localhost/users       新增/保存用户信息
PUT http://localhost/users        修改/更新用户信息
DELETE http://localhost/users/1   删除指定用户信息
```

3、REST风格优点

- 隐藏资源的访问行为，无法通过地址得知对资源是何种操作

- 书写简化

## 代码示例

```java
package com.example.demo.controller;

import org.springframework.web.bind.annotation.*;

@RestController
public class UserController {
    @PostMapping("/users")
    public String save(){
        return "save";
    }

    @PutMapping("/users")
    public String update(){
        return "update";
    }

    @DeleteMapping("/users/{id}")
    public String delete(@PathVariable Integer id){
        return "delete id: " + id;
    }

    @GetMapping("/users/{id}")
    public String get(@PathVariable Integer id){
        return "get id: " + id;
    }

    @GetMapping("/users")
    public String getList(){
        return "getList";
    }
}

```

## 请求示例

```
GET http://localhost:8080/users

###

GET http://localhost:8080/users/100

###

DELETE http://localhost:8080/users/100

###

POST http://localhost:8080/users

###

PUT http://localhost:8080/users
```


## 注解区别

- @RequestBody  接收json数据，适用于参数较多
- @RequestParam 接收url地址传参或表单传参
- @PathVariable 接收路径参数，适用于参数较少


## 简化写法

- @RestController 等价于 @Controller + @ResponseBody
- @PostMapping、@PutMapping、@DeleteMapping、@GetMapping

```java
package com.example.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

// @Controller
// @ResponseBody
@RestController
public class UserController {
    // @RequestMapping(value = "/users", method = RequestMethod.POST)
    @PostMapping("/users")
    public String save() {
        return "save";
    }

    //@RequestMapping(value = "/users", method = RequestMethod.PUT)
    @PutMapping("/users")
    public String update() {
        return "update";
    }

    //@RequestMapping(value = "/users/{id}", method = RequestMethod.DELETE)
    @DeleteMapping("/users/{id}")
    public String delete(@PathVariable Integer id) {
        return "delete id: " + id;
    }

    //@RequestMapping(value = "/users/{id}", method = RequestMethod.GET)
    @GetMapping("/users/{id}")
    public String get(@PathVariable Integer id) {
        return "get id: " + id;
    }

    //@RequestMapping(value = "/users", method = RequestMethod.GET)
    @GetMapping("/users")
    public String getList() {
        return "getList";
    }
}
```