# 面向对象

面向对象的三个特性：封装、继承、多态

## 封装

### 属性和行为

封装的意义：属性和行为加以权限控制

语法

```cpp
class 类名 {
访问权限:
	属性/行为
};
```

- 属性 成员属性 成员变量
- 行为 成员函数 成员方法

示例：求圆的周长

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

示例：学生类

```cpp
#include <iostream>

using namespace std;

// 学生类
class Student {
public:
    void setId(int id) {
        this->id = id;
    }

    void setName(string name) {
        this->name = name;
    }

    void showInfo() {
        cout << "Student:{"
                << "id=" << this->id
                << ", name=" << this->name
                << "}" << endl;
    }

private:
    int id;
    string name;
};

int main() {
    // 创建Student对象
    Student student1;
    student1.setId(1);
    student1.setName("张三");
    student1.showInfo();
    // Student:{id=1, name=张三}

    // 创建Student对象
    Student student2;
    student2.setId(2);
    student2.setName("李四");
    student2.showInfo();
    // Student:{id=2, name=李四}
}

```

### 权限控制

| 权限 | 类内 | 类外 | 子类
| - | - | - | - |   
public  公有 | 可以访问 | 可以访问 | 可以访问
protected 保护 | 可以访问 | 不可以访问 | 可以访问
private 私有 | 可以访问 | 不可以访问 | 不可以访问


```cpp
class Student {
public:
    string name;

protected:
    int age;

private:
    string address;
};
```

### struct 和 class

| 类型 | 默认权限
| - | - 
struct  | public公有
class |  private私有

```cpp
class Student {
    // 默认私有
    string name;
};

struct student {
    // 默认公有
    string name;
};
```

### 成员私有

成员属性设置为私有

1. 可以自己控制读写权限
2. 对于写可以进行数据有效性检测


控制读写权限

```cpp
class Student {
public:
    void setName(string name) {
        this->name = name;
    }

    string getName() {
        return this->name;
    }

private:
    string name;
};
```

数据有效性检测

```cpp

class Student {
public:
    void setAge(int age) {
        if (age < 0 || age > 150) {
            cout << "Invalid age" << endl;
            return;
        }

        this->age = age;
    }

    int getAge() {
        return this->age;
    }

private:
    int age;
};

```

### 示例：计算面积和体积

计算立方体的面积和体积

```cpp
#include <iostream>

using namespace std;


class Cube {
public:
    int getLength() const {
        return length;
    }

    void setLength(int length) {
        this->length = length;
    }

    int getWidth() const {
        return width;
    }

    void setWidth(int width) {
        this->width = width;
    }

    int getHeight() const {
        return height;
    }

    void setHeight(int height) {
        this->height = height;
    }

    // 计算面积
    int getArea() const {
        return 2 * (this->length * this->width + this->width * this->height + this->length * this->height);
    }


    // 计算体积
    int getVolume() const {
        return this->length * this->width * this->height;
    }

private:
    int length;
    int width;
    int height;
};

bool is_equals(Cube c1, Cube c2) {
    if (c1.getHeight() == c2.getHeight() && c1.getWidth() == c2.getWidth() && c1.getLength() == c2.getLength()) {
        return true;
    } else {
        return false;
    }
}

int main() {
    // 创建对象1
    Cube c1;
    c1.setLength(10);
    c1.setHeight(10);
    c1.setWidth(10);
    cout << "面积：" << c1.getArea() << endl; // 面积：600
    cout << "体积：" << c1.getVolume() << endl; // 体积：1000

    // 创建对象2
    Cube c2;
    c2.setLength(10);
    c2.setHeight(10);
    c2.setWidth(10);

    cout << "是否相等：" << is_equals(c1, c2) << endl; // 是否相等：1
}

```

### 示例：点和圆的关系

单文件

```cpp
#include <iostream>

using namespace std;

// 点类
class Point {
public:
    int getX() const {
        return x;
    }

    void setX(int x) {
        this->x = x;
    }

    int getY() const {
        return y;
    }

    void setY(int y) {
        this->y = y;
    }

private:
    int x;
    int y;
};

// 圆类
class Circle {
public:
    int getR() const {
        return r;
    }

    void setR(int r) {
        this->r = r;
    }

    Point getCenter() const {
        return center;
    }

    void setCenter(Point center) {
        this->center = center;
    }

    // 判断点是否在圆内
    bool isInCircle(Point p) const {
        // 两点之间的距离
        // r ^2 == (x2 - x1)^2 + (y2 - y1)^2
        // 在圆上 distance == 0
        // 在圆之外 distance > 0
        // 在圆之内 distance < 0
        return this->r * this->r >= (
                   (this->center.getX() - p.getX()) * (this->center.getX() - p.getX())
                   + (this->center.getY() - p.getY()) * (this->center.getY() - p.getY()));
    }

private:
    // 半径
    int r;
    // 圆心
    Point center;
};

int main() {
    // 创建圆心
    Point center;
    center.setX(0);
    center.setX(0);

    // 创建圆
    Circle circle;
    circle.setCenter(center);
    circle.setR(8);

    // 创建点
    Point point;
    point.setX(20);
    point.setX(20);

    cout << circle.isInCircle(point) << endl; // 0
}

```

多文件拆分

```bash
tree  
.
├── CMakeLists.txt
├── include
│	├── circle.h
│	└── point.h
└── src
    ├── circle.cpp
    ├── main.cpp
    └── point.cpp
```

CMakeLists.txt

```bash
# CMakeLists.txt
cmake_minimum_required(VERSION 3.29)
project(cpp_demo)

set(CMAKE_CXX_STANDARD 11)

include_directories("include")

aux_source_directory(./src SRC_LIST)
add_executable(main ${SRC_LIST})
```

circle.h

```cpp
#pragma once // 防止重复包含
#include "point.h"

// 点类的声明
class Circle {
public:
    int getR();

    void setR(int r);

    Point getCenter();

    void setCenter(Point center);

    // 判断点是否在圆内
    bool isInCircle(Point p);
private:
    // 半径
    int r;
    // 圆心
    Point center;
};

```

circle.cpp
```cpp
#include "circle.h"
#include "point.h"

// 圆类的实现
int Circle::getR() {
    return this->r;
}

void Circle::setR(int r) {
    this->r = r;
}

Point Circle::getCenter() {
    return center;
}

void Circle::setCenter(Point center) {
    this->center = center;
}

// 计算体积
bool Circle::isInCircle(Point p) {
    // 两点之间的距离
    // r ^2 == (x2 - x1)^2 + (y2 - y1)^2
    // 在圆上 distance == 0
    // 在圆之外 distance > 0
    // 在圆之内 distance < 0
    return this->r * this->r >= (
               (this->center.getX() - p.getX()) * (this->center.getX() - p.getX())
               + (this->center.getY() - p.getY()) * (this->center.getY() - p.getY()));
}

```

point.h
```cpp
#pragma once // 防止重复包含

// 点类的声明
class Point {
public:
    int getX();

    void setX(int x);

    int getY();

    void setY(int y);

private:
    int x;
    int y;
};

```

point.cpp
```cpp
#include "point.h"

// 点类的实现
int Point::getX() {
    return x;
}

void Point::setX(int x) {
    this->x = x;
}

int Point::getY() {
    return y;
}

void Point::setY(int y) {
    this->y = y;
}

```

main.cpp
```cpp
#include <iostream>
#include "point.h"
#include "circle.h"

using namespace std;

int main() {
    // 创建圆心
    Point center;
    center.setX(0);
    center.setY(0);

    // 创建圆
    Circle circle;
    circle.setCenter(center);
    circle.setR(8);

    // 创建点
    Point point;
    point.setX(20);
    point.setY(20);

    cout << circle.isInCircle(point) << endl; // 0
}

```

编译运行
```bash
cmake -B build && make -C build && ./build/main
```

参考

[【CMake】第2篇 CMake构建.h与.cpp文件](https://blog.csdn.net/fanjufei123456/article/details/127089049)


