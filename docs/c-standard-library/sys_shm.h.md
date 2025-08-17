# sys/shm.h

共享内存允许两个或多个进程访问给定的同一块存储区域。

一般情况下，共享内存应与信号量一起使用，由信号量帮它实现读写操作的同步。

## shmget

创建一块新的共享内存，或打开一块已经存在的共享内存

```cpp
/**
 * 参数
 *   key 通常为整数，代表共享内存的键值；
 *   size 用于设置共享内存的大小；
 *   shmflg 用于设置shmget()函数的创建条件（一般设置为IPC_CREAT或IPC_EXCL）及进程对共享内存的读写权限。
 * 
 * 返回
 *   若调用成功，将会返回一个共享内存标识符（该标识符是一个非负整数）；
 *   若调用失败，将会返回-1，并对errno进行设置。
 */
int shmget(key_t key, size_t size, int shmflg);
```

## shmat

进行地址映射，将共享内存映射到进程虚拟地址空间中

```cpp
/**
 * 参数
 *   shmid为共享内存标识符，该标识符一般由shmget()函数返回；
 *   shmaddr为一个指针类型的传入参数，用于指定共享内存映射到虚拟内存时的虚拟地址，当设置为NULL时，映射地址由系统决定；
 *   shmflg用于设置共享内存的使用方式，
 *     若shmflg设置为SHM_RDONLY，则共享内存将以只读的方式进行映射，当前进程只能从共享内存中读取数据。
 * 
 * 返回
 *   若调用成功，会返回映射的地址，并更改共享内存shmid_ds结构中的属性信息；
 *   若调用失败，会返回-1，并设置errno。
 */
void *shmat(int shmid, const void *shmaddr, int shmflg);
```

## shmdt

解除物理内存与进程虚拟地址空间的映射关系

```cpp
/**
 * 参数
 *   shmaddr 为shmat()函数返回的虚拟空间地址
 * 
 * 返回
 *   函数调用成功则返回0，并修改共享内存的shmid_ds结构中的属性信息；
 *   否则返回-1。
 */
int shmdt(const void *shmaddr);
```

## shmctl

对已存在的共享内存进行操作，具体的操作由参数决定

```cpp
/**
 * 参数
 *   shmid表示共享内存标识符；
 *   cmd表示要执行的操作，常用的设置为IPC_RMID，功能为删除共享内存；
 *   buf用于对共享内存的管理信息进行设置，该参数是一个结构体指针
 * 
 * 返回
 *   调用成功则返回0，
 *   否则返回-1，并设置errno。
 */
int shmctl(int shmid, int cmd, struct shmid_ds *buf);
```

shmid_ds 是一个为了方便对共享内存进行管理，由内核维护的存储共享内存属性信息的结构体，该结构体的类型定义如下：

```cpp
struct shmid_ds {
    struct ipc_perm shm_perm;        //所有者和权限标识
    size_t          shm_segsz;        //共享内存大小
    time_t          shm_atime;        //最后映射时间
    time_t          shm_dtime;        //最后解除映射时间
    time_t          shm_ctime;        //最后修改时间
    pid_t           shm_cpid;            //创建共享内存进程的id
    pid_t           shm_lpid;            //最近操作共享内存进程的id
    shmatt_t        shm_nattch;        //与共享内存发生映射的进程数量
    ...
};
```

## 示例

示例：创建两个进程，使用共享内存机制实现这两个进程间的通信。

shm_w.c

```cpp
#include <stdio.h>
#include <sys/ipc.h> // ftok
#include <sys/shm.h>
#include <sys/types.h>
#include <unistd.h>
#include <string.h>

#define SEGSIZE 4096 // 定义共享内存容量

// 读写数据结构体
typedef struct
{
    char name[8];
    int age;
} Student;

int main()
{
    int shm_id, i;
    key_t key;
    char name[8];
    Student *smap;
    key = ftok("/", 0); // 获取关键字
    if (key == -1)
    {
        perror("ftok error");
        return -1;
    }

    printf("key=%d\n", key);

    // 创建共享内存
    shm_id = shmget(key, SEGSIZE, IPC_CREAT | IPC_EXCL | 0664);
    if (shm_id == -1)
    {
        perror("create shared memory error\n");
        return -1;
    }
    printf("shm_id=%d\n", shm_id);

    smap = (Student *)shmat(shm_id, NULL, 0); // 将进程与共享内存绑定
    memset(name, 0x00, sizeof(name));
    strcpy(name, "Jhon");
    name[4] = '0';
    for (i = 0; i < 3; i++) // 写数据
    {
        name[4] += 1;
        strncpy((smap + i)->name, name, 5);
        (smap + i)->age = 20 + i;
    }

    if (shmdt(smap) == -1) // 解除绑定
    {
        perror("detach error");
        return -1;
    }
    return 0;
}
```

shm_r.c

```cpp
#include <stdio.h>
#include <string.h>
#include <sys/ipc.h>
#include <sys/shm.h>
#include <sys/types.h>
#include <unistd.h>

typedef struct
{
    char name[8];
    int age;
} Student;

int main()
{
    int shm_id, i;
    key_t key;
    Student *smap;

    // 获取关键字
    key = ftok("/", 0);
    if (key == -1)
    {
        perror("ftok error");
        return -1;
    }
    printf("key=%d\n", key);

    // 创建共享内存
    shm_id = shmget(key, 0, 0);
    if (shm_id == -1)
    {
        perror("shmget error");
        return -1;
    }
    printf("shm_id=%d\n", shm_id);

    // 将进程与共享内存绑定
    smap = (Student *)shmat(shm_id, NULL, 0);

    // 读数据
    for (i = 0; i < 3; i++)
    {
        printf("name:%s\n", (*(smap + i)).name);
        printf("age ：%d\n", (*(smap + i)).age);
    }

    // 解除绑定
    if (shmdt(smap) == -1)
    {
        perror("detach error");
        return -1;
    }

    // 删除共享内存
    shmctl(shm_id, IPC_RMID, NULL);

    return 0;
}
```

在终端中运行可执行程序，先执行shm_w创建共享内存，并向共享内存中写入数据；之后使用shm_r从共享内存中读取数据，数据读取完毕之后将共享内存删除。程序执行后终端打印的信息分别如下。

```shell
# 写入
gcc shm_w.c -o shm_w && ./shm_w
key=262146
shm_id=65537

# 读取
% gcc shm_r.c -o shm_r && ./shm_r
key=262146
shm_id=65537
name:Jhon1
age ：20
name:Jhon2
age ：21
name:Jhon3
age ：22
```

之后再次执行程序shm_r，终端打印的信息如下：

```shell
% gcc shm_r.c -o shm_r && ./shm_r
key=262146
shmget error: No such file or directory
```

由打印结果可知，共享内存区域已在程序shm_r执行结束前被删除。
