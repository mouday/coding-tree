# complex.h

`<complex.h>` 是 C 标准库中的一个头文件，用于支持复数运算。 C99 标准中引入

## 数学背景

复数的一般形式为 `a + bi`，其中：

a 是实部，b 是虚部。

i 是虚数单位，满足 `i² = -1`

## 复数类型

`<complex.h>` 定义了以下复数类型：

```cpp
float complex：单精度复数。

double complex：双精度复数。

long double complex：长双精度复数。
```

## 复数常量

```cpp
I：表示虚数单位 i，即 sqrt(-1)。
```

示例

```cpp
// 表示复数 3 + 4i
double complex z = 3.0 + 4.0 * I; 
```

## 复数操作函数

算术运算

|函数 |  描述|
|-| -|
creal(z)   |  返回复数 z 的实部
cimag(z)   |  返回复数 z 的虚部
cabs(z)    | 返回复数 z 的模（绝对值）
carg(z)    | 返回复数 z 的幅角（相位）
conj(z)    | 返回复数 z 的共轭复数
cproj(z)   | 返回复数 z 的投影

三角函数

|函数 |  描述|
|-| -|
csin(z)  | 返回复数 z 的正弦值
ccos(z)  | 返回复数 z 的余弦值
ctan(z)  | 返回复数 z 的正切值

指数和对数函数

|函数 |  描述|
|-| -|
cexp(z)  | 返回复数 z 的指数值
clog(z)  | 返回复数 z 的自然对数

幂函数

|函数 |  描述|
|-| -|
cpow(z1, z2)   |   返回复数 z1 的 z2 次幂

平方根函数

|函数 |  描述|
|-| -|
csqrt(z)    |  返回复数 z 的平方根

## 示例

```cpp
#include <stdio.h>
#include <complex.h>

int main()
{
    // 定义复数
    double complex z1 = 3.0 + 4.0 * I;
    double complex z2 = 1.0 - 2.0 * I;

    // 算术运算
    double complex sum = z1 + z2;

    // 输出结果
    printf("z1 = %.2f + %.2fi\n", creal(z1), cimag(z1));
    printf("z2 = %.2f + (%.2f)i\n", creal(z2), cimag(z2));
    printf("Sum = %.2f + %.2fi\n", creal(sum), cimag(sum));

    return 0;
}
```

运行结果

```shell
% gcc main.c -o main && ./main
z1 = 3.00 + 4.00i
z2 = 1.00 + (-2.00)i
Sum = 4.00 + 2.00i
```
