# tgmath.h

`<tgmath.h>` 是 C 标准库中的一个头文件，提供了类型泛型数学函数（Type-Generic Math Functions）。

C99 标准中引入，允许开发者使用统一的函数名来调用不同类型的数学函数（如 float、double 和 long double），而无需显式指定函数的具体类型。

主要目的是：

- 简化数学函数的使用，避免为不同类型（如 float、double、long double）显式调用不同的函数（如 sinf、sin、sinl）。

- 提高代码的可读性和可维护性。

- 支持复数类型的数学函数。

## 类型泛型宏

`<tgmath.h>` 定义了一组类型泛型宏，这些宏根据参数的类型自动选择正确的数学函数。例如：

sin(x)：
- 如果 x 是 float，则调用 sinf(x)；
- 如果 x 是 double，则调用 sin(x)；
- 如果 x 是 long double，则调用 sinl(x)。

sqrt(x)：

- 如果 x 是 float，则调用 sqrtf(x)；
- 如果 x 是 double，则调用 sqrt(x)；
- 如果 x 是 long double，则调用 sqrtl(x)。

这些宏支持以下类型的参数：

- 实数类型：float、double、long double。
- 复数类型：float complex、double complex、long double complex。

## 支持的函数

基本数学函数

|函数 | 描述
|-|-
sin |正弦函数
cos |余弦函数
tan |正切函数
asin   | 反正弦函数
acos   | 反余弦函数
atan   | 反正切函数
atan2  | 两个参数的反正切函数
sinh   | 双曲正弦函数
cosh   | 双曲余弦函数
tanh   | 双曲正切函数
asinh  | 反双曲正弦函数
acosh  | 反双曲余弦函数
atanh  | 反双曲正切函数

指数和对数函数

|函数 | 描述
|-|-
exp 指数函数
log 自然对数函数
log10   常用对数函数
pow 幂函数

其他函数

|函数 | 描述
|-|-
sqrt   | 平方根函数
fabs   | 绝对值函数
ceil   | 向上取整函数
floor  | 向下取整函数
fmod   | 浮点数取余函数

## 实现原理

`<tgmath.h>` 的实现依赖于 C 语言的泛型选择机制（_Generic 关键字）。

`_Generic` 关键字根据 x 的类型选择正确的函数。

例如，sin 宏的定义可能如下：

```cpp
#define sin(x) _Generic((x), \
    float: sinf,             \
    double: sin,             \
    long double: sinl        \
)(x)
```

## 示例

示例1

```cpp
#include <stdio.h>
#include <tgmath.h>

int main()
{
    // 实数类型
    float f = 1.5f;
    double d = 2.5;
    long double ld = 3.5L;

    // 使用类型泛型函数
    printf("sin(f) = %f\n", sin(f));    // 调用 sinf
    printf("sin(d) = %f\n", sin(d));    // 调用 sin
    printf("sin(ld) = %Lf\n", sin(ld)); // 调用 sinl

    return 0;
}
```

运行结果

```shell
% gcc main.c -o main && ./main
sin(f) = 0.997495
sin(d) = 0.598472
sin(ld) = -0.350783
```

## _Generic

```cpp
/**
 * assignment-expression: 赋值表达式，可以认为是变量var
 * generic-assoc-list: 泛型关联表，其语法为：
 *    type-name : expression, 
 *    type-name : expression, 
 *    ..., 
 *    default : expression (可省略)
 */
_Generic (assignment-expression, generic-assoc-list)
```

示例1

```cpp
#include <stdio.h>
#include <fenv.h>
#include <math.h>

#define GET_TYPE_NAME(type) _Generic((type), \
    int: "int",                              \
    long: "long",                            \
    long long: "long long",                  \
    float: "float",                          \
    double: "double",                        \
    long double: "long double")

int main()
{
    char *type_name;
    
    type_name = GET_TYPE_NAME(13);
    printf("Type of 13 is: %s\n", type_name);

    type_name = GET_TYPE_NAME(13.0);
    printf("Type of 13.0 is: %s\n", type_name);
    return 0;
}
```

运行结果

```shell
% gcc main.c -o main && ./main
Type of 13 is: int
Type of 13.0 is: double
```

示例2

```cpp
#include <stdio.h>
#include <fenv.h>
#include <math.h>

int add_int(int x, int y);
float add_float(float x, float y);

#define ADD(x, y) _Generic((x), \
    int: add_int,                  \
    float: add_float)(x, y)

int add_int(int x, int y)
{
    return x + y;
}

float add_float(float x, float y)
{
    return x + y;
}

int main()
{
    int a = 5, b = 10, result_int;
    float c = 5.0, d = 10.0, result_float;

    result_int = ADD(a, b);
    result_float = ADD(c, d);

    printf("Result of adding integers: %d\n", result_int);
    printf("Result of adding floats: %.2f\n", result_float);

    return 0;
}
```

运行结果

```shell
% gcc main.c -o main && ./main
Result of adding integers: 15
Result of adding floats: 15.00
```
