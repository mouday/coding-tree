# time.h

`<time.h>` 是 C 标准库中的一个头文件，提供了处理和操作日期和时间的函数和类型。这个头文件中的函数用于获取当前时间、设置时间、格式化时间和计算时间差等。

引入头文件

```cpp
#include <time.h>
```

## 数据结构

```cpp
typedef unsigned long clock_t;

#define NULL ((void *)0)

typedef unsigned long size_t;

typedef long time_t;

struct tm {
    int tm_sec;         /* 秒 [0-60]             */
    int tm_min;         /* 分 [0-59]              */
    int tm_hour;        /* 小时 [0-23]            */
    int tm_mday;        /* 一月中的第几天 [1-31]    */
    int tm_mon;         /* 月份 [0-11]            */
    int tm_year;        /* 自 1900 起的年数        */
    int tm_wday;        /* 一周中的第几天 [0-6]     */
    int tm_yday;        /* 一年中的第几天 [0-365]   */
    int tm_isdst;       /* 夏令时                  */
    long tm_gmtoff;     /* offset from UTC in seconds */
    char *tm_zone;      /* timezone abbreviation   */
};

struct timespec {
    time_t tv_sec;  // 秒
    long   tv_nsec; // 纳秒
};
```

## time

返回自纪元 Epoch（1970-01-01 00:00:00 UTC）起经过的时间，以秒为单位。

```cpp
/**
 * 参数
 *   seconds -- 这是指向类型为 time_t 的对象的指针，用来存储 seconds 的值。
 * 返回值
 *   以 time_t 对象返回当前日历时间。
 */
time_t time(time_t *timer)
```

示例

```cpp
#include <stdio.h>
#include <time.h>

int main()
{
    time_t seconds = time(NULL);

    printf("seconds: %ld\n", seconds);

    return 0;
}
```

运行结果

```shell
$ gcc main.c -o main && ./main
seconds: 1754060863
```

## ctime

返回一个表示当地时间的字符串，当地时间是基于参数 timer。

```cpp
/**
 * 参数
 * timer -- 这是指向 time_t 对象的指针，该对象包含了一个日历时间。
 * 返回值
 * 该函数返回一个 C 字符串，该字符串包含了可读格式的日期和时间信息。
 */
char *ctime(const time_t *timer)
```

示例

```cpp
#include <stdio.h>
#include <time.h>

int main()
{
    time_t now;

    time(&now);

    char *ret = ctime(&now);

    printf("ret: %s\n", ret);

    return 0;
}
```

运行结果

```shell
$ gcc main.c -o main && ./main
ret: Fri Aug  1 23:20:33 2025

```

## difftime

返回 time1 和 time2 之间相差的秒数 (time1-time2)。

```cpp
/**
 * 参数
 *   time1 -- 这是表示结束时间的 time_t 对象。
 *   time2 -- 这是表示开始时间的 time_t 对象。
 * 返回值
 *   该函数返回以双精度浮点型 double 值表示的两个时间之间相差的秒数 (time1 - time2)。
 */
double difftime(time_t time1, time_t time2)
```

示例

```cpp
#include <stdio.h>
#include <time.h>
#include <unistd.h>

int main()
{
    time_t start_t, end_t;

    time(&start_t);

    sleep(3);

    time(&end_t);

    double total_t = difftime(end_t, start_t);

    printf("total time: %f seconds\n", total_t);

    return 0;
}
```

运行结果

```shell
$ gcc main.c -o main && ./main
total time: 3.000000 seconds
```

## gmtime

timer 的值被分解为 tm 结构，并用协调世界时（UTC）也被称为格林尼治标准时间（GMT）表示。

```cpp
/**
 * 参数
 *   timeptr -- 这是指向表示日历时间的 time_t 值的指针。
 * 返回值
 *   该函数返回指向 tm 结构的指针，该结构带有被填充的时间信息
 */
struct tm *gmtime(const time_t *timer)
```

示例

```cpp
#include <stdio.h>
#include <time.h>
#include <unistd.h>

int main()
{
    time_t now_t;
    struct tm *now_tm;

    time(&now_t);

    now_tm = gmtime(&now_t);

    printf("seconds: %d\n", now_tm->tm_sec);
    printf("minutes: %d\n", now_tm->tm_min);
    printf("hours: %d\n", now_tm->tm_hour + 8); // 东八区
    printf("day: %d\n", now_tm->tm_mday);
    printf("months: %d\n", now_tm->tm_mon + 1);
    printf("years: %d\n", now_tm->tm_year + 1900);

    return 0;
}
```

运行结果

```shell
$ gcc main.c -o main && ./main
seconds: 21
minutes: 43
hours: 23
day: 1
months: 8
years: 2025
```

## localtime

timer 的值被分解为 tm 结构，并用本地时区表示。

```cpp
struct tm *localtime(const time_t *timer)
```

示例

```cpp
#include <stdio.h>
#include <time.h>
#include <unistd.h>

int main()
{
    time_t now_t;
    struct tm *now_tm;

    time(&now_t);

    now_tm = localtime(&now_t);

    printf("seconds: %d\n", now_tm->tm_sec);
    printf("minutes: %d\n", now_tm->tm_min);
    printf("hours: %d\n", now_tm->tm_hour);
    printf("day: %d\n", now_tm->tm_mday);
    printf("months: %d\n", now_tm->tm_mon + 1);
    printf("years: %d\n", now_tm->tm_year + 1900);

    return 0;
}
```

运行结果

```shell
$ gcc main.c -o main && ./main
seconds: 2
minutes: 46
hours: 23
day: 1
months: 8
years: 2025
```

## mktime

把 timeptr 所指向的结构转换为一个依据本地时区的 time_t 值。

```cpp
/**
 * 参数
 *   timeptr -- 这是指向表示日历时间的 time_t 值的指针
 * 返回值
 *   该函数返回自 1970 年 1 月 1 日以来持续时间的秒数。
 *   如果发生错误，则返回 -1 值。
 */
time_t mktime(struct tm *timeptr)
```

示例

```cpp
#include <stdio.h>
#include <time.h>

int main()
{
    struct tm t;

    t.tm_sec = 10;
    t.tm_min = 51;
    t.tm_hour = 23;
    t.tm_mday = 1;
    t.tm_mon = 8 - 1;
    t.tm_year = 2025 - 1900;

    time_t ret = mktime(&t);

    printf("ret: %ld\n", ret);

    return 0;
}
```

运行结果

```shell
% gcc main.c -o main && ./main
ret: 1754063470
```

## strftime

根据 format 中定义的格式化规则，格式化结构 timeptr 表示的时间，并把它存储在 str 中。

```cpp
/**
 * 参数
 *   str -- 这是指向目标数组的指针，用来复制产生的 C 字符串。
 *   maxsize -- 这是被复制到 str 的最大字符数。
 *   format -- 格式说明
 *   timeptr -- 这是指向 tm 结构的指针
 * 返回值
 *   如果产生的 C 字符串小于 size 个字符（包括空结束字符），则会返回复制到 str 中的字符总数（不包括空结束字符），
 *   否则返回零。
 */
size_t strftime(char *str, size_t maxsize, 
    const char *format, const struct tm *timeptr)
```

| 说明符|  替换为  | 实例
| -|  -  | -
| %a |  缩写的星期几名称  | Sun
| %A |  完整的星期几名称   | Sunday
| %b |  缩写的月份名称 |Mar
| %B |  完整的月份名称 |March
| %c |  日期和时间表示法   | Sun Aug 19 02:56:02 2012
| %d |  一月中的第几天（01-31） | 19
| %H |  24 小时格式的小时（00-23） |  14
| %I |  12 小时格式的小时（01-12） |  05
| %j |  一年中的第几天（001-366） |   231
| %m |  十进制数表示的月份（01-12） |   08
| %M |  分（00-59）   | 55
| %p |  AM 或 PM 名称 | PM
| %S |  秒（00-61）   | 02
| %U |  一年中的第几周，以第一个星期日作为第一周的第一天（00-53） |33
| %w |  十进制数表示的星期几，星期日表示为 0（0-6） |   4
| %W |  一年中的第几周，以第一个星期一作为第一周的第一天（00-53）| 34
| %x |  日期表示法  | 08/19/12
| %X |  时间表示法  | 02:50:06
| %y |  年份，最后两个数字（00-99）  |  01
| %Y |  年份  |2012
| %Z |  时区的名称或缩写   | CDT
| %% |  一个 % 符号 | %

示例

```cpp
#include <stdio.h>
#include <time.h>

int main()
{
    char buffer[20];
    time_t now_t;
    struct tm *now_tm;

    time(&now_t);

    now_tm = localtime(&now_t);

    strftime(buffer, sizeof(buffer), "%Y-%m-%d %H:%M:%S", now_tm);

    printf("ret: %s\n", buffer);

    return 0;
}
```

运行结果

```shell
$ gcc main.c -o main && ./main
ret: 2025-08-01 23:58:47
```

## asctime

返回一个指向字符串的指针，它代表了结构 timeptr 的日期和时间。

```cpp
/**
 * 参数
 *   timeptr 是指向 tm 结构的指针
 * 返回值
 *   该函数返回一个 C 字符串，包含了可读格式的日期和时间信息 Www Mmm dd hh:mm:ss yyyy，其中:
 *     Www 表示星期几
 *     Mmm 是以字母表示的月份
 *     dd 表示一月中的第几天
 *     hh:mm:ss 表示时间
 *     yyyy 表示年份
 */
char *asctime(const struct tm *timeptr)
```

示例

```cpp
#include <stdio.h>
#include <time.h>

int main()
{
    struct tm t;
    t.tm_sec = 10;
    t.tm_min = 10;
    t.tm_hour = 6;
    t.tm_mday = 25;
    t.tm_mon = 2;
    t.tm_year = 89;
    t.tm_wday = 6;

    char *ret = asctime(&t);

    printf("ret: %s\n", ret);

    return 0;
}
```

运行结果

```shell
gcc main.c -o main && ./main
ret: Sat Mar 25 06:10:10 1989

```

## timespec_get

获取当前时间（`C11`）

```cpp
/**
 * 参数
 *   ts：指向 timespec 结构的指针，该结构将被填充为当前时间。
 *   base：时间基准常量，C11 标准定义了 TIME_UTC，表示协调世界时 (UTC)。
 * 返回值
 *   成功时返回 base 的值（通常是 TIME_UTC）。
 *   失败时返回 0。
 */
int timespec_get(struct timespec *ts, int base);
```

示例

```cpp
#include <stdio.h>
#include <time.h>

int main()
{
    struct timespec ts;

    timespec_get(&ts, TIME_UTC);

    printf("seconds: %ld\n", ts.tv_sec);
    printf("microseconds: %ld\n", ts.tv_nsec);

    return 0;
}
```

运行结果

```shell
$ gcc main.c -o main && ./main
seconds: 1754064538
microseconds: 717116000
```

## clock

返回程序执行起（一般为程序的开头），处理器时钟所使用的时间。

```cpp
/**
 * 参数
 *   NA
 * 返回值
 *   返回自程序启动起，处理器时钟所使用的时间。
 *   如果失败，则返回 -1 值。
 */
clock_t clock(void)
```

示例

```cpp
#include <stdio.h>
#include <time.h>
#include <unistd.h>

int main()
{
    clock_t start_t, end_t;

    start_t = clock();

    sleep(3);

    end_t = clock();

    double total_t = ((double)(end_t - start_t)) / CLOCKS_PER_SEC;

    printf("total time: %f seconds\n", total_t);

    return 0;
}
```

运行结果

```shell
$ gcc main.c -o main && ./main
total time: 0.000052 seconds
```

> 注意：虽然暂停了3秒，最后获取的是CPU 所使用的秒数
