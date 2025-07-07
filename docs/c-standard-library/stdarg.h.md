# stdarg.h

printf 等函数，实现了变长参数列表，我们也能通过`stdarg.h` 实现

| 类型    | 说明                                                |
| ------- | --------------------------------------------------- |
| va_list | 保存 va_start、va_arg、va_end 和 va_copy 所需的信息 |

| 宏       | 说明                         |
| -------- | ---------------------------- |
| va_start | 允许访问可变参数函数的参数   |
| va_arg   | 访问下一个可变参数函数的参数 |
| va_copy  | (C99) 复制可变参数函数的参数 |
| va_end   | 结束对可变参数函数参数的遍历 |

## va_list

用于存储可变参数信息的类型

```cpp
// #include <stdarg.h>

#ifndef _VA_LIST
typedef __builtin_va_list va_list;
#define _VA_LIST
#endif
```

## va_start

用于初始化一个 va_list 变量，以便在可变参数函数中访问可变数量的参数。

这个宏必须在使用 va_arg 和 va_end 之前被调用。

```cpp
/**
 * 参数
 *   ap     va_list变量
 *   param  最后一个已知的固定参数，即省略号之前的参数
 * 返回值
 *   无
 */
#define va_start(ap, param) __builtin_va_start(ap, param)
```

## va_end

用于清理 va_list 变量，并使其不再指向任何有效的内存位置。

它在可变参数函数的末尾使用，以结束可变参数的处理。

```cpp
/**
 * 参数
 *   va_list ap：这是一个 va_list 类型的变量，它已经通过 va_start 或 va_copy 宏初始化，用于访问可变参数列表。
 * 返回值
 *   无
 */
#define va_end(ap)          __builtin_va_end(ap)
```

## va_arg

用于在可变参数函数中依次获取每个可变参数的值。

它在使用 va_start 宏初始化了 va_list 变量之后，用于访问可变参数列表中的下一个参数。

```cpp
/**
 * 参数
 *   va_list ap：一个 va_list 类型的变量，它已经通过 va_start 宏初始化，指向当前可变参数列表的位置。
 *   type：要获取的下一个参数的类型。必须是一个可以明确识别的类型。
 * 返回值
 *   返回当前可变参数列表中的下一个参数，类型为 type。
 */
#define va_arg(ap, type)    __builtin_va_arg(ap, type)
```

示例

```cpp
#include <stdio.h>
#include <stdarg.h>

void print_values(int count, ...)
{
    va_list args;

    va_start(args, count);

    printf("[");
    for (int i = 0; i < count; i++)
    {
        int value = va_arg(args, int);

        if (i + 1 < count)
        {
            printf("%d, ", value);
        }
        else
        {
            printf("%d", value);
        }
    }
    va_end(args);

    printf("]\n");
}

int main(int argc, char **argv)
{

    print_values(5, 1, 2, 3, 4, 5);

    return 0;
}

```

输出结果

```shell
$ gcc main.c -o main -g && ./main
[1, 2, 3, 4, 5]
```

## va_copy

将 src 复制到 dest

```cpp
/**
 * 参数
 *   dest	-	要初始化的 va_list 类型的实例
 *   src	-	将用于初始化 dest 的源 va_list
 * 返回值
 *  无
*/
#define va_copy(dest, src)  __builtin_va_copy(dest, src)
```


示例

```cpp
#include <stdio.h>
#include <stdarg.h>

/**
 * 求和和求积
 */
void sum_and_product(int result[2], int count, ...)
{
    va_list sum_args;
    va_list product_args;
    int sum = 0;
    int product = 1;

    // sum
    va_start(sum_args, count);
    va_copy(product_args, sum_args); // copy

    for (int i = 0; i < count; i++)
    {
        sum += va_arg(sum_args, int);
    }
    va_end(sum_args);

    result[0] = sum;

    // product
    for (int i = 0; i < count; i++)
    {
        product *= va_arg(product_args, int);
    }
    va_end(product_args);
    result[1] = product;
}

int main(int argc, char **argv)
{
    int result[2];

    sum_and_product(result, 5, 1, 2, 3, 4, 5);

    printf("sum: %d, product: %d\n", result[0], result[1]);
    // sum: 15, product: 120

    return 0;
}
```

输出结果

```shell
$ gcc main.c -o main -g && ./main 
sum: 15, product: 120
```
