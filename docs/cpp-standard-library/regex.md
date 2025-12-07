# regex

正则表达式

正则表达式的基本组成

- 字符类：如 [abc] 表示匹配 a、b 或 c 中的任意一个字符。
- 量词：如 *（零次或多次）、+（一次或多次）、?（零次或一次）。
- 边界匹配：如 ^（行的开始）、$（行的结束）。
- 分组：使用圆括号 () 来创建一个分组。

常用正则语法

符号 | 含义 | 示例 |
|-|-|-
`.` | 任意字符 | `a.c 匹配 abc` |
`\d` | 数字 | `\d+` |
`\w` | 字母数字下划线 | `\w+` |
`\s` | 空白字符 | `\s+` |
`^` | 开头 | `^abc` |
`$` | 结尾 | `xyz$` |
`+` | 1 次或多次 | `a+` |
`*` | 0 次或多次 | `a*` |
`?` | 0 次或 1 次 | `a?` |
`{n,m}` | n~m 次 | `\d{2,4}` |
`()` | 捕获分组 | `(ab)+` |
`[]` | 字符集 | `[A-Z]` |
`|` | 或 | `cat | dog`

转义

1. 在 C++11 的使用正则表达式时，需要在字符串字面量中对反斜杠 `\` 进行转义，也就是写成双反斜杠 `\\`
2. C++11 也支持 原始字符串（raw string），可以避免双反斜杠，非常适合写复杂正则：

```cpp
// R"(...)" 里面内容不会做转义处理
regex re(R"(\d+)");       // 原始字符串，不需要写 \\d
```

> 为什么要双反斜杠？
> C++ 编译器会先处理字符串字面量的转义字符，而正则表达式引擎是后处理的。
> 例如你写 `\d+`，编译器会把 `\d` 视为未知转义字符报错或变成 `d`，正确写法 `\\d+`，编译器先把`\\` 转为 `\`，正则引擎再读到 `\d`。

主要类和函数

名称 | 说明
|-|-
std::regex | 编译正则表达式对象
std::smatch | std::string 匹配结果
std::cmatch | C 字符串匹配结果 (const char*)
std::sregex_iterator | 用于 std::string 的匹配迭代器
std::cregex_iterator | 用于 C 字符串的匹配迭代器
std::syntax_option_type | 正则语法选项
std::match_flag_type | 匹配控制标志
std::regex_match | 检查整个字符串是否与正则表达式匹配。
std::regex_search | 在字符串中搜索与正则表达式匹配的部分。
std::regex_replace| 替换字符串中与正则表达式匹配的部分。
std::sregex_iterator| 迭代器，用于遍历所有匹配项。

smatch 匹配结果对象

成员 | 说明 | 示例
|-|-|-
`m.str()` | 返回整个匹配到的内容 | `m.str()`
`m[i]` | 返回第 i 个捕获组 | `m[1].str()`
`m.position()` | 匹配起始位置 | `m.position(0)`
`m.size()` | 捕获组数量 | `m.size()`
`m.empty()` | 是否匹配为空 | `m.empty()`

## regex_match

检查整个字符串是否与正则表达式匹配。

```cpp
bool regex_match(
    const basic_string& s,
    const basic_regex& e,
    regex_constants::match_flag_type flags = regex_constants::match_default
)
```

示例

```cpp
#include <iostream>
#include <string>
#include <regex>

int main()
{
    std::string text = "id:24";
    std::regex pattern(R"(id:\d+)");

    bool result = std::regex_match(text, pattern);

    std::cout << std::boolalpha << result << std::endl;
}
```

输出结果

```shell
true
```

## regex_search

在字符串中搜索与正则表达式匹配的部分。

```cpp
bool regex_search(
    const basic_string& s,
    match_results& m,
    const basic_regex& e,
    regex_constants::match_flag_type flags = regex_constants::match_default
)
```

示例

```cpp
#include <iostream>
#include <string>
#include <regex>

int main()
{
    std::string text = "my years old is 24";
    std::regex re("\\d+");
    std::smatch match;

    std::regex_search(text, match, re);

    if (!match.empty())
    {
        std::cout << match.str() << std::endl;
    }
    else
    {
        std::cout << "not match" << std::endl;
    }
}
```

输出结果

```shell
24
```

## regex_replace

替换字符串中与正则表达式匹配的部分。

```cpp
basic_string regex_replace(
    const basic_string& s,
    const basic_regex& e,
    const basic_string& fmt,
    regex_constants::match_flag_type flags = regex_constants::match_default
)
```

示例

```cpp
#include <iostream>
#include <string>
#include <regex>

int main()
{
    std::string text = "my years old is 24";
    std::regex pattern("\\d+");
    std::string replacement = "unknown";

    std::string result = std::regex_replace(text, pattern, replacement);

    std::cout << result << std::endl;
}
```

输出结果

```shell
my years old is unknown
```


