# 触发器 trigger

## 一、基本概念

触发器是一种特殊类型的存储过程，触发器通过事件进行触发而被执行

触发器 trigger 和js事件类似

1、作用：

1. 写入数据表前，强制检验或转换数据（保证数据安全）
2. 触发器发生错误时，异动的结果会被撤销（事务安全）
3. 部分数据库管理系统可以针对数据定义语言DDL使用触发器，称为DDL触发器
4. 可以依照特定的情况，替换异动的指令 instead of（mysql不支持）

2、触发器的优缺点

2.1、优点

1. 触发器可通过数据库中的相关表实现级联更改（如果一张表的数据改变，可以利用触发器实现对其他表的操作，用户不知道）
2. 保证数据安全，进行安全校验

2.2、缺点

1. 对触发器过分依赖，势必影响数据库的结构，同时增加了维护的复杂度
2. 造成数据在程序层面不可控

## 二、创建触发器

1、基本语法

```sql
create trigger 触发器名字 触发时机 触发事件 on 表 for each row
begin

end
```

2、触发对象

`on 表 for each row` 触发器绑定表中所有行，没一行发生指定改变的时候，就会触发触发器


3、触发时机

每张表对应的行都有不同的状态，当SQL指令发生的时候，都会令行中数据发生改变，每一行总会有两种状态：数据操作前和数据操作后

- before: 数据发生改变前的状态
- after: 数据已经发生改变后的状态

4、触发事件

mysql中触发器针对的目标是数据发生改变，对应的操作只有写操作（增删改）

- inert  插入操作
- update 更新操作
- delete 删除操作

5、注意事项

一张表中，每一个触发时机绑定的触发事件对应的触发器类型只能有一个

一张表表中只能有一个对应的after insert 触发器

最多只能有6个触发器

```sql
before insert
after insert

before update
after update

before delete
after delete
```

### 1.1 需求

下单减库存

有两张表，一张是商品表，一张是订单表（保留商品ID）每次订单生成，商品表中对应的库存就应该发生变化

1、创建两张表

```sql
create table my_item(
    id int primary key auto_increment,
    name varchar(20) not null,
    count int not null default 0
) comment '商品表';

create table my_order(
    id int primary key auto_increment,
    item_id int not null,
    count int not null default 1
) comment '订单表';

insert my_item (name, count) values ('手机', 100),('电脑', 100), ('包包', 100);

mysql> select * from my_item;
+----+--------+-------+
| id | name   | count |
+----+--------+-------+
|  1 | 手机   |   100 |
|  2 | 电脑   |   100 |
|  3 | 包包   |   100 |
+----+--------+-------+
3 rows in set (0.00 sec)

mysql> select * from my_order;
Empty set (0.02 sec)
```

2、创建触发器


如果订单表发生数据插入，对应的商品就应该减少库存

```sql
delimiter $$

create trigger after_insert_order_trigger after insert on my_order for each row
begin
    -- 更新商品库存
    update my_item set count = count - 1 where id = 1;
end
$$
delimiter ;
```

## 三、查看触发器

```sql

-- 查看所有触发器
show triggers\G
*************************** 1. row ***************************
             Trigger: after_insert_order_trigger
               Event: INSERT
               Table: my_order
           Statement: begin

    update my_item set count = count - 1 where id = 1;
end
              Timing: AFTER
             Created: 2022-04-16 10:00:19.09
            sql_mode: ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION
             Definer: root@localhost
character_set_client: utf8mb4
collation_connection: utf8mb4_general_ci
  Database Collation: utf8mb4_general_ci
1 row in set (0.00 sec)


-- 查看创建语句
show crate trigger 触发器名字;

-- eg:
show create trigger after_insert_order_trigger;
```

## 四、触发触发器

让触发器执行，让触发器指定的表中，对应的时机发生对应的操作


```sql
insert into my_order (item_id, count) values(1, 1);

mysql> select * from my_order;
+----+---------+-------+
| id | item_id | count |
+----+---------+-------+
|  1 |       1 |     1 |
+----+---------+-------+
1 row in set (0.00 sec)

mysql> select * from my_item;
+----+--------+-------+
| id | name   | count |
+----+--------+-------+
|  1 | 手机   |    99 |
|  2 | 电脑   |   100 |
|  3 | 包包   |   100 |
+----+--------+-------+
3 rows in set (0.00 sec)
```

## 五、删除触发器

```sql
drop trigger 触发器名字;

-- eg
drop trigger after_insert_order_trigger;
```

## 六、触发器的应用

记录关键字 new old


### 6.1 完善

商品自动扣除库存

触发器针对的是数据表中的每条记录，每行数据再操作前后都有一个对应的状态

触发器在执行之前就将对应的数据状态获取到了：
- 将没有操作之前的数据状态都保存到`old`关键字中
- 操作后的状态都放在`new`中

触发器中，可以通过old和new来获取绑定表中对应的记录数据

基本语法

```sql
关键字.字段名
```

old和new并不是所有触发器都有

- insert 插入前为空，没有old
- delete 清除数据，没有new


商品自动扣减库存

```sql
delimiter $$
create trigger after_insert_order_trigger after insert on my_order for each row
begin
    -- 通过new关键字获取新数据的id 和数量
    update my_item set count = count - new.count where id = new.item_id;
end
$$
delimiter ;
```

触发触发器

```sql
mysql> select * from my_order;
+----+---------+-------+
| id | item_id | count |
+----+---------+-------+
|  1 |       1 |     1 |
+----+---------+-------+

mysql> select * from my_item;
+----+--------+-------+
| id | name   | count |
+----+--------+-------+
|  1 | 手机   |    99 |
|  2 | 电脑   |   100 |
|  3 | 包包   |   100 |
+----+--------+-------+

insert into my_order (item_id, count) values(2, 3);


mysql> select * from my_order;
+----+---------+-------+
| id | item_id | count |
+----+---------+-------+
|  1 |       1 |     1 |
|  2 |       2 |     3 |
+----+---------+-------+

mysql> select * from my_item;
+----+--------+-------+
| id | name   | count |
+----+--------+-------+
|  1 | 手机   |    99 |
|  2 | 电脑   |    97 |
|  3 | 包包   |   100 |
+----+--------+-------+
```

### 6.2 优化

如果库存数量没有商品订单多怎么办？

```sql
-- 删除原有触发器
drop trigger after_insert_order_trigger;


-- 新增判断库存触发器
delimiter $$
create trigger after_insert_order_trigger after insert on my_order for each row
begin
    -- 查询库存
    select count from my_item where id = new.item_id into @count;

    -- 判断
    if new.count > @count then
        -- 中断操作，暴力抛出异常
        insert into xxx values ('xxx');

    end if;
    
    -- 通过new关键字获取新数据的id 和数量
    update my_item set count = count - new.count where id = new.item_id;
end
$$
delimiter ;
```

结果验证

```sql
mysql> insert into my_order (item_id, count) values(3, 101);
ERROR 1146 (42S02): Table 'mydatabase2.xxx' doesn't exist

mysql> select * from my_order;
+----+---------+-------+
| id | item_id | count |
+----+---------+-------+
|  1 |       1 |     1 |
|  2 |       2 |     3 |
+----+---------+-------+
2 rows in set (0.00 sec)

mysql> select * from my_item;
+----+--------+-------+
| id | name   | count |
+----+--------+-------+
|  1 | 手机   |    99 |
|  2 | 电脑   |    97 |
|  3 | 包包   |   100 |
+----+--------+-------+
3 rows in set (0.00 sec)
```

