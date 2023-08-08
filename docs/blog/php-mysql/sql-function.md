# 内置函数和自定义函数 function

函数分为两类：系统函数和自定义函数

使用函数

```sql
select 函数名(参数列表);
```

## 1、内置函数

### 1.1、字符串函数

| 函数名 | 说明
| - | - 
| char_length | 判断字符串的字符数
| length  | 判断字符串的字节数,与字符集有关
| concat | 连接字符串
| insrt  |  检查字符是否在目标字符串中，存在返回其位置，不存在返回 0
| lcase | 全部小写
| ltrim |  消除左边的空格
| left(str, length)  | 左侧开始截取字符串，直到指定位置
| right(str, length) |  右侧开始截取字符串，直到指定位置
| mid  |  从中间指定位置开始截取，如果不指定截取长度，直接到最后
| `substring(str, index, [length])` | 从指定位置开始，指定截取长度
| substring_index(str, delim, count) | 按照关键字截取

示例

```sql
select char_length('你好中国'); // 4
select length('你好中国'); // 12
select length('hello'); // 5
select char_length('hello'); // 5

select concat('你好', '中国'); // 你好中国

-- 下标从 1 开始
select instr('你好中国', '中国'); // 3
select instr('你好中国', '我'); // 0

select lcase('aBcd'); // abcd
select left('aBcd', 2); // aB
select right('abcdef', 2); // ef
select substring('abcdef', 2, 3); // bcd
select substring('abcdef', -2, 3); // ef

select ltrim(' abc d '); // abc d
select mid('你好中国', 3); // 中国

select substring_index('www.baidu.com', '.', 2); // www.baidu
select substring_index('www.baidu.com', '.', -2); // baidu.com
```

### 1.2、时间函数

| 函数名 | 说明
| - | - 
| now() | 返回当前时间，日期 时间
| curdate()  | 当前日期
| curtime()  | 当前时间
| datediff()  | 判断两个日期之间的天数之差，日期使用字符串格式（用引号）
| date_add(日期, interval 时间数字 type)  | 时间增加（type: | day hour minute second）
| unix_timestamp()  | 获取时间戳
| from_unixtime()  | 将指定时间戳转换成对应的日期时间格式

示例

```sql
select now(); // 2022-04-10 22:05:38
select curdate(); // 2022-04-10
select curtime(); // 22:05:51

select datediff('2022-01-09', '2022-01-01'); // 8

select date_add('2000-10-01', interval 10 day); // 2000-10-11

select unix_timestamp(); // 1649599799

select from_unixtime(1649599799); // 2022-04-10 22:09:59
```

### 1.3、数学函数

| 函数名 | 说明
| - | - 
| abs | 绝对值
| ceiling | 向上取整
| floor | 向下取整
| pow | 指数
| rand | 随机数(0-1)
| round | 四舍五入

示例

```sql
select abs(-1); // 1
select ceiling(1.1); // 2
select floor(1.9); // 1
select pow(2, 4); // 16
select rand(); // 0.2616088308967732
select round(1.5); // 2
```

### 1.4、其他函数

| 函数名 | 说明
| - | - 
| md5() | MD5
| version()  | 版本号
| database() | 显示当前所在数据库
| uuid()  | 生成一个唯一标识符,全局唯一

示例

```sql
select md5('abc'); // 900150983cd24fb0d6963f7d28e17f72
select version(); // 8.0.16
select database(); // mydatabase
select uuid(); // c44a06a2-b8d8-11ec-a53c-504259f9d746
```

## 2、自定义函数

mysql一旦见到分号结束符，就会开始执行

修改语句结束符

基本语法

```sql
delimiter 符号;
```

### 2.1、创建函数

基本语法

```sql
-- 修改语句结束符
delimiter $$;

create function 函数名(形参) returns 返回值类型
begin
    // 函数体
    return 返回值数据;
end

语句结束符

-- 将语句结束符修改回来
delimiter ;
```

示例

```sql
-- 修改语句结束符
delimiter $$

create function my_func1() returns int
begin
    return 10;
end

-- 结束
$$

-- 将语句结束符改回来
delimiter ;
```

如果只有一条语句，可以省略begin 和 end

```sql
-- 最简单的函数
create function foo() returns int
return 10;
```

为函数的形参指定数据类型

基本语法

```sql
形参 数据类型
```

示例

```sql
create function my_func2(a int, b int) returns int
return a * b;
```

### 2.2、查看函数

基本语法

```sql
show function status [like 'pattern'];
```

示例

```sql
-- 查看所有函数
show function status\G

-- 查看单个函数
mysql> show function status like 'foo'\G
*************************** 1. row ***************************
                  Db: mydatabase
                Name: foo
                Type: FUNCTION
             Definer: root@localhost
            Modified: 2022-04-10 22:34:06
             Created: 2022-04-10 22:34:06
       Security_type: DEFINER
             Comment:
character_set_client: utf8mb4
collation_connection: utf8mb4_general_ci
  Database Collation: utf8mb4_general_ci
1 row in set (0.00 sec)


-- 查看函数创建语句
mysql> show create function foo\G
*************************** 1. row ***************************
            Function: foo
            sql_mode: ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION
     Create Function: CREATE DEFINER=`root`@`localhost` FUNCTION `foo`() RETURNS int(11)
return 10
character_set_client: utf8mb4
collation_connection: utf8mb4_general_ci
  Database Collation: utf8mb4_general_ci
1 row in set (0.01 sec)
```

### 2.3、调用函数

基本语法

```sql
select 函数名(实参列表);
```

示例

```sql
mysql> select foo();
+-------+
| foo() |
+-------+
|    10 |
+-------+

mysql> select my_func2(2, 3);
+----------------+
| my_func2(2, 3) |
+----------------+
|              6 |
+----------------+
```

### 2.4、删除函数

基本语法

```sql
drop function 函数名;
```

示例

```sql
drop function my_func1;
```

### 2.5、注意事项

1. 自定义函数属于用户级别，只有当前客户端对应的数据库中可以使用

2. 可以在不同数据库下看到函数，但是不可以调用

3. 自定义函数通常是为了将多行代码集合到一起解决一个重复性的问题

4.函数必须规范返回值，那么在函数内部不能使用select指令，select一旦执行就会的到一个结果集 result set;

可以使用给变量赋值语句
```sql
select 字段 into @变量;
```

## 3、函数流程结构案例

需求：

从1开始，直到用户传入的对应的值位置，自动求和，凡是5的倍数都不要


设计：

1. 创建函数
2. 需要一个形参，确定要累加到什么位置
3. 需要定义一个变量来保存对应的结果
4. 内容部需要一个循环来实现迭代累加
5. 循环内部需要进行条件判断控制，5的倍数


定义函数

```sql
-- 创建一个自动求和的函数

-- 修改语句结束符
delimiter $$

-- 创建函数
create function my_sum(end_value int) returns int
begin
    -- 声明局部变量
    declare res int default 0;
    declare i int default 0;

    -- 循环处理
    mywhile: while i <= end_value do
        -- mysql中没有++
        set i = i + 1; 

        --  判断当前数据是否合理
        if i % 5 = 0 then
            iterate mywhile;
        end if;

        -- 修改变量，累加
        set res = res + i;
    end while;

    -- 返回值
    return res;
end

-- 结束
$$

-- 修改语句结束符
delimiter ;

```

调用函数

```sql
-- 实参个数必须等于形参个数
select my_sum(10);
```
