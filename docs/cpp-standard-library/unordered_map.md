# unordered_map

基于哈希表的键值对容器

unordered_map 不保证元素的排序，但通常提供更快的查找速度

基本语法：

```cpp
#include <unordered_map>

// key_type 是键的类型。
// value_type 是值的类型。
std::unordered_map<key_type, value_type> map_name;
```

构造函数

```cpp
// 默认构造
std::unordered_map<int, std::string> myMap;

// 构造并初始化
std::unordered_map<int, std::string> myMap = {{1, "one"}, {2, "two"}};

// 构造并指定初始容量
std::unordered_map<int, std::string> myMap(10);

// 构造并复制另一个 unordered_map
std::unordered_map<int, std::string> anotherMap = myMap;
```

基本操作

```cpp
// 插入元素:
myMap.insert({3, "three"});

// 访问元素:
std::string value = myMap[1]; // 获取键为1的值

// 删除元素:
myMap.erase(1); // 删除键为1的元素

// 查找元素:
auto it = myMap.find(2); // 查找键为2的元素
if (it != myMap.end()) {
    std::cout << "Found: " << it->second << std::endl;
}
```

示例

```cpp

#include <unordered_map>
#include <iostream>

int main(int argc, char const *argv[])
{
    std::unordered_map<std::string, int> map;

    map["Alice"] = 30;
    map["Bob"] = 25;
    map["Charlie"] = 35;

    for (std::unordered_map<std::string, int>::iterator it = map.begin();
         it != map.end(); ++it)
    {
        std::cout << it->first << " => " << it->second << std::endl;
    }

    return 0;
}

```

输出

```shell
Charlie => 35
Bob => 25
Alice => 30
```
