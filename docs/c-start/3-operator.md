# 第三章 运算符

## 1、运算符 operator

- 算数运算符
- 赋值运算符
- 关系运算符
- 逻辑运算符
- 位运算符
- 条件运算符
- sizeof运算符

按照操作数个数分

- 一元运算符
- 二元运算符
- 三元运算符


## 2、算数运算符

`+`、`-`、`*`、`/`、`%`、`++`、`--`

除法运算

```c
#include <stdio.h>


int main(int argc, char *argv[]) {
    int a = 12;
    int b = 5;


    // int / int => int
    int c = a / b;
    printf("%d\n", c);
    // 结果：2


    // (int + double) => double; double / int => double
    double d = (a + 0.0) / b;

    printf("%lf\n", d);
    // 结果: 2.400000

    return 0;
}

```

取模

```c
#include <stdio.h>


int main(int argc, char *argv[]) {
    int a = 13;
    int b = 5;

    // 结果与被模数相同
    int c = a % b;
    printf("%d\n", c);
    // 结果：3

    return 0;
}

```

自增`a++`

```c
#include <stdio.h>


int main() {
    int a = 1;
    int b = a++;

    printf("a = %d; b = %d\n", a, b);
    // a = 2; b = 1

    return 0;
}
```

自增`++a`

```c
#include <stdio.h>


int main() {
    int a = 1;
    int b = ++a;

    printf("a = %d; b = %d\n", a, b);
    // a = 2; b = 2

    return 0;
}

```

示例：打印一个三位整数的个位、十位、百位

```c
#include <stdio.h>


int main() {
    int a = 123;
    
    printf("个位：%d\n", a % 10);
    printf("十位：%d\n", (a / 10) % 10);
    printf("百位：%d\n", a / 100);

    return 0;
}

```

输出

```c
个位：3
十位：2
百位：1
```

示例：89小时是多少天零多少小时？

```c
#include <stdio.h>

int main() {
    int hours = 89;

    int days = hours / 24;
    int hour = hours % 24;

    printf("天：%d\n", days);
    printf("小时：%d\n", hour);

    return 0;
}

```

输出
```c
天：3
小时：17
```

## 3、赋值运算符

支持：`=`、`+=`、`-=`、`*=`、`/=`、`%=`

```c
#include <stdio.h>

int main() {
    int x = 100;
    x *= 10;  // 等价于：x = x * 10
    printf("x = %d\n", x); // x = 1000

    return 0;
}

```

示例：交换两个变量的值

```c
#include <stdio.h>

int main() {
    int x = 1;
    int y = 2;

    // 交换x和y的值
    int temp;
    temp = x;
    x = y;
    y = temp;

    printf("x = %d; y = %d\n", x, y);
    // x = 2; y = 1
    return 0;
}

```

## 4、关系运算符

支持：`>`、`>=`、`<`、`<=`、`==`、`!=`

```c
#include <stdio.h>

int main() {
    int x = 1;
    int y = 2;

    if(x > y) {
        printf("x > y");
    } else {
        printf("x < y");
    }
    // 输出：x < y
    return 0;
}

```

## 5、逻辑运算符

支持：`&&`、`||`、`!`

```c
#include <stdio.h>

int main() {
    int x = 5;

    if(x > 0 && x < 10) {
        printf("0 < x < 10");
    }
    // 输出：0 < x < 10

    return 0;
}

```
短路现象

```c
#include <stdio.h>

int main() {
    int x = 5;

    // 左边为真，右边就没有执行
    if(x > 0 || x++) {
        // do something
    }

    printf("%d", x);
    // 输出：5

    return 0;
}
```


```c
#include <stdio.h>

int main() {
    int x = 5;

    // 左边为假，右边就没有执行
    if(x < 0 && x++) {
        // do something
    }

    printf("%d", x);
    // 输出：5

    return 0;
}
```

## 6、位运算符

支持：`<<`、`>>`、`&`、`|`、`~`、`^`

左移补零

```c
3 << 4 相当于 3 * 2^4 = 3 * 16 = 48

// 负数移动的是补码
-3 << 4 相当于 -3 * 2^4 = 3 * 16 = -48
```

右移，正数补0，负数补1

```c
69 >> 4 相当于 69 / (2 ^ 4) = 69 / 16 = 4

// 负数移动的是补码
-69 >> 4 相当于 -69 / (2 ^ 4) = -69 / 16 = -5
```

示例：高效计算`2 * 8`的值

```c
#include <stdio.h>

int main() {
    // 2 * 8
    printf("%d", 2 << 3);
    // 输出：16

    return 0;
}
```

示例：清空高4位，保留低4位

```c
#include <stdio.h>

int main() {
    char c = 53; // 0b00110101
    c = c & 15 ; // 0b00001111

    printf("%d", c); // 0b00000101
    // 输出：5

    return 0;
}
```

## 7、条件运算符

```c
#include <stdio.h>

int main() {
    // 三目运算符
    int a = 15 > 10 ? 15 : 10;

    printf("%d", a);
    // 输出：15

    return 0;
}

```

## 8、sizeof运算符

返回占用字节数

```c
#include <stdio.h>

int main() {
    // 1、变量
    int a = 10;
    printf("%d\n", sizeof(a));
    // 输出：4

    // 2、类型
    printf("%d\n", sizeof(int));
    // 输出：4

    // 3、常量
    printf("%d\n", sizeof(10));
    // 输出：4

    return 0;
}

```

定义

```c
// size_t 系统决定，可能的类型：unsigned int，unsigned long
size_t sizeof(var);
```

示例

```c
#include <stdio.h>

int main() {
    // size_t类型的占位符：%zd、%zu
    size_t size = sizeof(int);
    printf("%zd\n", size);
    // 输出：4

    return 0;
}

```

## 9、运算符优先级

使用`()` 控制优先级

