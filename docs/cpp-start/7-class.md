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

## 对象的初始化和清理

### 构造函数和析构函数

- 构造函数 初始化工作
- 析构函数 清理工作

构造函数和析构函数都是`自动调用`，默认有空实现

1、构造函数

- 没有返回值，也不写void
- 函数名与类名相同
- 构造函数`可以有参数`，`可以重载`
- 创建对象时自动调用一次


语法

```cpp
类名(){}
```

2、析构函数

- 没有返回值，也不写void
- 函数名与类名相同，多一个`~`
- 构造函数`不可以有参数`，`不可以重载`
- 销毁对象时自动调用一次

语法

```cpp
~类名(){}
```

示例

```cpp
#include <iostream>

using namespace std;

class Person {
public:
    // 构造函数
    Person() {
        cout << "构造函数" << endl;
    }

    // 析构函数
    ~Person() {
        cout << "析构函数" << endl;
    }
};


int main() {
    Person p; // 栈上的数据，执行结束后自动释放
    return 0;
}

```

输出

```bash
构造函数
析构函数
```

### 构造函数的分类及调用

分类方式：

- 按照参数：有参构造（默认构造）、无参构造
- 按照类型：普通构造、拷贝构造

调用方式：

- 括号法
- 显示法
- 隐式法

1、定义类的构造函数

```cpp
#include <iostream>

using namespace std;

class Person {
public:
    // 无参构造函数
    Person() {
        cout << "无参构造函数" << endl;
    }

    // 有参构造函数
    Person(int age) {
        this->age = age;
        cout << "有参构造函数" << endl;
    }

    // 拷贝构造函数
    Person(const Person &person) {
        this->age = person.age;
        cout << "拷贝构造函数" << endl;
    }

    // 析构函数
    ~Person() {
        cout << "析构函数" << endl;
    }

private:
    int age;
};

```

2、括号法调用构造函数

```cpp

int main() {
    // 括号法
    Person p1;     // 无参构造函数
    Person p2(18); // 有参构造函数
    Person p3(p1); // 拷贝构造函数

    return 0;
}
```

输出

```cpp
无参构造函数
有参构造函数
拷贝构造函数
析构函数
析构函数
析构函数
```

注意：调用`默认构造函数`的时候，不要加`()`

```cpp
// 编译器认为是一个函数声明
void func();

Person p1();
```

3、显示法调用构造函数

```cpp
int main() {
    // 显示法
    Person p1;              // 无参构造函数
    Person p2 = Person(18); // 有参构造函数
    Person p3 = Person(p1); // 拷贝构造函数

    return 0;
}
```

输出

```cpp
无参构造函数
有参构造函数
拷贝构造函数
析构函数
析构函数
析构函数
```

注意：

- `Person(18)`单独写，是一个匿名对象，当前行执行结束后，会立即回收
- 不要用拷贝构造函数，初始化匿名对象

示例1

```cpp
int main() {
	// 匿名对象
    Person(18);
    cout << "结束" << endl;

    return 0;
}
```

输出

```bash
有参构造函数
析构函数
结束
```

示例2

```cpp
int main() {
    Person p1; // 单独写，就是匿名对象

    // Person(p1) 等价于 Person p1
    Person(p1); // 编译报错：redefinition of 'p1'
    return 0;
}

```


4、隐式法调用构造函数

```cpp
int main() {
    // 隐式
    Person p1 = 18; // 相当于 Person p1 = Person(18); 有参构造函数
    Person p2 = p1; // 拷贝构造函数

    return 0;
}

```

输出

```cpp
有参构造函数
拷贝构造函数
析构函数
析构函数
```
### 拷贝构造函数调用时机

C++中拷贝构造函数调用时机通常有三种情况

- 使用一个已经创建完毕的对象来初始化一个新对象
- 值传递的方式给函数参数传值
- 以值方式返回局部对象

Person类

```cpp
#include <iostream>

using namespace std;

class Person {
public:
    // 无参构造函数
    Person() {
        cout << "无参构造函数" << endl;
    }

    // 有参构造函数
    Person(int age) {
        this->age = age;
        cout << "有参构造函数" << endl;
    }

    // 拷贝构造函数
    Person(const Person &person) {
        this->age = person.age;
        cout << "拷贝构造函数" << endl;
    }

    // 析构函数
    ~Person() {
        cout << "析构函数" << endl;
    }

private:
    int age;
};

```

1、使用一个已经创建完毕的对象来初始化一个新对象

```cpp

int main() {
    Person p1(10);
    Person p2(p1);
    Person p3 = p1;

    return 0;
}
```

输出

```bash
有参构造函数
拷贝构造函数
拷贝构造函数
析构函数
析构函数
析构函数
```

2、值传递的方式给函数参数传值

```cpp
void doWork(Person p) {}

int main() {
    Person p1(10);
    doWork(p1);

    return 0;
}
```

输出

```bash
有参构造函数
拷贝构造函数
析构函数
析构函数
```


3、以值方式返回局部对象

```cpp

Person doWork() {
    Person p1(10);
    cout << &p1 << endl; // 0x7ff7bee87768
    return p1;
}

int main() {
    Person p = doWork();
    cout << &p << endl; // 0x7ff7bee87768
    return 0;
}

```

输出

```bash
有参构造函数
0x7ff7bee87768
0x7ff7bee87768
析构函数
```


### 构造函数调用规则

默认情况下，c++编译器至少给一个类添加3个函数

1．默认构造函数(无参，函数体为空)

2．默认析构函数(无参，函数体为空)

3．默认拷贝构造函数，对属性进行值拷贝

构造函数调用规则如下：

- 如果用户定义有参构造函数，c++不在提供默认无参构造，但是会提供默认拷贝构造

- 如果用户定义拷贝构造函数，c++不会再提供其他构造函数

示例：

1、用户定义有参构造函数

```cpp
#include <iostream>

using namespace std;

class Person {
public:
    // 有参构造函数
    Person(int age) {
        this->age = age;
        cout << "有参构造函数!" << endl;
    }
private:
    int age;
};

int main() {
    // Person p1;
    // error: no matching constructor for initialization of 'Person'

    Person p2(18);

    return 0;
}

```

2、定义拷贝构造函数

```cpp
#include <iostream>

using namespace std;

class Person {
public:
    // 拷贝构造函数
    Person(const Person &p) {
        this->age = p.age;
        cout << "拷贝构造函数!" << endl;
    }

private:
    int age;
};

int main() {
    Person p1;
    // error: no matching constructor for initialization of 'Person'

    return 0;
}

```

### 深拷贝与浅拷贝

深浅拷贝是面试经典问题，也是常见的一个坑

浅拷贝：简单的赋值拷贝操作

深拷贝：在堆区重新申请空间，进行拷贝操作

浅拷贝问题：堆区的内存重复释放


示例

1、普通变量浅拷贝

拷贝构造后的新对象和旧对象数据互不影响

```cpp
#include <iostream>

using namespace std;

class Person {
public:
    Person(int age) {
        this->age = age;
    }

    int age;
};

int main() {
    Person p1(18);

    Person p2(p1);
    p1.age = 20;

    cout << "p1.age = " << p1.age << endl;
    // p1.age = 20

    cout << "p2.age = " << p2.age << endl;
    // p2.age = 18

    return 0;
}

```

2、深拷贝

```cpp
#include <iostream>

using namespace std;

class Person {
public:
	// 有参构造函数
    Person(int age) {
        cout << "有参构造函数" << endl;
        this->age = new int(age);
    }

    // 拷贝构造函数
    Person(const Person &p) {
        cout << "拷贝构造函数" << endl;
        this->age = new int(*(p.age));
    }

    // 析构函数
    ~Person() {
        cout << "析构函数" << endl;
        if (this->age != NULL) {
            delete this->age;
            this->age = NULL;
        }
    }

public:
    int *age;
};

int main() {
    Person p1(18);

    Person p2(p1);

    return 0;
}

```

正确：提供拷贝构造函数

```bash
有参构造函数
拷贝构造函数
析构函数
析构函数
```

报错：如果没有提供拷贝构造函数，使用默认拷贝构造函数

```bash
main(60055,0x7ff852fb4fc0) malloc: *** error for object 0x600001d58040: pointer being freed was not allocated
main(60055,0x7ff852fb4fc0) malloc: *** set a breakpoint in malloc_error_break to debug
有参构造函数
析构函数
析构函数
```

### 初始化列表

作用：

C++提供了初始化列表语法，用来初始化属性

语法：

```cpp
构造函数()：属性1(值1),属性2（值2）... {}
```

示例：

1、传统方式初始化

```cpp
class Person {
public:
    // 传统方式初始化
    Person(int a, int b, int c) {
        this->a = a;
        this->b = b;
        this->c = c;
    }

private:
    int a;
    int b;
    int c;
};

int main() {
    Person p(1, 2, 3);

    return 0;
}

```

2、初始化列表方式初始化

```cpp
class Person {
public:
    // 初始化列表方式初始化
    Person(int a, int b, int c): a(a), b(b), c(c) {
    }

private:
    int a;
    int b;
    int c;
};

int main() {
    Person p(1, 2, 3);

    return 0;
}

```

### 类对象作为类成员

C++类中的成员可以是另一个类的对象，我们称该成员为 `对象成员`

例如：

```cpp
class A {}

class B
{
    A a；
}
```

B类中有对象A作为成员，A为对象成员

那么当创建B对象时，A与B的构造和析构的顺序是谁先谁后？

示例：

```cpp
#include <iostream>
#include <ostream>

class A {
public:
    A() {
        std::cout << "A" << std::endl;
    }

    ~A() {
        std::cout << "~A" << std::endl;
    }
};

class B {
public:
    B() {
        std::cout << "B" << std::endl;
    }

    ~B() {
        std::cout << "~B" << std::endl;
    }

private:
    A a;
};

int main() {
    B a;

    return 0;
}

```

输出
```
A
B
~B
~A
```

构造的顺序是 ：先调用对象成员的构造，再调用本类构造

析构顺序与构造相反

### 静态成员

静态成员就是在成员变量和成员函数前加上关键字`static`，称为`静态成员`

静态成员分为：

- 静态成员变量
    - 所有对象共享同一份数据
    - 在编译阶段分配内存
    - 类内声明，类外初始化
- 静态成员函数
    - 所有对象共享同一个函数
    - 静态成员函数只能访问静态成员变量

示例1：静态成员变量

```cpp
#include <iostream>
#include <ostream>

using namespace std;

class Person {
public:
    // 类内声明
    static int age;
};

// 类外初始化
int Person::age = 18;

int main() {
    // 1、通过对象
    Person p;
    cout << p.age << endl; // 18

    // 2、通过类名
    cout << Person::age << endl; // 18

    return 0;
}

```


示例2：静态成员函数

```cpp
#include <iostream>
#include <ostream>

using namespace std;

class Person {
public:
    // 类内声明
    static int age;

    static int getAge() {
        // 静态成员函数只能访问静态成员变量
        return Person::age;
    }
};

// 类外初始化
int Person::age = 18;

int main() {
    // 1、通过对象
    Person p;
    cout << p.getAge() << endl; // 18

    // 2、通过类名
    cout << Person::getAge() << endl; // 18

    return 0;
}

```

## C++对象模型和this指针

### 成员变量和成员函数分开存储

在C++中，类内的成员变量和成员函数分开存储

只有非静态成员变量才属于类的对象上

1、空对象占用一个字节

```cpp
#include <iostream>
#include <ostream>
using namespace std;

class Person {
};

int main() {
    // 类对象占用一个字节
    cout << sizeof(Person) << endl; // 1

    // 空对象占用一个字节
    Person p;
    cout << sizeof(p) << endl; // 1

    return 0;
}

```

2、对象占用大小

```cpp
#include <iostream>
#include <ostream>
using namespace std;

class Person {
public:
    // 非静态成员变量占对象空间
    int a;

    // 静态成员变量不占对象空间
    static int b;

    // 函数也不占对象空间，所有函数共享一个函数实例
    void funcA();

    // 静态成员函数也不占对象空间
    static void funcB();
};

int main() {
    // 类对象占用4个字节
    cout << sizeof(Person) << endl; // 4

    // 对象占用4个字节
    Person p;
    cout << sizeof(p) << endl; // 4

    return 0;
}

```

### this指针概念

我们知道在C++中成员变量和成员函数是分开存储的

每一个非静态成员函数只会诞生一份函数实例，也就是说多个同类型的对象会共用一块代码

那么问题是：这一块代码是如何区分那个对象调用自己的呢？

c++通过提供特殊的对象指针，`this`指针，解决上述问题。this指针指向被调用的成员函数所属的对象

this指针是隐含每一个非静态成员函数内的一种指针

this指针不需要定义，直接使用即可

this指针的用途：

- 当形参和成员变量同名时，可用`this`指针来区分
- 在类的非静态成员函数中返回对象本身，可使用`return *this`

成员变量前缀：`m_`：member

示例：形参和成员变量同名

```cpp
#include <iostream>

class Person {
public:
    Person(int age) {
        // 当形参和成员变量同名时，可用this指针来区分
        this->age = age;
    }

    int age;
};

int main() {
    Person p1(10);

    std::cout << "p1.age = " << p1.age << std::endl;
    // p1.age = 10

    return 0;
}

```

示例：返回对象本身

```cpp
#include <iostream>

class Person {
public:
    Person(): age(0) {
    }

    Person &addAge(int age) {
        this->age += age;
        // 返回对象本身
        return *this;
    }

    int age;
};

int main() {
    Person p1;

    p1.addAge(10).addAge(10);

    std::cout << "p1.age = " << p1.age << std::endl;
    // p1.age = 20

    return 0;
}

```


### 空指针访问成员函数

C++中空指针也是可以调用成员函数的，但是也要注意有没有用到this指针

如果用到this指针，需要加以判断保证代码的健壮性

nullptr和NULL

```cpp
#include <iostream>

int main() {
    if (nullptr == NULL) {
        std::cout << "nullptr == NULL" << std::endl;
    } else {
        std::cout << "nullptr != NULL" << std::endl;
    }
    // 输出：nullptr == NULL
    return 0;
}

```

示例：空指针访问成员函数

```cpp
#include <iostream>

using namespace std;


class Person {
public:
    void ShowClassName() {
        cout << "我是Person类!" << endl;
    }

    void ShowPerson() {
        if (this == nullptr) {
            return;
        }
        cout << age << endl;
        // 相当于：cout << this->age << endl;
    }

public:
    int age;
};

int main() {
    Person *p = nullptr;
    
    p->ShowClassName(); // 空指针，可以调用成员函数
    // 输出：我是Person类!

    p->ShowPerson(); // 但是如果成员函数中用到了this指针，就不可以了

    return 0;
}

```

### const修饰成员函数

常函数：

- 成员函数后加const后我们称为这个函数为`常函数`
- 常函数内不可以修改`成员属性`
- 成员属性声明时加关键字`mutable`后，在常函数中依然可以修改


常对象：

- 声明对象前加const称该对象为`常对象`
- 常对象`只能调用常函数`


示例：

```cpp
#include <iostream>
using namespace std;

class Person {
public:
    Person(): a(0), b(0) {
    }

    // this指针的本质是一个指针常量，指针的指向不可修改
    // 如果想让指针指向的值也不可以修改，需要声明常函数
    void constFunc() const {
        // const Type* const pointer;
        // this = NULL; //不能修改指针的指向 Person* const this;
        // this->a = 100; //但是this指针指向的对象的数据是可以修改的

        // const修饰成员函数，表示指针指向的内存空间的数据不能修改，除了mutable修饰的变量
        this->b = 100;
    }

    void func() {
    }

public:
    int a;
    mutable int b; // 可修改 可变的
};


int main() {
    //const修饰对象  常对象
    const Person person; //常量对象
    cout << person.a << endl;
    //person.a = 100; // 常对象不能修改成员变量的值,但是可以访问
    person.b = 100; // 但是常对象可以修改mutable修饰成员变量

    // 常对象访问成员函数
    person.constFunc(); //常对象不能调用const的函数
    return 0;
}

```

## 友元

生活中你的家有客厅(Public)，有你的卧室(Private)

客厅所有来的客人都可以进去，但是你的卧室是私有的，也就是说只有你能进去

但是呢，你也可以允许你的好闺蜜好基友进去。

在程序里，有些私有属性 也想让类外特殊的一些函数或者类进行访问，就需要用到友元的技术

友元的目的就是让一个函数或者类 访问另一个类中私有成员

友元的关键字为 `friend`: 访问私有成员

友元的三种实现

- 全局函数做友元
- 类做友元
- 成员函数做友元

### 全局函数做友元

用法

```cpp
class Building {
    // 全局函数做友元
    friend void goodGay(Building *building);

private:
	// 私有成员
    string m_BedRoom;
}

// 访问私有成员
void goodGay(Building *building) {
   building->m_BedRoom;
}
```

完整示例

```cpp
#include <iostream>

using namespace std;

class Building {
    //告诉编译器 goodGay全局函数 是 Building类的好朋友，可以访问类中的私有内容
    friend void goodGay(Building *building);

public:
    Building() {
        this->m_SittingRoom = "客厅";
        this->m_BedRoom = "卧室";
    }

public:
    string m_SittingRoom; //客厅

private:
    string m_BedRoom; //卧室
};


void goodGay(Building *building) {
    cout << "好基友正在访问： " << building->m_SittingRoom << endl;
    // 好基友正在访问： 客厅
    
    cout << "好基友正在访问： " << building->m_BedRoom << endl;
    // 好基友正在访问： 卧室
}


int main() {
    Building b;
    goodGay(&b);

    return 0;
}

```

### 类做友元

用法

```cpp
class Building
{
	friend class goodGay;
}
```

完整示例

```cpp
#include <iostream>

using namespace std;


class Building;

class goodGay {
public:
    goodGay();

    void visit();

private:
    Building *building;
};


class Building {
    // 告诉编译器 goodGay类是Building类的好朋友，可以访问到Building类中私有内容
    friend class goodGay;

public:
    Building();

public:
    string m_SittingRoom; //客厅
private:
    string m_BedRoom; //卧室
};

Building::Building() {
    this->m_SittingRoom = "客厅";
    this->m_BedRoom = "卧室";
}

goodGay::goodGay() {
    building = new Building;
}

void goodGay::visit() {
    cout << "好基友正在访问" << building->m_SittingRoom << endl;
    cout << "好基友正在访问" << building->m_BedRoom << endl;
}


int main() {
    goodGay gg;
    gg.visit();

    return 0;
}

```

### 成员函数做友元

用法

```cpp
class Building {
    friend void goodGay::visit();
}
```

```cpp
#include <iostream>

using namespace std;


class Building;

class goodGay {
public:
    goodGay();

    void visit(); //只让visit函数作为Building的好朋友，可以发访问Building中私有内容
    void visit2();

private:
    Building *building;
};


class Building {
    //告诉编译器  goodGay类中的visit成员函数 是Building好朋友，可以访问私有内容
    friend void goodGay::visit();

public:
    Building();

public:
    string m_SittingRoom; //客厅
private:
    string m_BedRoom; //卧室
};

Building::Building() {
    this->m_SittingRoom = "客厅";
    this->m_BedRoom = "卧室";
}

goodGay::goodGay() {
    building = new Building;
}

void goodGay::visit() {
    cout << "好基友正在访问" << building->m_SittingRoom << endl;
    cout << "好基友正在访问" << building->m_BedRoom << endl;
}

void goodGay::visit2() {
    cout << "好基友正在访问" << building->m_SittingRoom << endl;
    //cout << "好基友正在访问" << building->m_BedRoom << endl;
}


int main() {
    goodGay gg;
    gg.visit();

    return 0;
}
```

## 运算符重载

运算符重载概念：对已有的运算符重新进行定义，赋予其另一种功能，以适应不同的数据类型

### 加号运算符重载

作用：实现两个自定义数据类型相加的运算

1、成员函数实现 `+号运算符重载`

```cpp
#include <iostream>

using namespace std;

class Point {
public:
    Point(int x = 0, int y = 0) {
        this->x = x;
        this->y = y;
    }

    // 成员函数实现 + 号运算符重载
    Point operator+(const Point &other) {
        Point result;
        result.x = this->x + other.x;
        result.y = this->y + other.y;
        return result;
    }

    string toString() {
        return "Point(" + to_string(this->x) + ", " + to_string(this->y) + ")";
    }

private:
    int x;
    int y;
};

int main() {
    Point p1 = Point(1, 2);
    Point p2 = Point(3, 4);

    // 相当于: Point p3 = p1.operator+(p2);
    Point p3 = p1 + p2;

    cout << p3.toString() << endl;
    // Point(4, 6)

    return 0;
}

```

2、全局函数实现 `+号运算符重载`

```cpp
#include <iostream>

using namespace std;

class Point {
public:
    Point(int x = 0, int y = 0) {
        this->x = x;
        this->y = y;
    }

    string toString() {
        return "Point(" + to_string(this->x) + ", " + to_string(this->y) + ")";
    }

public:
    int x;
    int y;
};

// 全局函数实现 + 号运算符重载
Point operator+(const Point &p1, const Point &p2) {
    Point result;
    result.x = p1.x + p2.x;
    result.y = p1.y + p2.y;
    return result;
}

// 运算符重载 可以发生函数重载
Point operator+(const Point &p, int val) {
    Point result;
    result.x = p.x + val;
    result.y = p.y + val;
    return result;
}

int main() {
    Point p1 = Point(1, 2);
    Point p2 = Point(3, 4);

    // 相当于: Point p3 = operator+(p1, p2);
    Point p3 = p1 + p2;

    cout << p3.toString() << endl;
    // Point(4, 6)

    Point p4 = p3 + 10;

    cout << p4.toString() << endl;
    // Point(14, 16)

    return 0;
}

```

总结：

- 对于内置的数据类型的表达式的的运算符是不可能改变的

- 不要滥用运算符重载


### 左移运算符重载

作用：可以输出自定义数据类型

总结：重载左移运算符配合友元可以实现输出自定义数据类型

```cpp
#include <iostream>

using namespace std;

class Point {
    friend ostream &operator<<(ostream &out, Point &p);

public:
    Point(int x, int y) {
        this->x = x;
        this->y = y;
    }

    //成员函数 实现不了  p << cout 不是我们想要的效果
    //void operator<<(Point& p){
    //}

private:
    int x;
    int y;
};

//全局函数实现左移重载
//ostream对象只能有一个
ostream &operator<<(ostream &out, Point &p) {
    out << "Point(a=" << p.x << ", b=" << p.y << ")";
    return out;
}

int main() {
    Point p1(10, 20);

    cout << p1 << endl; //链式编程
    // 输出：Point(a=10, b=20)

    return 0;
}

```

### 递增运算符重载


作用： 通过重载递增运算符，实现自己的整型数据

总结： 前置递增返回引用，后置递增返回值


Point类

```cpp
#include <iostream>
#include <ostream>

using namespace std;

class Point {
    friend ostream &operator<<(ostream &out, Point point);

public:
    Point(int x, int y) : x(x), y(y) {
    }

    // 前置++ 先++,再返回
    Point &operator++() {
        this->x++;
        this->y++;

        return *this;
    }

    //后置++ 先返回
    Point operator++(int) {
        //记录当前本身的值，然后让本身的值加1，但是返回的是以前的值，达到先返回后++；
        Point temp = *this;

        this->x++;
        this->y++;

        return temp;
    }

private:
    int x;
    int y;
};

ostream &operator<<(ostream &out, Point point) {
    out << "Point(x=" << point.x << ", y=" << point.y << ")" << endl;
    return out;
}
```

测试前++

```cpp
int main() {
    Point p1(1, 2);

    cout << ++p1 << endl; // Point(x=2, y=3)
    cout << p1 << endl; // Point(x=2, y=3)
}
```

测试后++

```cpp
int main() {
    Point p1(1, 2);

    cout << p1++ << endl; // Point(x=1, y=2)
    cout << p1 << endl; // Point(x=2, y=3)
}
```

### 赋值运算符重载

c++编译器至少给一个类添加4个函数

- 默认构造函数(无参，函数体为空)
- 默认析构函数(无参，函数体为空)
- 默认拷贝构造函数，对属性进行值拷贝
- 赋值运算符 operator=, 对属性进行值拷贝

如果类中有属性指向堆区，做赋值操作时也会出现深浅拷贝问题

示例：浅拷贝

```cpp
#include <iostream>

using namespace std;

class Integer {
    friend ostream &operator<<(ostream &out, Integer &a);

public:
    // 构造函数
    Integer(int value = 0) {
        // 将数据开辟到堆区
        this->value = new int(value);
    }

    // 析构函数
    ~Integer() {
        if (this->value != NULL) {
            delete this->value;
            this->value = NULL;
        }
    }

private:
    int *value;
};

ostream &operator<<(ostream &out, Integer &integer) {
    out << "Integer(value=" << *integer.value << ")";
    return out;
}

int main() {
    Integer a(1);
    Integer b;

    b = a;

    cout << b << endl;
    cout << a << endl;
}

```

输出

```bash
main(80931,0x7ff852fb4fc0) malloc: *** error for object 0x6000027f8040: pointer being freed was not allocated
main(80931,0x7ff852fb4fc0) malloc: *** set a breakpoint in malloc_error_break to debug
Integer(value=1)
Integer(value=1)

```

示例：深拷贝

```cpp
#include <iostream>

using namespace std;

class Integer {
    friend ostream &operator<<(ostream &out, Integer &a);

public:
    // 构造函数
    Integer(int value = 0) {
        // 将数据开辟到堆区
        this->value = new int(value);
    }

    // 重载赋值运算符
    Integer &operator=(Integer &other) {
        if (this->value != NULL) {
            delete this->value;
            this->value = NULL;
        }

		// 编译器提供的代码是浅拷贝
		// this->value = other.value;

        // 提供深拷贝 解决浅拷贝的问题
        this->value = new int(*other.value);

        return *this;
    }

    // 析构函数
    ~Integer() {
        if (this->value != NULL) {
            delete this->value;
            this->value = NULL;
        }
    }

private:
    int *value;
};

ostream &operator<<(ostream &out, Integer &integer) {
    out << "Integer(value=" << *integer.value << ")";
    return out;
}

int main() {
    Integer a(1);
    Integer b;

    b = a;

    cout << b << endl;
    cout << a << endl;
}

```

输出

```bash
Integer(value=1)
Integer(value=1)
```

### 关系运算符重载

作用：重载关系运算符，可以让两个自定义类型对象进行对比操作

示例：

```cpp
#include <iostream>

using namespace std;

class Point {
    friend ostream &operator<<(ostream &out, Point point);

public:
    Point(int x, int y) : x(x), y(y) {
    }

    bool operator==(const Point &other) const {
        return x == other.x && y == other.y;
    }

    bool operator!=(const Point &other) const {
        return !(*this == other);
    }

private:
    int x;
    int y;
};

ostream &operator<<(ostream &out, Point point) {
    out << "Point(x=" << point.x << ", y=" << point.y << ")" << endl;
    return out;
}

int main() {
    Point p1(1, 2);
    Point p2(1, 2);

    if (p1 == p2) {
        cout << "p1 == p2" << endl; // p1 == p2
    } else {
        cout << "p1 != p2" << endl;
    }

    if (p1 != p2) {
        cout << "p1 != p2" << endl;
    } else {
        cout << "p1 == p2" << endl; // p1 == p2
    }
}
```

输出

```bash
p1 == p2
p1 == p2
```


### 函数调用运算符重载

- 函数调用运算符 `()` 也可以重载
- 由于重载后使用的方式非常像函数的调用，因此称为`仿函数`
- 仿函数没有固定写法，非常灵活

示例：

```cpp
#include <iostream>

using namespace std;

class Point {
    friend ostream &operator<<(ostream &out, Point point);

public:
    Point &operator()(int value) {
        this->x = value;
        this->y = value;
        return *this;
    }

private:
    int x;
    int y;
};

ostream &operator<<(ostream &out, Point point) {
    out << "Point(x=" << point.x << ", y=" << point.y << ")" << endl;
    return out;
}

int main() {
    Point p;

    p(10);
    cout << p << endl;
    // Point(x=10, y=10)

    
    // 匿名对象调用
    cout << Point()(20) << endl;
    // Point(x=20, y=20)
}

```