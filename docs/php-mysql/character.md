# 字符集 character

- 字符 character 是各种文字和符号的总称
- 字符编码 character code 是计算机针对各种符号，在计算机中的一种二进制存储代号
- 字符集 character set 是多个字符的集合

常见的字符集

- ASCII 字符集
- GB2312 字符集
- Unicode 字符集

# 设置客户端字符集

```sql
-- 设置客户端字符集编码
set names gbk;

-- 查看字符集编码设置
show variables like 'character_set_%';
+--------------------------+------------+
| Variable_name            | Value      |
+---------+-----------------------------+
| character_set_client     | gbk        |
| character_set_connection | gbk        |
| character_set_database   | utf8mb4    |
| character_set_filesystem | binary     |
| character_set_results    | gbk        |
| character_set_server     | utf8mb4    |
| character_set_system     | utf8       |
| character_sets_dir       | /usr/local/Cellar/mysql/8.0.16/share/mysql/charsets/ |
+--------------------------+------------+

-- 插入中文字符
insert into tb_teacher (name, age) values ('张三', 23);
```

MySQL 与 MySQLd 之间有三层

- 客户端传入数据给服务端 client
- 服务端返回数据给客户端 server
- 客户端与服务端之间的连接 collection

变量

- character_set_client 客户端
- character_set_connection 连接层
- character_set_database 数据库
- character_set_results 结果集

修改变量

```sql
set 变量名 = 值;

-- 修改单个变量
set character_set_client = gbk;

-- 设置字符集
set names gbk;

-- 等价于
set character_set_client = gbk; // 让服务器识别客户端传过去的数据
set character_set_connection = gbk; // 更好的帮助客户端与服务器端之间惊醒字符集转换
set character_set_results = gbk; // 告诉客户端服务器返回的数据
```
