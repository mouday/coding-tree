# exception

在 C++ 中，异常处理通常使用 try、catch 和 throw 关键字来实现。标准库中提供了 std::exception 类及其派生类来处理异常。

抛出异常

在 C++ 中，使用 throw 关键字来抛出一个异常，语法如下：

```cpp
throw exception_object;
```

捕获异常

使用 try 和 catch 关键字来捕获和处理异常，语法如下：

```cpp
try {
    // 可能抛出异常的代码
} catch (exception_type e) {
    // 处理异常的代码
}
```

指定捕获的异常类型

```cpp
try {
    // 可能会抛出异常的代码
} catch (const std::exception& e) {
    // 处理 std::exception 及其派生类的异常
} catch (...) {
    // 处理所有其他类型的异常
}
```

std::exception 是 C++ 标准库中定义的基类，用于所有标准异常类的基础。它定义了一些虚函数，如 what()，用于返回异常信息的 C 风格字符串。

```cpp
class exception {
public:
    virtual const char* what() const noexcept;
};
```

标准异常类

C++ 标准库提供了多个派生自 std::exception 的异常类，如 std::runtime_error、std::logic_error 等，用于表示常见的异常情况。你可以根据具体的异常情况选择合适的类来使用。

```cpp
throw std::runtime_error("Runtime error occurred");
throw std::logic_error("Logic error occurred");
```

示例

```cpp
#include <iostream>
#include <exception>

class AppException : public std::exception
{
public:
    const char *what() const throw()
    {
        return "AppException";
    }
};

int main(int argc, char const *argv[])
{
    try
    {
        throw AppException();
    }
    catch (const std::exception &e)
    {
        std::cout << e.what() << std::endl;
    }

    return 0;
}

```

输出结果

```shell
AppException
```

注意事项

- 异常不应该用于正常的控制流，它们应该只用于处理异常情况。
- 异常处理可能会影响程序的性能，因此应该谨慎使用。
- 确保在 catch 块中处理所有可能的异常类型，以避免程序在未处理的异常中崩溃。
