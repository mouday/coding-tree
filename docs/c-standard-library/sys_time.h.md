# sys/time.h

## gettimeofday

获取当前时间

```cpp
/**
 * 参数：
 *   tp  时间，包含秒和毫秒
 *   tzp 时区，通常为NULL
 *
 * 返回值
 *   成功返回0
 *   失败返回-1，并适当设置errno
 */
int gettimeofday(struct timeval *tp, void *tzp);
```

```cpp
struct timeval {
  long   tv_sec;       /* seconds */
  int    tv_usec;      /* microseconds */
};
```

示例

```cpp
#include <stdio.h>
#include <sys/time.h>

int main(int argc, char const *argv[])
{
    struct timeval tv;

    gettimeofday(&tv, NULL);

    printf("tv_sec: %ld\n", tv.tv_sec);
    printf("tv_usec: %d\n", tv.tv_usec);

    return 0;
}
```

运行结果

```shell
$ gcc main.c -o main && ./main
tv_sec: 1757286634
tv_usec: 203652
```
