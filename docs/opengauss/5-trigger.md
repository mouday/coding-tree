# Trigger触发器

准备表

```sql
create table tb_user(
    id int,
    age int,
    name varchar(20)
);

create table tb_log(
    event varchar(10),
    time timestamp,
    user_id int,
    user_age int,
    user_name varchar(20)
);
```

创建处理函数

```sql
create or replace function record_tb_user_log()
returns trigger
as
$$
begin
    if (TG_OP = 'DELETE') then
        insert into tb_log select 'DELETE', now(), OLD.id, OLD.age, OLD.name;
        return OLD;
    elsif (TG_OP = 'UPDATE') then
        insert into tb_log select 'UPDATE', now(), NEW.id, NEW.age, NEW.name;
        return NEW;
    elsif (TG_OP = 'INSERT') then
        insert into tb_log select 'INSERT', now(), NEW.id, NEW.age, NEW.name;
        return NEW;
    end if;
    return null;
end;
$$
language plpgsql;
```

创建触发器
```sql
create trigger tb_user_log
after insert or update or delete on tb_user
for each row execute procedure record_tb_user_log();
```

触发器测试

```sql
-- insert
insert into tb_user values (1, 18, 'Tom');

insert into tb_user values (2, 20, 'Jack');

select * from tb_log;
 event  |            time            | user_id | user_age | user_name
--------+----------------------------+---------+----------+-----------
 INSERT | 2024-11-17 00:14:32.412075 |       1 |       18 | Tom
 INSERT | 2024-11-17 00:15:18.217789 |       2 |       20 | Jack
(2 rows)

-- update
update tb_user set age = 13 where id = 2;

db_test=# select * from tb_log;
 event  |            time            | user_id | user_age | user_name
--------+----------------------------+---------+----------+-----------
 INSERT | 2024-11-17 00:14:32.412075 |       1 |       18 | Tom
 INSERT | 2024-11-17 00:15:18.217789 |       2 |       20 | Jack
 UPDATE | 2024-11-17 00:16:12.988189 |       2 |       13 | Jack
(3 rows)

-- delete
delete from tb_user where id = 2;

db_test=# select * from tb_log;
 event  |            time            | user_id | user_age | user_name
--------+----------------------------+---------+----------+-----------
 INSERT | 2024-11-17 00:14:32.412075 |       1 |       18 | Tom
 INSERT | 2024-11-17 00:15:18.217789 |       2 |       20 | Jack
 UPDATE | 2024-11-17 00:16:12.988189 |       2 |       13 | Jack
 DELETE | 2024-11-17 00:16:57.708583 |       2 |       13 | Jack
(4 rows)
```

删除触发器

```sql
drop trigger tb_user_log on tb_user;
```


