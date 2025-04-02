# C语言内存空间的使用

1、指针

1.1、指针概述

1.2、指针修饰符 const/volatile/typedef

1.3、指针运算符

1.4、多级指针

2、数组

2.1、数组空间

2.2、字符空间及地址

3、结构体、共用体

3.1、定义、字节对齐

3.2、位域

4、内存分布图

5、段错误分析

## 1、指针

### 1.1、指针概述

查看系统位数（64位）

```shell
uname -a

x86_64
```

示例1：查看指针大小，都是8字节

```cpp
#include <stdio.h>

int main() {
    int *p1;
    char *p2;

    printf("size of int p1 is %lu\n", sizeof(p1));
    // size of int p1 is 8

    printf("size of char p2 is %lu\n", sizeof(p2));
    // size of char p2 is 8

    return 0;
}
```


示例2：变量的地址指向低地址

```cpp
#include <stdio.h>

int main() {
    int a = 0X12345678;
    char *p;
    p = &a;

    printf("p = %x\n", *p);
    // p = 78

    return 0;
}
```

### 1.2、指针修饰符

1、const 常量

```cpp
#include <stdio.h>

int main() {
    const char *p = "hello world";
    printf("%s\n", p);
    printf("%c\n", *p);

    // error 不能修改
    // *p = 'a';

    printf("%c\n", *p);

    return 0;
}
```

2、volatile

防止优化指向内存地址

硬件居多

```cpp
volatile char *p;
*p = 0x10;
while (*p == 0x10){
    // 例如：监听键盘按下
}
```

3、typedef

例如

```cpp
typedef char *name_t;

name_t a;
```

### 1.3、指针运算符

1、指针的加减，实际改变的是一个单位

```cpp
#include <stdio.h>

int main() {
    int *p1 = NULL;
    printf("%p\n", p1 + 1);
    // 0x4

    char *p2 = NULL;
    printf("%p\n", p2 + 1);
    // 0x1

    return 0;
}

```

2、`[]`取值 两者等价

```cpp
p[n]
*(p + n)
```

内存分配：从高地址向低地址

```cpp
#include <stdio.h>

int main() {
    int a = 0x12345678;
    int b = 0x87654321;

    int *p_b = &b;
    char *p_c = (char *) &a;

    printf("%#x\n", a);          // 0x12345678
    printf("%#x\n", *(p_b + 1)); // 0x12345678
    printf("%#x\n", p_b[1]);     // 0x12345678

    printf("%#x\n", *p_c);       // 0x78
    printf("%#x\n", *(p_c + 1)); // 0x56
    printf("%#x\n", *(p_c + 2)); // 0x34
    printf("%#x\n", *(p_c + 3)); // 0x12

    return 0;
}
```

注意：const仅对编译器有用

```cpp
#include <stdio.h>

int main() {
    const int a = 0x12345678;
    int b = 0x11223344;

    // a = 0x87654321; // error: cannot assign to variable 'a'

    int *p = &b;
    *(p + 1) = 0x55667788;

    printf("%#x\n", a); // 0x12345678

    return 0;
}
```

3、逻辑操作符

常用 `==` 和 `!=`

和`0x0(NULL)`比较

指针类型相同比较才有意义

### 1.4、多级指针

存放地址的地址空间

```cpp
char **p
p[0] p[1] ... p[n] NULL
```

示例1

```cpp
#include <stdio.h>

int main(int argc, char **argv) {
    for (int i = 0; i < argc; i++) {
        printf("%s\n", argv[i]);
    }
    return 0;
}

```

或者

```cpp
#include <stdio.h>

int main(int argc, char **argv) {
    int i =0;
    while (argv[i] != NULL) {
        printf("%s\n", argv[i]);
        i++;
    }
    return 0;
}
```

运行结果

```cpp
$ ./a.out hello world
./a.out
hello
world

```

## 2、数组


### 2.1、数组空间


数组的定义及初始化

定义一个空间

1. 大小
2. 读取方式

```cpp
// m的作用域是在申请的时候
数据类型 数组名[m];

int a[100];
```

数组vs.指针

- 数组名是常量，数组名不能再赋值
- 指针是变量，可以被重新赋值



### 2.2、字符空间及地址


空间的赋值：逐一赋值

```cpp
#include <stdio.h>

int main() {
    char a[10] = {'a', 'b', 'c', '\0'};
    char b[10] = {"abc"};
    char c[10] = "abc";

    char *p = "abc";

    printf("a = %s\n", a);
    printf("b = %s\n", b);
    printf("c = %s\n", c);
    printf("p = %s\n", p);

    return 0;
}
```

输出
```shell
a = abc
b = abc
c = adc
p = abc
```

自动处理数组大小

```cpp

#include <stdio.h>

int main() {
    char a[] = {'a', 'b', 'c', '\0'};
    char b[] = {"abc"};
    char c[] = "abc";
    char *p = "abc";
    
    printf("a = %s, sizeof(a) = %ld\n", a, sizeof(a));
    printf("b = %s, sizeof(b) = %ld\n", b, sizeof(b));
    printf("c = %s, sizeof(c) = %ld\n", c, sizeof(c));
    printf("p = %s, sizeof(p) = %ld\n", p, sizeof(p));

    return 0;
}
```

输出

```shell
a = abc, sizeof(a) = 4
b = abc, sizeof(b) = 4
c = abc, sizeof(c) = 4
p = abc, sizeof(p) = 8
```

修改字符串

```cpp
#include <stdio.h>

int main() {
    char a[] = {'a', 'b', 'c', '\0'};

    printf("before: a = %s\n", a);
    // before: a = abc

    // a = {'d', 'e', 'f', '\0'}; // 错误，数组不能重新赋值

    a[0] = 'd';
    a[1] = 'e';
    a[2] = 'f';
    a[3] = '\0';

    printf("after: a = %s\n", a);
    // after: a = def

    return 0;
}
```

字符空间拷贝函数

声明

```cpp
char *strcpy(char *dest, const char *src)

char *strncpy(char *dest, const char *src, size_t n)
```

- 内存空间逐一赋值
- 特殊值 `'\0'` 结束
- strcpy 会出现内存泄漏，推荐使用 strncpy

```cpp
char buf[10] = "abc";

strcpy(buf, "hello world");

```

示例

```cpp
#include <stdio.h>
#include <string.h>

int main() {
    char buf[20] = "";

    printf("before: buf = %s\n", buf);
    // before: buf = 

    strcpy(buf, "hello world");

    printf("after: buf = %s\n", buf);
    // after: buf = hello world

    return 0;
}

```


## 3、结构体、共用体

### 3.1、定义、字节对齐

### 3.2、位域

## 4、内存分布图

## 5、段错误分析
