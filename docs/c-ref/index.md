# C语言参考手册

## atoi

atoi (alphanumeric to integer)字符串转换为整数

```cpp
#include <stdlib.h>

int atoi(const char *str)
```

示例

```cpp
atoi("123"); // 123

atoi("-123"); // -123  

atoi("hello"); // 0

atoi("");  // 0

atoi(NULL); // exit code 139
```

注意：

1. atoi的入参不能是NULL


完整示例

```cpp
#include <stdio.h>
#include <stdlib.h>

int main() {
    int ret = atoi("123");
    printf("%d\n", ret); // 123
}
```

## itoa 

itoa (integer to alphanumeric) 整数转字符串

```cpp
/**
 * value: 要转换的整数，
 * string: 转换后的字符串,
 * radix: 转换进制数，如2,8,10,16 进制等。
 */
char* itoa(int value, char* string, int radix);
```

需要注意：itoa不是C的标准

一个实现参考

```cpp
// itoa.h
char* itoa(int value, char* string, int radix);
```

```cpp
// itoa.c
void reverse(char str[], int length) {
    int start = 0;
    int end = length - 1;

    while (start < end) {
        char temp = str[start];
        str[start] = str[end];
        str[end] = temp;
        start++;
        end--;
    }
}


char* itoa(int value, char* string, int radix) {
    int i = 0;
    int isNegative = 0;

    // 处理0的情况
    if (value == 0) {
        string[i++] = '0';
        string[i] = '\0';
        return string;
    }

    // 处理负数
    if (value < 0 && radix == 10) {
        isNegative = 1;
        value = -value;
    }

    // 处理其他数字
    while (value != 0) {
        int rem = value % radix;
        string[i++] = (rem > 9) ? (rem - 10) + 'a' : rem + '0';
        value = value / radix;
    }

    // 添加负号
    if (isNegative) {
        string[i++] = '-';
    }

    string[i] = '\0';

    // 反转字符串
    reverse(string, i);

    return string;
}
```

示例

```cpp
#include <stdio.h>
#include "itoa.h"

int main() {
    char ret[10];
    itoa(10, ret, 2);
    printf("%s\n", ret); // 1010

    itoa(10, ret, 8);
    printf("%s\n", ret); // 12

    itoa(10, ret, 16);
    printf("%s\n", ret); // a

    itoa(10, ret, 10);
    printf("%s\n", ret); // 10
}
```

替代方案`sprintf`

## sprintf

```cpp
int sprintf(char *str, const char *format, ...)
```

示例

```cpp
#include <stdio.h>
#include <string.h>

int main() {
    char ret[4];
    sprintf(ret, "%d", 123);
    printf("%s\n", ret); // 123
}

```