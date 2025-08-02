# stdint.h

`<stdint.h>` 是 C99 标准引入的头文件，它提供了一些整数类型的定义，这些类型具有明确的大小和符号属性，确保在不同平台上的一致性。

引入头文件

```cpp
#include <stdint.h>
```

## 数据结构

```cpp
typedef signed char             int8_t;
typedef short                   int16_t;
typedef int                     int32_t;
typedef long long               int64_t;

typedef unsigned char uint8_t;
typedef unsigned short uint16_t;
typedef unsigned int uint32_t;
typedef unsigned long long uint64_t;

#define INT8_MAX         127
#define INT16_MAX        32767
#define INT32_MAX        2147483647
#define INT64_MAX        9223372036854775807LL

#define INT8_MIN          -128
#define INT16_MIN         -32768
#define INT32_MIN        (-INT32_MAX-1)
#define INT64_MIN        (-INT64_MAX-1)

#define UINT8_MAX         255
#define UINT16_MAX        65535
#define UINT32_MAX        4294967295U
#define UINT64_MAX        18446744073709551615ULL
```

## 固定宽度整数类型

这些类型明确指定了其宽度（位数），确保在不同平台上具有相同的大小。

| 类型 | 描述
| - | -
int8_t   |  8 位有符号整数
int16_t  |  16 位有符号整数
int32_t  |  32 位有符号整数
int64_t  |  64 位有符号整数
uint8_t  |  8 位无符号整数
uint16_t |  16 位无符号整数
uint32_t |  32 位无符号整数
uint64_t |  64 位无符号整数

## 最大值和最小值

|宏  | 描述
|-|-
INT8_MIN    | int8_t 的最小值
INT8_MAX    | int8_t 的最大值
UINT8_MAX   | uint8_t 的最大值
INT16_MIN   | int16_t 的最小值
INT16_MAX   | int16_t 的最大值
UINT16_MAX  | uint16_t 的最大值
INT32_MIN   | int32_t 的最小值
INT32_MAX   | int32_t 的最大值
UINT32_MAX  | uint32_t 的最大值
INT64_MIN   | int64_t 的最小值
INT64_MAX   | int64_t 的最大值
UINT64_MAX  | uint64_t 的最大值
INTMAX_MIN  | intmax_t 的最小值
INTMAX_MAX  | intmax_t 的最大值
UINTMAX_MAX | uintmax_t 的最大值

## 示例

示例

```cpp
#include <stdio.h>
#include <stdint.h>

int main()
{
    uint32_t a = 123;

    printf("INT8_MAX: %d\n", INT8_MAX);
    printf("INT8_MIN: %d\n", INT8_MIN);
    return 0;
}
```

运行结果

```shell
gcc main.c -o main && ./main
INT8_MAX: 127
INT8_MIN: -128
```
