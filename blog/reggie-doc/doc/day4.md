# 菜品管理

- 文件上传下载
- 新增菜品
- 菜品信息分页
- 修改菜品

## 文件上传下载

1、文件上传

upload

form 表单参数：

```
method=post
enctype=multipart/form-data
type=file
```

服务端

组件

- commons-fileupload
- commons-io

spring-web对文件上传进行了封装

前端浏览需要配置静态资源路由

```java
// class WebMvcConfig
// upload
registry.addResourceHandler("/upload/**")
        .addResourceLocations("file:upload/");
```

2、文件下载

download

下载形式

- 附件形式下载，保存对话框
- 直接在浏览器中打开


3、文件上传代码实现

前端代码
```html
<form action="/upload" method="post" enctype="multipart/form-data">
    <input type="file" name="file">
    <input type="submit" value="提交">
</form>
```

4、文件下载代码实现

```java
package com.github.mouday.reggie.controller;

import com.github.mouday.reggie.common.R;
import com.github.mouday.reggie.common.UploadFile;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;

@RestController
@RequestMapping("/common")
@Slf4j
public class CommonController {

    @Value("${application.public-dirname}")
    private String publicDirname;


    @Value("${application.upload-dirname}")
    private String uploadDirname;


    /**
     * 文件上传
     *
     * @param file
     * @return
     * @url http://127.0.0.1:8080/backend/page/common/upload.html
     */
    @PostMapping("/upload")
    public R<String> uploadFile(MultipartFile file) throws IOException {
        // file 是一个临时文件
        log.info("file: {}", file);

        String originalFilename = file.getOriginalFilename();

        String filename = UploadFile.getUploadFilename(originalFilename);

        // 转存文件
        file.transferTo(new File(UploadFile.getUploadDirectory(), filename));

        return R.success(filename);
    }


    /**
     * 文件下载
     *
     */
    @GetMapping("/download")
    public void downloadFile(String name, HttpServletResponse response) throws IOException {
        log.info("name: {}", name);

        // 输入流 读取文件
        FileInputStream inputStream = new FileInputStream(new File(UploadFile.getUploadDirectory(), name));

        // 输出流 将文件写回浏览器
        ServletOutputStream outputStream = response.getOutputStream();
        response.setContentType("image/jpeg");

        int len = 0;
        byte[] bytes = new byte[1024];

        while (true) {
            len = inputStream.read(bytes);
            if (len == -1) {
                break;
            }
            outputStream.write(bytes, 0, len);
            outputStream.flush();
        }

        // 关闭资源
        outputStream.close();
        inputStream.close();
    }
}

```

公共类

```java
package com.github.mouday.reggie.common;

import java.io.File;
import java.util.UUID;

public class UploadFile {
    /**
     * 获取文件保存路径
     * 参考：https://www.bbsmax.com/A/GBJrE67Wz0/
     *
     * @return File
     */
    public static File getUploadDirectory() {

        // 获取目录
        File path = new File("");

        System.out.println("path:" + path.getAbsolutePath());

        File upload = new File(path.getAbsolutePath(), "upload");

        // 不存在则创建
        if (!upload.exists()) {
            upload.mkdirs();
        }

        return upload;
    }

    public static String getUploadFilename(String originalFilename) {
        String suffix = UploadFile.getFilenameSuffix(originalFilename);

        // 使用uuid生成文件名，防止文件名重复造成文件覆盖
        String filename = UUID.randomUUID().toString() + suffix;

        return filename;
    }

    /**
     * 获取文件名后缀，带有.
     *
     * @param filename
     * @return
     */
    public static String getFilenameSuffix(String filename) {
        if (filename == null) {
            return null;
        }

        return filename.substring(filename.lastIndexOf("."));
    }
}

```



## 新增菜品

需求分析

- 添加菜品，选择菜品分类
- 上传菜品图片

数据模型

- dish 菜品表
- dish_flavor 菜品口味表

代码开发

- 实体类 DishFlavor
- Mapper接口 DishFlavorMapper
- 业务层接口 DishFlavorService
- 业务层实现类 DishFlavorServiceImpl
- 控制层 DishFlavorController

DTO 
- Data Transfer Object 数据传输对象
- 用于展示层与服务层之间数据传输

开启事务支持
```java
@EnableTransactionManagement
public class ReggieApplication {}
```

```java
/**
 * 添加菜品
 *
 * @param dishDto
 * @return
 */
@PostMapping
public R<String> addDish(@RequestBody DishDto dishDto) {
    log.info(dishDto.toString());

    dishService.saveDishWithDishFlavor(dishDto);

    return R.success(null);
}
```
```java
/**
 * 保存菜品 和 对应的口味数据
 * @param dishDto
 * @return
 */
@Transactional
@Override
public void saveDishWithDishFlavor(DishDto dishDto) {

    // 保存菜品
    this.save(dishDto);

    // 保存菜品对应的口味数据
    Long dishId = dishDto.getId();

    List<DishFlavor> list = dishDto.getFlavors().stream().map(item -> {
        item.setDishId(dishId);
        return item;
    }).collect(Collectors.toList());

    dishFlavorService.saveBatch(list);
}
```

功能测试


## 菜品分页查询

需求分析

- 菜品基本信息和分类名称

代码开发
```java
/**
* 菜品分页
*/
@GetMapping("/page")
public R<Page> getDishList(int page, int pageSize, String name) {

    // 条件构造器
    LambdaQueryWrapper<Dish> queryWrapper = new LambdaQueryWrapper<>();

    if (StringUtils.isNotBlank(name)) {
        queryWrapper.like(Dish::getName, name);
    }

    // 排序
    queryWrapper.orderByDesc(Dish::getUpdateTime)
            .orderByDesc(Dish::getId);

    // 分页
    Page<Dish> pageInfo = new Page<>(page, pageSize);

    // 查询
    dishService.page(pageInfo, queryWrapper);

    // 查询分类名称
    Page<DishDto> dishDtoPageInfo = new Page<>();

    // 对象拷贝
    BeanUtils.copyProperties(pageInfo, dishDtoPageInfo, "records");

    List<Dish> dishRecords = pageInfo.getRecords();

    // N + 1 次查询
    // List<DishDto> dishDtoRecords = dishRecords.stream().map(item -> {
    //
    //     DishDto dishDto = new DishDto();
    //     BeanUtils.copyProperties(item, dishDto);
    //
    //     Long categoryId = item.getCategoryId();
    //     Category category = categoryService.getById(categoryId);
    //
    //     if (category != null) {
    //         dishDto.setCategoryName(category.getName());
    //     }
    //
    //     return dishDto;
    // }).collect(Collectors.toList());

    // 优化 2次 查询
    // 取 Category.id
    Set<Long> categoryIds = dishRecords.stream()
            .map(Dish::getCategoryId).filter(item -> {
                return item != null;
            }).collect(Collectors.toSet());

    // 取映射：Category.id => Category
    List<Category> categories = categoryService.listByIds(categoryIds);
    Map<Long, Category> categorieMap = categories.stream()
            .collect(Collectors.toMap(Category::getId, o -> o));

    // 类型转换 Dish => DishDto
    List<DishDto> dishDtoRecords = dishRecords.stream().map(item -> {
        DishDto dishDto = new DishDto();
        BeanUtils.copyProperties(item, dishDto);

        Long categoryId = item.getCategoryId();
        Category category = categorieMap.get(categoryId);

        if (category != null) {
            dishDto.setCategoryName(category.getName());
        }

        return dishDto;
    }).collect(Collectors.toList());

    dishDtoPageInfo.setRecords(dishDtoRecords);

    return R.success(dishDtoPageInfo);
}

```
功能测试


## 修改菜品

需求分析

代码开发

```java
/**
* 根据id获取菜品
* @param id
* @return
*/
@GetMapping("/{id}")
public R<DishDto> getDishById(@PathVariable long id){
    DishDto dishDto = dishService.getDishByIdWithDishFlavor(id);
    return R.success(dishDto);
}

/**
* 更新菜品
* @param dishDto
* @return
*/
@PutMapping
public R<String> updateDishById(@RequestBody DishDto dishDto){

    dishService.updateDishWithDishFlavor(dishDto);

    return R.success("更新成功");
}
```

```java
/**
* 获取菜品 和 对应的口味数据
*
* @param id Long
* @return
*/
@Override
public DishDto getDishByIdWithDishFlavor(Long id) {
    // 查询菜品信息
    Dish dish = this.getById(id);

    DishDto dishDto = new DishDto();
    BeanUtils.copyProperties(dish, dishDto);

    // 查询口味信息
    LambdaQueryWrapper<DishFlavor> queryWrapper = new LambdaQueryWrapper<>();

    queryWrapper.eq(DishFlavor::getDishId, dishDto.getId());

    List<DishFlavor> list = dishFlavorService.list(queryWrapper);
    dishDto.setFlavors(list);

    return dishDto;
}

/**
* 更新菜品 和 对应的口味数据
* @param dishDto
*/
@Override
@Transactional
public void updateDishWithDishFlavor(DishDto dishDto) {
    // 更新菜品基本信息
    this.updateById(dishDto);

    // 清理对应的口味数据 delete
    LambdaQueryWrapper<DishFlavor> queryWrapper = new LambdaQueryWrapper<>();
    queryWrapper.eq(DishFlavor::getDishId, dishDto.getId());
    dishFlavorService.remove(queryWrapper);

    // 更新对应的口味数据 insert
    List<DishFlavor> dishFlavors = dishDto.getFlavors()
        .stream()
        .map(item -> {
            item.setDishId(dishDto.getId());
            return item;
        }).collect(Collectors.toList());


    dishFlavorService.saveBatch(dishFlavors);
}
```
功能测试
