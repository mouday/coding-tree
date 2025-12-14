# random

生成随机数

随机数生成器（Random Number Generator, RNG）可以分为两大类：

- 伪随机数生成器：它们使用确定性算法生成看似随机的数列。这些数列在理论上是可预测的，但通常对于大多数应用来说足够随机。
- 真随机数生成器：它们基于物理过程（如热噪声、放射性衰变等）生成随机数，但 C++ 标准库不直接提供这类生成器。

示例

```cpp
#include <iostream>
#include <random>

int main()
{
    // 使用随机设备创建一个随机种子
    std::random_device rd;

    // 使用随机种子初始化 Mersenne Twister 随机数生成器
    std::mt19937 generator(rd());

    // 生成 1 到 100 间的整数
    std::uniform_int_distribution<int> dist(1, 100);
    int random_int = dist(generator);

    std::cout << random_int << std::endl;
}
```

输出结果

```shell
25
```