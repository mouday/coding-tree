# math.h

`<math.h>` 是 C 标准库中的一个头文件，包含了大量用于数学运算的函数和宏。这些函数和宏提供了基本的算术运算、三角函数、指数函数、对数函数、幂函数、舍入函数等。

在这个库中所有可用的功能都带有一个 double 类型的参数，且都返回 double 类型的结果。

引入头文件

```cpp
#include <math.h>
```

## 数据结构

常用

```cpp
#define M_PI        3.14159265358979323846264338327950288   /* pi */
```

## pow

返回 x 的 y 次幂。

```cpp
double pow(double x, double y)
```

示例

```cpp
#include <stdio.h>
#include <math.h>

int main()
{
    double result = pow(2, 3);
    printf("result: %f\n", result);
    return 0;
}
```

运行结果

```shell
$ gcc main.c -o main && ./main
result: 8.000000
```

## sqrt

返回 x 的平方根。

```cpp
double sqrt(double x)
```

示例

```cpp
#include <stdio.h>
#include <math.h>

int main()
{
    double result = sqrt(9);
    printf("result: %f\n", result);
    return 0;
}
```

运行结果

```shell
$ gcc main.c -o main && ./main
result: 3.000000
```

## ceil

向上取整，返回大于或等于 x 的最小的整数值。

```cpp
double ceil(double x)
```

示例

```cpp
#include <stdio.h>
#include <math.h>

int main()
{
    double result = ceil(9.1);
    printf("result: %f\n", result);
    return 0;
}
```

运行结果

```shell
$ gcc main.c -o main && ./main
result: 10.000000
```

## floor

向下取整，返回小于或等于 x 的最大的整数值。

```cpp
double floor(double x)
```

示例

```cpp
#include <stdio.h>
#include <math.h>

int main()
{
    double result = floor(9.9);
    printf("result: %f\n", result);
    return 0;
}
```

运行结果

```shell
$ gcc main.c -o main && ./main
result: 9.000000
```

## fabs

返回 x 的绝对值。

```cpp
double fabs(double x)
```

示例

```cpp
#include <stdio.h>
#include <math.h>

int main()
{
    double result = fabs(-9.0);
    printf("result: %f\n", result);
    return 0;
}
```

运行结果

```shell
$ gcc main.c -o main && ./main
result: 9.000000
```

## fmod

返回 x 除以 y 的余数。

```cpp
double fmod(double x, double y)
```

示例

```cpp
#include <stdio.h>
#include <math.h>

int main()
{
    double result = fmod(9.0, 4.0);
    printf("result: %f\n", result);
    return 0;
}
```

运行结果

```shell
% gcc main.c -o main && ./main
result: 1.000000
```

## modf

返回值为小数部分（小数点后的部分），并设置 integer 为整数部分。

```cpp
double modf(double x, double *integer)
```

示例

```cpp
#include <stdio.h>
#include <math.h>

int main()
{
    double intpart;
    double result = modf(3.14, &intpart);
    printf("result: %f\n", result);
    printf("intpart: %f\n", intpart);
    return 0;
}
```

运行结果

```shell
$ gcc main.c -o main && ./main
result: 0.140000
intpart: 3.000000
```

## acos

返回以弧度表示的 x 的反余弦。

```cpp
/**
 * 参数
 *   x -- 一个介于 -1 和 1 之间的浮点数。
 * 返回值
 *   返回 x 的反余弦值，以弧度为单位。返回值的范围是 [0, π]。
 *   如果 x 不在 [-1, 1] 范围内，函数将返回 NaN，并设置适当的数学错误（例如 EDOM）。
 */
double acos(double x)
```

示例

```cpp
#include <stdio.h>
#include <math.h>

int main()
{
    double result = acos(0.5);
    printf("result: %f\n", result);
    return 0;
}
```

运行结果

```shell
$ gcc main.c -o main && ./main
result: 1.047198
```

## asin

返回以弧度表示的 x 的反正弦。

```cpp
/**
 * 参数
 *   x -- 一个介于 -1 和 1 之间的浮点数。
 * 返回值
 *   返回 x 的反正弦值，以弧度为单位。返回值的范围是 [-π/2, π/2]。
 *   如果 x 不在 [-1, 1] 范围内，函数将返回 NaN，并设置适当的数学错误（例如 EDOM）。
 */
double asin(double x)
```

示例

```cpp
#include <stdio.h>
#include <math.h>

int main()
{
    double result = asin(0.5);
    printf("result: %f\n", result);
    return 0;
}
```

运行结果

```shell
$ gcc main.c -o main && ./main
result: 0.523599
```

## atan

返回以弧度表示的 x 的反正切。

```cpp
/**
 * 参数
 *   x -- 浮点值。
 * 返回值
 *   返回 x 的反正切值，以弧度为单位。返回值的范围是 [-π/2, π/2]。
 */
double atan(double x)
```

示例

```cpp
#include <stdio.h>
#include <math.h>

int main()
{
    double result = atan(0.5);
    printf("result: %f\n", result);
    return 0;
}
```

运行结果

```shell
$ gcc main.c -o main && ./main
result: 0.463648
```

## atan2

返回以弧度表示的 y/x 的反正切。y 和 x 的值的符号决定了正确的象限。

```cpp
/**
 * 参数
 *   x -- 代表 x 轴坐标的浮点值。
 *   y -- 代表 y 轴坐标的浮点值。
 * 返回值
 *   返回点 (x, y) 的反正切值，以弧度为单位。返回值的范围是 [-π, π]。
 */
double atan2(double y, double x)
```

示例

```cpp
#include <stdio.h>
#include <math.h>

int main()
{
    double result = atan2(0.5, 0.5);
    printf("result: %f\n", result);
    return 0;
}
```

运行结果

```shell
$ gcc main.c -o main && ./main
result: 0.785398
```

## cos

返回弧度角 x 的余弦。

```cpp
/**
 * 参数
 *   x：以弧度为单位的角度，类型为 double、float 或 long double。
 * 返回值
 *   返回 x 的余弦值，范围是 [-1, 1]。
 */
double cos(double x)
```

示例

```cpp
#include <stdio.h>
#include <math.h>

int main()
{
    double result = cos(60 * M_PI / 180.0);
    printf("result: %f\n", result);
    return 0;
}
```

运行结果

```shell
$ gcc main.c -o main && ./main
result: 0.500000
```

## cosh

返回 x 的双曲余弦。

```cpp
/**
 * 参数
 *   x -- 输入的实数，表示双曲余弦函数的自变量。
 * 返回值
 *   该函数返回 x 的双曲余弦。
 */
double cosh(double x)
```

示例

```cpp
#include <stdio.h>
#include <math.h>

int main()
{
    double result = cosh(0.5);
    printf("result: %f\n", result);
    return 0;
}
```

运行结果

```shell
$ gcc main.c -o main && ./main
result: 1.127626
```

## sin

返回弧度角 x 的正弦。

```cpp
/**
 * 参数
 *   x：以弧度为单位的角度，类型可以是 double、float 或 long double。
 * 返回值
 *   该函数返回 x 的正弦，范围是 [-1, 1]。
 */
double sin(double x)
```

示例

```cpp
#include <stdio.h>
#include <math.h>

int main()
{
    double result = sin(45.0 * M_PI / 180);
    printf("result: %f\n", result);
    return 0;
}
```

运行结果

```shell
$ gcc main.c -o main && ./main
result: 0.707107
```

## sinh

返回 x 的双曲正弦。

```cpp
/**
 * 参数
 *   x -- 输入的实数，表示双曲正弦函数的自变量。
 * 返回值
 *   该函数返回 x 的双曲正弦。
 */
double sinh(double x)
```

示例

```cpp
#include <stdio.h>
#include <math.h>

int main()
{
    double result = sinh(0.5);
    printf("result: %f\n", result);
    return 0;
}
```

运行结果

```shell
$ gcc main.c -o main && ./main
result: 0.521095
```

## tanh

返回 x 的双曲正切。

```cpp
/**
 * 参数
 *   x -- 输入的实数，表示双曲正切函数的自变量。
 * 返回值
 *   该函数返回 x 的双曲正切。结果的范围是 [-1, 1]。
 */
double tanh(double x)
```

示例

```cpp
#include <stdio.h>
#include <math.h>

int main()
{
    double result = tanh(0.5);
    printf("result: %f\n", result);
    return 0;
}
```

运行结果

```shell
gcc main.c -o main && ./main
result: 0.462117
```

## exp

返回 e 的 x 次幂的值。

```cpp
double exp(double x)
```

示例

```cpp

```

运行结果

```shell

```

## frexp

把浮点数 x 分解成尾数和指数。返回值是尾数，并将指数存入 exponent 中。所得的值是 x = mantissa * 2 ^ exponent。

```cpp
double frexp(double x, int *exponent)
```

示例

```cpp

```

运行结果

```shell

```

## ldexp

返回 x 乘以 2 的 exponent 次幂。

```cpp
double ldexp(double x, int exponent)
```

示例

```cpp

```

运行结果

```shell

```

## log

返回 x 的自然对数（基数为 e 的对数）。

```cpp
double log(double x)
```

示例

```cpp

```

运行结果

```shell

```

## log10

返回 x 的常用对数（基数为 10 的对数）。

```cpp
double log10(double x)
```

示例

```cpp

```

运行结果

```shell

```
