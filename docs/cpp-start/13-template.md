# 模板

## 1.1 模板的概念

模板就是建立通用的模具，大大提高复用性

例如生活中的模板

- 一寸照片模板
- PPT模板

模板的特点：

- 模板不可以直接使用，它只是一个框架
- 模板的通用并不是万能的

## 1.2 函数模板

C++另一种编程思想称为 `泛型编程` ，主要利用的技术就是模板

C++提供两种模板机制: `函数模板`和`类模板`

### 1.2.1 函数模板语法

函数模板作用：

建立一个通用函数，其函数返回值类型和形参类型可以不具体制定，用一个虚拟的类型来代表。

语法：

```cpp
template<typename T>
函数声明或定义
```

解释：

- `template`: 声明创建模板

- `typename`: 表面其后面的符号是一种数据类型，可以用`class`代替

- `T`: 通用的数据类型，名称可以替换，通常为大写字母


示例：


```cpp
//交换整型函数
void swapInt(int& a, int& b) {
	int temp = a;
	a = b;
	b = temp;
}

//交换浮点型函数
void swapDouble(double& a, double& b) {
	double temp = a;
	a = b;
	b = temp;
}

int main() {

	int a = 10;
	int b = 20;
	
	swapInt(a, b);

	cout << "a = " << a << endl;
	cout << "b = " << b << endl;

	return 0;
}
```

利用模板实现交换

```cpp
//利用模板提供通用的交换函数
template<typename T>
void mySwap(T& a, T& b)
{
	T temp = a;
	a = b;
	b = temp;
}


int main() {

	int a = 10;
	int b = 20;
	
	//1、自动类型推导
	mySwap(a, b);

	//2、显示指定类型
	mySwap<int>(a, b);

	cout << "a = " << a << endl;
	cout << "b = " << b << endl;

	return 0;
}
```

总结：

- 函数模板利用关键字 `template`
- 使用函数模板有两种方式：
	- 自动类型推导
	- 显示指定类型
- 模板的目的是为了提高复用性，将类型参数化


### 1.2.2 函数模板注意事项

注意事项：

- 自动类型推导，必须推导出一致的数据类型`T`,才可以使用

- 模板必须要确定出`T`的数据类型，才可以使用

总结：

- 使用模板时必须确定出通用数据类型T，并且能够推导出一致的类型

示例：

```cpp
//利用模板提供通用的交换函数 class 或者 typename 
template<class T>
void mySwap(T& a, T& b)
{
	T temp = a;
	a = b;
	b = temp;
}


// 1、自动类型推导，必须推导出一致的数据类型T,才可以使用
void test01()
{
	int a = 10;
	int b = 20;
	char c = 'c';

	mySwap(a, b); // 正确，可以推导出一致的T
	//mySwap(a, c); // 错误，推导不出一致的T类型
}


// 2、模板必须要确定出T的数据类型，才可以使用
template<class T>
void func()
{
	cout << "func 调用" << endl;
}

void test02()
{
	//func(); //错误，模板不能独立使用，必须确定出T的类型
	func<int>(); //利用显示指定类型的方式，给T一个类型，才可以使用该模板
}

int main() {

	test01();
	test02();

	return 0;
}
```

### 1.2.3 函数模板案例

案例描述：

- 利用函数模板封装一个排序的函数，可以对不同数据类型数组进行排序
- 排序规则从大到小，排序算法为选择排序
- 分别利用char数组和int数组进行测试

总结：模板可以提高代码复用，需要熟练掌握

示例：

```cpp
//交换的函数模板
template<typename T>
void mySwap(T &a, T&b)
{
	T temp = a;
	a = b;
	b = temp;
}


template<class T> // 也可以替换成typename
//利用选择排序，进行对数组从大到小的排序
void mySort(T arr[], int len)
{
	for (int i = 0; i < len; i++)
	{
		int max = i; //最大数的下标
		for (int j = i + 1; j < len; j++)
		{
			if (arr[max] < arr[j])
			{
				max = j;
			}
		}
		if (max != i) //如果最大数的下标不是i，交换两者
		{
			mySwap(arr[max], arr[i]);
		}
	}
}

template<typename T>
void printArray(T arr[], int len) 
{
	for (int i = 0; i < len; i++) {
		cout << arr[i] << " ";
	}
	cout << endl;
}

void test01()
{
	//测试char数组
	char charArr[] = "bdcfeagh";
	int num = sizeof(charArr) / sizeof(char);
	mySort(charArr, num);
	printArray(charArr, num);
}

void test02()
{
	//测试int数组
	int intArr[] = { 7, 5, 8, 1, 3, 9, 2, 4, 6 };
	int num = sizeof(intArr) / sizeof(int);
	mySort(intArr, num);
	printArray(intArr, num);
}

int main() {

	test01();
	test02();

	return 0;
}
```
### 1.2.4 普通函数与函数模板的区别

普通函数与函数模板区别：

- 普通函数调用时可以发生自动类型转换（隐式类型转换）
- 函数模板调用时，如果利用自动类型推导，不会发生隐式类型转换
- 如果利用显示指定类型的方式，可以发生隐式类型转换

示例：

```cpp
//普通函数
int myAdd01(int a, int b)
{
	return a + b;
}

//函数模板
template<class T>
T myAdd02(T a, T b)  
{
	return a + b;
}

//使用函数模板时，如果用自动类型推导，不会发生自动类型转换,即隐式类型转换
void test01()
{
	int a = 10;
	int b = 20;
	char c = 'c';
	
	cout << myAdd01(a, c) << endl; //正确，将char类型的'c'隐式转换为int类型  'c' 对应 ASCII码 99

	//myAdd02(a, c); // 报错，使用自动类型推导时，不会发生隐式类型转换

	myAdd02<int>(a, c); //正确，如果用显示指定类型，可以发生隐式类型转换
}

int main() {

	test01();

	system("pause");

	return 0;
}
```

总结：建议使用显示指定类型的方式，调用函数模板，因为可以自己确定通用类型T

### 1.2.5 普通函数与函数模板的调用规则

调用规则如下：

- 如果函数模板和普通函数都可以实现，优先调用普通函数
- 可以通过空模板参数列表来强制调用函数模板
- 函数模板也可以发生重载
- 如果函数模板可以产生更好的匹配,优先调用函数模板

示例：

```cpp
//普通函数与函数模板调用规则
void myPrint(int a, int b)
{
	cout << "调用的普通函数" << endl;
}

template<typename T>
void myPrint(T a, T b) 
{ 
	cout << "调用的模板" << endl;
}

template<typename T>
void myPrint(T a, T b, T c) 
{ 
	cout << "调用重载的模板" << endl; 
}

void test01()
{
	//1、如果函数模板和普通函数都可以实现，优先调用普通函数
	// 注意 如果告诉编译器  普通函数是有的，但只是声明没有实现，或者不在当前文件内实现，就会报错找不到
	int a = 10;
	int b = 20;
	myPrint(a, b); //调用普通函数

	//2、可以通过空模板参数列表来强制调用函数模板
	myPrint<>(a, b); //调用函数模板

	//3、函数模板也可以发生重载
	int c = 30;
	myPrint(a, b, c); //调用重载的函数模板

	//4、 如果函数模板可以产生更好的匹配,优先调用函数模板
	char c1 = 'a';
	char c2 = 'b';
	myPrint(c1, c2); //调用函数模板
}

int main() {

	test01();

	system("pause");

	return 0;
}
```

总结：既然提供了函数模板，最好就不要提供普通函数，否则容易出现二义性

### 1.2.6 模板的局限性

局限性：

模板的通用性并不是万能的

例如：


```cpp
template<class T>
void f(T a, T b)
{ 
	a = b;
}
```

在上述代码中提供的赋值操作，如果传入的a和b是一个数组，就无法实现了

再例如：

```cpp
template<class T>
void f(T a, T b)
{ 
	if(a > b) { ... }
}
```

在上述代码中，如果T的数据类型传入的是像Person这样的自定义数据类型，也无法正常运行

因此C++为了解决这种问题，提供模板的重载，可以为这些特定的类型提供具体化的模板

示例：

```cpp
#include<iostream>
using namespace std;

#include <string>

class Person
{
public:
	Person(string name, int age)
	{
		this->m_Name = name;
		this->m_Age = age;
	}
	string m_Name;
	int m_Age;
};

//普通函数模板
template<class T>
bool myCompare(T& a, T& b)
{
	if (a == b)
	{
		return true;
	}
	else
	{
		return false;
	}
}


//具体化，显示具体化的原型和定意思以template<>开头，并通过名称来指出类型
//具体化优先于常规模板
template<> bool myCompare(Person &p1, Person &p2)
{
	if ( p1.m_Name  == p2.m_Name && p1.m_Age == p2.m_Age)
	{
		return true;
	}
	else
	{
		return false;
	}
}

void test01()
{
	int a = 10;
	int b = 20;

	//内置数据类型可以直接使用通用的函数模板
	bool ret = myCompare(a, b);
	if (ret)
	{
		cout << "a == b " << endl;
	}
	else
	{
		cout << "a != b " << endl;
	}
}

void test02()
{
	Person p1("Tom", 10);
	Person p2("Tom", 10);
	//自定义数据类型，不会调用普通的函数模板
	//可以创建具体化的Person数据类型的模板，用于特殊处理这个类型
	bool ret = myCompare(p1, p2);
	if (ret)
	{
		cout << "p1 == p2 " << endl;
	}
	else
	{
		cout << "p1 != p2 " << endl;
	}
}

int main() {

	test01();

	test02();

	system("pause");

	return 0;
}
```

总结：

- 利用具体化的模板，可以解决自定义类型的通用化
- 学习模板并不是为了写模板，而是在STL能够运用系统提供的模板

## 1.3 类模板

### 1.3.1 类模板语法

类模板作用：

建立一个通用类，类中的成员 数据类型可以不具体制定，用一个虚拟的类型来代表。

语法：

```cpp
template<typename T>
class ClassName{
	
};
```

解释：

- `template` --- 声明创建模板

- `typename` --- 表面其后面的符号是一种数据类型，可以用class代替

- `T` --- 通用的数据类型，名称可以替换，通常为大写字母

总结：类模板和函数模板语法相似，在声明模板`template`后面加类，此类称为类模板

示例：

```cpp
#include <string>

//类模板
template<class NameType, class AgeType> 
class Person
{
public:
	Person(NameType name, AgeType age)
	{
		this->mName = name;
		this->mAge = age;
	}

	void showPerson()
	{
		cout << "name: " << this->mName << " age: " << this->mAge << endl;
	}

public:
	NameType mName;
	AgeType mAge;
};

void test01()
{
	// 指定NameType 为string类型，AgeType 为 int类型
	Person<string, int>P1("孙悟空", 999);
	P1.showPerson();
}

int main() {

	test01();

	return 0;
}
```

### 1.3.2 类模板与函数模板区别

类模板与函数模板区别主要有两点：

- 类模板没有自动类型推导的使用方式
- 类模板在模板参数列表中可以有默认参数

总结：

- 类模板使用只能用显示指定类型方式
- 类模板中的模板参数列表可以有默认参数

示例：

```cpp
#include <string>

//类模板
template<class NameType, class AgeType = int> 
class Person
{
public:
	Person(NameType name, AgeType age)
	{
		this->mName = name;
		this->mAge = age;
	}
	void showPerson()
	{
		cout << "name: " << this->mName << " age: " << this->mAge << endl;
	}

public:
	NameType mName;
	AgeType mAge;
};

//1、类模板没有自动类型推导的使用方式
void test01()
{
	// Person p("孙悟空", 1000); // 错误 类模板使用时候，不可以用自动类型推导
	Person <string ,int>p("孙悟空", 1000); //必须使用显示指定类型的方式，使用类模板
	p.showPerson();
}

//2、类模板在模板参数列表中可以有默认参数
void test02()
{
	Person <string> p("猪八戒", 999); //类模板中的模板参数列表 可以指定默认参数
	p.showPerson();
}

int main() {

	test01();

	test02();

	system("pause");

	return 0;
}
```

### 1.3.3 类模板中成员函数创建时机

类模板中成员函数和普通类中成员函数创建时机是有区别的：

- 普通类中的成员函数一开始就可以创建
- 类模板中的成员函数在调用时才创建

总结：类模板中的成员函数并不是一开始就创建的，在调用时才去创建

示例：

```cpp
class Person1
{
public:
	void showPerson1()
	{
		cout << "Person1 show" << endl;
	}
};

class Person2
{
public:
	void showPerson2()
	{
		cout << "Person2 show" << endl;
	}
};

template<class T>
class MyClass
{
public:
	T obj;

	//类模板中的成员函数，并不是一开始就创建的，而是在模板调用时再生成

	void fun1() { obj.showPerson1(); }
	void fun2() { obj.showPerson2(); }

};

void test01()
{
	MyClass<Person1> m;
	
	m.fun1();

	//m.fun2();//编译会出错，说明函数调用才会去创建成员函数
}

int main() {

	test01();

	system("pause");

	return 0;
}
```

### 1.3.4 类模板对象做函数参数

学习目标：

类模板实例化出的对象，向函数传参的方式

一共有三种传入方式：

- 指定传入的类型 --- 直接显示对象的数据类型
- 参数模板化 --- 将对象中的参数变为模板进行传递
- 整个类模板化 --- 将这个对象类型 模板化进行传递

总结：

- 通过类模板创建的对象，可以有三种方式向函数中进行传参
- 使用比较广泛是第一种：指定传入的类型

示例：

```cpp
#include <string>

//类模板
template<class NameType, class AgeType = int> 
class Person
{
public:
	Person(NameType name, AgeType age)
	{
		this->mName = name;
		this->mAge = age;
	}
	void showPerson()
	{
		cout << "name: " << this->mName << " age: " << this->mAge << endl;
	}

public:
	NameType mName;
	AgeType mAge;
};

//1、指定传入的类型
void printPerson1(Person<string, int> &p) 
{
	p.showPerson();
}

void test01()
{
	Person <string, int >p("孙悟空", 100);
	printPerson1(p);
}

//2、参数模板化
template <class T1, class T2>
void printPerson2(Person<T1, T2>&p)
{
	p.showPerson();
	cout << "T1的类型为： " << typeid(T1).name() << endl;
	cout << "T2的类型为： " << typeid(T2).name() << endl;
}

void test02()
{
	Person <string, int >p("猪八戒", 90);
	printPerson2(p);
}

//3、整个类模板化
template<class T>
void printPerson3(T & p)
{
	cout << "T的类型为： " << typeid(T).name() << endl;
	p.showPerson();

}
void test03()
{
	Person <string, int >p("唐僧", 30);
	printPerson3(p);
}

int main() {

	test01();
	test02();
	test03();

	system("pause");

	return 0;
}
```
