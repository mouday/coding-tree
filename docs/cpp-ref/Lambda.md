# Lambda

## 基本语法

```cpp
[capture](parameters) -> return_type {
    // 函数体
}
```

- capture：捕获列表，用于捕获外部变量。可以是值捕获、引用捕获或隐式捕获。
- parameters：参数列表，和普通函数的参数列表类似。
- return_type：返回类型，可以省略，编译器会自动推导。
- 函数体：Lambda表达式的实现代码。

捕获列表

捕获列表用于指定在lambda函数体内可以访问的外部变量。有以下几种方式：

`[]`：不捕获任何外部变量。
`[var]`：以值的方式捕获变量var。
`[&var]`：以引用的方式捕获变量var。
`[=]`：以值的方式捕获所有外部变量（隐式捕获）。
`[&]`：以引用的方式捕获所有外部变量（隐式捕获）。
`[this]`：捕获当前类的this指针，从而可以访问类的成员变量和成员函数。

## 示例

### 示例1：简单的lambda表达式

```cpp
#include <iostream>

int main(int argc, char const *argv[])
{
    auto lambda = []()
    {
        std::cout << "hello" << std::endl;
    };
    lambda();

    return 0;
}
```

### 示例2：带参数和返回值的lambda表达式

```cpp
#include <iostream>

int main(int argc, char const *argv[])
{
    auto add = [](int a, int b) -> int
    {
        return a + b;
    };

    int ret = add(1, 1);

    std::cout << ret << std::endl;

    return 0;
}
```

输出结果

```shell
2
```

### 示例3：使用捕获列表

```cpp
#include <iostream>

int main(int argc, char const *argv[])
{
    int x = 10;
    int y = 20;

    // 值捕获x，引用捕获y
    auto lambda = [x, &y]()
    {
        std::cout << "lambda x:" << x << std::endl;
        std::cout << "lambda y:" << y << std::endl;
        y = 100;
        y = 200; // 修改y，因为y是引用捕获，所以外部y也会改变
    };

    lambda();

    std::cout << "x:" << x << std::endl;
    std::cout << "y:" << y << std::endl;

    return 0;
}
```

输出结果

```shell
lambda x:10
lambda y:20
x:10
y:200
```

### 示例4：隐式值捕获

```cpp
#include <iostream>

int main(int argc, char const *argv[])
{
    int x = 10;
    int y = 20;

    // 隐式值捕获所有外部变量
    auto lambda = [=]()
    {
        std::cout << "lambda x:" << x << std::endl;
        std::cout << "lambda y:" << y << std::endl;
    };

    lambda();

    return 0;
}
```

输出结果

```shell
lambda x:10
lambda y:20
```

### 示例5：隐式引用捕获

```cpp
#include <iostream>

int main(int argc, char const *argv[])
{
    int x = 10;
    int y = 20;

    // 隐式引用捕获所有外部变量
    auto lambda = [&]()
    {
        std::cout << "lambda x:" << x << std::endl;
        std::cout << "lambda y:" << y << std::endl;
        x = 100;
        y = 200;
    };

    lambda();

    std::cout << "x:" << x << std::endl;
    std::cout << "y:" << y << std::endl;

    return 0;
}
```

输出结果

```shell
lambda x:10
lambda y:20
x:100
y:200
```

### 示例6：可变值捕获

默认情况下，以值方式捕获的变量在lambda函数体内是不可修改的（相当于const）。如果需要在函数体内修改值捕获的变量，可以在参数列表后加上mutable关键字。

```cpp
#include <iostream>

int main(int argc, char const *argv[])
{
    int x = 10;

    // 在函数体内修改值捕获的变量
    auto lambda = [x]() mutable
    {
        std::cout << "lambda x:" << x << std::endl;
        x = 100;
    };

    lambda();

    std::cout << "x:" << x << std::endl;

    return 0;
}
```

输出结果

```shell
lambda x:10
x:10
```

### 示例7：将lambda作为函数参数

Lambda表达式可以用于STL算法中，也可以作为函数对象传递给其他函数。

```cpp
#include <iostream>
#include <vector>

int main(int argc, char const *argv[])
{
    std::vector<int> vector = {1, 3, 5, 2, 4};

    // 由大到小排序
    std::sort(vector.begin(), vector.end(), [](int a, int b) -> bool
              { return a > b; });

    for (int val : vector)
    {
        std::cout << val << " ";
    }

    std::cout << std::endl;

    return 0;
}
```

输出结果

```shell
5 4 3 2 1 
```


## 注意事项

捕获列表和参数列表可以同时为空，但捕获列表和参数列表的括号不能省略（除非参数列表为空且不指定返回类型，此时可以省略参数列表的括号，但捕获列表的括号必须存在）。

返回类型如果省略，编译器会自动推导。但如果函数体中有多个return语句且返回类型不同，或者有复杂的控制流，最好显式指定返回类型。

使用引用捕获时要注意变量的生命周期，确保在lambda执行时捕获的引用仍然有效。

## 版本特性

C++14：引入了泛型lambda，允许在参数列表中使用auto。

```cpp
auto lambda = [](auto a, auto b) { return a + b; };
```

C++17：允许在捕获列表中捕获表达式的结果（初始化捕获）

```cpp
#include <iostream>
using namespace std;

int main() {
    int x = 10;
    // 初始化捕获：在捕获列表中定义变量并初始化
    auto lambda = [y = x + 5]() {
        cout << y << endl;
    };
    lambda();
    return 0;
}
```

C++17：可以在lambda表达式中使用constexpr。

```cpp
constexpr auto square = [](int n) { return n * n; };
static_assert(square(5) == 25, "编译时计算");
```

C++20: 模板lambda

```cpp
// C++20: 模板参数列表
auto lambda = []<typename T>(T a, T b) {
    return a + b;
};

// C++20: 可推导的this (简化成员函数)
struct S {
    int value;
    
    auto get_double() {
        // 以前的写法：[this] { return value * 2; }
        return [*this] { return value * 2; };  // 正确捕获*this
    }
};
```