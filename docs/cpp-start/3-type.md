# 数据类型

## sizeof关键字

作用：利用sizeof关键字可以统计数据类型所占内存大小

语法： `sizeof( 数据类型 或者 变量)`

整型结论： `short < int <= long <= long long`

示例：

```cpp
#include <iostream>

using namespace std;

int main() {
    cout << sizeof(short) << endl; // 2

    cout << sizeof(int) << endl; // 4

    cout << sizeof(long) << endl; // 8

    cout << sizeof(long long) << endl; // 8

    return 0;
}

```