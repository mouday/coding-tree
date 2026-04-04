# 多线编程

## 基本用法

```cpp
std::thread t(func);
```

示例

```cpp
// demo.cpp

#include <iostream>
#include <thread>
#include <chrono>

void func()
{
    std::cout << "func start: " << std::this_thread::get_id() << std::endl;
    // 模拟耗时3s
    std::this_thread::sleep_for(std::chrono::seconds(3));
    std::cout << "func end: " << std::this_thread::get_id() << std::endl;
}

int main(int argc, char const *argv[])
{
    std::cout << "main start: " << std::this_thread::get_id() << std::endl;

    std::thread t(func);

    // 等待子线程运行完成
    t.join();

    std::cout << "main start: " << std::this_thread::get_id() << std::endl;
    return 0;
}
```

运行结果

```shell
$ g++ demo.cpp && ./a.out

main start: 0x7ff84f9a2fc0
func start: 0x70000a7ea000
func end: 0x70000a7ea000
main start: 0x7ff84f9a2fc0
```

## 使用 detach 使得子线程与主线程分离

```cpp
std::thread t(func);

t.detach();
```

示例

```cpp
#include <iostream>
#include <thread>
#include <chrono>

void func()
{
    std::cout << "func start: " << std::this_thread::get_id() << std::endl;
    std::this_thread::sleep_for(std::chrono::seconds(10));
    std::cout << "func end: " << std::this_thread::get_id() << std::endl;
}

int main(int argc, char const *argv[])
{
    std::cout << "main start: " << std::this_thread::get_id() << std::endl;

    std::thread t(func);
    std::cout << "thread id: " << t.get_id() << std::endl;
    t.detach();

    std::cout << "main start: " << std::this_thread::get_id() << std::endl;
    return 0;
}
```

运行结果

```shell
g++ demo.cpp && ./a.out

main start: 0x7ff84f9a2fc0
thread id: 0x700003c8e000
main start: 0x7ff84f9a2fc0
```

## 创建线程传递参数

```cpp
std::thread(func, param);
```

示例

```cpp
#include <iostream>
#include <thread>
#include <chrono>

class Param
{
public:
    Param()
    {
        std::cout << "Param create" << std::endl;
    }
    Param(const Param &param)
    {
        std::cout << "Param copy create" << std::endl;
    }
    ~Param()
    {
        std::cout << "Param drop" << std::endl;
    }
};

void func(Param param)
{
    std::cout << "func start: " << std::this_thread::get_id() << std::endl;
    std::this_thread::sleep_for(std::chrono::seconds(3));
    std::cout << "func end: " << std::this_thread::get_id() << std::endl;
}

int main(int argc, char const *argv[])
{
    std::cout << "main start: " << std::this_thread::get_id() << std::endl;
    Param param;
    std::thread t;
    t = std::thread(func, param);
    t.join();

    std::cout << "main start: " << std::this_thread::get_id() << std::endl;
    return 0;
}

```

运行结果

```shell
$ g++ demo.cpp -std=c++11 -g && ./a.out

main start: 0x7ff84f9a2fc0
Param create
Param copy create
Param copy create
func start: 0x7000009c8000
func end: 0x7000009c8000
Param drop
Param drop
main start: 0x7ff84f9a2fc0
Param drop
```

可以看到，参数 Param 被创建后，拷贝了 2 次，分别是：

1. 创建线程时拷贝一次
2. 线程执行时拷贝一次

## 传递指针参数

```cpp
std::thread(func, &param);
```

示例

```cpp
#include <iostream>
#include <thread>
#include <chrono>

class Param
{
public:
    std::string name;

    Param(std::string name)
    {
        this->name = name;
        std::cout << "Param create" << std::endl;
    }
    Param(const Param &param)
    {
        std::cout << "Param copy create" << std::endl;
    }
    ~Param()
    {
        std::cout << "Param drop" << std::endl;
    }
};

void func(Param *param)
{
    std::cout << "func start: " << std::this_thread::get_id() << std::endl;
    std::this_thread::sleep_for(std::chrono::seconds(3));
    std::cout << "name: " << param->name << std::endl;
    std::cout << "func end: " << std::this_thread::get_id() << std::endl;
}

int main(int argc, char const *argv[])
{
    std::cout << "main start: " << std::this_thread::get_id() << std::endl;

    Param param("Tom");
    std::thread t;
    t = std::thread(func, &param);
    t.join();

    std::cout << "main end: " << std::this_thread::get_id() << std::endl;
    return 0;
}
```

运行结果

```shell
$ g++ demo.cpp -std=c++11 -g && ./a.out
main start: 0x7ff84f9a2fc0
Param create
func start: 0x70000e684000
name: Tom
func end: 0x70000e684000
main end: 0x7ff84f9a2fc0
Param drop
```

## 传递引用参数

```cpp
std::thread(func, std::ref(param));
```

示例

```cpp

#include <iostream>
#include <thread>
#include <chrono>

class Param
{
public:
    std::string name;

    Param(std::string name)
    {
        this->name = name;
        std::cout << "Param create" << std::endl;
    }
    Param(const Param &param)
    {
        std::cout << "Param copy create" << std::endl;
    }
    ~Param()
    {
        std::cout << "Param drop" << std::endl;
    }
};

void func(Param &param)
{
    std::cout << "func start: " << std::this_thread::get_id() << std::endl;
    std::this_thread::sleep_for(std::chrono::seconds(3));
    std::cout << "name: " << param.name << std::endl;
    std::cout << "func end: " << std::this_thread::get_id() << std::endl;
}

int main(int argc, char const *argv[])
{
    std::cout << "main start: " << std::this_thread::get_id() << std::endl;

    Param param("Tom");
    std::thread t;
    t = std::thread(func, std::ref(param));
    t.join();

    std::cout << "main end: " << std::this_thread::get_id() << std::endl;
    return 0;
}
```

运行结果

```shell
$ g++ demo.cpp -std=c++11 -g && ./a.out
main start: 0x7ff84f9a2fc0
Param create
func start: 0x70000d176000
name: Tom
func end: 0x70000d176000
main end: 0x7ff84f9a2fc0
Param drop
```

## 成员函数作为线程入口

```cpp
std::thread t(&Param::showName, &param);
```

示例

```cpp

#include <iostream>
#include <thread>
#include <chrono>

class Param
{
public:
    std::string name;

    Param(std::string name)
    {
        this->name = name;
        std::cout << "Param create" << std::endl;
    }
    Param(const Param &param)
    {
        std::cout << "Param copy create" << std::endl;
    }
    ~Param()
    {
        std::cout << "Param drop" << std::endl;
    }

    void showName()
    {
        std::cout << "name: " << name << std::endl;
    }
};

int main(int argc, char const *argv[])
{
    std::cout << "main start: " << std::this_thread::get_id() << std::endl;

    Param param("Tom");
    std::thread t(&Param::showName, &param);
    t.join();

    std::cout << "main end: " << std::this_thread::get_id() << std::endl;
    return 0;
}

```

运行结果

```shell
$ g++ demo.cpp -std=c++11 -g && ./a.out
main start: 0x7ff84f9a2fc0
Param create
name: Tom
main end: 0x7ff84f9a2fc0
Param drop
```

## 自定义线程类 XThread

```cpp

#include <iostream>
#include <thread>
#include <chrono>

class XThread
{
private:
    std::thread m_thread;
    virtual void main() = 0;

public:
    virtual void start()
    {
        m_thread = std::thread(&XThread::main, this);
    }

    virtual void wait()
    {
        if (m_thread.joinable())
        {
            m_thread.join();
        }
    }
};

class ParamThread : public XThread
{
public:
    std::string name;

    void main() override
    {
        std::cout << "thread main start: " << std::this_thread::get_id() << std::endl;
        std::this_thread::sleep_for(std::chrono::seconds(3));
        std::cout << "name: " << this->name << std::endl;
        std::cout << "thread main start: " << std::this_thread::get_id() << std::endl;
    }
};

int main(int argc, char const *argv[])
{
    std::cout << "main start: " << std::this_thread::get_id() << std::endl;

    ParamThread t;
    t.name = "Tom";
    t.start();
    t.wait();

    std::cout << "main end: " << std::this_thread::get_id() << std::endl;
    return 0;
}

```

运行结果

```shell
$ g++ demo.cpp -std=c++11 -g && ./a.out
main start: 0x7ff84f9a2fc0
thread main start: 0x70000fe6b000
name: Tom
thread main start: 0x70000fe6b000
main end: 0x7ff84f9a2fc0
```

## Lambda 函数作为线程入口

lambda 函数格式

```cpp
[捕获列表](参数)mutable->返回值类型{函数体}
```

lambda 示例

```cpp
#include <iostream>
#include <thread>

int main(int argc, char const *argv[])
{

    std::thread t([](int i)
                  { std::cout << "i=" << i << std::endl; }, 123);
    t.join();

    return 0;
}

```

输出结果

```shell
$ g++ demo.cpp -std=c++11 -g && ./a.out
i=123
```

成员函数中使用 lambda

```cpp

#include <iostream>
#include <thread>

class Foo
{
private:
    std::string name = "Tom";

public:
    void start()
    {
        // lambda函数中访问成员变量
        std::thread t([this]()
                      { std::cout << "name: " << name << std::endl; });
        t.join();
    }
};

int main(int argc, char const *argv[])
{
    Foo foo;
    foo.start();

    return 0;
}

```

输出结果

```shell
% g++ demo.cpp -std=c++11 -g && ./a.out
name: Tom
```

## 多线程通信和同步

线程状态：

- 初始化 init 该线程正在被创建
- 就绪 ready 该线程在就绪列表中，等到 CPU 调度
- 运行 running 该线程正在被运行
- 阻塞 blocked 该线程被阻塞挂起
- 退出 exit 该线程运行结束，等待浮现出回收其控制块资源

blocked 状态包括：

- pend 锁、事件、信号量等阻塞
- suspend 主动 pend
- delay 延时阻塞
- pendtime 锁、事件、信号量时间等超时等待

```shell
     初始化
      |
      V
     就绪
    ^   ^
   /     \
  V       V
运行  ->  阻塞
 |
 V
退出
```

## 竞争状态和临界区

竞争状态 race condition: 多线程同时读写共享数据

临界区 critical section: 读写共享数据的代码片段

避免竞争状态策略，对临界区进行保护，同时只能有一个线程进入临界区

常用的锁

| 锁类型                | 说明         |
| --------------------- | ------------ |
| mutex                 | 互斥锁       |
| timed_mutex           | 超时锁       |
| recursive_mutex       | 可重入锁     |
| recursive_timed_mutex | 可重入超时锁 |

## 互斥锁 mutex

示例

```cpp

#include <iostream>
#include <thread>

void task()
{
    std::cout << "=== start ===" << std::endl;
    std::cout << "=== " << std::this_thread::get_id() << " ===" << std::endl;
    std::cout << "=== end ===" << std::endl;
}

int main(int argc, char const *argv[])
{
    size_t nums = 3;
    std::thread threads[nums];
    for (size_t i = 0; i < nums; i++)
    {

        threads[i] = std::thread(task);
    }

    for (size_t i = 0; i < nums; i++)
    {
        threads[i].join();
    }

    return 0;
}
```

输出结果

```shell
$ g++ demo.cpp -std=c++11 -g && ./a.out

=== start ===
=== === start ===0x700007230000 ===

=== === end ===
=== start ===
=== 0x7000072b3000 ===0x700007336000 ===
=== end ===
=== end ===
```

加锁

```cpp
#include <mutex>

// 声明锁
std::mutex lock;

// 加锁
lock.lock();

// 解锁
lock.unlock();
```

加锁示例

```cpp
#include <iostream>
#include <thread>
#include <mutex>

static std::mutex lock;

void task()
{
    lock.lock();
    std::cout << "=== start ===" << std::endl;
    std::cout << "=== " << std::this_thread::get_id() << " ===" << std::endl;
    std::cout << "=== end ===" << std::endl;
    lock.unlock();
}

int main(int argc, char const *argv[])
{
    size_t nums = 3;
    std::thread threads[nums];
    for (size_t i = 0; i < nums; i++)
    {

        threads[i] = std::thread(task);
    }

    for (size_t i = 0; i < nums; i++)
    {
        threads[i].join();
    }

    return 0;
}
```

输出结果

```shell
$ g++ demo.cpp -std=c++11 -g && ./a.out

=== start ===
=== 0x70000536d000 ===
=== end ===
=== start ===
=== 0x700005473000 ===
=== end ===
=== start ===
=== 0x7000053f0000 ===
=== end ===
```

问题：线程抢占不到资源

```cpp
#include <iostream>
#include <thread>
#include <chrono>
#include <mutex>

static std::mutex lock;

void task(int index)
{
    for (;;)
    {
        lock.lock();
        std::cout << "=== " << index << " ===" << std::endl;
        std::this_thread::sleep_for(std::chrono::seconds(1));
        lock.unlock();
    }
}

int main(int argc, char const *argv[])
{
    size_t nums = 3;
    std::thread threads[nums];
    for (size_t i = 0; i < nums; i++)
    {

        threads[i] = std::thread(task, i);
    }

    for (size_t i = 0; i < nums; i++)
    {
        threads[i].join();
    }

    return 0;
}
```

输出结果

可以看到，3 个线程并不是均匀抢占资源的

```shell
$ g++ demo.cpp -std=c++11 -g && ./a.out
=== 1 ===
=== 1 ===
=== 1 ===
=== 1 ===
=== 2 ===
=== 2 ===
=== 2 ===
=== 2 ===
=== 2 ===
=== 2 ===
=== 2 ===
=== 2 ===
=== 2 ===
=== 2 ===
=== 2 ===
=== 2 ===
=== 2 ===
=== 2 ===
=== 2 ===
=== 2 ===
=== 2 ===
=== 2 ===
```

修改代码

释放锁之后，让出 cpu，让其他线程能够重新抢占锁资源

```cpp
#include <iostream>
#include <thread>
#include <chrono>
#include <mutex>

static std::mutex lock;

void task(int index)
{
    for (;;)
    {
        lock.lock();
        std::cout << "=== " << index << " ===" << std::endl;
        std::this_thread::sleep_for(std::chrono::seconds(1));
        lock.unlock();
        // 让出CPU资源
        std::this_thread::sleep_for(std::chrono::microseconds(1));
    }
}

int main(int argc, char const *argv[])
{
    size_t nums = 3;
    std::thread threads[nums];
    for (size_t i = 0; i < nums; i++)
    {

        threads[i] = std::thread(task, i);
    }

    for (size_t i = 0; i < nums; i++)
    {
        threads[i].join();
    }

    return 0;
}
```

输出结果

```shell
$ g++ demo.cpp -std=c++11 -g && ./a.out
=== 1 ===
=== 2 ===
=== 0 ===
=== 1 ===
=== 2 ===
=== 0 ===
=== 1 ===
=== 2 ===
=== 0 ===
=== 1 ===
=== 2 ===
=== 0 ===
```

## 尝试锁 try_lock

```cpp
#include <iostream>
#include <thread>
#include <chrono>
#include <mutex>

static std::mutex lock;

void task(int index)
{
    for (;;)
    {
        if (lock.try_lock())
        {
            std::cout << "=== try lock success " << index << " ===" << std::endl;
            std::this_thread::sleep_for(std::chrono::seconds(1));
            lock.unlock();
            std::cout << "=== unlock " << index << " ===" << std::endl;
        } else {
            std::cout << "=== try lock error " << index << " ===" << std::endl;
        }
        std::this_thread::sleep_for(std::chrono::seconds(1));
    }
}

int main(int argc, char const *argv[])
{
    size_t nums = 3;
    std::thread threads[nums];
    for (size_t i = 0; i < nums; i++)
    {

        threads[i] = std::thread(task, i);
    }

    for (size_t i = 0; i < nums; i++)
    {
        threads[i].join();
    }

    return 0;
}
```

输出结果

```shell
$ g++ demo.cpp -std=c++11 -g && ./a.out
=== try lock success 1 ===
=== try lock error 0 ===
=== try lock error 2 ===
====== unlock 1 ===
```

## timed_mutex 超时锁

避免长时间死锁

```cpp
#include <mutex>
#include <chrono>

std::timed_mutex lock;

// 尝试加锁，成功返回 true
lock.try_lock_for(std::chrono::seconds(1));

lock.unlock();
```

示例

```cpp
#include <iostream>
#include <thread>
#include <chrono>
#include <mutex>

static std::timed_mutex lock;

void task(int index)
{
    for (;;)
    {
        if (lock.try_lock_for(std::chrono::seconds(1)))
        {
            std::cout << "=== try lock success " << index << " ===" << std::endl;
            std::this_thread::sleep_for(std::chrono::seconds(3));
            std::cout << "=== unlock " << index << " ===" << std::endl;
            lock.unlock();
        } else {
            std::cout << "=== try lock timeout " << index << " ===" << std::endl;
        }
        std::this_thread::sleep_for(std::chrono::seconds(1));
    }
}

int main(int argc, char const *argv[])
{
    size_t nums = 3;
    std::thread threads[nums];
    for (size_t i = 0; i < nums; i++)
    {

        threads[i] = std::thread(task, i);
    }

    for (size_t i = 0; i < nums; i++)
    {
        threads[i].join();
    }

    return 0;
}
```

输出结果

```shell
% g++ demo.cpp -std=c++11 -g && ./a.out

=== try lock success 1 ===
=== try lock timeout 0 ===
=== try lock timeout 2 ===
=== unlock 1 ===
=== try lock success 0 ===
=== try lock timeout 2 ===
=== try lock timeout 1 ===
=== try lock timeout 2 ===
=== unlock 0 ===
=== try lock success 1 ===
=== try lock timeout 2 ===
=== try lock timeout 0 ===
=== unlock 1 ===
```

## 可重入锁 recursive_mutex

同一个线程中的同一把锁，可以锁多次，避免了一些不必要的死锁

类似：可重入超时锁 recursive_timed_mutex

示例

```cpp
#include <iostream>
#include <thread>
#include <chrono>
#include <mutex>

static std::recursive_mutex lock;

void task2(int index)
{
    lock.lock();
    std::cout << std::this_thread::get_id() << " task2 lock: " << index << std::endl;
    std::cout << std::this_thread::get_id() << " task2 unlock: " << index << std::endl;
    lock.unlock();
}

void task1(int index)
{
    lock.lock();
    std::cout << std::this_thread::get_id() << " task1 lock: " << index << std::endl;
    task2(index);
    std::cout << std::this_thread::get_id() << " task1 unlock: " << index << std::endl;
    lock.unlock();
}

int main(int argc, char const *argv[])
{
    size_t nums = 3;
    std::thread threads[nums];
    for (size_t i = 0; i < nums; i++)
    {

        threads[i] = std::thread(task1, i);
    }

    for (size_t i = 0; i < nums; i++)
    {
        threads[i].join();
    }

    return 0;
}
```

运行结果

```shell
% g++ demo.cpp -std=c++11 -g && ./a.out
0x70000bf64000 task1 lock: 2
0x70000bf64000 task2 lock: 2
0x70000bf64000 task2 unlock: 2
0x70000bf64000 task1 unlock: 2
0x70000be5e000 task1 lock: 0
0x70000be5e000 task2 lock: 0
0x70000be5e000 task2 unlock: 0
0x70000be5e000 task1 unlock: 0
0x70000bee1000 task1 lock: 1
0x70000bee1000 task2 lock: 1
0x70000bee1000 task2 unlock: 1
0x70000bee1000 task1 unlock: 1
```

## 共享锁 shared_mutex

- 共享超时互斥锁 shared_timed_mutex `C++14`
- 共享互斥 shared_mutex `C++17`

特点：读取时共享，写入是独占

示例

```cpp

#include <iostream>
#include <thread>
#include <chrono>
#include <mutex>
#include <shared_mutex>

static std::shared_mutex lock;

void task_read(int index)
{
    lock.lock_shared();
    std::cout << std::this_thread::get_id() << " task_read lock: " << index << std::endl;
    std::this_thread::sleep_for(std::chrono::seconds(1));
    std::cout << std::this_thread::get_id() << " task_read unlock: " << index << std::endl;
    lock.unlock_shared();
}

void task_write(int index)
{
    lock.lock();
    std::cout << std::this_thread::get_id() << " task_write lock: " << index << std::endl;
    std::this_thread::sleep_for(std::chrono::seconds(3));
    std::cout << std::this_thread::get_id() << " task_write unlock: " << index << std::endl;
    lock.unlock();
}

int main(int argc, char const *argv[])
{
    size_t read_nums = 3;
    size_t write_nums = 3;
    size_t total_nums = read_nums + write_nums;
    std::thread threads[total_nums];
    for (size_t i = 0; i < read_nums; i++)
    {
        threads[i] = std::thread(task_read, i);
    }

    for (size_t i = read_nums; i < total_nums; i++)
    {
        threads[i] = std::thread(task_write, i);
    }

    for (size_t i = 0; i < total_nums; i++)
    {
        threads[i].join();
    }

    return 0;
}
```

输出结果

```shell
$ g++ demo.cpp -std=c++17 -g && ./a.out

0x70000bf63000 task_read lock: 1
0x70000bee0000 task_read lock: 0
0x70000bf63000 task_read unlock: 0x70000bee00001 task_read unlock: 0

0x70000c069000 task_write lock: 3
0x70000c069000 task_write unlock: 3
0x70000c0ec000 task_write lock: 4
0x70000c0ec000 task_write unlock: 4
0x70000c16f000 task_write lock: 5
0x70000c16f000 task_write unlock: 5
0x70000bfe6000 task_read lock: 2
0x70000bfe6000 task_read unlock: 2
```

## 自动释放锁 RAII

RAII Resource Acquisition Is Initialization

资源获取即初始化：使用局部变量来管理资源的技术

示例

```cpp
#include <iostream>
#include <thread>
#include <chrono>
#include <mutex>

static std::mutex lock;

class XMutex
{
public:
    XMutex(std::mutex &lock) : m_lock(lock)
    {
        std::cout << "XMutex lock" << std::endl;
        m_lock.lock();
    }
    ~XMutex()
    {
        std::cout << "XMutex unlock" << std::endl;
        m_lock.unlock();
    }

private:
    std::mutex &m_lock;
};

void task()
{
    std::cout << "task start" << std::endl;
    XMutex xmutex(lock);
    std::cout << "task end" << std::endl;
}

int main(int argc, char const *argv[])
{
    task();
    return 0;
}
```

执行结果

```shell
% g++ demo.cpp -std=c++11 -g && ./a.out
task start
XMutex lock
task end
XMutex unlock
```

如果在锁的外部增加一个大括号

```cpp
void task()
{
    std::cout << "task start" << std::endl;
    {
        XMutex xmutex(lock);
    }
    std::cout << "task end" << std::endl;
}
```

输出结果：可以看到，先释放了锁，后结束函数

```shell
% g++ demo.cpp -std=c++11 -g && ./a.out
task start
XMutex lock
XMutex unlock
task end
```

## lock_guard

C++11 支持 RAII

通过 `{}`控制锁的临界区

示例

```cpp

#include <iostream>
#include <thread>
#include <chrono>
#include <mutex>

static std::mutex lock;

void task()
{
    std::cout << "task start" << std::endl;
    std::lock_guard<std::mutex> locked(lock);
    std::cout << "task end" << std::endl;
}

int main(int argc, char const *argv[])
{
    task();
    return 0;
}

```

运行结果

```shell
% g++ demo.cpp -std=c++11 -g && ./a.out
task start
task end
```

## unique_lock

- 实现可移动的互斥体所有权包装器 `c++11`
- 支持临时释放锁
- adopt_lock_t 已经拥有锁，不加锁，出栈区会释放
- try_to_lock_t 尝试获得互斥的所有权而且不阻塞，获取失败退出栈区不释放，通过 owns_lock 函数判断
- defer_lock_t 延后拥有，不加锁，出栈区不会释放

示例：临时释放锁

```cpp
#include <mutex>

static std::mutex mux;

int main(int argc, char const *argv[])
{
    std::unique_lock<std::mutex> lock(mux);
    lock.unlock();
    // 临时解锁
    lock.lock();

    return 0;
}
```

示例：adopt_lock

```cpp
#include <mutex>

static std::mutex mux;

int main(int argc, char const *argv[])
{
    mux.lock();

    // 已经拥有锁，不锁定，退出栈区解锁
    std::unique_lock<std::mutex> lock(mux, std::adopt_lock);

    return 0;
}
```

示例：defer_lock

```cpp
#include <mutex>

static std::mutex mux;

int main(int argc, char const *argv[])
{
    // 延后拥有，不拥有锁，退出栈区不解锁
    std::unique_lock<std::mutex> lock(mux, std::defer_lock);
    // 加锁，退出栈区解锁
    mux.lock();

    return 0;
}
```

示例：try_to_lock

```cpp
#include <mutex>

static std::mutex mux;

int main(int argc, char const *argv[])
{
    // 尝试加锁，不阻塞，失败不拥有锁
    std::unique_lock<std::mutex> lock(mux, std::try_to_lock);
    if (lock.owns_lock())
    {
        // 加锁成功
    }
    else
    {
        // 加锁失败
    }

    return 0;
}
```

## shared_lock

`C++14`

可以赋值

```cpp
#include <mutex>
#include <shared_mutex>

// 共享锁 c++14
static std::shared_timed_mutex mux;

int main(int argc, char const *argv[])
{
    // 读取锁，调用共享锁
    {
        // 调用 lock_shared/unlock_shared
        std::shared_lock<std::shared_timed_mutex> lock(mux);
        // 退出栈区，释放锁
    }

    // 写入锁，互斥锁
    {
        // 调用 lock/unlock
        std::unique_lock<std::shared_timed_mutex> lock(mux);
    }

    return 0;
}
```

## scoped_lock

`C++17`

用于多个互斥体的免死锁 RAII 封装器

死锁示例

```cpp
#include <iostream>
#include <mutex>
#include <thread>
#include <chrono>
#include <shared_mutex>

static std::mutex lock1;
static std::mutex lock2;

void task1()
{
    std::cout << "task1 lock1 before lock" << std::endl;
    lock1.lock();
    std::cout << "task1 lock1 locked" << std::endl;

    std::this_thread::sleep_for(std::chrono::seconds(1));

    std::cout << "task1 lock2 before lock" << std::endl;
    lock2.lock();
    std::cout << "task1 lock2 locked" << std::endl;

    lock2.unlock();
    lock1.unlock();
}

void task2()
{
    std::cout << "task2 lock2 before lock" << std::endl;
    lock2.lock();
    std::cout << "task2 lock2 locked" << std::endl;

    std::this_thread::sleep_for(std::chrono::seconds(1));

    std::cout << "task2 lock1 before lock" << std::endl;
    lock1.lock();
    std::cout << "task2 lock1 locked" << std::endl;

    lock1.unlock();
    lock2.unlock();
}

int main(int argc, char const *argv[])
{
    std::thread t1(task1);
    std::thread t2(task2);
    t1.join();
    t2.join();
    return 0;
}
```

输出结果

```shell
% g++ demo.cpp -std=c++11 -g && ./a.out
task1 lock1 before lock
task2 lock2 before lock
task1 lock1 locked
task2 lock2 locked
task1 lock2 before lock
task2 lock1 before lock
```

示例：lock `c++11`

```cpp
#include <iostream>
#include <mutex>
#include <thread>
#include <chrono>
#include <shared_mutex>

static std::mutex lock1;
static std::mutex lock2;

void task1()
{
    std::cout << "task1 lock1 lock2 before lock" << std::endl;
    std::lock<std::mutex, std::mutex>(lock1, lock2);
    std::cout << "task1 lock1 lock2 locked" << std::endl;

    std::this_thread::sleep_for(std::chrono::seconds(1));

    std::cout << "task1 lock1 lock2 unlocked" << std::endl;
    lock2.unlock();
    lock1.unlock();
}

void task2()
{
    std::cout << "task2 lock1 lock2 before lock" << std::endl;
    std::lock<std::mutex, std::mutex>(lock1, lock2);
    std::cout << "task2 lock1 lock2 locked" << std::endl;

    std::this_thread::sleep_for(std::chrono::seconds(1));

    std::cout << "task2 lock1 lock2 unlocked" << std::endl;
    lock1.unlock();
    lock2.unlock();
}

int main(int argc, char const *argv[])
{
    std::thread t1(task1);
    std::thread t2(task2);
    t1.join();
    t2.join();
    return 0;
}
```

输出结果

```shell
% g++ demo.cpp -std=c++11 -g && ./a.out
task2 lock1 lock2 before lock
task1 lock1 lock2 before lock
task2 lock1 lock2 locked
task2 lock1 lock2 unlocked
task1 lock1 lock2 locked
task1 lock1 lock2 unlocked
```

示例：scoped_lock 同时加多个锁

退出栈区会自动解锁

```cpp
#include <iostream>
#include <mutex>
#include <thread>
#include <chrono>
#include <shared_mutex>

static std::mutex lock1;
static std::mutex lock2;

void task1()
{
    std::cout << "task1 lock1 lock2 before lock" << std::endl;
    std::scoped_lock<std::mutex, std::mutex> lock(lock1, lock2);
    std::cout << "task1 lock1 lock2 locked" << std::endl;

    std::this_thread::sleep_for(std::chrono::seconds(1));

    std::cout << "task1 lock1 lock2 unlocked" << std::endl;
}

void task2()
{
    std::cout << "task2 lock1 lock2 before lock" << std::endl;
    std::scoped_lock<std::mutex, std::mutex> lock(lock1, lock2);
    std::cout << "task2 lock1 lock2 locked" << std::endl;

    std::this_thread::sleep_for(std::chrono::seconds(1));

    std::cout << "task2 lock1 lock2 unlocked" << std::endl;
}

int main(int argc, char const *argv[])
{
    std::thread t1(task1);
    std::thread t2(task2);
    t1.join();
    t2.join();
    return 0;
}
```

运行结果

```shell
% g++ demo.cpp -std=c++17 -g && ./a.out
task1 lock1 lock2 before lock
task1 lock1 lock2 locked
task2 lock1 lock2 before lock
task1 lock1 lock2 unlocked
task2 lock1 lock2 locked
task2 lock1 lock2 unlocked
```

## 项目案例

使用互斥锁+list 模拟线程通信

1. 封装线程基类 XThread 控制线程启动和停止
2. 模拟消息服务器线程 接收字符串消息，并模拟处理
3. 通过 unique_lock 和 mutex 互斥访问`list<string>` 消息队列
4. 主线程定时发送消息给子线程

```shell
% tree -I build
.
├── CMakeLists.txt
├── include
│   ├── message_server.h
│   └── xthread.h
└── src
    ├── main.cpp
    ├── message_server.cpp
    └── xthread.cpp
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

xthread.h

```cpp
#pragma once
#include <thread>

// 线程基类
class XThread
{
public:
    // 启动
    virtual void start();
    // 停止
    virtual void stop();
    // 等待
    virtual void wait();
    // 判断是否在运行
    virtual bool is_running();

private:
    virtual void run() = 0;
    bool m_is_running;
    std::thread m_thread;
};
```

message_server.h

```cpp
#pragma once

#include "xthread.h"
#include <list>
#include <string>
#include <mutex>

class MessageServer : public XThread
{
public:
    // 发送消息
    void send_message(std::string msg);
    // 处理消息
    void handle_message();

private:
    // 消息处理入口
    void run() override;
    // 消息队列
    std::list<std::string> m_msg_list;
    // 消息队列访问的互斥锁
    std::recursive_mutex m_mutex;
};
```

xthread.cpp

```cpp
#include "xthread.h"

void XThread::start()
{
    m_is_running = true;
    m_thread = std::thread(&XThread::run, this);
}

void XThread::stop()
{
    m_is_running = false;
    this->wait();
}

void XThread::wait()
{
    if (m_thread.joinable())
    {
        m_thread.join();
    }
}

bool XThread::is_running()
{
    return m_is_running;
}
```

message_server.cpp

```cpp
#include "message_server.h"
#include <string>
#include <iostream>

using namespace std;

void MessageServer::send_message(std::string msg)
{
    unique_lock<recursive_mutex> lock(m_mutex);
    m_msg_list.push_back(msg);
}

void MessageServer::handle_message()
{
    unique_lock<recursive_mutex> lock(m_mutex);
    string msg = m_msg_list.front();
    cout << "handle msg: " << msg << endl;
    m_msg_list.pop_front();
}

void MessageServer::run()
{
    while (this->is_running())
    {
        unique_lock<recursive_mutex> lock(m_mutex);
        if (m_msg_list.empty())
        {
            this_thread::sleep_for(chrono::microseconds(100)); // 100ms
            continue;
        }

        while (!m_msg_list.empty())
        {
            // 消息处理业务逻辑
            this->handle_message();
        }
    }
}
```

main.cpp

```cpp
#include "message_server.h"
#include <sstream>
#include <thread>

using namespace std;

int main(int argc, char const *argv[])
{
    MessageServer msg_server;
    msg_server.start();
    for (size_t i = 0; i < 10; i++)
    {
        stringstream ss;
        ss << "msg: " << i;
        msg_server.send_message(ss.str());
        this_thread::sleep_for(chrono::microseconds(500));
    }

    msg_server.stop();

    return 0;
}
```

输出结果

```shell
$ cmake -B build && cmake --build build && ./build/app

handle msg: msg: 0
handle msg: msg: 1
handle msg: msg: 2
handle msg: msg: 3
handle msg: msg: 4
handle msg: msg: 5
handle msg: msg: 6
handle msg: msg: 7
handle msg: msg: 8
handle msg: msg: 9
```

## 条件变量 condition_variable

生产者-消费者模型

- 生产者和消费者共享资源变量（list 队列）
- 生产者生产一个产品，通知消费者消费
- 消费者阻塞等待信号，获取信号后消费产品（取出 list 队列中数据）

改变共享变量的线程步骤

1、准备好信号量

```cpp
std::condition_variable condition;
```

2、获得 std::mutex

```cpp
std::unique_lock lock(mutex);
```

3、在获取锁时进行修改

```cpp
list.push_back(item);
```

4、释放锁并通知读取线程

```cpp
lock.unlock()

// 通知一个等待信号线程
condition.notify_one();

// 通知所有等待信号线程
condition.notify_all();
```

等待信号读取共享变量的线程步骤

1、获得与改变共享变量线程共同的 mutex

```cpp
unique_lock lock(mutex)
```

2、wait 等待信号通知

2.1、无 lambda 表达式

```cpp
// 解锁，并阻塞等待notify_one notify_all通知
condition.wait(lock)
// 处理逻辑
```

2.2、lambda 表达式

```cpp
// 如果返回false，释放锁，阻塞等待
// 如果返回true，加锁，继续执行
condition.wait(lock, []{return bool})
// 只在unique_lock<mutex> 上工作的condition_variable
```

示例

```cpp
#include <iostream>
#include <thread>
#include <mutex>
#include <list>
#include <sstream>

using namespace std;

mutex mtx;
condition_variable condition;
list<string> msg_list;

// 读取线程
void read_task(int i)
{
    for (;;)
    {
        // 加锁读取
        unique_lock lock(mtx);
        cout << "read [" << i << "]: start" << endl;
        // 解锁，阻塞等待信号
        condition.wait(lock);
        // 加锁，继续执行
        while (!msg_list.empty())
        {
            cout << "read [" << i << "]: " << msg_list.front() << endl;
            msg_list.pop_front();
        }
        cout << "read [" << i << "]: end" << endl;
    }
}

// 写入线程
void write_task()
{
    int i = 0;
    for (;;)
    {
        i++;

        cout << "write: " << i << endl;
        stringstream ss;
        ss << "msg: " << i;

        // 加锁写入
        unique_lock lock(mtx);
        msg_list.push_back(ss.str());
        lock.unlock();

        // 发送唤醒信号
        condition.notify_one();
        this_thread::sleep_for(chrono::seconds(1));
    }
}
int main(int argc, char const *argv[])
{
    // 1个写入线程
    thread write_t(write_task);

    // 多个读取线程
    int read_count = 3;
    thread read_threads[read_count];

    for (int i = 0; i < read_count; i++)
    {
        read_threads[i] = thread(read_task, i);
    }

    for (int i = 0; i < read_count; i++)
    {
        read_threads[i].join();
    }

    write_t.join();

    return 0;
}

```

执行结果

```shell
read [0]: start
write: 1
read [1]: start
read [0]: msg: 1
read [0]: end
read [0]: start
read [2]: start
write: 2
read [1]: msg: 2
read [1]: end
read [1]: start
write: 3
read [0]: msg: 3
read [0]: end
read [0]: start
```

## condition_variable示例

```shell
% tree -I build
.
├── CMakeLists.txt
├── include
│   ├── message_server.h
│   └── xthread.h
└── src
    ├── main.cpp
    ├── message_server.cpp
    └── xthread.cpp
```

CMakeLists.txt

```shell
# CMakeLists.txt
# cmake -B build && cmake --build build && ./build/app
cmake_minimum_required(VERSION 3.29)
project(app)

set(CMAKE_CXX_STANDARD 14)

include_directories("include")

aux_source_directory(./src SRC_LIST)
add_executable(app ${SRC_LIST})

```

xthread.h

```cpp
#pragma once
#include <thread>

// 线程基类
class XThread
{
public:
    // 启动
    virtual void start();
    // 停止
    virtual void stop();
    // 等待
    virtual void wait();
    // 判断是否在运行
    virtual bool is_running();

protected:
    bool m_is_running;

private:
    virtual void run() = 0;

    std::thread m_thread;
};
```

xthread.cpp

```cpp
#include "xthread.h"

void XThread::start()
{
    m_is_running = true;
    m_thread = std::thread(&XThread::run, this);
}

void XThread::stop()
{
    m_is_running = false;
    this->wait();
}

void XThread::wait()
{
    if (m_thread.joinable())
    {
        m_thread.join();
    }
}

bool XThread::is_running()
{
    return m_is_running;
}
```

message_server.h

```cpp
#pragma once

#include "xthread.h"
#include <list>
#include <string>
#include <mutex>
#include <condition_variable>

class MessageServer : public XThread
{
public:
    // 发送消息
    void send_message(std::string msg);
    // 处理消息
    void handle_message();
    // 重写停止函数
    void stop() override;

private:
    // 消息处理入口
    void run() override;
    // 消息队列
    std::list<std::string> m_msg_list;
    // 消息队列访问的互斥锁
    std::mutex m_mutex;
    // 条件变量
    std::condition_variable m_condition;
};
```

message_server.cpp

```cpp
#include "message_server.h"
#include <string>
#include <iostream>

using namespace std;

void MessageServer::stop()
{
    m_is_running = false;
    m_condition.notify_all(); // 通知所有线程
    this->wait();
}

void MessageServer::send_message(std::string msg)
{
    unique_lock<mutex> lock(m_mutex);
    m_msg_list.push_back(msg);
    m_condition.notify_one();
}

void MessageServer::handle_message()
{
    string msg = m_msg_list.front();
    cout << "handle msg: " << msg << endl;
    m_msg_list.pop_front();
}

void MessageServer::run()
{
    while (this->is_running())
    {
        unique_lock<mutex> lock(m_mutex);
        // if (m_msg_list.empty())
        // {
        //     this_thread::sleep_for(chrono::microseconds(100)); // 100ms
        //     continue;
        // }

        // 释放锁，阻塞等待唤醒
        m_condition.wait(lock, [this]()
                         { return !is_running() || !m_msg_list.empty(); });

        while (!m_msg_list.empty())
        {
            // 消息处理业务逻辑
            this->handle_message();
        }
    }
}
```

main.cpp

```cpp
#include "message_server.h"
#include <sstream>
#include <thread>

using namespace std;

int main(int argc, char const *argv[])
{
    MessageServer msg_server;
    msg_server.start();
    for (size_t i = 0; i < 10; i++)
    {
        stringstream ss;
        ss << "msg: " << i;
        msg_server.send_message(ss.str());
        this_thread::sleep_for(chrono::microseconds(500));
    }

    msg_server.stop();

    return 0;
}
```

## 线程异步和通信

promise和future

promise用于异步传输变量

- promise提供存储异步通信的值，再通过future异步获取结果
- promise只能使用一次，`void set_value(T&& value)`设置传递值，只能调用一次

future 访问异步操作结果

- `get()`阻塞等待`promise set_value`的值

示例

```cpp
#include <iostream>
#include <future>
#include <string>
#include <thread>

using namespace std;

void task(promise<string> p)
{
    cout << "task start" << endl;
    this_thread::sleep_for(chrono::seconds(3));
    p.set_value("task result");
    this_thread::sleep_for(chrono::seconds(3));
    cout << "task end" << endl;
}

int main(int argc, char const *argv[])
{
    // 异步传输变量
    promise<string> p;
    // 获取线程异步返回值
    future<string> f = p.get_future();

    // 启动线程
    thread t(task, std::move(p));

    // 阻塞等待异步返回
    cout << "brefore get" << endl;
    string result = f.get();
    cout << "result: " << result << endl;
    cout << "after get" << endl;

    // 等待线程结束
    t.join();

    return 0;
}
```

输出结果

```shell
% g++ -std=c++11 promise_demo.cpp -o promise_demo && ./promise_demo
brefore get
task start
result: task result
after get
task end
```

## packaged_task

packaged_task异步调用函数打包

- packaged_task包装函数为一个对象，用于异步调用，其返回值能通过`std::future`对象访问
- 与bind的区别，可异步调用，函数访问和获取返回值分开调用

示例：同步调用

```cpp
#include <iostream>
#include <string>
#include <thread>
#include <future>

using namespace std;

string run_task(int val)
{
    cout << "task start" << endl;
    this_thread::sleep_for(chrono::seconds(3));
    return "value";
}

int main(int argc, char const *argv[])
{
    packaged_task<string(int)> task(run_task);
    future<string> f = task.get_future();

    // 同步调用
    task(100);

    cout << "before get" << endl;
    string result = f.get();
    cout << "result: " << result << endl;

    return 0;
}
```

输出结果

```shell
g++ -std=c++11 packaged_task_demo.cpp -o packaged_task_demo && ./packaged_task_demo
task start
before get
result: value
```

示例：异步调用

```cpp
#include <iostream>
#include <string>
#include <thread>
#include <future>

using namespace std;

string run_task(int val)
{
    cout << "task start" << endl;
    this_thread::sleep_for(chrono::seconds(3));
    return "value";
}

int main(int argc, char const *argv[])
{
    packaged_task<string(int)> task(run_task);
    future<string> f = task.get_future();

    // 异步调用
    thread t(std::move(task), 100);

    cout << "before get" << endl;
    string result = f.get();
    cout << "result: " << result << endl;

    t.join();
    return 0;
}
```

输出结果

```shell
$ g++ -std=c++11 packaged_task_demo.cpp -o packaged_task_demo && ./packaged_task_demo
before get
task start
result: value
```

示例：等待超时

```cpp
#include <iostream>
#include <string>
#include <thread>
#include <future>

using namespace std;

string run_task(int val)
{
    cout << "task start" << endl;
    this_thread::sleep_for(chrono::seconds(3));
    return "value";
}

int main(int argc, char const *argv[])
{
    packaged_task<string(int)> task(run_task);
    future<string> f = task.get_future();

    // 异步调用
    thread t(std::move(task), 100);

    cout << "before get" << endl;

    // 等待超时
    future_status status = f.wait_for(chrono::seconds(2));
    if (status == future_status::timeout)
    {
        cout << "result: timeout" << endl;
    }
    else
    {
        string result = f.get();
        cout << "result: " << result << endl;
    }

    t.join();
    return 0;
}
```

输出结果

```shell
$ g++ -std=c++11 packaged_task_demo.cpp -o packaged_task_demo && ./packaged_task_demo
before get
task start
result: timeout
```
