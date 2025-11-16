# iomanip

对输入/输出流的格式化操作

iomanip 是 Input/Output Manipulators 的缩写

常用函数

| 函数/操纵符 | 功能
| - | - |
| `std::setw(int n)`  |  设置字段宽度，为下一次输出指定宽度
| `std::setfill(char)` | 设置填充字符（默认是空格） |
| `std::left` |  设置左对齐 |
| `std::right` | 设置右对齐 |
| `std::internal` |  符号靠左，其余靠右
| `std::setprecision(int)` | 设置浮点数的有效位数
|`std::fixed` | 设置定点格式输出浮点数 |
|`std::scientific`| 设置科学计数法格式输出浮点数 |
|`std::hex`  |  设置整数以 16 进制显示 | 
|`std::oct`  |  设置整数以 8 进制显示  | 
|`std::dec`  |  设置整数以 10 进制显示（默认） | 
|`std::showbase` |  显示进制前缀（如 0x 表示 16 进制） | 
|`std::noshowbase` | 隐藏进制前缀（默认） |
|`std::uppercase` | 16 进制字母显示为大写  | 
|`std::nouppercase`  |  16 进制字母显示为小写（默认）  | 
|`std::showpos`  |  在正数前显示 + 符号
|`std::noshowpos` | 不显示正数的 + 符号（默认）
|`std::boolalpha` | 布尔值以 true/false 输出 |
|`std::noboolalpha`  |  布尔值以 1/0 输出（默认）|
|`std::setbase(int n)` | 设置整数的进制（支持 8、10、16）|
|`std::resetiosflags` | 重置指定的流状态  |
|`std::setiosflags`  |  设置指定的流状态  |

## std::setw

设置字段宽度，为下一次输出指定宽度

```cpp
std::setw(int n)
```

示例

```cpp
#include <iomanip>
#include <iostream>

int main(int argc, char const *argv[])
{
    std::cout << "|"
        << std::setw(5) 
        << 42 
        << "|"
        << std::endl;

    return 0;
}
```

输出

```shell
|   42|
```

## std::setfill

设置填充字符（默认是空格）

```cpp
std::setfill(char)
```

示例

```cpp
#include <iomanip>
#include <iostream>

int main(int argc, char const *argv[])
{
    std::cout << std::setfill('*') 
        << std::setw(5) 
        << 42
        << std::endl;

    return 0;
}
```

输出

```shell
***42
```

## std::left

设置左对齐

示例

```cpp
#include <iomanip>
#include <iostream>

int main(int argc, char const *argv[])
{
    std::cout << std::left
              << "|"
              << std::setw(5)
              << 666
              << "|"
              << std::endl;

    return 0;
}
```

输出

```shell
|666  |
```

## std::right

设置右对齐

示例

```cpp
#include <iomanip>
#include <iostream>

int main(int argc, char const *argv[])
{
    std::cout << std::right
              << "|"
              << std::setw(5)
              << 666
              << "|"
              << std::endl;

    return 0;
}
```

输出

```shell
|  666|
```

## std::internal

符号靠左，其余靠右

示例

```cpp
#include <iomanip>
#include <iostream>

int main(int argc, char const *argv[])
{
    std::cout << "|"
              << std::internal
              << std::setw(10)
              << -42
              << "|"
              << std::endl;

    return 0;
}
```

输出

```shell
|-       42|
```

## std::setprecision

设置浮点数的有效位数

```cpp
std::setprecision(int)
```

示例

```cpp
#include <iomanip>
#include <iostream>

int main(int argc, char const *argv[])
{
    std::cout << std::setprecision(3)
              << 3.14159
              << std::endl;

    return 0;
}
```

输出

```shell
3.14
```

## std::fixed

设置定点格式输出浮点数

示例

```cpp
#include <iomanip>
#include <iostream>

int main(int argc, char const *argv[])
{
    std::cout << std::fixed
              << std::setprecision(2)
              << 3.14159
              << std::endl;

    return 0;
}

```

输出

```shell
3.14
```

## std::scientific

设置科学计数法格式输出浮点数

示例

```cpp
#include <iomanip>
#include <iostream>

int main(int argc, char const *argv[])
{
    std::cout << std::scientific
              << 3.14159
              << std::endl;

    return 0;
}
```

输出

```shell
3.141590e+00
```

## std::hex

设置整数以 16 进制显示

示例

```cpp
#include <iomanip>
#include <iostream>

int main(int argc, char const *argv[])
{
    std::cout << std::hex
              << 42
              << std::endl;

    return 0;
}

```

输出

```shell
2a
```

## std::oct

设置整数以 8 进制显示

示例

```cpp
#include <iomanip>
#include <iostream>

int main(int argc, char const *argv[])
{
    std::cout << std::oct
              << 42
              << std::endl;

    return 0;
}

```

输出

```shell
52
```

## std::dec

设置整数以 10 进制显示（默认）

示例

```cpp
#include <iomanip>
#include <iostream>

int main(int argc, char const *argv[])
{
    std::cout << std::dec
              << 42
              << std::endl;

    return 0;
}

```

输出

```shell
42
```

## std::showbase

显示进制前缀（如 0x 表示 16 进制）

示例

```cpp
#include <iomanip>
#include <iostream>

int main(int argc, char const *argv[])
{
    std::cout << std::showbase
              << std::hex
              << 42
              << std::endl;

    return 0;
}
```

输出

```shell
0x2a
```

## std::noshowbase

隐藏进制前缀（默认）

示例

```cpp
#include <iomanip>
#include <iostream>

int main(int argc, char const *argv[])
{
    std::cout << std::noshowbase
              << std::hex
              << 42
              << std::endl;

    return 0;
}
```

输出

```shell
2a
```

## std::uppercase

16 进制字母显示为大写

示例

```cpp
#include <iomanip>
#include <iostream>

int main(int argc, char const *argv[])
{
    std::cout << std::uppercase
              << std::hex
              << 42
              << std::endl;

    return 0;
}
```

输出

```shell
2A
```

## std::nouppercase

16 进制字母显示为小写（默认）

示例

```cpp
#include <iomanip>
#include <iostream>

int main(int argc, char const *argv[])
{
    std::cout << std::nouppercase
              << std::hex
              << 42
              << std::endl;

    return 0;
}
```

输出

```shell
2a
```

## std::showpos

在正数前显示 + 符号

示例

```cpp
#include <iomanip>
#include <iostream>

int main(int argc, char const *argv[])
{
    std::cout << std::showpos
              << 42
              << std::endl;

    return 0;
}
```

输出

```shell
+42
```

## std::noshowpos

不显示正数的 + 符号（默认）

示例

```cpp
#include <iomanip>
#include <iostream>

int main(int argc, char const *argv[])
{
    std::cout << std::noshowpos
              << 42
              << std::endl;

    return 0;
}
```

输出

```shell
42
```

## std::boolalpha

布尔值以 true/false 输出（默认显示1/0）

示例

```cpp
#include <iomanip>
#include <iostream>

int main(int argc, char const *argv[])
{
    std::cout << std::boolalpha
              << true
              << std::endl;

    return 0;
}
```

输出

```shell
true
```

## std::noboolalpha

布尔值以 1/0 输出（默认）

示例

```cpp
#include <iomanip>
#include <iostream>

int main(int argc, char const *argv[])
{
    std::cout << std::noboolalpha
              << true
              << std::endl;

    return 0;
}
```

输出

```shell
1
```

## std::setbase

设置整数的进制（支持 8、10、16）

```cpp
std::setbase(int n)
```

示例

```cpp
#include <iomanip>
#include <iostream>

int main(int argc, char const *argv[])
{
    std::cout << std::setbase(16)
              << 42
              << std::endl;

    return 0;
}
```

输出

```shell
2a
```

## std::resetiosflags

重置指定的流状态

```cpp
resetiosflags(ios_base::fmtflags mask)
```

示例

```cpp
#include <iomanip>
#include <iostream>

int main(int argc, char const *argv[])
{
    std::cout << std::resetiosflags(std::ios::showbase)
              << std::hex
              << 42
              << std::endl;

    return 0;
}

```

输出

```shell
2a
```

## std::setiosflags

设置指定的流状态

```cpp
setiosflags(ios_base::fmtflags mask)
```

示例

```cpp
#include <iomanip>
#include <iostream>

int main(int argc, char const *argv[])
{
    std::cout << std::setiosflags(std::ios::showbase)
              << std::hex
              << 42
              << std::endl;

    return 0;
}

```

输出

```shell
0x2a
```
