# X-Macro

X-Macro 核心思想：数据定义和使用分离

代码示例

```cpp
#include <stdio.h>

// 1、定义所有数据
#define ERROR_TABLE(X)          \
    X(ERROR_NONE, "No Error")   \
    X(ERROR_TIMEOUT, "Timeout") \
    X(ERROR_OVERFLOW, "Overflow")

// 2、生成枚举
#define MAKE_ENUM(id, desc) id,
enum error_code
{
    ERROR_TABLE(MAKE_ENUM)
};

// 3、生成字符串表
#define MAKE_STRING(id, desc) desc,
const char *error_strings[] = {
    ERROR_TABLE(MAKE_STRING)};

// 4、生成打印函数
#define MAKE_CASE(id, desc) \
    case id:                \
        return desc;

const char *error_to_string(enum error_code code)
{
    switch (code)
    {
        ERROR_TABLE(MAKE_CASE)
    default:
        break;
    }
};

// 使用枚举
int main(int argc, char const *argv[])
{
    enum error_code code = ERROR_TIMEOUT;
    printf("code: %d\n", code);

    const char *code_string = error_to_string(code);
    printf("code_string: %s\n", code_string);

    const char *error_string = error_strings[code];
    printf("error_string: %s\n", error_string);
    return 0;
}
```

执行结果

```shell
$ gcc enum_demo.c  && ./a.out
code: 1
code_string: Timeout
error_string: Timeout
```

生成代码

```shell
gcc enum_demo.c -E -o enum_demo.i
```

输出结果

```cpp
enum error_code
{
    ERROR_NONE, ERROR_TIMEOUT, ERROR_OVERFLOW,
};

const char *error_strings[] = {
    "No Error", "Timeout", "Overflow",
};

const char *error_to_string(enum error_code code)
{
    switch (code)
    {
        case ERROR_NONE: return "No Error";
        case ERROR_TIMEOUT: return "Timeout";
        case ERROR_OVERFLOW: return "Overflow";
        default:
            break;
    }
};
```
