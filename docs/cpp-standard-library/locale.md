# locale

本地化行为，特别是与语言和文化相关的格式设置和转换操作

示例

```cpp
#include <iostream>
#include <locale>

int main() {
    std::locale loc("en_US.UTF-8"); // 设置为美国英语
    std::cout.imbue(loc); // 设置 cout 的 locale

    double number = 1234567.89;
    std::cout << "Formatted number: " << number << std::endl;

    return 0;
}
```

输出结果

```shell
Formatted number: 1.23457e+06
```