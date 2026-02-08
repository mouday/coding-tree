# cpp primer plus

## 函数

示例

函数声明

```cpp
double sqrt(double x);
```

函数调用

```cpp
// function_test.cpp
#include <cmath>
#include <iostream>

int main(int argc, char const *argv[])
{
    double value = 9;
    double ret = std::sqrt(value);
    std::cout << "ret = " << ret << std::endl;
    return 0;
}
```

```shell
g++ -std=c++20 function_test.cpp -o function_test && ./function_test
ret = 3
```
