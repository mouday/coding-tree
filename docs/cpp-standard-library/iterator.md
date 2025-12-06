# iterator

用于遍历容器中的元素

头文件

```cpp
#include <iterator>
```

迭代器主要分为以下几类：

- 输入迭代器（Input Iterator）：只能进行单次读取操作，不能进行写入操作。
- 输出迭代器（Output Iterator）：只能进行单次写入操作，不能进行读取操作。
- 正向迭代器（Forward Iterator）：可以进行读取和写入操作，并且可以向前移动。
- 双向迭代器（Bidirectional Iterator）：除了可以进行正向迭代器的所有操作外，还可以向后移动。
- 随机访问迭代器（Random Access Iterator）：除了可以进行双向迭代器的所有操作外，还可以进行随机访问，例如通过下标访问元素。

语法

```cpp
#include <iterator>

// 使用迭代器遍历容器
for (ContainerType::iterator it = container.begin(); it != container.end(); ++it) {
    // 访问元素 *it
}
```

示例

```cpp
#include <iostream>
#include <vector>
#include <iterator>

int main() {
    // 创建一个 vector 容器并初始化
    std::vector<int> vec = {1, 2, 3, 4, 5};

    // 方式一：使用迭代器遍历 vector
    for (std::vector<int>::iterator it = vec.begin(); it != vec.end(); ++it) {
        std::cout << *it << " ";
    }
    std::cout << std::endl;

    // 方式二：使用 auto 关键字简化迭代器类型
    for (auto it = vec.begin(); it != vec.end(); ++it) {
        std::cout << *it << " ";
    }
    std::cout << std::endl;

    // 方式三：使用 C++11 范围 for 循环
    for (int elem : vec) {
        std::cout << elem << " ";
    }
    std::cout << std::endl;

    return 0;
}
```

输出结果

```shell
1 2 3 4 5 
1 2 3 4 5 
1 2 3 4 5 
```
