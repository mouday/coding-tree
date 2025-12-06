# numeric

用于数值计算的函数模板

头文件

```cpp
#include <numeric>
```

## accumulate

accumulate 函数用于计算容器中所有元素的总和。它接受三个参数：容器的开始迭代器、结束迭代器和初始值。

语法:

```cpp
template <InputIterator Iter, class T>
T accumulate(Iter first, Iter last, T init);
```

示例

```cpp
#include <iostream>
#include <vector>
#include <numeric>

int main()
{
    std::vector<int> vec = {1, 2, 3, 4, 5};
    
    int sum = std::accumulate(vec.begin(), vec.end(), 0);

    std::cout <<  "sum: " << sum << std::endl;

    return 0;
}
```

输出结果

```shell
sum: 15
```

## inner_product

inner_product 函数用于计算两个容器中对应元素乘积的总和。

语法:

```cpp
template <InputIterator1 Iter1, InputIterator2 Iter2, class T>
T inner_product(Iter1 first1, Iter1 last1, Iter2 first2, T init);
```

示例

```cpp
#include <iostream>
#include <vector>
#include <numeric>

int main()
{
    std::vector<int> vec1 = {1, 2, 3};
    std::vector<int> vec2 = {2, 3, 4};
    
    int sum = std::inner_product(vec1.begin(), vec1.end(), vec2.begin(), 0);

    std::cout <<  "sum: " << sum << std::endl;

    return 0;
}
```

输出结果

```shell
sum: 20
```

## partial_sum

partial_sum 函数用于计算容器中元素的部分和，并将结果存储在另一个容器中。

语法:

```cpp
template <InputIterator InIter, OutputIterator OutIter>
OutIter partial_sum(InIter first, InIter last, OutIter result);
```

示例

```cpp
#include <iostream>
#include <vector>
#include <numeric>

int main()
{
    std::vector<int> vec1 = {1, 2, 3, 4};
    std::vector<int> vec2(vec1.size());
    
    std::partial_sum(vec1.begin(), vec1.end(), vec2.begin());

    for (int val : vec2) {
        std::cout << val << " ";
    }
    std::cout << std::endl;

    return 0;
}
```

输出结果

```shell
1 3 6 10 
```

## adjacent_difference

adjacent_difference 函数用于计算容器中相邻元素的差值，并将结果存储在另一个容器中。

语法:

```cpp
template <InputIterator InIter, OutputIterator OutIter>
OutIter adjacent_difference(InIter first, InIter last, OutIter result);
```

示例

```cpp
#include <iostream>
#include <vector>
#include <numeric>

int main()
{
    std::vector<int> vec1 = {1, 2, 3, 4};
    std::vector<int> result(vec1.size() - 1);
    
    std::adjacent_difference(vec1.begin(), vec1.end(), result.begin());

    for (int val : result) {
        std::cout << val << " ";
    }
    std::cout << std::endl;

    return 0;
}
```

输出结果

```shell
1 1 1 
```

## std::gcd

使用 std::gcd 计算两个整数的最大公约数：

示例

```cpp
#include <iostream>
#include <vector>
#include <numeric>

int main()
{
    int a = 21;
    int b = 14;
    int result = std::gcd(a, b);
    std::cout << "result: " << result << std::endl;

    return 0;
}
```

输出结果

```shell
# 需要使用c++20
$ g++ -std=c++20 demo.cpp -o demo && ./demo
result: 7
```

## std::lcm

使用 std::lcm 计算两个整数的最小公倍数

示例

```cpp
#include <iostream>
#include <vector>
#include <numeric>

int main()
{
    int a = 21;
    int b = 14;
    int result = std::lcm(a, b);
    std::cout << "result: " << result << std::endl;

    return 0;
}
```

输出结果

```shell
result: 42
```

## std::iota

使用 std::iota 填充范围内的序列值。

示例

```cpp
#include <iostream>
#include <vector>
#include <numeric>

int main()
{
    std::vector<int> vec(5);

    std::iota(vec.begin(), vec.end(), 1);

    for (int val : vec)
    {
        std::cout << val << " ";
    }
    std::cout << std::endl;

    return 0;
}
```

输出结果

```shell
1 2 3 4 5 
```

## min_element

min_element 函数用于找到容器中的最大值和最小值。

示例

```cpp
#include <iostream>
#include <vector>
#include <numeric>

int main()
{
    std::vector<int> vec = {1, 2, 3, 4, 5};

    int min_value = *std::min_element(vec.begin(), vec.end());

    std::cout << "result: " << min_value << std::endl;

    return 0;
}
```

输出结果

```shell
result: 1
```

## max_element

max_element 函数用于找到容器中的最大值和最小值。

示例

```cpp
#include <iostream>
#include <vector>
#include <numeric>

int main()
{
    std::vector<int> vec = {1, 2, 3, 4, 5};

    int max_value = *std::max_element(vec.begin(), vec.end());

    std::cout << "result: " << max_value << std::endl;

    return 0;
}
```

输出结果

```shell
result: 5
```
