# sys/sem.h

信号量（Semaphore）是专门用于解决进程同步与互斥问题的一种通信机制

在Linux系统中，不同的进程通过获取同一个信号量键值进行通信，实现进程间对资源的互斥访问。

使用信号量进行通信时，通常需要以下步骤：

（1）创建信号量/信号量集，或获取系统中已有的信号量/信号量集；

（2）初始化信号量。早期信号量通常被初始为1，但有些进程一次需要多个同类的临界资源，或多个不同类且不唯一的临界资源，因此可能需要初始化的不是信号量，而是一个信号量集；

（3）信号量的P、V操作，根据进程请求，修改信号量的数量。执行P操作会使信号量-1，执行V操作会使信号量+1；

（4）从系统中删除不需要的信号量。

## semget

创建一个新的信号集，或获取一个系统中已经存在的信号量集

```cpp
/**
 * 参数
 *   key 信号量的键值，通常为一个整数；
 *   nsems 创建的信号量数目
 *   semflg 标志位，与open()、msgget()函数中的标志位功能相似，都用来设置权限
 *     - 权限位可与IPC_CREAT以及IPC_EXCL发生位或
 *     - 另外若该标志位设置为IPC_PRIVATE，表示该信号量为当前进程的私有信号量。
 * 
 * 返回
 *   成功则返回信号量的标识符，
 *   失败返回-1，并设置errno，常见errno的值与其含义如下：
 *     - EACCES。表示进程无访问权限；
 *     - ENOENT。表示传入的键值不存在；
 *     - EINVAL。表示nsens小于0，或信号量数已达上限；
 *     - EEXIST。当semflg设置指定了ICP_CREAT和IPC_EXCL时，表示该信号量已经存在。
 */
int semget(key_t key, int nsems, int semflg);
```

## semctl

可以对信号量或信号量集进行多种控制

```cpp
/**
 * 参数
 * semid表示信号量标识符，通常为semget()的返回值；
 * semnum表示信号量在信号量集中的编号，该参数在使用信号量集时才会使用，通常设置为0，表示取第一个信号；
 * cmd表示对信号量进行的操作；
 * 最后一个参数是一个可选参数，依赖于参数cmd
 * 
 * 若该函数调用成功则根据参数cmd的取值返回相应信息，通常为一个非负整数；
 * 否则返回-1并设置errno
 */
int semctl(int semid, int semnum, int cmd, ...);
```

cmd常用的设置为SETVAL和IPC_RMID，其含义分别如下：

- SETVAL。表示semctl()的功能为初始化信号量的值，信号量值通过可选参数传入，在使用信号量前应先对信号量值进行设置；
- IPC_RMID。表示semctl()的功能为从系统中删除指定信号量。信号量的删除应由其所有者或创建者进行，没有被删除的信号量将会一直存在于系统中。

使用最后一个参数时，用户必须在程序中自定义一个如下所示的共用体：

```cpp
union semun {
    int val;                        //cmd为SETVAL时，用于指定信号量值
    struct semid_ds *buf;            //cmd为IPC_STAT时或IPC_SET时生效
    unsigned short *array;            //cmd为GETALL或SETALL时生效
    struct seminfo *_buf;            //cmd为IPC_INFO时生效
};

// 记录信号量属性信息
struct semid_ds {
    struct ipc_perm sem_perm;        //所有者和标识权限
    time_t            sem_otime;        //最后操作时间
    time_t            sem_ctime;        //最后更改时间
    unsigned short  sem_nsems;        //信号集中的信号数量
};
```

## semop

改变信号量的值

```cpp
/**
 * 参数
 *   semid 同样为semget()返回的信号量标识符；
 *   sops为一个struct sembuf类型的数组指针，该数组中的每个元素设置了要对信号量集中的哪个信号做哪种操作
 *   nsops 参数sops所指数组中元素的个数。
 * 
 * 返回
 *   若该函数调用成功返回0，否则返回-1，并设置errno。
 */
int semop(int semid, struct sembuf *sops, unsigned nsops);
```

struct sembuf结构体定义如下：

```cpp
struct sembuf{
  short sem_num;     //信号量在信号量集中的编号
  short sem_op;     //信号量操
  short sem_flag;    //标志位
};
```

- 当结构体成员sem_op
  - 设置为-1时，表示P操作；
  - 设置为+1时，表示V操作。
- 结构体成员sem_flg通常设置为SEM_UNDO，若进程退出前没有删除信号量，信号量将会由系统自动释放

示例：使用信号量实现父子进程同步，防止父子进程抢夺cpu

```cpp
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/sem.h>

static int sem_id;

// 设置信号量值
static int set_semvalue()
{
    semun_t sem_union;
    sem_union.val = 1;
    if (semctl(sem_id, 0, SETVAL, sem_union) == -1)
        return 0;
    return 1;
}

// 删除信号量
static void del_semvalue()
{
    if (semctl(sem_id, 0, IPC_RMID) == -1)
        perror("del err");
}

// p操作，获取信号量
static int semaphore_p()
{
    struct sembuf sem_b;
    sem_b.sem_num = 0;
    sem_b.sem_op = -1; // P
    sem_b.sem_flg = SEM_UNDO;
    if (semop(sem_id, &sem_b, 1) == -1)
    {
        perror("sem_p err");
        return 0;
    }
    return 1;
}

// V操作，释放信号量
static int semaphore_v()
{
    struct sembuf sem_b;
    sem_b.sem_num = 0;
    sem_b.sem_op = 1; // V
    sem_b.sem_flg = SEM_UNDO;
    if (semop(sem_id, &sem_b, 1) == -1)
    {
        perror("sem_v err");
        return 0;
    }
    return 1;
}

int main()
{
    int i;
    pid_t pid;
    char ch = 'C';

    // 创建信号量
    sem_id = semget((key_t)1000, 1, 0664 | IPC_CREAT);
    if (sem_id == -1)
    {
        perror("sem_c err");
        exit(-1);
    }

    // 设置信号量值
    if (!set_semvalue())
    {
        perror("init err");
        exit(-1);
    }

    // 创建子进程
    pid = fork();
    if (pid == -1)
    {                   // 若创建失败
        del_semvalue(); // 删除信号量
        exit(-1);
    }
    else if (pid == 0) // 设置子进程打印的字符
        ch = 'Z';
    else // 设置父进程打印的字符
        ch = 'C';

    // 设置随机数种子
    srand((unsigned int)getpid());

    for (i = 0; i < 8; i++) // 循环打印字符
    {
        semaphore_p();    // 获取信号量
        printf("%c", ch); // 将字符打印到屏幕
        fflush(stdout);

        sleep(rand() % 4); // 沉睡

        printf("%c", ch); // 再次打印到屏幕
        fflush(stdout);
        sleep(1);

        semaphore_v(); // 释放信号量
        sleep(1);
    }

    // 父进程
    if (pid > 0)
    {
        wait(NULL);     // 回收子进程
        del_semvalue(); // 删除信号量
    }

    printf("\nprocess %d finished.\n", getpid());
    return 0;
}
```

运行结果

```shell
% gcc main.c  -o main && ./main
CCZZCCZZCCZZCCZZCCZZCCZZCCZZCCZZ
process 64259 finished.

process 64258 finished.
```

观察运行结果，字符C与字符Z总是成对出现，这是因为案例5主函数的for()循环中进行了两次打印操作，且程序使用了一个二值信号量，将这两次打印操作绑定为了一个原子操作：代码第80行调用了semaphore_p()函数获取信号量，若获取信号量的是父进程，那么子进程将无法获取cpu，除非父进程调用semaphore_v()函数将信号量释放，否则子进程无法执行for循环中的核心代码；反之子进程获取信号量之后，父进程也无法获取cpu。
