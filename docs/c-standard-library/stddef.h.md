# stddef.h

`stddef.h` 头文件定义了各种变量类型和宏，这些定义和宏主要用于内存管理、对象大小、和指针算术等方面。

引入头文件

```cpp
#include <stddef.h>
```

## 数据结构

```cpp
#define NULL ((void*)0)

typedef __typeof__(((int*)NULL) - ((int*)NULL)) ptrdiff_t;

typedef __typeof__(sizeof(int)) size_t;

typedef __WCHAR_TYPE__ wchar_t;

#define offsetof(t, d) __builtin_offsetof(t, d)
```

## offsetof

它是一个结构成员相对于结构开头的字节偏移量。成员是由 member-designator 给定的，结构的名称是在 type 中给定的。

```cpp
/**
 * 参数
 *   type -- 这是一个 class 类型，其中，member-designator 是一个有效的成员指示器。
 *   member-designator -- 这是一个 class 类型的成员指示器。
 * 返回值
 *   该宏返回类型为 size_t 的值，表示 type 中成员的偏移量。
 */
size_t offsetof(type, member-designator)
```

示例

```cpp
#include <stdio.h>
#include <stddef.h>

struct student
{
    char name[20];
    char address[50];
    int age;
};

int main()
{
    size_t ret;
    ret = offsetof(struct student, name);
    printf("name offsetof: %ld\n", ret);

    ret = offsetof(struct student, address);
    printf("address offsetof: %ld\n", ret);

    ret = offsetof(struct student, age);
    printf("age offsetof: %ld\n", ret);

    return 0;
}
```

运行结果

```shell
$ gcc main.c -o main && ./main
name offsetof: 0
address offsetof: 20
age offsetof: 72
```
