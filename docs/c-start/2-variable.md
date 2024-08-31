# 第二章 变量与进制

## 1、关键字和标识符

关键字keyword：预定义

标识符命名规则

- 26个英文字母大小写、0-9 或 _
- 数字不可开头
- 不可以是关键字
- 不允许有空格
- 严格区分大小写
- C99和C11不限制长度，编译器只识别前63个字符

命名建议

- 见名知意
- 避免数字
- 宏定义、枚举常数、常量，全大写下划线分割
- 避免使用下划线开头
- 变量名、函数名多个单词用下划线连接
- 统一用下划线命名或者小驼峰命名

## 2、变量

变量三要素：数据类型、变量名、变量值

变量声明格式

```c
// 声明同时赋值
数据类型 变量名 = 变量值;

// 或者 先声明后赋值
数据类型 变量名;
变量名 = 变量值;
```

eg:

```c
int a;
a = 10;

// 或者
int a = 10;
```

> 备注：先赋值，在使用，避免使用到异常数据

## 3、变量作用域


- 大括号内`{}`有效
- 同一个作用域变量名不能重复

```c
for (int i = 0; i < 10; ++i) {
    printf(" i = %d\n", i);
}

printf(" i = %d\n", i); // 变量i 超出作用于，编译失败
```


作用域分类

- 块作用域
- 文件作用域

## 4、数据类型

分类：

- 基本数据类型
    - 整型
        - 短整型 short
        - 整型 int
        - 长整型 long

    - 浮点型
        - 单精度浮点型float
        - 双精度浮点型double
    - 字符型 char
- 构造类型
    - 数组类型
    - 结构体类型 struct
    - 共用体类型 union
    - 枚举类型 enum
- 指针类型
- 空类型 void
- 后续新增类型：
    - 整型 long long
    - 浮点型 long double
    - 布尔型 _Bool

> 注意：c语言中没有字符串类型，用字符数组表示字符串

## 5、整数类型

修饰符

- `signed` 带符号位，有正负号，默认
- `unsigned` 不带符号位，只能表示零和正整数

单位

- bit 位：计算机中的最小存储单位
- byte 字节：计算机中基本存储单元 

```
1 byte = 8 bit
```

不同类型占用空间大小

| 类型 | 占用空间
| - | -
shot | 2字节
int | 通常4字节
long | 4或8字节
long long | 4或8字节（c99新增）

> 需要区分32位、64位编译器

```c
// 整数常量，默认int
int a = 20;

// 等价于
signed int a = 20;
```

后缀

```c
// 声明long可以使用后缀: l或L
long l1 = 123; // int -> long
long l2 = 123L; // long

// 声明long long可以使用后缀: ll或LL
long long ll = 123LL;

// 声明无符号整数使用：u或U
unsigned int x = 123U;

unsigned long x = 123UL;

unsigned long long x = 123ULL;
```

精确宽度类型

- int8_t
- int16_t
- int32_t
- int64_t
- uint8_t
- uint16_t
- uint32_t
- uint64_t

整数的极限值

```c
#include <stdio.h>
#include <limits.h>

int main(void) {

    printf("%d\n", INT_MAX); // 最大值：2147483647
    printf("%d\n", INT_MIN); // 最小值：-2147483648

    return 0;
}

```

## 6、浮点类型

不同类型占用空间大小

| 类型 | 占用空间
| - | -
float | 4字节
double | 8字节
long double | 12字节

浮点型没有修饰符signed和unsigned

```c
// 浮点型默认为double

double d1 = 12.3;

long double d2 = 12.3L;

float f1 = 12.3F;
```

科学计数法

```c
// 12.3 x 10^3
double d1 = 12.3e+3;

// 或者
double d1 = 12.3e3;

0.3E6 等价于 .3E6
3.0E6 等价于 3.E6
```

示例：华氏度转摄氏度

```c
#include <stdio.h>

int main(void) {
    // 华氏度f（64）转摄氏度c（17.8）
    double f = 64.0;

    // 计算公式：c = (5 / 9) * (f - 32)
    double c = (5.0 / 9) * (f - 32);
    printf("%.2f\n", c);
    // 输出：17.78

    return 0;
}

```

## 7、字符类型

char 表示一个字符，占用一个字节

```c
#include <stdio.h>

int main(void) {
    char c = 'A';
    // 等价于 char c = 65;

    printf("%c\n", c); // A
    printf("%d\n", c); // 65

    return 0;
}

```

区分字符1和数字1

```c
#include <stdio.h>

int main(void) {
    char c1 = '1';
    char c2 = 1;

    printf("c1=%c (%d)\n", c1, c1); // c1=1 (49)
    printf("c2=%c (%d)\n", c2, c2); // c2=SOH (1)

    return 0;
}

```

char每个字符对应一个ASCII码，是一个数值，可以进行加减乘除运算

特殊值

| ASCII码 | 控制字符
| - | -
48 | 0
65 | A
97 | a

char型允许有修饰符signed和unsigned

转义字符

| 转义字符 | 说明
|-|-
`\n` | 换行
`\t` | 制表
`\'` | 单引号
`\"` | 双引号
`\0` | null字符


## 8、布尔类型

1、C89没有布尔值

- 真：非零，比如：1
- 假：0

```c
#include <stdio.h>

int main(void) {
    int flag = 1;

    if (flag) {
        printf("true\n");
    } else {
        printf("false\n");
    }

    // 输出：true
    return 0;
}

```

2、C89中可以通过宏定义布尔值

```c
#include <stdio.h>

// 定义bool类型
#define BOOL int // 也可以使用 typedef int BOOL
#define TRUE 1
#define FALSE 0

int main(void) {
    BOOL flag = TRUE;

    if (flag) {
        printf("true\n");
    } else {
        printf("false\n");
    }

    // 输出：true
    return 0;
}

```

3、C99新增了 `_Bool`表示布尔值

```c
#include <stdio.h>

int main(void) {
    _Bool flag = 1;

    if (flag) {
        printf("true\n");
    } else {
        printf("false\n");
    }

    // 输出：true
    return 0;
}

```

4、C99还提供了头文件 `stdbool.h`

```c
#include <stdio.h>
#include <stdbool.h>

int main(void) {
    bool flag = true;

    if (flag) {
        printf("true\n");
    } else {
        printf("false\n");
    }

    // 输出：true
    return 0;
}

```

## 9、不同类型变量运算规则

1、隐式类型转换

窄类型自动转为宽类型

```c
int main(void) {

    short s = 10; // short
    int i = s; // short => int
    long l = i; // int => long
    double d = l; // long => double

    float f = 3.14F; // float
    double d2 = f; // float => double

    return 0;
}

```

计算结果为位数较多的那个类型

```c
int main(void) {

    char c = 'A';
    int a = c + 1; // char + int => int

    return 0;
}

```

2、强制类型转换

宽类型赋值给窄类型


```c
#include <stdio.h>

int main(void) {

    double d = 3.99;
    int i = (int)d;  // 数据截断，不会四舍五入
    printf("%d\n", i); // 3

    return 0;
}

```

注意：强制类型转换可能会有精度损失

```c
#include <stdio.h>

int main(void) {

    int d = 40000;
    short i = (short)d;
    printf("%d\n", i); // -25536

    return 0;
}

```

3、运算溢出

```c
#include <limits.h>
#include <stdio.h>

int main(void) {

    int i = INT_MAX;
    i++;
    printf("%d\n", i); // -2147483648

    return 0;
}

```

## 10、常量

常量：不能改变的量

常量分为以下几种

- 字面常量
- `#define`
- `const` c99新增
- 枚举常量

1、字面常量

```c
3.14; // 字面常量
```


2、`#define`

格式

```c
#define 常量名 常量值
```

eg:

```c
#include <stdio.h>

#define PI 3.14

int main(void) {
    printf("%.2f\n", PI); // -2147483648

    return 0;
}

```

3、`const`

```c

int main(void) {
    const float PI = 3.14F;

    return 0;
}

```

4、枚举常量

```c
#include <stdio.h>

enum Sex {
    UNKNOW,
    MALE,
    FEMALE
};

int main(void) {
    enum Sex sex = FEMALE;
    printf("sex = %d\n", sex);
    // sex = 2

    return 0;
}

```

## 11、输入输出函数

- 输入：从外部输入到计算机
- 输出：从计算机向外部输出


| 类型 |输入函数 | 输出函数
|-|-|-
任意类型 | scanf | printf
单个字符 | getchar | putchar
字符串 | gets | puts

1、scanf/printf

eg: 输入半径，计算圆的面积

```c

#include <stdio.h>

// 圆周率
# define PI 3.14

int main(void) {
    float radius; // 半径

    scanf("%f", &radius); // 阻塞等待

    float area = PI * radius * radius;

    printf("area = %.2f\n", area);
    // 输入10
    // 输出：area = 314.00

    return 0;
}

```

eg: 输入多个值，求乘积

```c
#include <stdio.h>

int main(void) {
    int a, b, c;

    // 输入值分隔：空格 Tab Enter
    scanf("%d%d%d", &a, &b, &c);

    int result = a * b * c;
    printf("result = %d\n", result);
    // 输入：2 4 3
    // 输出：result = 24

    return 0;
}

```

2、getchar/putchar

```c
#include <stdio.h>

int main(void) {
    char c = getchar(); // 阻塞等待

    putchar(c);
    // 输入：A
    // 输出：A

    return 0;
}

```

3、gets/puts

```c
#include <stdio.h>

int main(void) {
    char str[10];
    gets(str);

    puts(str);
    // 输入：hello
    // 输出：hello

    return 0;
}

```

## 12、变量按照声明位置分类

分类

- 全局变量
- 局部变量

```c
#include <stdio.h>

int a = 100; // 全局变量

int main(void) {
    int a = 200; // 局部变量

    printf("%d\n", a); // 输出：200

    return 0;
}

```

## 13、常见的进制

| 进制 | 数字 | 进位规则 | 前缀
| - | - | - | -
十进制 decimal | 0-9 | 满十进一 | -
二进制 binary | 0-1 | 满二进一 | `0b`/`0B`
八进制 octal | 0-7 | 满八进一 | `0`
十六进制 hex | 0-9,a-f不区分大小写 | 满十六进一 | `0x`/`0X`

eg:

```c
#include <stdio.h>

int main(void) {
    int a = 10; // 十进制
    int b = 0B10; // 二进制
    int c = 010; // 八进制
    int d = 0X10; // 十六进制

    printf("十进制：a = %d，b = %d，c = %d，d = %d\n", a, b, c, d);
    printf("八进制：a = %#o，b = %#o，c = %#o，d = %#o\n", a, b, c, d);
    printf("十六进制：a = %#x，b = %#x，c = %#x，d = %#x\n", a, b, c, d);

    return 0;
}

```

输出
```shell
十进制：a = 10，b = 2，c = 8，d = 16
八进制：a = 012，b = 02，c = 010，d = 020
十六进制：a = 0xa，b = 0x2，c = 0x8，d = 0x10
```


## 进制之间转换

二进制使用补码存储，最高位是符号位

- 正数 最到位是`0`
- 负数 最高位是`1`

规则：

1. 正数的补码、反码和原码一样，三码合一
2. 负数的补码、反码和原码不一样
    - 负数的`原码`：十进制转为二进制，最高位位1
    - 负数的`反码`：原码基础上，最高位不变，其余位取反（0->1, 1->0）
    - 负数的`补码`：反码 + 1

```c

```


```c

```


```c

```


```c

```


```c

```


```c

```


```c

```


```c

```


```c

```


```c

```


```c

```


```c

```


```c

```


```c

```


```c

```


```c

```


```c

```


```c

```


```c

```


```c

```


```c

```


```c

```

https://www.bilibili.com/video/BV1Bh4y1q7Nt?p=17








