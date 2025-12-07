# condition_variable

C++11

condition_variable 用于线程间同步

```cpp
#include <condition_variable>

template <class Mutex>
class condition_variable {
public:
    condition_variable();
    ~condition_variable();

    void wait(unique_lock<mutex>& lock);
    void wait_for(unique_lock<mutex>& lock, chrono::duration<Rep, Period> const& rel_time);
    void wait_until(unique_lock<mutex>& lock, chrono::time_point<Clock, Duration> const& abs_time);

    // 唤醒一个等待的线程
    void notify_one() noexcept;
    // 唤醒所有等待的线程
    void notify_all() noexcept;
};
```

注意事项

- 使用condition_variable时，必须确保在等待之前获取互斥锁，并且在唤醒后释放互斥锁。
- wait、wait_for和wait_until函数都会释放互斥锁，然后在等待期间重新获取它。
- notify_one唤醒一个等待的线程，而notify_all唤醒所有等待的线程。

示例

```cpp
#include <iostream>
#include <thread>
#include <mutex>
#include <queue>
#include <chrono>
#include <condition_variable>

std::mutex mtx;                    // 全局互斥锁
std::condition_variable condition; // 条件变量
std::queue<int> queue;             // 队列
const size_t QUEUE_SIZE = 2;       // 队列容量

const int PRODUCER_COUNT = 2;
const int CONSUMER_COUNT = 2;

std::mutex quit_mtx; // 全局互斥锁
int completed_count = 0;

void producer(int id)
{
    for (size_t i = 0; i < 3; i++)
    {
        std::unique_lock<std::mutex> lock(mtx);
        condition.wait(lock, []
                       { return queue.size() < QUEUE_SIZE; });

        // sleep 1s
        std::this_thread::sleep_for(std::chrono::seconds(1));
        int value = id * 10 + i;
        queue.push(value);
        std::cout << "producer<" << id << "> " << value << std::endl;

        condition.notify_one();
        lock.unlock();
    }

    std::unique_lock<std::mutex> lock(quit_mtx);
    completed_count++;
    condition.notify_all();
}

void comsumer(int id)
{
    while (true)
    {
        std::unique_lock<std::mutex> lock(mtx);
        condition.wait(lock, []
                       { return !queue.empty() || completed_count >= PRODUCER_COUNT; });

        // all producter thread completed
        if (completed_count >= PRODUCER_COUNT)
        {
            break;
        }

        if (!queue.empty())
        {
            int value = queue.front();
            queue.pop();

            std::cout << "comsumer<" << id << "> " << value << std::endl;
        }

        condition.notify_one();
        lock.unlock();
    }
}

int main()
{
    std::thread producer_threads[PRODUCER_COUNT];
    std::thread consumer_threads[CONSUMER_COUNT];

    // 拉起线程
    for (size_t i = 0; i < PRODUCER_COUNT; i++)
    {
        producer_threads[i] = std::thread(producer, i + 1);
    }

    for (size_t i = 0; i < CONSUMER_COUNT; i++)
    {
        consumer_threads[i] = std::thread(comsumer, i + 1);
    }

    // 等待线程执行完毕
    for (size_t i = 0; i < PRODUCER_COUNT; i++)
    {
        producer_threads[i].join();
    }

    for (size_t i = 0; i < CONSUMER_COUNT; i++)
    {
        consumer_threads[i].join();
    }
}
```

输出结果

```shell
producer<1> 10
producer<1> 11
comsumer<2> 10
comsumer<2> 11
producer<1> 12
comsumer<2> 12
producer<2> 20
producer<2> 21
comsumer<1> 20
comsumer<1> 21
producer<2> 22
comsumer<1> 22
```
