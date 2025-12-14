# atomic

C++11 标准引入`<atomic>` 库，提供了一组原子操作，用于保证在多线程环境下对单个数据的访问是原子的，即不可分割的。这可以避免数据竞争和保证线程安全。

原子操作是指在执行过程中不会被其他线程中断的操作。

`<atomic>`库中的原子类型提供了这样的操作，它们可以保证在多线程环境中对共享数据的访问是安全的。

## 基本操作

- load(): 安全地读取原子变量的值。
- store(value): 安全地将值写入原子变量。
- exchange(value): 将原子变量的值替换为value，并返回原子变量的旧值。
- compare_exchange_weak(expected, desired): 如果原子变量的当前值等于expected，则将其设置为desired，并返回true。否则，将expected设置为原子变量的当前值，并返回false。
- compare_exchange_strong(expected, desired): 与compare_exchange_weak类似，但循环直到成功。

示例

```cpp
#include <iostream>
#include <atomic>
#include <thread>

int value = 0;             // 普通变量
std::atomic<int> count(0); // 原子变量

void add()
{
    for (size_t i = 0; i < 10000; i++)
    {
        count.fetch_add(1, std::memory_order_relaxed);
        value++;
    }
}

int main()
{
    std::thread t1(add);
    std::thread t2(add);

    t1.join();
    t2.join();

    std::cout << "value:" << value << std::endl;
    std::cout << "count:" << count << std::endl;
}
```

输出结果

```shell
value:10606
count:20000
```