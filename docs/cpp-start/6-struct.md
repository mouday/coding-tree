# 结构体

## 1 结构体基本概念

结构体属于用户自定义的数据类型，允许用户存储不同的数据类型

## 2 结构体定义和使用

语法：`struct 结构体名 { 结构体成员列表 };`

通过结构体创建变量的方式有三种：

```cpp
struct 结构体名 变量名

struct 结构体名 变量名 = { 成员1值 ， 成员2值...}

定义结构体时顺便创建变量
```

总结：
1. 定义结构体时的关键字是`struct`，不可省略

2. 创建结构体变量时，关键字struct可以省略

3. 结构体变量利用操作符 `.` 访问成员

示例：

```cpp
#include <iostream>

using namespace std;

//结构体定义
struct student {
    //成员列表
    string name; //姓名
    int age; //年龄
    int score; //分数
} stu3; //结构体变量创建方式3


int main() {
    //结构体变量创建方式1
    struct student stu1; //struct 关键字可以省略

    stu1.name = "张三";
    stu1.age = 18;
    stu1.score = 100;

    cout << "姓名：" << stu1.name << " 年龄：" << stu1.age << " 分数：" << stu1.score << endl;

    //结构体变量创建方式2
    struct student stu2 = {"李四", 19, 60};

    cout << "姓名：" << stu2.name << " 年龄：" << stu2.age << " 分数：" << stu2.score << endl;

    //结构体变量创建方式3
    stu3.name = "王五";
    stu3.age = 18;
    stu3.score = 80;


    cout << "姓名：" << stu3.name << " 年龄：" << stu3.age << " 分数：" << stu3.score << endl;

    return 0;
}

```

## 3 结构体数组

作用：将自定义的结构体放入到数组中方便维护

语法： `struct 结构体名 数组名[元素个数] = { {} , {} , ... {} }`

示例：

```cpp
#include <iostream>

using namespace std;

//结构体定义
struct student {
    //成员列表
    string name; //姓名
    int age; //年龄
    int score; //分数
};

int main() {
    //结构体数组
    struct student arr[3] =
    {
        {"张三", 18, 80},
        {"李四", 19, 60},
        {"王五", 20, 70}
    };

    for (int i = 0; i < 3; i++) {
        cout << "姓名：" << arr[i].name
                << " 年龄：" << arr[i].age
                << " 分数：" << arr[i].score
                << endl;
    }

    return 0;
}

```

## 4 结构体指针

作用：通过指针访问结构体中的成员

利用操作符 `->` 可以通过结构体指针访问结构体属性

示例：

```cpp
#include <iostream>

using namespace std;

//结构体定义
struct student {
    //成员列表
    string name; //姓名
    int age; //年龄
    int score; //分数
};


int main() {
    struct student stu = {"张三", 18, 100,};

    struct student *p = &stu;

    p->score = 80; // 指针通过 -> 操作符可以访问成员

    cout << "姓名：" << p->name << " 年龄：" << p->age << " 分数：" << p->score << endl;

    return 0;
}

```

## 5 结构体嵌套结构体

作用： 结构体中的成员可以是另一个结构体

例如：每个老师辅导一个学员，一个老师的结构体中，记录一个学生的结构体

示例：

```cpp
#include <iostream>
#include <string>

using namespace std;

//学生结构体定义
struct student {
    //成员列表
    string name; //姓名
    int age; //年龄
    int score; //分数
};

//教师结构体定义
struct teacher {
    //成员列表
    int id; //职工编号
    string name; //教师姓名
    int age; //教师年龄
    struct student stu; //子结构体 学生
};


int main() {
    struct teacher t1;
    t1.id = 10000;
    t1.name = "老王";
    t1.age = 40;

    t1.stu.name = "张三";
    t1.stu.age = 18;
    t1.stu.score = 100;

    cout << "教师 职工编号： " << t1.id
            << " 姓名： " << t1.name
            << " 年龄： " << t1.age
            << endl;

    cout << "辅导学员 姓名： " << t1.stu.name
            << " 年龄：" << t1.stu.age
            << " 考试分数： " << t1.stu.score
            << endl;

    return 0;
}

```
## 6 结构体做函数参数

作用：将结构体作为参数向函数中传递

传递方式有两种：

- 值传递
- 地址传递

总结：如果不想修改主函数中的数据，用值传递，反之用地址传递

示例：

```cpp
#include <iostream>
#include <string>

using namespace std;

//学生结构体定义
struct student {
    //成员列表
    string name; //姓名
    int age; //年龄
    int score; //分数
};

//值传递
void printStudent1(student stu) {
    stu.age = 100;
    cout << "子函数中 姓名：" << stu.name
            << " 年龄： " << stu.age
            << " 分数：" << stu.score
            << endl;
}

//地址传递
void printStudent2(student *stu) {
    stu->age = 200;
    cout << "子函数中 姓名：" << stu->name
            << " 年龄： " << stu->age
            << " 分数：" << stu->score
            << endl;
}

int main() {
    student stu = {"张三", 18, 100};
    //值传递
    printStudent1(stu);
    cout << "主函数中 姓名：" << stu.name
            << " 年龄： " << stu.age
            << " 分数：" << stu.score
            << endl;

    cout << endl;

    //地址传递
    printStudent2(&stu);
    cout << "主函数中 姓名：" << stu.name
            << " 年龄： " << stu.age
            << " 分数：" << stu.score << endl;

    return 0;
}

```

输出
```cpp
子函数中 姓名：张三 年龄： 100 分数：100
主函数中 姓名：张三 年龄： 18 分数：100

子函数中 姓名：张三 年龄： 200 分数：100
主函数中 姓名：张三 年龄： 200 分数：100

```

## 7 结构体中 const使用场景

作用：用const来防止误操作

示例：

```cpp
#include <iostream>
#include <string>

using namespace std;

//学生结构体定义
struct student {
    //成员列表
    string name; //姓名
    int age; //年龄
    int score; //分数
};

//const使用场景
//加const防止函数体中的误操作
void printStudent(const student *stu) {
    //stu->age = 100; //操作失败，因为加了const修饰
    cout << "姓名：" << stu->name
            << " 年龄：" << stu->age
            << " 分数：" << stu->score
            << endl;
}

int main() {
    student stu = {"张三", 18, 100};

    printStudent(&stu);
    // output
    // 姓名：张三 年龄：18 分数：100
    
    return 0;
}

```

## 8 结构体案例

### 案例1

案例描述：

学校正在做毕设项目，每名老师带领5个学生，总共有3名老师，需求如下

设计学生和老师的结构体，其中在老师的结构体中，有老师姓名和一个存放5名学生的数组作为成员

学生的成员有姓名、考试分数，创建数组存放3名老师，通过函数给每个老师及所带的学生赋值

最终打印出老师数据以及老师所带的学生数据。

示例：

```cpp
#include <iostream>
#include <string>

using namespace std;

struct Student {
    string name;
    int score;
};

struct Teacher {
    string name;
    Student sArray[5];
};

void allocateSpace(Teacher tArray[], int len) {
    string tName = "教师";
    string sName = "学生";
    string nameSeed = "ABCDE";

    for (int i = 0; i < len; i++) {
        tArray[i].name = tName + nameSeed[i];

        for (int j = 0; j < 5; j++) {
            tArray[i].sArray[j].name = sName + nameSeed[j];
            // [0-60] => [40-100]
            tArray[i].sArray[j].score = rand() % 61 + 40;
        }
    }
}

void printTeachers(Teacher tArray[], int len) {
    for (int i = 0; i < len; i++) {
        cout << tArray[i].name << endl;
        for (int j = 0; j < 5; j++) {
            cout << "\t姓名：" << tArray[i].sArray[j].name << " 分数：" << tArray[i].sArray[j].score << endl;
        }
    }
}

int main() {
    srand((unsigned int) time(NULL)); //随机数种子 头文件 #include <ctime>

    Teacher tArray[3]; //老师数组

    int len = sizeof(tArray) / sizeof(Teacher);

    allocateSpace(tArray, len); //创建数据

    printTeachers(tArray, len); //打印数据

    return 0;
}

```


输出

```cpp
教师A
	姓名：学生A 分数：55
	姓名：学生B 分数：43
	姓名：学生C 分数：68
	姓名：学生D 分数：52
	姓名：学生E 分数：58
教师B
	姓名：学生A 分数：42
	姓名：学生B 分数：72
	姓名：学生C 分数：47
	姓名：学生D 分数：48
	姓名：学生E 分数：64
教师C
	姓名：学生A 分数：90
	姓名：学生B 分数：68
	姓名：学生C 分数：54
	姓名：学生D 分数：50
	姓名：学生E 分数：94
```

### 2 案例2

案例描述：

设计一个英雄的结构体，包括成员姓名，年龄，性别;

创建结构体数组，数组中存放5名英雄。

通过冒泡排序的算法，将数组中的英雄按照年龄进行升序排序，最终打印排序后的结果。

五名英雄信息如下：

```cpp
{"刘备", 23, "男"},
{"关羽", 22, "男"},
{"张飞", 20, "男"},
{"赵云", 21, "男"},
{"貂蝉", 19, "女"},
```

示例：

```cpp
#include <iostream>
#include <string>

using namespace std;

//英雄结构体
struct hero {
    string name;
    int age;
    string sex;
};

//冒泡排序
void bubbleSort(hero arr[], int len) {
    for (int i = 0; i < len - 1; i++) {
        for (int j = 0; j < len - 1 - i; j++) {
            if (arr[j].age > arr[j + 1].age) {
                hero temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
}

//打印数组
void printHeros(hero arr[], int len) {
    for (int i = 0; i < len; i++) {
        cout << "姓名： " << arr[i].name 
            << " 性别： " << arr[i].sex 
            << " 年龄： " << arr[i].age 
            << endl;
    }
}

int main() {
    struct hero arr[5] =
    {
        {"刘备", 23, "男"},
        {"关羽", 22, "男"},
        {"张飞", 20, "男"},
        {"赵云", 21, "男"},
        {"貂蝉", 19, "女"},
    };

    int len = sizeof(arr) / sizeof(hero); //获取数组元素个数

    bubbleSort(arr, len); //排序

    printHeros(arr, len); //打印

    return 0;
}

```

输出

```cpp
姓名： 貂蝉 性别： 女 年龄： 19
姓名： 张飞 性别： 男 年龄： 20
姓名： 赵云 性别： 男 年龄： 21
姓名： 关羽 性别： 男 年龄： 22
姓名： 刘备 性别： 男 年龄： 23
```
