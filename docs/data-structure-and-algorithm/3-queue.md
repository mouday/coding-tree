
## 队列queue

队列是一个有序列表，可以用数组或者是链表实现
原则: 先入先出

应用：取号排队

数组实现队列示例
```java
package com.demo;

import java.util.Scanner;

/**
 * 数组实现队列
 */
class ArrayQueue {

    private int size; // 队列大小
    private int[] arr; // 队列数组实现

    private int rear = -1; // 队尾
    private int front = -1; // 队首

    public ArrayQueue(int size) {
        this.size = size;
        this.arr = new int[this.size];
    }

    /**
     * 判断对垒是否满
     */
    public boolean isFull() {
        return this.size == this.rear + 1;
    }

    /**
     * 判断队列是否空
     */
    public boolean isEmpty() {
        return this.front == this.rear;
    }

    /**
     * 数据入队
     */
    public boolean add(int data) {
        if (this.isFull()) {
            return false;
        }

        this.rear++;
        this.arr[this.rear] = data;
        return true;
    }

    /**
     * 数据出队
     */
    public int get() {
        if (this.isEmpty()) {
            throw new RuntimeException("Queue is Empty");
        }

        this.front++;
        return this.arr[this.front];
    }


    /**
     * 队首元素
     */
    public int head() {
        if (this.isEmpty()) {
            throw new RuntimeException("Queue is Empty");
        }

        return this.arr[this.front + 1];
    }

    /**
     * 显示队列全部元素
     */
    public void show() {
        for (int i = 0; i < this.size; i++) {
            System.out.printf("arr[%d] = %d\n", i, this.arr[i]);
        }
    }
}

public class ArrayQueueDemo {
    public static void main(String[] args) {

        ArrayQueue queue = new ArrayQueue(3);

        // 接收用户输入
        Scanner scanner = new Scanner(System.in);
        char key;

        boolean loop = true;
        while (loop) {
            // 菜单
            System.out.println("s(show): show queue");
            System.out.println("a(add): add data into queue");
            System.out.println("g(get): get data from queue");
            System.out.println("e(exit): exit");
            System.out.println("h(head): get head of queue");

            key = scanner.next().charAt(0);

            switch (key) {
                case 's':
                    queue.show();
                    break;
                case 'a':
                    int value = scanner.nextInt();
                    queue.add(value);
                    break;
                case 'g':
                    try {
                        System.out.println(queue.get());
                    } catch (RuntimeException e) {
                        System.out.println(e.getMessage());
                    }
                    break;
                case 'h':
                    try {
                        System.out.println(queue.head());
                    } catch (RuntimeException e) {
                        System.out.println(e.getMessage());
                    }
                    break;
                case 'e':
                    loop = false;
                    scanner.close();
                    break;
                default:
                    break;
            }
        }
        System.out.println("已退出");

    }
}

```

问题
1、目前数组不能被复用
2、改进成环形数组，取模实现

## 数组实现环形队列

思路分析
```
size = 3

=========================

0 <- front rear 
1
2

total = rear - front  = 0

=========================

add

0 <- front
1 <- rear
2

total = rear - front  = 1

=========================

add

0 <- front
1 
2 <- rear

total = rear - front  = 2

=========================

get 

0 
1 <- front
2 <- rear

total = rear - front = 1

=========================

add (rear + 1) % 3 = 0

0 <- rear
1 <- front
2 

total = [3 + (rear - front)] % 3 = 2

=========================

front 指向队首
rear  指向队尾下一个元素位置

empty: rear == front

计算rear 与front 距离，留出一个空位不存，和empty区分
full: (rear + 1) % 3  == front

将复数转为正数

(size + (rear - front)) % size 

(10 + 5 - 2) % 10 = 3 

(10 + 2 - 5) % 10 = 7

-2 -1 0 1 2
```

代码实现

```java
package com.demo;


import java.util.Scanner;

/**
 * 环形数组队列
 */
class CircleArrayQueue {

    private int size;

    private int front = 0; // 指向队首

    private int rear = 0; // 指向队尾下一个元素, 最后一个地址不存值

    private int[] arr;

    public CircleArrayQueue(int size) {
        this.size = size;
        this.arr = new int[this.size];
    }

    public boolean isFull() {
        return (this.rear + 1) % this.size == this.front;
    }
    
    public boolean isEmpty() {
        return this.front == this.rear;
    }

    public boolean add(int data) {
        if (this.isFull()) {
            return false;
        }
        this.arr[this.rear] = data;
        this.rear = (this.rear + 1) % this.size;
        return true;
    }

    public int get() {
        if (this.isEmpty()) {
            throw new RuntimeException("queue is empty");
        }
        int value = this.arr[this.front];

        this.front = (this.front + 1) % this.size;
        return value;
    }

    public int head() {
        if (this.isEmpty()) {
            throw new RuntimeException("queue is empty");
        }
        return this.arr[this.front];
    }

    public int total() {
        return (this.size + (this.rear - this.front)) % this.size;
    }

    public void show() {
        for (int i = this.front; i < this.front + this.total(); i++) {
            int point = i % this.size;
            System.out.printf("arr[%d] = %d\n", point, this.arr[point]);
        }
    }
}


public class CircleArrayQueueDemo {
    public static void main(String[] args) {
        CircleArrayQueue queue = new CircleArrayQueue(4);

        // 接收用户输入
        Scanner scanner = new Scanner(System.in);
        char key;

        boolean loop = true;
        while (loop) {
            // 菜单
            System.out.println("s(show): show queue");
            System.out.println("a(add): add data into queue");
            System.out.println("g(get): get data from queue");
            System.out.println("e(exit): exit");
            System.out.println("h(head): get head of queue");

            key = scanner.next().charAt(0);

            switch (key) {
                case 's':
                    queue.show();
                    break;
                case 'a':
                    int value = scanner.nextInt();
                    queue.add(value);
                    break;
                case 'g':
                    try {
                        System.out.println(queue.get());
                    } catch (RuntimeException e) {
                        System.out.println(e.getMessage());
                    }
                    break;
                case 'h':
                    try {
                        System.out.println(queue.head());
                    } catch (RuntimeException e) {
                        System.out.println(e.getMessage());
                    }
                    break;
                case 'e':
                    loop = false;
                    scanner.close();
                    break;
                default:
                    break;
            }
        }
        System.out.println("已退出");
    }
}

```
