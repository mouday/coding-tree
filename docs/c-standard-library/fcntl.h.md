# fcntl.h

头文件

```cpp
#include <fcntl.h>
```

## open

打开或创建文件

```cpp
/**
 * 参数
 *   pathname 文件路径
 *   flags 打开文件方式
 *   mode 当创建新文件时指定的文件权限，通常0644
 * 返回
 *   成功返回文件描述符
 *   失败返回-1，并设置errno
 */
int open(const char *pathname, int flags, .../* mode_t mode */);
```

flags打开文件方式可取值

|枚举值 | 描述
|-|-
O_RDONLY  | 只读
O_WRONLY | 只写
O_APPEND  | 追加写
O_CREAT | 如果不存在则创建

示例

```cpp
#include <unistd.h> // close
#include <fcntl.h>  // open
#include <stdio.h>  // perror

int main(int argc, char const *argv[])
{

   int fd = open("demo.txt", O_WRONLY | O_CREAT, 0644);

   if (fd == -1){
     perror("open");
     return 1;
   }

   close(fd);

    return 0;
}
```
