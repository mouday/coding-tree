# sstream

处理字符串流

```cpp
// basic_istringstream
class basic_istringstream: public basic_istream{
    basic_istringstream()
    explicit basic_istringstream(
        const string_type& string,
        ios_base::openmode mode = ios_base::in
    )

    string_type str()

    void str(const string_type& string)
}

// basic_ostringstream
class basic_ostringstream: public basic_ostream{
    basic_ostringstream();

    explicit basic_ostringstream(
        const string_type& string,
        ios_base::openmode mode = ios_base::out
    );

    string_type str();
    void str(const string_type& string)
}

// basic_stringstream
class basic_stringstream : public basic_iostream{
    basic_stringstream()
    explicit basic_stringstream(
        const string_type& string,
        ios_base::openmode mode = ios_base::in | ios_base::out
    )

    string_type str()

    void str(const string_type& string)
}

// alias
using istringstream = basic_istringstream<char>;
using ostringstream = basic_ostringstream<char>;
using stringstream  = basic_stringstream<char>;
```

## ostringstream

示例

```cpp
#include <sstream>
#include <iostream>

int main(int argc, char const *argv[])
{
    std::ostringstream oss;

    oss << "hello" << "world!";

    std::string text = oss.str();

    std::cout << text << std::endl;

    return 0;
}

```

输出结果

```shell
g++ sstream.cpp -o sstream && ./sstream 
helloworld!
```

## istringstream

示例

```cpp
// istringstream.cpp
#include <sstream>
#include <iostream>

int main(int argc, char const *argv[])
{
    std::string data = "10 3.14";
    std::istringstream iss(data);

    int a;
    double b;

    iss >> a >> b;

    std::cout << "a: " << a << std::endl;
    std::cout << "b: " << b << std::endl;

    return 0;
}
```

输出结果

```shell
g++ istringstream.cpp -o istringstream && ./istringstream
a: 10
b: 3.14
```

## stringstream

示例

```cpp
// stringstream.cpp
#include <sstream>
#include <iostream>

int main(int argc, char const *argv[])
{
    std::string data = "10 3.14";
    std::stringstream ss(data);

    // 读取数据
    int a;
    double b;

    ss >> a >> b;

    std::cout << "a: " << a << std::endl;
    std::cout << "b: " << b << std::endl;

    ss.clear(); // 清除状态标志
    ss.str(""); // 清空内容
    
    // 写入数据
    ss << "hello world";

    std::string result = ss.str();
    std::cout << "result: " << result << std::endl;

    return 0;
}
```

输出结果

```shell
g++ stringstream.cpp -o stringstream &&./stringstream
a: 10
b: 3.14
result: hello world
```
