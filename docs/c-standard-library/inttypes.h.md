# inttypes.h

C 标准库提供了`<inttypes.h>` 头文件，它定义了一组固定大小的整数类型和相应的格式化宏，帮助开发者编写可移植的代码。

固定宽度整数类型

```cpp
// stdint.h

int8_t：8位有符号整数
uint8_t：8位无符号整数
int16_t：16位有符号整数
uint16_t：16位无符号整数
int32_t：32位有符号整数
uint32_t：32位无符号整数
int64_t：64位有符号整数
uint64_t：64位无符号整数
```

这些类型确保了在不同平台上，整数的大小是一致的，从而提高了代码的可移植性。

格式化宏

```cpp
PRId8：用于格式化int8_t类型的有符号整数
PRIu8：用于格式化uint8_t类型的无符号整数
PRId16：用于格式化int16_t类型的有符号整数
PRIu16：用于格式化uint16_t类型的无符号整数
PRId32：用于格式化int32_t类型的有符号整数
PRIu32：用于格式化uint32_t类型的无符号整数
PRId64：用于格式化int64_t类型的有符号整数
PRIu64：用于格式化uint64_t类型的无符号整数
```

其他宏

```cpp
INT8_MIN、INT8_MAX：int8_t类型的最小值和最大值
UINT8_MAX：uint8_t类型的最大值
INT16_MIN、INT16_MAX：int16_t类型的最小值和最大值
UINT16_MAX：uint16_t类型的最大值
INT32_MIN、INT32_MAX：int32_t类型的最小值和最大值
UINT32_MAX：uint32_t类型的最大值
INT64_MIN、INT64_MAX：int64_t类型的最小值和最大值
UINT64_MAX：uint64_t类型的最大值
```

示例

```cpp
#include <stdio.h>
#include <inttypes.h>

int main()
{
    int32_t val = 666;
    printf("val: %" PRId32 "\n", val);

    return 0;
}
```

运行结果

```shell
% gcc main.c -o main && ./main
val: 666
```
