# unistd.h

## getcwd

获取当前工作目录的绝对路径

```cpp
/**
 * 参数
 *   buf 存储路径的缓冲区指针，若为NULL,则函数自动分配内存（需要手动释放）
 *   size 缓冲区大小，若路径长度大于size,会返回NULL,并设置errno  
 */
char *getcwd(char *buf, size_t size);
```

示例

```cpp
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>

int main(void)
{

    char *cwd = getcwd(NULL, 0);
    if (cwd != NULL)
    {
        printf("cwd: %s\n", cwd);
        free(cwd);
    }
    else
    {
        perror("cwd error");
    }

    return 0;
}
```

运行结果

```shell
$ gcc main.c -o main && ./main
/Users/tom/workspace
```

## fork

创建子进程

```cpp
/**
 * 父进程返回子进程PID
 * 子进程返回0
 */
pid_t fork(void)
```

示例

```cpp
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>

int main(void)
{

    pid_t pid = fork();
    if (pid == 0)
    {
        printf("child pid: %d\n", getpid());
    }
    else
    {
        printf("parent pid: %d\n", getpid());
        wait(NULL);
    }

    return 0;
}
```

运行结果

```shell
$ gcc main.c -o main && ./main
parent pid: 56606
child pid: 56607
```




```cpp

```

示例

```cpp

```

运行结果

```shell
$ gcc main.c -o main && ./main
```
