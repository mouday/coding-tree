# 深拷贝和浅拷贝

错误示例

```cpp
#include <stdlib.h>

struct Data {
    char* name;
};

int main(int argc, char **argv) {
    struct Data data1;
    struct Data data2;

    data1.name = (char*)malloc(sizeof(char) * 10);

    // 直接复制是浅拷贝
    data2 = data1;

    // 释放2次，会出现重复释放
    free(data1.name);
    free(data2.name);

    return 0;
}

```
报错

```shell
main(40920,0x7ff8494c4fc0) malloc: *** error for object 0x600002dd4000: pointer being freed was not allocated
main(40920,0x7ff8494c4fc0) malloc: *** set a breakpoint in malloc_error_break to debug
```

正确做法

```cpp
#include <stdlib.h>
#include <string.h>

struct Data {
    char* name;
};

int main(int argc, char **argv) {
    struct Data data1;
    struct Data data2;

    data1.name = (char*)malloc(sizeof(char) * 10);

    // 深拷贝：重新申请内存
    data2.name = (char*)malloc(sizeof(char) * 10);
    memcpy(data1.name, data2.name, 10);

    free(data1.name);
    free(data2.name);

    return 0;
}

```