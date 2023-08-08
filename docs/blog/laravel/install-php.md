# 安装Laravel编程环境

测试环境:

```
os macOS Mojave 10.14.4
PHP 8.0.20
laravel 9.x
```

## 1、安装PHP

php源码：[https://github.com/php/php-src](https://github.com/php/php-src)

因为使用macOS的包管理工具HomeBrew没有成功安装PHP，故采用源码编译安装的方式

下载地址：[https://www.php.net/downloads](https://www.php.net/downloads)

```bash
# 下载
wget https://www.php.net/distributions/php-8.0.20.tar.gz

# 解压
tar -zxvf php-8.0.20.tar.gz

cd php-8.0.20

# 配置
./configure \
--prefix=/Users/user/Applications/php/8.0.20 \
--with-config-file-path=/Users/user/Applications/php/8.0.20/etc \
--with-curl \
--with-openssl \
--with-mysqli \
--with-pdo-mysql \
--with-iconv \
--with-mhash \
--with-zlib  \
--enable-mbstring  \
--enable-gd \
--enable-gd-jis-conv \
--enable-sockets \
--enable-fpm \
--enable-xml \
--enable-pdo \
--enable-cli \
--enable-pcntl \
--enable-soap \
--enable-opcache \
--enable-fileinfo \
--disable-rpath \
--enable-mysqlnd \
--with-zip \
--enable-simplexml \
--with-libxml \
--with-sqlite3 \
--with-pdo-sqlite \
--enable-phar \
--enable-tokenizer \
--enable-cgi

# 编译
make

# 安装
make install

# 添加软连接
ln -s /Users/user/Applications/php/8.0.20/bin/php /usr/local/bin/php8

# 查看PHP的版本
php8 -v
PHP 8.0.20 (cli) (built: Jun 26 2022 18:43:20) ( NTS )
Copyright (c) The PHP Group
Zend Engine v4.0.20, Copyright (c) Zend Technologies

# 本机的安装地址php8，由于本机装有有多个PHP版本，故取了别名
/usr/local/bin/php8 -> /Users/user/Applications/php/8.0.20/bin/php
```


### 安装PHP遇到的问题及解决

如果提示部分依赖缺失，需要安装

```bash
# 检查是否安装
brew info openssl

# 搜索可安装的软件包
brew search openssl

# 安装
brew install openssl
```

按照提示配置 pkgconfig、openssl、libiconv环境变量

```bash
# ~/.bash_profile

# pkgconfig
export PKG_CONFIG_PATH=$PKG_CONFIG_PATH:/usr/local/lib/pkgconfig

# openssl@1
export PATH="/usr/local/opt/openssl@1.1/bin:$PATH"
export PKG_CONFIG_PATH="/usr/local/opt/openssl@1.1/lib/pkgconfig:$PKG_CONFIG_PATH"
export LDFLAGS="-L/usr/local/opt/openssl@1.1/lib"
export CPPFLAGS="-I/usr/local/opt/openssl@1.1/include"

# libiconv
export PATH="/usr/local/opt/libiconv/bin:$PATH"
export LDFLAGS="-L/usr/local/opt/libiconv/lib"
export CPPFLAGS="-I/usr/local/opt/libiconv/include"
```

> 提示：如果配置好环境变量，重启会话窗口还没没有编译通过，
可以尝试把当前解压的编译文件夹整个删除，再重新解压一份新的

## 2、安装composer
 
地址：[https://getcomposer.org/download/](https://getcomposer.org/download/)

[https://github.com/composer/composer](https://github.com/composer/composer)


```bash
# 下载composer
php8 -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
php8 composer-setup.php
php8 -r "unlink('composer-setup.php');"

# 移入对应PHP版本的可执行目录
mv composer.phar /Users/user/Applications/php/8.0.20/bin/composer
```

将composer8取个别名

```bash
# ~/.bash_profile
# php8 注意等号= 两边不要有空格
alias composer8="php8 /Users/user/Applications/php/8.0.20/bin/composer"
```

镜像

```bash
# 使用阿里云镜像
composer8 config -g repo.packagist composer https://mirrors.aliyun.com/composer/

# 检验版本
composer8 -V
Composer version 2.3.7 2022-06-06 16:43:28
```

## 3、创建laravel项目

中文文档：https://learnku.com/docs/laravel/9.x

```bash
composer8 create-project laravel/laravel laravel-app
```

PHPStrom 安装插件 laravel

启动服务

```bash
php8 artisan serve
```