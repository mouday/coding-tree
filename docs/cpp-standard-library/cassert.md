# cassert

断言功能

cassert 中的 assert 宏的基本语法如下：

```cpp
#include <cassert>

assert(expression);
```

示例

```cpp
#include <cassert>

int main()
{
    assert(1 == 2);

    return 0;
}
```