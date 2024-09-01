# 第三章 运算符与流程控制

## 运算符 operator

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


1、算数运算符

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

2、赋值运算符

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

3、关系运算符

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

4、逻辑运算符

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

