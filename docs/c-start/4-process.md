# 第四章 流程控制结构

三种：

- 顺序结构
- 分支结构：`if-else`、`switch-case`
- 循环结构：`for`、`while`、`do-while`

## 1、顺序结构

前向引用：后面的代码可以使用前面声明过的

```c
#include <stdio.h>

int main() {

    int a = 10;
    int b = 20;

    // 先定义了a和b，才能使用
    int c = a + b;
    
    printf("%d\n", c);
    // 输出：30

    return 0;
}

```

## 2、分支结构

1、if-else

- 单分支
- 二选一
- 多选一

```c
#include <stdio.h>

int main() {
    int a = 10;

    if (a < 0) {
        printf("a < 0\n");
    } else if (a > 0) {
        printf("a > 0\n");
    } else {
        printf("a == 0\n");
    }
    // 输出：a > 0

    return 0;
}

```

示例：判断是否是闰年

```c
#include <stdio.h>

int main() {
    int year;

    scanf("%d", &year);

    if (year % 400 == 0 || (year % 4 == 0 && year % 100 != 0)) {
        printf("%d is a leap year", year);
    } else {
        printf("%d is not a leap year", year);
    }

    return 0;
}

```

2、switch-case

```c
#include <stdio.h>

int main() {
    int num = 3;

    // 只能是整型或字符型等值匹配
    switch (num) {
        case 1: {
            printf("case 1");
            break;
        }
        case 2: {
            printf("case 2");
            break;
        }
        case 3: {
            printf("case 3");
            break;
        }
        default: {
            printf("default");
        }
    }
    // 输出：case 3
    return 0;
}

```

case穿透

```c
#include <stdio.h>

int main() {
    int num = 3;

    switch (num) {
        case 1:
        case 2:
        case 3: {
            printf("case 1 2 3");
            break;
        }
        default: {
            printf("default");
        }
    }
    // 输出：case 1 2 3
    return 0;
}
```

## 3、循环结构

循环四要素
- 初始条件
- 循环条件
- 循环体
- 迭代条件


1、`for` 示例

```c
#include <stdio.h>

int main() {
    for (int i = 1; i <= 3; i++) {
        printf("%d ", i);
    }
    // 输出：1 2 3 
    return 0;
}

```

示例：求水仙花数

```c
#include <stdio.h>

int main() {
    int a, b, c;

    // 水仙花数：eg: 153 = 1^3 + 5^3 + 3^3
    for (int i = 100; i < 1000; i++) {
        a = i % 10;      // 个位
        b = i / 10 % 10; // 十位
        c = i / 100;     // 百位

        if (a * a * a + b * b * b + c * c * c == i) {
            printf("%d\n", i);
        }
    }

    return 0;
}

```

输出

```c
153
370
371
407
```

2、`while`示例

```c

```

3、`do-while`示例

```c

```





```c

```


https://www.bilibili.com/video/BV1Bh4y1q7Nt/?p=35