# mutex

C++11 引入

互斥锁（mutex）一种同步机制，用于防止多个线程同时访问共享资源。

互斥锁（Mutex）是一个用于控制对共享资源访问的同步原语。当一个线程需要访问共享资源时，它会尝试锁定互斥锁。如果互斥锁已经被其他线程锁定，请求线程将被阻塞，直到互斥锁被释放。

锁类型：

- std::mutex：基本的互斥锁。
- std::recursive_mutex：递归互斥锁，允许同一个线程多次锁定。
- std::timed_mutex：具有超时功能的互斥锁。
- std::recursive_timed_mutex：具有超时功能的递归互斥锁。

## std::mutex

使用 std::mutex 来同步对共享资源的访问

提供基本的互斥量，确保在同一时刻只有一个线程可以访问共享资源。

示例2：线程不加锁

```cpp
#include <iostream>
#include <thread>
#include <mutex>

int value = 0; // 全局变量

void task()
{
    for (size_t i = 0; i < 10000; i++)
    {
        value++;
    }
}

int main()
{
    std::thread t1(task);
    std::thread t2(task);

    // 等待线程执行完毕
    t1.join();
    t2.join();

    std::cout << value << std::endl;
}
```

输出结果

```shell
# 预期是20000,实际输出并不是
18678
```

示例2：线程加锁

```cpp
#include <iostream>
#include <thread>
#include <mutex>

std::mutex mtx; // 全局互斥锁
int value = 0;  // 全局变量

void task()
{
    for (size_t i = 0; i < 10000; i++)
    {
        mtx.lock(); // 锁定互斥锁
        value++;
        mtx.unlock(); // 解锁互斥锁
    }
}

int main()
{
    std::thread t1(task);
    std::thread t2(task);

    // 等待线程执行完毕
    t1.join();
    t2.join();

    std::cout << value << std::endl;
}
```

输出结果

```shell
2
```

## std::recursive_mutex

递归互斥锁允许同一个线程多次锁定同一个互斥锁

允许同一线程多次获得锁，而不会造成死锁，这对递归函数特别有用。

此处如果使用 `std::mutex`，第一次获取锁之后，第二次进入递归函数将会被锁死

示例

```cpp
#include <iostream>
#include <thread>
#include <mutex>

std::recursive_mutex mtx; // 创建一个递归 mutex 对象
int value = 0;            // 全局变量

void recursive_add(int n)
{
    if (n <= 0)
    {
        return;
    }

    // 上锁，确保线程安全
    std::lock_guard<std::recursive_mutex> lock(mtx);
    value++;
    std::cout << std::this_thread::get_id() << "=> " << value << std::endl;

    // 递归调用
    recursive_add(n - 1);
}

int main()
{
    std::thread t1(recursive_add, 10);
    std::thread t2(recursive_add, 10);

    // 等待线程执行完毕
    t1.join();
    t2.join();

    std::cout << value << std::endl;
}
```

输出结果

```shell
0x700008f60000=> 1
0x700008f60000=> 2
0x700008f60000=> 3
0x700008f60000=> 4
0x700008f60000=> 5
0x700008f60000=> 6
0x700008f60000=> 7
0x700008f60000=> 8
0x700008f60000=> 9
0x700008f60000=> 10
0x700008fe3000=> 11
0x700008fe3000=> 12
0x700008fe3000=> 13
0x700008fe3000=> 14
0x700008fe3000=> 15
0x700008fe3000=> 16
0x700008fe3000=> 17
0x700008fe3000=> 18
0x700008fe3000=> 19
0x700008fe3000=> 20
20
```

## std::timed_mutex

提供定时的互斥量，可以在尝试获得锁时设置超时时间。

示例

```cpp
#include <iostream>
#include <thread>
#include <mutex>

std::timed_mutex mtx; // 创建一个递归 mutex 对象
int value = 0;        // 全局变量

void add()
{
    // 上锁，确保线程安全
    if (mtx.try_lock_for(std::chrono::seconds(1)))
    {
        std::cout << std::this_thread::get_id() << " lock success" << std::endl;
        // sleep 2s
        std::this_thread::sleep_for(std::chrono::seconds(2));
        value++;
        mtx.unlock();
    }
    else
    {
        std::cout << std::this_thread::get_id() << " lock timeout" << std::endl;
        add();
    }
}

int main()
{
    std::thread t1(add);
    std::thread t2(add);

    // 等待线程执行完毕
    t1.join();
    t2.join();

    std::cout << value << std::endl;
}
```

输出结果

```shell
0x700004274000 lock success
0x7000042f7000 lock timeout
0x7000042f7000 lock success
2
```

## std::recursive_timed_mutex

继承自 std::timed_mutex，允许同一线程多次获得锁，同时支持定时功能。

示例

```cpp
#include <iostream>
#include <thread>
#include <mutex>

std::recursive_timed_mutex mtx; // 创建一个递归 mutex 对象
int value = 0;                  // 全局变量

void recursive_add(int n)
{
    if (n <= 0)
    {
        return;
    }

    // 上锁，确保线程安全
    if (mtx.try_lock_for(std::chrono::seconds(1)))
    {
        std::cout << std::this_thread::get_id() << " lock success: " << value << std::endl;

        // sleep 1
        std::this_thread::sleep_for(std::chrono::seconds(2));
        value++;
        // 递归调用
        recursive_add(n - 1);
        mtx.unlock();
    }
    else
    {
        std::cout << std::this_thread::get_id() << " lock timeout" << std::endl;
        recursive_add(n);
    }
}

int main()
{
    std::thread t1(recursive_add, 3);
    std::thread t2(recursive_add, 3);

    // 等待线程执行完毕
    t1.join();
    t2.join();

    std::cout << value << std::endl;
}
```

输出结果

```shell
0x70000a7df000 lock success: 0
0x70000a862000 lock timeout
0x70000a7df000 lock success: 1
0x70000a862000 lock timeout
0x70000a862000 lock timeout
0x70000a7df000 lock success: 2
0x70000a862000 lock timeout
0x70000a862000 lock timeout
0x70000a862000 lock success: 3
0x70000a862000 lock success: 4
0x70000a862000 lock success: 5
6
```

## std::lock_guard

一种自动管理 std::mutex 锁的封装器，使用 RAII 风格，确保在作用域结束时自动释放锁。

实现原理

```cpp
template <class _Mutex>
class lock_guard
{
public:
    typedef _Mutex mutex_type;

private:
    mutex_type &__m_;

public:
    explicit lock_guard(mutex_type &__m) : __m_(__m)
    {
        __m_.lock();
    }

    ~lock_guard()
    {
        __m_.unlock();
    }

private:
    lock_guard(lock_guard const &) = delete;
    lock_guard &operator=(lock_guard const &) = delete;
};
```

示例

```cpp
#include <iostream>
#include <thread>
#include <mutex>

std::mutex mtx; // 全局互斥锁
int value = 0;  // 全局变量

void task()
{
    for (size_t i = 0; i < 10000; i++)
    {
        // mtx.lock(); // 锁定互斥锁
        std::lock_guard<std::mutex> lock(mtx);
        value++;
        // mtx.unlock(); // 解锁互斥锁
    }
}

int main()
{
    std::thread t1(task);
    std::thread t2(task);

    // 等待线程执行完毕
    t1.join();
    t2.join();

    std::cout << value << std::endl;
}
```

输出结果

```shell
20000
```

## std::unique_lock

提供比 std::lock_guard 更灵活的锁管理，可以手动释放和重新获得锁，还支持定时锁定。

```cpp
std::mutex mtx;

std::unique_lock<std::mutex> lock(mtx);
// 访问共享资源

// 可以手动释放锁
lock.unlock();

// 可以重新获得锁
lock.lock();

// 可以进行定时锁定
if (lock.try_lock_for(std::chrono::seconds(1))) {
    // 成功获得锁
}
```

示例

```cpp
#include <iostream>
#include <thread>
#include <mutex>

std::mutex mtx; // 全局互斥锁
int value = 0;  // 全局变量

void task()
{
    for (size_t i = 0; i < 10000; i++)
    {
        std::unique_lock<std::mutex> lock(mtx);
        value++;
        lock.unlock(); // 可以手动解锁
    }
}

int main()
{
    std::thread t1(task);
    std::thread t2(task);

    // 等待线程执行完毕
    t1.join();
    t2.join();

    std::cout << value << std::endl;
}
```

输出结果

```shell
20000
```

## std::adopt_lock_t

标志类型，用于指定 std::unique_lock 采用已有的锁。

示例

```cpp
std::mutex mtx;
std::unique_lock<std::mutex> lock(mtx, std::adopt_lock);
```

## std::defer_lock_t

功能：标志类型，用于延迟锁定，初始化时不锁定。

实例

```cpp
std::mutex mtx;
std::unique_lock<std::mutex> lock(mtx, std::defer_lock);
// 可以在之后的某个时刻调用 lock.lock()
```

## std::try_to_lock_t

标志类型，用于尝试锁定而不阻塞。

实例

```cpp
std::mutex mtx1, mtx2;
std::unique_lock<std::mutex> lock1(mtx1, std::try_to_lock);
std::unique_lock<std::mutex> lock2(mtx2, std::try_to_lock);

if (lock1 && lock2) {
    // 成功获得两个锁
}
```
