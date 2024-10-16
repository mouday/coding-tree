# unordered_map

基于哈希表的键值对容器

## insert

插入元素

```cpp
#include <iostream>
#include <unordered_map>

int main() {
    std::unordered_map<std::string, std::string> map;

    map.insert({"red", "红色"});

    for(const std::pair<const std::string, std::string>& entity : map) {
        std::cout << entity.first << ": " << entity.second << std::endl;
    }
    // red: 红色
}

```

## erase

擦除元素

```cpp
#include <iostream>
#include <unordered_map>

int main() {
    std::unordered_map<std::string, std::string> map= {
        {"red", "红色"},
        {"green", "绿色"},
        {"blue", "蓝色"},
    };

    map.erase("red");

    for(const std::pair<const std::string, std::string>& entity : map) {
        std::cout << entity.first << ": " << entity.second << std::endl;
    }
   // blue: 蓝色
   // green: 绿色
}

```

## clear

清除内容

```cpp
#include <iostream>
#include <unordered_map>

int main() {
    std::unordered_map<std::string, std::string> map= {
        {"red", "红色"},
        {"green", "绿色"},
        {"blue", "蓝色"},
    };

    map.clear();

    for(const std::pair<const std::string, std::string>& entity : map) {
        std::cout << entity.first << ": " << entity.second << std::endl;
    }
}

```

## 取值

```cpp
#include <iostream>
#include <unordered_map>

int main() {
    std::unordered_map<std::string,std::string> map = {
        {"red", "红色"},
        {"green", "绿色"},
        {"blue", "蓝色"},
    };

    // 取值
    std::string value1 = map.at("red");
    std::cout << value1 << std::endl; // 红色

    // 取值
    std::string value2 = map["blue"];
    std::cout << value2 << std::endl; // 蓝色
}

```

## for-in

```cpp
#include <iostream>
#include <unordered_map>

int main() {
    std::unordered_map<std::string,std::string> map = {
        {"red", "红色"},
        {"green", "绿色"},
        {"blue", "蓝色"},
    };

    for(const std::pair<const std::string, std::string>& entity : map) {
        std::cout << entity.first << ": " << entity.second << std::endl;
    }
}

```

## find

寻找带有特定键的元素

```cpp
#include <iostream>
#include <unordered_map>

int main() {
    std::unordered_map<std::string, std::string> map = {
        {"red", "红色"},
        {"green", "绿色"},
        {"blue", "蓝色"},
    };

    auto iterator = map.find("red");

    if (iterator != map.end()) {
        std::cout << iterator->first << ": " << iterator->second << std::endl;
    }
    // red: 红色
}

```

## 成员检查

`map.count`

```cpp
#include <iostream>
#include <unordered_map>

int main() {
    std::unordered_map<std::string, std::string> map= {
        {"red", "红色"},
        {"green", "绿色"},
        {"blue", "蓝色"},
    };

    // 查询 red
    if(map.count("red")) {
        std::cout << "存在" << std::endl;
    } else {
        std::cout << "不存在" << std::endl;
    }
    // 存在

    // 查询 yellow
    if(map.count("yellow")) {
        std::cout << "存在" << std::endl;
    } else {
        std::cout << "不存在" << std::endl;
    }
    // 不存在
}
```

`map.find`

```cpp
#include <iostream>
#include <unordered_map>

int main() {
    std::unordered_map<std::string, std::string> map = {
        {"red", "红色"},
        {"green", "绿色"},
        {"blue", "蓝色"},
    };

    if (map.find("red") != map.end()) {
        std::cout << "存在" << std::endl;
    }
    // 输出: 存在

    return 0;
}
```
## ref

https://www.runoob.com/cplusplus/cpp-libs-unordered_map.html

https://zh.cppreference.com/w/cpp/container/unordered_map