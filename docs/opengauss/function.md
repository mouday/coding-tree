# function 函数

## 函数使用示例

```sql
-- 创建表
create table tb_user (
	id int  primary key,
	age int ,
	name varchar(20) 
);

-- 创建函数
create or replace function func(
	in id int,
	in age int,
	in name char
)
returns int
as 
$$
declare
	count integer;
begin
	insert into tb_user values(id, age, name);
	select count(*) into count from tb_user;
	return count;
end;
$$ language plpgsql;

-- 调用函数
select func(1, 18, 'tom');
select func(2, 20, 'jack');
select func(3, 23, 'steve');
```