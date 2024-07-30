# 安装Python

```bash
yum install -y zlib zlib-dev openssl-devel sqlite-devel bzip2-devel libffi libffi-devel gcc gcc-c++ zlib* \
&& wget https://mirrors.huaweicloud.com/python/3.7.0/Python-3.7.0.tgz \
&& tar -zxvf  Python-3.7.0.tgz \
&& cd Python-3.7.0 \
&& ./configure --prefix=/usr/local/python/v3.7.0 \
--with-openssl=/usr/local/openssl/v1.1.1 \
LDFLAGS="-L/usr/local/openssl/v1.1.1/lib" \
CPPFLAGS="-I/usr/local/openssl/v1.1.1/include" \
PKG_CONFIG_PATH="/usr/local/openssl/v1.1.1/lib/pkgconfig" \
&& make && make install \
&& /usr/local/python/v3.7.0/bin/python3 --version
```