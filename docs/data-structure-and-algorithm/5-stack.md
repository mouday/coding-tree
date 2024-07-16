## 栈

举例：计算表达式结果

```
7 * 2 * 2 - 5 + 1 - 5 + 3 -3
```

1、基本概念

栈 stack 先入后出（FILO first in last out）的有序列表

栈的插入和删除只能在线性表的同一端进行

栈顶：变化端(允许插入和删除)
栈底：固定端

出栈 pop、入栈 push

2、栈的应用场景

- 子程序的调用
- 递归调用
- 表达式转换（中缀表达式转后缀表达式）与求值
- 二叉树遍历
- 图的深度优先搜索算法 depth-first

3、实现栈的思路

1. 使用数组实现栈
2. 定义一个 top 表示栈顶，初始化 top=-1
3. 入栈操作，top++;stack[top]=data;
4. 出栈操作，data=stack[top];top--;

4、代码实现栈

```java
package com.demo.stack;

public class ArrayStackDemo {
    public static void main(String[] args) {
        ArrayStack stack = new ArrayStack(5);

        stack.push(1);
        stack.push(2);
        stack.push(3);
        stack.push(4);

        System.out.println(stack.pop());

        stack.list();

    }
}

class ArrayStack{
    private int maxSize;  // 栈容量
    private int top = -1; // 栈顶指针
    private int[] arr;    // 栈容器

    public ArrayStack(int maxSize) {
        this.maxSize = maxSize;
        this.arr = new int[this.maxSize];
    }

    // 判满
    public boolean isFull(){
        return this.top == this.maxSize - 1;
    }

    //判空
    public boolean isEmpty(){
        return this.top == -1;
    }

    // 入栈
    public boolean push(int data){
        if(this.isFull()){
            return false;
        }
        this.top++;
        this.arr[this.top] = data;
        return true;
    }

    // 出栈
    public int pop(){
        if(isEmpty()){
            throw new RuntimeException("stack is empty");
        }
        int data = arr[top];
        top--;
        return data;
    }

    // 显示栈内数据
    public void list(){
        if(isEmpty()){
            System.out.println("stack is empty");
            return;
        }

        int index = top;
        while (index > -1){
            System.out.printf("arr[%d] = %d\n", index, arr[index]);
            index--;
        }
    }
}

```

5、交互测试
```java
package com.demo.stack;

import java.util.Scanner;

public class ArrayStackDemo {
    public static void main(String[] args) {
        ArrayStack stack = new ArrayStack(5);

        Scanner scanner = new Scanner(System.in);
        String key = ""; // 接收输入值
        boolean loop = true; // 控制退出菜单

        while (loop) {
            System.out.println("show: 显示栈信息");
            System.out.println("exit: 退出程序");
            System.out.println("push: 入栈");
            System.out.println("pop: 出栈");

            key = scanner.nextLine();

            switch (key) {
                case "show":
                    stack.list();
                    break;
                case "push":
                    int data = scanner.nextInt();
                    stack.push(data);
                    break;
                case "pop":
                    try {
                        System.out.println(stack.pop());
                    } catch (Exception e){
                        System.out.println(e.getMessage());
                    }
                    break;
                case "exit":
                    scanner.close();
                    loop = false;
                    break;
                default:
                    break;
            }
        }
        System.out.println("bye~");

    }
}
```

6、用链表模拟栈

```java
package com.demo.stack;

public class LinkedListStackDemo {
    public static void main(String[] args) {
        LinkedListStack stack = new LinkedListStack();
        stack.add(1);
        stack.add(2);
        stack.add(3);
        stack.add(4);
        stack.add(5);

        stack.list();

        System.out.println(stack.pop());
        System.out.println(stack.pop());

        stack.list();
    }
}


class LinkedListStack {
    private StackNode top;

    // 链表无限扩充不会满
    // public boolean isFull(){}
    
    // 判空
    public boolean isEmpty() {
        return top == null;
    }
    
    // 出栈
    public int pop() {
        if (isEmpty()) {
            throw new RuntimeException("stack is empty");
        }
        int data = top.data;
        top = top.next;
        return data;
    }
    
    // 入栈
    public void add(int data) {
        StackNode node = new StackNode(data);
        node.next = top;
        top = node;
    }
    
    // 显示栈数据
    public void list() {
        StackNode temp = top;
        while (temp != null) {
            System.out.println(temp);
            temp = temp.next;
        }
    }
}

class StackNode {
    public int data;
    public StackNode next;

    public StackNode(int data) {
        this.data = data;
    }

    @Override
    public String toString() {
        return "StackNode{" +
                "data=" + data +
                '}';
    }
}
```

使用栈完成表达式计算

思路：

1. 通过index索引遍历表达式
2. 如果是数字，直接入数字栈
3. 如果是符号，分以下情况
    3.1. 如果当前符号栈为空，直接入栈
    3.2. 如果符号栈有操作符，就进行优先级比较：
        - 如果当前操作符的优先级小于或等于栈中的操作符，就从数栈中pop弹出两个数，从符号栈中弹出一个操作符，进行运算，计算结果入数栈，将当前操作符入符号栈
        - 如果当前操作符的优先级大于栈中的操作符，直接入符号栈
4. 当表达式扫描完毕，就顺序的从数栈和符号栈中pop出相应的数字和符号，并运算
5. 最后在数栈中只有一个数字，就是表达式的结果

验证：
```
3+2*6-2=13

数字栈：3
符号栈：

数字栈：3
符号栈：+

数字栈：3 2
符号栈：+

数字栈：3 2
符号栈：+ *

数字栈：3 2 6
符号栈：+ *

数字栈：3 2 6
符号栈：+ *

=》2 * 6 = 12

数字栈：3 12
符号栈：+ -

数字栈：3 12 2
符号栈：+ -

=》12 - 2 = 10

数字栈：3 10
符号栈：+

=》 3 + 10 = 13

数字栈：13
符号栈：

=》13
```

代码实现

```java
package com.demo.stack;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class CalculatorStackDemo {
    public static void main(String[] args) {
        // 数字栈和符号栈
        CalculatorStack<Integer> numberStack = new CalculatorStack<>();
        CalculatorStack<String> operatorStack = new CalculatorStack<>();

        String expression = "3+2*6-2";

        // 遍历表达式
        int index = 0;

        while (index < expression.length()) {
            String op = expression.substring(index, index + 1);
            System.out.println(op);

            // 处理操作符
            if (CalculatorUtil.isOperator(op)) {
                // 操作符栈为空直接入栈
                if (operatorStack.isEmpty()) {
                    operatorStack.push(op);
                }
                // 如果当前操作符的优先级小于或等于栈中的操作符，
                // 就从数栈中pop弹出两个数，从符号栈中弹出一个操作符，进行运算，
                // 计算结果入数栈，将当前操作符入符号栈
                else if (CalculatorUtil.priority(op) <= CalculatorUtil.priority(operatorStack.peek())) {
                    int num1 = numberStack.pop();
                    int num2 = numberStack.pop();
                    String stackOp = operatorStack.pop();
                    int ret = CalculatorUtil.calculate(num2, stackOp, num1);
                    numberStack.push(ret);
                    operatorStack.push(op);
                }
                // 如果当前操作符的优先级大于栈中的操作符，直接入符号栈
                else {
                    //可能是多位数
                    operatorStack.push(op);
                }

            }
            // 处理数字，数字直接入栈
            else {
                numberStack.push(Integer.parseInt(op));
            }

            index++;
        }

        // 清空符号栈
        while (!operatorStack.isEmpty()){
            int num1 = numberStack.pop();
            int num2 = numberStack.pop();
            String stackOp = operatorStack.pop();
            int ret = CalculatorUtil.calculate(num2, stackOp, num1);
            numberStack.push(ret);
        }

        System.out.println(numberStack.pop());
    }
}

class CalculatorUtil {
    // 判断是否为操作符，只支持简单的四则运算
    public static boolean isOperator(String c) {
        List<String> list = Arrays.asList("+", "-", "*", "/");
        return list.indexOf(c) > -1;
    }

    // 判断优先级
    public static int priority(String operator) {
        Map<String, Integer> map = new HashMap<>();
        map.put("*", 1);
        map.put("/", 1);
        map.put("+", 0);
        map.put("-", 0);

        return map.getOrDefault(operator, -1);
    }

    // 计算
    public static int calculate(int num1, String operator, int num2) {
        int ret;

        switch (operator) {
            case "+":
                ret = num1 + num2;
                break;
            case "-":
                ret = num1 - num2;
                break;
            case "*":
                ret = num1 * num2;
                break;
            case "/":
                ret = num1 / num2;
                break;
            default:
                throw new RuntimeException("don't parse operator");
        }

        return ret;
    }
}

class CalculatorStack<T> {
    private CalculatorNode<T> top;

    // 链表无限扩充不会满
    // public boolean isFull(){}

    // 判空
    public boolean isEmpty() {
        return top == null;
    }

    // 出栈
    public T pop() {
        if (isEmpty()) {
            throw new RuntimeException("stack is empty");
        }
        T data = top.data;
        top = top.next;
        System.out.println("pop: " + data);
        return data;
    }

    // 入栈
    public void push(T data) {
        CalculatorNode<T> node = new CalculatorNode<>(data);
        node.next = top;
        top = node;
        System.out.println("push: " + data);
    }

    // 栈顶数据
    public T peek() {
        if (isEmpty()) {
            return null;
        } else {
            return top.data;
        }
    }

    // 统计栈内数据个数
    public int length() {
        // 显示栈数据

        CalculatorNode<T> temp = top;
        int count = 0;
        while (temp != null) {
            count++;
            temp = temp.next;
        }
        return count;

    }

    // 显示栈数据
    public void list() {
        CalculatorNode<T> temp = top;
        while (temp != null) {
            System.out.println(temp);
            temp = temp.next;
        }
    }
}

class CalculatorNode<T> {
    public T data;
    public CalculatorNode<T> next;

    public CalculatorNode(T data) {
        this.data = data;
    }

    @Override
    public String toString() {
        return "StackNode{" +
                "data=" + data +
                '}';
    }
}
```

## 前缀、中缀、后缀表达式

前缀表达式（波兰表达式）
后缀表达式（逆波兰表达式）

举例：
```
(3+4)x5-6

前缀表达式
-x+ 3 4 5 6

```














