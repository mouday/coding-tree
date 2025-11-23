# unordered_set

哈希表的容器，不保证元素的排序

常用操作

函数名称 | 功能描述
| - | -
`insert(元素)` | 插入一个元素。
`erase(元素)` | 删除一个元素。
`find(元素)` | 查找一个元素。
`size()` | 返回容器中元素的数量。
`empty()` | 检查容器是否为空。
`clear()` | 清空容器

## 基本示例

示例

```cpp
#include <unordered_set>
#include <iostream>

int main(int argc, char const *argv[])
{
    std::unordered_set<int> set;

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
3 2 1
```

## 数据查找

示例

```cpp
#include <unordered_set>
#include <iostream>


int main(int argc, char const *argv[])
{
    std::unordered_set<int> set = {1, 2, 3};
    
    std::unordered_set<int>::iterator find_result = set.find(2);
    
    if (find_result != set.end()){
        std::cout << "found " << std::endl;
    } else{
        std::cout << "not found"  << std::endl;
    }
    
    return 0;
}
```

输出

```shell
found 
```
