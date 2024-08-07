# Golang面试题：Mutex 正常模式和饥饿模式

## 1、Mutex 几种状态

- mutexLocked —表示互斥锁的锁定状态; 
- mutexWoken —表示从正常模式被从唤醒; 
- mutexStarving —当前的互斥锁进入饥饿状态; 
- waitersCount —当前互斥锁上等待的 Goroutine 个数;

## 2、Mutex 正常模式和饥饿模式 

### 正常模式(非公平锁)

正常模式下，所有等待锁的 goroutine 按照 FIFO(先进先出)顺序等待。唤醒的 goroutine 不会直接拥有锁，而是会 和新请求锁的 goroutine 竞争锁的拥有。新请求锁的 goroutine 具有优势:它正在 CPU上执行，而且可能有好几 个，所以刚刚唤醒的 goroutine 有很大可能在锁竞争中失败。在这种情况下，这个被
唤醒的 goroutine 会加入到等待队列的前面。如果一个等待的 goroutine 超过1ms没有获取锁，那么它将会把锁转 变为饥饿模式。

### 饥饿模式(公平锁)

为了解决了等待 G队列的⻓尾问题
饥饿模式下，直接由 unlock 把锁交给等待队列中排在第一位的 G(队头)，同时，饥饿模式下，新进来的 G不会参与 抢锁也不会进入自旋状态，会直接进入等待队列的尾部,这样很好的解决了老的 g 一直抢不到锁的场景。饥饿模式 的触发条件，当一个 G等待锁时间超过1 毫秒时，或者当前队列只剩下一个 g 的时候，Mutex切换到饥饿模式。

### 总结

对于两种模式，正常模式下的性能是最好的，goroutine 可以连续多次获取锁，饥饿模式解决了取锁公平的问题， 但是性能会下降，其实是性能和公平的一个平衡模式。

## 3、Mutex 允许自旋的条件

1. 锁已被占用，并且锁不处于饥饿模式。
2. 积累的自旋次数小于最大自旋次数(active_spin=4)。
3. cpu 核数大于1。 
4. 有空闲的 P。
5. 当前 goroutine 所挂载的 P下，本地待运行队列为空。

