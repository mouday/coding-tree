# vector

动态数组

## 常用成员函数

| 函数  | 说明
|-|-
| `push_back(const T& val)` |在末尾添加元素
| `pop_back()`  |删除末尾元素
| `at(size_t pos)` | 返回指定位置的元素，带边界检查
| `operator[]`  |返回指定位置的元素，不带边界检查
| `front()` |返回第一个元素
| `back()`  |返回最后一个元素
| `data()`  |返回指向底层数组的指针
| `size()`  |返回当前元素数量
| `capacity()`  |返回当前分配的容量
| `reserve(size_t n)`   |预留至少 n 个元素的存储空间
| `resize(size_t n)`   |将元素数量调整为 n
| `clear()` | 清空所有元素
| `insert(iterator pos, val)`  | 在指定位置插入元素
| `erase(iterator pos)` |删除指定位置的元素
| `begin()` |返回起始迭代器
| `end()` | 返回结束迭代器

## 容器对比

特性 | `std::vector` | `std::array`| `std::list`
|-| - | - |
大小 |动态可变 |编译时固定 |动态可变
存储位置 |连续内存 |连续内存 |非连续内存
访问性能 |随机访问快速| 随机访问快速 |随机访问慢，适合顺序访问
插入和删除性能 |末尾操作性能高，其他位置较慢 |不支持 | 任意位置插入和删除较快
内存增长方式 |容量不足时成倍增长 |无 |无

实现接口

```cpp
template <class _Tp, class _Allocator /* = allocator<_Tp> */>
class vector
{
    vector();
    explicit vector(size_type n);
    explicit vector(size_type n, const value_type& x);
    vector(size_type n, const value_type& x, const allocator_type& a);
    vector(initializer_list<value_type> il);
    vector(vector&& x);

    ~vector();

    iterator begin() noexcept;
    size_type size() const;
    size_type capacity() const;
    bool empty() const;
    reference at(size_type n);
    reference operator[](size_type n)
    reference  front()
    reference  back()
    value_type*  data()
    reference emplace_back(Args&&... args);
    void pop_back();
    iterator insert(const_iterator position, value_type&& x);
    iterator emplace(const_iterator position, Args&&... args);
    void clear() noexcept;
    void push_back(const_reference x)
    void swap(vector&);
    iterator erase(const_iterator position);
    void resize(size_type sz);
}
```

初始化

```cpp
#include <vector>

std::vector<int> vec; // 创建一个空的整数向量
std::vector<int> vec(5); // 创建一个包含5个默认初始化整数的向量
std::vector<int> vec(5, 10); // 创建一个包含5个整数，值均为10的向量
std::vector<int> vec = {1, 2, 3, 4, 5}; // 使用初始化列表创建向量
```

示例

```cpp
#include <vector>
#include <iostream>

int main(int argc, char const *argv[])
{
    std::vector<int> vec = {1, 2, 3, 4, 5};

    // 遍历元素
    for (const auto &val : vec)
    {
        std::cout << val << " ";
    }
    std::cout << std::endl;

    // 添加元素
    vec.push_back(6);

    // 修改元素
    vec[0] = 10;

    // 移除元素
    vec.pop_back();

    // 获取大小
    std::cout << "Size: " << vec.size() << std::endl;

    // 检查是否为空
    std::cout << "Is empty: "
              << (vec.empty() ? "Yes" : "No")
              << std::endl;

    // 访问元素
    std::cout << "First element: " << vec.front() << std::endl;
    std::cout << "Last element: " << vec.back() << std::endl;

    // 获取容量
    std::cout << "Capacity: " << vec.capacity() << std::endl;

    // 清空向量
    vec.clear();

    // 检查清空后是否为空
    std::cout << "Is empty after clear: "
              << (vec.empty() ? "Yes " : "No")
              << std::endl;

    return 0;
}
```

输出

```shell
1 2 3 4 5 
Size: 5
Is empty: No
First element: 10
Last element: 5
Capacity: 10
Is empty after clear: Yes 
```
