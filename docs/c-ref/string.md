# string

## strdup

复制字符串

```c
char* strdup(const char* s);
```

eg:

```c
#include <stdio.h>
#include <string.h>

void main() {
    char *a = "good luck!";
    char *b;

    // 复制
    b = strdup(a);

    printf("a = %s\n", a);
    printf("b = %s\n", b);

    // output:
    // a = good luck!
    // b = good luck!
}

```