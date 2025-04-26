# 内置函数

## generate_series

```sql
generate_series(start,stop)                --int or bigint
generate_series(start,stop,step)           --int or bigint
generate_series(start,stop, step interval) --timestamp or timestamp with time zone
```

示例

```sql
-- 步长时默认是1
postgres=# select generate_series(1,3);
 generate_series
-----------------
               1
               2
               3
(3 rows)
```