# 安装openssl


```bash
wget http://www.openssl.org/source/openssl-1.1.1.tar.gz \
&& tar -zxvf openssl-1.1.1.tar.gz \
&& cd openssl-1.1.1 \
&& ./config --prefix=/usr/local/openssl/v1.1.1 shared zlib \
&& make && make install \
&& /usr/local/openssl/v1.1.1/bin/openssl version
```

```bash
# fatal error: zlib.h: No such file or directory
yum install zlib-devel.x86_64

# /usr/local/openssl/v1.1.1/bin/openssl: error while loading shared libraries: libssl.so.1.1: cannot open shared object file: No such file or directory
$ find / -name libssl.so.1.1

echo '/usr/local/openssl/v1.1.1/lib' >> /etc/ld.so.conf
ldconfig

$ /usr/local/openssl/v1.1.1/bin/openssl version
OpenSSL 1.1.1  11 Sep 2018
```

参考：

https://blog.csdn.net/estelle_belle/article/details/111181037