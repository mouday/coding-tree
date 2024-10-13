# 面向对象-多态

## 1、多态的基本概念

多态是C++面向对象三大特性之一

多态分为两类

- 静态多态: 函数重载 和 运算符重载属于静态多态，复用函数名
- 动态多态: 派生类和虚函数实现运行时多态


静态多态和动态多态区别：

- 静态多态的函数地址早绑定 - 编译阶段确定函数地址
- 动态多态的函数地址晚绑定 - 运行阶段确定函数地址


下面通过案例进行讲解多态

不使用虚函数virtual

```cpp
#include <iostream>

using namespace std;

class Animal {
public:
    void speak() {
        cout << "动物在说话" << endl;
    }
};

class Cat : public Animal {
public:
    void speak() {
        cout << "小猫在说话" << endl;
    }
};

void DoSpeak(Animal &animal) {
    animal.speak();
}

int main() {
    Cat cat;
    DoSpeak(cat); // 动物在说话

    return 0;
}

```

使用虚函数virtual

```cpp
#include <iostream>

using namespace std;

class Animal {
public:
    //Speak函数就是虚函数
    //函数前面加上virtual关键字，变成虚函数，那么编译器在编译的时候就不能确定函数调用了。
    virtual void speak() {
        cout << "动物在说话" << endl;
    }
};

class Cat : public Animal {
public:
    void speak() {
        cout << "小猫在说话" << endl;
    }
};

class Dog : public Animal {
public:
    void speak() {
        cout << "小狗在说话" << endl;
    }
};

//我们希望传入什么对象，那么就调用什么对象的函数
//如果函数地址在编译阶段就能确定，那么静态联编
//如果函数地址在运行阶段才能确定，就是动态联编

void DoSpeak(Animal &animal) {
    animal.speak();
}

//
//多态满足条件：
//1、有继承关系
//2、子类重写父类中的虚函数
//多态使用：
//父类指针或引用指向子类对象

int main() {
    Cat cat;
    DoSpeak(cat); // 小猫在说话


    Dog dog;
    DoSpeak(dog); // 小狗在说话
    
    return 0;
}

```

总结：

多态满足条件

- 有继承关系
- 子类重写父类中的虚函数

多态使用条件

- 父类指针或引用指向子类对象

重写：函数返回值类型 函数名 参数列表 完全一致称为重写

原理：

vfptr 虚函数指针
- v virtual
- f function
- ptr pointer

vftable 虚函数表

## 2、多态案例一-计算器类

案例描述：

分别利用普通写法和多态技术，设计实现两个操作数进行运算的计算器类

多态的优点：

- 代码组织结构清晰
- 可读性强
- 利于前期和后期的扩展以及维护

总结：C++开发提倡利用多态设计程序架构，因为多态优点很多

示例：

1、普通实现

```cpp
#include <iostream>

using namespace std;

//普通实现
class Calculator {
public:
    int getResult(string oper) {
        if (oper == "+") {
            return m_Num1 + m_Num2;
        } else if (oper == "-") {
            return m_Num1 - m_Num2;
        } else if (oper == "*") {
            return m_Num1 * m_Num2;
        }
        //如果要提供新的运算，需要修改源码
    }

public:
    int m_Num1;
    int m_Num2;
};


int main() {
    //普通实现测试
    Calculator c;
    c.m_Num1 = 10;
    c.m_Num2 = 10;

    cout << c.m_Num1 << " + " << c.m_Num2 << " = " << c.getResult("+") << endl;

    cout << c.m_Num1 << " - " << c.m_Num2 << " = " << c.getResult("-") << endl;

    cout << c.m_Num1 << " * " << c.m_Num2 << " = " << c.getResult("*") << endl;

    return 0;
}

```

2、多态实现

```cpp
#include <iostream>

using namespace std;

//多态实现
//抽象计算器类
//多态优点：代码组织结构清晰，可读性强，利于前期和后期的扩展以及维护
class AbstractCalculator {
public :
    virtual int getResult() {
        return 0;
    }

    int m_Num1;
    int m_Num2;
};

//加法计算器
class AddCalculator : public AbstractCalculator {
public:
    int getResult() {
        return m_Num1 + m_Num2;
    }
};

//减法计算器
class SubCalculator : public AbstractCalculator {
public:
    int getResult() {
        return m_Num1 - m_Num2;
    }
};

//乘法计算器
class MulCalculator : public AbstractCalculator {
public:
    int getResult() {
        return m_Num1 * m_Num2;
    }
};

int main() {
    //创建加法计算器
    AbstractCalculator *abc = new AddCalculator;
    abc->m_Num1 = 10;
    abc->m_Num2 = 10;
    cout << abc->m_Num1 << " + " << abc->m_Num2 << " = " << abc->getResult() << endl;
    delete abc; //用完了记得销毁

    //创建减法计算器
    abc = new SubCalculator;
    abc->m_Num1 = 10;
    abc->m_Num2 = 10;
    cout << abc->m_Num1 << " - " << abc->m_Num2 << " = " << abc->getResult() << endl;
    delete abc;

    //创建乘法计算器
    abc = new MulCalculator;
    abc->m_Num1 = 10;
    abc->m_Num2 = 10;
    cout << abc->m_Num1 << " * " << abc->m_Num2 << " = " << abc->getResult() << endl;
    delete abc;
    return 0;
}

```

## 3、纯虚函数和抽象类

在多态中，通常父类中虚函数的实现是毫无意义的，主要都是调用子类重写的内容

因此可以将虚函数改为纯虚函数

纯虚函数语法：`virtual 返回值类型 函数名 （参数列表）= 0;`

当类中有了纯虚函数，这个类也称为 `抽象类`

抽象类特点：

- 无法实例化对象
- 子类必须重写抽象类中的纯虚函数，否则也属于抽象类

示例：

```cpp
#include <iostream>

using namespace std;

class Base {
public:
    //纯虚函数
    //类中只要有一个纯虚函数就称为 抽象类
    //抽象类无法实例化对象
    //子类必须重写父类中的纯虚函数，否则也属于抽象类
    virtual void func() = 0;
};

class Son : public Base {
public:
    virtual void func() {
        cout << "func调用" << endl;
    };
};


int main() {
    Base *base = NULL;
    //base = new Base; // 错误，抽象类无法实例化对象
    base = new Son;
    base->func(); // func调用
    
    delete base; //记得销毁
    return 0;
}

```

## 4、多态案例二-制作饮品

案例描述：

制作饮品的大致流程为：煮水 - 冲泡 - 倒入杯中 - 加入辅料

利用多态技术实现本案例，提供抽象制作饮品基类，提供子类制作咖啡和茶叶

示例：

```cpp
#include <iostream>

using namespace std;

// 抽象制作饮品
class AbstractDrinking {
public:
    //烧水
    virtual void Boil() = 0;

    //冲泡
    virtual void Brew() = 0;

    //倒入杯中
    virtual void PourInCup() = 0;

    //加入辅料
    virtual void PutSomething() = 0;

    //规定流程
    void MakeDrink() {
        Boil();
        Brew();
        PourInCup();
        PutSomething();
    }
};

//制作咖啡
class Coffee : public AbstractDrinking {
public:
    //烧水
    virtual void Boil() {
        cout << "煮农夫山泉!" << endl;
    }

    //冲泡
    virtual void Brew() {
        cout << "冲泡咖啡!" << endl;
    }

    //倒入杯中
    virtual void PourInCup() {
        cout << "将咖啡倒入杯中!" << endl;
    }

    //加入辅料
    virtual void PutSomething() {
        cout << "加入牛奶!" << endl;
    }
};

//制作茶水
class Tea : public AbstractDrinking {
public:
    //烧水
    virtual void Boil() {
        cout << "煮自来水!" << endl;
    }

    //冲泡
    virtual void Brew() {
        cout << "冲泡茶叶!" << endl;
    }

    //倒入杯中
    virtual void PourInCup() {
        cout << "将茶水倒入杯中!" << endl;
    }

    //加入辅料
    virtual void PutSomething() {
        cout << "加入枸杞!" << endl;
    }
};

//业务函数
void DoWork(AbstractDrinking *drink) {
    drink->MakeDrink();
    delete drink;
}

int main() {
    DoWork(new Coffee);
    cout << "--------------" << endl;
    DoWork(new Tea);
    return 0;
}

```
输出
```bash
煮农夫山泉!
冲泡咖啡!
将咖啡倒入杯中!
加入牛奶!
--------------
煮自来水!
冲泡茶叶!
将茶水倒入杯中!
加入枸杞!
```

## 5、虚析构和纯虚析构

多态使用时，如果子类中有属性开辟到堆区，那么父类指针在释放时无法调用到子类的析构代码

解决方式：将父类中的析构函数改为虚析构或者纯虚析构

虚析构和纯虚析构共性：

- 可以解决父类指针释放子类对象
- 都需要有具体的函数实现


虚析构和纯虚析构区别：

- 如果是纯虚析构，该类属于抽象类，无法实例化对象

虚析构语法：

```
virtual ~类名(){}
```

纯虚析构语法：

```cpp
virtual ~类名() = 0;

类名::~类名(){}
```

总结：

1. 虚析构或纯虚析构就是用来解决通过父类指针释放子类对象

2. 如果子类中没有堆区数据，可以不写为虚析构或纯虚析构

3. 拥有纯虚析构函数的类也属于抽象类

示例：

```cpp
#include <iostream>

using namespace std;

class Animal {
public:
    Animal() {
        cout << "Animal 构造函数调用！" << endl;
    }

    virtual void Speak() = 0;

    //析构函数加上virtual关键字，变成虚析构函数
    //virtual ~Animal()
    //{
    //	cout << "Animal虚析构函数调用！" << endl;
    //}

    // 纯虚析构函数
    // 和包含普通纯虚函数的类一样，包含了纯虚析构函数的类也是一个抽象类。不能够被实例化。
    virtual ~Animal() = 0;
};

Animal::~Animal() {
    cout << "Animal 纯虚析构函数调用！" << endl;
}


class Cat : public Animal {
public:
    Cat(string name) {
        cout << "Cat构造函数调用！" << endl;
        m_Name = new string(name);
    }

    virtual void Speak() {
        cout << *m_Name << "小猫在说话!" << endl;
    }

    ~Cat() {
        cout << "Cat析构函数调用!" << endl;
        if (this->m_Name != NULL) {
            delete m_Name;
            m_Name = NULL;
        }
    }

public:
    string *m_Name;
};


int main() {
    Animal *animal = new Cat("Tom");
    animal->Speak();

    //通过父类指针去释放，会导致子类对象可能清理不干净，造成内存泄漏
    //怎么解决？给基类增加一个虚析构函数
    //虚析构函数就是用来解决通过父类指针释放子类对象
    delete animal;
    return 0;
}

```

输出

```bash
Animal 构造函数调用！
Cat构造函数调用！
Tom小猫在说话!
Cat析构函数调用!
Animal 纯虚析构函数调用！
```

## 6、多态案例三-电脑组装

案例描述：

电脑主要组成部件为 CPU（用于计算），显卡（用于显示），内存条（用于存储）

将每个零件封装出抽象基类，并且提供不同的厂商生产不同的零件，例如Intel厂商和Lenovo厂商

创建电脑类提供让电脑工作的函数，并且调用每个零件工作的接口

测试时组装三台不同的电脑进行工作

示例：

```cpp
#include <iostream>

using namespace std;

//抽象CPU类
class CPU {
public:
    //抽象的计算函数
    virtual void calculate() = 0;
};

//抽象显卡类
class VideoCard {
public:
    //抽象的显示函数
    virtual void display() = 0;
};

//抽象内存条类
class Memory {
public:
    //抽象的存储函数
    virtual void storage() = 0;
};

//电脑类
class Computer {
public:
    Computer(CPU *cpu, VideoCard *vc, Memory *mem) {
        m_cpu = cpu;
        m_vc = vc;
        m_mem = mem;
    }

    //提供工作的函数
    void work() {
        //让零件工作起来，调用接口
        m_cpu->calculate();

        m_vc->display();

        m_mem->storage();
    }

    //提供析构函数 释放3个电脑零件
    ~Computer() {
        //释放CPU零件
        if (m_cpu != NULL) {
            delete m_cpu;
            m_cpu = NULL;
        }

        //释放显卡零件
        if (m_vc != NULL) {
            delete m_vc;
            m_vc = NULL;
        }

        //释放内存条零件
        if (m_mem != NULL) {
            delete m_mem;
            m_mem = NULL;
        }
    }

private:
    CPU *m_cpu; //CPU的零件指针
    VideoCard *m_vc; //显卡零件指针
    Memory *m_mem; //内存条零件指针
};

//具体厂商
//Intel厂商
class IntelCPU : public CPU {
public:
    virtual void calculate() {
        cout << "Intel的CPU开始计算了！" << endl;
    }
};

class IntelVideoCard : public VideoCard {
public:
    virtual void display() {
        cout << "Intel的显卡开始显示了！" << endl;
    }
};

class IntelMemory : public Memory {
public:
    virtual void storage() {
        cout << "Intel的内存条开始存储了！" << endl;
    }
};

//Lenovo厂商
class LenovoCPU : public CPU {
public:
    virtual void calculate() {
        cout << "Lenovo的CPU开始计算了！" << endl;
    }
};

class LenovoVideoCard : public VideoCard {
public:
    virtual void display() {
        cout << "Lenovo的显卡开始显示了！" << endl;
    }
};

class LenovoMemory : public Memory {
public:
    virtual void storage() {
        cout << "Lenovo的内存条开始存储了！" << endl;
    }
};


int main() {
    //第一台电脑零件
    CPU *intelCpu = new IntelCPU;
    VideoCard *intelCard = new IntelVideoCard;
    Memory *intelMem = new IntelMemory;

    cout << "第一台电脑开始工作：" << endl;
    //创建第一台电脑
    Computer *computer1 = new Computer(intelCpu, intelCard, intelMem);
    computer1->work();
    delete computer1;

    cout << "-----------------------" << endl;
    cout << "第二台电脑开始工作：" << endl;
    //第二台电脑组装
    Computer *computer2 = new Computer(new LenovoCPU, new LenovoVideoCard, new LenovoMemory);;
    computer2->work();
    delete computer2;

    cout << "-----------------------" << endl;
    cout << "第三台电脑开始工作：" << endl;
    //第三台电脑组装
    Computer *computer3 = new Computer(new LenovoCPU, new IntelVideoCard, new LenovoMemory);;
    computer3->work();
    delete computer3;

    return 0;
}

```

输出

```bash
第一台电脑开始工作：
Intel的CPU开始计算了！
Intel的显卡开始显示了！
Intel的内存条开始存储了！
-----------------------
第二台电脑开始工作：
Lenovo的CPU开始计算了！
Lenovo的显卡开始显示了！
Lenovo的内存条开始存储了！
-----------------------
第三台电脑开始工作：
Lenovo的CPU开始计算了！
Intel的显卡开始显示了！
Lenovo的内存条开始存储了！
```

https://www.bilibili.com/video/BV1et411b73Z/?p=143&spm_id_from=pageDriver&vd_source=efbb4dc944fa761b6e016ce2ca5933da