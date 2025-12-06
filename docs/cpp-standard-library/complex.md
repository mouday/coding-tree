# complex

处理 复数（complex number）

一个复数由实部（real part）和虚部（imaginary part）构成，形式：

```cpp
z = a + bi
```

示例

```cpp
#include <iostream>
#include <complex>  // 复数头文件

int main() {
    std::complex<int> z1(3, 4); // 3 + 4i
    std::complex<int> z2(1, -2); // 1 - 2i

    std::cout << "z1 = " << z1 << std::endl;
    std::cout << "z2 = " << z2 << std::endl;
}
```

输出结果

```shell
z1 = (3,4)
z2 = (1,-2)
```
