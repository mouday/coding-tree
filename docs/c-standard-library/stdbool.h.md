# stdbool.h

`<stdbool.h>` 是 C 语言中的一个标准头文件，定义了布尔类型及其相关的常量。它使得 C 语言的布尔类型（bool）变得更加明确和可用，避免了使用整数（如 0 或 1）来表示布尔值的传统做法。

引入头文件

```cpp
#include <stdbool.h>
```

## 数据结构

```cpp
typedef int _Bool;

#define bool _Bool

#define false   0
#define true    1
```

示例

```cpp
#include <stdio.h>
#include <stdbool.h>

int main()
{
    bool is_success = true;
    printf("is_success: %d\n", is_success);
    return 0;
}
```

运行结果

```shell
$ gcc main.c -o main && ./main
is_success: 1
```
