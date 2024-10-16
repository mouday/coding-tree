# 函数

## 1、概述

作用：将一段经常使用的代码封装起来，减少重复代码

一个较大的程序，一般分为若干个程序块，每个模块实现特定的功能。

## 2、函数的定义

函数的定义一般主要有5个步骤：

1、返回值类型

2、函数名

3、参数表列

4、函数体语句

5、return 表达式

语法：

```cpp
返回值类型 函数名 （参数列表）
{
    函数体语句

    return 表达式
}
```

- 返回值类型 ：一个函数可以返回一个值。在函数定义中
- 函数名：给函数起个名称
- 参数列表：使用该函数时，传入的数据
- 函数体语句：花括号内的代码，函数内需要执行的语句
- return表达式： 和返回值类型挂钩，函数执行完后，返回相应的数据

示例：定义一个加法函数，实现两个数相加

```cpp
//函数定义
int add(int num1, int num2)
{
	int sum = num1 + num2;
	return sum;
}
```

## 3、函数的调用

功能：使用定义好的函数

语法： `函数名（参数）`

总结：函数定义里小括号内称为形参，函数调用时传入的参数称为实参

示例：

```cpp
// 函数定义
// 定义中的num1,num2称为形式参数，简称形参
int add(int num1, int num2) 
{
	int sum = num1 + num2;
	return sum;
}

int main() {

	int a = 10;
	int b = 10;

	//调用add函数
	// 调用时的a，b称为实际参数，简称实参
	int sum = add(a, b);
	cout << "sum = " << sum << endl;

	a = 100;
	b = 100;

	sum = add(a, b);
	cout << "sum = " << sum << endl;

	return 0;
}
```

## 4、值传递

所谓值传递，就是函数调用时实参将数值传入给形参

值传递时，如果形参发生改变，并不会影响实参

总结： 值传递时，形参是修饰不了实参的

示例：

```cpp
void swap(int num1, int num2)
{
	cout << "交换前：" << endl;
	cout << "num1 = " << num1 << endl;
	cout << "num2 = " << num2 << endl;

	int temp = num1;
	num1 = num2;
	num2 = temp;

	cout << "交换后：" << endl;
	cout << "num1 = " << num1 << endl;
	cout << "num2 = " << num2 << endl;

	//return ; 当函数声明时候，不需要返回值，可以不写return
}

int main() {

	int a = 10;
	int b = 20;

	swap(a, b);

	cout << "mian中的 a = " << a << endl;
	cout << "mian中的 b = " << b << endl;

	return 0;
}
```


## 5、函数的常见样式

常见的函数样式有4种

- 无参无返
- 有参无返
- 无参有返
- 有参有返

示例：

```cpp
// 函数常见样式
//1、 无参无返
void test01()
{
	//void a = 10; //无类型不可以创建变量,原因无法分配内存
	cout << "this is test01" << endl;
	//test01(); 函数调用
}

//2、 有参无返
void test02(int a)
{
	cout << "this is test02" << endl;
	cout << "a = " << a << endl;
}

//3、无参有返
int test03()
{
	cout << "this is test03 " << endl;
	return 10;
}

//4、有参有返
int test04(int a, int b)
{
	cout << "this is test04 " << endl;
	int sum = a + b;
	return sum;
}
```

## 6、函数的声明

作用： 告诉编译器函数名称及如何调用函数。函数的实际主体可以单独定义。

函数的声明可以多次，但是函数的定义只能有一次

示例：

```cpp
//声明可以多次，定义只能一次
//声明
int max(int a, int b);
int max(int a, int b);

//定义
int max(int a, int b)
{
	return a > b ? a : b;
}

int main() {

	int a = 100;
	int b = 200;

	cout << max(a, b) << endl;

	return 0;
}
```

## 7、函数的分文件编写

作用：让代码结构更加清晰

函数分文件编写一般有4个步骤

- 创建后缀名为`.h`的头文件
- 创建后缀名为`.cpp`的源文件
- 在头文件中写函数的声明
- 在源文件中写函数的定义

示例：

```cpp
// swap.h文件

#include<iostream>
using namespace std;

//实现两个数字交换的函数声明
void swap(int a, int b);
```

```cpp
// swap.cpp文件

#include "swap.h"

void swap(int a, int b)
{
	int temp = a;
	a = b;
	b = temp;

	cout << "a = " << a << endl;
	cout << "b = " << b << endl;
}
```

```cpp
// main函数文件
#include "swap.h"

int main() {

	int a = 100;
	int b = 200;
	swap(a, b);

	return 0;
}
```

## 8、函数默认参数

语法

```cpp
返回值类型 函数名(参数=默认值){}
```

注意事项：

- 参数默认值放到形参列表最后
- 声明和实现只能一个有默认参数

```cpp
#include <iostream>

using namespace std;

// 声明
int add(int a, int b);

// 实现
int add(int a, int b = 20) {
    return a + b;
}

int main() {
    cout << add(1, 2) << endl; // 3

    cout << add(1) << endl; // 21
}

```

## 9、占位参数

语法

```
返回值类型 函数名(数据类型){}
```

例如

```cpp
void func(int a, int){
	// ...
}
```


占位参数可以有默认值

```cpp
void func(int a, int = 10){
	// ...
}
```

## 10、函数重载

函数名可以相同

函数重载满足条件
- 同一个作用域下
- 函数名称相同
- 函数参数`类型不同`或者`个数不同`或者`顺序不同`
- 函数返回值，不可以作为函数重载的条件

示例

个数不同

```cpp
#include <iostream>

using namespace std;


int add(int a) {
    return a + 20;
}

int add(int a, int b) {
    return a + b;
}

int main() {
    cout << add(1, 2) << endl; // 3

    cout << add(1) << endl; // 21
}

```

类型不同

```cpp
#include <iostream>

using namespace std;


int add(double a) {
    return a + 20;
}

int add(int a) {
    return a + 2;
}

int main() {
    cout << add(1) << endl; // 3

    cout << add(1.0) << endl; // 21
}

```

顺序不同

```cpp
#include <iostream>

using namespace std;


int add(double a, int b) {
    return a + b;
}

int add(int a, double b) {
    return a + b + 20;
}

int main() {
    cout << add(1.0, 2) << endl; // 3

    cout << add(1, 2.0) << endl; // 23
}
```

## 11、函数重载注意事项

1、引用作为重载条件

```cpp
#include <iostream>

using namespace std;


int add(int &a) {
    return a + 2;
}

int add(const int &a) {
    return a + 20;
}

int main() {
    int a = 1;
    cout << add(a) << endl; // 3

    cout << add(1) << endl; // 21
}

```

2、函数重载和默认参数

以下两个函数不能同时存在，调用的时候存在二义性

```cpp
int add(int a){}

int add(int a, int b = 10){}
```
