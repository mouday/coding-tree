# queue

队列（Queue）,先进先出（FIFO, First In First Out）

头文件

```cpp
#include <queue>
```

在一端添加元素（称为队尾），并在另一端移除元素（称为队首）

常用操作

函数名称 | 功能描述
| - | -
`empty()` | 检查队列是否为空
`size()` | 返回队列中的元素数量
`front()` | 返回队首元素的引用
`back()` | 返回队尾元素的引用
`push()` | 在队尾添加一个元素
`pop()` | 移除队首元素

示例

```cpp
#include <queue>
#include <iostream>

int main(int argc, char const *argv[])
{
    std::queue<int> queue;

    queue.push(10);
    queue.push(20);
    queue.push(30);

    // 遍历元素
    while (!queue.empty())
    {
        int val = queue.front();
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
