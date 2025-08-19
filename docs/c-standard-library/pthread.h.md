# pthread.h

线程又被称为轻量级进程（Lightweight Process，LWP）

与进程相比：

- 优点：线程具有开销小、数据通信与共享数据方便，并能在一定程度上提高程序并发性
- 不足：因为线程使用的是库函数，所以不够稳定

头文件

```cpp
#include <pthread.h>
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

## pthread_create

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
