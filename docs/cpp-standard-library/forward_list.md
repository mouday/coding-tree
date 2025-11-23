# forward_list

单向链表的数据结构

特点

1. `std::forward_list` 是单向链表，只能从前往后遍历，不能反向遍历。
2. 由于其单向链表的结构，插入和删除操作在已知位置的情况下非常高效（O(1) 复杂度）。

常用成员函数

函数名称 | 功能描述
| - | -
`void push_front(const T& value)` | 在列表的前端插入一个元素。
`void pop_front()` | 移除列表前端的元素。
`iterator before_begin()` | 返回指向列表前端之前的迭代器。
`iterator begin()` | 返回指向列表前端的迭代器。
`iterator end()` | 返回指向列表末尾的迭代器。

示例

```cpp
#include <forward_list>
#include <iostream>

int main(int argc, char const *argv[])
{
    std::forward_list<int> lst = {3, 2, 1, 4, 5}; 

    // 遍历元素
    for (const auto &val  | lst)
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
