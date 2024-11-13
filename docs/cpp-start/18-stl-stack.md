# stack容器

## 1 stack 基本概念

概念：stack是一种`先进后出`(First In Last Out,FILO)的数据结构，它只有一个出口

![](https://mouday.github.io/img/2024/11/13/vxwq4z7.png)

栈中只有顶端的元素才可以被外界使用，因此栈不允许有遍历行为

栈中进入数据称为 --- 入栈 push

栈中弹出数据称为 --- 出栈 pop

生活中的栈：子弹夹

## 2 stack 常用接口

功能描述：栈容器常用的对外接口

```cpp
// 构造函数：
stack<T> stk; //stack采用模板类实现， stack对象的默认构造形式
stack(const stack &stk); //拷贝构造函数


// 赋值操作：
stack& operator=(const stack &stk); //重载等号操作符

// 数据存取：
push(elem); //向栈顶添加元素
pop(); //从栈顶移除第一个元素
top(); //返回栈顶元素

// 大小操作：
empty(); //判断堆栈是否为空
size(); //返回栈的大小
```

总结：

- 入栈 --- push
- 出栈 --- pop
- 返回栈顶 --- top
- 判断栈是否为空 --- empty
- 返回栈大小 --- size

示例：


```cpp
#include <iostream>
#include <stack>

using namespace std;

//栈容器常用接口
void test01() {
    //创建栈容器 栈容器必须符合先进后出
    stack<int> s;

    //向栈中添加元素，叫做 压栈 入栈
    s.push(10);
    s.push(20);
    s.push(30);

    while (!s.empty()) {
        //输出栈顶元素
        cout << "栈顶元素为： " << s.top() << endl;
        //弹出栈顶元素
        s.pop();
    }
    
    cout << "栈的大小为：" << s.size() << endl;
}

int main() {
    test01();

    return 0;
}

```


```cpp
栈顶元素为： 30
栈顶元素为： 20
栈顶元素为： 10
栈的大小为：0
```
