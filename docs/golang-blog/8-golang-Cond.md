# Golang面试题：Cond 是什么

## 1、Cond 是什么

Cond实现了一种条件变量，可以使用在多个 Reader 等待共享资源 ready 的场景(如果只有一读一写，一个锁或者 channel 就搞定了)

每个 Cond都会关联一个 Lock(sync.Mutex or sync.RWMutex)，当修改条件或者调用 Wait 方法时，必须加锁，保护 condition。

## 2、Broadcast 和 Signal 区别


```go
func (c *Cond) Broadcast()
```

Broadcast 会唤醒所有等待 c 的 goroutine。调用 Broadcast 的时候，可以加锁，也可以不加锁。

```go
func (c *Cond) Signal()
```
Signal 只唤醒1 个等待 c 的 goroutine。调用 Signal 的时候，可以加锁，也可以不加锁。

## 3、Cond 中 Wait 使用

```go
func (c *Cond) Wait()
```

Wait()会自动释放 c.L，并挂起调用者的 goroutine。之后恢复执行，Wait()会在返回时对 c.L 加锁。 

除非被 Signal 或者 Broadcast 唤醒，否则 Wait()不会返回。

由于 Wait()第一次恢复时，C.L 并没有加锁，所以当 Wait 返回时，调用者通常并不能假设条件为真。 

取而代之的是,调用者应该在循环中调用 Wait。(简单来说，只要想使用 condition，就必须加锁。)

```go
 
c.L.Lock()

for !condition(){
    c.Wait() 
}

// make use of condition ...
c.L.Unlock()
```

