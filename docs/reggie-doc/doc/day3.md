# 分类管理

- 公共字段自动填充
- 新增分类
- 分类信息分页查询
- 删除分类
- 修改分类

## 公共字段自动填充

1、问题分析

数据表中存在公共字段：

- 创建时间
- 更新时间
- 创建人
- 更新人

希望每次都由程序自动处理

代码实现

公共字段自动填充，插入数据或更新的时候，为指定字段赋值

统一处理，避免重复代码

实现步骤
- 实体类属性上加注解：@TableField
- 实现MetaObjectHandler接口，编写元数据对象处理器

自定义数据填充

```java
package com.github.mouday.reggie.common;

import com.baomidou.mybatisplus.core.handlers.MetaObjectHandler;
import lombok.extern.slf4j.Slf4j;
import org.apache.ibatis.reflection.MetaObject;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

/**
 * 自动填充元数据
 */
@Component
@Slf4j
public class MyMetaObjectHandler implements MetaObjectHandler {
    /**
     * 插入时自动填充
     * @param metaObject
     */
    @Override
    public void insertFill(MetaObject metaObject) {
        metaObject.setValue("createTime", LocalDateTime.now());
        metaObject.setValue("updateTime", LocalDateTime.now());
        metaObject.setValue("createUser", new Long(1));
        metaObject.setValue("updateUser", new Long(1));

    }

    /**
     * 更新时自动填充
     * @param metaObject
     */
    @Override
    public void updateFill(MetaObject metaObject) {
        metaObject.setValue("updateTime", LocalDateTime.now());
        metaObject.setValue("updateUser", new Long(1));
    }
}

```

可以将控制器中手动填充的代码注释

功能测试
功能完善


检查线程id
```java
long id = Thread.currentThread().getId();
log.info("Thread id: {}", id);
```

ThreadLocal 为每个线程提供单独的一份存储空间，可以隔离不同线程之间的数据

功能完善
- 1、编写BaseContext工具类，基于ThreadLocal封装的工具类
- 2、在LoginCheckFilter的doFilter方法中调用BaseContext来设置当前登录用户的id
- 3、在MyMetaObjectHandler的方法中调用BaseContext获取当前登录用户的id

```java
package com.github.mouday.reggie.common;


/**
 * 基于ThreadLocal封装的工具类
 * 用于保存和获取当前登录用户id
 */
public class BaseContext {
    private static ThreadLocal<Long> threadLocal = new ThreadLocal<>();

    public static void setCurrentId(Long id) {
        threadLocal.set(id);
    }

    public static Long getCurrentId() {
        return threadLocal.get();
    }
}

```

## 新增分类

需求分析

- 添加菜品分类
- 添加套餐分类

数据模型

- id 主键
- type 标志位：1 菜品分类 2 套餐分类
- name 名称 唯一约束 idx_category_name
- sort 排序
- create_time
- update_time
- create_user
- update_user

代码开发

- 实体类 Category
- Mapper 接口 CategoryMapper
- 业务层接口 CategoryService
- 业务层接口实现类 CategoryServiceImpl
- 控制层 CategoryController

```java
/**
 * 新增分类
 * @return
 */
@PostMapping
public R<String> addCategory(@RequestBody Category category){
    log.info("category: {}", category);

    categoryService.save(category);

    return R.success("新增分类成功");
}
```

功能测试

## 分类信息分页查询

需求分析


代码实现

```java
@GetMapping("/page")
public R<Page> getCategoryList(int page, int pageSize){
    Page<Category> pageInfo = new Page<>(page, pageSize);

    LambdaQueryWrapper<Category> queryWrapper = new LambdaQueryWrapper<>();
    queryWrapper.orderByDesc(Category::getSort);

    categoryService.page(pageInfo, queryWrapper);

    return  R.success(pageInfo);
}

```

功能测试

## 删除分类

需求分析

- 注意：如果分类关联了菜品就不允许删除

代码实现

```java
/**
* 根据id 删除分类
* @param ids
* @return
*/
@DeleteMapping
public R<String> deleteCategoryById(Long ids){
    log.info("deleteCategoryById: {}", ids);

    categoryService.removeById(ids);

    return R.success("分类删除成功");
}
```

功能测试

功能完善

```java
package com.github.mouday.reggie.common;

/**
 * 自定义业务异常
 */
public class CustomException extends RuntimeException {
    public CustomException(String message) {
        super(message);
    }
}

```

```java
/**
* 移除分类
*
* @param id
*/
@Override
public void remove(Long id) {
    // 如果关联菜品，抛出异常
    if(dishService.hasCategory(id)){
        throw new CustomException("已经关联菜品，不能删除分类");
    }

    // 如果关联套餐，抛出异常
    if(setMealService.hasCategory(id)){
        throw new CustomException("已经关联套餐，不能删除分类");
    }

    // 删除分类
    this.removeById(id);
}
```

## 修改分类

- 需求分析
- 代码开发
```java
/**
* 更新分类
*/
@PutMapping
public R<String> updateCategoryById(@RequestBody Category category) {
    categoryService.updateById(category);
    return R.success("更新成功");
}
```
- 功能测试