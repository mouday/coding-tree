# semaphore.h

多线程编程中使用信号量机制解决这一问题。线程中信号量是互斥锁的升级，其初值不再设置为1，而是设置为N。多线程中使用到的信号量与进程通信中讲解的信号量在本质上没有区别。使用信号量实现线程同步时，线程在访问共享资源时会根据操作类型执行P/V操作：若有线程申请访问共享资源，系统会执行P操作使共享资源计数减一；若由线程释放共享资源，系统会执行V操作使共享资源计数加一。

相对互斥锁而言，信号量既能保证同步，防止数据混乱，又能避免影响线程并发性。

信号量的使用也分为四个步骤：

（1）初始化信号量；

（2）阻塞等待信号量；

（3）唤醒阻塞线程；

（4）释放信号量。

## sem_init

初始化信号量

> 注意：macOS未实现该函数，仅POSIX可用

```cpp
/**
 * 参数
 *   sem为指向信号量变量的指针
 *   pshared用于控制信号量的作用范围，其取值通常为0与非0，
 *      - 当pshared被设置为0时，信号量将会被放在进程中所有线程可见的地址内，由进程中的线程共享；
 *      - 当pshared被设置为非0值时，信号量将会被放置在共享内存区域，由所有进程共享。
 *   value用于设置信号量sem的初值。
 * 
 * 返回
 *   成功则返回0
 *   否则返回-1，并设置errno。
 */
int sem_init(sem_t *sem, int pshared, unsigned int value);
```

当信号量的初值被设置为1时，信号量与互斥锁的功能相同，因此互斥锁也是信号量的一种。

## sem_wait

阻塞等待信号量，对应P操作

```cpp
/**
 * 参数
 *   sem为指向信号量变量的指针；
 * 
 * 返回
 *   成功，则会使信号量sem的值减一，并返回0；
 *   若调用失败，则返回-1，并设置errno。
 */
int sem_wait(sem_t *sem);
```

sem_wait()与互斥锁中的系统调用pthread_mutex_lock()类似，当sem为0，即共享资源耗尽时，再有线程调用该函数申请资源，则该进程会进入阻塞，直至有其它线程释放资源为止。

若不希望线程在申请资源时因资源不足进入阻塞状态，可以使用sem_trywait()函数尝试去为线程申请资源，改函数与互斥锁中的pthread_mutex_trylock()类似，若资源申请不成功会立即返回。

## sem_post

唤醒阻塞线程，对应V操作

```cpp
/**
 * 参数
 *   sem为指向信号量变量的指针；
 * 
 * 返回
 *   若调用成功，则会使信号量sem的值加一，并返回0；
 *   若调用失败，则返回-1，并设置errno。
 */
int sem_post(sem_t *sem);
```

## sem_destroy

释放信号量

与互斥锁类似，信号量也是一种系统资源，使用完毕之后应主动回收

```cpp
/**
 * 参数
 *   sem为指向信号量变量的指针；
 * 
 * 返回
 *   若函数调用成功，则会使信号量sem的值加一，并返回0；
 *   若调用失败，则返回-1，并设置errno。
 */
int sem_destroy(sem_t *sem);
```

## sem_getvalue

获取系统中当前信号量的值

```cpp
/**
 * 参数
 *   sem为指向信号量变量的指针
 *   sval为一个传入指针，用于获取信号量的值，在程序中调用该函数后，信号量sem的值会被存储在参数sval中。
 */
int sem_getvalue(sem_t *sem, int *sval);
```

## 示例

本案例也来实现一个模拟生产者-消费者模型，但对生产者进行限制：若容器已满，生产者不能生产，需等待消费者消费。案例实现如下：

该示例，仅在POXIS上可用

```cpp
#include <stdlib.h>
#include <unistd.h>
#include <pthread.h>
#include <stdio.h>
#include <semaphore.h>

// 全局数组实现环形队列
#define NUM 5
int queue[NUM];

sem_t blank_number, product_number, queue_mutex; // 空格子信号量, 产品信号量

void *producer(void *arg)
{
    int i = 0;
    while (1)
    {

        sleep(5); // 模拟生产耗时

        // 生产者将空格子数--,为0则阻塞等待
        sem_wait(&blank_number);
        sem_wait(&queue_mutex); // 进入临界区

        queue[i] = rand() % 1000 + 1; // 生产一个产品
        printf("producer[%lu] i: %d value: %d\n", pthread_self(), i, queue[i]);
        i = (i + 1) % NUM; // 借助下标实现环形

        sem_post(&queue_mutex);    // 离开临界区
        sem_post(&product_number); // 将产品数++
    }
}

void *consumer(void *arg)
{
    int i = 0;
    while (1)
    {
        // 消费者将产品数--,为0则阻塞等待
        sem_wait(&product_number);
        sem_wait(&queue_mutex); // 进入临界区

        printf("consumer[%lu] i: %d, value: %d\n", pthread_self(), i, queue[i]);
        queue[i] = 0; // 消费一个产品

        sem_post(&queue_mutex);  // 离开临界区
        sem_post(&blank_number); // 消费掉以后,将空格子数++
        i = (i + 1) % NUM;
        sleep(3); // 模拟消费耗时
    }
}

int main(int argc, char *argv[])
{
    pthread_t pid, cid;

    // 初始化信号量
    sem_init(&blank_number, 0, NUM); // 初始化空格子信号量为5
    sem_init(&product_number, 0, 0); // 初始化产品数信号量为0
    sem_init(&queue_mutex, 0, 1);    // 二进制信号量

    pthread_create(&pid, NULL, producer, NULL);
    pthread_create(&cid, NULL, consumer, NULL);

    pthread_join(pid, NULL);
    pthread_join(cid, NULL);

    // 销毁信号量
    sem_destroy(&blank_number);
    sem_destroy(&product_number);
    sem_destroy(&queue_mutex);

    return 0;
}
```

以上程序中定义了空格子信号量和产品数信号量，使用这两个信号量来控制生产者和消费者的执行：若程序中的队列存满，空格子信号量值为0，此时生产者线程停止生产数据，并向消费者线程发送信号，提醒消费者线程读取数据；若程序中队列为空，产品数信号量为0，此时消费者无法获取数据，便会向生产者线程发送信号，提醒生产者线程生产数据。

执行结果
