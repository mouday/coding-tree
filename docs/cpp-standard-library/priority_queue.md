# priority_queue

优先队列

队列的顶部元素总是具有最大的值

常用操作

函数名称 | 功能描述
| - | -
`empty()` | 检查队列是否为空。
`size()` | 返回队列中的元素数量。
`top()` | 返回队列顶部的元素（不删除它）。
`push()` | 向队列添加一个元素。
`pop()` | 移除队列顶部的元素。

构造函数

```cpp
template <class _Tp, 
    class _Container = vector<_Tp>,
    class _Compare = less<typename _Container::value_type> >
class  priority_queue{}
```

示例

```cpp
#include <queue>
#include <iostream>

int main(int argc, char const *argv[])
{
    std::priority_queue<int> queue;

    queue.push(10);
    queue.push(20);
    queue.push(30);

    // 遍历元素
    while (!queue.empty())
    {
        int val = queue.top();
        queue.pop();
        std::cout << val << " ";
    }
    std::cout << std::endl;
    return 0;
}
```

输出

```shell
30 20 10 
```

## 自定义比较函数

```cpp
#include <queue>
#include <vector>
#include <iostream>

struct compare {
    bool operator()(int a, int b) {
        return a > b; // 定义最小堆
    }
};

int main(int argc, char const *argv[])
{
    std::priority_queue<int, std::vector<int>, compare> queue;

    queue.push(10);
    queue.push(20);
    queue.push(30);

    // 遍历元素
    while (!queue.empty())
    {
        int val = queue.top();
        queue.pop();
        std::cout << val << " ";
    }
    std::cout << std::endl;
    return 0;
}

```

输出

```shell
10 20 30 
```