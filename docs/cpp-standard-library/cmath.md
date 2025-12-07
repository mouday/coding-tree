# cmath

数学函数

头文件

```cpp
#include <cmath>
```

[C 标准库 math.h](../c-standard-library/math.h.md)

1、基本数学函数

函数 | 功能 | 示例
|- | - | -
abs(x) | 计算整数 x 的绝对值 | abs(-5) // 5
fabs(x) | 计算浮点数 x 的绝对值 | fabs(-5.5) // 5.5
fmod(x, y) | 计算 x 除以 y 的余数 | fmod(5.3, 2) // 1.3
remainder(x, y) | 计算 x 除以 y 的余数 | remainder(5.5, 2) // 1.5
fmax(x, y) | 返回 x 和 y 中的较大值 | fmax(3.5, 4.2) // 4.2
fmin(x, y) | 返回 x 和 y 中的较小值 | fmin(3.5, 4.2) // 3.5
hypot(x, y) | 计算 sqrt(x*x + y*y) | hypot(3, 4) // 5

2、指数和对数函数

函数 | 功能 | 示例
|- | - | -
exp(x) | 计算 e^x，e 为自然对数的底数 | exp(1) // 2.71828...
log(x) | 计算 x 的自然对数 | log(2.71828) // 1
log10(x) | 计算 x 的以 10 为底的对数 | log10(100) // 2
pow(x, y) | 计算 x 的 y 次方 | pow(2, 3) // 8
sqrt(x) | 计算 x 的平方根 | sqrt(16) // 4
cbrt(x) | 计算 x 的立方根 | cbrt(27) // 3
expm1(x) | 计算 e^x - 1 | expm1(1) // 1.71828...
log1p(x) | 计算 log(1 + x)，适用于 x 接近 0 的情况 | log1p(0.00001) // 0.00001

3、三角函数

函数 | 功能 | 示例
|- | - | -
sin(x) | 计算 x 的正弦值，x 以弧度为单位 | sin(3.14159 / 2) // 1
cos(x) | 计算 x 的余弦值，x 以弧度为单位 | cos(3.14159) // -1
tan(x) | 计算 x 的正切值，x 以弧度为单位 | tan(0) // 0
asin(x) | 计算 x 的反正弦值，返回弧度 | asin(1) // 3.14159/2
acos(x) | 计算 x 的反余弦值，返回弧度 | acos(-1) // 3.14159
atan(x) | 计算 x 的反正切值，返回弧度 | atan(1) // 3.14159/4
atan2(y, x) | 计算 y/x 的反正切值，返回弧度 | atan2(1, 1) // 3.14159/4

4、双曲函数

函数 | 功能 | 示例
|- | - | -
sinh(x) | 计算 x 的双曲正弦 | sinh(0) // 0
cosh(x) | 计算 x 的双曲余弦 | cosh(0) // 1
tanh(x) | 计算 x 的双曲正切 | tanh(1) // 0.7616
asinh(x) | 计算 x 的反双曲正弦 | asinh(1) // 0.8814
acosh(x) | 计算 x 的反双曲余弦，x ≥ 1 | acosh(1) // 0
atanh(x) | 计算 x 的反双曲正切，x 在 (-1, 1) | atanh(0.5) // 0.5493

5、取整和浮点数操作

函数 | 功能 | 示例
|- | - | -
ceil(x) | 返回不小于 x 的最小整数 | ceil(2.3) // 3
floor(x) | 返回不大于 x 的最大整数 | floor(2.3) // 2
trunc(x) | 返回去除小数部分的整数值 | trunc(2.8) // 2
round(x) | 返回四舍五入到最接近的整数 | round(2.5) // 3
lround(x) | 返回四舍五入到 long 类型 | lround(2.5) // 3
llround(x) | 返回四舍五入到 long long 类型 | llround(2.5) // 3
nearbyint(x) | 返回舍入到最接近整数（但不引发浮点异常） | nearbyint(2.5) // 2
rint(x) | 返回四舍五入到整数，符合当前舍入方式 | rint(2.5) // 3
modf(x, &intpart) | 将 x 的整数和小数部分分离 | modf(2.3, &intpart)

6、浮点数检查

函数 | 功能 | 示例
|- | - | -
isfinite(x) | 检查 x 是否为有限值（非无穷大或非 NaN） | isfinite(3.0) // true
isinf(x) | 检查 x 是否为无穷大 | isinf(1.0 / 0.0) // true
isnan(x) | 检查 x 是否为 NaN | isnan(0.0 / 0.0) // true
isnormal(x) | 检查 x 是否为正常的非零浮点数 | isnormal(1.0) // true
signbit(x) | 检查 x 的符号是否为负 | signbit(-5.3) // true

实例

```cpp
#include <iostream>
#include <cmath>

int main() {
    int value = std::abs(-5);
    std::cout << "value: " << value << std::endl;
}
```

```shell
value: 5
```
