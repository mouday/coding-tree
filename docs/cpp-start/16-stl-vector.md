# vector容器


## 1 vector基本概念

功能：

vector数据结构和数组非常相似，也称为`单端数组`

vector与普通数组区别

- 数组是`静态空间`
- vector可以`动态扩展`



动态扩展：

并不是在原空间之后续接新空间，而是找更大的内存空间，然后将原数据拷贝新空间，释放原空间



![](https://mouday.github.io/img/2024/11/09/rgtc747.png)



* vector容器的迭代器是支持随机访问的迭代器


## 2 vector构造函数

功能描述：

* 创建vector容器

**函数原型：**

```cpp
// 采用模板实现类实现，默认构造函数
vector<T> v;

// 将v[begin(), end())区间中的元素拷贝给本身。
vector(v.begin(), v.end());

//构造函数将n个elem拷贝给本身。
vector(n, elem);

//拷贝构造函数。
vector(const vector &vec); 
```

**示例：**


```cpp
#include <iostream>
#include <vector>

using namespace std;

void printVector(vector<int> &v) {
    for (vector<int>::iterator it = v.begin(); it != v.end(); it++) {
        cout << *it << " ";
    }
    cout << endl;
}

void test01() {
    //无参构造
    vector<int> v1;
    for (int i = 0; i < 10; i++) {
        v1.push_back(i);
    }
    printVector(v1);
    // 0 1 2 3 4 5 6 7 8 9

    // [v1.begin(), v1.end())
    vector<int> v2(v1.begin(), v1.end());
    printVector(v2);
    // 0 1 2 3 4 5 6 7 8 9

    // (n, element)
    vector<int> v3(10, 100);
    printVector(v3);
    // 100 100 100 100 100 100 100 100 100 100

    // copy
    vector<int> v4(v3);
    printVector(v4);
    // 100 100 100 100 100 100 100 100 100 100
}

int main() {
    test01();

    return 0;
}

```

**总结：** vector的多种构造方式没有可比性，灵活使用即可


## 3 vector赋值操作

功能描述：

给vector容器进行赋值

函数原型：

```cpp
//重载等号操作符
vector& operator=(const vector &vec);

//将[beg, end)区间中的数据拷贝赋值给本身。
assign(beg, end); 

//将n个elem拷贝赋值给本身。
assign(n, elem); 
```

总结： vector赋值方式比较简单，使用operator=，或者assign都可以

示例：

```cpp
#include <iostream>
#include <vector>

using namespace std;

void printVector(vector<int> &v) {
    for (vector<int>::iterator it = v.begin(); it != v.end(); it++) {
        cout << *it << " ";
    }
    cout << endl;
}

//赋值操作
void test01() {
    vector<int> v1; //无参构造
    for (int i = 0; i < 10; i++) {
        v1.push_back(i);
    }
    printVector(v1);
    // 0 1 2 3 4 5 6 7 8 9

    vector<int> v2;
    v2 = v1;
    printVector(v2);
    // 0 1 2 3 4 5 6 7 8 9

    vector<int> v3;
    v3.assign(v1.begin(), v1.end());
    printVector(v3);
    // 0 1 2 3 4 5 6 7 8 9

    vector<int> v4;
    v4.assign(10, 100);
    printVector(v4);
    // 100 100 100 100 100 100 100 100 100 100
}

int main() {
    test01();
    
    return 0;
}
```

## 4 vector容量和大小

功能描述：

对vector容器的容量和大小操作

函数原型：

```cpp
// 判断容器是否为空
empty(); 

// 容器的容量
capacity(); 

// 返回容器中元素的个数
size(); 

// 重新指定容器的长度为num，若容器变长，则以默认值填充新位置。
// 如果容器变短，则末尾超出容器长度的元素被删除。
resize(int num); 
​ 
// 重新指定容器的长度为num，若容器变长，则以elem值填充新位置。
// 如果容器变短，则末尾超出容器长度的元素被删除
resize(int num, elem); 
```

总结：

- 判断是否为空 --- empty
- 返回元素个数 --- size
- 返回容器容量 --- capacity
- 重新指定大小 --- resize

示例：

```cpp
#include <iostream>
#include <vector>

using namespace std;

void printVector(vector<int> &v) {
    for (vector<int>::iterator it = v.begin(); it != v.end(); it++) {
        cout << *it << " ";
    }
    cout << endl;
}

void test01() {
    vector<int> v1;
    for (int i = 0; i < 10; i++) {
        v1.push_back(i);
    }
    printVector(v1);
    // 0 1 2 3 4 5 6 7 8 9

    if (v1.empty()) {
        cout << "v1为空" << endl;
    } else {
        cout << "v1不为空" << endl;
        cout << "v1的容量 = " << v1.capacity() << endl;
        cout << "v1的大小 = " << v1.size() << endl;
    }
    // v1不为空
    // v1的容量 = 16
    // v1的大小 = 10


    //resize 重新指定大小 ，若指定的更大，默认用0填充新位置，可以利用重载版本替换默认填充
    v1.resize(15, 10);
    printVector(v1);
    // 0 1 2 3 4 5 6 7 8 9 10 10 10 10 10
    
    //resize 重新指定大小 ，若指定的更小，超出部分元素被删除
    v1.resize(5);
    printVector(v1);
    // 0 1 2 3 4
}

int main() {
    test01();

    return 0;
}

```

## 5 vector插入和删除

功能描述：

对vector容器进行插入、删除操作

函数原型：
```cpp
push_back(ele); //尾部插入元素ele
pop_back(); //删除最后一个元素

insert(const_iterator pos, ele); //迭代器指向位置pos插入元素ele
insert(const_iterator pos, int count,ele);//迭代器指向位置pos插入count个元素ele

erase(const_iterator pos); //删除迭代器指向的元素
erase(const_iterator start, const_iterator end);//删除迭代器从start到end之间的元素
clear(); //删除容器中所有元素
```

总结：

- 尾插 --- push_back
- 尾删 --- pop_back
- 插入 --- insert (位置迭代器)
- 删除 --- erase （位置迭代器）
- 清空 --- clear

示例：



```cpp
#include <iostream>
#include <vector>

using namespace std;


void printVector(vector<int> &v) {
    for (vector<int>::iterator it = v.begin(); it != v.end(); it++) {
        cout << *it << " ";
    }
    cout << endl;
}

//插入和删除
void test01() {
    vector<int> v1;
    //尾插
    v1.push_back(10);
    v1.push_back(20);
    v1.push_back(30);
    v1.push_back(40);
    v1.push_back(50);
    printVector(v1);
    // 10 20 30 40 50

    //尾删
    v1.pop_back();
    printVector(v1);
    // 10 20 30 40

    //插入
    v1.insert(v1.begin(), 100);
    printVector(v1);
    // 100 10 20 30 40

    v1.insert(v1.begin(), 2, 1000);
    printVector(v1);
    // 1000 1000 100 10 20 30 40

    //删除
    v1.erase(v1.begin());
    printVector(v1);
    // 1000 100 10 20 30 40

    //清空
    v1.erase(v1.begin(), v1.end());
    v1.clear();
    printVector(v1);
    // 输出为空
}

int main() {
    test01();

    return 0;
}

```

## 6 vector数据存取

功能描述：

对vector中的数据的存取操作

函数原型：

```cpp
at(int idx); //返回索引idx所指的数据
operator[]; //返回索引idx所指的数据
front(); //返回容器中第一个数据元素
back(); //返回容器中最后一个数据元素
```

总结：

- 除了用迭代器获取vector容器中元素，`[ ]`和`at`也可以
- front返回容器第一个元素
- back返回容器最后一个元素

示例：


```cpp
#include <iostream>
#include <vector>

using namespace std;


void test01() {
    vector<int> v1;
    for (int i = 0; i < 10; i++) {
        v1.push_back(i);
    }

    for (int i = 0; i < v1.size(); i++) {
        cout << v1[i] << " ";
    }
    cout << endl;
    // 0 1 2 3 4 5 6 7 8 9

    for (int i = 0; i < v1.size(); i++) {
        cout << v1.at(i) << " ";
    }
    cout << endl;
    // 0 1 2 3 4 5 6 7 8 9

    cout << "v1的第一个元素为： " << v1.front() << endl;
    // v1的第一个元素为： 0

    cout << "v1的最后一个元素为： " << v1.back() << endl;
    // v1的最后一个元素为： 9
}

int main() {
    test01();

    return 0;
}

```

## 7 vector互换容器

功能描述：

实现两个容器内元素进行互换

函数原型：

```cpp
swap(vec); // 将vec与本身的元素互换
```

总结：swap可以使两个容器互换，可以达到实用的收缩内存效果

示例：

```cpp
#include <iostream>
#include <vector>

using namespace std;


void printVector(vector<int> &v) {
    for (vector<int>::iterator it = v.begin(); it != v.end(); it++) {
        cout << *it << " ";
    }
    cout << endl;
}

void test01() {
    vector<int> v1;
    for (int i = 0; i < 10; i++) {
        v1.push_back(i);
    }
    printVector(v1);
    // 0 1 2 3 4 5 6 7 8 9

    vector<int> v2;
    for (int i = 10; i < 20; i++) {
        v2.push_back(i);
    }
    printVector(v2);
    // 10 11 12 13 14 15 16 17 18 19

    //互换容器
    v1.swap(v2);
    cout << "互换后" << endl;
    printVector(v1);
    // 10 11 12 13 14 15 16 17 18 19

    printVector(v2);
    // 0 1 2 3 4 5 6 7 8 9
}

void test02() {
    vector<int> v;
    for (int i = 0; i < 100; i++) {
        v.push_back(i);
    }

    cout << "v的容量为：" << v.capacity() << endl;
    // v的容量为：128
    cout << "v的大小为：" << v.size() << endl;
    // v的大小为：100

    v.resize(3);

    cout << "v的容量为：" << v.capacity() << endl;
    // v的容量为：128
    cout << "v的大小为：" << v.size() << endl;
    // v的大小为：3

    //收缩内存
    vector<int>(v).swap(v); // 匿名对象

    cout << "v的容量为：" << v.capacity() << endl;
    // v的容量为：3
    cout << "v的大小为：" << v.size() << endl;
    // v的大小为：3
}

int main() {
    test01();

    test02();

    return 0;
}

```

## 8 vector预留空间

功能描述：

减少vector在动态扩展容量时的扩展次数

函数原型：
```cpp
reserve(int len); // 容器预留len个元素长度，预留位置不初始化，元素不可访问。
```

​总结：如果数据量较大，可以一开始利用reserve预留空间

示例：


```cpp
#include <iostream>
#include <vector>

using namespace std;


void test01() {
    vector<int> v;

    //预留空间
    v.reserve(100000);

    int num = 0;
    int *p = NULL;
    for (int i = 0; i < 100000; i++) {
        v.push_back(i);
        if (p != &v[0]) {
            p = &v[0];
            num++;
        }
    }

    cout << "num:" << num << endl;
    // num:1
}

int main() {
    test01();

    return 0;
}

```
