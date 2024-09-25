# 数组

- 相同数据类型
- 连续内存空间
- 下标从零开始

## 1、一维数组定义

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

声明数组方式三

```cpp
#include <iostream>

using namespace std;

int main() {
    // 数据类型 数组名[] = {值1, 值2, ...};
    int arr[] = {10, 20, 30, 40, 50};

    // 访问数组元素
    for (int i = 0; i < 5; i++) {
        cout << arr[i] << endl;
    }
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

## 2、一维数组名

数组名的用途

- 统计整个数组内存中的长度
- 获取数组在内存中的首地址
- 数组名是常量，不可以赋值

访问数组首地址

```cpp
#include <iostream>

using namespace std;

int main() {
    int arr[5] = {10, 20, 30, 40, 50};

    // 访问数组首地址
    cout << arr << endl;     // 0x7ff7b8e7b7f0
    cout << &arr[0] << endl; // 0x7ff7b8e7b7f0
}

```

计算数组长度

```cpp
#include <iostream>

using namespace std;

int main() {
    int arr[5] = {10, 20, 30, 40, 50};

    // 统计整个数组内存中的长度
    cout << sizeof(arr) << endl;     // 20
    cout << sizeof(arr[0]) << endl; // 4
    cout << sizeof(arr) / sizeof(arr[0]) << endl; // 5
}

```


## 一维数组示例

### 示例1：找最大值

```cpp
#include <iostream>

using namespace std;

int main() {
    int arr[5] = {3, 4, 8, 9, 5};
    int max = 0;

    for (int i = 0; i < 5; i++) {
        if (arr[i] > max) {
            max = arr[i];
        }
    }

    cout << max << endl; // 9
}

```

### 示例2：数组元素逆序

```cpp
#include <iostream>

using namespace std;

int main() {
    int arr[5] = {3, 4, 8, 9, 5};

    int start = 0; // 起始下标
    int end = sizeof(arr) / sizeof(arr[0]) - 1; // 结束下标
    int temp; // 中间变量

    // 数组逆序
    while (start <= end) {
        // swap
        temp = arr[start];
        arr[start] = arr[end];
        arr[end] = temp;

        // 移动下标
        start++;
        end--;
    }

    // 输出
    for (int i = 0; i < 5; i++) {
        cout << arr[i] << " ";
    }
    // 5 9 8 4 3
}

```

### 示例3：冒泡排序

使用冒泡排序实现数组升序排列

```cpp
#include <iostream>

using namespace std;

int main() {
    int arr[10] = {4, 2, 8, 0, 5, 7, 1, 3, 9, 6};

    int is_swap; // 记录是否有交换

    // 排序轮次：元素个数 - 1
    for (int i = 0; i < 10 - 1; i++) {
        is_swap = 0;

        // 比对次数：元素个数 - 当前轮次 - 1
        for (int j = 0; j < 10 - i - 1; j++) {

        	// 如果第一个元素比第二个元素大，就交换
            if (arr[j] > arr[j + 1]) {
                // swap
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
                is_swap = 1;
            }
        }

        // 如果数组有序了，就不会发生交换
        if(!is_swap) {
            break;
        }
    }

    // 输出
    for (int i = 0; i < 10; i++) {
        cout << arr[i] << " ";
    }
    // 0 1 2 3 4 5 6 7 8 9 
}

```

## 二维数组定义

定义方式

```cpp
数据类型 数组名[行数][列数];

数据类型 数组名[行数][列数] = {{值1, 值2}, {值3, 值4}};

数据类型 数组名[行数][列数] = {值1, 值2, 值3, 值4};

数据类型 数组名[][列数] = {值1, 值2, 值3, 值4};
```

方式一

```cpp
#include <iostream>

using namespace std;

int main() {
    // 数据类型 数组名[行数][列数];
    int arr[2][3];

    arr[0][0] = 1;
    arr[0][1] = 2;
    arr[0][2] = 3;
    arr[1][0] = 4;
    arr[1][1] = 5;
    arr[1][2] = 6;
    
    for (int i = 0; i < 2; i++) {
        for (int j = 0; j < 3; j++) {
            cout << arr[i][j] << " ";
        }
        cout << endl;
    }
}
```

输出

```bash
1 2 3 
4 5 6 
```

方式二（推荐）

```cpp
#include <iostream>

using namespace std;

int main() {
    // 数据类型 数组名[行数][列数] = {{值1, 值2}, {值3, 值4}};
    int arr[2][3] = {
        {1, 2, 3},
        {4, 5, 6}
    };

    for (int i = 0; i < 2; i++) {
        for (int j = 0; j < 3; j++) {
            cout << arr[i][j] << " ";
        }
        cout << endl;
    }
}

```

输出

```bash
1 2 3 
4 5 6 
```

方式三

```cpp
#include <iostream>

using namespace std;

int main() {
    // 数据类型 数组名[行数][列数] = {值1, 值2, 值3, 值4};
    int arr[2][3] = {1, 2, 3, 4, 5, 6};

    for (int i = 0; i < 2; i++) {
        for (int j = 0; j < 3; j++) {
            cout << arr[i][j] << " ";
        }
        cout << endl;
    }
}

```

输出

```bash
1 2 3 
4 5 6 
```

方式四

```cpp
#include <iostream>

using namespace std;

int main() {
    // 数据类型 数组名[][列数] = {值1, 值2, 值3, 值4};
    int arr[][3] = {1, 2, 3, 4, 5, 6};

    for (int i = 0; i < 2; i++) {
        for (int j = 0; j < 3; j++) {
            cout << arr[i][j] << " ";
        }
        cout << endl;
    }
}

```
输出

```bash
1 2 3 
4 5 6 
```

## 二维数组数组名

作用：
- 查看占用空间大小
- 获取二维数组首地址

查看占用空间大小

```cpp

#include <iostream>

using namespace std;

int main() {
    int arr[2][3] = {
        {1, 2, 3},
        {4, 5, 6}
    };

    cout << "arr占用空间：" << sizeof(arr) << endl;
    cout << "arr第一行占用空间：" << sizeof(arr[0]) << endl;
    cout << "arr第一个元素占用空间：" << sizeof(arr[0][0]) << endl;
    cout << "arr行数：" << sizeof(arr) / sizeof(arr[0]) << endl;
    cout << "arr列数：" << sizeof(arr[0]) / sizeof(arr[0][0]) << endl;
}

```

输出

```bash
arr占用空间：24
arr第一行占用空间：12
arr第一个元素占用空间：4
arr行数：2
arr列数：3
```

获取二维数组首地址

```cpp

#include <iostream>

using namespace std;

int main() {
    int arr[2][3] = {
        {1, 2, 3},
        {4, 5, 6}
    };

    cout << "arr首地址：" << arr << endl;
    cout << "arr第一行首地址：" << arr[0] << endl;
    cout << "arr第一个元素地址：" << &arr[0][0] << endl;

}

```

```
arr首地址：0x7ff7b44d07f0
arr第一行首地址：0x7ff7b44d07f0
arr第一个元素地址：0x7ff7b44d07f0
```

## 二维数组示例

### 示例：计算总成绩

计算三名同学各自的总成绩

| 姓名 | 语文 | 数学 |  英语 |
|-|-|-| - |
| 张三 |100| 100 | 100| 
| 李四 |90 |50 |100| 
| 王五 |60 |70 | 80  | 

```cpp
#include <iostream>

using namespace std;

int main() {
    // 分数
    int scores[3][3] = {
        {100, 100, 100},
        {90, 50, 100},
        {60, 70, 80}
    };

    string names[3] = {"张三", "李四", "王五"};

    for (int i = 0; i < 3; i++) {
        int sum = 0;
        for (int j = 0; j < 3; j++) {
            sum += scores[i][j];
        }
        cout << names[i] << " 分数:" << sum << endl;
    }
}

```

输出

```shell
张三 分数:300
李四 分数:240
王五 分数:210
```