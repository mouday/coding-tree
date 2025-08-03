# fenv.h

`<fenv.h>` 是 C 标准库中的一个头文件，用于控制浮点环境（Floating-Point Environment）。

`<fenv.h>` 在 C99 标准中引入，提供了对浮点异常、舍入模式和其他浮点状态的控制和查询功能。

1、浮点异常

浮点异常是指在浮点运算中发生的特殊情况，例如：
```cpp
FE_DIVBYZERO：除以零。

FE_INEXACT：不精确结果。

FE_INVALID：无效操作（如对负数开平方）。

FE_OVERFLOW：上溢。

FE_UNDERFLOW：下溢。
```

这些异常通过浮点状态标志来表示，可以通过 `<fenv.h>` 中的函数检测和处理。

2、舍入模式

舍入模式控制浮点运算结果的舍入方式。`<fenv.h>` 定义了以下舍入模式：

```cpp
FE_TONEAREST：向最接近的值舍入（默认模式）。

FE_DOWNWARD：向负无穷舍入。

FE_UPWARD：向正无穷舍入。

FE_TOWARDZERO：向零舍入。
```

3、主要函数和宏

浮点异常处理

|函数/宏   |  描述
|-|-
feclearexcept(int excepts)   |清除指定的浮点异常标志
feraiseexcept(int excepts)   |触发指定的浮点异常
fetestexcept(int excepts)    |测试指定的浮点异常是否发生
fegetexceptflag(fexcept_t *flagp, int excepts)   |获取浮点异常标志状态
fesetexceptflag(const fexcept_t *flagp, int excepts)     |设置浮点异常标志状态

舍入模式控制

|函数/宏   |  描述
|-|-
fegetround(void)     |获取当前舍入模式
fesetround(int round)    |设置当前舍入模式

浮点环境控制

|函数/宏   |  描述
|-|-
fegetenv(fenv_t *envp)   |保存当前浮点环境
fesetenv(const fenv_t *envp)   |  恢复浮点环境
feholdexcept(fenv_t *envp)  | 保存当前浮点环境并清除异常标志
feupdateenv(const fenv_t *envp)  |恢复浮点环境并触发异常

示例

```cpp
#include <stdio.h>
#include <fenv.h>
#include <math.h>

int main() {
    // 启用浮点异常检测
    feclearexcept(FE_ALL_EXCEPT);

    // 触发除以零异常
    double x = 1.0, y = 0.0;
    double z = x / y;

    // 检测是否发生除以零异常
    if (fetestexcept(FE_DIVBYZERO)) {
        printf("Divide by zero exception occurred.\n");
    }

    // 设置舍入模式为向零舍入
    fesetround(FE_TOWARDZERO);

    // 测试舍入模式
    double a = 1.5;
    double b = rint(a); // 舍入到整数
    printf("Rounding 1.5 toward zero: %.1f\n", b);

    return 0;
}
```

运行结果

```shell
gcc main.c -o main && ./main
Divide by zero exception occurred.
Rounding 1.5 toward zero: 1.0
```
