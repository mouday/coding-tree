# string

用于处理字符串

## 基本语法

```cpp
// 声明字符串变量：
std::string str;

// 初始化字符串：
std::string str = "Hello, World!";
```

## 成员函数

函数名 | 描述 
|-|-
size() | 返回字符串的长度（字符数）
length() | 与 size() 相同，返回字符串的长度
empty() | 判断字符串是否为空
at() | 访问字符串中指定位置的字符（带边界检查）
substr() | 返回从指定位置开始的子字符串
find() | 查找子字符串在字符串中的位置
rfind() | 从字符串末尾开始查找子字符串的位置
replace() | 替换字符串中的部分内容
append() | 在字符串末尾添加内容
insert() | 在指定位置插入内容
erase() | 删除指定位置的字符或子字符串
clear() | 清空字符串
c_str() | 返回 C 风格的字符串（以 null 结尾）
data() | 返回指向字符数据的指针（C++11 及之后的版本）
compare() | 比较两个字符串。
find_first_of() | 查找第一个匹配任意字符的位置
find_last_of() | 查找最后一个匹配任意字符的位置
find_first_not_of() | 查找第一个不匹配任意字符的位置
find_last_not_of() | 查找最后一个不匹配任意字符的位置
`operator[]` | 访问字符串中指定位置的字符

示例

```cpp
#include <iostream>
#include <string>

int main() {
    std::string str = "Hello, World!";
    std::cout << str << std::endl;
}
```

输出结果

```shell
Hello, World!
```

## size

返回字符串的长度

```cpp
size_type size() const
```

示例

```cpp
#include <iostream>
#include <string>

int main() {
    std::string str = "Hello";
    std::cout << str.size() << std::endl;
}
```

输出结果

```shell
5
```

## length

与 size() 相同，返回字符串的长度

```cpp
size_type length() const
```

示例

```cpp
#include <iostream>
#include <string>

int main() {
    std::string str = "Hello";
    std::cout << str.length() << std::endl;
}
```

输出结果

```shell
5
```

## empty

判断字符串是否为空

```cpp
bool empty() const
```

示例

```cpp
#include <iostream>
#include <string>

int main() {
    std::string str = "Hello";
    std::cout << std::boolalpha << str.empty() << std::endl;
}
```

输出结果

```shell
false
```

## `operator[]`

访问字符串中指定位置的字符

```cpp
const_reference operator[](size_type pos) const 

reference operator[](size_type pos)
```

示例

```cpp
#include <iostream>
#include <string>

int main() {
    std::string str = "Hello";
    const char data = str[1];
    std::cout << data << std::endl;
}
```

输出结果

```shell
e
```

## at

访问字符串中指定位置的字符（带边界检查）

```cpp
// std::out_of_range
const_reference at(size_type n) const

reference at(size_type n)
```

示例

```cpp
#include <iostream>
#include <string>

int main() {
    std::string str = "Hello";
    const char data = str.at(1);
    std::cout << data << std::endl;
}
```

输出结果

```shell
e
```

## substr

返回从指定位置开始的子字符串

```cpp
basic_string substr(size_type pos = 0, size_type n = npos) const
```

示例

```cpp
#include <iostream>
#include <string>

int main() {
    std::string str = "Hello";
    std::string sub = str.substr(1, 2);
    std::cout << sub << std::endl;
}
```

输出结果

```shell
el
```

## find

查找子字符串在字符串中的位置

```cpp
size_type find(const basic_string& str, size_type pos = 0) const noexcept;

size_type find(const value_type* s, size_type pos, size_type n) const noexcept;
```

示例

```cpp
#include <iostream>
#include <string>

int main() {
    std::string str = "Hello";
    size_t pos = str.find("ll");
    std::cout << pos << std::endl;
}
```

输出结果

```shell
2
```

## rfind

从字符串末尾开始查找子字符串的位置

```cpp
size_type rfind(const basic_string& str, size_type pos = npos) const noexcept;

size_type rfind(const value_type* s, size_type pos, size_type n) const noexcept;
```

示例

```cpp
#include <iostream>
#include <string>

int main() {
    std::string str = "Hello";
    size_t pos = str.rfind("ll");
    std::cout << pos << std::endl;
}
```

输出结果

```shell
2
```

## replace

替换字符串中的部分内容

```cpp
basic_string& replace(size_type pos, size_type n1, const value_type* s);
```

示例

```cpp
#include <iostream>
#include <string>

int main() {
    std::string str = "Hello";
    str.replace(2, 1, "xx");
    std::cout << str << std::endl;
}
```

输出结果

```shell
Hexxlo
```

## append

在字符串末尾添加内容

```cpp
basic_string& append(const basic_string& str)
```

示例

```cpp
#include <iostream>
#include <string>

int main() {
    std::string str = "Hello";
    str.append("xx");
    std::cout << str << std::endl;
}
```

输出结果

```shell
Helloxx
```

## `operator+=`

在字符串末尾添加内容

```cpp
basic_string& operator+=(const basic_string& str);
```

示例

```cpp
#include <iostream>
#include <string>

int main() {
    std::string str = "Hello";
    str += "xx";
    std::cout << str << std::endl;
}
```

输出结果

```shell
Helloxx
```

## insert

在指定位置插入内容

```cpp
basic_string& insert(size_type pos, const basic_string& str)
```

示例

```cpp
#include <iostream>
#include <string>

int main() {
    std::string str = "Hello";
    str.insert(2, "xx");
    std::cout << str << std::endl;
}
```

输出结果

```shell
Hexxllo
```

## erase

删除指定位置的字符或子字符串

```cpp
basic_string& erase(size_type pos = 0, size_type n = npos);
```

示例

```cpp
#include <iostream>
#include <string>

int main() {
    std::string str = "Hello";
    str.erase(1, 2);
    std::cout << str << std::endl;
}
```

输出结果

```shell
Hlo
```

## clear

清空字符串

```cpp
void clear() noexcept
```

示例

```cpp
#include <iostream>
#include <string>

int main() {
    std::string str = "Hello";
    str.clear();
    std::cout << std::boolalpha << str.empty() << std::endl;
}
```

输出结果

```shell
true
```

## c_str

返回 C 风格的字符串（以 null 结尾）

```cpp
const value_type* c_str() const
```

示例

```cpp
#include <iostream>
#include <string>

int main() {
    std::string str = "Hello";
    const char* data = str.c_str();
    std::cout << data << std::endl;
}
```

输出结果

```shell
Hello
```

## data 

返回指向字符数据的指针（C++11 及之后的版本）

```cpp
const value_type* data() const noexcept
```

示例

```cpp
#include <iostream>
#include <string>

int main() {
    std::string str = "Hello";
    const char* data = str.data();
    std::cout << data << std::endl;
}
```

输出结果

```shell
Hello
```

## compare

比较两个字符串。

```cpp
int compare(const value_type* s) const noexcept
```

示例

```cpp
#include <iostream>
#include <string>

int main() {
    std::string str = "Hello";
    int result = str.compare("World");
    std::cout << result << std::endl;
}
```

输出结果

```shell
# 首字母：H - W 等价于 72 - 87 = -15
-15
```

## find_first_of

查找第一个匹配任意字符的位置

```cpp
size_type find_first_of(const basic_string& str, size_type pos = 0) const noexcept;
```

示例

```cpp
#include <iostream>
#include <string>

int main() {
    std::string str = "Hello";
    size_t result = str.find_first_of("l");
    std::cout << result << std::endl;
}
```

输出结果

```shell
2
```

## find_last_of

查找最后一个匹配任意字符的位置

```cpp
// static const size_type npos = -1;
size_type find_last_of(const basic_string& str, size_type pos = npos) const noexcept;
```

示例

```cpp
#include <iostream>
#include <string>

int main() {
    std::string str = "Hello";
    size_t result = str.find_last_of("l");
    std::cout << result << std::endl;
}
```

输出结果

```shell
3
```

## find_first_not_of

查找第一个不匹配任意字符的位置

```cpp
size_type find_first_not_of(const basic_string& str, size_type pos = 0) const noexcept;
```

示例

```cpp
#include <iostream>
#include <string>

int main() {
    std::string str = "ooxxoo";
    size_t result = str.find_first_not_of("o");
    std::cout << result << std::endl;
}
```

输出结果

```shell
2
```

## find_last_not_of

查找最后一个不匹配任意字符的位置

```cpp
size_type find_last_not_of(const basic_string& str, size_type pos = npos) const noexcept;
```

示例

```cpp
#include <iostream>
#include <string>

int main() {
    std::string str = "ooxxoo";
    size_t result = str.find_last_not_of("o");
    std::cout << result << std::endl;
}
```

输出结果

```shell
3
```
