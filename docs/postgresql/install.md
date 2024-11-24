# PostgreSQL安装教程


## 源码安装

安装教程

https://www.postgresql.org/docs/17/installation.html

中文版（15.7）http://www.postgres.cn/docs/current/installation.html

1、下载源码

https://www.postgresql.org/ftp/source/

以版本`17.2`为例

```bash
wget https://ftp.postgresql.org/pub/source/v17.2/postgresql-17.2.tar.bz2

tar xf postgresql-17.2.tar.bz2
```

2、安装

```bash
./configure --prefix=/usr/local/pgsql

make && make install
```

3、添加到环境变量

```bash
# vim ~/.bash_profile
# pgsql
PG_HOME='/usr/local/pgsql/'
export PATH="$PG_HOME/bin":$PATH
export LD_LIBRARY_PATH='$PG_HOME/lib':$LD_LIBRARY_PATH
```

4、初始化数据库

```bash
mkdir -p /usr/local/pgsql/data

initdb -D /usr/local/pgsql/data

pg_ctl -D /usr/local/pgsql/data -l logfile start

createdb test

psql test

create table tb_test(id int, name varchar(20));

select * from tb_test;
```

## 遇到的问题

1、configure: error: ICU library not found

```shell
$ ./configure
checking for icu-uc icu-i18n... no
configure: error: ICU library not found
If you have ICU already installed, see config.log for details on the
failure.  It is possible the compiler isn't looking in the proper directory.
Use --without-icu to disable ICU support.
```

解决办法

```bash
$ icu-config --version
-bash: icu-config: 未找到命令

yum install libicu-devel -y

$ icu-config --version
50.2
```

2、configure: error: readline library not found

```bash
$ ./configure
checking for library containing readline... no
configure: error: readline library not found
If you have readline already installed, see config.log for details on the
failure.  It is possible the compiler isn't looking in the proper directory.
Use --without-readline to disable readline support.
```

解决办法

```bash
$ yum install -y readline-devel
```


3、initdb: symbol lookup error: initdb: undefined symbol: pqsignal

问题
```bash
$ initdb -D /usr/local/pgsql/data

initdb: symbol lookup error: initdb: undefined symbol: pqsignal
```

解决办法

设置环境

```bash
export LD_LIBRARY_PATH=/usr/local/pgsql/lib:$LD_LIBRARY_PATH
```

3、postgresql gdb which has no line number information

```bash
make uninstall && make clean && make && make install
```

linux 安装gcc---GMP 4.2+, MPFR 3.1.0+ and MPC 0.8.0+ 
https://www.cnblogs.com/zhiminyu/p/18267733