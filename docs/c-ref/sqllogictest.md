# sqllogictest

SQL测试框架

[wiki](https://www.sqlite.org/sqllogictest/doc/trunk/about.wiki)

测试记录 (record) 分为两类

- statement
- query

## statement 记录

不指定期望输出结果，只判断语句是否成功执行

```sql
statement ok/error <label>
SQL
```

格式说明

- 第一部分为 statement ok 或 statement error，表示这是一条 statement 记录，期望执行成功 (对应 ok) 或执行失败 (对应 error)；
- 第二行为对应的 SQL
- 其中 label 是一个可选项，表示这条语句对应的客户端。

示例

```sql
statement ok
create table test(id int, info varchar(10));

statement error
drop table not_exist;
```

## query 记录

对执行结果进行比对

```sql
query <sort-mode> <label>
SQL
----
result
```

第一部分包含 query, sort-mode 和 label。

- query 表示这是一条 query 记录。

- sort-mode 是一个可选项，表示比较 SQL 输出结果前是否进行排序，默认为 nosort，即在比较结果之前不对结果排序，这种模式适用于要求查询结果有序的情况，如包含 order by 的 SQL 语句。此外还可以指定为 rowsort，表示比较结果之前按行进行排序，将排序后的结果进行比较，这种情况适用于对查询结果顺序没有要求的语句。

- label 的含义与 statement 语句的 label 含义相同。

第二部分为查询对应的 SQL 语句。

第三部分为----分隔符，将 SQL 语句与查询结果分隔开。

第四部分为查询结果，不同字段之间用空格分隔。测试程序暂不支持字段内包含空格的情况，测试时请确保数据内不包含空格，否则可能引发测试程序的误报。

示例

```sql
statement ok
create table test(id int, info varchar(10));

query
insert into test values(1, 'aaa'), (2, 'bbb');
----
2

query rowsort
select * from test;
----
1 aaa
2 bbb

query
update test set id = 3 where id = 1;
----
1

query rowsort
select * from test;
----
2 bbb
3 aaa

query
delete from test;
----
2

statement ok
drop table test;
```
