# 5、数组

- 相同数据类型
- 连续内存空间

## 1、数组定义

```cpp
数据类型 数组名[数组长度];

数据类型 数组名[数组长度] = {值1, 值2, ...};

数据类型 数组名[] = {值1, 值2, ...};
```



声明数组方式一

```cpp
#include <iostream>

using namespace std;

int main() {
    // 数据类型 数组名[数组长度];
    int arr[5];

    // 数组元素赋值，下表从0开始
    arr[0] = 10;
    arr[1] = 20;
    arr[2] = 30;
    arr[3] = 40;
    arr[4] = 50;

    // 访问数组元素
    cout << arr[0] << endl;
    cout << arr[1] << endl;
    cout << arr[2] << endl;
    cout << arr[3] << endl;
    cout << arr[4] << endl;
}

```

输出

```bash
10
20
30
40
50
```

声明数组方式二

```cpp
#include <iostream>

using namespace std;

int main() {
    // 数据类型 数组名[数组长度] = {值1, 值2, ...};
    int arr[5] = {10, 20, 30, 40, 50};

    // 访问数组元素
    cout << arr[0] << endl;
    cout << arr[1] << endl;
    cout << arr[2] << endl;
    cout << arr[3] << endl;
    cout << arr[4] << endl;
}

```


输出

```bash
10
20
30
40
50
```
