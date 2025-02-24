# C语言内存空间的使用

1、指针
1.1、指针概述
1.2、指针修饰符
const/volatile/typedef
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