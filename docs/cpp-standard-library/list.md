# list

双向链表

特点

- 双向迭代：`<list>` 提供了双向迭代器，可以向前和向后遍历元素。
- 动态大小：与数组不同，`<list>` 的大小可以动态变化，不需要预先分配固定大小的内存。
- 快速插入和删除：可以在列表的任何位置快速插入或删除元素，而不需要像向量那样移动大量元素。

与其他容器对比

特性  | `std::list` | `std::vector` | `std::deque`
特性  | - | - | -
内存结构 |  非连续内存，双向链表  | 连续内存 |  分段连续内存
访问性能 |  顺序访问较快，随机访问慢 |  随机访问快 | 末尾和头部访问都快
插入/删除性能 | 任意位置插入、删除快  |末尾插入快，中间位置慢 | 头尾插入、删除快
适用场景 |  频繁在中间插入/删除  需要高效随机访问 |  需要在头尾快速插入/删除
迭代器稳定性  | 稳定，元素插入或删除不会失效 | 插入、删除可能导致迭代器失效  | 插入、删除可能导致迭代器失效

## 常用成员函数

| 函数  | 说明
| - | -
| `push_back(const T& val)` | 在链表末尾添加元素
| `push_front(const T& val)`  |  在链表头部添加元素
| `pop_back()`  | 删除链表末尾的元素
| `pop_front()` | 删除链表头部的元素
| `insert(iterator pos, val)`  | 在指定位置插入元素
| `erase(iterator pos)` | 删除指定位置的元素
| `clear()` | 清空所有元素
| `size()`  | 返回链表中的元素数量
| `empty()` | 检查链表是否为空
| `front()` | 返回链表第一个元素
| `back()`  | 返回链表最后一个元素
| `remove(const T& val)`  |  删除所有等于指定值的元素
| `sort()` |  对链表中的元素进行排序
| `merge(list& other)` | 合并另一个已排序的链表
| `reverse()`   |反转链表
| `begin()`  |返回链表的起始迭代器
| `begin()` |返回链表的结束迭代器

## 初始化

```cpp
#include <list>

std::list<int> lst; // 创建一个空的list
std::list<int> lst(5); // 创建一个包含5个默认初始化整数的list
std::list<int> lst(5, 10); // 创建一个包含5个整数，值均为10的list
std::list<int> lst = {1, 2, 3, 4, 5}; // 使用初始化列表创建list
```

## sort排序

```cpp
#include <list>
#include <iostream>

int main(int argc, char const *argv[])
{
    std::list<int> lst = {3, 2, 1, 4, 5}; // 使用初始化列表创建list

    lst.sort();   // 排序

    // 遍历元素
    for (const auto &val : lst)
    {
        std::cout << val << " ";
    }
    std::cout << std::endl;
    return 0;
}
```

输出

```bash
1 2 3 4 5 
```