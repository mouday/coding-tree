# C 标准库

C 标准库（C Standard Library）

|头文件 | 功能简介
|-|-
| [stdio.h](stdio.h.md) | 标准输入输出库，包含 printf、scanf、fgets、fputs 等函数。
| [stdlib.h](stdlib.h.md) | 标准库函数，包含内存分配、程序控制、转换函数等，如 malloc、free、exit、atoi、rand 等。
| `string.h` | 字符串操作函数，如 strlen、strcpy、strcat、strcmp 等。
| `math.h` | 数学函数库，包含各种数学运算函数，如 sin、cos、tan、exp、log、sqrt 等。
| `time.h` | 时间和日期函数，如 time、clock、difftime、strftime 等。
| `ctype.h` | 字符处理函数，如 isalpha、isdigit、isspace、toupper、tolower 等。
| `limits.h` | 定义各种类型的限制值，如 INT_MAX、CHAR_MIN、LONG_MAX 等。
| `float.h` | 定义浮点类型的限制值，如 FLT_MAX、DBL_MIN 等。
| `assert.h` | 包含宏 assert，用于在调试时进行断言检查。
| `errno.h` | 定义了错误码变量 errno 及相关宏，用于表示和处理错误。
| `stddef.h` | 定义了一些通用类型和宏，如 size_t、ptrdiff_t、NULL 等。
| `signal.h` | 定义了处理信号的函数和宏，如 signal、raise 等。
| `setjmp.h` | 提供非本地跳转功能的宏和函数，如 setjmp、longjmp 等。
| `locale.h` | 定义了与地域化相关的函数和宏，如 setlocale、localeconv 等。
| [stdarg.h](stdarg.h.md) | 提供处理可变参数函数的宏，如 va_start、va_arg、va_end 等。
| `stdbool.h` | 定义布尔类型和值 true 和 false。
| `stdint.h` | 定义了精确宽度的整数类型，如 int8_t、uint16_t 等。
| `inttypes.h` | 提供与整数类型相关的格式化输出宏和函数。
| `complex.h` | 提供复数运算的函数和宏，如 cabs、carg 等。
| `tgmath.h` | 为泛型数学函数提供宏，以简化对不同类型数据的数学运算。
| `fenv.h` | 提供对浮点环境的控制，如舍入模式和异常状态

开启 Mac Coredump

```shell
# 开启 Mac Coredump
sudo sysctl kern.coredump=1

# 设置 core 文件大小
ulimit -c unlimited

# 调试 core 文件
lldb -c /cores/core.37676
```
