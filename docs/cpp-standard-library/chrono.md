# chrono

C++11 引入

用于处理时间和日期的库

## 基本概念

时间点（Time Points）:时间点表示一个特定的时间点，通常与某个特定的时钟相关联。

持续时间（Durations）:持续时间表示两个时间点之间的时间间隔。

时钟（Clocks）:时钟是时间点和持续时间的来源。C++ 提供了几种不同的时钟，例如系统时钟、高分辨率时钟等。

头文件：

```cpp
#include <chrono>
```

时钟

```cpp
// 系统时钟，通常与系统时间同步。
std::chrono::system_clock

// 单调时钟，不会受到系统时间变化的影响。
std::chrono::steady_clock

// 提供最高分辨率的时钟。
std::chrono::high_resolution_clock
```

示例

```cpp
#include <iostream>
#include <chrono>
#include <iomanip>
#include <ctime>

int main()
{
    std::chrono::time_point now_time_point = std::chrono::system_clock::now();
    std::time_t now_time = std::chrono::system_clock::to_time_t(now_time_point);

    std::cout << std::ctime(&now_time) << std::endl;

    // 格式化
    std::cout << std::put_time(std::localtime(&now_time), "%Y-%m-%d %H:%M:%S") << std::endl;
}
```

输出结果

```shell
Sun Dec  7 19:30:07 2025

2025-12-07 19:30:07
```
