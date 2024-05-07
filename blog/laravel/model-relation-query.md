# 模型的关联查询

```php

class User extends Model
{
    protected $table = 'user';
    // 一对多关联 Book 表
    public function books()
    {
        return $this->hasMany(Book::class, 'user_id', 'id');
    }
}


class Book extends Model
{
    protected $table = 'book';

    // 反向关联
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
}

```

查询

```php
//下面两种查询是一样的;
$books = User::find(1)->books;

$books = User::find(19)->book()->get();
```

```sql
select * from `user` where `user`.`id` = ? limit 1

select * from `book` where `book`.`user_id` = ? and `book`.`user_id` is not null
```

```php
//可以采用 where 筛选或闭包 
$books = User::find(1)
    ->books()
    ->where('id', 1)
    ->orWhere('id', 11)
    ->get();
```
```sql
select * from `user` where `user`.`id` = ? limit 1

select * from `book` where `book`.`user_id` = ? and `book`.`user_id` is not null and `id` = ? or `id` = ?
```

```php
$books = User::find(1)
    ->books()
    ->where(function ($query) { 
        $query->where('id', 1)->orWhere('id', 11);
    })->get();
```

```sql
select * from `user` where `user`.`id` = ? limit 1

select * from `book` where `book`.`user_id` = ? and `book`.`user_id` is not null and (`id` = ? or `id` = ?)
```

has()方法，可以查询某些条件下的关联查询数据

```php
// 获取存在关联书籍的用户列表(言下之意:至少一本书) 
$users = User::has('books')->get();
```
```sql
select * from `user` where exists (
    select * from `book` where `user`.`id` = `book`.`user_id`
)
```

```php
// 获取存在关联书籍(并超过 3 条)的用户列表 
$users = User::has('book','>=', 3)->get(); 
```

```sql
select * from `user` where (
    select count(*) from `book` where `user`.`id` = `book`.`user_id`
) >= 3
```

使用whereHas()方法，创建闭包查询

```php
//whereHas 闭包用法
$users = User::whereHas('books', function ($query) {
        //这里$query 是 book 表，通过 user_id 查询，返回 user 表数据
        $query->where('user_id', 19); 
    })->get();
```
```sql
select * from `user` where exists (
    select * from `book` where `user`.`id` = `book`.`user_id` and `user_id` = ?
)
```

使用doesntHave()方法，即has()的反向操作

```php
// 获取不存在关联书籍的用户列表，闭包用法:whereDoesntHave() 
$users = User::doesntHave('books')->get();
```
```sql
select * from `user` where not exists (
    select * from `book` where `user`.`id` = `book`.`user_id`
)
```

使用withCount()方法，可以进行关联统计

```php
//关联统计，会自动给一个 book_count 字段 //统计每个用户有多少本书
User::withCount('books')->get();
```

```sql
select `user`.*,
(select count(*) from `book` where `user`.`id` = `book`.`user_id`) as `books_count` 
from `user`
```
```php
// 给多个关系添加统计:profile_count，book_count
User::withCount(['profile', 'books'])->get();
```

```sql
select `user`.*, 
(select count(*) from `profile` where `user`.`id` = `profile`.`user_id`) as `profile_count`, 
(select count(*) from `book` where `user`.`id` = `book`.`user_id`) as `books_count` 
from `user`
```

```php
//关联统计再结合闭包进行筛选，还可以设置别名
User::withCount(['profile', 'books' => function ($query) {
        //这里限制被统计的记录
        $query->where('user_id', 19); 
    }])->get();
```

```sql
select `user`.*, 
(select count(*) from `profile` where `user`.`id` = `profile`.`user_id`) as `profile_count`, 
(select count(*) from `book` where `user`.`id` = `book`.`user_id` and `user_id` = ?) as `books_count` 
from `user`
```
