
# 链表

```shell
node1->node2->node3 
```

示例1：静态链表

```cpp
#include <stdio.h>

typedef struct _Node {
    int data;
    struct _Node *next;
} Node;

int main() {
    // 声明3个节点
    Node node1, node2, node3;
    Node *head, *current;

    // 头节点指向node1
    head = &node1;
    current = head;

    // 3个节点赋初值
    node1.data = 1;
    node1.next = &node2;
    node2.data = 2;
    node2.next = &node3;
    node3.data = 3;
    node3.next = NULL;

    // 遍历链表
    while (current != NULL) {
        printf("%d\n", current->data);
        current = current->next;
    }

    return 0;
}

```


示例2：动态链表

```cpp
#include <stdio.h>
#include <stdlib.h>

typedef struct _Node {
    int data;
    struct _Node *next;
} Node;

Node *create_node(int data) {
    Node *node;

    node = (Node *) malloc(sizeof(Node));
    if (node == NULL) {
        return NULL;
    }

    node->data = data;
    node->next = NULL;

    return node;
}

void free_node_list(Node *head) {
    Node *temp;
    while (head != NULL) {
        temp = head->next;
        free(head);
        head = temp;
    }
}

int main() {
    // 声明3个节点
    Node *head, *current, *temp;

    // 头节点
    head = create_node(0);
    if (head == NULL) {
        return 0;
    }

    current = head;

    // 动态创建3个节点
    for (int i = 1; i < 4; i++) {
        temp = create_node(i);
        if (temp == NULL) {
            break;
        }
        current->next = temp;
        current = temp;
    }

    temp = NULL; // temp不再使用

    // 遍历链表
    current = head->next;
    while (current != NULL) {
        printf("%d\n", current->data);
        current = current->next;
    }

    // 释放链表
    free_node_list(head);

    return 0;
}

```