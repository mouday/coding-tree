# assert.h

引入头文件

```cpp
#include <assert.h>
```

## assert

在程序开发阶段用于验证假设条件，帮助开发者快速定位逻辑错误

- 开发阶段：用于捕获逻辑错误和违反假设的情况
- 发布版本：通过 `NDEBUG` 完全禁用

```cpp
/**
 * 
 * 参数
 *   expression  0或者1
 * 返回值
 *   无
 *   如果结果为真（非零），不执行任何操作
 *   如果结果为假（0）：
 *     打印错误消息（表达式、源文件名、行号）
 *     调用 abort() 终止程序执行
 */
void assert(int expression);
```

实现参考

```cpp
#ifdef NDEBUG

#define assert(e) ((void)0)

#else

#define assert(e)  \
    ((void) ((e) ? ((void)0) : __assert (#e, __ASSERT_FILE_NAME, __LINE__)))

#define __assert(e, file, line) \
    ((void)printf ("%s:%d: failed assertion `%s'\n", file, line, e), abort())
#endif
```

示例1：启用断言（默认）

```cpp
#include <assert.h>

int main(int argc, char **argv)
{
    assert(1 == 0);
    return 0;
}
```

运行结果

```shell
$ gcc main.c -o main && ./main
Assertion failed: (1 == 0), function main, file main.c, line 5.
zsh: abort (core dumped)  ./main
```

示例2：禁用断言

```cpp
#define NDEBUG  // 必须在包含 <assert.h> 之前定义
#include <assert.h>

int main(int argc, char **argv)
{
    assert(1 == 0);
    return 0;
}
```

运行结果

```shell
# 没有任何输出
$ gcc main.c -o main && ./main
```

也可以编译时禁用

```shell
$ gcc -DNDEBUG main.c -o main && ./main
```

示例3：自定义错误消息

```cpp

#include <stdio.h>
#include <stdlib.h>

#ifndef NDEBUG
#define assert_msg(expr, msg) \
    ((expr) ? (void)0 : (fprintf(stderr, "Assertion failed: %s (%s:%d)\nMessage: %s\n", #expr, __FILE__, __LINE__, msg), abort()))
#else
#define assert_msg(expr, msg) ((void)0)
#endif

int main(int argc, char **argv)
{
    assert_msg(1 == 0, "1 must be equal to 0");
    return 0;
}

```

运行结果

```shell
$ gcc main.c -o main && ./main
Assertion failed: 1 == 0 (main.c:14)
Message: 1 must be equal to 0
zsh: abort (core dumped)  ./main
```
