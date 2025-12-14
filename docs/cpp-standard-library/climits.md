# climits

与整数类型相关的限制和特性

常用的常量：

1. 字符类型

CHAR_BIT：char 类型的位数（通常为 8）。
CHAR_MIN：char 类型的最小值。
CHAR_MAX：char 类型的最大值。
SCHAR_MIN：有符号 char 类型的最小值。
SCHAR_MAX：有符号 char 类型的最大值。
UCHAR_MAX：无符号 char 类型的最大值。

2. 短整型

SHRT_MIN：short 类型的最小值。
SHRT_MAX：short 类型的最大值。
USHRT_MAX：无符号 short 类型的最大值。

3. 整型

INT_MIN：int 类型的最小值。
INT_MAX：int 类型的最大值。
UINT_MAX：无符号 int 类型的最大值。

4. 长整型

LONG_MIN：long 类型的最小值。
LONG_MAX：long 类型的最大值。
ULONG_MAX：无符号 long 类型的最大值。

5. 长长整型

LLONG_MIN：long long 类型的最小值。
LLONG_MAX：long long 类型的最大值。
ULLONG_MAX：无符号 long long 类型的最大值。


示例

```cpp
#include <iostream>
#include <climits>

int main() {
    // 打印整型的最大值和最小值
    std::cout << "int 的最大值是：" << INT_MAX << std::endl;
    std::cout << "int 的最小值是：" << INT_MIN << std::endl;
}
```

输出结果

```shell
int 的最大值是：2147483647
int 的最小值是：-2147483648
```