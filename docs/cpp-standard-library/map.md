# map

存储键值对（key-value pairs）

定义和特性

- 键值对：map 存储的是键值对，其中每个键都是唯一的。
- 排序：map 中的元素按照键的顺序自动排序，通常是升序。
- 唯一性：每个键在 map 中只能出现一次。
- 双向迭代器：map 提供了双向迭代器，可以向前和向后遍历元素。

基本用法

```cpp
// 声明 map 容器:
// key_type 是键的类型。
// value_type 是值的类型。
std::map<key_type, value_type> map;

// 插入元素:
map[key] = value;

// 访问元素:
value = map[key];

// 遍历 map:
for (std::map<key_type, value_type>::iterator it = map.begin(); it != map.end(); ++it) {
    std::cout << it->first << " => " << it->second << std::endl;
}

// C++11 及以上标准，遍历部分可以简化为范围 for 循环，代码更简洁：
for (auto &p : m) {
    std::cout << p.first << " : " << p.second << std::endl;
}

// 检查键是否存在:
if (myMap.find(key) != myMap.end()) {
    // 键存在
}

// 删除元素:
myMap.erase(key);

// 清空 map:
myMap.clear();

// 获取 map 的大小:
size_t size = myMap.size();

// 是否为空
myMap.empty();

// key 是否存在（返回 0 或 1）
myMap.count("Bob"); 
```

示例

```cpp

#include <map>
#include <iostream>

int main(int argc, char const *argv[])
{
    std::map<std::string, int> map;

    map["Alice"] = 30;
    map["Bob"] = 25;
    map["Charlie"] = 35;

    for (std::map<std::string, int>::iterator it = map.begin(); it != map.end(); ++it)
    {
        std::cout << it->first << " => " << it->second << std::endl;
    }

    return 0;
}
```

输出

```shell
Alice => 30
Bob => 25
Charlie => 35
```
