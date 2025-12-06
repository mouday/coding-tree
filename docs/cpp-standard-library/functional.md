# functional

提供了一组函数模板，这些模板允许我们使用函数对象（function objects）作为参数传递给算法，或者作为算法的返回值。函数对象是那些重载了 operator() 的对象，它们可以像普通函数一样被调用。

头文件

```cpp
#include <functional>
```

常用的函数对象

- std::function：一个通用的多态函数封装器。
- std::bind：用于绑定函数的参数。
- std::plus、std::minus、std::multiplies、std::divides、std::modulus：基本的算术操作。
- std::equal_to、std::not_equal_to、std::greater、std::less、std::greater_equal、std::less_equal：比较操作。
- std::unary_negate、std::binary_negate：逻辑否定操作。
- std::logical_and、std::logical_or、std::logical_not：逻辑操作。

## std::function

std::function 是一个模板类，可以存储、调用和复制任何可调用对象，比如函数、lambda 表达式或函数对象。

示例

```cpp
#include <iostream>
#include <functional>

void foo()
{
    std::cout << "This is foo function." << std::endl;
}

int main()
{
    std::function<void()> func = foo;
    func();
    return 0;
}
```

输出结果

```shell
This is foo function.
```

## std::bind

std::bind 允许我们创建一个可调用对象，它在调用时会将给定的参数绑定到一个函数或函数对象。

示例

```cpp
#include <iostream>
#include <functional>

int add(int a, int b)
{
    return a + b;
}

int main()
{
    auto add_func = std::bind(add, 10, std::placeholders::_1);
    std::cout << "Result: " << add_func(20) << std::endl;
    
    return 0;
}
```

输出结果

```shell
Result: 30
```

## std::less

示例

```cpp
#include <iostream>
#include <vector>
#include <functional>

int main()
{
    std::vector<int> vec = {1, 3, 2, 4, 5};
    
    std::sort(vec.begin(), vec.end(), std::less<int>());

    for (int n : vec)
    {
        std::cout << n << " ";
    }
    std::cout << std::endl;

    return 0;
}
```

输出结果

```shell
1 2 3 4 5 
```

