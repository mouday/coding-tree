# 面向对象-继承 

继承是面向对象三大特性之一

有些类与类之间存在特殊的关系，例如下图中：

![](https://mouday.github.io/img/2024/10/10/03n9x9s.png)

我们发现，定义这些类时，下级别的成员除了拥有上一级的共性，还有自己的特性。

这个时候我们就可以考虑利用继承的技术，减少重复代码

## 1、继承的基本语法

例如我们看到很多网站中，都有公共的头部，公共的底部，甚至公共的左侧列表，只有中心内容不同

接下来我们分别利用普通写法和继承的写法来实现网页中的内容，看一下继承存在的意义以及好处

普通实现：

```cpp
#include <iostream>

using namespace std;

//Java页面
class Java {
public:
    void header() {
        cout << "公共头部" << endl;
    }

    void footer() {
        cout << "公共底部" << endl;
    }

    void content() {
        cout << "JAVA" << endl;
    }
};

//Python页面
class Python {
public:
    void header() {
        cout << "公共头部" << endl;
    }

    void footer() {
        cout << "公共底部" << endl;
    }

    void content() {
        cout << "Python" << endl;
    }
};

//C++页面
class CPP {
public:
    void header() {
        cout << "公共头部" << endl;
    }

    void footer() {
        cout << "公共底部" << endl;
    }

    void content() {
        cout << "C++" << endl;
    }
};


int main() {
    //Java页面
    cout << "======== Java ========" << endl;
    Java java;
    java.header();
    java.footer();
    java.content();
    cout << "================" << endl;

    //Python页面
    cout << "======== Python ======== " << endl;
    Python python;
    python.header();
    python.footer();
    python.content();
    cout << "================" << endl;

    //C++页面
    cout << "======== C++ ========" << endl;
    CPP cpp;
    cpp.header();
    cpp.footer();
    cpp.content();
    cout << "================" << endl;

    return 0;
}

```

输出结果

```bash
======== Java ========
公共头部
公共底部
JAVA
================
======== Python ======== 
公共头部
公共底部
Python
================
======== C++ ========
公共头部
公共底部
C++
================
```

继承实现：

```cpp
#include <iostream>

using namespace std;

//公共页面
class BasePage {
public:
    void header() {
        cout << "公共头部" << endl;
    }

    void footer() {
        cout << "公共底部" << endl;
    }
};

//Java页面
class Java : public BasePage {
public:
    void content() {
        cout << "JAVA" << endl;
    }
};

//Python页面
class Python : public BasePage {
public:
    void content() {
        cout << "Python" << endl;
    }
};

//C++页面
class CPP : public BasePage {
public:
    void content() {
        cout << "C++" << endl;
    }
};


int main() {
    //Java页面
    cout << "======== Java ========" << endl;
    Java java;
    java.header();
    java.footer();
    java.content();
    cout << "================" << endl;

    //Python页面
    cout << "======== Python ======== " << endl;
    Python python;
    python.header();
    python.footer();
    python.content();
    cout << "================" << endl;

    //C++页面
    cout << "======== C++ ========" << endl;
    CPP cpp;
    cpp.header();
    cpp.footer();
    cpp.content();
    cout << "================" << endl;

    return 0;
}

```

输出结果和普通实现一致

总结：

继承的好处：`可以减少重复的代码`

```cpp
class B{};

class A : public B{};
```

A 类称为`子类` 或 `派生类`

B 类称为`父类` 或 `基类`

派生类中的成员，包含两大部分：

一类是从基类继承过来的，一类是自己增加的成员。

从基类继承过过来的表现其`共性`，而新增的成员体现了其`个性`。


## 2、继承方式

继承的语法：`class 子类 : 继承方式 父类`

继承方式一共有三种：

1. 公共继承
2. 保护继承
3. 私有继承

![](https://mouday.github.io/img/2024/10/10/pzenatm.png)

示例：

1、公共继承

```cpp
class Base1 {
public:
    int m_A;

protected:
    int m_B;

private:
    int m_C;
};

// 公共继承
class Son1 : public Base1 {
public:
    void func() {
        m_A; // 可访问 public权限
        m_B; // 可访问 protected权限
        //m_C; //不可访问
    }
};

void myClass() {
    Son1 s1;
    s1.m_A; //其他类只能访问到公共权限
}
```

2、保护继承

```cpp
// 保护继承
class Base2 {
public:
    int m_A;

protected:
    int m_B;

private:
    int m_C;
};

class Son2 : protected Base2 {
public:
    void func() {
        m_A; // 可访问 protected权限
        m_B; // 可访问 protected权限
        //m_C; //不可访问
    }
};

void myClass2() {
    Son2 s;
    //s.m_A; //不可访问
}
```

3、私有继承

```cpp

//私有继承
class Base3 {
public:
    int m_A;

protected:
    int m_B;

private:
    int m_C;
};

class Son3 : private Base3 {
public:
    void func() {
        m_A; //可访问 private权限
        m_B; //可访问 private权限
        //m_C; //不可访问
    }
};

class GrandSon3 : public Son3 {
public:
    void func() {
        //Son3是私有继承，所以继承Son3的属性在GrandSon3中都无法访问到
        //m_A;
        //m_B;
        //m_C;
    }
};

```

https://www.bilibili.com/video/BV1et411b73Z/?p=129&spm_id_from=pageDriver&vd_source=efbb4dc944fa761b6e016ce2ca5933da