# 模型的预加载

预加载: 解决关联查询中产生的`N+1`次查询带来的资源消耗

模型

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

要获取所有书籍的作者(或拥有者)，普通查询方案如下

```php
//获取所有书籍列表 
$books = Book::all();

//遍历每一本书
foreach ($books as $book) {
    //每一本书的关联用户的姓名
    DebugBar::info($book->user->username); 
}
```

```sql
-- N+1 条，就是起初获取全部数据的 1 条和，遍历的 N 条
select * from `book`

select * from `user` where `user`.`id` = ? limit 1
select * from `user` where `user`.`id` = ? limit 1
```

使用with()关键字，进行预载入设置，提前将SQL整合

```php
//with 关键字预载入
$books = Book::with('user')->get();

foreach ($books as $book) { 
    DebugBar::info($book->user->username);
}
```

```sql
select * from `book`

select * from `user` where `user`.`id` in (1)
```

```php
// 预载入设置指定的列
$books = Book::with('user:id,name')->get();
```

```sql
select * from `book`

select `id`, `name` from `user` where `user`.`id` in (1)
```

模型中定义默认加载的关联

```php
class Book extends Model
{
    protected $table = 'book';

    // 默认加载的关联
    protected $with = ['user'];

    // 反向关联
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
}
```

预载入筛选

```php
Book::with([
    'user' => function ($query) {
        $query->where('id', 1);
    }
])->get();
```

```sql
select * from `book`

select * from `user` where `user`.`id` in (1) and `id` = ?
```

延迟预载入
```php
$books = Book::all();

$books->load('user');
```

```sql
select * from `book`

select * from `user` where `user`.`id` in (1)
```

实现延迟关联统计
```php
$users = User::all();

$users->loadCount('book');
```

```sql
select * from `user`

select `id`, 
(
    select count(*) from `book` where `user`.`id` = `book`.`user_id`
) as `books_count` 
from `user` 
where `user`.`id` in (?, ?)
```

```json
[
    {
        "id": 1,
        "name": "曹真",
        "age": 23,
        "create_time": "2022-07-05 10:32:48",
        "update_time": "2022-07-05 10:47:36",
        "delete_time": null,
        "books_count": 2
    },
    {
        "id": 2,
        "name": "曹丕",
        "age": 21,
        "create_time": "2022-07-05 10:36:47",
        "update_time": "2022-07-05 10:47:22",
        "delete_time": null,
        "books_count": 0
    }
]

```