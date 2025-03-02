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

