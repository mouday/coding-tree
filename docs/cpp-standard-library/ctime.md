# ctime

处理时间和日期的标准库

头文件

```cpp
#include <ctime>
```

[C 标准库 time.h](../c-standard-library/time.h.md)

## 数据结构

```cpp
// 表示时间的类型，通常是一个长整型。
typedef long time_t;

// 一个结构体，用于表示时间的各个部分，如年、月、日、小时等。
struct tm {
    int    tm_sec;        /* seconds after the minute [0-60] */
    int    tm_min;        /* minutes after the hour [0-59] */
    int    tm_hour;       /* hours since midnight [0-23] */
    int    tm_mday;       /* day of the month [1-31] */
    int    tm_mon;        /* months since January [0-11] */
    int    tm_year;       /* years since 1900 */
    int    tm_wday;       /* days since Sunday [0-6] */
    int    tm_yday;       /* days since January 1 [0-365] */
    int    tm_isdst;      /* Daylight Savings Time flag */
    long   tm_gmtoff;     /* offset from UTC in seconds */
    char   *tm_zone;      /* timezone abbreviation */
};
```

## time

```cpp
time_t time(time_t *);
```

示例

```cpp
#include <iostream>
#include <ctime>

int main()
{
    time_t now_time = time(NULL);

    std::cout << now_time << std::endl;
}
```

输出结果

```shell
1765105686
```
