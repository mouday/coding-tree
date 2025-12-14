# utility

实用的工具类和函数

组件/函数 | 用途 | 使用场景
|-|-|-
std::pair | 存储两个相关值 | 函数返回多个值、map 元素
std::make_pair | 便捷创建 pair | 模板类型推导、简化代码
std::swap | 交换两个值 | 算法实现、排序操作
std::move | 启用移动语义 | 资源管理、性能优化
std::forward | 完美转发 | 通用引用、模板编程

## std::pair

键值对容器

基本语法

```cpp
#include <utility>

// 创建 pair 对象的基本方式
std::pair<类型1, 类型2> 变量名(值1, 值2);
```

示例

```cpp
#include <iostream>
#include <utility>
#include <string>

int main() {
    // 方式1：直接初始化
    std::pair<int, std::string> student1(101, "Alice");
    
    // 方式2：使用 make_pair 函数（推荐）
    auto student2 = std::make_pair(102, "Bob");
    
    // 方式3：C++17 起支持的推导指引
    std::pair student3(103, "Charlie");
    
    // 访问 pair 的成员
    std::cout << "学号: " << student1.first << ", 姓名: " << student1.second << std::endl;
    
    return 0;
}
```

## std::make_pair

便捷创建函数

std::make_pair 是一个模板函数，可以自动推导类型，简化 pair 的创建过程。

示例

```cpp
#include <iostream>
#include <utility>
#include <string>

int main()
{
    auto student = std::make_pair(102, "Bob");

    std::cout << "id: " << student.first
              << " name: " << student.second << std::endl;

    return 0;
}
```

输出结果

```shell
id: 102 name: Bob
```

## std::tie

成员取值

```cpp
#include <iostream>
#include <utility>
#include <string>

int main() {
    // 使用 make_pair 函数
    auto student = std::make_pair(102, "Bob");
    
    // C++11 起支持的逐成员赋值
    int id;
    std::string name;
    std::tie(id, name) = student;

    // C++17 结构化绑定（更简洁）
    auto [id, name] = student;

    std::cout << "id: " << id << " name: " << name << std::endl;
    
    return 0;
}
```

输出结果

```shell
id: 102 name: Bob
```

## std::swap

交换两个值

```cpp
#include <iostream>
#include <utility>

int main()
{
    int a = 10, b = 20;

    std::swap(a, b);

    std::cout << "a: " << a
              << " b: " << b << std::endl;

    return 0;
}
```

输出结果

```shell
a: 20 b: 10
```

## std::move

移动语义支持

std::move 用于将对象转换为右值引用，启用移动语义。

示例

```cpp
#include <iostream>
#include <utility>

class Node
{
private:
    int m_data;

public:
    // 有参构造
    Node(int data) : m_data(data)
    {
        std::cout << "Node" << std::endl;
    }
    // 拷贝构造函数
    Node(const Node &other) noexcept
    {
        this->m_data = other.m_data;
        std::cout << "Node&" << std::endl;
    }

    // 移动构造函数
    Node(Node &&other) noexcept
    {
        if (this != &other)
        {
            // 窃取资源
            this->m_data = other.m_data;
            // 使源对象处于有效但未定义状态
            other.m_data = 0;
        }
        std::cout << "Node&&" << std::endl;
    }

    // 移动赋值运算符
    Node &operator=(Node &&other) noexcept
    {
        if (this != &other)
        {
            // 窃取资源
            this->m_data = other.m_data;
            // 使源对象处于有效但未定义状态
            other.m_data = 0;
        }

        std::cout << "=Node&&" << std::endl;
        return *this;
    }
    // 析构函数
    ~Node()
    {
        std::cout << "~Node" << std::endl;
    }

    int get_data()
    {
        return this->m_data;
    }
};

int main()
{
    Node node1(10);
    Node node2(20);

    // 移动构造
    Node node3 = std::move(node1);

    // 移动赋值
    Node node4(0);
    node4 = std::move(node2);

    std::cout << "node1->m_data: " << node1.get_data() << std::endl;
    std::cout << "node2->m_data: " << node2.get_data() << std::endl;
    std::cout << "node3->m_data: " << node3.get_data() << std::endl;
    std::cout << "node4->m_data: " << node4.get_data() << std::endl;

    return 0;
}
```

输出结果

```shell
Node
Node
Node&&
Node
=Node&&
node1->m_data: 0
node2->m_data: 0
node3->m_data: 10
node4->m_data: 20
~Node
~Node
~Node
~Node
```

## std::forward

完美转发

std::forward 用于实现完美转发，保持参数的值类别。

示例

```cpp
#include <utility>
#include <iostream>

// 普通函数 - 不能保持值类别
template<typename T>
void normalFunction(T arg) {
    std::cout << "普通函数参数" << std::endl;
}

// 使用完美转发的函数
template<typename T>
void perfectForwardingFunction(T&& arg) {
    // 保持参数原有的值类别（左值或右值）
    normalFunction<T>(std::forward<T>(arg));
}

int main() {
    int x = 10;

    // 传递左值
    perfectForwardingFunction(x);

    // 传递右值
    perfectForwardingFunction<int>(20);

    return 0;
}
```

输出结果

```shell
普通函数参数
普通函数参数
```

## std::make_integer_sequence

C++14 引入

std::make_integer_sequence：用于生成一个从0到N-1的整数序列。
