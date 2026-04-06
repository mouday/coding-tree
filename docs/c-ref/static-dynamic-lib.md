# 静态库和动态库

## 标准头文件

默认路径为：

```shell
/usr/include

/usr/local/include
```

全局指定头文件路径

```shell
# C
export C_INCLUDE_PATH=$C_INCLUDE_PATH:头文件路径

# CPP
export CPLUS_INCLUDE_PATH=$CPLUS_INCLUDE_PATH:头文件路径
```

编译时指定头文件路径

```shell
gcc -I./include -o main main.c
```

说明：

- `-I` 指定头文件路径

## 链接库文件

链接库类型 | linux | windows | macos
-|-|-|-
静态库 | `.a` | `.lib` | `.a`
动态库 | `.so` | `.dll` | `.dylib`

默认链接库路径

```shell
/usr/lib

/usr/local/lib
```

全局指定链接库搜索路径

```shell
# 动态库
export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:库文件路径

# 静态库
export LIBRARY_PATH=$LIBRARY_PATH:库文件路径
```

编译时指定

```shell
# 动态库搜索路径
gcc -L./lib -lfoo main.c

# 静态库搜索路径
gcc -L./lib -static -lfoo main.c
```

说明：

- `-L` 指定链接库文件路径
- `-l` 指定链接库名称


## 生成静态库并使用

代码目录

```shell
tree
.
├── main.c
├── include
│   └── utils.h
├── lib
│   ├── libutils.a
└── src
    └── utils.c
```

utils.h

```cpp
#ifndef UTILS_H
#define UTILS_H

int add(int a, int b);

#endif // UTILS_H
```

utils.c

```cpp
#include "utils.h"

int add(int a, int b)
{
    return a + b;
}
```

main.c

```cpp
#include <stdio.h>
#include "utils.h"

int main()
{
    int a = 1, b = 2;
    int c = 0;
    c = add(a, b);

    printf("c: %d\n", c);

    return 0;
}
```

生成静态库

```shell
# 1、将源码编译成.o文件
gcc -I./include -c ./src/utils.c -o ./lib/utils.o

# 2、使用ar将.o文件归档为.a静态库文件，注意命名以前缀`lib` 开头
ar crv ./lib/libutils.a ./lib/utils.o
```

使用静态库

```shell
gcc -L./lib -lutils -I./include main.c

# 输出
./a.out 
c: 3
```

静态库分析工具

```shell
#!/bin/bash
# analyze_library.sh

LIBRARY="lib/libutils.a"

echo "=== 静态库分析 ==="
echo ""

echo "1. 查看库文件信息:"
file $LIBRARY
echo ""

echo "2. 查看库包含的目标文件:"
ar t $LIBRARY
echo ""

echo "3. 查看符号表:"
nm $LIBRARY
echo ""

echo "4. 查看未定义符号:"
nm -u $LIBRARY
echo ""

echo "5. 查看大小信息:"
size -m $LIBRARY 2>/dev/null || size $LIBRARY
echo ""

echo "6. 查看目标文件详细信息:"
for obj in $(ar t $LIBRARY); do
    echo "--- $obj ---"
    ar p $LIBRARY $obj | objdump -t | head -20
    echo ""
done

echo "7. 依赖分析:"
otool -L $LIBRARY 2>/dev/null || echo "动态依赖分析不适用于静态库"
echo ""
```

## 生成动态库并使用

使用上面的示例代码

生成动态库

```shell
# macos 使用 .dylib 后缀
gcc -fPIC -shared -I./include ./src/utils.c -o ./lib/libutils.dylib
```

使用动态库

```shell
gcc -L./lib -lutils -I./include main.c
./a.out 
c: 3
```

## LC_RPATH

LC_RPATH 是 macOS 中动态链接器（dyld）使用的运行时路径

它告诉动态链接器在哪些目录中搜索动态库（.dylib 文件）

类似于 Linux 中的 RPATH 或 LD_LIBRARY_PATH

检查现有的 RPATH

```shell
# 查看二进制文件的依赖库
otool -L ./a.out

otool -l a.out | grep -A 3 LC_RPATH
```

### 开发阶段

cmake

```shell
# 在 CMakeLists.txt 中添加

# 启用 RPATH
set(CMAKE_MACOSX_RPATH 1)

 # 构建时不使用安装 RPATH
set(CMAKE_SKIP_BUILD_RPATH FALSE)
set(CMAKE_BUILD_WITH_INSTALL_RPATH FALSE)

# 设置安装时的 RPATH
set(CMAKE_INSTALL_RPATH "@executable_path/../lib")
set(CMAKE_INSTALL_NAME_DIR "@rpath")

# 或者为特定目标设置
target_link_libraries(your_target PRIVATE your_library)
set_target_properties(your_target PROPERTIES
    MACOSX_RPATH ON
    INSTALL_RPATH "@executable_path/../lib"
)
```

Makefile

```shell
# 编译时添加 -rpath 参数
CFLAGS += -Wl,-rpath,@executable_path/../Frameworks
CFLAGS += -Wl,-rpath,/usr/local/lib
```

### 运行阶段

已编译的二进制文件

方式一：DYLD_LIBRARY_PATH

```shell
export DYLD_LIBRARY_PATH=./build:$DYLD_LIBRARY_PATH
```

方式二：install_name_tool

```shell
install_name_tool -add_rpath @executable_path/build ./a.out

otool -l ./a.out | grep -A 2 LC_RPATH
```
