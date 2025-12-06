# set

元素唯一

头文件

```cpp
#include <set>
```

常用操作

函数名称 | 功能描述
| - | -
`insert(元素)` | 插入一个元素。
`erase(元素)` | 删除一个元素。
`find(元素)` | 查找一个元素。
`size()` | 返回容器中元素的数量。
`empty()` | 检查容器是否为空。

示例

```cpp
#include <set>
#include <iostream>

int main(int argc, char const *argv[])
{
    std::set<int> set;

    set.insert(1);
    set.insert(2);
    set.insert(3);
    set.insert(3);

    // 遍历元素
    for(int val : set)
    {
        std::cout << val << " ";
    }
    std::cout << std::endl;
    return 0;
}

```

输出

```shell
1 2 3 
```
