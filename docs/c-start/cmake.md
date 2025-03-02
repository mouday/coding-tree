# CMake简明教程

## CMake初体验

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

CMake 会生成Makefile
Make 调用Makefile中的命令

4、CMake流程

示例 CMakeLists.txt

```shell
# 最小版本
cmake_minimum_required(VERSION 3.15)

# 项目名
project(Hello)

# 生成可执行文件
add_executable(${PROJECT_NAME} main.c)

```

```shell
# 生成Makefile
cmake -B build

# 生成项目
cmake --build build
```

```shell
cmake --version
cmake version 3.29.6 (CMake; JetBrains IDE bundle; build 1)
debugging support enabled

CMake suite maintained and supported by Kitware (kitware.com/cmake).
```
