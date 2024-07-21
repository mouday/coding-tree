# Golang面试题：RWMutex 注意事项

## RWMutex 实现

通过记录 readerCount 读锁的数量来进行控制，当有一个写锁的时候，会将读锁数量设置为负数1<<30。目的是让 新进入的读锁等待写锁之后释放通知读锁。同样的写锁也会等等待之前的读锁都释放完毕，才会开始进行后续的操 作。而等写锁释放完之后，会将值重新加上1<<30,并通知刚才新进入的读锁(rw.readerSem)，两者互相限制。

## RWMutex 注意事项

RWMutex 是单写多读锁，该锁可以加多个读锁或者一个写锁
读锁占用的情况下会阻止写，不会阻止读，多个 goroutine 可以同时获取读锁
写锁会阻止其他 goroutine(无论读和写)进来，整个锁由该 goroutine 独占
适用于读多写少的场景

RWMutex 类型变量的零值是一个未锁定状态的互斥锁。

RWMutex 在首次被使用之后就不能再被拷⻉。

RWMutex 的读锁或写锁在未锁定状态，解锁操作都会引发 panic。

RWMutex 的一个写锁 Lock 去锁定临界区的共享资源，如果临界区的共享资源已被(读锁或写锁)锁定，这 个写锁操作的 goroutine 将被阻塞直到解锁。

RWMutex 的读锁不要用于递归调用，比较容易产生死锁。

RWMutex 的锁定状态与特定的 goroutine 没有关联。一个 goroutine 可以 RLock(Lock)，另一个
goroutine 可以 RUnlock(Unlock)。

写锁被解锁后，所有因操作锁定读锁而被阻塞的 goroutine 会被唤醒，并都可以成功锁定读锁。

读锁被解锁后，在没有被其他读锁锁定的前提下，所有因操作锁定写锁而被阻塞的 goroutine，其中等待时间 最⻓的一个 goroutine 会被唤醒。

## Cond 是什么

Cond实现了一种条件变量，可以使用在多个 Reader 等待共享资源 ready 的场景(如果只有一读一写，一个锁或
者 channel 就搞定了)

每个 Cond都会关联一个 Lock(sync.Mutex or sync.RWMutex)，当修改条件或者调用 Wait 方法时，必须加
锁，保护 condition。