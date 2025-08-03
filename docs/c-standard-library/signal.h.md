# signal.h

`signal.h` 头文件定义了一个变量类型 sig_atomic_t、两个函数调用和一些宏来处理程序执行期间报告的不同信号。

信号是一种异步通知机制，允许进程在特定事件发生时执行预定义的处理函数。

```cpp
typedef unsigned int sigset_t
```

信号列表

```cpp
#define SIGHUP  1       /* hangup */
#define SIGINT  2       /* interrupt */
#define SIGQUIT 3       /* quit */
#define SIGILL  4       /* illegal instruction (not reset when caught) */
#define SIGTRAP 5       /* trace trap (not reset when caught) */
#define SIGABRT 6       /* abort() */
#define SIGEMT  7       /* EMT instruction */
#define SIGFPE  8       /* floating point exception */
#define SIGKILL 9       /* kill (cannot be caught or ignored) */
#define SIGBUS  10      /* bus error */
#define SIGSEGV 11      /* segmentation violation */
#define SIGSYS  12      /* bad argument to system call */
#define SIGPIPE 13      /* write on a pipe with no one to read it */
#define SIGALRM 14      /* alarm clock */
#define SIGTERM 15      /* software termination signal from kill */
#define SIGURG  16      /* urgent condition on IO channel */
#define SIGSTOP 17      /* sendable stop signal not from tty */
#define SIGTSTP 18      /* stop signal from tty */
#define SIGCONT 19      /* continue a stopped process */
#define SIGCHLD 20      /* to parent on child stop or exit */
#define SIGTTIN 21      /* to readers pgrp upon background tty read */
#define SIGTTOU 22      /* like TTIN for output if (tp->t_local&LTOSTOP) */
#define SIGIO   23      /* input/output possible signal */
#define SIGXCPU 24      /* exceeded CPU time limit */
#define SIGXFSZ 25      /* exceeded file size limit */
#define SIGVTALRM 26    /* virtual time alarm */
#define SIGPROF 27      /* profiling time alarm */
#define SIGWINCH 28     /* window size changes */
#define SIGINFO 29      /* information request */
#define SIGUSR1 30      /* user defined signal 1 */
#define SIGUSR2 31      /* user defined signal 2 */
```

信号类型：

|常量  | 触发场景 | 默认行为 | 可否捕获/忽略
|-|-|-|-
| SIGABRT | 由 abort 函数产生的信号，表示异常终止
| SIGALRM | 由 alarm 函数设定的定时器到期信号 | 终止进程 | ✅
| SIGBUS  | 非法内存访问（例如，访问未对齐的内存地址）
| SIGCHLD | 子进程状态改变（退出或停止）
| SIGCONT | 继续执行被暂停的进程
| SIGFPE  | 算术错误（例如，除零错误、浮点异常）| 终止进程 | ✅
| SIGHUP  | 挂起信号（通常用于检测终端断开）
| SIGILL  | 非法指令
| SIGINT  | 中断信号（通常由 Ctrl+C 产生）| 终止进程 | ✅
| SIGKILL | 强制终止进程 | 立即终止| ❌
| SIGPIPE | 向无读进程的管道写数据
| SIGQUIT | 终端退出信号（通常由 Ctrl+\ 产生），生成核心转储
| SIGSEGV | 段错误（非法内存访问）| 终止进程并生成核心转储 | ✅
| SIGSTOP | 停止进程的执行（不能被捕捉或忽略）
| SIGTERM | 终止信号
| SIGTSTP | 暂停进程（通常由 Ctrl+Z 产生）
| SIGTTIN | 后台进程从终端读数据时产生的信号
| SIGTTOU | 后台进程向终端写数据时产生的信号
| SIGUSR1 | 用户自定义信号 1
| SIGUSR2 | 用户自定义信号 2
| SIGPOLL | I/O 事件（取代 SIGIO）
| SIGPROF | 定时器到期信号（由 setitimer 设置的 profiling timer）
| SIGSYS  | 非法系统调用
| SIGTRAP | 断点或陷阱指令
| SIGURG  | 套接字紧急条件信号
| SIGVTALRM |  虚拟时钟定时器到期信号
| SIGXCPU | 超过 CPU 时间限制
| SIGXFSZ | 超过文件大小限制

## signal

设置一个函数来处理信号，即带有 sig 参数的信号处理程序。

```cpp
/**
 * 参数
 *   sig -- 在信号处理程序中作为变量使用的信号码
 *   handler -- 一个指向函数的指针。
 *      它可以是一个由程序定义的函数，
 *      也可以是下面预定义函数之一：
 *        - SIG_DFL 默认的信号处理程序。
 *        - SIG_IGN 忽视信号。
 * 返回值
 *   该函数返回信号处理程序之前的值，当发生错误时返回 SIG_ERR。
 */
void (*signal(int sig, void (*handler)(int)))(int);

// 解读：
typedef void Sigfunc(int)
Sigfunc *signal(int, Sigfunc*)
```

示例

```cpp
#include <stdio.h>
#include <unistd.h>
#include <stdlib.h>
#include <signal.h>

void sighandler(int signum)
{
    printf("receive signal %d, exit.\n", signum);
    exit(1);
}

int main()
{
    // 设置一个函数来处理信号 SIGINT信号由 Ctrl + C 产生
    signal(SIGINT, sighandler);

    while (1)
    {
        printf("sleep 1s\n");
        sleep(1);
    }

    return (0);
}
```

运行结果

```shell
% gcc main.c -o main && ./main
sleep 1s
sleep 1s
sleep 1s
^Creceive signal 2, exit.
```

## raise

向当前进程发送信号。

```cpp
/**
 * 参数
 *   sig -- 要发送的信号码
 * 返回值
 *   如果成功该函数返回零，否则返回非零。
 */
int raise(int sig)
```

示例

```cpp
#include <stdio.h>
#include <unistd.h>
#include <stdlib.h>
#include <signal.h>

void sighandler(int signum)
{
    printf("receive signal %d, exit.\n", signum);
    exit(1);
}

int main()
{
    // 设置一个函数来处理信号 SIGINT信号由 Ctrl + C 产生
    signal(SIGINT, sighandler);

    printf("before raise SIGINT signal.\n");

    // 发送 SIGINT 信号给自己
    raise(SIGINT);

    // 后面的代码不会被执行
    printf("after raise SIGINT signal.\n");
    return (0);
}
```

运行结果

```shell
% gcc main.c -o main && ./main
before raise SIGINT signal.
receive signal 2, exit.
```

## kill

向指定进程发送信号。

```cpp
/**
 * 参数
 *   pid_t pid：要发送信号的目标进程的进程 ID（PID）。
 *     如果 pid > 0，则信号 sig 将发送给进程 ID 等于 pid 的进程。
 *     如果 pid == 0，则信号 sig 将发送给与调用进程属于同一进程组的所有进程。
 *     如果 pid < -1，则信号 sig 将发送给进程组 ID 等于 pid 的所有进程。
 *     如果 pid == -1，则信号 sig 将发送给所有有权限发送信号的进程（除了进程 ID 为 1   的 * 进程）。
 *   int sig：要发送的信号编号。常见的信号包括 SIGINT、SIGTERM、SIGKILL 等。
 * 返回值
 *   成功时返回 0。
 *   失败时返回 -1，并设置 errno 以指示错误类型。
 */
int kill(pid_t pid, int sig);
```

示例

```cpp
#include <stdio.h>
#include <signal.h>
#include <unistd.h>

int main()
{
    pid_t pid = getpid(); // 获取当前进程的进程 ID

    // 向当前进程发送 SIGUSR1 信号
    if (kill(pid, SIGUSR1) == -1)
    {
        perror("kill");
        return 1;
    }

    printf("SIGUSR1 signal sent to process %d.\n", (int)pid);

    return 0;
}
```

运行结果

```shell
% gcc main.c -o main && ./main
zsh: user-defined signal 1  ./main
```

## abort

产生 SIGABRT 信号，导致进程异常终止。

```cpp
/**
 * 参数
 *   abort 函数不接受任何参数。
 * 返回值
 *   abort 函数没有返回值，因为它不会正常返回。
 */
void abort(void);
```

示例

```cpp
#include <stdio.h>
#include <stdlib.h>

int main() {
    printf("Starting program...\n");

    // 模拟检测到一个错误条件
    if (1) {
        printf("Error detected, aborting program...\n");
        abort();
    }

    // 这行代码不会被执行
    printf("This line will not be printed.\n");

    return 0;
}
```

运行结果

```shell
% gcc main.c -o main && ./main
Starting program...
Error detected, aborting program...
zsh: abort      ./main
```

## alarm

在指定秒数后发送 SIGALRM 信号给调用进程。

```cpp
/**
 * 参数
 *   seconds：指定在多少秒后发送 SIGALRM 信号。
 *            如果参数为 0，则取消任何先前设置的闹钟。
 * 返回值
 *   成功时返回先前设置的闹钟剩余的时间（以秒为单位）。
 *   如果没有先前设置的闹钟，返回 0。
 */
unsigned int alarm(unsigned int seconds);
```

示例

```cpp
#include <stdio.h>
#include <signal.h>
#include <unistd.h>

// 信号处理程序
void handle_sigalrm(int sig) {
    printf("Caught signal %d: Alarm triggered\n", sig);
}

int main() {
    // 设置 SIGALRM 的信号处理程序
    signal(SIGALRM, handle_sigalrm);

    // 设置闹钟，在 5 秒后触发 SIGALRM 信号
    alarm(5);
    printf("Alarm set for 5 seconds\n");

    // 无限循环，等待信号
    while (1) {
        printf("Running...\n");
        sleep(1);
    }

    return 0;
}
```

运行结果

```shell
% gcc main.c -o main && ./main
Alarm set for 5 seconds
Running...
Running...
Running...
Running...
Running...
Caught signal 14: Alarm triggered
Running...
Running...
^C
```

## pause

挂起进程直到捕捉到信号。

```cpp
/**
 * 参数
 *   pause 函数不接受任何参数。
 * 返回值
 *   成功时 pause 函数不返回，因为进程被信号处理程序中断。
 *   失败时返回 -1，并将 errno 设置为 EINTR，表示函数因信号中断。
 */
int pause(void);
```

示例

```cpp
#include <stdio.h>
#include <signal.h>
#include <unistd.h>

// 信号处理程序
void handle_sigint(int sig) {
    printf("Caught signal %d\n", sig);
}

int main() {
    // 设置 SIGINT 的信号处理程序
    signal(SIGINT, handle_sigint);

    // 挂起进程，等待信号
    printf("Waiting for SIGINT (press Ctrl+C)...\n");
    pause();

    printf("Exiting...\n");
    return 0;
}
```

运行结果

```shell
$ gcc main.c -o main && ./main
Waiting for SIGINT (press Ctrl+C)...
^CCaught signal 2
Exiting...
```

## psignal

打印信号描述信息。

```cpp
/**
 * 参数
 *   int signum：信号编号。
 *   *message：用户自定义的消息。如果此消息为 NULL 或空字符串，函数只打印 * 信号描述信息。
 * 返回值
 *   psignal 函数没有返回值。
 */
void psignal(int sig, const char *s);
```

示例

```cpp
#include <stdio.h>
#include <signal.h>

int main()
{
    psignal(SIGINT, "SIGINT");

    return 0;
}
```

运行结果

```shell
gcc main.c -o main && ./main
SIGINT: Interrupt
```

## strsignal

返回信号描述字符串。此函数定义在 `<string.h>` 头文件中。

```cpp
/**
 * 参数
 *   int signum：信号编号。
 * 返回值
 *   成功时返回指向描述信号的字符串的指针。
 *   失败时返回 NULL。
 */
char *strsignal(int sig);
```

示例

```cpp
#include <stdio.h>
#include <signal.h>
#include <string.h> // strsignal

int main()
{
    char *msg = strsignal(SIGINT);
    printf("msg: %s\n", msg);
    return 0;
}
```

运行结果

```shell
$ gcc main.c -o main && ./main
msg: Interrupt: 2
```

## sigprocmask

检查或更改阻塞信号集。

```cpp
/**
 * 参数
 *   int how：操作标志，决定如何修改信号屏蔽字：
 *     SIG_BLOCK：把 set 指向的信号集中的信号添加到当前信号屏蔽字中。
 *     SIG_UNBLOCK：从当前信号屏蔽字中移除 set 指向的信号集中的信号。
 *     SIG_SETMASK：用 set 指向的信号集替换当前信号屏蔽字。
 *   const sigset_t *set：指向要修改的新信号集的指针。
 *   sigset_t *oldset：如果不为 NULL，则存储之前的信号屏蔽字。
 * 返回值
 *   成功时返回 0。
 *   失败时返回 -1，并设置 errno 以指示错误类型。
 */
int sigprocmask(int how, const sigset_t *set, sigset_t *oldset)
```

示例

```cpp
#include <stdio.h>
#include <signal.h>
#include <unistd.h>

int main() {
    sigset_t new_mask, old_mask;
    
    // 初始化新信号集，只包含 SIGINT
    sigemptyset(&new_mask);
    sigaddset(&new_mask, SIGINT);

    // 设置新的信号屏蔽字，阻塞 SIGINT 信号
    if (sigprocmask(SIG_BLOCK, &new_mask, &old_mask) == -1) {
        perror("sigprocmask");
        return 1;
    }

    printf("SIGINT signal is blocked. Sleeping for 5 seconds...\n");
    sleep(5);

    // 解除对 SIGINT 的阻塞
    if (sigprocmask(SIG_UNBLOCK, &new_mask, NULL) == -1) {
        perror("sigprocmask");
        return 1;
    }

    printf("SIGINT signal is unblocked.\n");

    return 0;
}
```

运行结果

```shell
% gcc main.c -o main && ./main
SIGINT signal is blocked. Sleeping for 5 seconds...
^C^C^C
```

## sigaction

检查或更改信号处理程序。替代 `signal()`

```cpp
/**
 * 参数
 *   int sig：要检查或修改的信号编号。常见的信号包括 SIGINT、SIGTERM、SIGKILL 等。
 *   const struct sigaction *act：指向新的信号处理动作的指针。如果为 NULL，则不修改 * 当前的信号处理动作。
 *   struct sigaction *oldact：指向用于保存旧的信号处理动作的指针。如果为 NULL，则不 * 保存旧的信号处理动作。
 * 返回值
 *   成功时返回 0。
 *   失败时返回 -1，并设置 errno 以指示错误类型。
 */
int sigaction(int sig, const struct sigaction *act, struct sigaction *oldact)
```

```cpp
struct sigaction {
    void (*sa_handler)(int);           // 信号处理函数指针
    void (*sa_sigaction)(int, siginfo_t *, void *); // 信号处理函数指针（扩展）
    sigset_t sa_mask;                  // 在处理该信号时要阻塞的信号集
    int sa_flags;                      // 修改信号行为的选项
    void (*sa_restorer)(void);         // 恢复函数，已废弃
};

// sa_flags 的常见选项
// SA_RESTART：使被信号中断的系统调用自动重新启动。
// SA_SIGINFO：使用 sa_sigaction 而不是 sa_handler 作为信号处理函数。
// SA_NOCLDSTOP：如果 sig 是 SIGCHLD，则在子进程停止或继续时不产生该信号。
```

示例

```cpp
#include <stdio.h>
#include <signal.h>
#include <unistd.h>

// 自定义的信号处理函数
void handle_sigint(int sig) {
    printf("Caught signal %d\n", sig);
}

int main() {
    struct sigaction sa;

    // 设置处理程序为 handle_sigint
    sa.sa_handler = handle_sigint;
    sigemptyset(&sa.sa_mask);
    sa.sa_flags = 0;

    // 使用 sigaction 设置新的信号处理动作
    if (sigaction(SIGINT, &sa, NULL) == -1) {
        perror("sigaction");
        return 1;
    }

    // 主循环，持续运行直到捕捉到信号
    while (1) {
        printf("Running...\n");
        sleep(1);
    }

    return 0;
}
```

运行结果

```shell
% gcc main.c -o main && ./main
Running...
Running...
Running...
^CCaught signal 2
Running...
^CCaught signal 2
Running...
Running...
Running...
zsh: killed     ./main
```

没有处理中断信号，需要使用 `kill -9 <pid>` 关闭进程

## sigsuspend

暂时替换当前信号屏蔽字并挂起进程直到捕捉到信号。

```cpp
/**
 * 参数
 *   const sigset_t *mask：指向新的信号屏蔽字的指针。sigsuspend 使用该信号屏蔽字替换当前信号屏蔽字，并在捕捉到一个信号后恢复原来的信号屏蔽字。
 * 返回值
 *   sigsuspend 函数总是返回 -1，并将 errno 设置为 EINTR，表示函数因信号中断。
 */
int sigsuspend(const sigset_t *mask)
```

示例

```cpp
#include <stdio.h>
#include <signal.h>
#include <unistd.h>

volatile sig_atomic_t flag = 0;

// 自定义的信号处理函数
void handle_sigint(int sig) {
    printf("Caught signal %d\n", sig);
    flag = 1;
}

int main() {
    struct sigaction sa;
    sigset_t new_mask, old_mask, wait_mask;

    // 设置 SIGINT 的处理程序为 handle_sigint
    sa.sa_handler = handle_sigint;
    sigemptyset(&sa.sa_mask);
    sa.sa_flags = 0;
    if (sigaction(SIGINT, &sa, NULL) == -1) {
        perror("sigaction");
        return 1;
    }

    // 初始化信号集
    sigemptyset(&new_mask);
    sigaddset(&new_mask, SIGINT);

    // 阻塞 SIGINT 信号
    if (sigprocmask(SIG_BLOCK, &new_mask, &old_mask) == -1) {
        perror("sigprocmask");
        return 1;
    }

    // 初始化等待信号集
    sigemptyset(&wait_mask);

    printf("Waiting for SIGINT...\n");

    // 使用 sigsuspend 挂起进程，等待信号
    while (!flag) {
        if (sigsuspend(&wait_mask) != -1) {
            perror("sigsuspend");
            return 1;
        }
    }

    // 恢复原来的信号屏蔽字
    if (sigprocmask(SIG_SETMASK, &old_mask, NULL) == -1) {
        perror("sigprocmask");
        return 1;
    }

    printf("Exiting...\n");

    return 0;
}
```

运行结果

```shell
% gcc main.c -o main && ./main
Waiting for SIGINT...
^CCaught signal 2
Exiting...
```

## sigpending

检查未决信号集。

```cpp
/**
 * 参数
 *   sigset_t *set：指向一个 sigset_t 类型的变量，该变量将被填充为当前进程的未决信号 * 集。
 * 返回值
 *   成功时返回 0。
 *   失败时返回 -1，并设置 errno 以指示错误类型。
 */
int sigpending(sigset_t *set);
```

示例

```cpp
#include <stdio.h>
#include <signal.h>
#include <unistd.h>

void handle_sigint(int sig) {
    printf("Caught signal %d\n", sig);
}

int main() {
    sigset_t new_mask, old_mask, pending;

    // 设置 SIGINT 的处理程序
    signal(SIGINT, handle_sigint);

    // 初始化信号集并阻塞 SIGINT 信号
    sigemptyset(&new_mask);
    sigaddset(&new_mask, SIGINT);
    if (sigprocmask(SIG_BLOCK, &new_mask, &old_mask) == -1) {
        perror("sigprocmask");
        return 1;
    }

    // 发送 SIGINT 信号
    raise(SIGINT);

    // 获取未决信号集
    if (sigpending(&pending) == -1) {
        perror("sigpending");
        return 1;
    }

    // 检查 SIGINT 是否在未决信号集中
    if (sigismember(&pending, SIGINT)) {
        printf("SIGINT is pending\n");
    } else {
        printf("SIGINT is not pending\n");
    }

    // 恢复原来的信号屏蔽字
    if (sigprocmask(SIG_SETMASK, &old_mask, NULL) == -1) {
        perror("sigprocmask");
        return 1;
    }

    return 0;
}
```

运行结果

```shell
% gcc main.c -o main && ./main
SIGINT is pending
Caught signal 2
```

## sigemptyset

初始化信号集为空集。

```cpp
/**
 * 参数
 *   sigset_t *set：指向一个 sigset_t 类型的变量，该变量将被初始化为空的信号集。
 * 返回值
 *   成功时返回 0。
 *   失败时返回 -1，并设置 errno 以指示错误类型。
 */
int sigemptyset(sigset_t *set);
```

示例

```cpp
#include <stdio.h>
#include <signal.h>

int main() {
    sigset_t set;

    // 初始化信号集为空
    if (sigemptyset(&set) == -1) {
        perror("sigemptyset");
        return 1;
    }

    // 检查信号集是否包含 SIGINT
    if (sigismember(&set, SIGINT)) {
        printf("SIGINT is in the set\n");
    } else {
        printf("SIGINT is not in the set\n");
    }

    return 0;
}
```

运行结果

```shell
gcc main.c -o main && ./main
SIGINT is not in the set
```

## sigfillset

初始化信号集为全信号集。

```cpp
/**
 * 参数
 *   sigset_t *set：指向一个 sigset_t 类型的变量，该变量将被初始化为包含所有信号的信 *   号集。
 * 返回值
 *   成功时返回 0。
 *   失败时返回 -1，并设置 errno 以指示错误类型。
 */
int sigfillset(sigset_t *set);
```

示例

```cpp
#include <stdio.h>
#include <signal.h>

int main() {
    sigset_t set;

    // 初始化信号集，包含所有信号
    if (sigfillset(&set) == -1) {
        perror("sigfillset");
        return 1;
    }

    // 检查信号集是否包含 SIGINT
    if (sigismember(&set, SIGINT)) {
        printf("SIGINT is in the set\n");
    } else {
        printf("SIGINT is not in the set\n");
    }

    return 0;
}
```

运行结果

```shell
% gcc main.c -o main && ./main
SIGINT is in the set
```

## sigaddset

向信号集中添加指定信号。

```cpp
/**
 * 参数
 *   sigset_t *set：指向一个 sigset_t 类型的信号集变量。
 *   int signo：要添加到信号集中的信号编号。
 * 返回值
 *   成功时返回 0。
 *   失败时返回 -1，并设置 errno 以指示错误类型。
 */
int sigaddset(sigset_t *set, int signum);
```

示例

```cpp
#include <stdio.h>
#include <signal.h>

int main()
{
    sigset_t set;
    int ret;

    // 初始化信号集为空
    ret = sigemptyset(&set);
    printf("sigemptyset ret: %d\n", ret);

    // 将 SIGINT 添加到信号集中
    sigaddset(&set, SIGINT);
    printf("sigaddset ret: %d\n", ret);

    // 检查信号集是否包含 SIGINT
    ret = sigismember(&set, SIGINT);
    printf("sigismember ret: %d\n", ret);

    return 0;
}
```

运行结果

```shell
 gcc main.c -o main && ./main
sigemptyset ret: 0
sigaddset ret: 0
sigismember ret: 1
```

## sigdelset

从信号集中删除指定信号。

```cpp
/**
 * 参数
 *   sigset_t *set：指向一个 sigset_t 类型的信号集变量。
 *   int signo：要从信号集中删除的信号编号。
 * 返回值
 *   成功时返回 0。
 *   失败时返回 -1，并设置 errno 以指示错误类型。
 */
int sigdelset(sigset_t *set, int signum);
```

示例

```cpp
#include <stdio.h>
#include <signal.h>

int main()
{
    sigset_t set;

    // 初始化信号集，包含所有信号
    if (sigfillset(&set) == -1)
    {
        perror("sigfillset");
        return 1;
    }

    // 从信号集中删除 SIGINT
    if (sigdelset(&set, SIGINT) == -1)
    {
        perror("sigdelset");
        return 1;
    }

    // 检查信号集是否包含 SIGINT
    if (sigismember(&set, SIGINT))
    {
        printf("SIGINT is in the set\n");
    }
    else
    {
        printf("SIGINT is not in the set\n");
    }

    return 0;
}
```

运行结果

```shell
% gcc main.c -o main && ./main
SIGINT is not in the set
```

## sigismember

检查指定信号是否在信号集中。

```cpp
/**
 * 参数
 *   const sigset_t *set：指向一个 sigset_t 类型的信号集变量。
 *   int signo：要检查的信号编号。
 * 返回值
 *   如果信号在信号集中，返回 1。
 *   如果信号不在信号集中，返回 0。
 *   如果出错，返回 -1，并设置 errno 以指示错误类型。
 */
int sigismember(const sigset_t *set, int signum);
```

示例

```cpp
#include <stdio.h>
#include <signal.h>

int main() {
    sigset_t set;

    // 初始化信号集为空
    if (sigemptyset(&set) == -1) {
        perror("sigemptyset");
        return 1;
    }

    // 将 SIGINT 添加到信号集中
    if (sigaddset(&set, SIGINT) == -1) {
        perror("sigaddset");
        return 1;
    }

    // 检查信号集是否包含 SIGINT
    if (sigismember(&set, SIGINT)) {
        printf("SIGINT is in the set\n");
    } else {
        printf("SIGINT is not in the set\n");
    }

    // 检查信号集是否包含 SIGTERM
    if (sigismember(&set, SIGTERM)) {
        printf("SIGTERM is in the set\n");
    } else {
        printf("SIGTERM is not in the set\n");
    }

    return 0;
}
```

运行结果

```shell
% gcc main.c -o main && ./main
SIGINT is in the set
SIGTERM is not in the set
```

## sigwait

阻塞等待信号并处理。

```cpp
/**
 * 参数
 *   const sigset_t *set：指向一个 sigset_t 类型的信号集变量，该信号集指定要等待的信号。
 *   int *sig：指向一个整数变量，用于存储被捕获的信号编号。
 * 返回值
 *   成功时返回 0。
 *   失败时返回一个错误码。
 */
int sigwait(const sigset_t *set, int *sig);
```

示例

以下是一个使用 sigwait 函数同步等待 SIGINT 信号的示例程序。该程序在等待信号期间打印消息，当捕获到 SIGINT 信号时，使用 sigwait 函数同步等待并处理信号。

```cpp
#include <stdio.h>
#include <signal.h>
#include <unistd.h>
#include <string.h>
#include <pthread.h>

// 线程函数，等待 SIGINT 信号
void* wait_for_signal(void* arg) {
    sigset_t *set = (sigset_t *)arg;
    int sig;

    printf("Thread waiting for signal...\n");
    if (sigwait(set, &sig) == 0) {
        printf("Caught signal %d: %s\n", sig, strsignal(sig));
    } else {
        perror("sigwait");
    }

    return NULL;
}

int main() {
    pthread_t thread;
    sigset_t set;

    // 初始化信号集，并将 SIGINT 添加到信号集中
    sigemptyset(&set);
    sigaddset(&set, SIGINT);

    // 阻塞主线程中的 SIGINT 信号
    pthread_sigmask(SIG_BLOCK, &set, NULL);

    // 创建一个线程，等待 SIGINT 信号
    pthread_create(&thread, NULL, wait_for_signal, (void*)&set);

    // 主线程继续运行，直到按下 Ctrl+C 发送 SIGINT 信号
    while (1) {
        printf("Main thread running... Press Ctrl+C to send SIGINT\n");
        sleep(1);
    }

    // 等待子线程结束
    pthread_join(thread, NULL);

    return 0;
}
```

运行结果

```shell
% gcc main.c -lpthread -o main && ./main
Main thread running... Press Ctrl+C to send SIGINT
Thread waiting for signal...
Main thread running... Press Ctrl+C to send SIGINT
Main thread running... Press Ctrl+C to send SIGINT
Main thread running... Press Ctrl+C to send SIGINT
Caught signal 2: Interrupt: 2
Main thread running... Press Ctrl+C to send SIGINT
Main thread running... Press Ctrl+C to send SIGINT
zsh: killed     ./main
```

```shell
# 找到进程
ps aux | grep ./main

# interrupt
kill -2 96400

# kill
kill -9 96400 
```
