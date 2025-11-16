# array

`C++11`引入

`std::array` 模板类提供了一个固定大小的数组，其大小在编译时确定，并且不允许动态改变。

特点

- 类型安全：`std::array` 强制类型检查，避免了 C 语言数组的类型不安全问题。
- 固定大小：数组的大小在编译时确定，不能在运行时改变。
- 内存连续：`std::array` 的元素在内存中是连续存储的，这使得它可以高效地访问元素。
- 标准容器：`std::array` 提供了与 `std::vector` 类似的接口，如 `size()`, `at()`, `front()`, `back()` 等。

常用成员函数

|函数 | 说明
| -  | -
at(size_t pos) | 返回指定位置的元素，带边界检查
operator[] | 返回指定位置的元素，不带边界检查
front() | 返回数组的第一个元素
back() | 返回数组的最后一个元素
data() | 返回指向数组数据的指针
size() | 返回数组大小（固定不变）
fill(const T& value) | 将数组所有元素设置为指定值
swap(array& other) | 交换两个数组的内容
begin() | 返回数组的起始迭代器
end() | 返回数组的结束迭代器

与其他数组类型对比

|特性  | std::array  | C 风格数组 |   std::vector
|-|-|-|-|
大小  | 编译时固定  | 编译时固定 |动态可变
边界检查|  at() 提供边界检查 |无  |at() 提供边界检查
内存管理  |栈上分配  |栈上分配|  堆上分配
性能  |高效  | 高效  |较低（动态分配）
接口  |支持 STL 标准接口  |不支持 STL 标准接口| 支持 STL 标准接口

实现

```cpp
#include <array>

/**
 * T 是数组中元素的类型。
 * Size 是数组的大小，必须是一个非负整数。
 */
template <class T, size_t Size>
struct array {
    void fill(const value_type& u);
    void swap(array& a)

    // iterators:
    iterator begin()
    iterator end()
    reverse_iterator rbegin()
    reverse_iterator rend()

    // capacity:
    size_type size()
    size_type max_size()
    bool empty()

    // element access:
    reference operator[](size_type n)
    reference at(size_type __n)
    reference front()
    reference back()
    value_type* data()
}
```

## 元素遍历

示例

```cpp
#include <array>
#include <iostream>

int main(int argc, char const *argv[])
{
    std::array<int, 5> arr = {1, 2, 3, 4, 5};

    // 传统 for 循环
    for (int i = 0; i < arr.size(); i++)
    {
        std::cout << arr[i] << " ";
    }
    std::cout << std::endl;

    // bedin() 和 end()
    for (auto it = arr.begin(); it != arr.end(); ++it)
    {
        std::cout << *it << " ";
    }
    std::cout << std::endl;

    // for-each 循环
    for (const auto &val : arr)
    {
        std::cout << val << " ";
    }
    std::cout << std::endl;
    return 0;
}
```

输出

```shell
# g++ -std=c++11 array.cpp -o array && ./array
1 2 3 4 5 
1 2 3 4 5 
1 2 3 4 5 
```

## 元素访问`at/[]`

示例

```cpp
#include <array>
#include <iostream>

int main(int argc, char const *argv[])
{
    std::array<int, 5> arr = {1, 2, 3, 4, 5};

    // 越界访问
    std::cout << arr[100] << std::endl;

    // 边界检查
    try
    {
        std::cout << arr.at(100) << " ";
    }
    catch (const std::out_of_range &e)
    {
        std::cerr << "Out of range error: " << e.what() << std::endl;
    }
    return 0;
}
```

输出

```cpp
16777220
Out of range error: array::at
```

## 元素填充fill

```cpp
#include <array>
#include <iostream>

int main(int argc, char const *argv[])
{
    std::array<int, 5> arr;
    arr.fill(0);

    for (const auto& val : arr)
    {
        std::cout << val << " ";
    }
    std::cout << std::endl;
    return 0;
}
```

输出

```shell
0 0 0 0 0 
```

## 元素交换swap

```cpp
#include <array>
#include <iostream>

int main(int argc, char const *argv[])
{
    std::array<int, 5> arr1 = {1, 2, 3, 4, 5};
    std::array<int, 5> arr2 = {6, 7, 8, 9, 10};
    arr1.swap(arr2);

    std::cout << "arr1 after swap: ";
    for (const auto &val : arr1)
    {
        std::cout << val << " ";
    }
    std::cout << std::endl;

    std::cout << "arr2 after swap: ";
    for (const auto &val : arr2)
    {
        std::cout << val << " ";
    }
    std::cout << std::endl;

    return 0;
}

```

输出

```shell
arr1 after swap: 6 7 8 9 10 
arr2 after swap: 1 2 3 4 5 
```

## 元素修改

```cpp
#include <array>
#include <iostream>

int main(int argc, char const *argv[])
{
    std::array<int, 5> arr = {1, 2, 3, 4, 5};
    
    // at修改
    arr.at(1) = 10;

    // 下标修改
    arr[2] = 20;
    
    for (const auto &val : arr)
    {
        std::cout << val << " ";
    }
    std::cout << std::endl;

    return 0;
}
```

输出

```shell
1 10 20 4 5 
```
