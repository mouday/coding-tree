# 华为OD算法题

## 技术一面：购买出售股票

给你一个整数数组 prices ，其中 prices[i] 表示某支股票第 i 天的价格。
在每一天，你可以决定是否购买和/或出售股票。你在任何时候 最多 只能持有 一股 股票。你也可以先购买，然后在 同一天 出售。
返回 你能获得的 最大 利润 。


示例 1：
输入：prices = [7,1,5,3,6,4]
输出：7
解释：在第 2 天（股票价格 = 1）的时候买入，在第 3 天（股票价格 = 5）的时候卖出, 这笔交易所能获得利润 = 5 - 1 = 4 。
     随后，在第 4 天（股票价格 = 3）的时候买入，在第 5 天（股票价格 = 6）的时候卖出, 这笔交易所能获得利润 = 6 - 3 = 3 。
     总利润为 4 + 3 = 7 。

示例 2：
输入：prices = [1,2,3,4,5]
输出：4
解释：在第 1 天（股票价格 = 1）的时候买入，在第 5 天 （股票价格 = 5）的时候卖出, 这笔交易所能获得利润 = 5 - 1 = 4 。
     总利润为 4 。

示例 3：
输入：prices = [7,6,4,3,1]
输出：0
解释：在这种情况下, 交易无法获得正利润，所以不参与交易可以获得最大利润，最大利润为 0 。


解题示例
```java
package demo;

public class DemoTest {
 
    public static void main(String[] args) {
        int[] prices = new int[]{7,1,5,3,6,4};
        //int[] prices = new int[]{1, 2, 3, 4, 5};
        //int[] prices = new int[]{7,6,4,3,1};

        // 总利润
        int totalValue = 0;

        // 当前买入的索引
        int current = 0;

        // 可以卖出的索引
        int nextValueIndex = -1;

        for (int i = 0; i < prices.length; i++) {

            // 卖出
            if (nextValueIndex == i) {
                totalValue += prices[i] - current;
            }

            // 买入
            nextValueIndex = getNext(prices, i, prices[i]);

            if (nextValueIndex > -1) {
                current = prices[i];
            }
        }

        System.out.println(totalValue);
    }

    private static int getNext(int[] prices, int start, int price) {
        for (int i = start; i < prices.length; i++) {
            if (prices[i] > price) {
                return i;
            }
        }

        return -1;
    }
}

```


## 技术二面：青蛙上台阶

1、问题描述

一只青蛙可以一次跳 1 级台阶或一次跳 2 级台阶

例如:
- 跳上第 1 级台阶只有一种跳法：直接跳 1 级即可。
- 跳上第 2 级台阶有两种跳法：每次跳 1 级，跳两次；或者一次跳 2 级。

问要跳上第 n 级台阶有多少种跳法？

2、思考

不可变因素是青蛙一次可以跳一级台阶或者一次可以跳两级台阶 ，可变的因素是台阶有 n 级 。

分析 n 级台阶的可能性 。

No.1 :  n = 1  ( 一共一级台阶 ) 

答案：小青蛙只有一只跳法 。

No.2 :  n = 2 (一共两级台阶)

答案：青蛙有两种跳法 ，一级一级跳 ，二级跳 。

No.3 : n > 2 

此时有 n 个台阶 ，假设用函数 f(n) 表示总共跳的方法数 。

当小青蛙第一次跳一级台阶的话 ，则剩下的 n - 1 个 台阶 ，一共有 `f(n - 1)` 种跳法 。

当小青蛙第一次跳二级台阶的话 ，则剩下的 n - 2 个台阶 ，一共有 `f(n - 2)` 种跳法 。

所以结论就是 

```
f（n） = f( n -1 ) + f( n - 2)
```

验证一下 ，当 n = 1 时 ，f(n) = 1; 当 n = 2 时 ，f(n) = 2。


3、代码实现

递归实现

```java
public static int foo(int n) {
    if (n == 0) {
        // 边界值
        return 0;
    } else if (n == 1) {
        // 1级台阶
        return 1;
    } else if (n == 2) {
        // 2级台阶
        return 2;
    } else {
        // n级台阶
        return foo(n - 1) + foo(n - 2);
    }
}
```

代码优化

```java
public static int foo(int n) {
    if (n <= 3) {
        return n;
    } else {
        // n级台阶
        return foo(n - 1) + foo(n - 2);
    }
}
```

```java
public static int foo(int n) {
    if (n <= 3) {
        return n;
    }

    int first = 1, second = 2;
    int total = 0;

    for (int i = 3; i <= n; i++) {
        total = first + second;
        first = second;
        second = total;
    }

    return total;
}
```

1. [面试问题 —— 算法题](https://blog.csdn.net/qq_37492806/article/details/105411544)
2. [每日算法——最全青蛙跳台阶算法问题](https://blog.csdn.net/weixin_48622530/article/details/127311492)


## 技术三面：多少match

```
A=[5,5,1,2,3,3,4]
B=[3,3,4,5,6,7,8]
```

设match=0，如果`A[i]==B[j]`那么`match++`，问一共多少match？

要求至少用2种算法实现，算法复杂度`O（N+M）`或`O（nlogn）`，可以利用`O(N^2）`复杂度算法验证结果。

```java
package com.demo;

import java.util.*;

public class Demo {
    public static void method1() {
        int[] A = {5, 5, 1, 2, 3, 3, 4};
        int[] B = {3, 3, 4, 5, 6, 7, 8};
        int match = 0;

        for (int i = 0; i < A.length; i++) {
            for (int j = 0; j < B.length; j++) {
                if (A[i] == B[j]) {
                    match++;
                }
            }
        }

        System.out.println(match); // 7
    }


    public static void method2() {
        int[] A = {5, 5, 1, 2, 3, 3, 4};
        int[] B = {3, 3, 4, 5, 6, 7, 8};
        int match = 0;

        // 排序
        //Arrays.sort(B);

        // [3, 3, 4, 5, 6, 7, 8]
        System.out.println(Arrays.toString(B));

        // 将B数组放入hash map中，key是数值，value是数量
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < B.length; i++) {
            if(map.containsKey(B[i])){
                map.put(B[i], map.get(B[i]) + 1);
            } else{
                map.put(B[i], 1);
            }
        }

        for (int i = 0; i < A.length; i++) {
            //int index = 0;
            if(map.containsKey(A[i])){
                match+=map.get(A[i]);
            }
        }

        System.out.println(match); // 7

    }

    public static void main(String[] args) {
        method2();
    }
}
```