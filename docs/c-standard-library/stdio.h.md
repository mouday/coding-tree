# stdio.h

## 通用宏

```cpp
#define	EOF	(-1)

typedef	struct __sFILE {
	unsigned char *_p;	/* current position in (some) buffer */
	int	_r;		/* read space left for getc() */
	int	_w;		/* write space left for putc() */
	short	_flags;		/* flags, below; this FILE is free if 0 */
	short	_file;		/* fileno, if Unix descriptor, else -1 */
	struct	__sbuf _bf;	/* the buffer (at least 1 byte, if !NULL) */
	int	_lbfsize;	/* 0 or -_bf._size, for inline putc */

	/* operations */
	void	*_cookie;	/* cookie passed to io functions */
	int	(* _Nullable _close)(void *);
	int	(* _Nullable _read) (void *, char *, int);
	fpos_t	(* _Nullable _seek) (void *, fpos_t, int);
	int	(* _Nullable _write)(void *, const char *, int);

	/* separate buffer for long sequences of ungetc() */
	struct	__sbuf _ub;	/* ungetc buffer */
	struct __sFILEX *_extra; /* additions to FILE to not break ABI */
	int	_ur;		/* saved _r when _r is counting ungetc data */

	/* tricks to meet minimum requirements even when malloc() fails */
	unsigned char _ubuf[3];	/* guarantee an ungetc() buffer */
	unsigned char _nbuf[1];	/* guarantee a getc() buffer */

	/* separate buffer for fgetln() when line crosses buffer boundary */
	struct	__sbuf _lb;	/* buffer for fgetln() */

	/* Unix stdio files get aligned to block boundaries on fseek() */
	int	_blksize;	/* stat.st_blksize (may be != _bf._size) */
	fpos_t	_offset;	/* current lseek offset (see WARNING) */
} FILE;
```

## fopen

使用给定的模式 mode 打开 filename 所指向的文件。

```cpp
/**
 * 参数:
 *   filename -- 字符串，表示要打开的文件名称。
 *   mode -- 字符串，表示文件的访问模式，
 * 返回值
 *   该函数返回一个 FILE 指针。否则返回 NULL，且设置全局变量 errno 来标识错误。
 */
FILE *fopen(const char *filename, const char *mode)
```

mode 可以是以下表格中的值：

|模式	| 作用 | 描述
|-|- |-
r	| 只读 | read, 打开一个用于读取的文件。该文件`必须存在`
w	| 只写 | write, 若文件存在则文件长度清为0，即该文件内容会消失。若文件不存在则建立该文件
a	| 追加写 | append, 追加到一个文件。写操作向文件末尾追加数据。如果文件不存在，则创建文件。

可选组合：

`t`表示打开文件的类型是文本文件text（默认）
`+`号表示对文件既可以读也可以写
`b`表示以二进制模式打开文件binary

```cpp
#include <stdio.h>

int main(int argc, char **argv) {
    FILE *file = fopen("demo.txt", "w");

    fprintf(file, "%s\n", "hello world");

    fclose(file);

    return 0;
}
```

读取写入的文件

```cpp
#include <stdio.h>

int main(int argc, char **argv)
{
    FILE *file = fopen("demo.txt", "r");
    int ch;

    while (1)
    {
        ch = fgetc(file);
        if (feof(file))
        {
            break;
        }
        printf("%c", ch);
    }

    fclose(file);

    return 0;
}
```


## fclose

关闭流 stream。刷新所有的缓冲区。

```cpp
/**
 * 参数:
 *   stream -- 指向 FILE 对象的指针
 * 
 * 返回值
 *   成功 返回 0
 *   失败 返回 EOF
 */
int fclose(FILE *stream)
```

示例

```cpp
#include <stdio.h>

int main(int argc, char **argv) {
    FILE *file = fopen("demo.txt", "w");

    fprintf(file, "%s\n", "hello world");

    fclose(file);

    return 0;
}
```

## feof

测试给定流 stream 的文件结束标识符。

```cpp
/**
 * 参数
 *   stream -- 指向 FILE 对象的指针
 * 返回值
 *   当设置了与流关联的文件结束标识符时，该函数返回一个非零值，否则返回零。
 */
int feof(FILE *stream)
```

示例

```cpp
#include <stdio.h>

int main(int argc, char **argv)
{
    FILE *file = fopen("demo.txt", "r");
    int ch;

    while (1)
    {
        ch = fgetc(file);

        if (feof(file))
        {
            printf("EOF: %d\n", feof(file));
            // EOF: 1
            break;
        }
    }

    fclose(file);

    return 0;
}

```

## ferror

测试给定流 stream 的错误标识符。

```cpp
/**
 * 参数
 *   stream -- 指向 FILE 对象的指针
 * 返回值
 *   如果设置了与流关联的错误标识符，该函数返回一个非零值，否则返回一个零值。
 */
int ferror(FILE *stream)
```

示例

假设我们有一个文本文件 demo.txt，它是一个空文件。

因为试图读取一个以只写模式打开的文件，这将产生以下结果。

```cpp
#include <stdio.h>

int main(int argc, char **argv)
{
    FILE *file = fopen("demo.txt", "w");
    int ch;

    ch = fgetc(file);

    if (ferror(file))
    {
        printf("ferror: %d\n", ferror(file));
        // ferror: 1
    }

    fclose(file);

    return 0;
}

```

## clearerr

清除给定流 stream 的文件结束和错误标识符。

```cpp
/**
 * 参数
 *   stream -- 指向 FILE 对象的指针
 * 返回值
 *   这不会失败，且不会设置外部变量 errno，
 *   但是如果它检测到它的参数不是一个有效的流，则返回 -1，并设置 errno 为 EBADF。
 */
void clearerr(FILE *stream)
```

示例

假设我们有一个文本文件 demo.txt，它是一个空文件。

因为试图读取一个以只写模式打开的文件，这将产生以下结果。

```cpp
#include <stdio.h>

int main(int argc, char **argv)
{
    FILE *file = fopen("demo.txt", "w");
    int ch;

    ch = fgetc(file);

    if (ferror(file))
    {
        printf("ferror1: %d\n", ferror(file));
        // ferror1: 1
    }
    
    clearerr(file);

    if (ferror(file))
    {
        printf("ferror2: %d\n", ferror(file));
        // 该语句无输出
    }

    fclose(file);

    return 0;
}
```


```cpp
// 使用给定的模式 mode 打开 filename 所指向的文件。
FILE *fopen(const char *filename, const char *mode)

// 把 ptr 所指向的数组中的数据写入到给定流 stream 中。
size_t fwrite(const void *ptr, size_t size, size_t nmemb, FILE *stream)

// 发送格式化输出到流 stream 中。
int fprintf(FILE *stream, const char *format, ...)

// 关闭流 stream。刷新所有的缓冲区。
int fclose(FILE *stream)

// 把一个描述性错误消息输出到标准错误 stderr。
// 首先输出字符串 str，后跟一个冒号，然后是一个空格。
void perror(const char *str)
```

## 常用示例

文件写入

```cpp
#include <stdio.h>

int main(int argc, char **argv) {
    FILE *file = fopen("demo.txt", "r");
    if (file == NULL) {
        perror("fopen");
    }

    fprintf(file, "hello world\n");

    fclose(file);

    return 0;
}

```

文件读取

```cpp
#include <stdio.h>

int main(int argc, char **argv) {
    FILE *file = fopen("demo.txt", "r");
    if (file == NULL) {
        perror("fopen");
    }

    char buffer[50];
    while (fgets(buffer, sizeof(buffer), file) != NULL) {
        printf("%s", buffer);
    }

    fclose(file);

    return 0;
}

```





5	int fflush(FILE *stream)
刷新流 stream 的输出缓冲区。
6	int fgetpos(FILE *stream, fpos_t *pos)
获取流 stream 的当前文件位置，并把它写入到 pos。

8	size_t fread(void *ptr, size_t size, size_t nmemb, FILE *stream)
从给定流 stream 读取数据到 ptr 所指向的数组中。
9	FILE *freopen(const char *filename, const char *mode, FILE *stream)
把一个新的文件名 filename 与给定的打开的流 stream 关联，同时关闭流中的旧文件。
10	int fseek(FILE *stream, long int offset, int whence)
设置流 stream 的文件位置为给定的偏移 offset，参数 offset 意味着从给定的 whence 位置查找的字节数。
11	int fsetpos(FILE *stream, const fpos_t *pos)
设置给定流 stream 的文件位置为给定的位置。参数 pos 是由函数 fgetpos 给定的位置。
12	long int ftell(FILE *stream)
返回给定流 stream 的当前文件位置。

14	int remove(const char *filename)
删除给定的文件名 filename，以便它不再被访问。
15	int rename(const char *old_filename, const char *new_filename)
把 old_filename 所指向的文件名改为 new_filename。
16	void rewind(FILE *stream)
设置文件位置为给定流 stream 的文件的开头。
17	void setbuf(FILE *stream, char *buffer)
定义流 stream 应如何缓冲。
18	int setvbuf(FILE *stream, char *buffer, int mode, size_t size)
另一个定义流 stream 应如何缓冲的函数。
19	FILE *tmpfile(void)
以二进制更新模式(wb+)创建临时文件。
20	char *tmpnam(char *str)
生成并返回一个有效的临时文件名，该文件名之前是不存在的。

22	int printf(const char *format, ...)
发送格式化输出到标准输出 stdout。
23	int sprintf(char *str, const char *format, ...)
发送格式化输出到字符串。
24	int vfprintf(FILE *stream, const char *format, va_list arg)
使用参数列表发送格式化输出到流 stream 中。
25	int vprintf(const char *format, va_list arg)
使用参数列表发送格式化输出到标准输出 stdout。
26	int vsprintf(char *str, const char *format, va_list arg)
使用参数列表发送格式化输出到字符串。
27	int fscanf(FILE *stream, const char *format, ...)
从流 stream 读取格式化输入。
28	int scanf(const char *format, ...)
从标准输入 stdin 读取格式化输入。
29	int sscanf(const char *str, const char *format, ...)
从字符串读取格式化输入。
30	int fgetc(FILE *stream)
从指定的流 stream 获取下一个字符（一个无符号字符），并把位置标识符往前移动。

## fgets

31	char *fgets(char *str, int n, FILE *stream)
从指定的流 stream 读取一行，并把它存储在 str 所指向的字符串内。当读取 (n-1) 个字符时，或者读取到换行符时，或者到达文件末尾时，它会停止，具体视情况而定。
32	int fputc(int char, FILE *stream)
把参数 char 指定的字符（一个无符号字符）写入到指定的流 stream 中，并把位置标识符往前移动。
33	int fputs(const char *str, FILE *stream)
把字符串写入到指定的流 stream 中，但不包括空字符。
34	int getc(FILE *stream)
从指定的流 stream 获取下一个字符（一个无符号字符），并把位置标识符往前移动。
35	int getchar(void)
从标准输入 stdin 获取一个字符（一个无符号字符）。
36	char *gets(char *str)
从标准输入 stdin 读取一行，并把它存储在 str 所指向的字符串中。当读取到换行符时，或者到达文件末尾时，它会停止，具体视情况而定。
37	int putc(int char, FILE *stream)
把参数 char 指定的字符（一个无符号字符）写入到指定的流 stream 中，并把位置标识符往前移动。
38	int putchar(int char)
把参数 char 指定的字符（一个无符号字符）写入到标准输出 stdout 中。
39	int puts(const char *str)
把一个字符串写入到标准输出 stdout，直到空字符，但不包括空字符。换行符会被追加到输出中。
40	int ungetc(int char, FILE *stream)
把字符 char（一个无符号字符）推入到指定的流 stream 中，以便它是下一个被读取到的字符。

42	int snprintf(char *str, size_t size, const char *format, ...)
格式字符串到 str 中。

