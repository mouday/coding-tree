# argparse

使用 C++17 编写的命令行解析器，可以轻松定义用户友好的命令行参数

[https://github.com/p-ranav/argparse](https://github.com/p-ranav/argparse)

示例

```cpp
#include <argparse/argparse.hpp>

int main(int argc, char const *argv[]) {
  argparse::ArgumentParser program("app");

  program.add_argument("-c", "--color")
      .default_value(std::string{"orange"})
      .help("specify the cat's fur color");

  try {
    program.parse_args(argc, argv);
  } catch (const std::exception &err) {
    std::cerr << err.what() << std::endl;
    std::cerr << program;
    return 1;
  }

  std::string color = program.get<std::string>("--color");  // "orange"

  std::cout << "color: " << color << std::endl;
  return 0;
}

```

输出结果

```shell
# 指定头文件搜索路径即可，argparse/argparse.hpp
g++ -I./include -std=c++17 demo.cpp

# 使用默认参数
$ ./a.out
color: orange

# 使用传入参数
$ ./a.out --color red
color: red

# 短写模式
./a.out -c red
color: red

# 查看帮助
./a.out -h    
Usage: app [--help] [--version] [--color VAR]

Optional arguments:
  -h, --help     shows help message and exits 
  -v, --version  prints version information and exits 
  -c, --color    specify the cat's fur color [nargs=0..1] [default: "orange"]
```
