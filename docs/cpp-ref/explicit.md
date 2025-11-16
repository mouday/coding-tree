# explicit

作用：防止编译器进行不期望的隐式类型转换

使用场景：单参数构造函数、转换运算符

好处：提高代码安全性，明确编程意图

现代C++建议：默认给单参数构造函数加上explicit，多参数构造函数通常不需要explicit

不使用explicit

```cpp
class FooClass{
public:
    FooClass(int x) : data(x) {}
private:
    int data;
};

int main(int argc, char const *argv[])
{
    FooClass foo(10); // 正确，显式调用构造函数
    FooClass foo2 = 20;  // 正确，隐式调用构造函数
    return 0;
}
```

使用explicit

```cpp
class FooClass{
public:
    explicit FooClass(int x) : data(x) {}
private:
    int data;
};

int main(int argc, char const *argv[])
{
    FooClass foo(10); // 正确，显式调用构造函数
    // FooClass foo2 = 20; // 错误，不能进行隐式
    return 0;
}
```

示例：禁止隐式转换

```cpp
#include <iostream>

class FooClass{
public:
    explicit FooClass(int x) : data(x) {}

    void show() const{
        std::cout << "Data: " << data << std::endl;
    }
private:
    int data;
};

void printValue(const FooClass& foo){
    // 打印逻辑
    foo.show();
}

int main(int argc, char const *argv[])
{
    
    // FooClass foo2 = 20; // 错误，不能隐式转换
    // printValue(20); // 错误，不能隐式转换

    FooClass foo(10); // 正确，直接初始化
    FooClass foo1 = FooClass(10); // 正确，显式转换
    printValue(FooClass(10)); // 正确，显式调用构造函数

    return 0;
}

```
