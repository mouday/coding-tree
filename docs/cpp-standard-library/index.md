# CPP 标准库

输入输出

|头文件 | 说明
|- | -
`<iostream>` |  标准输入输出流
`<fstream>` |  文件输入输出流
`<sstream>` |  字符串流
`<iomanip>` |  输入输出流格式化

容器

|头文件 | 说明
|- | -
`<array>` |  定长数组容器
`<vector>` |  动态数组容器
`<deque>` |  双端队列容器
`<list>` |  双向链表容器
`<forward_list>` |  单向链表容器
`<stack>` |  栈容器适配器
`<queue>` |  队列容器适配器
`<priority_queue>` |  优先队列容器适配器
`<set>` |  集合容器（基于平衡二叉树）
`<unordered_set>` |  无序集合容器（基于哈希表）
`<map>` |  映射容器（键值对，基于平衡二叉树）
`<unordered_map>` |  无序映射容器（基于哈希表）
`<bitset>` |  二进制位容器

算法和迭代器

|头文件 | 说明
|- | -
`<algorithm>` |  常用算法（如排序、查找等）
`<iterator>` |  迭代器

函数对象和绑定

|头文件 | 说明
|- | -
`<functional>` |  定义函数对象及相关工具

数学和数值运算

|头文件 | 说明
|- | -
`<numeric>` |  数值操作（如累计、乘积等）
`<complex>` |  复数运算
`<valarray>` |  数组类及相关操作
`<cmath>` |  数学函数

字符串和正则表达式

|头文件 | 说明
|- | -
`<string>` |  标准字符串类
`<regex>` |  正则表达式

时间和日期

|头文件 | 说明
|- | -
`<ctime>` |  时间处理
`<chrono>` |  时间库

多线程和并发

|头文件 | 说明
|- | -
`<thread>` |  多线程支持
`<mutex>` |  互斥量
`<condition_variable>` |  条件变量
`<future>` |  异步编程支持
`<atomic>` |  原子操作

内存管理

|头文件 | 说明
|- | -
`<memory>` |  智能指针及动态内存管理
`<new>` |  动态内存分配

类型特性和运行时类型识别

|头文件 | 说明
|- | -
`<type_traits>` |  类型特性
`<typeinfo>` |  运行时类型识别

异常处理

|头文件 | 说明
|- | -
`<exception>` |  异常处理基类及相关工具
`<stdexcept>` |  常用异常类（如 std |  | runtime_error 等）

输入输出操作

|头文件 | 说明
|- | -
`<cstdio>` |  C 风格输入输出
`<cstdint>` |  定长整数类型

其他工具

|头文件 | 说明
|- | -
`<utility>` |  通用工具（如 std |  | pair 和 std |  | move 等）
`<random>` |  随机数生成
`<locale>` |  本地化支持
`<codecvt>` |  字符编码转换
`<cassert>` |  断言
`<cctype>` |  字符处理
`<cstring>` |  字符串处理
`<cwchar>` |  宽字符处理
`<climits>` |  数值极限
`<cfloat>` |  浮点极限
`<cstdlib>` |  常用工具（如 std |  | rand 和 std |  | abs 等）
