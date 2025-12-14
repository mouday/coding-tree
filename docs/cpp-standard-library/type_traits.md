# type_traits

编译时检查类型特性的工具

语法

```cpp
std::is_integral<T>::value
```

```cpp
// 基本类型判断：
std::is_void<T>: 判断类型 T 是否为 void。
std::is_integral<T>: 判断类型 T 是否为整型。
std::is_floating_point<T>: 判断类型 T 是否为浮点型。
std::is_array<T>: 判断类型 T 是否为数组类型。
std::is_pointer<T>: 判断类型 T 是否为指针类型。
std::is_reference<T>: 判断类型 T 是否为引用类型。
std::is_const<T>: 判断类型 T 是否为 const 修饰。


// 类型修饰：
std::remove_const<T>: 移除类型 T 的 const 修饰。
std::remove_volatile<T>: 移除类型 T 的 volatile 修饰。
std::remove_cv<T>: 同时移除类型 T 的 const 和 volatile 修饰。
std::remove_reference<T>: 移除类型 T 的引用修饰。
std::remove_pointer<T>: 移除类型 T 的指针修饰。

// 类型转换：
std::add_const<T>: 为类型 T 添加 const 修饰。
std::add_volatile<T>: 为类型 T 添加 volatile 修饰。
std::add_cv<T>: 同时为类型 T 添加 const 和 volatile 修饰。
std::add_pointer<T>: 为类型 T 添加指针修饰。
std::add_lvalue_reference<T>: 为类型 T 添加左值引用修饰。
std::add_rvalue_reference<T>: 为类型 T 添加右值引用修饰。

// 类型特性检测：
std::is_same<T, U>: 判断类型 T 和 U 是否相同。
std::is_base_of<Base, Derived>: 判断类型 Base 是否为类型 Derived 的基类。
std::is_convertible<From, To>: 判断类型 From 是否能转换为类型 To。

// 条件类型：
std::conditional<Condition, T, F>: 如果 Condition 为 true，则类型为 T，否则为 F。
std::enable_if<Condition, T>: 如果 Condition 为 true，则类型为 T，否则此模板不参与重载决议。
```

示例1

```cpp
#include <iostream>
#include <type_traits>

int main(int argc, char const *argv[])
{
    std::cout << std::is_integral<int>::value << std::endl;
    return 0;
}

```

输出结果

```shell
1
```
