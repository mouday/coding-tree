# cwchar

处理宽字符（wchar_t）和宽字符串的函数

基本类型
wchar_t：宽字符类型，用于存储宽字符。
wint_t：用于存储宽字符函数的返回值。
常用函数

1. 宽字符输入输出
fgetwc：从文件流中读取宽字符。
fputwc：向文件流中写入宽字符。
fgetws：从文件流中读取宽字符串。
fputws：向文件流中写入宽字符串。

2. 宽字符和宽字符串操作
wcscpy：拷贝宽字符串。
wcslen：获取宽字符串长度。
wcscmp：比较宽字符串。
wcsncpy：拷贝指定长度的宽字符串。


3. 宽字符分类和转换
iswalpha：判断宽字符是否为字母。
iswdigit：判断宽字符是否为数字。
towlower：将宽字符转换为小写。
towupper：将宽字符转换为大写。

4. 宽字符和宽字符串的输入输出
wprintf：宽字符格式化输出。
wscanf：宽字符格式化输入。
swprintf：将格式化宽字符写入宽字符串。
swscanf：从宽字符串中读取格式化宽字符。

示例1

```cpp

#include <iostream>
#include <cwchar>

int main()
{

    std::wcout << L"hello world" << std::endl;

    return 0;
}
```

输出结果

```shell
hello world
```
