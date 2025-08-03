# 零钱兑换（Coin Change）

## 问题描述

给定不同面额的硬币和一个总金额，计算凑出总金额所需的最少硬币个数

如果凑不出来，返回-1，

假设：硬币数量不限

举例：

```cpp
硬币面额：1 2 5
总金额：11

方案1：5 + 5 + 1    （最优解）
方案2：5 + 2 + 2 + 2
```

## 贪心算法

贪心算法：每次都选择面额最大的硬币

```cpp
情况1
硬币面额：1 2 5
总金额：11
11 = 5 + 5 + 1 （最优解）

情况2
硬币面额：1 3 4
总金额：6
4 + 1 + 1  （贪心算法解）
3 + 3      （最优解）
```

贪心算法不适合求解类问题

## 动态规划（自底向上-表格法）

硬币面额：1 2 5

| 总金额 | 硬币数 | 硬币组合
|-|- |-
0 | 0 | -
1 | 1 | 1
2 | 1 | 2
3 | 2 | 2 + 1
4 | 2 | 2 + 2
5 | 1 | 5
6 | 2 | 5 + 1
7 | 2 | 5 + 2
8 | 3 | 5 + 2 + 1
9 | 3 | 5 + 2 + 2
10 | 2 | 5 + 5
11 | 3 | 5 + 5 + 1

求解方程：

```cpp
dp[i] = min(
    (dp[i - coin] + 1)
    for coin in coins 
    if i - coin >= 0
)
```

代码实现

时间复杂度 `O(n^2)`
空间复杂度 `O(n)`

```python
def coin_change(coins, amount):
    # 入参校验
    if amount <= 0:
        return -1

    # 所有值都设置为-1，表示未计算
    dp = [-1] * (amount + 1)
    dp[0] = 0

    for i in range(1, amount + 1):
        for coin in coins:
            # 目标金额小于硬币金额无解
            if i < coin:
                continue

            # 第一次进入直接赋值，之后在做比较取最小值
            if dp[i] == -1:
                dp[i] = dp[i - coin] + 1
            else:
                dp[i] = min(dp[i], dp[i - coin] + 1)

    return dp[amount]


def main():
    coins = [5, 2, 1]
    amount = 11

    ret = coin_change(coins, amount)
    print("ret: {}".format(ret))


if __name__ == "__main__":
    main()

```

运行结果

```shell
% python3 demo.py
ret: 3
```

动态规划（自顶向下-递归）

代码实现

时间复杂度 `O(n^2)`
空间复杂度 `O(n)`

def coin_change(coins, amount):
    if amount <= 0:
        return -1

    res = -1
    for coin in coins:
        if amount < coin: 
            # case1: 金额比硬币面额小，跳过
            continue
        elif amount == coin: 
            # case2: 金额等于硬币面额，直接返回1
            return 1

        # case3: 金额大于硬币面额，递归计算剩余金额
        sub_res = coin_change(coins, amount - coin)
        if sub_res == -1:
            continue

        # 如果res还未被赋值，或者当前子结果小于res，则更新res
        if res == -1:
            res = sub_res + 1
        else:
            res = min(res, sub_res + 1)

    return res


def main():
    coins = [5, 2, 1]
    amount = 11

    ret = coin_change(coins, amount)
    print("ret: {}".format(ret))


if __name__ == "__main__":
    main()


运行结果

```shell
python3 demo.py
ret: 3


动态规划（自顶向下-递归+记忆化）

def coin_change_helper(coins, total_amount):

    # 使用字典来缓存已经计算过的子问题结果
    memo = {}

    def coin_change(amount):
        # 如果计算过，直接返回，不再重复计算
        if amount in memo:
            return memo[amount]

        if amount <= 0:
            return -1

        res = -1
        for coin in coins:
            if amount == coin:
                # case1: 金额等于硬币面额，直接返回1
                return 1
            elif amount < coin:
                # case2: 金额比硬币面额小，跳过
                continue

            # case3: 金额大于硬币面额，递归计算剩余金额
            sub_res = coin_change(amount - coin)
            if sub_res == -1:
                continue

            # 如果res还未被赋值，或者当前子结果小于res，则更新res
            if res == -1:
                res = sub_res + 1
            else:
                res = min(res, sub_res + 1)

        memo[amount] = res
        return res

    return coin_change(total_amount)


def main():
    coins = [5, 2, 1]
    amount = 11

    ret = coin_change_helper(coins, amount)
    print("ret: {}".format(ret))


if __name__ == "__main__":
    main()


python3 demo.py
ret: 3




## 总结：

动态规划核心思想：重叠子问题 + 最优子结构