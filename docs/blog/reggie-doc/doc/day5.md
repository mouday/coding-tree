# 套餐管理业务开发

- 新增套餐
- 套餐信息分页查询
- 删除套餐

## 新增套餐

需求分析

- 将现有菜品加入套餐

数据模型

- setmeal 套餐表
- setmeal_dish 套餐菜品关系表

代码开发

```java
/**
* 添加套餐
*
* @param setmealDto
* @return
*/
@PostMapping
public R<String> addSetmeal(@RequestBody SetmealDto setmealDto) {
    log.info("setmealDto {}", setmealDto);
    setmealService.saveSetmealWithDish(setmealDto);
    return R.success("新增成功");
}
```

```java
/**
* 保存套餐及其菜品
*
* @param setmealDto
*/
@Transactional
@Override
public void saveSetmealWithDish(SetmealDto setmealDto) {
    // 保存基本信息 insert
    this.save(setmealDto);

    // 保存菜品信息 insert
    List<SetmealDish> setmealDishes = setmealDto.getSetmealDishes();

    List<SetmealDish> list = setmealDishes.stream()
            .map(item -> {
                item.setSetmealId(setmealDto.getId());
                return item;
            }).collect(Collectors.toList());

    setmealDishService.saveBatch(list);

}
```

交互过程

- 获取套餐分类
- 获取菜品分类
- 根据菜品分类，获取菜品
- 图片上传下载
- 保存套餐信息

功能测试

## 套餐信息分页查询

需求分析

代码开发

```java
/**
 * 套餐分页查询
 *
 * @param page
 * @param pageSize
 * @param name
 * @return
 */
@GetMapping("/page")
public R<Page> getSetmealPage(int page, int pageSize, String name) {

    // 查询
    LambdaQueryWrapper<Setmeal> queryWrapper = new LambdaQueryWrapper<>();

    // 搜索
    if (StringUtils.isNotBlank(name)) {
        queryWrapper.like(Setmeal::getName, name);
    }

    // 排序
    queryWrapper.orderByDesc(Setmeal::getUpdateTime);

    // 分页
    Page<Setmeal> pageInfo = new Page<>(page, pageSize);

    setmealService.page(pageInfo, queryWrapper);

    // 转为 SetmealDto
    Page<SetmealDto> pageDto = new Page<>(page, pageSize);
    BeanUtils.copyProperties(pageInfo, pageDto, "records");

    List<SetmealDto> list = pageInfo.getRecords()
            .stream()
            .map(item -> {
                SetmealDto setmealDto = new SetmealDto();

                BeanUtils.copyProperties(item, setmealDto);

                // 查询分类名称
                Category category = categoryService.getById(item.getCategoryId());
                if (category != null) {
                    setmealDto.setCategoryName(category.getName());
                }

                return setmealDto;
            }).collect(Collectors.toList());

    pageDto.setRecords(list);

    return R.success(pageInfo);

}


```
功能测试


## 删除套餐

需求分析

- 售卖中的套餐不能删除，需要先停售再删除
- 支持批量删除

代码开发

```java
 /**
* 删除套餐
* @param ids
* @return
*/
@DeleteMapping
public R<String> removeSetmeal(List<Long> ids){
    setmealService.removeSetmealWithDish(ids);
    return R.success("删除套餐成功");
}
```

```java
/**
* 删除套餐及其菜品
*
* @param ids
*/
@Transactional
@Override
public void removeSetmealWithDish(List<Long> ids) {
    // 查询套餐状态是否可以删除
    if (this.hasActiveSetmeal(ids)) {
        throw new CustomException("套餐正在售卖，不能删除");
    }

    // 先删除套餐
    super.removeByIds(ids);

    // 再删除关联菜品
    // delete from setmeal_dish where setmeal_id in (?)
    LambdaQueryWrapper<SetmealDish> lambdaQueryWrapper = new LambdaQueryWrapper<>();
    lambdaQueryWrapper.in(SetmealDish::getSetmealId, ids);

    setmealDishService.remove(lambdaQueryWrapper);

}

/**
* 检查是否有起售的套餐
*
* @param ids
*/
@Override
public boolean hasActiveSetmeal(List<Long> ids) {
    // select count(*) from setmeal where id in (?) and status = 1
    LambdaQueryWrapper<Setmeal> queryWrapper = new LambdaQueryWrapper<>();
    queryWrapper.in(Setmeal::getId, ids);
    queryWrapper.eq(Setmeal::getStatus, 1);

    return super.count(queryWrapper) > 0;
}
```
功能测试