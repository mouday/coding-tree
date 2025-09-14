# sys/msg.h

消息队列可以实现无亲缘关系进程间的通信，且独立于通信双方的进程之外，若没有删除内核中的消息队列，即便所有使用消息队列的进程都已终止，消息队列仍存在于内核中，直到内核重新启动、管理命令被执行或调用系统接口删除消息队列时，消息队列才会真正被销毁。

使用消息队列实现进程间通信的步骤如下：

- （1）创建消息队列；
- （2）发送消息到消息队列；
- （3）从消息队列中读取数据；
- （4）删除消息队列。

头文件

```cpp
#include <sys/msg.h>
```

## msgget

创建一个消息队列，或获取一个已经存在的消息队列

```cpp
int msgget(key_t key, int msgflg);
```

成功，则返回消息队列的标识符，否则返回-1，并设置errno。

- 参数key表示消息队列的键值，通常为一个整数，若键值为IPC_PRIVATE，将会创建一个只能被创建消息队列的进程读写的消息队列；
- 参数msgflg类似于open()函数中标志位的功能，用于设置消息队列的创建方式或权限，它通常由一个9位的权限与以下值进行位操作后获得：
  - (a) 当msgflg=mask|IPC_CREAT时，若内核中不存在指定消息队列，该函数会创建一个消息队列；若内核中已存在指定消息队列，则获取该消息队列；
  - (b) 当msgflg= mask|IPC_CREAT|IPC_EXCL时，消息队列不存在时会被创建，已存在时msgset()调用失败，返回-1，设置errno为EEXIST。

## msgsnd

向指定消息队列中发送一个消息

```cpp
int msgsnd(int msqid, const void *msgp, size_t msgsz, int msgflg);
```

成功，则返回消息队列的标识符，否则返回-1，并设置errno。

- 参数msgid表示消息队列标识符，即msgget()调用成功时的返回值；
- 参数msgp表示指向消息缓冲区的指针；
- 参数msgsz表示消息中数据的长度，这个长度不包括长整型成员变量的长度；
- 参数msgflg为标志位，可以设置为0或IPC_NOWAIT，若消息队列已满或系统中的消息数量达到上限，即当msgflg设置为IPC_NOWAIT时，函数立即返回（返回值为-1）；当msgflg设置为0时，调用函数的进程会被挂起，直到消息写入消息队列为止。

msgsnd()函数发送的消息受两项约束：

- 一是消息长度必须小于系统规定上限；
- 二是消息必须以一个长整形成员变量开始，因为需要利用此变量先确定消息的类型。

Linux系统中定义了一个模板数据结构，其形式如下：

```cpp
struct msgbuf{
  long int msgtype;     //消息类型
  anytype data;       //要发送的数据，可以为任意类型
}
```

## msgrcv

从消息队列中读取消息，被读取的消息会从消息队列中消失

```cpp
ssize_t msgrcv(int msqid, void *msgp, size_t msgsz, long msgtyp,int msgflg);
```

若该函数调用成功，则返回消息队列的标识符，否则返回-1，并设置errno。

- 参数msgid表示消息队列的id号，通常由msgset()函数返回；
- 参数msgp为指向所读取消息的结构体指针；
- 参数msgsz表示消息的长度，这个长度不包含整型成员变量的长度；
- 参数mtype表示从消息队列中读取的消息类型，其取值以及各值代表的含义分别如下：
  - 若mtype=0，表示获取队列中的第一个可用消息；
  - 若mtype>0，表示获取队列中与该值类型相同的第一个消息；
  - 若mtype<0，表示获取队列中消息类型小于或等于其绝对值的第一个消息。
- 参数msgflg依然为标志位，msgflg设置为0时，进程将阻塞等待消息的读取；msgflg设置为IPC_NOWAIT时，进程未读取到指定消息时将立刻返回-1。

## msgctl

对指定消息队列进行控制

```cpp
int msgctl(int msqid, int cmd, struct msqid_ds *buf);
```

成功，则返回消息队列的标识符，否则返回-1，并设置errno，若进程正因调用msgsnd()或msgrcv()而产生阻塞，这两个函数将以失败返回。

- 参数msgid表示消息队列的id，通常由msgset()返回；
- 参数cmd表示消息队列的处理命令，通常有以下几种取值：
  - IPC_RMID。该取值表示msgctl()函数将从系统内核中删除指定命令，使用命令“ipcrm –q id”可实现同样功能；
  - IPC_SET。该取值表示若进程有权限，就将内核管理的消息队列的当前属性值设置为参数buf各成员的值；
  - IPC_STAT。该取值表示将内核所管理的消息队列的当前属性值复制给参数buf。

参数buf是一个缓冲区，用于传递属性值给指定消息队列，或从指定消息队列获取属性值，其功能视参数cmd而定。其数据类型struct msqid为一个结构体，内核为每个消息队列维护了一个msqid_ds结构，用于消息队列的管理，该结构体的定义在`sys/ipc.h` 中，详细信息如下：

```cpp
struct msqid_ds{
    struct ipc_perm msg_perm;            //所有者和权限标识
    time_t msg_stime;                    //最后一次发送消息的时间
    time_t msg_rtime;                    //最后一次接收消息的时间
    time_t msg_ctime;                    //最后改变时间
    unsigned long __msg_cbytes;            //队列中当前数据字节数
    msgqnum_t msg_qnum;                    //队列中当前消息数
    msglen_t msg_qbytes;                //队列允许的最大字节数
    pid_t msg_lspid;                    //最后发送消息的进程的pid
    pit_t msg_lrpid;                    //最后接收消息的进程的pid
};
```

## 示例

接收端

```cpp
// msgrcv.c
#include <stdio.h>
#include <stdlib.h>
#include <sys/msg.h>

// 消息结构体
struct msg_t
{
    long int msg_type; // 消息类型
    int msg_data;      // 消息数据
};

int main()
{
    int idx = 1;
    int msgid;
    struct msg_t data;
    long int msg_to_rcv = 0;

    // rcv msg
    msgid = msgget((key_t)1000, 0664 | IPC_CREAT); // 获取消息队列
    if (msgid == -1)
    {
        perror("msgget err");
        exit(-1);
    }

    while (idx <= 5)
    {
        // 接收消息
        if (msgrcv(msgid, (void *)&data, sizeof(data), msg_to_rcv, 0) == -1)
        {
            perror("msgrcv err");
            exit(-1);
        }

        // 打印消息
        printf("msg type:%ld ", data.msg_type);
        printf("msg data:%d\n", data.msg_data);

        idx++;
    }

    // 删除消息队列
    if (msgctl(msgid, IPC_RMID, 0) == -1)
    {
        perror("msgctl err");
        exit(-1);
    }

    exit(0);
}
```

发送端

```cpp
// msgsend.c

#include <stdio.h>
#include <stdlib.h>
#include <sys/msg.h>
#include <string.h>
#include <time.h>

// 消息结构体
struct msg_t
{
    long int msg_type; // 消息类型
    int msg_data;      // 消息数据
};

int main()
{
    int idx = 1;
    int msgid;
    struct msg_t data;
    char buf[BUFSIZ]; // 设置缓存变量

    msgid = msgget((key_t)1000, 0664 | IPC_CREAT); // 创建消息队列
    if (msgid == -1)
    {
        perror("msgget err");
        exit(-1);
    }

    srand((unsigned int)time(NULL)); // 初始化随机数种子

    while (idx <= 5)
    {
        // 发送消息

        // 消息类型
        data.msg_type = 1;

        // 生成1到10之间的随机数
        data.msg_data = rand() % 10 + 1;

        printf("send msg: %d\n", data.msg_data);

        // 发送消息
        if (msgsnd(msgid, (void *)&data, sizeof(data), 0) == -1)
        {
            perror("msgsnd err");
            exit(-1);
        }
        idx++;
    }
    return 0;
}
```

运行结果

```shell
# 发送端
% gcc msgsend.c  -o msgsend  && ./msgsend
send msg: 2
send msg: 3
send msg: 8
send msg: 8
send msg: 4

# 接收端
% gcc msgrcv.c  -o msgrcv  && ./msgrcv
msg type:1 msg data:2
msg type:1 msg data:3
msg type:1 msg data:8
msg type:1 msg data:8
msg type:1 msg data:4
```
