# valarray

 `<valarray>` 库是一个用于数值计算的库，它提供了一种高效的方式来处理数值数组

示例

```cpp
#include <iostream>
#include <valarray>

int main() {
    std::valarray<int> va1 = {1, 2, 3, 4, 5};
    std::valarray<int> va2 = {2, 3, 4, 5, 6};

    std::valarray<int> sum = va1 + va2; // 加法

    for (auto i : sum) {
        std::cout << i << " ";
    }
    std::cout << std::endl;
}
```

输出结果

```shell
3 5 7 9 11 
```
