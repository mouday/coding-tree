# 日志类

目录结构

```shell
 % tree -I build
.
├── CMakeLists.txt
├── include
│   └── log.h
└── src
    └── main.cpp
```

CMakeLists.txt

```shell
# CMakeLists.txt
# cmake -B build && cmake --build build && ./build/app
cmake_minimum_required(VERSION 3.29)
project(app)

set(CMAKE_CXX_STANDARD 11)

include_directories("include")

aux_source_directory(./src SRC_LIST)
add_executable(app ${SRC_LIST})
```

log.h

```cpp
#pragma once
#include <iostream>
#include <thread>
#include <chrono>

class Logger
{
private:
    // 构造函数私有化
    Logger() {}

public:
    // 禁用拷贝构造和赋值操作
    Logger(const Logger &logger) = delete;
    Logger &operator=(const Logger &logger) = delete;

    // 饿汉式
    // static Logger &get_logger()
    // {
    //     static Logger logger;
    //     return logger;
    // }

    // 懒汉式
    static Logger &get_logger()
    {
        static Logger *logger = nullptr;
        static std::once_flag once_flag;

        std::call_once(once_flag, get_onece_logger, &logger);

        return *logger;
    }

    static void get_onece_logger(Logger **logger)
    {
        if (*logger == nullptr)
        {
            std::this_thread::sleep_for(std::chrono::seconds(1));
            std::cout << "new " << std::endl;
            *logger = new Logger;
        }
    }

    void log(std::string msg)
    {
        std::cout << __DATE__
                  << " " << __TIME__
                  << " [LOG] " << msg
                  << std::endl;
    }
};
```

main.cpp

```cpp
#include "log.h"
#include <iostream>
#include <thread>
#include <chrono>
#include <sstream>
#include <memory>

using namespace std;

void print_log()
{
    Logger &logger = Logger::get_logger();
    stringstream ss;
    ss << "[" << this_thread::get_id()
       << "] Logger[" << std::addressof(logger) << "]";

    logger.log(ss.str());
}

int main(int argc, char const *argv[])
{

    thread t1(print_log);
    thread t2(print_log);
    thread t3(print_log);

    // Logger &logger = Logger::get_logger();
    // logger.log("this is a log message");

    t1.join();
    t2.join();
    t3.join();

    return 0;
}
```

输出结果

```shell
$ cmake -B build && cmake --build build && ./build/app

new
Apr  8 2026 08:10:52 [LOG] [0x70000e5cd000] Logger[0x7fc73cc04080]
Apr  8 2026 08:10:52 [LOG] [0x70000e54a000] Logger[0x7fc73cc04080]
Apr  8 2026 08:10:52 [LOG] [0x70000e650000] Logger[0x7fc73cc04080]
```
