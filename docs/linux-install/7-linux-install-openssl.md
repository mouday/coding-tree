# 安装openssl


```bash
wget http://www.openssl.org/source/openssl-1.1.1.tar.gz \
&& tar -zxvf openssl-1.1.1.tar.gz \
&& cd openssl-1.1.1 \
&& ./config --prefix=/usr/local/openssl/v1.1.1 shared zlib \
make && make install
```