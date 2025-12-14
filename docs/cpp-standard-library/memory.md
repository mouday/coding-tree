# memory

内存管理库

## 智能指针

智能指针是 `<memory>` 头文件中的核心内容。它们是 C++11 引入的特性，用于自动管理动态分配的内存。智能指针的主要类型有：

- std::unique_ptr：独占所有权的智能指针，同一时间只能有一个 unique_ptr 指向特定内存。
- std::shared_ptr：共享所有权的智能指针，多个 shared_ptr 可以指向同一内存，内存在最后一个 shared_ptr 被销毁时释放。
- std::weak_ptr：弱引用智能指针，用于与 shared_ptr 配合使用，避免循环引用导致的内存泄漏。

## std::unique_ptr

独占所有权的智能指针

示例

```cpp
#include <iostream>
#include <memory>

class Foo
{
public:
    Foo()
    {
        std::cout << "Foo" << std::endl;
    }
    ~Foo()
    {
        std::cout << "~Foo" << std::endl;
    }

    void show() const
    {
        std::cout << "show" << std::endl;
    }
};

int main(int argc, char const *argv[])
{
    std::unique_ptr<Foo> foo(new Foo());
    foo->show();

    // 当 main 函数结束时，foo 被销毁，自动释放 Foo 对象的内存
    return 0;
}
```

输出

```shell
Foo
show
~Foo
```

## std::shared_ptr

共享所有权的智能指针

示例

```cpp
#include <iostream>
#include <memory>

class Foo
{
public:
    Foo()
    {
        std::cout << "Foo" << std::endl;
    }
    ~Foo()
    {
        std::cout << "~Foo" << std::endl;
    }

    void show() const
    {
        std::cout << "show" << std::endl;
    }
};

int main(int argc, char const *argv[])
{
    std::shared_ptr<Foo> foo1(new Foo());
    std::shared_ptr<Foo> foo2 = foo1;
    foo1->show();
    foo2->show();

    // 当 foo1 和 foo2 都被销毁时，Foo 对象的内存才会被释放
    return 0;
}
```

输出

```shell
Foo
show
show
~Foo
```

## std::weak_ptr

解决循环引用问题

```cpp
#include <iostream>
#include <memory>

class Node
{
public:
    std::shared_ptr<Node> prev;
    std::weak_ptr<Node> next;

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
    std::shared_ptr<Node> node1 = std::make_shared<Node>();
    std::shared_ptr<Node> node2 = std::make_shared<Node>();

    node1->next = node2;
    node2->prev = node1;

    return 0;
}
```

输出

```shell
Node
Node
~Node
~Node
```
