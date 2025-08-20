# pthread.h

线程又被称为轻量级进程（Lightweight Process，LWP）

与进程相比：

- 优点：线程具有开销小、数据通信与共享数据方便，并能在一定程度上提高程序并发性
- 不足：因为线程使用的是库函数，所以不够稳定

头文件

```cpp
#include <pthread.h>
```

## pthread_create

创建线程

```cpp
/**
 * 参数
 *   thread 待创建线程的线程id指针，这是一个传出参数，若需要对该线程进行操作，应使用一个pthread_t类型的变量获取该参数；
 *   attr用于设置待创建线程的属性，通常传入NULL，表示使用线程的默认属性；
 *   start_toutinue是一个函数指针，指向一个参数为void、返回值也为void*的函数，该函数为待创建线程的执行函数，线程创建成功后将会执行该函数中的代码；
 *   arg为要传给线程执行函数的参数
 * 
 * 返回
 *   成功，会返回0
 *   失败，则直接返回errno
 */
int pthread_create(
    pthread_t *thread, 
    const pthread_attr_t *attr,
​    void *(*start_routine) (void *), 
    void *arg
);
```

注意，由于errno的值很容易被修改，线程中很少使用errno来存储错误码，也不会使用perror()直接将其打印，而是使用自定义变量接收errno，再调用strerror()将获取到的错误码转换成错误信息，最后才打印错误信息。

## pthread_self

获取线程id

```cpp
pthread_t pthread_self(void);
```

进程id的类型pid_t实质是一个正整数，在整个系统中都是唯一的，但线程id只在当前进程中保证唯一，其类型pthread_t并非是一个正整数，且当前进程调用pthread_create()后获取到的thread为新线程id

示例

```cpp
#include <pthread.h>
#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include <unistd.h>

void *run_task(void *arg)
{
    printf("run_task pid: %d, tid: %lu\n", getpid(), pthread_self());
}

int main(int argc, char const *argv[])
{
    pthread_t tid;

    printf("main pid: %d, tid: %lu\n", getpid(), pthread_self());

    int result = pthread_create(&tid, NULL, run_task, NULL);
    if (result != 0)
    {
        printf("Error creating thread: %s\n", strerror(result));
        exit(EXIT_FAILURE);
    }

    result = pthread_join(tid, NULL);

    return 0;
}
```

运行结果

```shell
% gcc main.c  -o main -l pthread  && ./main
main pid: 72381, tid: 140704458284992
run_task pid: 72381, tid: 123145437802496
```

## pthread_exit

线程退出

```cpp
/**
 * 参数
 *  retval表示线程的退出状态，通常设置为NULL
 * 没有返回值
 */
void pthread_exit(void *retval);
```

区别

- return 用于退出函数，使函数返回函数调用处；
- exit() 用于退出进程
- pthread_exit 用于单个线程退出

示例

```cpp
#include <pthread.h>
#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include <unistd.h>

void *run_task(void *arg)
{
    printf("pthread_exit before\n");
    pthread_exit(NULL);
    printf("pthread_exit after\n"); // This line will not be executed

    return NULL;
}

int main(int argc, char const *argv[])
{
    pthread_t tid;

    int result = pthread_create(&tid, NULL, run_task, NULL);
    if (result != 0)
    {
        printf("Error creating thread: %s\n", strerror(result));
        exit(EXIT_FAILURE);
    }

    result = pthread_join(tid, NULL);

    return 0;
}
```

运行结果

```shell
% gcc main.c  -o main -l pthread  && ./main
pthread_exit before
```

## pthread_cancel

线程终止，使用该函数可以通过向指定线程发送CANCEL信号，使一个线程强行杀死另外一个线程

```cpp
/**
 * 参数
 *   thread为线程id，
 * 
 * 返回
 *   成功则返回0，否则返回errno
 */
int pthread_cancel(pthread_t thread);
```

区别

- pthread_exit()使线程主动退出
- pthread_cancel()通过信号使线程被动退出，尽量避免使用

与进程不同的是，调用pthread_cancel()函数杀死线程时，需要等待线程到达某个取消点，线程才会成功被终止

示例

```cpp
#include <stdio.h>
#include <unistd.h>
#include <pthread.h>
#include <stdlib.h>

void *tfn(void *arg)
{
    while (1)
    {
        printf("child thread...\n");
        pthread_testcancel(); // 设置取消点
    }
}

int main(void)
{
    pthread_t tid;
    void *tret = NULL;
    pthread_create(&tid, NULL, tfn, NULL);
    sleep(1);
    pthread_cancel(tid);
    pthread_join(tid, &tret);
    printf("child thread exit code = %ld\n", (long int)tret);
    return 0;
}
```

运行结果

```shell
% gcc main.c  -o main -l pthread  && ./main

child thread...
child thread...
child thread...
child thread...
child thread...
child thread...
child thread...
child thread exit code = 1
```

## pthread_join

线程挂起

```cpp
/**
 * 参数
 *   pthread表示被等待的线程id
 *   retval用于接收thread线程执行函数的返回值指针
 * 成功将返回0，否则返回errno
 */
int pthread_join(pthread_t thread, void **retval);
```

retval指针的值与thread线程的终止方式有关：

- 若thread线程通过return返回，retval所指的存储单元中存放的是thread线程函数的返回值；

- 若thread线程被其它线程通过系统调用pthread_cancel()异常终止，retval所指向的存储单元中存放的是常量PTHREAD_CANCELED；

- 若thread线程通过自调用pthread_exit()终止，retval所指向的存储单元中存放的是pthread_exit()中的参数ret_val；

- 此外，若等待thread的线程不关心它的终止状态，可以将retval的值设置为NULL。

```cpp
#include <stdio.h>
#include <unistd.h>
#include <pthread.h>
#include <stdlib.h>

void *task(void *arg)
{
    int *ret = malloc(sizeof(int));
    *ret = 100;                // 设置线程返回值
    pthread_exit((void *)ret); // 线程终止
    return NULL;               // 线程返回
}

int main(void)
{
    pthread_t tid;
    int *retval;

    pthread_create(&tid, NULL, task, NULL);

    // 调用pthread_join可以获取线程的退出状态
    pthread_join(tid, (void **)&retval);

    printf("retval: %d\n", *retval);
    free(retval); // 释放线程返回值的内存

    return 0;
}

```

运行结果

```shell
% gcc main.c  -o main -l pthread  && ./main
retval: 100
```

## pthread_detach

将线程从主控线程中分离，如此，当线程结束后，它的退出状态不由其它线程获取，而是由该线程自身自动释放。

```cpp
/**
 * 参数
 *   thread为待分离线程的id
 * 
 * 返回
 *   成功则返回0
 *   失败返回errno
 */
int pthread_detach(pthread_t thread);
```

注意，pthread_join()不能终止已处于death状态的线程，若对处于分离态的线程调用pthread_join()函数，函数将会调用失败并返回EINVAL。

示例

```cpp
#include <stdio.h>
#include <unistd.h>
#include <pthread.h>
#include <stdlib.h>
#include <string.h>

void *tfn(void *arg)
{
    int n = 5;
    while (n--)
    {
        printf("pthread tfn n = %d\n", n);
        sleep(1);
    }
    return (void *)7;
}

int main(void)
{
    pthread_t tid;
    void *ret;

    pthread_create(&tid, NULL, tfn, NULL);

    // 分离子线程
    pthread_detach(tid);

    int retvar = pthread_join(tid, (void **)&ret);
    if (retvar != 0)
    {
        fprintf(stderr, "pthread_join error %s\n", strerror(retvar));
    }
    else
    {
        printf("pthread exit with %ld\n", (long int)ret);
    }

    return 0;
}
```

运行结果

```shell
% gcc main.c  -o main -l pthread  && ./main
pthread_join error Invalid argument
```

## __thread

`__thread`是GCC的扩展关键字，用于定义线程局部存储变量

示例

```cpp
#include <stdio.h>
#include <pthread.h>
#include <unistd.h>

__thread int i = 0;

void *f1(void *arg)
{
    i++;
    printf("f1 i address %p val %d\n", &i, i);
    return NULL;
}

void *f2(void *arg)
{
    i += 2;
    printf("f2 i address %p val %d\n", &i, i);

    return NULL;
}

int main()
{
    pthread_t pid1, pid2;
    
    i += 3;
    pthread_create(&pid1, NULL, f1, NULL);
    pthread_create(&pid2, NULL, f2, NULL);
    pthread_join(pid1, NULL);
    pthread_join(pid2, NULL);

    printf("main i address %p val %d\n", &i, i);
    return 0;
}
```

运行结果

```shell
% gcc main.c -o main -lpthread && ./main
f2 i address 0x7fb4edf060c0 val 2
f1 i address 0x7fb4ee804080 val 1
main i address 0x7fb4edf05fa0 val 3
```

## pthread_attr_t

线程属性pthread_attr_t，该结构体中成员的值不能直接修改，须使用函数进行相关操作

```cpp
typedef struct
{
    int                     detachstate;      // 线程的分离状态
    int                     schedpolicy;     //线程调度策略
    struct sched_param    schedparam;        //线程的调度参数
    int                     inheritsched;    //线程的继承性
    int                     scope;           //线程的作用域
    size_t                 guardsize;        //线程栈末尾的警戒缓冲区大小
    int                    stackaddr_set;    //线程栈的设置
    void*                 stackaddr;         //线程栈的位置
    size_t                 stacksize;        //线程栈的大小
} pthread_attr_t;
```

创建和销毁

```cpp
/**
 * 线程属性attr会被设置为默认值
 * 默认情况下线程处于非绑定、非分离状态，并与共享父进程优先级
 * 若要使用默认状态，将pthread_create()函数中的参数attr设置为NULL即可
 * 初始化线程属性结构体的函数为pthread_attr_init()
 * 这个函数必须在pthread_create()之前调用
 */
int pthread_attr_init(pthread_attr_t *attr);

/**
 * 线程终止后须通过pthread_attr_destroy()函数销毁属性资源。
 */
int pthread_attr_destroy(pthread_attr_t *attr);
```

调用顺序

```cpp
pthread_attr_init()
pthread_create()
pthread_join()
pthread_attr_destroy()
```

相关操作

### 1、线程的分离状态

默认情况下线程处于非分离状态

```cpp
/**
 * 修改线程属性中的分离状态
 */
int pthread_attr_setdetachstate(pthread_attr_t *attr, int detachstate);

/**
 * 获取线程的分离状态
 */
int pthread_attr_getdetachstate(pthread_attr_t *attr, int *detachstate);
```

参数detachstate设置为

- PTHREAD_CREATE_DETACHED，线程创建后将以分离状态启动

### 2、线程的调度策略

```cpp
/**
 * 设置线程的调度策略
 */
int pthread_attr_setschedpolicy(pthread_attr_t *attr, int policy);

/**
 * 获取线程的调度策略
 */
int pthread_attr_getschedpolicy(pthread_attr_t *attr, int *policy);
```

policy三种调度策略的含义分别如下：

- SCHED_OTHER，分时调度策略(默认值)；

- SCHED_FIFO，实时调度策略，先到先服务；

- SCHED_RR，实时调度策略，按时间片轮询。

其中分时调度策略通过nice值和counter值决定调度权值，nice值越小、counter越大，被调用的概率越高；实时调度策略通过实时优先级决定调度权值，若线程已准备就绪，除非有优先级相同或更高的线程正在运行，否则该线程很快便会执行。

而实时调度策略SCHED_FIFO与SCHED_RR的不同在于：

- 调度策略为SCHED_FIFO的进程一旦获取cpu便会一直运行，除非有优先级更高的任务就绪或主动放弃cpu；
- 调度策略为SCHED_RR的进程则根据时间片轮询，若线程占用cpu的时间超过一个时间片，该线程就会失去cpu，并被置于就绪队列队尾，确保与该进程优先级相同且调度策略为SCHED_FIFO或SCHED_RR能被公平调度。

### 3、线程的调度参数

```cpp
/**
 * 设置调度参数
 */
int pthread_attr_setschedparam(pthread_attr_t *attr,
                               const struct sched_param *param);

/**
 * 获取调度参数
 */
int pthread_attr_getschedparam(pthread_attr_t *attr,
​                               struct sched_param *param);
```

线程的调度参数是一个struct sched_param类型的结构体，该结构体中只有一个成员sched_priority，该参数是一个整型变量，代表线程的优先级，仅当调度策略为SCHED_FIFO或SCHED_RR时成员sched_priority有效

其中

- 参数attr代表线程属性
- 参数param代表线程的调度参数，param中成员sched_priority的默认值为0。
- 若函数调用成功则返回0，否则返回errno。

### 4、线程的继承性

线程的继承性决定线程调度策略属性和线程调度参数的来源，其来源有两个:

- 一是从创建该线程的线程属性中继承
- 二是从该线程属性结构体中获取。

线程的继承性没有默认值，若要使用该属性，必须对其进行设置。

```cpp
/**
 * 设置线程继承性
 */
int pthread_attr_setinheritsched(pthread_attr_t *attr,int inheritsched);

/**
 * 获取线程继承性
 */
int pthread_attr_getinheritsched(pthread_attr_t *attr,int *inheritsched);
```

其中

- 参数attr代表线程属性
- 参数inheritsched代表线程的继承性，该参数的常用取值为
  - PTHREAD_INHERIT_SCHED：使新线程继承其父线程中的调度策略和调度参数
  - PTHREAD_EXPLICIT_SCHED：使用在attr属性中显示设置的调度策略和调度参数

- 若函数调用成功则返回0，否则返回errno。

### 5、线程的作用域

```cpp
/**
 * 设置线程的作用域
 */
int pthread_attr_setscope(pthread_attr_t *attr, int scope);

/**
 * 获取线程的作用域
 */
int pthread_attr_getscope(pthread_attr_t *attr, int *scope);
```

其中

- 参数attr代表线程属性；
- 参数scope代表线程的作用域，该参数常用的取值为
  - PTHREAD_SCOPE_PROCESS: 在进程中竞争资源
  - PTHREAD_SCOPE_SYSTEM: 在系统层级竞争资源。

- 若函数调用成功则返回0，否则返回-1。

### 6、线程的栈空间

线程栈空间大小

```cpp
/**
 * 修改线程栈空间大小
 */
int pthread_attr_setstacksize(pthread_attr_t *attr, size_t stacksize);

/**
 * 获取线程栈空间大小
 */
int pthread_attr_getstacksize(pthread_attr_t *attr, size_t *stacksize);
```

其中

- 参数attr代表线程属性
- 参数stacksize代表栈空间大小。
- 若函数调用成功则返回0，否则返回errno。

### 7、栈地址

```cpp
/**
 * 设置栈地址
 */
int pthread_attr_setstackaddr(pthread_attr_t *attr, void *stackaddr);

/**
 * 获取栈地址
 */
int pthread_attr_getstackaddr(pthread_attr_t *attr, void **stackaddr);
```

当改变栈地址属性时，栈警戒区大小通常会被清零。若函数调用成功则返回0，否则返回errno。

### 8、栈末尾警戒区大小

```cpp
/**
 * 设置栈末尾警戒区大小
 */
int pthread_attr_setguardsize(pthread_attr_t *attr, size_t guardsize);

/**
 * 获取栈末尾警戒区大小
 */
int pthread_attr_getguardsize(pthread_attr_t *attr, size_t *guardsize);
```

### 9、栈地址与栈容量

```cpp
/**
 * 设置线程属性中的栈地址与栈容量
 */
int pthread_attr_setstack(pthread_attr_t *attr,
                          void *stackaddr, size_t stacksize);

/**
 * 获取线程属性中的栈地址与栈容量
 */
int pthread_attr_getstack(pthread_attr_t *attr,
                         void **stackaddr, size_t *stacksize);
```

其中:

- 参数attr: 线程属性
- 参数stackaddr: 栈空间地址
- 参数stacksize: 栈空间容量
- 若函数调用成功则返回0，否则返回errno。

示例

```cpp
#include <pthread.h>
#include <sched.h>
#include <stdio.h>
#include <unistd.h> // for getpid()

void* thread_function(void* arg) {
    // 做一些工作
    printf("Thread is running\n");
    sleep(2);
    return NULL;
}

int main() {
    pthread_t thread;
    pthread_attr_t attr;
    struct sched_param param;
    int policy;

    // 初始化线程属性对象
    pthread_attr_init(&attr);

    // 先获取当前的调度策略（继承自父线程，通常是 SCHED_OTHER）
    pthread_attr_getschedpolicy(&attr, &policy);
    pthread_attr_getschedparam(&attr, &param);
    printf("Default policy: %d, priority: %d\n", policy, param.sched_priority);

    // 设置为使用 SCHED_RR 调度策略
    policy = SCHED_RR;
    pthread_attr_setschedpolicy(&attr, policy);

    // 设置优先级，例如设置为 RR 策略的中间值
    int min_prio = sched_get_priority_min(policy);
    int max_prio = sched_get_priority_max(policy);
    param.sched_priority = (min_prio + max_prio) / 2;
    printf("Trying to set policy: %d, priority: %d\n", policy, param.sched_priority);

    // 将新的调度策略和参数应用到属性对象
    pthread_attr_setschedparam(&attr, &param);

    // 非常重要：告诉系统我们将使用显式设置的调度属性，而不是继承的
    pthread_attr_setinheritsched(&attr, PTHREAD_EXPLICIT_SCHED);

    // 创建线程，并应用这些属性
    if (pthread_create(&thread, &attr, &thread_function, NULL) != 0) {
        perror("pthread_create failed");
        return 1;
    }

    // 等待线程结束
    pthread_join(thread, NULL);

    // 销毁属性对象
    pthread_attr_destroy(&attr);

    return 0;
}
```

运行结果

```shell
% gcc main.c  -o main -l pthread  && ./main
Default policy: 1, priority: 31
Trying to set policy: 2, priority: 31
Thread is running
```

## 互斥锁

使用互斥锁实现线程同步时，系统会为共享资源添加一个称为互斥锁的标记，防止多个线程在同一时刻访问相同的共用资源。

互斥锁通常也被称为互斥量（mutex），它相当于一把锁，使用互斥锁可以保证以下3点：

- （1）原子性：如果在一个线程设置了一个互斥锁，那么在加锁与解锁之间的操作会被锁定为一个原子操作，这些操作要么全部完成，要么一个也不执行；
- （2）唯一性：如果为一个线程锁定了一个互斥锁，在解除锁定之前，没有其它线程可以锁定这个互斥量；
- （3）非繁忙等待：如果一个线程已经锁定了一个互斥锁，此后第二个线程试图锁定该互斥锁，则第二个线程会被挂起；直到第一个线程解除对互斥锁的锁定时，第二个线程才会被唤醒，同时锁定这个互斥锁。

使用互斥锁实现线程同步时主要包含四步：

- 初始化互斥锁
- 加锁
- 解锁
- 销毁锁

### pthread_mutex_init

初始化互斥锁

```cpp
/**
 * 参数
 *   mutex 传出参数
 *   attr 代表互斥量的属性，通常传NULL，表示使用默认属性。
 * 成功则返回0，否则返回errno
 */
int pthread_mutex_init(pthread_mutex_t *restrict mutex,
​              const pthread_mutexattr_t *restrict attr);
```

关于参数mutex有以下几个要点：

- pthread_mutext_t类型的本质是结构体，为简化理解，读者可将其视为整型；
- pthread_mutex_t类型的变量mutex只有两种取值：0和1，
  - 加锁操作可视为`mutex-1`；
  - 解锁操作可视为`mutex+1`；
- 参数mutex之前的restrict是一个关键字，该关键字用于限制指针，其功能为告诉编译器，所有修改该指针指向内存中内容的操作，只能通过本指针完成。

errno的常见取值为:

- EAGAIN表示超出互斥锁递归锁定的最大次数，因此无法获取该互斥锁；
- EDEADLK表示当前线程已有互斥锁，二次加锁失败。

通过pthread_mutex_init()函数初始化互斥量又称为`动态初始化`，一般用于初始化局部变量，示例如下：

```cpp
pthread_mutex_init(&mutex, NULL);
```

此外互斥锁也可以直接使用宏进行初始化，示例如下：

```cpp
pthead_mutex_t muetx = PTHREAD_MUTEX_INITIALIZER;
```

此条语句与以上动态初始化示例语句功能相同。

### pthread_mutex_lock

锁定指定互斥量

```cpp
/**
 * 参数mutex，表示待锁定的互斥量
 * 调用成功则返回0，否则返回errno
 */
int pthread_mutex_lock(pthread_mutex_t *mutex);
```

程序中调用函数pthread_mutex_lock 后，直至程序中调用pthread_mutex_unlock()函数之前，此间的代码均被上锁，即在同一时刻只能被一个线程执行。

### pthread_mutex_trylock

```cpp
/**
 * 参数mutex同样表示待锁定的互斥量
 * 若函数调用成功则返回0，否则返回errno
 */
int pthread_mutex_trylock(pthread_mutex_t *mutex);
```

若需要使用的互斥锁正在被使用，调用pthread_mutxe_lock()函数的线程会进入阻塞，但有些情况下，我们希望线程可以先去执行其它功能，此时需要使用非阻塞的互斥锁。

Linux系统中提供了pthread_mutex_trylock()函数，该函数的功能为尝试加锁，若锁正在被使用，不阻塞等待，而是直接返回并返回错误号。

其中常见的errno有两个，分别为:

- EBUSY：参数mutex指向的互斥锁已锁定；
- EAGAIN：超过互斥锁递归锁定的最大次数。

### pthread_mutex_unlock

线程将会为指定互斥量解锁

```cpp
/**
 * 参数mutex表示待解锁的互斥量。
 * 调用成功则返回0，否则返回errno
 */
int pthread_mutex_unlock(pthread_mutex_t *mutex);
```

### pthread_mutex_destroy

互斥锁也是系统中的一种资源，因此使用完毕后应将其释放

线程将为指定互斥量解锁

```cpp
/**
 * 参数mutex表示待销毁的互斥量。
 * 调用成功则返回0，否则返回errno。
 */
int pthread_mutex_destroy(pthread_mutex_t *mutex);
```

### 示例

两个线程输出文字：

- 线程1: 预期输出 hello world
- 线程2: 预期输出 HELLO WORLD

示例1：未加锁

```cpp
#include <pthread.h>
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>

void *task1(void *arg)
{
    printf("hello ");
    sleep(1);
    printf("world\n");
    return NULL;
}

void *task2(void *arg)
{
    printf("HELLO ");
    sleep(1);
    printf("WORLD\n");
    return NULL;
}

int main(int argc, char const *argv[])
{
    pthread_t task1_tid, task2_tid;

    pthread_create(&task1_tid, NULL, task1, NULL);
    pthread_create(&task2_tid, NULL, task2, NULL);

    pthread_join(task1_tid, NULL);
    pthread_join(task2_tid, NULL);

    return 0;
}

```

运行结果

```shell
% gcc main.c  -o main -l pthread  && ./main
hello HELLO world
WORLD
```

示例2：加锁

```cpp
#include <pthread.h>
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>

pthread_mutex_t mutex;

void *task1(void *arg)
{
    pthread_mutex_lock(&mutex); // 加锁

    printf("hello ");
    sleep(1);
    printf("world\n");

    pthread_mutex_unlock(&mutex); // 释放锁
    return NULL;
}

void *task2(void *arg)
{
    pthread_mutex_lock(&mutex); // 加锁

    printf("HELLO ");
    sleep(1);
    printf("WORLD\n");

    pthread_mutex_unlock(&mutex); // 释放锁

    return NULL;
}

int main(int argc, char const *argv[])
{
    pthread_t task1_tid, task2_tid;

    // 初始化信号量
    pthread_mutex_init(&mutex, NULL);

    // 启动线程
    pthread_create(&task1_tid, NULL, task1, NULL);
    pthread_create(&task2_tid, NULL, task2, NULL);

    // 等待线程结束
    pthread_join(task1_tid, NULL);
    pthread_join(task2_tid, NULL);

    // 销毁信号量
    pthread_mutex_destroy(&mutex);

    return 0;
}
```

运行结果

```shell
% gcc main.c  -o main -l pthread  && ./main
hello world
HELLO WORLD
```

## 条件变量

使用条件变量控制线程同步时，线程访问共享资源的前提，是程序中设置的条件变量得到满足。条件变量不会对共享资源加锁，但也会使线程阻塞，若线程不满足条件变量规定的条件，就会进入阻塞状态直到条件满足。

条件变量往往与互斥锁搭配使用，在线程需要访问共享资源时，会先绑定一个互斥锁，然后检测条件变量

- 若条件变量满足，线程就继续执行，并在资源访问完成后解开互斥锁；
- 若条件变量不满足，线程将解开互斥锁，进入阻塞状态，等待条件变量状况发生改变。

一般条件变量的状态由其它非阻塞态的线程改变，条件变量被满足则会唤醒阻塞中的进程，这些线程再次争夺互斥锁，对条件变量状况进行测试。

综上所述，条件变量的使用分为以下四个步骤：

- （1）初始化条件变量；
- （2）等待条件变量满足；
- （3）唤醒阻塞线程；
- （4）释放条件变量。

### pthread_cond_init

初始化条件变量

```cpp
/**
 * 参数cond代表条件变量
 * 参数attr代表条件变量的属性，通常设置为NULL，表示使用默认属性初始化条件变量
 *   - PTHREAD_PROCESS_PRIVATE，默认值，当前进程中的线程共用此条件变量；
 *   - PTHREAD_PROCESS_SHARED，表示多个进程间的线程共用条件变量。
 * 
 * 成功则返回0，否则返回-1，并设置errno
 */
int pthread_cond_init(pthread_cond_t *restrict cond,
​             const pthread_condattr_t *restrict attr);
```

除使用函数pthread_cond_init()动态初始化条件变量外，也可以使用如下语句以静态方法初始化条件变量：

```cpp
pthread_cond_t cond = PTHREAD_COND_INITIALIZER;
```

此种方式与将attr参数初始化为NULL的pthread_cond_init()函数等效，但是不进行错误检查。

### pthread_cond_wait

阻塞等待条件变量

```cpp
/**
 * 参数cond代表条件变量；
 * 参数mutex代表与当前线程绑定的互斥锁。
 * 
 * 成功则返回0，否则返回-1，并设置errno。
 */
int pthread_cond_wait(pthread_cond_t *restrict cond,
​              pthread_mutex_t *restrict mutex);
```

pthread_cond_wait()类似于互斥锁中的函数pthread_mutex_lock()，但其功能更为丰富，它的工作机制如下：

（1）阻塞等待条件变量cond满足；

（2）解除已绑定的互斥锁（类似于pthread_mutex_unlock()）；

（3）当线程被唤醒，pthread_cond_wait()函数返回，pthread_cond_wait()函数同时会解除线程阻塞，并使线程重新申请绑定互斥锁。

以上工作机制中，前两条为一个原子操作；需要注意的最后一条，最后一条机制表明：当线程被唤醒后，仍需重新绑定互斥锁。这是因为，“线程被唤醒”及“绑定互斥锁”并不是一个原子操作，条件变量满足后也许会有多个处于运行态的线程出现，并竞争互斥锁，极有可能在线程B绑定互斥锁之前，线程A已经执行了以下操作：

获取互斥锁——修改条件变量——解除互斥锁

此时线程B即便获取到互斥锁，条件变量仍不满足，线程B应继续阻塞等待。综上所述，再次检测条件变量的状况是极有必要的。

![](https://mouday.github.io/img/2025/08/20/dm3sel9.png)

### pthread_cond_timedwait

使线程阻塞等待条件变量

该函数可以指定线程的阻塞时长，若等待超时，该函数便会返回

```cpp
/**
 * 参数cond代表条件变量，
 * 参数mutex代表互斥锁，
 * 参数abstime代表绝对时间，用于设置等待时长，该参数是一个传入参数
 */
int pthread_cond_timedwait(
        pthread_cond_t *restrict cond,
        pthread_mutex_t *restrict mutex,
        const struct timespec *restrict abstime
);
```

`struct timespec` 定义如下

```cpp
struct timespec {
  time_t tv_sec;   //秒
  long  tv_nsec;   //纳秒
}
```

### pthread_cond_signal

在条件变量满足之后，以信号的形式唤醒阻塞在该条件变量的一个线程。处于阻塞状态中的线程的唤醒顺序由调度策略决定

```cpp
/**
 * 参数cond代表条件变量
 * 成功则返回0，否则返回-1，并设置errno。
 */
int pthread_cond_signal(pthread_cond_t *cond);
```

### pthread_cond_broadcast

唤醒阻塞在指定条件变量的线程，该函数会以广播的形式，唤醒阻塞在该条件变量上的所有线程。

```cpp
/**
 * 参数cond代表条件变量
 * 成功则返回0，否则返回-1，并设置errno。
 */
int pthread_cond_broadcast(pthread_cond_t *cond);
```

### 示例

生产者-消费者模型，两个线程，消费者必须等待消费者生产数据后才能消费

```cpp
#include <pthread.h>
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <time.h>

// 初始化互斥锁
pthread_mutex_t mutex = PTHREAD_MUTEX_INITIALIZER;
// 初始化条件变量
pthread_cond_t cond = PTHREAD_COND_INITIALIZER;

int value = 0; // 标志位，表示是否有产品

void *producer(void *arg)
{
    while (1)
    {
        pthread_mutex_lock(&mutex); // 加锁

        while (value)
        {
            pthread_cond_wait(&cond, &mutex); // 等待条件变量
        }

        sleep(1);                   // 模拟生产过程
        value = random() % 100 + 1; // 生产完毕，设置标志位
        printf("producer: %d\n", value);
        pthread_mutex_unlock(&mutex); // 释放锁
        pthread_cond_signal(&cond);   // 通知消费者
    }

    return NULL;
}

void *comsumer(void *arg)
{

    while (1)
    {
        pthread_mutex_lock(&mutex); // 加锁
        while (!value)
        {
            pthread_cond_wait(&cond, &mutex); // 等待条件变量
        }
        printf("comsumer: %d\n", value);
        sleep(1);                     // 模拟消费过程
        value = 0;                    // 消费完毕，重置标志位
        pthread_mutex_unlock(&mutex); // 释放锁
        pthread_cond_signal(&cond);   // 通知生产者
    }

    return NULL;
}

int main(int argc, char const *argv[])
{
    pthread_t producer_tid, comsumer_tid;

    srand(time(NULL));

    // 启动线程
    pthread_create(&producer_tid, NULL, producer, NULL);
    pthread_create(&comsumer_tid, NULL, comsumer, NULL);

    // 等待线程结束
    pthread_join(producer_tid, NULL);
    pthread_join(comsumer_tid, NULL);

    // 销毁
    pthread_mutex_destroy(&mutex);
    pthread_cond_destroy(&cond);

    return 0;
}

```

```shell
% gcc main.c  -o main -l pthread  && ./main
producer: 84
comsumer: 84
producer: 87
comsumer: 87
producer: 78
comsumer: 78
producer: 16
comsumer: 16
```