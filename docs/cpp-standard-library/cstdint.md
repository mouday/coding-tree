# cstdint

`<cstdint>` 是 C++11 引入的一个头文件，它定义了一组固定宽度的整数类型，这些类型在不同的平台上具有相同的大小和表示范围。

`<cstdint>` 定义了以下整数类型：

```cpp
int8_t：8位有符号整数
uint8_t：8位无符号整数
int16_t：16位有符号整数
uint16_t：16位无符号整数
int32_t：32位有符号整数
uint32_t：32位无符号整数
int64_t：64位有符号整数
uint64_t：64位无符号整数
此外，还定义了最大宽度的整数类型：

intmax_t：最大宽度的有符号整数
uintmax_t：最大宽度的无符号整数
以及用于位操作的类型：

intptr_t：足够大的有符号整数，可以存储指针的值
uintptr_t：足够大的无符号整数，可以存储指针的值
```

示例

```cpp
#include <iostream>
#include <cstdint>

int main(int argc, char const *argv[])
{
    int32_t age = 1024;
    std::cout << age << std::endl;

    return 0;
}
```