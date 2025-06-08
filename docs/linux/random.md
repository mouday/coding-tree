# /dev/urandom

生成伪随机数

- /dev/random 依赖于系统中断
- /dev/urandom 不依赖系统的中断

获取随机值

```shell
$ cat /dev/urandom | od -x | head -n 1 | cut -d ' ' -f 2- | tr -d ' '
b4f60d2dfd9df6a2d08ecf095ff7896c
```
