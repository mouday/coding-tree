# bitset

位集合是一个由位（bit）组成的数组，每个位可以是 0 或 1。

`std::bitset` 表示固定大小的二进制位序列

基本语法

```cpp
#include <bitset>

// 声明一个大小为N的bitset
// 模板参数是位数（N），表示二进制序列的长度
std::bitset<N> b;

// 初始化bitset
b = std::bitset<N>(value);

// 访问位集合中的单个位
bool bit = b[i];
```

基本用法

默认初始化：所有位为 0。

从整数初始化：将整数转换为二进制。

从字符串初始化：将字符串解析为二进制。

```cpp
std::bitset<8> bits;                // 定义一个 8 位的二进制序列

std::bitset<8> bits1;               // 默认初始化：00000000
std::bitset<8> bits2(42);           // 从整数初始化：00101010
std::bitset<8> bits3("10101010");   // 从字符串初始化：10101010
```

常用成员函数

函数名称 | 功能描述
| - | -
`operator[]` |访问或修改某一位
`set()` |将某一位或所有位设置为 1
`reset()` |将某一位或所有位设置为 0
`flip()` | 翻转某一位或所有位
`count()` | 返回 1 的个数
`size()` | 返回位数
`test(pos)` | 检查某一位是否为 1
`all()` | 检查是否所有位都为 1
`any()` | 检查是否有任何一位为 1
`none()` | 检查是否所有位都为 0
`to_ulong()` | 将 `std::bitset` 转换为 `unsigned long`
`to_ullong()` | 将 `std::bitset` 转换为 `unsigned long long`
`to_string()` | 将 `std::bitset` 转换为字符串
`&` | 按位与
`|` | 按位或
`^`| 按位异或
`~` | 按位取反

示例

```cpp
std::bitset<8> bits("00001111");
bits[0] = 1;          // 修改第 0 位：00001111 -> 00001111
bits.set(4);          // 设置第 4 位：00001111 -> 00011111
bits.reset(1);        // 重置第 1 位：00011111 -> 00011101
bits.flip();          // 翻转所有位：00011101 -> 11100010
```

示例

```cpp
#include <iostream>
#include <bitset>

int main() {
    std::bitset<8> b("10101010");

    // 循环遍历bitset中的位
    for (size_t i = 0; i < b.size(); ++i) {
        std::cout << b[i];
    }
    std::cout << std::endl;

    return 0;
}
```

输出

```shell
01010101
```

注意事项

- `std::bitset` 的大小是固定的，在编译时确定。

- 如果位数超过 unsigned long 或 unsigned long long 的位数，to_ulong() 和 to_ullong() 会抛出 std::overflow_error 异常。

- `std::bitset` 不支持动态调整大小，如果需要动态位集，可以考虑 `std::vector<bool>`