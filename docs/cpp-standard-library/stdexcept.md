# stdexcept

标准异常类

头文件

```cpp
#include <stdexcept>
```

常见的 C++ 异常类及其主要用途

|异常类 | 说明
|-|-
std::exception | 所有标准异常类的基类
std::bad_exception | 当异常处理过程中发生错误时抛出
std::bad_alloc | 当内存分配失败时抛出
std::bad_cast | 当类型转换失败时抛出
std::bad_typeid | 当 typeid 操作失败时抛出
std::logic_error | 当逻辑错误发生时抛出，例如无效的输入参数
std::domain_error | 当函数调用的参数不在有效范围内时抛出
std::invalid_argument | 当函数调用的参数无效时抛出
std::length_error | 当容器操作因为长度限制而失败时抛出
std::out_of_range | 当访问容器的非法索引时抛出
std::overflow_error | 当算术运算导致溢出时抛出
std::range_error | 当函数返回值不在期望的范围内时抛出
std::underflow_error | 当算术运算导致下溢时抛出

继承体系

```cpp
std::exception
    std::runtime_error
        std::range_error
        std::overflow_error
        std::underflow_error
    std::logic_error
        std::invalid_argument
        std::domain_error
        std::length_error
        std::out_of_range
```

## std::invalid_argument

示例

```cpp
#include <iostream>
#include <exception>

void foo(int a)
{
    if (a > 0)
    {
        throw std::invalid_argument("input must less than 0");
    }
}

int main(int argc, char const *argv[])
{
    try
    {
        foo(10);
    }
    catch (const std::invalid_argument &e)
    {
        std::cout << e.what() << std::endl;
    }

    return 0;
}
```

输出结果

```shell
input must less than 0
```

## 自定义异常类

示例1

```cpp
#include <iostream>
#include <exception>

class AppException : public std::runtime_error
{
public:
    AppException(const std::string &message) : std::runtime_error(message) {}
};

int main(int argc, char const *argv[])
{
    try
    {
        throw AppException("AppException runtime error");
    }
    catch (const std::runtime_error &e)
    {
        std::cout << e.what() << std::endl;
    }

    return 0;
}
```

输出结果

```shell
AppException runtime error
```
