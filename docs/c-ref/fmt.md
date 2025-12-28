# fmt

提供了类似 Python 的字符串插值功能，可以方便地将变量插入到字符串中

[https://github.com/fmtlib/fmt](https://github.com/fmtlib/fmt)

[https://fmt.dev/latest/get-started](https://fmt.dev/latest/get-started)

编译动态库

```shell
# 在目录build 中生成Makefile 编译动态库
cmake -B build -G 'Ninja' -DBUILD_SHARED_LIBS=TRUE

# 生成可执行文件
cmake --build build
```

示例

demo.cpp

```cpp
#include <fmt/base.h>

int main(int argc, const char* argv[]) {
  fmt::print("Hello, world!\n");

  fmt::print("Hello, {}\n", "Tom");

  return 0;
}
```

编译运行

```shell
# 设置动态库路径 macos
export DYLD_LIBRARY_PATH=./build:$DYLD_LIBRARY_PATH

# 编译运行
g++ -I./include -L./build -lfmt -std=c++11 demo.cpp
./a.out
Hello, world!
Hello, Tom
```
