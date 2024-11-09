# string容器

## 1 string基本概念

本质：

string是C++风格的字符串，而string本质上是一个类

`string`和`char *` 区别：

- `char *` 是一个指针
- string是一个类，类内部封装了char*，管理这个字符串，是一个char*型的容器。


特点：

string 类内部封装了很多成员方法

例如：查找find，拷贝copy，删除delete 替换replace，插入insert

string管理char*所分配的内存，不用担心复制越界和取值越界等，由类内部进行负责

## 2 string构造函数

构造函数原型：

```cpp
//  创建一个空的字符串, 例如: string str; 
string();

// 使用字符串s初始化
string(const char* s);

// 使用一个string对象初始化另一个string对象
string(const string& str);

// 使用n个字符c初始化
string(int n, char c); 
```

总结：string的多种构造方式没有可比性，灵活使用即可

示例：

```cpp
#include <string>
#include <iostream>

using namespace std;

//string构造
void test01() {
    string s1; //创建空字符串，调用无参构造函数
    cout << "str1 = " << s1 << endl;
    // str1 =


    const char *str = "hello world";
    string s2(str); //把c_string转换成了string

    cout << "str2 = " << s2 << endl;
    // str2 = hello world


    string s3(s2); //调用拷贝构造函数
    cout << "str3 = " << s3 << endl;
    // str3 = hello world


    string s4(10, 'a');
    cout << "str4 = " << s4 << endl;
    // str4 = aaaaaaaaaa
}

int main() {
    test01();

    return 0;
}

```

## 3 string赋值操作

功能描述：

给string字符串进行赋值

赋值的函数原型：

```cpp
// char*类型字符串 赋值给当前的字符串
string& operator=(const char* s);

//把字符串s赋给当前的字符串
string& operator=(const string &s);

//字符赋值给当前的字符串
string& operator=(char c);

// 把字符串s赋给当前的字符串
string& assign(const char *s);
 
// 把字符串s的前n个字符赋给当前的字符串
string& assign(const char *s, int n);

// 把字符串s赋给当前字符串
string& assign(const string &s);

//用n个字符c赋给当前字符串
string& assign(int n, char c);
```

总结：

string的赋值方式很多，`operator=` 这种方式是比较实用的

示例：

```cpp
#include <string>
#include <iostream>

using namespace std;

//赋值
void test01() {
    string str1;
    str1 = "hello world";
    cout << "str1 = " << str1 << endl;
    // str1 = hello world

    string str2;
    str2 = str1;
    cout << "str2 = " << str2 << endl;
    // str2 = hello world

    string str3;
    str3 = 'a';
    cout << "str3 = " << str3 << endl;
    // str3 = a

    string str4;
    str4.assign("hello c++");
    cout << "str4 = " << str4 << endl;
    // str4 = hello c++

    string str5;
    str5.assign("hello c++", 5);
    cout << "str5 = " << str5 << endl;
    // str5 = hello


    string str6;
    str6.assign(str5);
    cout << "str6 = " << str6 << endl;
    // str6 = hello

    string str7;
    str7.assign(5, 'x');
    cout << "str7 = " << str7 << endl;
    // str7 = xxxxx
}

int main() {
    test01();

    return 0;
}

```

## 4 string字符串拼接

功能描述:

实现在字符串末尾拼接字符串

函数原型：

```cpp
//重载+=操作符
string& operator+=(const char* str);

//重载+=操作符
string& operator+=(const char c);

//重载+=操作符
string& operator+=(const string& str);

//把字符串s连接到当前字符串结尾
string& append(const char *s);

//把字符串s的前n个字符连接到当前字符串结尾
string& append(const char *s, int n);

//同operator+=(const string& str)
string& append(const string &s);

//字符串s中从pos开始的n个字符连接到字符串结尾
string& append(const string &s, int pos, int n);
```

总结：字符串拼接的重载版本很多，初学阶段记住几种即可

示例：

```cpp
#include <string>
#include <iostream>

using namespace std;

//字符串拼接
void test01() {
    string str1 = "我";
    str1 += "爱玩游戏";
    cout << "str1 = " << str1 << endl;
    // str1 = 我爱玩游戏

    str1 += ':';
    cout << "str1 = " << str1 << endl;
    // str1 = 我爱玩游戏:

    string str2 = "LOL DNF";
    str1 += str2;
    cout << "str1 = " << str1 << endl;
    // str1 = 我爱玩游戏:LOL DNF

    string str3 = "I";
    str3.append(" love ");
    str3.append("game abcde", 4);
    //str3.append(str2);
    str3.append(str2, 4, 3); // 从下标4位置开始 ，截取3个字符，拼接到字符串末尾
    cout << "str3 = " << str3 << endl;
    // str3 = I love gameDNF
}

int main() {
    test01();

    return 0;
}
```


## 5 string查找和替换

**功能描述：**

* 查找：查找指定字符串是否存在
* 替换：在指定的位置替换字符串

**函数原型：**

```cpp
//查找str第一次出现位置,从pos开始查找
int find(const string& str, int pos = 0) const;

//查找s第一次出现位置,从pos开始查找
int find(const char* s, int pos = 0) const;

//从pos位置查找s的前n个字符第一次位置
int find(const char* s, int pos, int n) const;

//查找字符c第一次出现位置
int find(const char c, int pos = 0) const;

//查找str最后一次位置,从pos开始查找
int rfind(const string& str, int pos = npos) const;

//查找s最后一次出现位置,从pos开始查找
int rfind(const char* s, int pos = npos) const;` 

//从pos查找s的前n个字符最后一次位置
int rfind(const char* s, int pos, int n) const;

//查找字符c最后一次出现位置
int rfind(const char c, int pos = 0) const;

//替换从pos开始n个字符为字符串str
string& replace(int pos, int n, const string& str);

//替换从pos开始的n个字符为字符串s
string& replace(int pos, int n,const char* s);
```

示例

```cpp
#include <string>
#include <iostream>

using namespace std;

//查找和替换
void test01() {
    //查找
    string str1 = "abcdefgde";

    int pos = str1.find("de");

    if (pos == -1) {
        cout << "未找到" << endl;
    } else {
        cout << "pos = " << pos << endl;
        // pos = 3
    }


    pos = str1.rfind("de");


    cout << "pos = " << pos << endl;
    // pos = 7
}

void test02() {
    //替换
    string str1 = "abcdefgde";
    str1.replace(1, 3, "1111");

    cout << "str1 = " << str1 << endl;
    // str1 = a1111efgde
}

int main() {
    test01();
    test02();

    return 0;
}

```

总结：

* find查找是从左往后，rfind从右往左
* find找到字符串后返回查找的第一个字符位置，找不到返回-1
* replace在替换时，要指定从哪个位置起，多少个字符，替换成什么样的字符串


## 6 string字符串比较

功能描述：

- 字符串之间的比较

比较方式：

字符串比较是按字符的ASCII码进行对比

- `=` 返回   0

- `>`返回  1 

- `<` 返回  -1

总结：字符串对比主要是用于比较两个字符串是否相等，判断谁大谁小的意义并不是很大


函数原型：

```cpp
// 与字符串s比较
int compare(const string &s) const;

// 与字符串s比较
int compare(const char *s) const;
```


示例

```cpp
#include <string>
#include <iostream>

using namespace std;

//字符串比较
void test01() {
    string s1 = "hello";
    string s2 = "aello";

    int ret = s1.compare(s2);

    if (ret == 0) {
        cout << "s1 等于 s2" << endl;
    } else if (ret > 0) {
        cout << "s1 大于 s2" << endl;
    } else {
        cout << "s1 小于 s2" << endl;
    }
    // output: s1 大于 s2
}

int main() {
    test01();

    return 0;
}

```

## 7 string字符存取


string中单个字符存取方式有两种

```cpp
// 通过[]方式取字符
char& operator[](int n);

// 通过at方法获取字符
char& at(int n);
```


示例：

```cpp
#include <string>
#include <iostream>

using namespace std;


void test01() {
    string str = "hello world";

    // []
    for (int i = 0; i < str.size(); i++) {
        cout << str[i] << " ";
    }
    cout << endl;

    // at
    for (int i = 0; i < str.size(); i++) {
        cout << str.at(i) << " ";
    }
    cout << endl;


    //字符修改
    str[0] = 'x';
    str.at(1) = 'x';
    cout << str << endl;
}

int main() {
    test01();


    return 0;
}

```

总结：string字符串中单个字符存取有两种方式，利用 `[]` 或 `at`


## 8 string插入和删除

功能描述：

* 对string字符串进行插入和删除字符操作

函数原型：

```cpp
// 插入字符串
string& insert(int pos, const char* s);

// 插入字符串
string& insert(int pos, const string& str); 

// 在指定位置插入n个字符c
string& insert(int pos, int n, char c);

// 删除从Pos开始的n个字符 
string& erase(int pos, int n = npos);
```
示例：

```cpp
#include <string>
#include <iostream>

using namespace std;

//字符串插入和删除
void test01() {
    string str = "hello";
    str.insert(1, "111");
    cout << str << endl;
    // h111ello

    str.erase(1, 3); //从1号位置开始3个字符
    cout << str << endl;
    // hello
}

int main() {
    test01();

    return 0;
}

```

总结：插入和删除的起始下标都是从0开始


## 9 string子串

功能描述：

- 从字符串中获取想要的子串



函数原型：

```cpp
// 返回由pos开始的n个字符组成的字符串
string substr(int pos = 0, int n = npos) const;
```

示例：

```cpp
#include <string>
#include <iostream>

using namespace std;

//子串
void test01() {
    string str = "abcdefg";
    string subStr = str.substr(1, 3);
    cout << "subStr = " << subStr << endl;
    // subStr = bcd
    
    string email = "hello@sina.com";
    int pos = email.find("@");
    string username = email.substr(0, pos);
    cout << "username: " << username << endl;
    // username: hello
}

int main() {
    test01();

    return 0;
}

```

总结：灵活的运用求子串功能，可以在实际开发中获取有效的信息
