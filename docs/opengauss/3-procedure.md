# procedure存储过程

准备表
```sql
create table tb_user (
    id int  primary key,
    age int ,
    name varchar(20) 
);
```

定义存储过程

```sql
create or replace procedure tb_user_add(
    in id int,
    in age int,
    in name char
)
as
begin
insert into tb_user values(id, age, name);
end;
/
```

调用
```sql
call tb_user_add(1, 18, 'Tom');
call tb_user_add(2, 20, 'Jack');
```

查看结果

```sql
select * from tb_user;
 id | age | name
----+-----+------
  1 |  18 | Tom
  2 |  20 | Jack
(2 rows)
```