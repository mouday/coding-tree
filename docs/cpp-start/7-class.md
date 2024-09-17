# 面向对象

面向对象的三个特性：封装、继承、多态

## 封装

## 属性和行为

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

## 权限控制

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