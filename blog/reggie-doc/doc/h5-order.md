# 用户下单

- 需求分析
- 数据模型
- 代码开发
- 功能测试


## 数据模型

订单表 order
订单明细表 order_detail

## 代码开发

```java
@PostMapping("/submit")
public R<String> submit(@RequestBody Orders orders){

    orderService.submit(orders);

    return null;
}
```

```java
/**
* 提交订单
* @param orders
*/
@Override
@Transactional
public void submit(Orders orders) {
    // 获取当前用户
    Long currentUserId = BaseContext.getCurrentUserId();
    User currentUser = userService.getById(currentUserId);

    // 获取购物车中的数据
    List<ShoppingCart> shoppingCartList = shoppingCartService.getListByUserId(currentUserId);
    if (shoppingCartList == null || shoppingCartList.size() == 0) {
        throw new CustomException("购物车没有商品");
    }

    // 获取用户地址
    AddressBook addressBook = addressBookService.getById(orders.getAddressBookId());
    if (addressBook == null) {
        throw new CustomException("用户地址无效");
    }

    // 订单号
    long orderId = IdWorker.getId();

    // 计算金额
    AtomicInteger amount = new AtomicInteger(0);

    List<OrderDetail> orderDetails = shoppingCartList.stream().map(item -> {
        OrderDetail orderDetail = new OrderDetail();
        orderDetail.setOrderId(orderId);
        orderDetail.setName(item.getName());
        orderDetail.setDishFlavor(item.getDishFlavor());
        orderDetail.setDishId(item.getDishId());
        orderDetail.setSetmealId(item.getSetmealId());
        orderDetail.setImage(item.getImage());
        orderDetail.setAmount(item.getAmount());

        // 金额 * 份数
        amount.addAndGet(item.getAmount().multiply(new BigDecimal(item.getNumber())).intValue());

        return orderDetail;
    }).collect(Collectors.toList());

    // 数据写入订单表
    orders.setId(orderId);
    orders.setOrderTime(LocalDateTime.now());
    orders.setCheckoutTime(LocalDateTime.now());
    orders.setStatus(2); // 2待派送

    // 总金额
    orders.setAmount(new BigDecimal(amount.get()));
    orders.setUserId(currentUserId);
    orders.setUserName(currentUser.getName());
    orders.setNumber(String.valueOf(orderId));
    orders.setConsignee(addressBook.getConsignee());
    orders.setPhone(addressBook.getPhone());
    orders.setAddress(addressBook.getDetail());
    super.save(orders);


    // 数据写入订单详细表
    orderDetailService.saveBatch(orderDetails);

    // 清空购物车
    shoppingCartService.cleanByUserId(currentUserId);
}
```