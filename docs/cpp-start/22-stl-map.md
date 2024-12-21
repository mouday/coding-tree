# map/ multimap容器

通用的工具 cpputil

```cpp
/**
* cpputil.h
*/

#ifndef CPPUTIL_H
#define CPPUTIL_H

#include <sstream>
#include <map>

template<typename K, typename V>
std::string toString(std::map<K, V> const &m);

#endif // CPPUTIL_H
```

```cpp
/**
* cpputil.cpp
*/

#include "cpputil.h"
#include <map>
#include <string>
#include <sstream>


/**
 * map 转 string
 */
template<typename K, typename V>
std::string toString(std::map<K, V> const &m) {
    std::stringstream ss;

    ss << "{\n";
    for (const std::pair<K, V> &pair: m) {
        ss << "  " << pair.first << ": " << pair.second << "\n";
    }

    ss << "}";
    return ss.str();
}

template std::string toString<int, int>(std::map<int, int> const &m);

template std::string toString<std::string, std::string>(std::map<std::string, std::string> const &m);

```

## 1 map基本概念

简介：

- map中所有元素都是pair
- pair中第一个元素为key（键值），起到索引作用，第二个元素为value（实值）
- 所有元素都会根据元素的键值自动排序

本质：

- map/multimap属于关联式容器，底层结构是用二叉树实现。

优点：

- 可以根据key值快速找到value值

map和multimap区别：

- map不允许容器中有重复key值元素
- multimap允许容器中有重复key值元素

## 2 map构造和赋值

功能描述：

- 对map容器进行构造和赋值操作

函数原型：

```cpp
// 构造：
map<T1, T2> mp; //map默认构造函数:
map(const map &mp); //拷贝构造函数

// 赋值：
map& operator=(const map &mp); //重载等号操作符
```

总结：map中所有元素都是成对出现，插入数据时候要使用对组

示例：

```cpp
#include <iostream>
#include <list>
#include <map>
#include <string>
#include "cpputil.h"

using namespace std;


void test01() {
    map<string, string> m; //默认构造
    m.insert(pair<string, string>("name", "Tom"));
    m.insert(pair<string, string>("age", "20"));
    m.insert(pair<string, string>("school", "PKU"));
 
    cout << toString(m) << endl;

    map<string, string> m2(m); //拷贝构造
    cout << toString(m2) << endl;

    map<string, string> m3;
    m3 = m2; //赋值
    cout << toString(m3) << endl;
}

int main() {
    test01();

    return 0;
}

```

输出

```cpp
{
  age: 20
  name: Tom
  school: PKU
}
{
  age: 20
  name: Tom
  school: PKU
}
{
  age: 20
  name: Tom
  school: PKU
}
```

还可以直接初始化map

```cpp
map<string, string> m = {
    {"name", "Tom"},
    {"age", "20"},
    {"school", "PKU"},
};
```

## 3 map大小和交换

功能描述：

统计map容器大小以及交换map容器

函数原型：

```cpp
size(); //返回容器中元素的数目
empty(); //判断容器是否为空
swap(st); //交换两个集合容器
```

总结：

- 统计大小 --- size
- 判断是否为空 --- empty
- 交换容器 --- swap

示例：


```cpp
#include <iostream>
#include <list>
#include <map>
#include <string>
#include "cpputil.h"

using namespace std;

void test01() {
    map<string, string> m = {
        {"name", "Tom"},
        {"age", "20"},
        {"school", "PKU"},
    };

    if (m.empty()) {
        cout << "m为空" << endl;
    } else {
        cout << "m不为空" << endl;
        cout << "m的大小为： " << m.size() << endl;
    }

    // 输出
    // m不为空
    // m的大小为： 3
}

//交换
void test02() {
    map<string, string> m1 = {
        {"name", "Tom"},
        {"age", "20"},
        {"school", "PKU"},
    };

    map<string, string> m2 = {
        {"name", "Jack"},
        {"age", "21"},
        {"school", "Tsinghua"},
    };

    cout << "交换前" << endl;
    cout << toString(m1) << endl;
    cout << toString(m2) << endl;

    cout << "交换后" << endl;
    m1.swap(m2);
    cout << toString(m1) << endl;
    cout << toString(m2) << endl;
}

int main() {
    test01();

    test02();
    return 0;
}

```
输出

```cpp
交换前
{
  age: 20
  name: Tom
  school: PKU
}
{
  age: 21
  name: Jack
  school: Tsinghua
}
交换后
{
  age: 21
  name: Jack
  school: Tsinghua
}
{
  age: 20
  name: Tom
  school: PKU
}
```