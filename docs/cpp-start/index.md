# 课程笔记：C++零基础入门到精通

课程：2024新版黑马程序员C++零基础入门到精通

视频地址：https://www.bilibili.com/video/BV1ZH4y137ws/
学习资料：https://www.yuque.com/bigdata-caoyu/newcpp

@[TOC](目录)

## VSCode

https://code.visualstudio.com/

安装扩展包：
- chinese
- c/c++
- c/c++ Themes
- c/c++ extension pack
- cMake
- cMake Tools

## CLion下载地址

https://www.jetbrains.com.cn/clion/

CLion设置

快捷键

- Shift + Alt + 键盘上/下 控制当前行上下移动
- Ctrl + d 复制当前行
- home/end 移动到行首/行尾
- Ctrl + 键盘左/右 光标左右跳单词
- Ctrl + a 全选
- Ctrl + c 复制
- Ctrl + v 粘贴






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

