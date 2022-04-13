# 存储过程

stored procedure 完成特定功能的SQL语句集，存储在数据库中，经过第一次编译之后再次调用不需要编译（效率较高）

## 1、存储过程与函数的区别

### 1.1、相同点

1. 都是为了可重复地执行操作数据库的SQL语句集合
2. 都是一次编译，多次执行

### 1.2、不同点

1. 标识符不同，函数function 过程 procedure
2. 函数中有返回值，且必须返回，而过程没有返回值
3. 过程无返回值类型，不能将结果直接赋值给变量；函数有返回值类型，调用时，除了在select中，必须将返回值赋值给变量
4. 函数可以再select语句中直接使用，而过程不能


## 2、存储过程的操作

### 2.1、创建过程

基本语法

```sql
create procedure 过程名字([参数列表])
bengin
    过程体
end
结束符
```

如果只有只有一条指令可以省略begin和end

```sql
create procedure my_pro1()
select * from my_student;
```

过程基本上可以完成函数对应的所有功能

```sql

-- 修改语句结束符
delimiter $$
-- 创建过程
create procedure my_pro2()
begin
    -- 求1到100之间的和

    -- 创建局部变量
    declare i int default 1;
    -- declare sum int default 0;
    
    -- 会话变量
    set @sum = 0;

    -- 开始循环获取结果
    while i <= 100 do
        -- 求和
        set @sum = @sum + i;
        set i = i + 1;
    end while;

    -- 显示结果
    select @sum;

end
$$
delimiter ;
```

### 2.2、查看过程

```sql
-- 查看所有存储过程
show procedure status [like 'pattern'];

-- 查看过程的创建语句
show create procedure 过程名字\G
```

### 2.3、调用过程

过程没有返回值

基本语法

```sql
call 过程名([实参列表]);

-- eg:
call my_pro2();
+------+
| @sum |
+------+
| 5050 |
+------+
```


### 2.4、删除过程

基本语法

```sql
drop procedure 过程名;
```

https://www.bilibili.com/video/BV1Vx411g7uJ?p=74&spm_id_from=pageDriver
