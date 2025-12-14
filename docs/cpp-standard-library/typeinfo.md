# typeinfo

运行时类型识别（RTTI，Run-Time Type Identification）功能


`<typeinfo>` 相关的主要语法：

- typeid 运算符：用于获取对象的类型信息。
- type_info 类：包含类型信息的类。

std::type_info 类

```cpp
std::type_info 类是 typeinfo 头文件的核心类，用于描述一个类型。它提供了多个成员函数用于查询类型的信息。常用成员函数如下：

const char* name() const noexcept; 返回一个指向类型名称的 C 字符串指针。注意，这个名称不一定是人类可读的类型名，其格式由编译器实现决定。

bool before(const std::type_info& rhs) const noexcept; 按照某种顺序比较两个 type_info 对象，返回当前对象是否在 rhs 之前。

bool operator==(const std::type_info& rhs) const noexcept; 比较两个 type_info 对象是否表示相同的类型。

bool operator!=(const std::type_info& rhs) const noexcept; 比较两个 type_info 对象是否表示不同的类型。
```

typeid 运算符

```cpp
typeid 运算符用于在运行时获取类型信息。typeid 可以作用于对象（带有多态行为的指针或引用）或类型（无需实例化对象）。

typeid(object)：返回一个 std::type_info 对象，表示 object 的动态类型。如果 object 是一个多态类型（即包含虚函数），则 typeid 会返回该对象的实际类型。

typeid(T)：返回一个 std::type_info 对象，表示类型 T。
```

注意事项

- RTTI 功能依赖于编译器的实现，因此 typeid 运算符返回的类型名称可能因编译器而异。
- 使用 RTTI 可能会对程序性能产生一定影响，因为它需要在运行时进行类型检查。
- RTTI 只适用于多态类型，即具有虚函数的类。

示例

```cpp
#include <iostream>
#include <type_traits>

class Base
{
public:
    virtual void show()
    {
        std::cout << "Base show" << std::endl;
    }
};

class Child : public Base
{
public:
    void show() override
    {
        std::cout << "Child show" << std::endl;
    }
};

int main(int argc, char const *argv[])
{
    Base *base = new Base();
    Base *child = new Child();

    std::cout << typeid(*base).name() << std::endl;
    // P4Base
    std::cout << typeid(*child).name() << std::endl;
    // 5Child

    std::cout << std::boolalpha << (typeid(*base) == typeid(Base)) << std::endl;
    // true
    std::cout << std::boolalpha << (typeid(*child) == typeid(Base)) << std::endl;
    // false

    std::cout << std::boolalpha << (typeid(*base) == typeid(Child)) << std::endl;
    // false
    std::cout << std::boolalpha << (typeid(*child) == typeid(Child)) << std::endl;
    // true

    delete base;
    delete child;

    return 0;
}

```

输出结果

```shell
4Base
5Child
true
false
false
true
```
