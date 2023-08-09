# 数据库基本操作

## 创建数据库

```sql
-- 语法
create database 数据库名字 [库选项];

-- 会在data下创建一个文件夹mydatabase
create database mydatabase;

-- 指定字符集
create database mydatabase charset gbk;
```

- 字符集 charset
- 校对集 collate 

查看数据文件存储目录
```
mysqladmin -uroot -p variables | grep datadir
```

## 查看数据库

```sql
-- 1、显示所有数据库
show databases;

infomation_schema   保存数据库所有结构信息
mysql               核心数据库，权限关系
performance_schema  效率库
test                测试库

-- 2、显示部分
show databases like 匹配模式
_ 匹配单个字符
% 匹配多个字符

-- eg: 查看以data开头的数据库
show databases like 'data%';

-- 3、显示数据库创建语句
show create database 数据库名;

-- eg:
show create database data;
```

## 选择数据库

```sql
use 数据库;

-- eg
use mydatabase;
```

## 修改数据库

```sql
-- 修改数据库字符集 和校对集
alter database 数据库名字 charset 字符集;

-- eg:
alter database mydatabase charset gbk;
```

修改数据库名字

- version < 5.5 rename
- version > 5.5 不可以修改

## 删除数据库

```sql
drop database 数据库名字;

-- eg:
drop database mydatabase;
```