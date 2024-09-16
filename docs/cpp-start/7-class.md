# 面向对象

面向对象的三个特性：封装、继承、多态

## 封装

封装的意义：属性和行为加以权限控制

语法

```
class 类名 {
访问权限:
	属性/行为
};
```

设计一个圆类，求圆的周长

圆周长公式：`2 * PI * 半径`

```cpp
#include <iostream>

using namespace std;

const double PI = 3.14;

class Circle {
    // 公开权限
public:
    // 属性
    int r;

    // 行为
    double calculate() {
        return 2 * PI * r;
    }
};

int main() {
    // 创建对象
    Circle circle;

    // 设置属性
    circle.r = 10;

    // 求周长
    cout << circle.calculate() << endl; // 62.8
}

```


