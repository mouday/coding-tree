# limits.h

`<limits.h>` 是 C 标准库中的一个头文件，定义了各种数据类型的限制。这些宏提供了有关整数类型（char、short、int、long 和 long long 等）和其他数据类型的最大值和最小值的信息。

字符类型

|宏   |描述 | 值|
|-|-|-|
CHAR_BIT    | char 类型的位数  | 通常为 8
CHAR_MIN    | char 类型的最小值（有符号或无符号）   | -128 或 0
CHAR_MAX    | char 类型的最大值（有符号或无符号）    |127 或 255
SCHAR_MIN   | signed char 类型的最小值 | -128
SCHAR_MAX   | signed char 类型的最大值 | 127
UCHAR_MAX   | unsigned char 类型的最大值  |  255

短整数类型

|宏   |描述 | 值|
|-|-|-|
SHRT_MIN    |short 类型的最小值   | -32768
SHRT_MAX    |short 类型的最大值   | 32767
USHRT_MAX   |unsigned short 类型的最大值  | 65535

整数类型

|宏   |描述 | 值|
|-|-|-|
INT_MIN    |int 类型的最小值 | -2147483648
INT_MAX    |int 类型的最大值  |2147483647
UINT_MAX   | unsigned int 类型的最大值 |4294967295

长整数类型

|宏   |描述 | 值|
|-|-|-|
LONG_MIN   | long 类型的最小值 |-9223372036854775808L
LONG_MAX  |  long 类型的最大值 |9223372036854775807L
ULONG_MAX  | unsigned long 类型的最大值   | 18446744073709551615UL

长长整数类型  

|宏 |描述 | 值|
|-|-|-|
LLONG_MIN   | long long 类型的最小值   | -9223372036854775808LL
LLONG_MAX   | long long 类型的最大值    |9223372036854775807LL
ULLONG_MAX  | unsigned long long 类型的最大值   | 18446744073709551615ULL

示例

```cpp
#include <stdio.h>
#include <limits.h>

int main()
{
    printf("USHRT_MAX: %d\n", USHRT_MAX);

    return 0;
}
```

运行结果

```shell
% gcc main.c -o main && ./main
USHRT_MAX: 65535
```
