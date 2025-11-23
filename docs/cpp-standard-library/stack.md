# stack

栈，后进先出（LIFO，Last In First Out）

只允许在一端（栈顶）进行添加和移除操作。

基本操作

函数名称 | 功能描述
| - | -
`push()` | 在栈顶添加一个元素。
`pop()`| 移除栈顶元素。
`top()` | 返回栈顶元素的引用，但不移除它。
`empty()` | 检查栈是否为空。
`size()` | 返回栈中元素的数量。

示例

```cpp
#include <stack>
#include <iostream>

int main(int argc, char const *argv[])
{
    std::stack<int> stack;

    stack.push(10);
    stack.push(20);
    stack.push(30);

    // 遍历元素
    while (!stack.empty())
    {
        int val = stack.top();
        stack.pop();
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