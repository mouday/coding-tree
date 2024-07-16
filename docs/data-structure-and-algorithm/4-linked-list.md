
## 链表

链表 Linked List

链表是有序列表

存储结构
```
头指针head 110

地址 data域 next域
110   a1   130
120   a3   
130   a2   120 
```

单链表带头节点的逻辑结构
```
head ->[头节点|next]-> [data|next] -> [data|^]
```

小结：

- 链表以节点方法链式存储
- 每个节点包含data域、next域（指向下一个节点）
- 链表各节点不一定是连续存储的
- 链表分带头节点的链表和没有头节点的链表

head头节点
不存放数据，表示单链表的头

代码示例
```java
package com.demo.linkedlist;

public class SingleLinkedListDemo {
    public static void main(String[] args) {
        SingleLinkedList linkedList = new SingleLinkedList();

        Node node1 = new Node(1, "张飞");
        Node node2 = new Node(2, "刘备");
        Node node3 = new Node(3, "关羽");


        // 无序插入
        // linkedList.add(node1);
        // linkedList.add(node3);
        // linkedList.add(node2);

        // 有序插入
        linkedList.addByOrder(node1);
        linkedList.addByOrder(node3);
        linkedList.addByOrder(node2);

        Node node4 = new Node(2, "赵云");
        linkedList.update(node4);

        linkedList.delete(node1);

        linkedList.list();

    }
}


class SingleLinkedList {
    // 头节点不存实际数据
    private Node head = new Node(0, null);

    /**
     * 链表最后添加节点
     */
    public void add(Node node) {
        Node temp = head;

        // 查找链表尾部
        while (temp.next != null) {
            // 指针后移
            temp = temp.next;
        }

        // 最后一个节点
        temp.next = node;
    }

    /**
     * 按照大小排序
     */
    public boolean addByOrder(Node node) {
        Node temp = head;

        boolean flag = false; // 是否存在该节点

        while (temp.next != null) {
            // 判断数据是否存在
            if (temp.next.id == node.id) {
                flag = true;
                break;
            }
            // 找到数据插入位置
            else if (temp.next.id > node.id) {
                break;
            }
            temp = temp.next;
        }

        if (!flag) {
            // 修改指针指向
            node.next = temp.next;
            temp.next = node;
        }
        return !flag;
    }

    /**
     * 查找到指向节点的前一个节点
     * BeforeNode.next -> Node
     */
    public Node findBeforeNode(Node node) {
        Node temp = head;

        while (temp.next != null) {
            if (node.id == temp.next.id) {
                return temp;
            }
            temp = temp.next;
        }

        return null;
    }

    /**
     * 查找节点
     */
    public Node findNode(Node node){
        Node beforeNode = findBeforeNode(node);

        if(beforeNode != null){
            return beforeNode.next;
        } else{
            return null;
        }
    }
    /**
     * 修改节点
     */
    public boolean update(Node node) {
        Node beforeNode = findBeforeNode(node);

        if (beforeNode != null) {
            beforeNode.next.data = node.data;
            return true;
        } else {
            return false;
        }

    }

    /**
     * 删除节点 GC会自动清除没有被引用的对象
     */
    public boolean delete(Node node) {
        Node beforeNode = findBeforeNode(node);

        if (beforeNode != null) {
            beforeNode.next = beforeNode.next.next;
            return true;
        } else {
            return false;
        }
    }

    /**
     * 显示链表
     */
    public void list() {

        Node temp = head;

        // 遍历
        while (temp.next != null) {
            // 指针后移
            temp = temp.next;

            System.out.println(temp);
        }
    }
}


class Node {
    public int id;
    public String data;
    public Node next;

    public Node(int id, String data) {
        this.id = id;
        this.data = data;
    }

    @Override
    public String toString() {
        return "Node{" +
                "id=" + id +
                ", data='" + data + '\'' +
                '}';
    }
}
```

面试题

1、获取单链表的有效节点个数（如果有头节点，不统计）

```java
class SingleLinkedList {
    /**
     * 统计节点个数
     */
    public int length(){
        Node temp = head;
        int len = 0;

        while (temp.next != null){
            len ++;
            temp = temp.next;
        }
        return len;
    }
}
```

2、查找单链表中倒数第k个节点

思路：
（1）先遍历单链表，获得链表长度
（2）再遍历链表，得到第 (size-index) 个节点

```java
class SingleLinkedList {
    /**
     * 从链表尾部开始获取节点, index从0开始
     * 0 <= index < size
     */
    public Node findLastIndexNode(int index) {
        int size = this.length();

        // 如果链表长度为0
        if (size == 0) {
            return null;
        }

        // index校验
        if(index < 0 || index >= size){
            return null;
        }

        Node temp = head;

        //  head -> 1 -> 2 -> 3
        //  index   2    1    0

        // size index size-index
        //  3     0      3
        //  3     1      2
        //  3     2      1
        //  3     3      0  (null)

        for (int i = 0; i < size - index; i++) {
            temp = temp.next;
        }
        return temp;
    }
}
```

3、单链表反转

思路：
(1) 定义一个头节点
(2) 从头到尾遍历原来的链表，每遍历一个节点就将其取出，并放在新链表最前端
(3) 原来的链表的 head.next = reverseHead.next

```java
class SingleLinkedList {
    /**
     * 反转链表
     * head->1->2->3
     *
     * reverseHead
     * reverseHead->1
     * reverseHead->2->1
     * reverseHead->3->2->1
     */
    public void reverse(){

        // 如果链表长度为0或1则直接返回
        if(head.next == null || head.next.next == null){
            return;
        }

        // 定义临时节点
        Node reverseHead = new Node(0, null);
        Node current = head.next;
        Node next;

        while (current != null){
            // 保存下一个节点
            next = current.next;

            // 修改指向
            current.next  = reverseHead.next;
            reverseHead.next = current;

            // 后移
            current = next;
        }

        // 改变头接点指向
        head = reverseHead;
    }
}
```

4、从尾到头打印单链表

思路
（1）方式一：反向遍历，先将单链表进行反转，然后再遍历，不过会破坏数据结构，不建议
（2）方式二：利用栈的数据结构，将各个节点压入栈中，利用栈的【先入后出】特点

栈的基本使用

```java
package com.demo.stack;

import java.util.Stack;

public class StackDemo {
    public static void main(String[] args) {
        // 栈的基本使用
        Stack<String> stack = new Stack<>();
        stack.add("Tom");
        stack.add("Jack");
        stack.add("Steve");

        while (stack.size() > 0) {
            System.out.println(stack.pop());
            //    Steve Jack Tom
        }
    }
}

```

单链表逆序实现

```java
class SingleLinkedList {
    /**
     * 逆序打印
     */
    public void reverseList() {
        // 如果是空链表就直接返回
        if (head.next == null) {
            return;
        }

        Node current = head.next;
        Stack<Node> stack = new Stack<>();

        // 将节点压入栈中
        while (current != null){
            stack.push(current);
            current = current.next;
        }

        // 从栈中取出数据，先入后出，实现逆序输出
        while (stack.size() > 0){
            System.out.println(stack.pop());
        }
    }
}
```

5、合并两个有序链表，合并之后依然有序


```java
class SingleLinkedList {
  /**
     * 合并两个有序链表,合并之后依然有序
     * 
     * head->1->2->3
     * otherHead->2->4->6
     * 
     * newHead->1
     */
    public void concat(SingleLinkedList other) {
        if (other == null) {
            return;
        }

        // 新的头节点, 借助辅助链表
        Node newHead = new Node(0, null);
        Node newCurrent = newHead;

        Node current = head.next;
        Node otherCurrent = other.getHead().next;

        while (true) {
            // 4种组合
            // current == null  && otherCurrent == null break
            // current == null  && otherCurrent != null move left
            // current != null  && otherCurrent == null more right
            // current != null  && otherCurrent != null compare

            // 结束循环
            if (current == null && otherCurrent == null) {
                break;
            }
            // 其中一个是null, 另一个就直接后移追加
            else if (current == null) {
                // 保存下一个节点信息，并将当前节点下一个节点指向空
                newCurrent.next = otherCurrent;
                otherCurrent = otherCurrent.next;
            }
            // 另一个是null
            else if (otherCurrent == null) {
                newCurrent.next = current;
                current = current.next;
            }
            // 两个都不是null则比较大小
            else {
                if (current.id < otherCurrent.id) {
                    newCurrent.next = current;
                    current = current.next;
                } else {
                    newCurrent.next = otherCurrent;
                    otherCurrent = otherCurrent.next;
                }
            }
            // 新链表指针后移
            newCurrent = newCurrent.next;
        }

        // 修改指针指向
        head = newHead;
    }
}
```

## 双向链表

单向链表，查找方向只能是一个方向
双向链表，可以向前或者向后查找

单向链表，不能自我删除，需要靠辅助节点
双向链表，可以自我删除

增删改查思路：
```
遍历：可以向前，也可以向后
添加：默认添加到链表最后
temp.next = newNode
newNode.pre = temp
修改：~
删除：双向量表可以自我删除
temp.pre.next = temp.next
temp.next.pre = temp.pre
```

代码实现
```java
package com.demo.linkedlist;

public class DoubleLinkedListDemo {
    public static void main(String[] args) {
        DoubleLinkedList list = new DoubleLinkedList();
        DoubleNode node1 = new DoubleNode(1, "刘备");
        DoubleNode node2 = new DoubleNode(2, "曹操");
        DoubleNode node3 = new DoubleNode(3, "孙权");

        list.add(node1);
        list.add(node2);
        list.add(node3);

        list.delete(node3);

        node2.data = "司马懿";
        list.update(node2);

        list.list();

    }
}

class DoubleLinkedList {
    // 头节点
    private DoubleNode head = new DoubleNode(0, null);

    //添加节点
    public void add(DoubleNode node) {
        DoubleNode temp = head;

        while (temp.next != null) {
            temp = temp.next;
        }

        temp.next = node;
        node.pre = temp;
    }

    // 删除节点
    public void delete(DoubleNode node) {
        DoubleNode temp = head.next;

        while (temp != null) {
            if (temp.id == node.id) {
                temp.pre.next = temp.next;
                if (temp.next != null) {
                    temp.next.pre = temp.pre;
                }
                break;
            }
            temp = temp.next;
        }

    }

    // 查看链表
    public void list() {
        DoubleNode temp = head.next;
        while (temp != null){
            System.out.println(temp);
            temp = temp.next;
        }
    }

    // 更新节点
    public void update(DoubleNode node) {
        DoubleNode temp = head.next;

        while (temp != null) {
            if (temp.id == node.id) {
                temp.data = node.data;
            }
            temp = temp.next;
        }
    }
}

class DoubleNode {
    public int id;
    public String data;
    public DoubleNode pre;
    public DoubleNode next;

    public DoubleNode(int id, String data) {
        this.id = id;
        this.data = data;
    }

    @Override
    public String toString() {
        return "DoubleNode{" +
                "id=" + id +
                ", data='" + data + '\'' +
                '}';
    }
}

```

## 单向环形链表

1、约瑟夫Josepfu问题
设编号为1、2、...n的n个人围坐一圈，约定编号为k(1<=k<=n)的人从1开始报数，
数到m的那个人出列，他的下一位又从1开始报数，数到m的那个人又出列，以此类推，
直到所有人出列为止，由此产生一个出队编号的序列。

2、构建单向环形链表思路
先创建第一个节点，first指向该节点
创建新节点加入到环形链表

3、遍历环形链表
先让辅助指针指向first节点
然后while循环，结束标志current.next == first

```java
package com.demo.linkedlist;

public class JosepfuLinkedListDemo {
    public static void main(String[] args) {
        JosepfuLinkedList list = new JosepfuLinkedList();
        list.addBoys(5);
        list.showList();
        // 5个小孩，从第1个人开始，数2个数
        System.out.println("===出圈===");
        list.boyOut(1, 2);
        // 2->4->1->5->3

    }
}

/**
 * 约瑟夫问题环形链表
 */
class JosepfuLinkedList {
    private BoyNode first; // 头节点，指向第一个节点

    // 新建环形链表，编号从1开始
    public void addBoys(int num) {
        // 入参校验
        if(num < 1){
            System.out.println("require: num>0");
            return;
        }

        BoyNode last = null;  // 尾节点，指向最后一个节点，辅助指针

        BoyNode node;  // 新建的节点

        for (int i = 1; i < num + 1; i++) {
            node = new BoyNode(i);

            if (i == 1) {
                first = node;
                last = node;
            } else {
                last.next = node;
                last = node;
            }

            last.next = first;
        }
    }

    // 显示链表
    public void showList() {

        // 必要的入参校验
        if (first == null) {
            return;
        }

        BoyNode temp = first;

        while (true) {
            System.out.println(temp);

            if (temp.next == first) {
                break;
            }

            temp = temp.next;
        }
    }

    /**
     * 出圈顺序
     *
     * @param startNo  开始编号
     * @param countNum 报数
     */
    public void boyOut(int startNo, int countNum) {
        // 入参校验
        if (first == null || startNo < 1 || countNum < 1) {
            return;
        }

        BoyNode last = first; // 辅助节点

        // 将last.next 指向first
        while (last.next != first) {
            last = last.next;
        }

        // 移动到指定的开始位置
        for (int i = 0; i < startNo - 1; i++) {
            first = first.next;
            last = last.next;
        }

        // 报数出圈
        while (true) {
             // 只有一个节点退出
            if(first == last){
                break;
            }

            for (int i = 0; i < countNum - 1; i++) {
                first = first.next;
                last = last.next;
            }

            // 出圈
            System.out.println(first);

            first = first.next;
            last.next = first;
        }

        //  最后一个节点出圈
        System.out.println(first);


    }
}

class BoyNode {
    public int id;
    public BoyNode next;

    public BoyNode(int id) {
        this.id = id;
    }

    @Override
    public String toString() {
        return "BoyNode{" +
                "id=" + id +
                '}';
    }
}
```