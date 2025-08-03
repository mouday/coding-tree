# ctype.h

`<ctype.h>` 提供了一组方便的函数，用于处理字符的分类和转换操作，是 C 标准库中处理字符操作的重要工具。

字符类

|字符类 | 描述 
|- | - 
数字 | 完整的数字集合: `{ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 }`
十六进制数字 | 集合:`{ 0 1 2 3 4 5 6 7 8 9 A B C D E F a b c d e f }` 
小写字母 | 集合 `{ a b c d e f g h i j k l m n o p q r s t u v w x y z }`
大写字母 | 集合  `{A B C D E F G H I J K L M N O P Q R S T U V W X Y Z }`
字母字符 | `小写字母`和`大写字母`的集合
字母数字字符 | `数字`、`小写字母`和`大写字母`的集合
标点符号字符 | 集合 ``! " # $ % & ' ( ) * + , - . / : ; < = > ? @ [ \ ] ^ _ ` { \| } ~``
图形字符 | `字母数字字符`和`标点符号字符`的集合
空格字符 | 制表符、换行符、垂直制表符、换页符、回车符、空格符的集合 
可打印字符 | `字母数字字符`、`标点符号字符`和`空格字符`的集合 
控制字符 | 在 ASCII 编码中，这些字符的八进制代码是从 000 到 037，以及 177（DEL）
空白字符 | 包括空格符和制表符

其他：[ASCII码表](../cpp-start/ascii.md)

## isalnum

该函数检查所传的字符是否是字母和数字。

```cpp
/**
 * 参数
 *   c -- 这是要检查的字符。
 * 返回值
 *   如果 c 是一个数字或一个字母，则该函数返回非零值，否则返回 0。
 */
int isalnum(int c)
```

示例

```cpp
#include <stdio.h>
#include <ctype.h>

int main()
{
    int ret = isalnum('3');
    printf("ret: %d\n", ret);
    return 0;
}
```

运行结果

```shell
% gcc main.c -o main && ./main                  
ret: 1
```

## isalpha

该函数检查所传的字符是否是字母。

```cpp
int isalpha(int c)
```

示例

```cpp
#include <stdio.h>
#include <ctype.h>

int main()
{
    int ret = isalpha('a');
    printf("ret: %d\n", ret);
    return 0;
}
```

运行结果

```shell
$ gcc main.c -o main && ./main
ret: 1
```

## iscntrl

该函数检查所传的字符是否是控制字符。

```cpp
/**
 * 参数
 *   c -- 这是要检查的字符。
 * 返回值
 *   如果 c 是一个控制字符，则该函数返回非零值，否则返回 0。
*/
int iscntrl(int c)
```

示例

```cpp
#include <stdio.h>
#include <ctype.h>

int main()
{
    int ret = iscntrl('\t');
    printf("ret: %d\n", ret);
    return 0;
}
```

运行结果

```shell
% gcc main.c -o main && ./main
ret: 1
```

## isdigit

该函数检查所传的字符是否是十进制数字。

```cpp
/**
 * 参数
 *   c -- 这是要检查的字符。
 * 返回值
 *   如果 c 是一个数字，则该函数返回非零值，否则返回 0。
 */
int isdigit(int c)
```

示例

```cpp
#include <stdio.h>
#include <ctype.h>

int main()
{
    int ret = isdigit('5');
    printf("ret: %d\n", ret);
    return 0;
}
```

运行结果

```shell
% gcc main.c -o main && ./main
ret: 1
```

## isxdigit

该函数检查所传的字符是否是十六进制数字。

```cpp
int isxdigit(int c)
```

示例

```cpp
#include <stdio.h>
#include <ctype.h>

int main()
{
    int ret = isxdigit('A');
    printf("ret: %d\n", ret);
    return 0;
}
```

运行结果

```shell
% gcc main.c -o main && ./main
ret: 1
```

## isgraph

该函数检查所传的字符是否有图形表示法。

```cpp
int isgraph(int c)
```

示例

```cpp
#include <stdio.h>
#include <ctype.h>

int main()
{
    int ret = isgraph('5');
    printf("ret: %d\n", ret);
    return 0;
}
```

运行结果

```shell
$ gcc main.c -o main && ./main
ret: 1
```

## isprint

该函数检查所传的字符是否是可打印的。

```cpp
int isprint(int c)
```

示例

```cpp
#include <stdio.h>
#include <ctype.h>

int main()
{
    int ret = isprint('a');
    printf("ret: %d\n", ret);
    return 0;
}
```

运行结果

```shell
% gcc main.c -o main && ./main
ret: 1
```

## ispunct

该函数检查所传的字符是否是标点符号字符。

```cpp
int ispunct(int c)
```

示例

```cpp
#include <stdio.h>
#include <ctype.h>

int main()
{
    int ret = ispunct('!');
    printf("ret: %d\n", ret);
    return 0;
}
```

运行结果

```shell
% gcc main.c -o main && ./main
ret: 1
```

## isspace

该函数检查所传的字符是否是空白字符。

```cpp
int isspace(int c)
```

示例

```cpp
#include <stdio.h>
#include <ctype.h>

int main()
{
    int ret = isspace(' ');
    printf("ret: %d\n", ret);
    return 0;
}
```

运行结果

```shell
% gcc main.c -o main && ./main
ret: 1
```

## islower

该函数检查所传的字符是否是小写字母。

```cpp
int islower(int c)
```

示例

```cpp
#include <stdio.h>
#include <ctype.h>

int main()
{
    int ret = islower('a');
    printf("ret: %d\n", ret);
    return 0;
}
```

运行结果

```shell
% gcc main.c -o main && ./main
ret: 1
```

## isupper

该函数检查所传的字符是否是大写字母。

```cpp
int isupper(int c)
```

示例

```cpp
#include <stdio.h>
#include <ctype.h>

int main()
{
    int ret = isupper('A');
    printf("ret: %d\n", ret);
    return 0;
}
```

运行结果

```shell
% gcc main.c -o main && ./main
ret: 1
```

## tolower

该函数把大写字母转换为小写字母。

```cpp
int tolower(int c)
```

示例

```cpp
#include <stdio.h>
#include <ctype.h>

int main()
{
    int ret = tolower('A');
    printf("ret: %c\n", ret);
    return 0;
}
```

运行结果

```shell
% gcc main.c -o main && ./main
ret: a
```

## toupper

该函数把小写字母转换为大写字母。

```cpp
int toupper(int c)
```

示例

```cpp
#include <stdio.h>
#include <ctype.h>

int main()
{
    int ret = tolower('A');
    printf("ret: %c\n", ret);
    return 0;
}
```

运行结果

```shell
$ gcc main.c -o main && ./main
ret: a
```
