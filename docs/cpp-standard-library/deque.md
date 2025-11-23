# deque

双端队列（double-ended queue）动态数组

## 常用操作

函数名称 | 功能描述
| - | -
`deque()` | 默认构造函数，创建一个空的 deque 容器。
`deque(size_type n)` | 创建一个包含 n 个默认值元素的 deque 容器。
`deque(size_type n, const T& value)` | 创建一个包含 n 个值为 value 的 deque 容器。
`deque(initializer_list<T> il)` | 使用初始化列表 il 构造 deque 容器。
`operator=` | 赋值操作符，赋值给 deque 容器。
`assign()` | 用新值替换 deque 容器中的所有元素。
`at(size_type pos)` | 返回 pos 位置的元素，并进行范围检查。
`operator[](size_type pos)` | 返回 pos 位置的元素，不进行范围检查。
`front()` | 返回第一个元素的引用。
`back()` | 返回最后一个元素的引用。
`begin()` | 返回指向第一个元素的迭代器。
`end()` | 返回指向末尾元素后一位置的迭代器。
`rbegin()` | 返回指向最后一个元素的逆向迭代器。
`rend()` | 返回指向第一个元素之前位置的逆向迭代器。
`empty()` | 检查容器是否为空。
`size()` | 返回容器中的元素个数。
`max_size()` | 返回容器可容纳的最大元素个数。
`clear()` | 清除容器中的所有元素。
`insert(iterator pos, const T& value)` | 在 pos 位置插入 value 元素。
`erase(iterator pos)` | 移除 pos 位置的元素。
`push_back(const T& value)` | 在容器末尾添加 value 元素。
`pop_back()` | 移除容器末尾的元素。
`push_front(const T& value)` | 在容器前端添加 value 元素。
`pop_front()` | 移除容器前端的元素。
`resize(size_type count)` | 调整容器大小为 count，多出部分用默认值填充。
`swap(deque& other)` | 交换两个 deque 容器的内容。
`get_allocator()` | 返回一个用于构造双端队列的分配器对象的副本。

## 示例

```cpp
#include <deque>
#include <iostream>

int main(int argc, char const *argv[])
{
    std::deque<int> lst = {3, 2, 1, 4, 5}; 

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

```shell
3 2 1 4 5 
```
