# using

using 关键字在C++中的用途：

- using 声明：引入特定名称到当前作用域

- using 指令：引入整个命名空间（谨慎使用）

- 类型别名：创建类型别名（现代C++替代typedef）

- 模板别名：创建模板类型别名（C++11）

- 继承控制：
  - 引入基类成员到派生类作用域
  - 改变成员访问权限
  - 继承构造函数（C++11）

- 枚举项引入：引入枚举项到作用域（C++20）

- 概念别名：创建概念别名（C++20）

最佳实践：

- 优先使用 using 而非 typedef

- 在头文件中避免 using namespace

- 使用类型别名提高代码可读性

- 在继承中谨慎使用 using 声明

- 限制 using 声明的作用域

## 类型别名

创建类型别名（现代C++替代typedef）

```cpp
// C++98/03 使用typedef
typedef int IntType;
typedef void (*OldFuncPtr)(int, int);

// C++11 开始可以使用using创建类型别名
using IntType = int;
using NewFuncPtr = void(*)(int, int);
```
