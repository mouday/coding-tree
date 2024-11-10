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