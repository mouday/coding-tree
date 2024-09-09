# utility

## pair

包含两个元素的容器

```cpp
#include <iostream>
#include <utility>

int main() {
    std::pair<int, int> p = {10, 20};

    std::cout << p.first << " " << p.second << std::endl;
    // 10 20

    return 0;
}
```

## swap

交换两个对象的值

```cpp
#include <iostream>
#include <utility>

int main() {
    int a = 5;
    int b = 10;

    std::swap(a, b);

    std::cout << " a = " << a << std::endl;
    std::cout << " b = " << b << std::endl;
    // a = 10
    // b = 5

    return 0;
}

```