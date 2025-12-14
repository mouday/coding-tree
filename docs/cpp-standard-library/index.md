# CPP 标准库

输入输出

|头文件 | 说明
|- | -
[`<iostream>`](./iostream.md) |  标准输入输出流
[`<fstream>`](./fstream.md) |  文件输入输出流
[`<sstream>`](./sstream.md) |  字符串流
[`<iomanip>`](./iomanip.md) |  输入输出流格式化

容器

|头文件 | 说明
|- | -
[`<array>`](./array.md) |  定长数组容器
[`<vector>`](./vector.md) |  动态数组容器
[`<deque>`](./deque.md) |  双端队列容器
[`<list>`](./list.md) |  双向链表容器
[`<forward_list>`](./forward_list.md) |  单向链表容器
[`<stack>`](./stack.md) |  栈容器适配器
[`<queue>`](./queue.md) |  队列容器适配器
[`<priority_queue>`](./priority_queue.md) |  优先队列容器适配器
[`<set>`](./set.md) |  集合容器（基于平衡二叉树）
[`<unordered_set>`](./unordered_set.md) |  无序集合容器（基于哈希表）
[`<map>` ](./map.md)|  映射容器（键值对，基于平衡二叉树）
[`<unordered_map>`](./unordered_map.md) |  无序映射容器（基于哈希表）
[`<bitset>`](./bitset.md) |  二进制位容器

算法和迭代器

|头文件 | 说明
|- | -
[`<algorithm>`](./algorithm.md) |  常用算法（如排序、查找等）
[`<iterator>`](./iterator.md) |  迭代器

函数对象和绑定

|头文件 | 说明
|- | -
[`<functional>`](./functional.md) |  定义函数对象及相关工具

数学和数值运算

|头文件 | 说明
|- | -
[`<numeric>`](./numeric.md) |  数值操作（如累计、乘积等）
[`<complex>`](./complex.md) |  复数运算
[`<valarray>`](./valarray.md) |  数组类及相关操作
[`<cmath>`](./cmath.md) |  数学函数

字符串和正则表达式

|头文件 | 说明
|- | -
[`<string>`](./string.md) |  标准字符串类
[`<regex>`](./regex.md) |  正则表达式

时间和日期

|头文件 | 说明
|- | -
[`<ctime>`](./ctime.md) |  时间处理
[`<chrono>`](./chrono.md) |  时间库

多线程和并发

|头文件 | 说明
|- | -
[`<thread>`](./thread.md) |  多线程支持
[`<mutex>`](./mutex.md) |  互斥量
[`<condition_variable>`](./condition_variable.md) |  条件变量
[`<future>`](./future.md) |  异步编程支持
[`<atomic>`](./atomic.md) |  原子操作

内存管理

|头文件 | 说明
|- | -
[`<memory>`](./memory.md) |  智能指针及动态内存管理
[`<new>`](./new.md) |  动态内存分配

类型特性和运行时类型识别

|头文件 | 说明
|- | -
[`<type_traits>`](./type_traits.md) |  类型特性
[`<typeinfo>`](./typeinfo.md) |  运行时类型识别

异常处理

|头文件 | 说明
|- | -
[`<exception>`](./exception.md) |  异常处理基类及相关工具
[`<stdexcept>`](./stdexcept.md) |  常用异常类（如 std |  | runtime_error 等）

输入输出操作

|头文件 | 说明
|- | -
[`<cstdio>`](./cstdio.md) |  C 风格输入输出
[`<cstdint>`](./cstdint.md) |  定长整数类型

其他工具

|头文件 | 说明
|- | -
[`<utility>`](./utility.md) |  通用工具（如 std::pair 和 std::move 等）
[`<random>`](./random.md) |  随机数生成
[`<locale>`](./locale.md) |  本地化支持
[`<codecvt>`](./codecvt.md) |  字符编码转换
[`<cassert>`](./cassert.md) |  断言
[`<cctype>`](./cctype.md) |  字符处理
[`<cstring>`](./cstring.md) |  字符串处理
[`<cwchar>`](./cwchar.md) |  宽字符处理
[`<climits>`](./climits.md) |  数值极限
[`<cfloat>`](./cfloat.md) |  浮点极限
[`<cstdlib>`](./cstdlib.md) |  常用工具（如 std::rand 和 std::abs 等）

其他资源

C++ 标准库 https://en.cppreference.com/w/cpp/header.html

提供免费的 C++ 源代码和 C++ 库
https://www.thefreecountry.com/sourcecode/cpp.shtml


## Hello World

```cpp
// hello.cpp 
#include <iostream>

int main(int argc, char const *argv[])
{
    std::cout << "Hello World!" << std::endl;

    return 0;
}

```

输出

```shell
g++ -std=c++11 hello.cpp -o hello && ./hello
Hello World!
```
