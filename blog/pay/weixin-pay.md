
【尚硅谷】微信支付&支付宝支付，一套搞定Java在线支付开发教程
https://www.bilibili.com/video/BV1US4y1D77m


## 微信支付

https://pay.weixin.qq.com

[接入指引](blog/pay/start.md)

[支付安全](blog/pay/security.md)

[创建项目](blog/pay/create-project.md)


注意事项：

1. 定期更新平台证书，间隔时间小于12 小时

记录订单日志：使用json字段content存储回调通知返回的完整数据

2. 处理重复通知：当商户系统收到通知进行处理时，先检查对应业务数据的状态，并判断该通知是否已经处理。
    - 如果未处理，则再进行处理；
    - 如果已处理，则直接返回结果成功。

3. 商户系统对于开启结果通知的内容一定要做签名验证

4. 并发控制


https://www.bilibili.com/video/BV1US4y1D77m?p=57
