# 内存对齐

示例

```cpp
#include <stdio.h>

struct Data {
    int a;
    char b;
    int c;
};

int main(int argc, char **argv) {
    struct Data data;
    data.a = 1;
    data.b = 'b';
    data.c = 2;

    printf("size of data: %ld\n", sizeof(data));
    // size of data: 12

    return 0;
}

```

不同结构体所存放的内存数据

```cpp
struct Data {
    int a;  // 1
    char b; // 'a'
    int c;  // 3
};
```

内存数据

```shell
01 00 00 00   62 7f 00 00   02 00 00 00
```

`7f` 可能是无效数据，不会被访问到

```cpp
struct Data {
    int a; // 1
    char b; // 'b'
    char c; // 'c'
    char d; // 'd'
    char e; // 'e'
    int f; // 2
};
```

内存数据

```shell
01 00 00 00   62 63 64 65   02 00 00 00
```

如果不初始化，内存数据可能是无效的

```shell
00 a6 ba b7   f7 7f 00 00   9a b6 c1 05
```
