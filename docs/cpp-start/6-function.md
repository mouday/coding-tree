# 函数

## 函数默认参数

语法

```cpp
返回值类型 函数名(参数=默认值){}
```

注意事项：

- 参数默认值放到形参列表最后
- 声明和实现只能一个有默认参数

```cpp
#include <iostream>

using namespace std;

// 声明
int add(int a, int b);

// 实现
int add(int a, int b = 20) {
    return a + b;
}

int main() {
    cout << add(1, 2) << endl; // 3

    cout << add(1) << endl; // 21
}

```

## 占位参数

语法

```
返回值类型 函数名(数据类型){}
```

例如

```cpp
void func(int a, int){
	// ...
}
```


占位参数可以有默认值

```cpp
void func(int a, int = 10){
	// ...
}
```

## 函数重载

函数名可以相同

函数重载满足条件
- 同一个作用域下
- 函数名称相同
- 函数参数`类型不同`或者`个数不同`或者`顺序不同`
- 函数返回值，不可以作为函数重载的条件

示例

个数不同

```cpp
#include <iostream>

using namespace std;


int add(int a) {
    return a + 20;
}

int add(int a, int b) {
    return a + b;
}

int main() {
    cout << add(1, 2) << endl; // 3

    cout << add(1) << endl; // 21
}

```

类型不同

```cpp
#include <iostream>

using namespace std;


int add(double a) {
    return a + 20;
}

int add(int a) {
    return a + 2;
}

int main() {
    cout << add(1) << endl; // 3

    cout << add(1.0) << endl; // 21
}

```

顺序不同

```cpp
#include <iostream>

using namespace std;


int add(double a, int b) {
    return a + b;
}

int add(int a, double b) {
    return a + b + 20;
}

int main() {
    cout << add(1.0, 2) << endl; // 3

    cout << add(1, 2.0) << endl; // 23
}
```

## 函数重载注意事项

1、引用作为重载条件

```cpp
#include <iostream>

using namespace std;


int add(int &a) {
    return a + 2;
}

int add(const int &a) {
    return a + 20;
}

int main() {
    int a = 1;
    cout << add(a) << endl; // 3

    cout << add(1) << endl; // 21
}

```

2、函数重载和默认参数

以下两个函数不能同时存在，调用的时候存在二义性

```cpp
int add(int a){}

int add(int a, int b = 10){}
```
