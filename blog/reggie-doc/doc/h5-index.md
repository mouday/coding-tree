# 菜品展示、购物车、下单

- 导入用户地址簿
- 菜品展示
- 购物车
- 下单

## 导入用户地址簿

- 需求分析
- 数据模型
- 导入功能代码
- 功能测试


## 菜品展示

- 需求分析
    - 如果设置了口味，需要【选择规格】

- 代码开发
```java
/**
* 查询菜品和对应的口味
* @param list
* @return
*/
@Override
public List<DishDto> listWithFlavors(List<Dish> list) {
    // 获取id
    List<Long> dishIds = list.stream().map(Dish::getId).collect(Collectors.toList());

    // 查询关联数据
    LambdaQueryWrapper<DishFlavor> queryWrapper = new LambdaQueryWrapper<>();
    queryWrapper.in(DishFlavor::getDishId, dishIds);
    List<DishFlavor> dishFlavors = dishFlavorService.list(queryWrapper);

    // 分组
    Map<Long, List<DishFlavor>> map = dishFlavors.stream().collect(Collectors.groupingBy(DishFlavor::getDishId));

    // 数据转换
    List<DishDto> dishDtoList = list.stream().map(item -> {
        DishDto dishDto = new DishDto();
        BeanUtils.copyProperties(item, dishDto);
        dishDto.setFlavors(map.get(dishDto.getId()));
        return dishDto;
    }).collect(Collectors.toList());

    return dishDtoList;
}
```

- 功能测试


