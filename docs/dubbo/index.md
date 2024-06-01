# Dubbo

Dubbo 是一款高性能、轻量级的开源Java RPC框架，提供面向接口代理的高性能RPC调用、智能负载均衡、服务自动注册和发现、运行期流量调度、可视化服务治理和运维等功能。

资料

- 课件代码 https://pan.baidu.com/s/136WmZXSNacZMcKIgf-3sHA?pwd=1234
- 视频地址 https://www.bilibili.com/video/BV1VE411q7dX/
- 2024Java学习路线(黑马) https://www.bilibili.com/read/cv9965357/
- 2024Java学习路线(尚硅谷) https://www.bilibili.com/read/cv5216534

目录

- 分布式系统中的相关概念
- Dubbo 概述
- Dubbo 快速入门
- Dubbo 高级特性

## 分布式系统中的相关概念

- 大型互联网项目架构目标
- 集群和分布式
- 架构演进

1、大型互联网项目架构目标

传统项目和互联网项目

- 传统项目：OA、CRM、HR
- 互联网项目

互联网项目特点：

- 用户多
- 流量大，并发高
- 海量数据
- 易受攻击
- 功能繁琐
- 变更快


衡量网站的性能指标：
- 响应时间：指执行一个请求从开始到最后收到响应数据所花费的总体时间。
- 并发数：指系统同时能处理的请求数量。
    - 并发连接数：指的是客户端向服务器发起请求，并建立了TCP连接。每秒钟服务器连接的总TCP数量
    - 请求数：也称为QPS(Query Per Second) 指每秒多少请求.
    - 并发用户数：单位时间内有多少用户
- 吞吐量：指单位时间内系统能处理的请求数量。
    - QPS：Query Per Second 每秒查询数。 
    - TPS：Transactions Per Second 每秒事务数。 

一个事务是指一个客户机向服务器发送请求然后服务器做出反应的过程。客户机在发送请求时开始计时，收到服务器响应后结束计时，以此来计算使用的时间和完成的事务个数。

一个页面的一次访问，只会形成一个TPS；但一次页面请求，可能产生多次对服务器的请求，就会有多个QPS

```
QPS >= 并发连接数 >= TPS
```

- 高性能：提供快速的访问体验。
- 高可用：网站服务一直可以正常访问。
- 可伸缩：通过硬件增加/减少，提高/降低处理能力。
- 高可扩展：系统间耦合低，方便的通过新增/移除方式，增加/减少新的功能/模块。 
- 安全性：提供网站安全访问和数据加密，安全存储等策略。
- 敏捷性：随需应变，快速响应。


2、集群和分布式

- 集群：很多“人”一起 ，干一样的事。一个业务模块，部署在多台服务器上。 
- 分布式：很多“人”一起，干不一样的事。这些不一样的事，合起来是一件大事。一个大的业务系统，拆分为小的业务模块，分别部署在不同的机器上。 


3、架构演进

![](https://cdn.jsdelivr.net/gh/mouday/img/2024/05/30/d1ozq37.png)

Dubbo 是 SOA时代的产物，SpringCloud 是微服务时代的产物


(1) 单体架构

![](https://cdn.jsdelivr.net/gh/mouday/img/2024/05/30/jyicqlv.png)

优点：
- 简单：开发部署都很方便，小型项目首选

缺点：
- 项目启动慢
- 可靠性差
- 可伸缩性差
- 扩展性和可维护性差
- 性能低

(2) 垂直架构

![](https://cdn.jsdelivr.net/gh/mouday/img/2024/05/30/91rlpe8.png)

垂直架构是指将单体架构中的多个模块拆分为多个独立的项目。形成多个独立的单体架构。

单体架构存在的问题：
- 项目启动慢
- 可靠性差
- 可伸缩性差
- 扩展性和可维护性差
- 性能低

垂直架构存在的问题：
- 重复功能太多

（3）分布式架构

![](https://cdn.jsdelivr.net/gh/mouday/img/2024/05/30/deauyho.png)

分布式架构是指在垂直架构的基础上，将公共业务模块抽取出来，作为独立的服务，供其他调用者消费，以实现服务的共享和重用。

`RPC`： Remote Procedure Call 远程过程调用。有非常多的协议和技术来都实现了RPC的过程。比如：HTTP REST风格，Java RMI规范、WebService SOAP协议、Hession等等。

垂直架构存在的问题：
- 重复功能太多

分布式架构存在的问题：
- 服务提供方一旦产生变更，所有消费方都需要变更。

(4)SOA架构

![](https://cdn.jsdelivr.net/gh/mouday/img/2024/05/30/ozjs1bk.png)

- SOA：（Service-Oriented Architecture，面向服务的架构）是一个组件模型，它将应用程序的不同功能单元（称为服务）进行拆分，并通过这些服务之间定义良好的接口和契约联系起来。
- ESB：(Enterparise Servce Bus) 企业服务总线，服务中介。主要是提供了一个服务于服务之间的交互。ESB 包含的功能如：负载均衡，流量控制，加密处理，服务的监控，异常处理，监控告急等等。

分布式架构存在的问题：
- 服务提供方一旦产生变更，所有消费方都需要变更

(5)微服务架构

![](https://cdn.jsdelivr.net/gh/mouday/img/2024/05/30/24mxoq1.png)

微服务架构是在 SOA 上做的升华，微服务架构强调的一个重点是“业务需要彻底的组件化和服务化”，原有的单个业务系统会拆分为多个可以独立开发、设计、运行的小应用。这些小应用之间通过服务完成交互和集成。

```
微服务架构 = 80%的SOA服务架构思想 + 100%的组件化架构思想 + 80%的领域建模思想
```

特点：
- 服务实现组件化：开发者可以自由选择开发技术。也不需要协调其他团队
- 服务之间交互一般使用`REST API`
- 去中心化：每个微服务有自己私有的数据库持久化业务数据
- 自动化部署：把应用拆分成为一个一个独立的单个服务，方便自动化部署、测试、运维



## Dubbo 概述
- Dubbo概念
- Dubbo架构

1、Dubbo概念

Dubbo是`阿里巴巴`公司开源的一个高性能、轻量级的 Java RPC 框架。

致力于提供高性能和透明化的 RPC 远程服务调用方案，以及 SOA 服务治理方案。

官网：http://dubbo.apache.org


2、Dubbo架构

![](https://cdn.jsdelivr.net/gh/mouday/img/2024/05/30/2q36soc.png)

节点角色说明：

- Provider：暴露服务的服务提供方
- Container：服务运行容器
- Consumer：调用远程服务的服务消费方
- Registry：服务注册与发现的注册中心
- Monitor：统计服务的调用次数和调用时间的监控中心


## Dubbo 快速入门

- Zookeeper安装
- Dubbo快速入门

1、Zookeeper安装

Dubbo官方推荐使用Zookeeper作为注册中心

![](https://cdn.jsdelivr.net/gh/mouday/img/2024/05/30/xr88yl8.png)

[Zookeeper安装](../zookeeper/install.md)

2、Dubbo快速入门

实现步骤：

1. 创建服务提供者Provider模块
2. 创建服务消费者Consumer模块
3. 在服务提供者模块编写 UserServiceImpl 提供服务
4. 在服务消费者中的 UserController 远程调用UserServiceImpl 提供的服务
5. 分别启动两个服务，测试

![](https://cdn.jsdelivr.net/gh/mouday/img/2024/06/01/bj2548d.png)

(1) spring和springmvc整合后代码

项目结构

```bash
$ tree -I target
.
├── dubbo-service
│   ├── pom.xml
│   └── src
│       ├── main
│       │   ├── java
│       │   │   └── com
│       │   │       └── itheima
│       │   │           └── service
│       │   │               ├── UserService.java
│       │   │               └── impl
│       │   │                   └── UserServiceImpl.java
│       │   └── resources
│       │       ├── log4j.properties
│       │       └── spring
│       │           └── applicationContext.xml
│       └── test
│           └── java
├── dubbo-web
│   ├── pom.xml
│   └── src
│       ├── main
│       │   ├── java
│       │   │   └── com
│       │   │       └── itheima
│       │   │           └── controller
│       │   │               └── UserController.java
│       │   ├── resources
│       │   │   ├── log4j.properties
│       │   │   └── spring
│       │   │       └── springmvc.xml
│       │   └── webapp
│       │       └── WEB-INF
│       │           └── web.xml
│       └── test
│           └── java
└── logs

```

安装service模块

```bash
$ cd dubbo-service

$ mvn install
```

启动web服务

```bash
$ cd dubbo-web

$ mvn tomcat7:run
```

接口请求测试

```
GET http://localhost:8000/user/sayHello.do

hello dubbo!~
```


（2）dubbo快速入门

项目结构

```
$ tree -I target
.
├── dubbo-interface
│   ├── pom.xml
│   └── src
│       ├── main
│       │   ├── java
│       │   │   └── com
│       │   │       └── itheima
│       │   │           └── service
│       │   │               └── UserService.java
│       │   └── resources
│       └── test
│           └── java
├── dubbo-service
│   ├── pom.xml
│   └── src
│       ├── main
│       │   ├── java
│       │   │   └── com
│       │   │       └── itheima
│       │   │           └── service
│       │   │               └── impl
│       │   │                   └── UserServiceImpl.java
│       │   ├── resources
│       │   │   ├── log4j.properties
│       │   │   └── spring
│       │   │       └── applicationContext.xml
│       │   └── webapp
│       │       └── WEB-INF
│       │           └── web.xml
│       └── test
│           └── java
├── dubbo-web
│   ├── pom.xml
│   └── src
│       ├── main
│       │   ├── java
│       │   │   └── com
│       │   │       └── itheima
│       │   │           └── controller
│       │   │               └── UserController.java
│       │   ├── resources
│       │   │   ├── log4j.properties
│       │   │   └── spring
│       │   │       └── springmvc.xml
│       │   └── webapp
│       │       └── WEB-INF
│       │           └── web.xml
│       └── test
│           └── java
└── logs

```

启动项目

```bash
# 1、安装共同的依赖
cd dubbo-interface
mvn install


# 2、启动service服务
$ cd dubbo-service

$ mvn tomcat7:run


# 3、启动web服务
$ cd dubbo-web

$ mvn tomcat7:run
```


## Dubbo 高级特性

- dubbo-admin管理平台
- dubbo 常用高级配置

1、dubbo-admin管理平台

[dubbo-admin](./dubbo-admin.md)


目前用到的端口汇总
- zookeeper：2181
- 服务提供方dubbo-service tomcat：9000
- 服务提供方dubbo-service dubbo：20880
- 服务提供方dubbo-service qos.port：22222
- 服务调用方dubbo-web tomcat：8000
- 服务调用方dubbo-web qos.port：33333
- Dubbo Admin：8080

2、dubbo 常用高级配置

https://www.bilibili.com/video/BV1VE411q7dX?p=8&spm_id_from=pageDriver&vd_source=efbb4dc944fa761b6e016ce2ca5933da