# C++基础入门

## Hello, World

```cpp
// main.cpp

// 代码预处理指令
#include <iostream>

int main() {
    std::cout << "Hello, World!" << std::endl;
    // 输出：Hello, World!
    return 0;
}

```

## 单工程多main函数

项目结构

```
a.cpp
b.cpp
CMakeLists.txt
```


```cpp
// a.cpp
#include <iostream>

int main() {
    std::cout << "A" << std::endl;
    return 0;
}

```

```cpp
// b.cpp
#include <iostream>

int main() {
    std::cout << "B" << std::endl;
    return 0;
}

```


CMakeLists.txt

```shell
# CMakeLists.txt
cmake_minimum_required(VERSION 3.29)
project(cpp_demo)

set(CMAKE_CXX_STANDARD 11)

add_executable(a a.cpp)
add_executable(b b.cpp)

```
> 关键点：需要添加对应的`add_executable`，如果改完配置不生效，可以右键项目：`Reload Cmake Project`


## 手动编译运行

Windows需要下载安装 `MinGW` 套件

https://sourceforge.net/projects/mingw/

下载安装包

- mingw32-base
- mingw32-gcc-g++

安装完成后，添加系统环境变量

检查编译环境

```bash
$ g++ -v
Apple clang version 15.0.0 (clang-1500.3.9.4)
```


准备代码

```cpp
// main.cpp
#include <iostream>

int main(){
    std::cout << "Hello World!" << std::endl;
    return 0;
}
```


编译运行

```shell
# 编译
$ g++ main.cpp -o main

# 查看编译结果
$ ls
main            main.cpp

# 运行
$ ./main 
Hello World!

```

## 输出到控制台

示例：输出内容到控制台

```cpp
// cout.cpp
#include <iostream>
using namespace std;

int main() {
    cout << "Hello World!" << endl;

    cout << "Hello" << " World!" << endl;

    return 0;
}

```

输出结果

```
Hello World!
Hello World!
```

## 注释

```cpp
// 单行注释

/**
 * 多行注释
 */
```

## 字面常量

```cpp
int i = 21; // 整数字面常量

float f = 3.14; // 小数字面常量

char c = 'c'; // 字符字面常量

char* string = "string"; // 字符串字面常量
```

## 标识符

- 数字、字母、下划线
- 数字不能开头
- 不能是关键字


## 符号常量

```cpp
#include <iostream>

// 定义符号常量，不需要分号结尾
#define PI 3.14

int main(){
	// 使用符号常量
	std::cout << PI << std::endl;
	// 输出：3.14

	return 0;
}
```


## 中文乱码问题

方式一：引入`windows.h`库

```cpp
#include "windows.h" // 第一步：引入依赖库

SetConsoleOutputCP(CP_UTF8); // 第二步：设置编码
```

示例

```cpp
#include <iostream>
#include "windows.h" // 第一步：引入依赖库

int main(){
	SetConsoleOutputCP(CP_UTF8); // 第二步：设置编码

    std::cout << "你好，CPP" << std::endl;
    // 你好，CPP
    return 0;
}
```

方式二：使用`system`设置字体

```cpp
system("chcp 65001"); // 设置字体为utf8
```

示例

```cpp
#include <iostream>

int main(){
	system("chcp 65001"); // 设置字体为utf8

    std::cout << "你好，CPP" << std::endl;
    // 你好，CPP
    return 0;
}
```
> 会有额外语句输出

## 变量

```cpp
#include <iostream>

int main() {
    // 1、申明变量
    int age;

    // 2、变量赋值
    age = 18;

    // 3、变量取值
    std::cout << "age = " << age << std::endl;
    // age = 18
    return 0;
}

```

https://www.bilibili.com/video/BV1ZH4y137ws?p=18
