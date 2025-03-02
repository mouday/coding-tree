# CMake简明教程

![](https://mouday.github.io/img/2025/03/02/f3am8xi.png)

- CMake 官网 https://cmake.org/
- CMake 官方文档：https://cmake.org/cmake/help/latest/guide/tutorial/index.html
- CMake 源码：https://github.com/Kitware/CMake
- CMake 源码：https://gitlab.kitware.com/cmake/cmakeku

## 1、CMake初体验

### 1.1、CMake构建流程

1、CMake是什么

CMake：开源、跨平台自动化构建工具

2、C/C++源文件生成可执行程序的流程

```shell
1. 预处理 -E参数  宏替换等

2. 编译 -S参数 gcc/msvc/clang 

3. 汇编 -C参数 liunx-> .o文件、windows->.obj文件

4. 连接 多个二进制文件连接生成一个可执行文件
```

3、CMake Makefile Make关系：

- CMake 会生成Makefile
- Make 调用Makefile中的命令

4、CMake流程

确保已经安装cmake

```shell
cmake --version
cmake version 3.29.6
```

示例

项目结构

```shell
.
├── CMakeLists.txt
└── main.c
```

CMakeLists.txt

```shell
# 最小版本
cmake_minimum_required(VERSION 3.15)

# 项目名
project(Hello)

# 生成可执行文件
add_executable(${PROJECT_NAME} main.c)
```

main.c
```cpp
#include <stdio.h>

int main(int argc, char const *argv[])
{
    printf("hello world!\n");
    return 0;
}
```

构建步骤

```shell
# 在目录build 中生成Makefile
cmake -B build

# 生成可执行文件
cmake --build build
```

运行可执行文件

```shell
./build/Hello      
hello world!
```

### 1.2、Windows下使用cmake

下载安装

https://cmake.org/download/

- 默认MSVC vs2022 和 vs2019
- 可以安装MinGW（gcc与clang）

语法

```shell
cmake -G <generator-name> -T <toolset-spec> -A <platform-name> <path-to_source>
```

```shell
# 指定使用gcc
cmake -B build -G "MinGW Makefiles"

cmake --build build
```

### 1.3、Linux下使用cmake

1、安装cmake

方式一：

```shell
yum install cmake
```

方式二：

源码安装

2、使用cmake

```shell
# 在目录build 中生成Makefile
cmake -B build

# 生成可执行文件
cmake --build build
```

## 2、CMake语法

### 2.1、CMake语法概述

1、命令行工具：
- cmake
- ctest
- cpack
- cmake-gui
- ccmake

2、vscode插件

- CMake
- CMake Tools
- CMake Language Support


3、运行cmake文件

```shell
cmake -P *.cmake
```

例如

hello.cmake

```shell
message("hello")
```

运行cmake文件

```shell
$ cmake -P hello.cmake
hello
```

4、打印字符串

```shell
# 单行字符串
message("hello")

message(hello)

# 多行字符串 
message("hello
world")

message([[hello
world]])
```

5、获取变量

语法

```shell
${变量名}
```

示例

```shell
message(${CMAKE_VERSION})
# 3.29.6
```

6、设置变量

语法

```shell
set(<variable> <value>...[PARENT_SCOPE])
```

示例

```shell
set(name1 Tom)
message(${name1}) # Tom

set(name2 "Tom")
message(${name2}) # Tom

```

7、设置多个值

```shell
set(names1 Tom Jack Steve)
message(${names1}) # TomJackSteve

set(names2 Tom;Jack;Steve)
message(${names2}) # TomJackSteve
```

8、设置环境变量

```shell
# 设置变量
set(ENV{CPP} g++)

message($ENV{CPP}) # g++

# 取消
unset(ENV{CPP})

# 读取失败会报错
message($ENV{CPP})
# CMake Error at hello.cmake:8 (message):
#   message called with incorrect number of arguments

```

9、List方法

```shell
# 添加元素
list(APPEND <list> [<element>...])

# 删除元素
list(REMOTE_ITEM <list> <value>[value...])

# 获取元素个数
list(LENGTH <list> <output variable>)

# 查找元素，返回索引
list(FIND <list> <value> <output variable>)

# 插入元素
list(INSERT <list> <index> [<element>...])

# 反转list
list(REVERSE <list>)

# 排序
list(SORT <list> [...])
```

示例

创建list

```shell
set(ITEMS1 a1 a2 a3)
message(${ITEMS1}) # a1a2a3

list(APPEND ITEMS2 b1 b2 b3)
message(${ITEMS2}) # b1b2b3
```

获取长度

```shell
set(ITEMS1 a1 a2 a3)

list(LENGTH ITEMS1 len)

message(${len}) # 3
```

查找索引

```shell
set(ITEMS1 a1 a2 a3)

list(FIND ITEMS1 a3 index)
message(${index}) # 2
```

删除元素

```shell
set(ITEMS1 a1 a2 a3)

list(REMOVE_ITEM ITEMS1 a3)
message(${ITEMS1}) # a1a2
```

添加元素

```shell
set(ITEMS1 a1 a2 a3)

# 尾部添加
list(APPEND ITEMS1 b1)
message(${ITEMS1}) # a1a2a3b1

# 指定插入位置
list(INSERT ITEMS1 0 b0)
message(${ITEMS1}) # b0a1a2a3b1
```

反转

```shell
set(ITEMS1 a1 a2 a3)

list(REVERSE ITEMS1)
message(${ITEMS1}) # a3a2a1
```

排序

```shell
set(ITEMS1 1 3 2 4 5)

list(SORT ITEMS1)
message(${ITEMS1}) # 12345

```

### 3、流程控制

- if
- loop: break continue

1、if条件

```shell
if(<condition>)
    <commands>
elseif(<condition>)
    <commands>
else()
    <commands>
endif()
```

示例

```shell
set(VAR TRUE)

if(VAR)
    message(VAR is true)
else()
    message(VAR is false)
endif()
# VARistrue

```

NOT

```shell
set(VAR TRUE)

if(NOT VAR)
    message(VAR is not true)
else()
    message(VAR is true)
endif()
# VARistrue

```

OR

```shell
set(VAR TRUE)

if(NOT VAR OR VAR)
    message(VAR true)
else()
    message(VAR false)
endif()
# VARtrue

```
AND

```shell
set(VAR TRUE)

if(NOT VAR AND VAR)
    message(VAR true)
else()
    message(VAR false)
endif()
# VARfalse

```

LESS

```shell
if(1 LESS 2)
    message("1 LESS 2")
else()
    message("1 NOT LESS 2")
endif()
# 1 LESS 2
```

EQUAL

```shell
if(1 EQUAL "1")
    message("1 EQUAL 1")
else()
    message("1 NOT EQUAL 1")
endif()
# 1 EQUAL 1

```

2、loop循环

支持 break continue

2.1、foreach

```shell
foreach(<loop_var> RANGE <max>)
    <commands>
endforeach()

foreach(<loop_var> RANGE <min> <max> [<step>])
foreach(<loop_var> IN [LISTS <lists>] [ITEMS <items>])
```

示例


RANGE


```shell
foreach(var RANGE 3)
    message(${var})
endforeach()

# 0
# 1
# 2
# 3

```

IN LISTS

```shell
set(LIST 1 2 3)

foreach(var IN LISTS LIST ITEMS a b)
    message(${var})
endforeach()

# 1
# 2
# 3
# a
# b

```

IN ZIP_LISTS

```shell
set(L1 1 2 3)
set(L2 a b c)

foreach(var IN ZIP_LISTS L1 L2)
    message("${var_0}, ${var_1}")
endforeach()

# 1, a
# 2, b
# 3, c

```

2.2、while

```shell
while(<condition>)
    <commands>
endwhile()
```
示例

```shell
set(COUNT 0)

while(COUNT LESS 3)

    math(EXPR COUNT "${COUNT}+1")

    if(COUNT EQUAL 2)
        continue()
    endif()

    message("${COUNT}")
endwhile()

# 1
# 3

```