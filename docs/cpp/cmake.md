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

### 2.2、流程控制

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

### 2.3、函数

函数定义

```cpp
function(<name> [<argument>...])
    <commands>
endfunction()
```

示例

```shell
# 定义
function(Foo Name)
    message("function: ${CMAKE_CURRENT_FUNCTION}")
    message("Name: ${Name}")
endfunction()

# 调用
Foo("Tom")
```

输出
```cpp
function: Foo
Name: Tom
```

### 2.4、Scope作用域

CMake的两种作用域

1. Function scope, 函数作用域

2. Directory Scope,add_subdirectory 嵌套目录，父CMakeLists.txt变量可以被子CMakeLists.txt文件使用

示例

```shell
function(InFunc)
    message("InFunc in: ${Var}")
    set(Var 3)
    message("InFunc out: ${Var}")
endfunction()

function(OutFunc)
    message("OutFunc in: ${Var}")
    set(Var 2)
    InFunc()
    message("OutFunc out: ${Var}")
endfunction()

set(Var 1)
message("Global in: ${Var}")
OutFunc()
message("Global out: ${Var}")

# output
# Global in: 1
# OutFunc in: 1
# InFunc in: 2
# InFunc out: 3
# OutFunc out: 2
# Global out: 1
```

### 2.5、宏

```shell
macro(<name> [<argument>...])
    <commands>
endmacro()
```

注意：会读就好，尽量不要写宏

示例

```shell
macro(Test Var)
    message("Test in: ${Var}")    
    set(Var 3)
    message("Test out: ${Var}")
endmacro()

set(Var 1)
message("Global in: ${Var}")
Test(2)
message("Global out: ${Var}")

# output
# Global in: 1
# Test in: 2
# Test out: 2
# Global out: 3

```

## 3、CMake构建项目的4种方式

### 3.1、直接写入源码路径的方式

add_executable中写入相对路径

源码中引入头文件时需要写相对路径

```shell
.
├── CMakeLists.txt
├── animal
│   ├── dog.c
│   └── dog.h
└── main.c
```

CMakeLists.txt
```shell
cmake_minimum_required(VERSION 3.15)

# 项目名
project(Animal)

# 可执行文件
add_executable(${PROJECT_NAME} main.c animal/dog.c)
```

main.c

```cpp
#include <stdio.h>
#include "animal/dog.h"

int main(int argc, char const *argv[])
{
    bark();

    return 0;
}

```
dog.h
```cpp
#pragma once

void bark();
```

dog.c
```cpp
#include "dog.h"
#include <stdio.h>

void bark(){
    printf("wang wang wang...\n");
}
```

编译运行

```shell
cmake -B build && cmake --build build && ./build/Animal
```

### 3.2、调用子目录cmake脚本的方法

include方法可以引入子目录中的cmake后缀的配置文件

将配置加入到add_executable中

项目结构

```shell
.
├── CMakeLists.txt
├── animal
│   ├── animal.cmake
│   ├── cat.c
│   ├── cat.h
│   ├── dog.c
│   └── dog.h
└── main.c
```

CMakeLists.txt

```shell
cmake_minimum_required(VERSION 3.15)

# 项目名
project(Animal)

# 引入子目录文件
include(animal/animal.cmake)

# 可执行文件
add_executable(${PROJECT_NAME} main.c ${animal_sources})

# cmake -B build && cmake --build build && ./build/Animal
```

animal.cmake
```shell
set(animal_sources animal/cat.c animal/dog.c)
```

main.c

```cpp
#include <stdio.h>
#include "animal/dog.h"
#include "animal/cat.h"

int main(int argc, char const *argv[])
{
    dog_bark();
    cat_bark();

    return 0;
}
```

cat.h
```cpp
#pragma once

void cat_bark();
```
cat.c
```cpp
#include "cat.h"
#include <stdio.h>

void cat_bark(){
    printf("cat bark...\n");
}
```
dog.h
```cpp
#pragma once

void dog_bark();
```
dog.c
```cpp
#include "dog.h"
#include <stdio.h>

void dog_bark(){
    printf("dog bark...\n");
}
```

### 3.3、CMakeLists嵌套

target_include_directories 头文件目录声明

target_link_libraries 连接库文件

add_subdirectory 添加子目录

add_library 生成库文件(默认static library)

项目结构
```shell
.
├── CMakeLists.txt
├── animal
│   ├── CMakeLists.txt
│   ├── cat.c
│   ├── cat.h
│   ├── dog.c
│   └── dog.h
└── main.c

2 directories, 7 files
```

./CMakeLists.txt

```shell
cmake_minimum_required(VERSION 3.15)

# 项目名
project(AnimalApp)

# 引入子目录文件
add_subdirectory(animal)

# 可执行文件
add_executable(${PROJECT_NAME} main.c)

target_link_libraries(${PROJECT_NAME} PUBLIC AnimalLib)

target_include_directories(${PROJECT_NAME} PUBLIC "${PROJECT_SOURCE_DIR}/animal")

# cmake -B build && cmake --build build && ./build/AnimalApp


```

./main.c

```cpp
#include <stdio.h>
#include "dog.h"
#include "cat.h"

int main(int argc, char const *argv[])
{
    dog_bark();
    cat_bark();

    return 0;
}

```

./animal/CMakeLists.txt

```shell
add_library(AnimalLib cat.c dog.c)
```

./animal/dog.h

```cpp
#pragma once

void dog_bark();
```

./animal/cat.c

```cpp
#include "cat.h"
#include <stdio.h>

void cat_bark(){
    printf("cat bark...\n");
}
```

./animal/cat.h

```cpp
#pragma once

void cat_bark();
```

./animal/dog.c

```cpp
#include "dog.h"
#include <stdio.h>

void dog_bark(){
    printf("dog bark...\n");
}
```

### 3.4、Object Libraries

add_library OBJECT（version >=3.12）

将 target_include_directories 移入子CMakeLists.txt中

项目结构和文件内容同3.3

修改如下

./animal/CMakeLists.txt
```shell
# add_library(AnimalLib cat.c dog.c)
add_library(AnimalLib OBJECT cat.c dog.c)
target_include_directories(AnimalLib PUBLIC .)
```

CMakeLists.txt

```shell
cmake_minimum_required(VERSION 3.15)

# 项目名
project(AnimalApp)

# 引入子目录文件
add_subdirectory(animal)

# 可执行文件
add_executable(${PROJECT_NAME} main.c)

target_link_libraries(${PROJECT_NAME} PUBLIC AnimalLib)

# target_include_directories(${PROJECT_NAME} PUBLIC "${PROJECT_SOURCE_DIR}/animal")
```


## 4、CMake与库

### 4.1、CMake生成动态库/静态库

- 静态库：打包到可执行文件中
- 动态库：运行时载入

命名区别：
- 静态库 
    - linux: `lib<name>.a`
    - macos: `lib<name>.a`
    - windows: `lib<name>.lib`
- 动态库 
    - linux: `lib<name>.so`
    - macos: `lib<name>.dylib`
    - windows: `lib<name>.ddl`
    

命令

```shell
file常用于搜索源文件

# 生成静态库
add_library(animal STATIC ${src})

# 生成动态库
add_library(animal SHARED ${src})

${LIBRARY_OUTPUT_PATH}导出目录
```

项目结构

```shell
.
├── CMakeLists.txt
├── include
│   └── dog.h
└── src
    └── dog.c

3 directories, 3 files
```

./CMakeLists.txt

```shell
cmake_minimum_required(VERSION 3.15)

# 项目名
project(Animal)

# 查找所有文件
file(GLOB SRC ${PROJECT_SOURCE_DIR}/src/*.c)

# 头文件
include_directories(${PROJECT_SOURCE_DIR}/include)

# 输出路径
set(LIBRARY_OUTPUT_PATH ${PROJECT_SOURCE_DIR}/lib)

# 静态库
# add_library(Animal STATIC ${SRC})

# 动态库
add_library(Animal SHARED ${SRC})

# cmake -B build && cmake --build build

```

./include/dog.h

```cpp
#pragma once

void dog_bark();
```

./src/dog.c

```cpp
#include "dog.h"
#include <stdio.h>

void dog_bark(){
    printf("dog bark...\n");
}
```

```shell
ls lib

libAnimal.a     
libAnimal.dylib
```

### 4.2、CMake调用静态库和动态库

静态库调用流程

1. 引入头文件
2. 连接静态库
3. 生成可执行二进制文件


动态库调用流程

1. 引入头文件
2. 声明库目录
3. 生成可执行二进制文件
4. 连接动态库

示例1：使用静态库

项目结构

```shell
.
├── CMakeLists.txt
├── include
│   └── dog.h
├── lib
│   └── libAnimal.a
└── main.c
```

./CMakeLists.txt

```shell
cmake_minimum_required(VERSION 3.15)

# 项目名
project(App)

# 头文件
include_directories(${PROJECT_SOURCE_DIR}/include)

link_directories(${PROJECT_SOURCE_DIR}/lib)

link_libraries(Animal)

add_executable(App main.c)

# cmake -B build && cmake --build build && ./build/App
```

./main.c

```cpp
#include <stdio.h>
#include "dog.h"

int main(int argc, char const *argv[])
{
    dog_bark();

    return 0;
}

```

./include/dog.h

```cpp
#pragma once

void dog_bark();
```


示例2：使用动态库

项目结构
```shell
.
├── CMakeLists.txt
├── include
│   └── dog.h
├── lib
│   └── libAnimal.dylib
└── main.c
```

./CMakeLists.txt

```shell
cmake_minimum_required(VERSION 3.15)

# 项目名
project(App)

# 头文件
include_directories(${PROJECT_SOURCE_DIR}/include)

link_directories(${PROJECT_SOURCE_DIR}/lib)

add_executable(App main.c)

target_link_libraries(App PUBLIC Animal)

# cmake -B build && cmake --build build && ./build/App
```

./main.c

```cpp
#include <stdio.h>
#include "dog.h"

int main(int argc, char const *argv[])
{
    dog_bark();

    return 0;
}

```

./include/dog.h

```cpp
#pragma once

void dog_bark();
```
