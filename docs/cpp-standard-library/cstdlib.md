# cstdlib

各种通用工具函数，包括内存分配、进程控制、环境查询、排序和搜索、数学转换、伪随机数生成等。

头文件：

```cpp
#include <cstdlib>
```

常用的函数及其简要说明：

- exit(int status): 终止程序执行，并返回一个状态码。
- system(const char* command): 执行一个命令行字符串。
- malloc(size_t size): 分配指定大小的内存。
- free(void* ptr): 释放之前分配的内存。
- atoi(const char* str): 将字符串转换为整数。
- atof(const char* str): 将字符串转换为浮点数。
- rand(): 生成一个随机数。
- srand(unsigned int seed): 设置随机数生成器的种子。

示例1

```cpp
#include <cstdlib>
#include <iostream>
#include <ctime>

int main()
{
    std::srand(std::time(nullptr));        // 使用当前时间作为随机数种子
    std::cout << std::rand() % 100 << " "; // 生成0到99之间的随机数
}
```

输出结果

```shell
71 
```
