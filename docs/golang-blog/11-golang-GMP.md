# Golang面试题：GMP 指的是什么?

## sync.Pool 有什么用

对于很多需要重复分配、回收内存的地方，sync.Pool 是一个很好的选择。频繁地分配、回收内存会给 GC 带来一 定的负担，严重的时候会引起 CPU 的毛刺，而 sync.Pool 可以将暂时不用的对象缓存起来，待下次需要的时候直 接使用，不用再次经过内存分配，复用对象的内存，减轻 GC 的压力，提升系统的性能。

## Goroutine 定义

Goroutine 是一个与其他 goroutines 并行运行在同一地址空间的 Go 函数或方法。一个运行的程序由一个或更多
个 goroutine 组成。它与线程、协程、进程等不同。它是一个 goroutine”—— Rob Pike
Goroutines 在同一个用户地址空间里并行独立执行 functions，channels 则用于 goroutines 间的通信和同步访问
控制。

## GMP 指的是什么

G(Goroutine):我们所说的协程，为用户级的轻量级线程，每个 Goroutine 对象中的 sched 保存着其上下文信
息.

M(Machine):对内核级线程的封装，数量对应真实的 CPU数(真正干活的对象).

P(Processor):即为 G和 M的调度对象，用来调度 G和 M之间的关联关系，其数量可通过 GOMAXPROCS()来设 置，默认为核心数。