# gcc

gcc 常用参数

- `-I <dir>` 头文件`include` 搜索路径
- `-L <dir>` 动态库`library` 搜索路径
- `-g` 保留源码debug信息
- `-o <file>` 编译产物输出文件
- `-std=<value>` 语言标准库版本
- `-E` 仅预处理

查看帮助

```shell
gcc --help | less
```

## AddressSanitizer内存检测工具

gcc自带，无需额外安装

常见问题

```cpp
#include <stdlib.h>

// 越界访问
void stack_buffer_overflow()
{
    char buffer[1];
    int i = 10;
    buffer[i] = 'A'; // 访问越界
}

// 野指针
void use_after_free()
{
    char *text = (char *)malloc(sizeof(char) * 5);
    free(text);

    text[0] = '1'; // 访问已释放内存
}

// 内存泄漏
void leak_memory()
{
    char *text = (char *)malloc(sizeof(char) * 5);
}

```

示例

```cpp
// main.c
#include <stdlib.h>

// 野指针
void use_after_free()
{
    char *text = (char *)malloc(sizeof(char) * 5);
    free(text);

    text[0] = '1'; // 访问已释放内存
}

int main(int argc, char const *argv[])
{
    use_after_free();
    return 0;
}
```

运行就能输出对应的错误信息

```shell
$ gcc main.c -o main -fsanitize=address  -g && ./main

=================================================================
==25561==ERROR: AddressSanitizer: heap-use-after-free on address 0x6020000000d0 at pc 0x000109372ee1 bp 0x7ff7b6b8cef0 sp 0x7ff7b6b8cee8
WRITE of size 1 at 0x6020000000d0 thread T0
    #0 0x109372ee0 in use_after_free main.c:17
    #1 0x109372f2a in main main.c:28
    #2 0x7ff80bb45365 in start+0x795 (dyld:x86_64+0xfffffffffff5c365)

0x6020000000d0 is located 0 bytes inside of 5-byte region [0x6020000000d0,0x6020000000d5)
freed by thread T0 here:
    #0 0x109e18b69 in wrap_free+0xa9 (libclang_rt.asan_osx_dynamic.dylib:x86_64h+0xdcb69)
    #1 0x109372e9e in use_after_free main.c:15
    #2 0x109372f2a in main main.c:28
    #3 0x7ff80bb45365 in start+0x795 (dyld:x86_64+0xfffffffffff5c365)

previously allocated by thread T0 here:
    #0 0x109e18a20 in wrap_malloc+0xa0 (libclang_rt.asan_osx_dynamic.dylib:x86_64h+0xdca20)
    #1 0x109372e91 in use_after_free main.c:14
    #2 0x109372f2a in main main.c:28
    #3 0x7ff80bb45365 in start+0x795 (dyld:x86_64+0xfffffffffff5c365)

SUMMARY: AddressSanitizer: heap-use-after-free main.c:17 in use_after_free
Shadow bytes around the buggy address:
  0x601ffffffe00: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
  0x601ffffffe80: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
  0x601fffffff00: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
  0x601fffffff80: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
  0x602000000000: fa fa fd fd fa fa 00 00 fa fa 00 04 fa fa 00 00
=>0x602000000080: fa fa 00 04 fa fa 00 00 fa fa[fd]fa fa fa fa fa
  0x602000000100: fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa
  0x602000000180: fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa
  0x602000000200: fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa
  0x602000000280: fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa
  0x602000000300: fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa
Shadow byte legend (one shadow byte represents 8 application bytes):
  Addressable:           00
  Partially addressable: 01 02 03 04 05 06 07 
  Heap left redzone:       fa
  Freed heap region:       fd
  Stack left redzone:      f1
  Stack mid redzone:       f2
  Stack right redzone:     f3
  Stack after return:      f5
  Stack use after scope:   f8
  Global redzone:          f9
  Global init order:       f6
  Poisoned by user:        f7
  Container overflow:      fc
  Array cookie:            ac
  Intra object redzone:    bb
  ASan internal:           fe
  Left alloca redzone:     ca
  Right alloca redzone:    cb
==25561==ABORTING
zsh: abort      ./main
```
