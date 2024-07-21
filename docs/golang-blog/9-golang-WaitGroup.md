# Golang面试题：WaitGroup 实现原理

## WaitGroup 用法

一个 WaitGroup 对象可以等待一组协程结束。使用方法是:

1. main 协程通过调用 wg.Add(delta int)设置 worker 协程的个数，然后创建 worker 协程; 
2. worker 协程执行结束以后，都要调用 wg.Done();
3. main 协程调用 wg.Wait()且被 block，直到所有 worker 协程全部执行结束后返回。

## WaitGroup 实现原理

WaitGroup 主要维护了2 个计数器，一个是请求计数器 v，一个是等待计数器 w，二者组成一个64bit 的值， 请求计数器占高32bit，等待计数器占低32bit。

每次 Add执行，请求计数器 v 加1，Done方法执行，请求计数器减1，v 为0 时通过信号量唤醒 Wait()。

## 什么是 sync.Once

Once 可以用来执行且仅仅执行一次动作，常常用于单例对象的初始化场景。

Once 常常用来初始化单例资源，或者并发访问只需初始化一次的共享资源，或者在测试的时候初始化一次测 试资源。

sync.Once 只暴露了一个方法 Do，你可以多次调用 Do 方法，但是只有第一次调用 Do 方法时 f 参数才会执 行，这里的 f 是一个无参数无返回值的函数。