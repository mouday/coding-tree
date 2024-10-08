# 引用

## 1、引用的基本使用

作用： 给变量起别名

语法： `数据类型 &别名 = 原名`

示例：

```cpp
#include <iostream>

using namespace std;

int main() {
    int a = 10;
    int &b = a;

    cout << "a = " << a << endl;
    cout << "b = " << b << endl;

    b = 100;

    cout << "a = " << a << endl;
    cout << "b = " << b << endl;

    return 0;
}

```

输出

```bash
a = 10
b = 10
a = 100
b = 100
```

## 2、引用注意事项

- 引用必须初始化
- 引用在初始化后，不可以改变

示例：

```cpp
#include <iostream>

using namespace std;

int main() {
    int a = 10;
    int b = 20;
    //int &c; //错误，引用必须初始化

    int &c = a; //一旦初始化后，就不可以更改
    c = b; //这是赋值操作，不是更改引用

    cout << "a = " << a << endl;
    cout << "b = " << b << endl;
    cout << "c = " << c << endl;

    return 0;
}

```

输出

```bash
a = 20
b = 20
c = 20
```
