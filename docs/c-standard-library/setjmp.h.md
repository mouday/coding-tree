# setjmp.h

## setjmp

保存当前执行环境到 env

```cpp
/**
 * 参数
 *   env：一个 jmp_buf 类型的变量，用于保存当前的程序执行状态。
 * 返回值
 *   如果 setjmp() 直接调用，返回值为 0。
 *   如果 setjmp() 是通过 longjmp() 调用返回的，返回值是由 longjmp() 设置的非 0值。
 */
int setjmp(jmp_buf environment)
```

示例

```cpp
#include <signal.h>
#include <stdio.h>
#include <setjmp.h>

int main()
{
    sigjmp_buf env;
    if (setjmp(env) == 0)
    {
        // 首次调用
        printf("first\n");
        longjmp(env, 1); // 超时跳转
    }
    else
    {
        printf("second\n");
    }
    return 0;
}
```

运行结果

```shell
% gcc main.c -o main && ./main
first
second
```

## longjmp

恢复最近一次调用 setjmp() 宏时保存的环境，jmp_buf 参数的设置是由之前调用 setjmp() 生成的。

```cpp
/**
 * 参数
 *   env：一个 jmp_buf 类型的变量，保存了 setjmp() 的返回信息。
 *   val：一个整数值，作为 setjmp() 的返回值。
 * 返回值
 *   longjmp() 函数本身没有返回值，但它将程序控制流跳转到之前调用 setjmp() 的位置，并将 val 作为 setjmp() 的返回值。
 */
void longjmp(jmp_buf environment, int value)
```

示例

```cpp
#include <signal.h>
#include <stdio.h>
#include <setjmp.h>

int main()
{
    sigjmp_buf env;
    if (setjmp(env) == 0)
    {
        // 首次调用
        printf("first\n");
        longjmp(env, 1); // 超时跳转
    }
    else
    {
        printf("second\n");
    }
    return 0;
}
```

运行结果

```shell
% gcc main.c -o main && ./main
first
second
```
