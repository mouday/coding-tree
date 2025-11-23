# fstream

C++ 文件输入输出库

## 类继承关系

```cpp

class basic_fstream: public basic_iostream {
    basic_fstream();

    explicit basic_fstream(
        const string& filename, 
        ios_base::openmode mode = ios_base::in | ios_base::out
    );

    bool is_open() const;

    /**
     * 打开文件
     */
    void open(
        const string& filename, 
        ios_base::openmode mode = ios_base::in | ios_base::out
    );

    void close();
}

using fstream  = basic_fstream<char>;
```

## 常见mode模式

| mode模式 | 说明
| - | -
| `std::ios::in` | 以输入模式打开文件
| `std::ios::out` | 以输出模式打开文件
| `std::ios::app`| 以追加模式打开文件
| `std::ios::ate`| 打开文件并定位到文件末尾
| `std::ios::trunc`| 打开文件并截断文件，即清空文件内容

## 写入文本文件

```cpp
#include <fstream>

int main(int argc, char const *argv[])
{
    std::fstream fs;

    // 以输出模式打开文件
    fs.open("test.txt", std::ios::out);
    // 写入文本
    fs << "Hello, World!" << std::endl;

    // 关闭文件
    fs.close();

    return 0;
}
```

输出

```shell
cat test.txt 
Hello, World!
```

## 读取文本文件

```cpp
#include <fstream>
#include <iostream>

int main(int argc, char const *argv[])
{
    std::fstream fs;

    // 以读模式打开文件
    fs.open("test.txt", std::ios::in);

    // 逐行读取
    std::string text;
    while (getline(fs, text))
    {
        std::cout << text << std::endl;
    }

    // 关闭文件
    fs.close();

    return 0;
}
```

输出

```shell
g++ fstream_read.cpp -o fstream_read && ./fstream_read
Hello, World!
```
