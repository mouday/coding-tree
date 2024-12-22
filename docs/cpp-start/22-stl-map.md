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
    if (m.empty()) {
        return "{}";
    }

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

## 4 map插入和删除

功能描述：

map容器进行插入数据和删除数据

函数原型：

```cpp
insert(elem); //在容器中插入元素。
clear(); //清除所有元素
erase(pos); //删除pos迭代器所指的元素，返回下一个元素的迭代器。
erase(beg, end); //删除区间[beg,end)的所有元素 ，返回下一个元素的迭代器。
erase(key); //删除容器中值为key的元素。
```

总结：

- map插入方式很多，记住其一即可
- 插入 --- insert
- 删除 --- erase
- 清空 --- clear

示例：

```cpp
#include <iostream>
#include <map>
#include <string>
#include "cpputil.h"

using namespace std;


void test01() {
    // 插入
    map<int, int> m;
    // 第一种插入方式
    m.insert(pair<int, int>(1, 10));
    // 第二种插入方式
    m.insert(make_pair(2, 20));
    // 第三种插入方式
    m.insert(map<int, int>::value_type(3, 30));
    // 第四种插入方式
    m[4] = 40;

    cout << toString(m) << endl;
    // {
    //     1: 10
    //     2: 20
    //     3: 30
    //     4: 40
    // }

    // 删除
    m.erase(m.begin());
    cout << toString(m) << endl;
    // {
    //     2: 20
    //     3: 30
    //     4: 40
    //  }

    m.erase(3);
    cout << toString(m) << endl;
    // {
    //     2: 20
    //     4: 40
    //  }

    // 清空
    m.erase(m.begin(), m.end());
    m.clear();
    cout << toString(m) << endl;
    // {}
}

int main() {
    test01();

    return 0;
}
```

## 5 map查找和统计

功能描述：

对map容器进行查找数据以及统计数据

函数原型：

```cpp
find(key); //查找key是否存在,若存在，返回该键的元素的迭代器；若不存在，返回set.end();

count(key); //统计key的元素个数
```

总结：

- 查找 --- find （返回的是迭代器）
- 统计 --- count （对于map，结果为0或者1）

示例：

```cpp
#include <iostream>
#include <map>
#include <string>
#include "cpputil.h"

using namespace std;


// 查找和统计
void test01() {
    map<int, int> m;
    m.insert(pair<int, int>(1, 10));
    m.insert(pair<int, int>(2, 20));
    m.insert(pair<int, int>(3, 30));

    //查找
    map<int, int>::iterator pos = m.find(3);

    if (pos != m.end()) {
        cout << "找到了元素 key = " << (*pos).first << " value = " << (*pos).second << endl;
    } else {
        cout << "未找到元素" << endl;
    }
    // 找到了元素 key = 3 value = 30

    //统计
    int num = m.count(3);
    cout << "num = " << num << endl;
    // num = 1
}

int main() {
    test01();

    return 0;
}

```

## 6 map容器排序

学习目标：

map容器默认排序规则为 按照key值进行 从小到大排序，掌握如何改变排序规则

主要技术点:

利用仿函数，可以改变排序规则

总结：

- 利用仿函数可以指定map容器的排序规则
- 对于自定义数据类型，map必须要指定排序规则,同set容器


示例：

```cpp
#include <iostream>
#include <map>
#include <string>
#include "cpputil.h"

using namespace std;

class MyCompare {
public:
    bool operator()(int v1, int v2) const {
        return v1 > v2;
    }
};

void test01() {
    //默认从小到大排序
    //利用仿函数实现从大到小排序
    map<int, int, MyCompare> m;

    m.insert(make_pair(1, 10));
    m.insert(make_pair(2, 20));
    m.insert(make_pair(3, 30));
    m.insert(make_pair(4, 40));
    m.insert(make_pair(5, 50));

    for (map<int, int, MyCompare>::iterator it = m.begin(); it != m.end(); it++) {
        cout << "key:" << it->first << " value:" << it->second << endl;
    }
    // key:5 value:50
    // key:4 value:40
    // key:3 value:30
    // key:2 value:20
    // key:1 value:10
}

int main() {
    test01();

    return 0;
}
```