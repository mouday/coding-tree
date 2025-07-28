# 最大子数组和

最大子数组和，也叫 Maximum Subarray。

我们会从暴力解法开始，逐步引出著名的 Kadane 算法，并通过“短线投资类比”深入理解它的动态规划思想。

- 最大子数组和问题的完整题意解析
- 枚举法的思路与代码实现
- Kadane 算法的核心思想与动态规划转移公式
- 手把手演示每一步状态变化
- Python 代码实现

## 题目

有一个整数数组，里面的数字有正有负，从中找出一段连续的子数组，让他们的和，尽可能大，返回这个最大和

> 注意：重点是连续，不能跳着选

举例

```cpp
[-2, 1, -3, 4, -1, 2, 1, -5, 4]

部分子数组：

[-2, 1, -3] = -5
[4] = 4
[4, -1, 2, 1] = 6 （最大值）
```

## 暴力枚举法

分析

```cpp
数组：[-2, 1, -3, 4]

所有连续子数组：
情况1：1个连续元素有4种： [-2],       [1],    [-3], [4]
情况2：2个连续元素有3种： [-2, 1],    [1, 3], [-3, 4]
情况3：3个连续元素有2种： [-2, 1, 3], [1, 3, -4]
情况4：4个连续元素有1种： [-2, 1, 3, 4]

共10种组合，最大值是4 = [4]
```

python实现

时间复杂度：O(n^2)

```python
def max_subarray(nums):
    if not nums:
        return None

    # float("-inf")用于表示负无穷大。这是一个特殊的浮点数值，表示比任何其他数字都小的值。
    max_sum = float("-inf")

    # 遍历所有可能的起点和终点
    for i in range(len(nums)):
        current_sum = 0
        # 计算从 i 到 j 的子数组和
        for j in range(i, len(nums)):
            current_sum += nums[j]
            max_sum = max(max_sum, current_sum)

    return max_sum


def main():
    nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]

    ret = max_subarray(nums)
    print("ret: {}".format(ret))


if __name__ == "__main__":
    main()
```

运行结果

```shell
$ python3 demo.py
ret: 6
```

## Kadane算法

投资收益类比

股价每天的涨跌记录在数组

- 正数代表盈利
- 负数代表亏损

```cpp
- + + - + -
```

想知道那一段连续交易能够带来最大的净收益

每天都有2个选择：

1. 继续持仓：把今天收益加到之前的收益上
2. 果断止损：放弃之前的亏损记录，从今天重新开始计算收益

Kadane算法核心公式：

```cpp
// 每一天的最大收益
current_sum = max(today, current_sum + today)

// 总的最大收益
max_sum = max(max_sum, current_sum)
```

今天的决策只取决于今天的表现和昨天的结果

要么继续累加，要么从今天重新开始

Kadane算法演示

```python
# 第1个数
[(-2), 1, -3, 4, -1, 2, 1, -5, 4]
current_sum = -2
max_sum = -2

# 第2个数
[-2, (1), -3, 4, -1, 2, 1, -5, 4]
current_sum = max(1, -2 + 1) = 1
max_sum = max(-2, 1) = 1

# 第3个数
[-2, 1, (-3), 4, -1, 2, 1, -5, 4]
current_sum = max(-3, 1 + (-3)) = -2
max_sum = max(1, -2) = 1

# 第4个数
[-2, 1, -3, (4), -1, 2, 1, -5, 4]
current_sum = max(4, -2 + 4)= 4
max_sum = max(1, 4) = 4

# 第5个数
[-2, 1, -3, 4, (-1), 2, 1, -5, 4]
current_sum = max(-1, 4 + (-1))= 3
max_sum = max(4, 3) = 4

# 第6个数
[-2, 1, -3, 4, -1, (2), 1, -5, 4]
current_sum = max(2, 3 + 2)= 5
max_sum = max(4, 5) = 5

# 第7个数
[-2, 1, -3, 4, -1, 2, (1), -5, 4]
current_sum = max(1, 5 + 1)= 6
max_sum = max(5, 6) = 6

# 第8个数
[-2, 1, -3, 4, -1, 2, 1, (-5), 4]
current_sum = max(-5, 6 + (-5))= 1
max_sum = max(6, 1) = 6

# 第9个数
[-2, 1, -3, 4, -1, 2, 1, -5, (4)]
current_sum = max(4, 1 + 4) = 5
max_sum = max(6, 5) = 6
```

最大子数组和是：6

Python代码实现

- 时间复杂度：`O(n^2)`
- 空间复杂度：`O(1)`

```python
def max_subarray(nums):
    if not nums:
        return None

    current_sum = nums[0]
    max_sum = current_sum

    for num in nums[1:]:
        # 每一天的最大收益
        current_sum = max(num, current_sum + num)

        # 总的最大收益
        max_sum = max(max_sum, current_sum)

    return max_sum


def main():
    nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]

    ret = max_subarray(nums)
    print("ret: {}".format(ret))


if __name__ == "__main__":
    main()
```

运行结果

```shell
python3 demo.py
ret: 6
```

## 总结

- 最优子结构：当前位置的最大和，只取决于前一个位置的状态
- 重叠子问题：每一步都做相同的计算逻辑
