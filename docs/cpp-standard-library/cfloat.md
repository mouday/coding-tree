# cfloat

定义浮点数相关的宏和常量

C++ 提供了两种基本的浮点数类型：

- float：单精度浮点数，通常占用 4 个字节。
- double：双精度浮点数，通常占用 8 个字节。

浮点数操作

- sqrt：计算平方根
- pow：计算幂
- sin、cos、tan：计算三角函数

提供的常量
1. 浮点数范围

FLT_MIN：float 类型的最小正数。
FLT_MAX：float 类型的最大正数。
DBL_MIN：double 类型的最小正数。
DBL_MAX：double 类型的最大正数。
LDBL_MIN：long double 类型的最小正数。
LDBL_MAX：long double 类型的最大正数。
2. 浮点数精度

FLT_DIG：float 类型的有效位数。
DBL_DIG：double 类型的有效位数。
LDBL_DIG：long double 类型的有效位数。
3. 最小负数指数

FLT_MIN_EXP：float 类型的最小负数指数。
DBL_MIN_EXP：double 类型的最小负数指数。
LDBL_MIN_EXP：long double 类型的最小负数指数。
4. 最大正数指数

FLT_MAX_EXP：float 类型的最大正数指数。
DBL_MAX_EXP：double 类型的最大正数指数。
LDBL_MAX_EXP：long double 类型的最大正数指数。
5. 机器 epsilon

FLT_EPSILON：float 类型的机器 epsilon，表示能够区分1.0和比1.0大的最小浮点数。
DBL_EPSILON：double 类型的机器 epsilon。
LDBL_EPSILON：long double 类型的机器 epsilon。

示例

```cpp
#include <iostream>
#include <cfloat>

int main()
{
    // 输出 double 类型的范围和精度
    std::cout << "double:\n";
    std::cout << "Min: " << DBL_MIN << '\n';
    std::cout << "Max: " << DBL_MAX << '\n';
}
```

输出结果

```shell
double:
Min: 2.22507e-308
Max: 1.79769e+308

```