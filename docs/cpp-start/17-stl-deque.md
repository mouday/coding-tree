# deque容器

## 1 deque容器基本概念

功能：

双端数组，可以对头端进行插入删除操作

deque与vector区别：

- vector对于头部的插入删除效率低，数据量越大，效率越低
- deque相对而言，对头部的插入删除速度回比vector快
- vector访问元素时的速度会比deque快,这和两者内部实现有关

![](https://mouday.github.io/img/2024/11/10/gjbx3zi.png)

deque内部工作原理:

deque内部有个中控器，维护每段缓冲区中的内容，缓冲区中存放真实数据

中控器维护的是每个缓冲区的地址，使得使用deque时像一片连续的内存空间

![](https://mouday.github.io/img/2024/11/10/16re3hq.png)

deque容器的迭代器也是支持随机访问的

## 2 deque构造函数

功能描述：

deque容器构造

函数原型：

```cpp
deque<T> deqT; //默认构造形式
deque(beg, end); //构造函数将[beg, end)区间中的元素拷贝给本身。
deque(n, elem); //构造函数将n个elem拷贝给本身。
deque(const deque &deq); //拷贝构造函数
```

总结：deque容器和vector容器的构造方式几乎一致，灵活使用即可


示例：


```cpp
#include <iostream>
#include <deque>

using namespace std;


void printDeque(const deque<int> &d) {
    for (deque<int>::const_iterator it = d.begin(); it != d.end(); it++) {
        cout << *it << " ";
    }
    cout << endl;
}

//deque构造
void test01() {
    deque<int> d1; //无参构造函数
    for (int i = 0; i < 10; i++) {
        d1.push_back(i);
    }
    printDeque(d1);
    // 0 1 2 3 4 5 6 7 8 9

    deque<int> d2(d1.begin(), d1.end());
    printDeque(d2);
    // 0 1 2 3 4 5 6 7 8 9

    deque<int> d3(10, 100);
    printDeque(d3);
    // 100 100 100 100 100 100 100 100 100 100

    deque<int> d4 = d3;
    printDeque(d4);
    // 100 100 100 100 100 100 100 100 100 100
}

int main() {
    test01();

    return 0;
}

```

## 3 deque赋值操作

功能描述：

给deque容器进行赋值

函数原型：

```cpp
deque& operator=(const deque &deq); //重载等号操作符

assign(beg, end); //将[beg, end)区间中的数据拷贝赋值给本身。

assign(n, elem); //将n个elem拷贝赋值给本身。
```

总结：deque赋值操作也与vector相同，需熟练掌握

示例：


```cpp
#include <iostream>
#include <deque>

using namespace std;


void printDeque(const deque<int> &d) {
    for (deque<int>::const_iterator it = d.begin(); it != d.end(); it++) {
        cout << *it << " ";
    }
    cout << endl;
}

//赋值操作
void test01() {
    deque<int> d1;
    for (int i = 0; i < 10; i++) {
        d1.push_back(i);
    }
    printDeque(d1);
    // 0 1 2 3 4 5 6 7 8 9

    deque<int> d2;
    d2 = d1;
    printDeque(d2);
    // 0 1 2 3 4 5 6 7 8 9

    deque<int> d3;
    d3.assign(d1.begin(), d1.end());
    printDeque(d3);
    // 0 1 2 3 4 5 6 7 8 9

    deque<int> d4;
    d4.assign(10, 100);
    printDeque(d4);
    // 100 100 100 100 100 100 100 100 100 100
}

int main() {
    test01();


    return 0;
}

```

## 4 deque大小操作

功能描述：

对deque容器的大小进行操作

函数原型：

```cpp
deque.empty(); //判断容器是否为空

deque.size(); //返回容器中元素的个数

deque.resize(num); //重新指定容器的长度为num,若容器变长，则以默认值填充新位置。

​//如果容器变短，则末尾超出容器长度的元素被删除。

deque.resize(num, elem); //重新指定容器的长度为num,若容器变长，则以elem值填充新位置。

//如果容器变短，则末尾超出容器长度的元素被删除。
​```

总结：

- deque没有容量的概念
- 判断是否为空 --- empty
- 返回元素个数 --- size
- 重新指定个数 --- resize

示例：

```cpp
#include <iostream>
#include <deque>

using namespace std;

void printDeque(const deque<int> &d) {
    for (deque<int>::const_iterator it = d.begin(); it != d.end(); it++) {
        cout << *it << " ";
    }
    cout << endl;
}

//大小操作
void test01() {
    deque<int> d1;
    for (int i = 0; i < 10; i++) {
        d1.push_back(i);
    }
    printDeque(d1);
    // 0 1 2 3 4 5 6 7 8 9

    // 判断容器是否为空
    if (d1.empty()) {
        cout << "d1为空!" << endl;
    } else {
        cout << "d1不为空!" << endl;
        // 统计大小
        cout << "d1的大小为：" << d1.size() << endl;
    }
    // d1不为空!
    // d1的大小为：10


    //重新指定大小
    d1.resize(15, 1);
    printDeque(d1);
    // 0 1 2 3 4 5 6 7 8 9 1 1 1 1 1

    d1.resize(5);
    printDeque(d1);
    // 0 1 2 3 4
}

int main() {
    test01();
    
    return 0;
}

```

