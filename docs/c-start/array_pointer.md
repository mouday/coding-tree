# C语言基础：指针

## C语言基础：二维数组、一级指针、行指针/数组指针

示例

```cpp
#include <stdio.h>

int main(int argc, char const *argv[])
{
    // 2行3列的二维数组
    int arr[2][3] = {{1, 2, 3}, {4, 5, 6}};
    printf("arr: %p; arr+1: %p\n", arr, arr + 1);

    // 一级指针
    int *p = NULL;
    p = &arr[0][0];

    printf("p: %p; p+1: %p\n", p, p + 1);

    // 行指针，数组指针
    int (*arr_row)[3] = NULL;
    arr_row = arr;
    printf("arr_row: %p; arr_row+1: %p\n", arr_row, arr_row + 1);

    return 0;
}
```

输出结果

```shell
# 数组名，步长是，c是16进制，转为10进制是12，刚好是3个int的长度
arr: 0x7ff7bf10d1f0; arr+1: 0x7ff7bf10d1fc

# int指针，步长是4，一个int的大小
p: 0x7ff7bf10d1f0; p+1: 0x7ff7bf10d1f4

# 行指针，步长同数组名
arr_row: 0x7ff7bf10d1f0; arr_row+1: 0x7ff7bf10d1fc
```

总结

| 指针类型| 示例 | 步长 | 
| - | - | - | 
数组名 | `int arr[2][3]` | 步长是一行
int指针 | `int *p` | 步长是4
行指针 | `int (*p)[3]` | 步长同数组名

## 一级指针、二级指针

示例: 以下写法都是等价的

```cpp
#include <stdio.h>

int main(int argc, char const *argv[])
{
    int arr[2][3] = {{1, 2, 3}, {4, 5, 6}};
    
    printf("arr[1][2] = %d\n", arr[1][2]);
    printf("*(*(arr+1) + 2) = %d\n", *(*(arr+1) + 2));

    // 二维数组指针
    int (*p)[2][3];
    p = &arr;

    printf("(*p)[1][2] = %d\n", (*p)[1][2]);
    printf("*(*((*p)+1) + 2) = %d\n", *(*((*p)+1) + 2));

    // 一维数组指针，行指针
    int (*q)[3];
    q = arr; // 数组名表示数组的首地址

    printf("q[1][2] = %d\n", q[1][2]);
    printf("*(*(q+1) + 2) = %d\n", *(*(q+1) + 2));

    // 一级指针
    int *r;
    r = &arr[0][0];
    printf("r[5] = %d\n", r[5]);
    printf("*(r+5) = %d\n", *(r+5));

    // 二级指针
    int *s[2] = {arr[0], arr[1]};
    int **t;
    t = s;
    printf("*(t[1] + 2) = %d\n", *(t[1] + 2));
    printf("*(*(t + 1) + 2) = %d\n", *(*(t + 1) + 2));

    return 0;
}
```

输出结果

```shell
arr[1][2] = 6
*(*(arr+1) + 2) = 6
(*p)[1][2] = 6
*(*((*p)+1) + 2) = 6
q[1][2] = 6
*(*(q+1) + 2) = 6
r[5] = 6
*(r+5) = 6
*(t[1] + 2) = 6
*(*(t + 1) + 2) = 6
```
