# algorithm

提供了一组用于操作容器（如数组、向量、列表等）的算法

头文件

```cpp
#include <algorithm>
```

算法包括排序、搜索、复制、比较等

语法

大多数 `<algorithm>` 中的函数都遵循以下基本语法：

```cpp
algorithm_name(container.begin(), container.end(), ...);
```

这里的 container 是一个容器对象，begin() 和 end() 是容器的成员函数，返回指向容器开始和结束的迭代器。

## 排序算法

```cpp
// 对容器中的元素进行排序
std::sort(container.begin(), container.end(), compare_function);

// 对部分区间排序，前 n 个元素为有序。
std::partial_sort(vec.begin(), vec.begin() + 3, vec.end());

// 稳定排序，保留相等元素的相对顺序
std::stable_sort(vec.begin(), vec.end());
```

示例

```cpp
#include <iostream>
#include <algorithm>
#include <vector>

int main(int argc, char const *argv[])
{
    std::vector<int> vector = {1, 3, 5, 2, 4};

    std::sort(vector.begin(), vector.end());

    for(int num: vector){
        std::cout << num << " ";
    }
    std::cout << std::endl;

    return 0;
}
```

输出

```shell
1 2 3 4 5 
```

## 搜索算法

```cpp
// 在容器中查找与给定值匹配的第一个元素
auto it = find(container.begin(), container.end(), value);

// 对有序区间进行二分查找
std::sort(vec.begin(), vec.end());  // 先排序
bool found = std::binary_search(vec.begin(), vec.end(), 4);

// 查找第一个满足特定条件的元素。
auto it = std::find_if(vec.begin(), vec.end(), [](int x) { return x > 3; });
```

如果找到，it 将指向匹配的元素；如果没有找到，it 将等于 container.end()。

示例

```cpp
#include <iostream>
#include <algorithm>
#include <vector>

int main(int argc, char const *argv[])
{
    std::vector<int> vector = {1, 3, 5, 2, 4};

    auto it = std::find(vector.begin(), vector.end(), 5);

    if (it != vector.end())
    {
        std::cout << *it << std::endl;
    }
    else
    {
        std::cout << "not found" << std::endl;
    }

    return 0;
}
```

输出

```shell
5
```

## 复制算法

```cpp
// 将一个范围内的元素复制到另一个容器或数组。
copy(source_begin, source_end, destination_begin);
```

示例

```cpp
#include <iostream>
#include <algorithm>
#include <vector>

int main(int argc, char const *argv[])
{
    std::vector<int> vector = {1, 3, 5, 2, 4};
    std::vector<int> target(5);

    std::copy(vector.begin(), vector.end(), target.begin());

    for (int item : target)
    {
        std::cout << item << " ";
    }

    std::cout << std::endl;

    return 0;
}
```

输出结果

```shell
1 3 5 2 4 
```

## 比较算法

```cpp
// 比较两个容器或两个范围内的元素是否相等
bool result = equal(first1, last1, first2);

// 或
bool result = equal(first1, last1, first2, compare_function);
```

示例

```cpp
#include <iostream>
#include <algorithm>
#include <vector>
#include <iomanip>

int main(int argc, char const *argv[])
{
    std::vector<int> vector = {1, 3, 5, 2, 4};
    std::vector<int> target = {1, 3, 5, 2, 4};

    bool result = std::equal(vector.begin(), vector.end(), target.begin());

    std::cout << std::boolalpha << result << std::endl;

    return 0;
}
```

输出

```shell
true
```

## 修改算法

```cpp
// 反转区间内的元素顺序。
std::reverse(vec.begin(), vec.end());

// 将指定区间内的所有元素赋值为某个值。
std::fill(vec.begin(), vec.end(), 0);  // 所有元素设为 0

// 将区间内的某个值替换为另一个值。
std::replace(vec.begin(), vec.end(), 1, 99);  // 将所有 1 替换为 99
```

示例

```cpp
#include <iostream>
#include <algorithm>
#include <vector>
#include <iomanip>

int main(int argc, char const *argv[])
{
    std::vector<int> vector = {1, 3, 5, 2, 4};

    std::replace(vector.begin(), vector.end(), 2, 20);

    for (int item : vector)
    {
        std::cout << item << " ";
    }
    std::cout << std::endl;

    return 0;
}
```

输出

```shell
1 3 5 20 4 
```

## 排列算法

```cpp
// 生成字典序的下一个排列，如果没有下一个排列则返回 false。
std::next_permutation(vec.begin(), vec.end())

// 生成字典序的上一个排列。
std::prev_permutation(vec.begin(), vec.end());
```

```cpp
#include <iostream>
#include <algorithm>
#include <vector>

int main(int argc, char const *argv[])
{
    std::vector<int> vec = {1, 2, 3};

    do
    {
        for (int n : vec)
        {
            std::cout << n << " ";
        }
        std::cout << std::endl;
    } while (std::next_permutation(vec.begin(), vec.end()));

    return 0;
}

```

```shell
1 2 3 
1 3 2 
2 1 3 
2 3 1 
3 1 2 
3 2 1 
```

## 归并算法

```cpp
// 将两个有序区间合并到一个有序区间
std::merge(vec1.begin(), vec1.end(), vec2.begin(), vec2.end(), result.begin());

// 在单个区间中合并两个有序子区间。
std::inplace_merge(vec.begin(), middle, vec.end());
```

```cpp
#include <iostream>
#include <algorithm>
#include <vector>

int main(int argc, char const *argv[])
{
    std::vector<int> vec1 = {1, 3, 5};
    std::vector<int> vec2 = {2, 4, 6};
    std::vector<int> result(6);
    
    std::merge(vec1.begin(), vec1.end(), vec2.begin(), vec2.end(), result.begin());

    for (int num : result)
    {
        std::cout << num << " ";
    }

    std::cout << std::endl;

    return 0;
}
```

```shell
1 2 3 4 5 6 
```

## 集合算法

```cpp
// 计算两个有序集合的并集。
auto it = std::set_union(
    vec1.begin(), vec1.end(), 
    vec2.begin(), vec2.end(), 
    result.begin()
);

// 计算两个有序集合的交集。
auto it = std::set_intersection(
    vec1.begin(), vec1.end(), 
    vec2.begin(), vec2.end(), 
    result.begin()
);

// 计算集合的差集。
auto it = std::set_difference(
    vec1.begin(), vec1.end(), 
    vec2.begin(), vec2.end(), 
    result.begin()
);
```

示例

```cpp
#include <iostream>
#include <algorithm>
#include <vector>

int main(int argc, char const *argv[])
{
    std::vector<int> vec1 = {1, 3, 5};
    std::vector<int> vec2 = {2, 3, 6};
    std::vector<int> result(6);

    auto it = std::set_intersection(vec1.begin(), vec1.end(), vec2.begin(), vec2.end(), result.begin());
    result.resize(it - result.begin());

    for (int num : result)
    {
        std::cout << num << " ";
    }

    std::cout << std::endl;

    return 0;
}
```

```shell
3 
```

## 其他有用算法

```cpp
// 计算范围内元素的累计和。
#include <numeric>
int sum = std::accumulate(vec.begin(), vec.end(), 0);

// 对区间内的每个元素执行操作。
std::for_each(vec.begin(), vec.end(), [](int& x) { x += 1; });

// 查找区间内的最小值
auto min_it = std::min_element(vec.begin(), vec.end());

// 查找区间内的最大值
auto max_it = std::max_element(vec.begin(), vec.end());
```

示例

```cpp
#include <iostream>
#include <algorithm>
#include <vector>
#include <numeric>

int main(int argc, char const *argv[])
{
    std::vector<int> vec = {1, 3, 5};

    int sum = std::accumulate(vec.begin(), vec.end(), 0);

    std::cout << sum << std::endl;

    return 0;
}
```

输出

```shell
9
```
