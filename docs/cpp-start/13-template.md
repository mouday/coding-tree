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
