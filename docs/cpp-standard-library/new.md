# new

动态内存分配的函数和异常类型。

动态内存分配允许程序在运行时请求内存，这在处理不确定大小的数据结构时非常有用。

`<new>` 头文件定义了以下几个关键组件：

- new 运算符：用于动态分配内存。
- delete 运算符：用于释放动态分配的内存。
- nothrow 运算符：用于在内存分配失败时不抛出异常。
- std::bad_alloc 异常：当内存分配失败时抛出。

语法

使用 new 运算符

```cpp
pointer new (type [, initializer]);
```

- pointer 是指向分配的内存的指针。
- type 是要分配的对象的类型。
- initializer 是一个可选的初始化表达式。

使用 delete 运算符

```cpp
delete pointer;
```

pointer 是之前使用 new 分配的内存的指针。

## 示例：动态分配单个对象

```cpp
#include <iostream>
#include <memory>

class Node
{
public:
    Node()
    {
        std::cout << "Node" << std::endl;
    }
    ~Node()
    {
        std::cout << "~Node" << std::endl;
    }

    void show() const
    {
        std::cout << "Node show" << std::endl;
    }
};

int main(int argc, char const *argv[])
{
    Node *node = new Node;

    node->show();

    delete node;

    return 0;
}
```

输出结果

```shell
Node
Node show
~Node
```

## 示例：动态分配数组

```cpp
#include <iostream>
#include <array>
#include <memory>

class Node
{
public:
    Node()
    {
        std::cout << "Node" << std::endl;
    }
    ~Node()
    {
        std::cout << "~Node" << std::endl;
    }
};

int main(int argc, char const *argv[])
{
    Node *arr = new Node[3];

    delete[] arr;

    return 0;
}
```

输出结果

```shell
Node
Node
Node
~Node
~Node
~Node
```

使用 nothrow 避免异常:

```cpp
Node *node = new(std::nothrow) Node;
```

当使用 new 运算符分配内存失败时，C++ 会抛出一个 std::bad_alloc 异常

```cpp
try
{
    Node *node = new Node;
}
catch (const std::bad_alloc& e) {
    // 异常处理
}
```

