# vector

动态数组

## 修改数据

### push_back

将元素添加到容器末尾

```cpp
#include <iostream>
#include <vector>

int main() {
    std::vector<int> list;

    // 添加元素
    list.push_back(3);
    list.push_back(4);
    list.push_back(5);

    // 遍历
    for (int value: list) {
        std::cout << value << " ";
    }
    // 3 4 5 
}

```

### insert

插入元素到容器中的指定位置

```cpp
#include <iostream>
#include <vector>

int main() {
    std::vector<int> list = {3, 4, 5};

    // 下标为2的位置插入数据
    list.insert(list.begin() + 2, 10);

    for (int value: list) {
        std::cout << value << " ";
    }
    // 3 4 10 5
}

```

插入多个数据

```cpp
#include <iostream>
#include <vector>

int main() {
    std::vector<int> list = {3, 4, 5};

    // 下标为2的位置插入多个数据
    list.insert(list.begin() + 2, {10, 11, 12});

    for (int value: list) {
        std::cout << value << " ";
    }
    // 3 4 10 11 12 5 
}

```
### pop_back

移除容器的末元素

```cpp
#include <iostream>
#include <vector>

int main() {
    std::vector<int> list = {3, 4, 5};

    list.pop_back();

    // 遍历
    for (int value: list) {
        std::cout << value << " ";
    }
    // 3 4 
}

```

### clear

清除内容

```cpp
#include <iostream>
#include <vector>

int main() {
    std::vector<int> list = {3, 4, 5};

    // 清除内容
    list.clear();

    // 此时，没有任何输出
    for (int value: list) {
        std::cout << value << " ";
    }
}
```

### erase

从容器擦除指定的元素

```cpp
#include <iostream>
#include <vector>

int main() {
    std::vector<int> list = {3, 4, 5};

    // 清除内容
    list.erase(list.begin() + 1);

    for (int value: list) {
        std::cout << value << " ";
    }
    // 3 5
}

```

范围移除

```cpp
#include <iostream>
#include <vector>

int main() {
    std::vector<int> list = {3, 4, 5};

    // 清除内容 [0, 2)
    list.erase(list.begin(), list.begin() + 2);

    for (int value: list) {
        std::cout << value << " ";
    }
    // 5
}

```

## 访问数据

```cpp
#include <iostream>
#include <vector>

int main() {
    std::vector<int> list = {3, 4, 5};

    // 访问下标为1的元素
    std::cout << list[1] << std::endl; // 4
    std::cout << list.at(1) << std::endl; //4

    // 访问第一个元素
    std::cout << list.front() << std::endl; // 3

    // 访问最后一个元素
    std::cout << list.back() << std::endl; // 5
}

```

## 容器信息

### size

返回元素数

```cpp
#include <iostream>
#include <vector>

int main() {
    std::vector<int> list = {3, 4, 5};

    std::cout << list.size() << std::endl; // 3
}

```

### empty

检查容器是否为空

```cpp
#include <iostream>
#include <vector>

int main() {
    std::vector<int> list = {3, 4, 5};

    std::cout << list.empty() << std::endl; // 0

    list.clear();

    std::cout << list.empty() << std::endl; // 1
}

```

## 迭代数据

### for-in

```cpp
#include <iostream>
#include <vector>

int main() {
    std::vector<int> list = {3, 4, 5};

    // 遍历
    for (int value: list) {
        std::cout << value << " ";
    }
    // 3 4 5
}

```

### fori

```cpp
#include <iostream>
#include <vector>

int main() {
    std::vector<int> list = {3, 4, 5};

    for (int i = 0; i < list.size(); i++) {
        std::cout << list.at(i) << " ";
    }
    // 3 4 5
}

```

### iterator

```cpp
#include <iostream>
#include <vector>

int main() {
    std::vector<int> list = {3, 4, 5};

    for (std::vector<int>::iterator iter = list.begin(); iter != list.end(); iter++) {
        std::cout << *iter << " ";
    }
    // 3 4 5
}

```

## sort

默认从小到大排序

```cpp
#include <iostream>
#include <vector>

int main() {
    std::vector<int> list = {2, 4, 3, 5, 1};

    std::sort(list.begin(), list.end());

    for (int value: list) {
        std::cout << value << " ";
    }
    // 1 2 3 4 5 
}
```

自定义从大到小排序

```cpp
#include <iostream>
#include <vector>

/**
* 自定义排序函数
* 返回true 交换位置
* 返回false 不交换位置
*/
bool compare(int a, int b) {
    return a > b;
}

int main() {
    std::vector<int> list = {2, 4, 3, 5, 1};

    std::sort(list.begin(), list.end(), compare);

    for (int value: list) {
        std::cout << value << " ";
    }
    // 5 4 3 2 1 
}
```

## reverse

反转vector

```cpp
#include <iostream>
#include <vector>

int main() {
    std::vector<int> list = {2, 4, 3, 5, 1};

    std::reverse(list.begin(), list.end());

    for (int value: list) {
        std::cout << value << " ";
    }
    // 1 5 3 4 2 
}

```
## ref

https://www.runoob.com/cplusplus/cpp-libs-vector.html

https://zh.cppreference.com/w/cpp/container/vector
