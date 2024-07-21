# 并发篇-线程池

面试题: 线程池的核心参数

1. corePoolSize 核心线程数目
    - 最多保留的线程数

2. maximumPoolSize 最大线程数目
    - 核心线程+救急线程

3. keepAliveTime 生存时间
    - 针对救急线程

4. unit 时间单位
    - 针对救急线程

5. workQueue
    - 阻塞队列

6. threadFactory 线程工厂
    - 可以为线程创建时起个好名字

7. handler 拒绝策略
    - 四种

![](https://mouday.github.io/img/2024/07/21/6zfp6qa.png)