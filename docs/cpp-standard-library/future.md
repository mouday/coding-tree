# future

C++11 引入

提供了一种异步编程的机制，允许程序在等待某个操作完成时继续执行其他任务。

关键的类型：

- std::future：表示异步操作的结果，可以查询操作的状态，获取结果或等待操作完成。
- std::promise：用于与 std::future 配对，用于设置异步操作的结果。
- std::packaged_task：封装一个函数或可调用对象，使其可以作为异步任务执行。

## std::promise

std::promise 用于设置异步操作的结果。它与 std::future 配对使用。

```cpp
#include <iostream>
#include <thread>
#include <future>

// 在另一个线程中设置结果
void task(std::promise<int> &&promise)
{
    promise.set_value(2);
}

int main(int argc, char const *argv[])
{
    std::promise<int> promise;
    std::future<int> future = promise.get_future();

    std::thread thread(task, std::move(promise));

    // 等待结果
    thread.join();
    std::cout << future.get() << std::endl;

    return 0;
}
```

输出结果

```shell
2
```

## std::packaged_task

std::packaged_task 封装一个函数或可调用对象，使其可以作为异步任务执行。

```cpp
#include <iostream>
#include <thread>
#include <future>

int add(int x, int y)
{
    return x + y;
}

int main(int argc, char const *argv[])
{
    std::packaged_task<int(int, int)> task(add);
    std::future<int> future = task.get_future();

    std::thread thread(std::move(task), 1, 1);

    std::cout << future.get() << std::endl;
    thread.join();

    return 0;
}
```

```shell
2
```

## std::async

std::async 是一个方便的函数，用于启动异步任务。它可以立即返回一个 std::future 对象。

```cpp
#include <iostream>
#include <thread>
#include <future>

int main(int argc, char const *argv[])
{

    std::future<int> future = std::async(
        std::launch::async,
        [](int a, int b) -> int
        { return a + b; },
        1, 1);

    std::cout << future.get() << std::endl;

    return 0;
}
```

输出结果

```shell
2
```

## 异常处理

当异步操作抛出异常时，std::future 会捕获这个异常，并且可以通过调用 .get() 方法来重新抛出它。


```cpp
#include <iostream>
#include <future>

void throw_exception()
{
    throw std::runtime_error("Exception thrown");
}

int main()
{
    std::future<void> fut = std::async(throw_exception);

    try
    {
        fut.get();
    }
    catch (const std::exception &e)
    {
        std::cout << "Caught exception: " << e.what() << std::endl;
    }
    return 0;
}
```

输出结果

```shell
Caught exception: Exception thrown
```