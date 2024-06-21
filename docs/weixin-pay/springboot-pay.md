# SpringBoot 微信支付

## 参数配置

```yaml
# application.yml
wechat:
  # 微信支付
  pay:
    # APP ID
    appId: "APP ID"
    # 商户号
    merchantId: "merchantId"
    # 商户证书序列号
    merchantSerialNumber: "merchantSerialNumber"
    # 商户APIV3密钥
    apiV3key: "apiV3key"
    # 商户API私钥路径，绝对路径
    privateKeyPath: "privateKeyPath"
    # 微信证书，绝对路径
    wechatPayCertificatePath: "wechatPayCertificatePath"
    # 支付通知地址
    payNotifyUrl: "payNotifyUrl"
    # 退款通知地址
    refundNotifyUrl: "refundNotifyUrl"
```

读取配置 

```java
// WxPayConfig.java
package com.demo.config.miniapp;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;


@Data
@Configuration
@ConfigurationProperties(prefix = "wechat.pay")
public class WechatPayConfig {
    /**
     * APP ID
     */
    private String appId;

    /**
     * 商户号
     */
    private String merchantId;

    /**
     * 商户证书序列号
     */
    private String merchantSerialNumber;

    /**
     * 商户APIV3密钥
     */
    private String apiV3key;

    /**
     * 商户API私钥路径
     */
    private String privateKeyPath;

    /**
     * 微信证书
     */
    private String wechatPayCertificatePath;

    /**
     * 支付通知地址
     */
    private String payNotifyUrl;

    /**
     * 退款通知地址
     */
    private String refundNotifyUrl;

}

```

微信支付回调通知请求头解析

```java
// NotifyHeader.java
package com.demo.util.wechat.entity;

import lombok.Data;
import lombok.extern.slf4j.Slf4j;

import javax.servlet.http.HttpServletRequest;

@Data
@Slf4j
public class NotifyHeader {

    // Wechatpay-Signature
    private String signature;

    // Wechatpay-Nonce
    private String nonce;

    //Wechatpay-Timestamp
    private String timestamp;

    //Wechatpay-Serial
    private String serial;

    // Wechatpay-Signature-Type
    private String signatureType;

    public static NotifyHeader parseRequest(HttpServletRequest request) {
        NotifyHeader notifyHeader = new NotifyHeader();

        notifyHeader.setNonce(request.getHeader("Wechatpay-Nonce"));
        notifyHeader.setSignature(request.getHeader("Wechatpay-Signature"));
        notifyHeader.setSerial(request.getHeader("Wechatpay-Serial"));
        notifyHeader.setSignatureType(request.getHeader("Wechatpay-Signature-Type"));
        notifyHeader.setTimestamp(request.getHeader("Wechatpay-Timestamp"));

        log.info("notifyHeader: {}", notifyHeader);
        return notifyHeader;
    }
}

```


订单ID获取工具类

```java
// UUIDUtil.java
package com.demo.util;

import java.util.UUID;

/**
 * 获取uuid
 */
public class UUIDUtil {
    /**
     * 返回 36 位的uuid
     * eg: 20021b46-f061-434e-ad39-57f6c55b59c2
     */
    public static String getUUID() {
        return UUID.randomUUID().toString();
    }

    /**
     * 返回 32 位的uuid
     * eg: 47a3690d724e4d408b3e2b952079b8e9
     */
    public static String getOrderNo() {
        return getUUID().replaceAll("-", "");
    }
}

```

service定义

```java
package com.demo.service.impl;

import com.wechat.pay.java.core.Config;
import com.wechat.pay.java.core.RSAConfig;
import com.wechat.pay.java.core.exception.ServiceException;
import com.wechat.pay.java.core.notification.NotificationConfig;
import com.wechat.pay.java.core.notification.NotificationParser;
import com.wechat.pay.java.core.notification.RSANotificationConfig;
import com.wechat.pay.java.core.notification.RequestParam;
import com.wechat.pay.java.service.payments.model.Transaction;
import com.wechat.pay.java.service.payments.nativepay.NativePayService;
import com.wechat.pay.java.service.payments.nativepay.model.Amount;
import com.wechat.pay.java.service.payments.nativepay.model.PrepayRequest;
import com.wechat.pay.java.service.payments.nativepay.model.PrepayResponse;
import com.wechat.pay.java.service.refund.RefundService;
import com.wechat.pay.java.service.refund.model.AmountReq;
import com.wechat.pay.java.service.refund.model.CreateRequest;
import com.wechat.pay.java.service.refund.model.Refund;
import com.wechat.pay.java.service.refund.model.RefundNotification;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.time.LocalDateTime;

/**
 * @ref https://github.com/wechatpay-apiv3/wechatpay-java
 */
@Service
@Slf4j
public class WechatPayService implements PayService {

    @Autowired
    private WechatPayConfig wechatPayConfig;

    public Config getConfig() {
        return new RSAConfig.Builder()
                .merchantId(wxPayConfig.getMerchantId())
                .privateKeyFromPath(wxPayConfig.getPrivateKeyPath())
                .merchantSerialNumber(wxPayConfig.getMerchantSerialNumber())
                .wechatPayCertificatesFromPath(wxPayConfig.getWechatPayCertificatePath())
                .build();
    }


    /**
     * 验签并解析支付通知数据
     *
     * @param request
     * @return
     * @throws IOException
     */
    public <T> T parseNotify(HttpServletRequest request, Class<T> clazz) throws IOException {

        NotifyHeader notifyHeader = NotifyHeader.parseRequest(request);

        // body
        String requestBody = RequestUtil.getRequestBody(request);
        log.info("requestBody: {}", requestBody);

        // 构造 RequestParam
        RequestParam requestParam = new RequestParam.Builder()
                .serialNumber(notifyHeader.getSerial())
                .nonce(notifyHeader.getNonce())
                .signature(notifyHeader.getSignature())
                .timestamp(notifyHeader.getTimestamp())
                .body(requestBody)
                .build();

        NotificationConfig config = new RSANotificationConfig.Builder()
                .certificatesFromPath(wxPayConfig.getWechatPayCertificatePath())
                .apiV3Key(wxPayConfig.getApiV3key())
                .build();

        // 初始化 NotificationParser
        NotificationParser parser = new NotificationParser(config);

        // 以支付通知回调为例，验签、解密并转换成 Transaction
        return parser.parse(requestParam, clazz);
    }

    /**
     * Native支付预下单
     */
    public String prepay(OrderEntity orderEntity) {
        String uuid = UUIDUtil.getOrderNo();

        PrepayRequest request = new PrepayRequest();
        // 调用request.setXxx(val)设置所需参数，具体参数可见Request定义
        // 调用接口
        Amount amount = new Amount();
        amount.setTotal(100);
        request.setAmount(amount);
        request.setOutTradeNo(uuid);

        request.setAppid(wxPayConfig.getAppId());
        request.setMchid(wxPayConfig.getMerchantId());
        request.setNotifyUrl(wxPayConfig.getPayNotifyUrl());
        request.setDescription(orderEntity.getServiceName());
        
        // 调用下单方法，得到应答
        NativePayService service = new NativePayService.Builder()
                .config(this.getConfig())
                .build();

        PrepayResponse response = service.prepay(request);
        // 使用微信扫描 code_url 对应的二维码，即可体验Native支付
        
        return response.getCodeUrl();
    }

    @Override
    public void handlePaySuccess(Transaction transaction) {
        String outTradeNo = transaction.getOutTradeNo();
        // 处理支付成功事件
    }

    @Override 
    public void wechatRefund(OrderWechatRefund orderWechatRefund) {
        RefundService refundService = new RefundService
                .Builder()
                .config(this.getConfig())
                .build();

        CreateRequest request = new CreateRequest();

        // 调用request.setXxx(val)设置所需参数，具体参数可见Request定义
        AmountReq amount = new AmountReq();
        amount.setTotal(100));
        amount.setRefund(100));
        amount.setCurrency("CNY");
        request.setAmount(amount);

        request.setOutTradeNo("OutTradeNo");
        request.setOutRefundNo("OutRefundNo");
        request.setReason("退款原因");
        request.setNotifyUrl(wxPayConfig.getRefundNotifyUrl());

        // 调用接口
        try{
            Refund refund = refundService.create(request);
        } catch (ServiceException serviceException){
            throw new AppException(serviceException.getErrorMessage());
        }
    }

    @Override
    public Transaction parseTransactionNotify(HttpServletRequest request) throws IOException {
        return this.parseNotify(request, Transaction.class);
    }

    @Override
    public RefundNotification parseRefundNotify(HttpServletRequest request) throws IOException {
        return this.parseNotify(request, RefundNotification.class);
    }

    @Override
    public void handleRefundSuccess(RefundNotification refundNotification) {
        String outRefundNo = refundNotification.getOutRefundNo();
        // 处理退款成功
    }
}

```

控制器

```java
package com.demo.controller;

import com.wechat.pay.java.service.payments.model.Transaction;
import com.wechat.pay.java.service.refund.model.RefundNotification;
import com.wechat.pay.java.service.refund.model.Status;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/wechatPay")
public class WechatPayController {
    @Autowired
    private PayService weixinPayService;

    @PostMapping("/payNotify")
    public Map<String, String> payNotify(HttpServletRequest request) throws IOException {

        Transaction transaction = weixinPayService.parseTransactionNotify(request);
        log.debug("transaction: {}", transaction);

        // 成功了再修改订单状态
        if (transaction.getTradeState() == Transaction.TradeStateEnum.SUCCESS) {
            weixinPayService.handlePaySuccess(transaction);
        }

        // 应答返回
        Map<String, String> map = new HashMap<>();

        map.put("code", "SUCCESS");
        map.put("message", "成功");
        return map;
    }

    @PostMapping("/refundNotify")
    public Map<String, String> refundNotify(HttpServletRequest request) throws IOException {

        RefundNotification refundNotification = weixinPayService.parseRefundNotify(request);
        log.debug("refundNotification: {}", refundNotification);

        // 成功了再修改订单状态
        if (refundNotification.getRefundStatus() == Status.SUCCESS) {
            weixinPayService.handleRefundSuccess(refundNotification);
        }

        // 应答返回
        Map<String, String> map = new HashMap<>();

        map.put("code", "SUCCESS");
        map.put("message", "成功");
        return map;
    }

    /**
     * 支付
     * @param orderPayForm
     * @return
     */
    @PostMapping("/prePay")
    public PrepayVO pay(@RequestBody @Validated OrderPayForm orderPayForm) {
        return weixinPayService.wechatPrePay(orderPayForm.getOrderId());
    }

    /**
     * 退款
     * @param orderRefundForm
     */
    @PostMapping("/refund")
    public void refund(@RequestBody @Validated OrderRefundForm orderRefundForm) {
        weixinPayService.refundOrderMoney(orderRefundForm);
    }
}

```

表单数据
```java
package com.demo.form;

import io.swagger.annotations.ApiModel;
import lombok.Data;

import javax.validation.constraints.NotNull;

@ApiModel("支付订单")
@Data
public class OrderPayForm {
    @NotNull
    private Long orderId;
}

```

```java
package com.demo.form;

import io.swagger.annotations.ApiModel;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@ApiModel("订单退款")
@Data
public class OrderRefundForm {
    @NotNull
    private Long orderId;

    @NotBlank
    private String reason;
}

````

## 小程序支付

1、服务端返回支付所需参数

公共的配置参数

```java
public Config getConfig() {
        return new RSAConfig.Builder()
                .merchantId(wxPayConfig.getMerchantId())
                .privateKeyFromPath(wxPayConfig.getPrivateKeyPath())
                .merchantSerialNumber(wxPayConfig.getMerchantSerialNumber())
                .wechatPayCertificatesFromPath(wxPayConfig.getWechatPayCertificatePath())
                .build();
}
```

```java
import com.wechat.pay.java.service.payments.jsapi.model.PrepayRequest;
import com.wechat.pay.java.service.payments.jsapi.JsapiServiceExtension;
import com.wechat.pay.java.service.payments.jsapi.model.Amount;
import com.wechat.pay.java.service.payments.jsapi.model.Payer;
import com.wechat.pay.java.service.payments.jsapi.model.PrepayWithRequestPaymentResponse;

JsapiServiceExtension service = new JsapiServiceExtension
        .Builder()
        .config(getConfig())
        .build();

// 设置所需参数，具体参数可见Request定义
PrepayRequest request = new PrepayRequest();

// 金额
Amount amount = new Amount();
amount.setTotal(100);
amount.setCurrency("CNY");
request.setAmount(amount);

// 支付人
Payer payer = new Payer();
payer.setOpenid("OpenId");
request.setPayer(payer);

// 商户信息
request.setDescription("商品名称");
request.setAppid(wxMaConfig.getAppId());
request.setMchid(wxPayConfig.getMerchantId());
request.setNotifyUrl(wxPayConfig.getPayNotifyUrl());
request.setOutTradeNo("OutTradeNo");

// 调用下单方法，得到应答
// response包含了调起支付所需的所有参数，可直接用于前端调起支付
PrepayWithRequestPaymentResponse response = service.prepayWithRequestPayment(request);
log.debug("{}", response);

```

2、小程序端拉起支付

```js
await wx.requestPayment({
  timeStamp: '',
  nonceStr: '',
  package: '',
  signType: 'MD5',
  paySign: '',
})
```
