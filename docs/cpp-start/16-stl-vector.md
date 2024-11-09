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


