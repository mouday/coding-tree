# Golang面试题：单片，SOA 和微服务区别

## 单片，SOA 和微服务架构有什么区别?

单片 SOA 和微服务之间的比较–微服务访谈问题

- 单片架构类似于大容器，其中应用程序的所有软件组件组装在一起并紧密封装。

- 一个面向服务的架构是一种相互通信服务的集合。通信可以涉及简单的数据传递，也可以涉及两个或多个协调
  某些活动的服务。

- 微服务架构是一种架构⻛格，它将应用程序构建为以业务域为模型的小型自治服务集合。

## 怎么做弹性扩缩容，原理是什么?

弹性伸缩(Auto Scaling)根据您的业务需求和伸缩策略，为您自动调整计算资源。您可设置定时、周期或监控策 略，恰到好处地增加或减少CVM实例，并完成实例配置，保证业务平稳健康运行。在需求高峰期时，弹性伸缩自动 增加CVM实例的数量，以保证性能不受影响;当需求较低时，则会减少CVM实例数量以降低成本。弹性伸缩既适合 需求稳定的应用程序，同时也适合每天、每周、每月使用量不停波动的应用程序。

## 在使用微服务架构时，您面临哪些挑战?

开发一些较小的微服务听起来很容易，但开发它们时经常遇到的挑战如下。

- 自动化组件:难以自动化，因为有许多较小的组件。因此，对于每个组件，我们必须遵循 Build，Deploy 和 Monitor 的各个阶段。 
- 易感性:将大量组件维护在一起变得难以部署，维护，监控和识别问题。它需要在所有组件周围具有很好的感 知能力。
- 配置管理:有时在各种环境中维护组件的配置变得困难。
- 调试:很难找到错误的每一项服务。维护集中式日志记录和仪表板以调试问题至关重要。

