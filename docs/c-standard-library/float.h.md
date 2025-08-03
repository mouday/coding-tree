# float.h

`<float.h>` 是 C 标准库中的一个头文件，定义了与浮点数类型（float、double 和 long double）相关的宏。这些宏提供了浮点数的特性和限制，例如最大值、最小值、精度等。

浮点数是由下面四个元素组成的

```cpp
floating-point = ( S ) p x be

// 或

floating-point = (+/-) precision x baseexponent
```

|组件 | 组件描述
|-|-
S   | 符号 ( +/- )
b   | 指数表示的基数，2 表示二进制，10 表示十进制，16 表示十六进制，等等...
e   | 指数，一个介于最小值 emin 和最大值 emax 之间的整数。
p   | 精度，基数 b 的有效位数

单精度浮点数（float）

```cpp
FLT_RADIX：浮点数的基数（通常为2）。
FLT_MANT_DIG：float 类型的有效位数。
FLT_DIG：float 类型的十进制数精度，即能保证不失真的最大十进制位数。
FLT_MIN_EXP：float 类型的最小负指数（以基数为底）。
FLT_MIN_10_EXP：float 类型的最小负十进制指数。
FLT_MAX_EXP：float 类型的最大指数（以基数为底）。
FLT_MAX_10_EXP：float 类型的最大十进制指数。
FLT_MAX：float 类型的最大正值。
FLT_MIN：float 类型的最小正值。
FLT_EPSILON：float 类型的相对误差，即1.0和比1.0大的最小浮点数之差。
```

双精度浮点数（double）

```cpp
DBL_MANT_DIG：double 类型的有效位数。
DBL_DIG：double 类型的十进制数精度。
DBL_MIN_EXP：double 类型的最小负指数（以基数为底）。
DBL_MIN_10_EXP：double 类型的最小负十进制指数。
DBL_MAX_EXP：double 类型的最大指数（以基数为底）。
DBL_MAX_10_EXP：double 类型的最大十进制指数。
DBL_MAX：double 类型的最大正值。
DBL_MIN：double 类型的最小正值。
DBL_EPSILON：double 类型的相对误差。
```

扩展精度浮点数（long double）

```cpp
LDBL_MANT_DIG：long double 类型的有效位数。
LDBL_DIG：long double 类型的十进制数精度。
LDBL_MIN_EXP：long double 类型的最小负指数（以基数为底）。
LDBL_MIN_10_EXP：long double 类型的最小负十进制指数。
LDBL_MAX_EXP：long double 类型的最大指数（以基数为底）。
LDBL_MAX_10_EXP：long double 类型的最大十进制指数。
LDBL_MAX：long double 类型的最大正值。
LDBL_MIN：long double 类型的最小正值。
LDBL_EPSILON：long double 类型的相对误差。
```

示例

```cpp
#include <stdio.h>
#include <float.h>

int main()
{
    printf("DBL_MAX: %f\n", DBL_MAX);

    return 0;
}
```

运行结果

```shell
gcc main.c -o main && ./main
DBL_MAX: 179769313486231570814527423731704356798070567525844996598917476803157260780028538760589558632766878171540458953514382464234321326889464182768467546703537516986049910576551282076245490090389328944075868508455133942304583236903222948165808559332123348274797826204144723168738177180919299881250404026184124858368.000000
```
