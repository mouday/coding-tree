# pthread.h

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
