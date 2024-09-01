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

https://www.bilibili.com/video/BV1Bh4y1q7Nt/?p=30

```c

```


```c

```


```c

```
## 3、循环结构

```c

```


```c

```


```c

```


```c

```

