# Logger日志

头文件

```cpp
// log.h
#ifndef __LOG_H__
#define __LOG_H__

#include <stdio.h>

// 日志级别
typedef enum
{
    LOG_DEBUG, // 调试
    LOG_INFO,  // 信息
    LOG_WARN,  // 警告
    LOG_ERROR  // 错误
} LogLevel;

// 日志输出目标
typedef enum
{
    LOG_TO_CONSOLE, // 控制台
    LOG_TO_FILE,    // 文件
    LOG_TO_BOTH     // 两者都输出
} LogTarget;

// 日志结构体
typedef struct
{
    FILE *log_file;      // 日志文件指针
    char file_path[256]; // 日志文件路径
    LogTarget target;    // 输出目标
    LogLevel min_level;  // 最小日志级别（低于此级别的不输出）
} Logger;

Logger *logger_init(const char *file_path, LogTarget target, LogLevel min_level);

void logger_destroy(Logger *logger);

void logger_log(Logger *logger, LogLevel level, const char *format, ...);
#endif
```

实现

```cpp
// log.c
#include <stdarg.h>
#include <stdio.h>
#include <stdlib.h>
#include <time.h>
#include <string.h>
#include "log.h"

// 初始化日志器
Logger *logger_init(const char *file_path, LogTarget target, LogLevel min_level)
{
    Logger *logger = (Logger *)malloc(sizeof(Logger));
    if (logger == NULL)
    {
        perror("Failed to allocate logger");
        return NULL;
    }

    // 初始化成员
    logger->target = target;
    logger->min_level = min_level;
    strncpy(logger->file_path, file_path, 255);
    logger->file_path[255] = '\0'; // 确保字符串结束

    // 如果需要输出到文件，打开文件（追加模式）
    if (target == LOG_TO_FILE || target == LOG_TO_BOTH)
    {
        logger->log_file = fopen(file_path, "a");
        if (logger->log_file == NULL)
        {
            perror("Failed to open log file");
            free(logger);
            return NULL;
        }
    }
    else
    {
        logger->log_file = NULL;
    }

    return logger;
}

// 销毁日志器
void logger_destroy(Logger *logger)
{
    if (logger == NULL)
        return;

    // 关闭文件
    if (logger->log_file != NULL)
    {
        fclose(logger->log_file);
    }

    free(logger);
    logger = NULL; // 避免悬空指针
}

// 转换日志级别为字符串
static const char *level_to_string(LogLevel level)
{
    switch (level)
    {
    case LOG_DEBUG:
        return "DEBUG";
    case LOG_INFO:
        return "INFO";
    case LOG_WARN:
        return "WARN";
    case LOG_ERROR:
        return "ERROR";
    default:
        return "UNKNOWN";
    }
}

// 获取当前时间（格式：YYYY-MM-DD HH:MM:SS）
static void get_current_time(char *time_str, size_t max_len)
{
    time_t now = time(NULL);
    struct tm tm_info;
    localtime_r(&now, &tm_info);
    strftime(time_str, max_len, "%Y-%m-%d %H:%M:%S", &tm_info);
}

// 打印日志
void logger_log(Logger *logger, LogLevel level, const char *format, ...)
{
    // 检查日志器有效性和级别过滤
    if (logger == NULL || level < logger->min_level)
    {
        return;
    }

    // 获取时间和级别字符串
    char time_str[32];
    get_current_time(time_str, sizeof(time_str));
    const char *level_str = level_to_string(level);

    // 构建日志前缀（时间 + 级别）
    char log_prefix[128];
    snprintf(log_prefix, sizeof(log_prefix),
             "[%s] [%s] ", time_str, level_str);

    // 处理可变参数（格式化日志内容）
    va_list console_args, file_args;
    va_start(console_args, format);
    va_copy(file_args, console_args); // 复制参数以供多次使用

    // 根据目标输出日志
    if (logger->target == LOG_TO_CONSOLE || logger->target == LOG_TO_BOTH)
    {
        // 输出到控制台
        printf("%s", log_prefix);
        vprintf(format, console_args); // 处理可变参数
        printf("\n");
    }
    va_end(console_args);

    if (logger->target == LOG_TO_FILE || logger->target == LOG_TO_BOTH)
    {
        // 输出到文件（需检查文件是否打开）
        if (logger->log_file != NULL)
        {
            fprintf(logger->log_file, "%s", log_prefix);
            vfprintf(logger->log_file, format, file_args); // 写入文件
            fprintf(logger->log_file, "\n");
            fflush(logger->log_file); // 立即刷新到文件
        }
    }
    va_end(file_args);
}
```

使用示例

```cpp
// main.c
#include "log.h"

int main()
{
    // 初始化日志器：输出到文件和控制台，最小级别为INFO
    Logger *logger = logger_init("./app.log", LOG_TO_BOTH, LOG_DEBUG);
    if (logger == NULL)
    {
        return 1;
    }

    // 打印不同级别的日志
    logger_log(logger, LOG_DEBUG, "debug log");
    logger_log(logger, LOG_INFO, "Program started. Version: %s", "1.0.0");
    logger_log(logger, LOG_WARN, "Apple: %d remaining", 100);
    logger_log(logger, LOG_ERROR, "Failed to connect to database: %s", "timeout");

    // 销毁日志器
    logger_destroy(logger);

    return 0;
}

```

运行结果

```shell
% gcc main.c log.c -o main && ./main
[2025-08-28 08:18:45] [DEBUG] debug log
[2025-08-28 08:18:45] [INFO] Program started. Version: 1.0.0
[2025-08-28 08:18:45] [WARN] Apple: 100 remaining
[2025-08-28 08:18:45] [ERROR] Failed to connect to database: timeout

% cat app.log
[2025-08-28 08:19:19] [DEBUG] debug log
[2025-08-28 08:19:19] [INFO] Program started. Version: 1.0.0
[2025-08-28 08:19:19] [WARN] Apple: 100 remaining
[2025-08-28 08:19:19] [ERROR] Failed to connect to database: timeout
```

参考文章

用 C 语言实现日志打印结构体：从设计到实战

https://mp.weixin.qq.com/s/-MGqipP1ijdfKgULy2W5KQ