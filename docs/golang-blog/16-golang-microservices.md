# Golang面试题：微服务

## 你对微服务有何了解?

微服务，又称微服务架构，是一种架构⻛格，它将应用程序构建为以业务领域为模型的小型自治服务集合。通俗地
说，你必须看到蜜蜂如何通过对⻬六⻆形蜡细胞来构建它们的蜂窝状物。他们最初从使用各种材料的小部分开始，
并继续从中构建一个大型蜂箱。这些细胞形成图案，产生坚固的结构，将蜂窝的特定部分固定在一起。这里，每个
细胞独立于另一个细胞，但它也与其他细胞相关。这意味着对一个细胞的损害不会损害其他细胞，因此，蜜蜂可以
在不影响完整蜂箱的情况下重建这些细胞。

## 微服务有哪些特点?

- 解耦—系统内的服务很大程度上是分离的。因此，整个应用程序可以轻松构建，更改和扩展 
- 组件化—微服务被视为可以轻松更换和升级的独立组件
- 业务能力—微服务非常简单，专注于单一功能
- 自治—开发人员和团队可以彼此独立工作，从而提高速度 
- 持续交付—通过软件创建，测试和批准的系统自动化，允许频繁发布软件 
- 责任—微服务不关注应用程序作为项目。相反，他们将应用程序视为他们负责的产品 
- 分散治理—重点是使用正确的工具来做正确的工作。这意味着没有标准化模式或任何技术模式。开发人员可以 自由选择最有用的工具来解决他们的问题 
- 敏捷—微服务支持敏捷开发。任何新功能都可以快速开发并再次丢弃


## 微服务架构是什么样子的? 

通常传统的项目体积庞大，需求、设计、开发、测试、部署流程固定。新功能需要在原项目上做修改。

但是微服务可以看做是对大项目的拆分，是在快速迭代更新上线的需求下产生的。新的功能模块会发布成新的服务 组件，与其他已发布的服务组件一同协作。 服务内部有多个生产者和消费者，通常以http rest的方式调用，服务总 体以一个(或几个)服务的形式呈现给客户使用。

微服务架构是一种思想对微服务架构我们没有一个明确的定义，但简单来说微服务架构是:

采用一组服务的方式来构建一个应用，服务独立部署在不同的进程中，不同服务通过一些轻量级交互机制来通信， 例如 RPC、HTTP 等，服务可独立扩展伸缩，每个服务定义了明确的边界，不同的服务甚至可以采用不同的编程语 言来实现，由独立的团队来维护。