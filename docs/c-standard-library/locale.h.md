# locale.h

`<locale.h>` 是 C 标准库中的一个头文件，用于支持程序的国际化和本地化。它提供了一组函数和宏来设置或查询程序的本地化信息，例如日期、时间、货币、数字格式等。

引入头文件

```cpp
#include <locale.h>
```

查看所有locale

```shell
locale -a | grep zh_CN
```

## 数据结构

常用

```cpp
typedef struct _xlocale * locale_t;

struct lconv {
    char *decimal_point;       // 小数点字符
    char *thousands_sep;       // 千位分隔符
    char *grouping;            // 数字分组方式

    char *int_curr_symbol;     // 国际货币符号
    char *currency_symbol;     // 本地货币符号
    char *mon_decimal_point;   // 货币小数点字符
    char *mon_thousands_sep;   // 货币千位分隔符
    char *mon_grouping;        // 货币分组方式
    char *positive_sign;       // 正数符号
    char *negative_sign;       // 负数符号

    char int_frac_digits;      // 国际小数位数
    char frac_digits;          // 本地小数位数
    char p_cs_precedes;        // 正值货币符号前置
    char p_sep_by_space;       // 正值货币符号与值之间的间隔
    char n_cs_precedes;        // 负值货币符号前置
    char n_sep_by_space;       // 负值货币符号与值之间的间隔
    char p_sign_posn;          // 正值符号位置
    char n_sign_posn;          // 负值符号位置
};
```

## setlocale

设置或读取地域化信息。

```cpp
/**
 * 参数
 *   category：指定要设置或查询的本地化类别。
 *   locale：指定要设置的本地化信息。可以是以下之一：
 *     - ""：设置为用户环境变量中的默认设置。
 *     - NULL：查询当前的本地化信息。
 *     - 具体的区域设置名称：如 "en_US.UTF-8"，用于设置特定的区域设置。
 * 返回值
 *   如果 locale 为 NULL，返回一个指向当前区域设置信息字符串的指针。
 *   如果 locale 非 NULL 并且成功设置，返回一个指向该区域设置信息字符串的指针。
 *   如果 locale 非 NULL 并且设置失败，返回 NULL。
 */
char *setlocale(int category, const char *locale)
```

`category` 可以是以下宏之一：

|值 | 说明
| - | -
LC_ALL：| 所有本地化类别。
LC_COLLATE：| 字符串比较的本地化信息。
LC_CTYPE：| 字符处理的本地化信息。
LC_MONETARY：| 货币格式的本地化信息。
LC_NUMERIC：| 数字格式的本地化信息。
LC_TIME：| 时间格式的本地化信息。

示例

```cpp
#include <stdio.h>
#include <locale.h>

int main()
{
    char *locale_info = NULL;

    // 查询当前的本地化信息
    locale_info = setlocale(LC_ALL, NULL);

    printf("before locale_info: %s\n", locale_info);

    // 设置本地化信息为用户环境变量中的默认设置
    setlocale(LC_ALL, "");

    // 查询当前的本地化信息
    locale_info = setlocale(LC_ALL, NULL);

    printf("after locale_info: %s\n", locale_info);

    return 0;
}
```

运行结果

```shell
gcc main.c -o main && ./main
before locale_info: C
after locale_info: en_US.UTF-8
```

## localeconv

设置或读取地域化信息。

```cpp
struct lconv *localeconv(void)
```

示例

```cpp
#include <stdio.h>
#include <locale.h>
#include <time.h>

int main()
{
    // 设置本地化信息为用户环境变量中的默认设置
    setlocale(LC_ALL, "");

    // 获取当前区域设置的本地化信息
    struct lconv *lc = localeconv();
    printf("Local currency symbol: %s\n", lc->currency_symbol);
    return 0;
}
```

运行结果

```shell
gcc main.c -o main && ./main
Local currency symbol: $
```

## newlocale

创建一个新的本地化对象。

```cpp
/**
 * 参数
 *   category_mask：一个或多个要设置的本地化类别的掩码。
 *   locale：一个字符串，指定要设置的区域设置名称（例如 "en_US.UTF-8"）。如果为 NULL，则使用默认区域设置。
 *   base：一个现有的 locale_t 对象，用作创建新本地化对象的基础。如果为 NULL，则从头开始创建新对象。
 * 返回值
 *     成功时，返回新创建的本地化对象（类型为 locale_t）。
 *     失败时，返回 NULL。
 */
locale_t newlocale(int category_mask, const char *locale, locale_t base)
```

`category_mask` 可以是以下宏的组合（通过按位或运算符 | 组合）：

|取值 | 说明
|-|-
LC_COLLATE_MASK | 字符串比较相关的本地化信息。
LC_CTYPE_MASK | 字符分类和转换相关的本地化信息。
LC_MONETARY_MASK | 货币格式相关的本地化信息。
LC_NUMERIC_MASK | 数字格式相关的本地化信息。
LC_TIME_MASK | 时间格式相关的本地化信息。
LC_MESSAGES_MASK | 消息显示相关的本地化信息。
LC_ALL_MASK | 所有本地化类别。

示例

```cpp
#include <stdio.h>
#include <locale.h>
#include <time.h>
#include <xlocale.h> // 使用 GNU 扩展时需要

int main()
{
    // 创建一个新的本地化对象，使用 "en_US.UTF-8" 区域设置
    locale_t newloc = newlocale(LC_ALL_MASK, "en_US.UTF-8", (locale_t)0);
    if (newloc == (locale_t)0)
    {
        perror("newlocale");
        return 1;
    }

    // 将当前线程的本地化对象设置为新的本地化对象
    locale_t oldloc = uselocale(newloc);

    // 获取并打印当前的本地化信息
    struct lconv *lc = localeconv();
    printf("currency_symbol: %s\n", lc->currency_symbol);

    // 恢复之前的本地化对象
    uselocale(oldloc);

    // 释放新的本地化对象
    freelocale(newloc);

    return 0;
}
```

运行结果

```shell
$ gcc main.c -o main && ./main
currency_symbol: $
```

## freelocale

释放一个本地化对象。

```cpp
/**
 * 参数
 *   locale：要释放的本地化对象（类型为 locale_t）。
 * 返回值
 *   无返回值。
 */
freelocale(locale_t locale)
```

示例

```cpp
#include <stdio.h>
#include <locale.h>
#include <xlocale.h> // GNU 扩展

int main() {
    // 创建一个新的本地化对象，使用 "zh_CN.UTF-8" 区域设置
    locale_t newloc = newlocale(LC_ALL_MASK, "zh_CN.UTF-8", (locale_t)0);
    if (newloc == (locale_t)0) {
        perror("newlocale");
        return 1;
    }

    // 将当前线程的本地化对象设置为新的本地化对象
    locale_t oldloc = uselocale(newloc);

    // 执行与新本地化对象相关的操作
    struct lconv *lc = localeconv();
    printf("currency_symbol: %s\n", lc->currency_symbol);

    // 恢复之前的本地化对象
    uselocale(oldloc);

    // 释放新的本地化对象
    freelocale(newloc);

    return 0;
}
```

运行结果

```shell
 gcc main.c -o main && ./main
currency_symbol: ￥
```

## uselocale

设置或查询线程的本地化对象。

```cpp
/**
 * 参数
 *   newloc：要设置为当前线程本地化对象的 locale_t 对象。
 *     如果为 LC_GLOBAL_LOCALE，则使用全局区域设置。
 *     如果为 NULL，则不更改当前本地化对象，仅返回当前本地化对象。
 *     其他有效的 locale_t 对象将被设置为当前线程的本地化对象。
 * 返回值
 *   成功时，返回先前的 locale_t 对象（当前线程的本地化对象）。
 *   失败时，返回 LC_GLOBAL_LOCALE 并设置适当的错误代码。
 */
locale_t uselocale(locale_t newloc)
```

示例

```cpp
#include <stdio.h>
#include <locale.h>
#include <xlocale.h> // 使用 GNU 扩展时需要

int main()
{
    // 创建一个新的本地化对象，使用 "zh_CN.UTF-8" 区域设置
    locale_t newloc = newlocale(LC_ALL_MASK, "zh_CN.UTF-8", (locale_t)0);
    if (newloc == (locale_t)0)
    {
        perror("newlocale");
        return 1;
    }

    // 获取并打印当前的本地化信息
    struct lconv *lc = localeconv();
    printf("current currency_symbol: %s\n", lc->currency_symbol);

    // 将当前线程的本地化对象设置为新的本地化对象
    locale_t oldloc = uselocale(newloc);

    // 获取并打印新的本地化信息
    lc = localeconv();
    printf("new currency_symbol: %s\n", lc->currency_symbol);

    // 恢复之前的本地化对象
    uselocale(oldloc);

    // 获取并打印恢复后的本地化信息
    lc = localeconv();
    printf("old currency_symbol: %s\n", lc->currency_symbol);

    // 释放新的本地化对象
    freelocale(newloc);

    return 0;
}
```

运行结果

```shell
$ gcc main.c -o main && ./main
current currency_symbol: 
new currency_symbol: ￥
old currency_symbol: 
```
