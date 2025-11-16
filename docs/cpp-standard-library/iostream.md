# iostream

C++ 标准输入输出

主要类

- std::istream：用于输入操作的抽象基类。
- std::ostream：用于输出操作的抽象基类。
- std::iostream：继承自std::istream和std::ostream，用于同时进行输入和输出操作。
- std::cin：标准输入流对象，通常与键盘关联。
- std::cout：标准输出流对象，通常与屏幕关联。
- std::cerr：标准错误输出流对象，不带缓冲，通常与屏幕关联。
- std::clog：标准日志流对象，带缓冲，通常与屏幕关联。

常用操作符

- `>>`：输入操作符，从输入流读取数据。
- `<<`：输出操作符，将数据写入输出流。

继承体系

```cpp

class ios_base{}

class basic_ios: public ios_base{}

class basic_istream: virtual public basic_ios{}

class basic_ostream: virtual public basic_ios{}

class basic_iostream: public basic_istream, public basic_ostream{}
```

## std::cout

示例

```cpp
#include <iostream>

int main(int argc, char const *argv[])
{
    std::cout << "Hello, World!" << std::endl;
    return 0;
}
```

输出

```shell
g++ iostream.cpp -o iostream && ./iostream
Hello, World!
```

## std::cin

示例

```cpp
#include <iostream>

int main(int argc, char const *argv[])
{
    std::string name;

    std::cout << "input:";
    std::cin >> name;

    std::cout << "name: " << name << std::endl;

    return 0;
}

```

输出

```shell
g++ iostream.cpp -o iostream && ./iostream
input:Tom
name: Tom
```
