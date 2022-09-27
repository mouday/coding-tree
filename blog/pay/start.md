# 接入指引

1. 申请APPID
    - 公众号： https://mp.weixin.qq.com/
    - 小程序：https://mp.weixin.qq.com/
    - APP 开放平台：https://open.weixin.qq.com/

2. 申请mchid（商户号）
    - 微信商户平台：https://pay.weixin.qq.com/

3. API v3密钥
    - 微信商户平台：https://pay.weixin.qq.com/

4. 商户证书
    - 微信商户平台：https://pay.weixin.qq.com/
    - 文档：https://kf.qq.com/faq/161222NneAJf161222U7fARv.html
    - 下载证书工具：
        - windows版本 ：https://wx.gtimg.com/mch/files/WXCertUtil.exe
        - mac版本 ：https://wx.gtimg.com/mch/files/WXCertUtil.dmg

5. 微信平台证书
    - Java命令行下载工具： https://github.com/wechatpay-apiv3/CertificateDownloader
    - php命令行下载工具：[https://github.com/wechatpay-apiv3/wechatpay-php/blob/main/bin/README.md](https://github.com/wechatpay-apiv3/wechatpay-php/blob/main/bin/README.md)

> 商户和微信平台进行通信，所以双方都需要有一套证书

## SDK

Java: https://github.com/wechatpay-apiv3/wechatpay-apache-httpclient

```xml
<dependency>
    <groupId>com.github.wechatpay-apiv3</groupId>
    <artifactId>wechatpay-apache-httpclient</artifactId>
    <version>0.4.7</version>
</dependency>
```

PHP：https://github.com/wechatpay-apiv3/wechatpay-php

- Guzzle 7.0，PHP >= 7.2.5
- Guzzle 6.5，PHP >= 7.1.2

```bash
composer require wechatpay/wechatpay
```