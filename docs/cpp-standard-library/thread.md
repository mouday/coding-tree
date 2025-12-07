# thread

C++11 引入了多线程支持

线程是程序执行的最小单元，是操作系统能够进行运算调度的最小单位。

## 线程关键组件

```cpp
// 表示一个线程，可以创建、启动、等待和销毁线程。
std::thread

// 提供了一些静态成员函数，用于操作当前线程。
std::this_thread

// 线程的唯一标识符。
std::thread::id
```

线程控制

```cpp
// 创建线程
std::thread t(task_function)

// 启动线程
// 创建 std::thread 对象后，线程会立即开始执行

// 等待线程完成, 阻塞当前线程，直到被调用的线程完成执行。
join()

// 分离线程
// 将线程置于后台运行，不再等待线程结束。
detach()

// 检查线程是否可被 join 或 detach。
joinable()

// 销毁线程
// 当线程执行完毕后，std::thread 对象超出作用域自动销毁。
```

主要组件

- std::thread
- std::mutex
- std::lock_guard
- std::unique_lock
- std::condition_variable
- std::future 和 std::promise
- std::async

## std::thread

std::thread 类用于创建和管理线程。

重要方法

- join(): 等待线程结束。
- detach(): 将线程置于后台运行，不再等待线程结束。
- joinable(): 检查线程是否可被 join 或 detach。

示例

```cpp
#include <iostream>
#include <thread>

void task()
{
    std::cout << "task thread: " << std::this_thread::get_id() << std::endl;
}

int main()
{
    std::thread t(task);
    t.join(); // 等待线程 t 结束

    std::cout << "main thread: " << std::this_thread::get_id()  << std::endl;
}
```

输出结果

```shell
task thread: 0x70000bb8c000
main thread: 0x7ff84f411fc0
```

## std::mutex

示例1: 不加锁

```cpp
#include <iostream>
#include <thread>

int value = 0;

void task()
{
    value++;
}

int main()
{
    std::thread t1(task);
    std::thread t2(task);

    // 等待线程结束
    t1.join();
    t2.join();

    std::cout << "value: " << value << std::endl;
}
```

输出结果

```shell
# 可能是：1
value: 1

# 也可能是：2
value: 2
```

示例2: 加锁

```cpp
#include <iostream>
#include <thread>

// 创建一个全局 mutex 对象
std::mutex mutex_lock;

// 共享资源
int value = 0;

// 线程函数
void task()
{
    // 上锁，保证线程安全
    std::lock_guard<std::mutex> lock(mutex_lock);
    value++;
    // lock 在 lock_guard 离开作用域时自动释放
}

int main()
{
    std::thread t1(task);
    std::thread t2(task);

    // 等待线程结束
    t1.join();
    t2.join();

    std::cout << "value: " << value << std::endl;
}
```

输出结果

```shell
value: 2
```

## std::lock_guard

std::lock_guard 是一个 RAII 风格的锁管理器，用于自动管理锁的生命周期。

示例

```cpp
#include <iostream>
#include <thread>

// 创建一个全局 mutex 对象
std::mutex mutex_lock;

// 共享资源
int value = 0;

// 线程函数
void task()
{
    // 上锁，保证线程安全
    std::lock_guard<std::mutex> lock(mutex_lock);
    value++;
    // lock 在 lock_guard 离开作用域时自动释放
}

int main()
{
    std::thread t1(task);
    std::thread t2(task);

    // 等待线程结束
    t1.join();
    t2.join();

    std::cout << "value: " << value << std::endl;
}
```

输出结果

```shell
value: 2
```

## std::unique_lock

std::unique_lock 提供了比 std::lock_guard 更灵活的锁管理。

示例

```cpp
#include <iostream>
#include <thread>

// 创建一个全局 mutex 对象
std::mutex mutex_lock;

// 共享资源
int value = 0;

// 线程函数
void task()
{
    // 上锁，保证线程安全
    std::unique_lock<std::mutex> lock(mutex_lock);
    value++;
    lock.unlock(); // 可以手动解锁
    // lock 在 unique_lock 离开作用域时自动释放
}

int main()
{
    std::thread t1(task);
    std::thread t2(task);

    // 等待线程结束
    t1.join();
    t2.join();

    std::cout << "value: " << value << std::endl;
}
```

输出结果

```shell
value: 2
```

## std::condition_variable

std::condition_variable 用于线程间的等待和通知。

示例

```cpp
#include <iostream>
#include <thread>

// 创建一个全局 mutex 对象
std::mutex mutex_lock;
std::condition_variable condition;
// 全局变量
bool is_ready = false;

// 线程函数
void comsumer()
{
    std::cout << "comsumer start" << std::endl;
    // 上锁，保证线程安全
    std::unique_lock<std::mutex> lock(mutex_lock);
    std::cout << "comsumer lock" << std::endl;
    condition.wait(lock, []
                   { return is_ready; });
    std::cout << "comsumer end" << std::endl;
}

void producer()
{
    std::cout << "producer start" << std::endl;
    std::unique_lock<std::mutex> lock(mutex_lock);
    std::cout << "producer lock" << std::endl;
    // sleep 1s 模拟耗时
    std::this_thread::sleep_for(std::chrono::seconds(1));
    is_ready = true;
    condition.notify_all();
    std::cout << "producer end" << std::endl;
}

int main()
{
    std::thread t_comsumer(comsumer);
    std::thread t_producer(producer);

    // 等待线程结束
    t_comsumer.join();
    t_producer.join();
}
```

输出结果

```shell
comsumer start
comsumer lock
producer start
producer lock
producer end
comsumer end
```

## std::future 和 std::promise

std::future 和 std::promise 用于线程间的结果传递。

示例

```cpp
#include <iostream>
#include <thread>
#include <future>

void add(std::promise<int> &&p, int x, int y)
{
    int ret = x + y;
    p.set_value(ret);
}

int main()
{
    std::promise<int> p;
    std::future<int> f = p.get_future();

    std::thread t(add, std::move(p), 1, 1);
    t.join();

    int ret = f.get();
    std::cout << ret << std::endl;
}
```

输出结果

```shell
2
```

## std::async

std::async 用于启动异步任务，并返回一个 std::future。

示例

```cpp
#include <iostream>
#include <thread>
#include <future>

int add(int x, int y)
{
    return x + y;
}

int main()
{
    std::future<int> f = std::async(add, 1, 1);

    int ret = f.get();
    std::cout << ret << std::endl;
}
```

输出结果

```shell
2
```
