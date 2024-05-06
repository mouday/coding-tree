# 购物车

需求分析

- 添加菜品或者套餐到购物车

数据模型


代码开发

```java
/**
    * 添加菜品或套餐到购物车
    * @param shoppingCart
    * @return
    */
@PostMapping("/add")
public R<ShoppingCart> addShoppingCart(@RequestBody ShoppingCart shoppingCart) {
    // 设置当前用户
    shoppingCart.setUserId(BaseContext.getCurrentUserId());

    // 查询是否存在相同菜品或套餐，存在则合并更新,不存在则新增
    ShoppingCart shoppingCartRow = shoppingCartService.getShoppingCart(shoppingCart);
    if (shoppingCartRow != null) {
        shoppingCartRow.setNumber(shoppingCartRow.getNumber() + 1);
        shoppingCartService.updateById(shoppingCartRow);
    } else {
        shoppingCart.setNumber(1);
        shoppingCartService.save(shoppingCart);
        shoppingCartRow = shoppingCart;
    }

    return R.success(shoppingCartRow);
}
```

```java
/**
* 查询套餐
*
* @param shoppingCart
*/
@Override
public ShoppingCart getShoppingCart(ShoppingCart shoppingCart) {
    LambdaQueryWrapper<ShoppingCart> queryWrapper = new LambdaQueryWrapper<>();

    // 用户
    if (shoppingCart.getUserId() != null) {
        queryWrapper.eq(ShoppingCart::getUserId, shoppingCart.getUserId());
    }

    // 菜品
    if (shoppingCart.getDishId() != null) {
        queryWrapper.eq(ShoppingCart::getDishId, shoppingCart.getDishId());
    }

    // 套餐
    if (shoppingCart.getSetmealId() != null) {
        queryWrapper.eq(ShoppingCart::getSetmealId, shoppingCart.getSetmealId());
    }

    return super.getOne(queryWrapper);
}
```
功能测试
