# 线程池示例

## 实现步骤

1、初始化线程池

确定线程数量，并做好互斥访问

2、启动所有线程

```cpp
vector<thread> threads;
```

3、任务基类

```cpp
class BaseTask{
    public:
        virtual int run() = 0;
}
```

4、插入任务

```cpp
push()
```

5、获取任务

```cpp
pop()
```

6、执行任务线程入口

```cpp
ThreadPool()
```

## 代码实现

```shell
% tree -I build
.
├── CMakeLists.txt
├── include
│   └── thread_pool.h
└── src
    ├── main.cpp
    └── thread_pool.cpp
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

thread_pool.h

```cpp
#pragma once
#include <mutex>
#include <thread>
#include <vector>
#include <list>
#include <condition_variable>
#include <atomic>
#include <functional>
#include <memory>
#include <future>

/**
 * 任务基类
 */

class Task
{
public:
    Task()
    {
        std::cout << "Task init" << std::endl;
    }
    Task(const Task &other) noexcept
    {
        std::cout << "Task copy" << std::endl;
    }
    ~Task()
    {
        std::cout << "Task delete" << std::endl;
    }

    void set_result(int value)
    {
        promise.set_value(value);
    }

    int get_result()
    {
        // 阻塞等待返回
        return promise.get_future().get();
    }

    virtual void run() = 0;

    // 退出标记
    std::function<bool()> is_stop = nullptr;

    // 接收返回值
    std::promise<int> promise;
};

/**
 * 线程池
 */
class ThreadPool
{
public:
    ~ThreadPool();

    // 初始化线程池
    void init(int thread_num);

    // 启动所有线程
    void start();

    // 停止线程池
    void stop();

    // 停止标记
    bool is_stop();

    // 添加任务
    // void add_task(Task *task);
    void add_task(std::shared_ptr<Task> task);

    // 获取任务
    // Task* get_task();
    std::shared_ptr<Task> get_task();

    // 获取正在运行任务数
    int get_run_task_count();

private:
    void run();                 // 入口函数
    int thread_num = 0;         // 线程数量
    std::mutex mtx;             // 互斥锁
    std::condition_variable cv; // 条件变量
    // std::vector<std::thread *> threads; // 所有线程
    // 智能指针版本
    std::vector<std::shared_ptr<std::thread>> threads;
    // std::list<Task *> tasks;            // 任务列表
    std::list<std::shared_ptr<Task>> tasks; // 任务列表
    bool is_stop_flag;                      // 退出标记
    // 正在运行的任务数，线程安全
    std::atomic<int> run_task_count = {0};
};
```

thread_pool.cpp

```cpp
#include <iostream>
#include "thread_pool.h"

using namespace std;

ThreadPool::~ThreadPool()
{
    this->stop();
}

void ThreadPool::init(int thread_num)
{
    this->thread_num = thread_num;
    this->is_stop_flag = false;
    cout << "ThreadPool::init " << thread_num << endl;
}

void ThreadPool::start()
{
    if (this->thread_num <= 0)
    {
        cout << "please call ThreadPool::init" << endl;
        return;
    }

    if (!this->threads.empty())
    {
        cout << "threads is not empty" << endl;
        return;
    }

    // 启动线程
    for (size_t i = 0; i < this->thread_num; i++)
    {
        // thread *t = new thread(&ThreadPool::run, this);
        shared_ptr<thread> t = make_shared<thread>(&ThreadPool::run, this);
        this->threads.push_back(t);
    }

    cout << "ThreadPool::start end" << endl;
}

void ThreadPool::stop()
{
    cout << "ThreadPool::stop" << endl;

    // 防止重入
    if (this->threads.empty())
    {
        return;
    }

    this->is_stop_flag = true;

    this->cv.notify_all();

    for (int i = 0; i < this->thread_num; i++)
    {
        if (this->threads[i]->joinable())
        {
            this->threads[i]->join();
        }
    }

    unique_lock<mutex> lock(this->mtx);
    this->threads.clear();
    cout << "ThreadPool::stop end" << endl;
}

bool ThreadPool::is_stop()
{
    return this->is_stop_flag;
}

void ThreadPool::run()
{
    cout << "ThreadPool::run start " << this_thread::get_id() << endl;
    while (!this->is_stop_flag)
    {
        // 阻塞获取任务
        // Task *task = this->get_task();
        shared_ptr<Task> task = this->get_task();

        // 如果没有获取任务，则等待一会
        if (!task)
        {
            this_thread::sleep_for(chrono::milliseconds(500));
            continue;
        }
        cout << "ThreadPool::run " << this_thread::get_id() << endl;

        // 执行任务，捕获异常
        ++run_task_count;
        try
        {
            task->run();
        }
        catch (...)
        {
            cout << "ThreadPool::run run error" << endl;
        }
        --run_task_count;
    }
}

// void ThreadPool::add_task(Task *task)
void ThreadPool::add_task(shared_ptr<Task> task)
{
    cout << "ThreadPool::add_task" << endl;

    task->is_stop = [this]() -> bool
    { return this->is_stop_flag; };

    unique_lock<mutex> lock(this->mtx);
    this->tasks.push_back(task);

    // 解锁唤醒线程
    lock.unlock();
    cv.notify_one();
}

// Task *ThreadPool::get_task()
shared_ptr<Task> ThreadPool::get_task()
{
    cout << "ThreadPool::get_task" << endl;
    unique_lock<mutex> lock(this->mtx);

    // 加锁等待
    if (this->tasks.empty())
    {
        this->cv.wait(lock);
    }

    // 退出
    if (this->is_stop_flag)
    {
        return nullptr;
    }

    // 列表为空
    if (this->tasks.empty())
    {
        return nullptr;
    }

    // Task *task = this->tasks.front();
    shared_ptr<Task> task = this->tasks.front();
    this->tasks.pop_front();
    return task;
}

int ThreadPool::get_run_task_count()
{
    return this->run_task_count;
}
```

main.cpp

```cpp
#include <iostream>
#include <memory>
#include "thread_pool.h"

using namespace std;

class EchoTask : public Task
{
public:
    void run()
    {
        if (this->is_stop())
        {
            return;
        }
        this_thread::sleep_for(chrono::seconds(3));
        cout << "EchoTask" << endl;
        this->set_result(101);
    }
};

int main(int argc, char const *argv[])
{
    ThreadPool thread_pool;
    thread_pool.init(3);
    thread_pool.start();

    // 使用智能指针，确保作用域外可以正常使用
    {
        // EchoTask task;
        shared_ptr<Task> task = make_shared<EchoTask>();
        thread_pool.add_task(task);
        int result = task->get_result();
        cout << "result: " << result << endl;
    }
    this_thread::sleep_for(chrono::seconds(1));
    cout << "run_task_count: " << thread_pool.get_run_task_count() << endl;
    thread_pool.stop();
    cout << "run_task_count: " << thread_pool.get_run_task_count() << endl;
    return 0;
}
```
