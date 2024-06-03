# 模型的关联写入

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

    // 取消批量赋值限制
    protected $guarded = []; 
    
    // 取消自动时间字段
    // public $timestamps = false;

    // 时间字段
    public const CREATED_AT = 'create_time';
    public const UPDATED_AT = 'update_time';

    // 反向关联
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
}

```

## 关联写入

```php
//先限定用户
$user = User::find(1); 
//给这个用户关联的 book 新增一条记录 
//user_id 会自动写入 19，title 自定义

$user->books()->save(new Book(['title'=>'《哈利波特》']));
```

```sql
select * from `user` where `user`.`id` = ? limit 1

insert into `book` (`title`, `user_id`, `update_time`, `create_time`) values (?, ?, ?, ?)
```


## 批量新增

```php
$user = User::find(1);
 
$user->books()->saveMany([
    new Book(['title' => '《哈利波特》']),
    new Book(['title' => '《指环王》']) 
]);
```

```sql
select * from `user` where `user`.`id` = ? limit 1
-- [1]

insert into `book` (`title`, `user_id`, `update_time`, `create_time`) values (?, ?, ?, ?)
-- ["《哈利波特》",1,"2022-07-15 09:44:17","2022-07-15 09:44:17"]

insert into `book` (`title`, `user_id`, `update_time`, `create_time`) values (?, ?, ?, ?)
-- ["《指环王》",1,"2022-07-15 09:44:17","2022-07-15 09:44:17"]
```

## 插入数组新增

```php
$user = User::find(1);

$user->books()->create([ 'title' => '《哈利波特》']);

```
```sql
select * from `user` where `user`.`id` = ? limit 1  
-- params: [1]  

insert into `book` (`title`, `user_id`, `update_time`, `create_time`) values (?, ?, ?, ?)  
-- params: ["《哈利波特》",1,"2022-07-15 09:48:14","2022-07-15 09:48:14"]  
```

## 批量插入数组

```php
$user = User::find(1);

$user->books()->createMany([ 
    ['title' => '《哈利波特》'], 
    ['title' => '《指环王》']
]);
```

```sql
select * from `user` where `user`.`id` = ? limit 1  
-- [1]  

insert into `book` (`title`, `user_id`, `update_time`, `create_time`) values (?, ?, ?, ?)  
-- ["《哈利波特》",1,"2022-07-15 09:49:56","2022-07-15 09:49:56"]  

insert into `book` (`title`, `user_id`, `update_time`, `create_time`) values (?, ?, ?, ?)  
-- ["《指环王》",1,"2022-07-15 09:49:56","2022-07-15 09:49:56"]  
```

PS:还有 findOrNew、firstOrNew、firstOrCreate 和 updateOrCreate 方法

> 区别：
- new    没有保存到数据库，没有id
- create 会保存到数据库，有id

## findOrNew

```php
$user = User::find(1);

return $user->books()->findOrNew(20);
```

```json
{
    "user_id": 1
}
```

```sql
select * from `user` where `user`.`id` = ? limit 1  
-- [1]  

select * from `book` where `book`.`user_id` = ? and `book`.`user_id` is not null and `book`.`id` = ? limit 1  
-- [1,20]  
```

## firstOrNew

```php
$user = User::find(1);

return $user->books()->firstOrNew([
    'title' => '《哈利波特》'
]);
```

```json
{
    "id": 3,
    "user_id": 1,
    "title": "《哈利波特》",
    "create_time": "2022-07-15T01:43:21.000000Z",
    "update_time": "2022-07-15T01:43:21.000000Z",
    "delete_time": null
}
```


```sql
select * from `user` where `user`.`id` = ? limit 1
-- [1]  

select * from `book` where `book`.`user_id` = ? and `book`.`user_id` is not null and (`title` = ?) limit 1  
-- [1,"《哈利波特》"]  
```

## firstOrCreate

```php
$user = User::find(1);

return $user->books()->firstOrCreate([
    'title' => '《西游记》'
]);
```

```json
{
    "title": "《西游记》",
    "user_id": 1,
    "update_time": "2022-07-15T01:56:00.000000Z",
    "create_time": "2022-07-15T01:56:00.000000Z",
    "id": 9
}
```

```sql
select * from `user` where `user`.`id` = ? limit 1  
-- [1]  

select * from `book` where `book`.`user_id` = ? and `book`.`user_id` is not null and (`title` = ?) limit 1  
-- [1,"《西游记》"]  

insert into `book` (`title`, `user_id`, `update_time`, `create_time`) values (?, ?, ?, ?)  
-- ["《西游记》",1,"2022-07-15 09:56:00","2022-07-15 09:56:00"]  
```

## updateOrCreate

```php
$user = User::find(1);

return $user->books()->updateOrCreate([
    'title' => '《水浒传》'
], [
    'delete_time' => '2022-07-15 10:00:13'
]);
```

```json
{
    "id": 10,
    "user_id": 1,
    "title": "《水浒传》",
    "create_time": "2022-07-15T02:00:13.000000Z",
    "update_time": "2022-07-15T02:05:02.000000Z",
    "delete_time": "2022-07-15 10:00:13"
}
```
```sql
select * from `user` where `user`.`id` = ? limit 1  
-- [1]  

select * from `book` where `book`.`user_id` = ? and `book`.`user_id` is not null and (`title` = ?) limit 1  
-- [1,"《水浒传》"]  

update `book` set `delete_time` = ?, `book`.`update_time` = ? where `id` = ?  
-- ["2022-07-15 10:00:13","2022-07-15 10:05:02",10]  
```

## 关联删除

```php
// 删除 user_id=19 的书 
$user = User::find(99); 
$user->books()->delete();
```

```sql
select * from `user` where `user`.`id` = ? limit 1  
-- [1]  

delete from `book` where `book`.`user_id` = ? and `book`.`user_id` is not null  
-- [1]  
```

## 关联修改

```php
// 修改 user_id=19 的书 
$user = User::find(1);
$user->books()->update(['title'=> '《修改书籍》'])
```

```sql
select * from `user` where `user`.`id` = ? limit 1  
-- [1]  

update `book` set `title` = ?, `book`.`update_time` = ? where `book`.`user_id` = ? and `book`.`user_id` is not null  
-- ["《修改书籍》","2022-07-15 10:09:08",1]  
```

## 修改关联的外键

```php
// 修改掉书籍关联的用户，即:user_id 修改，换用户 
$user = User::find(2);

$book = Book::find(1);
$book->user()->associate($user);
$book->save();

```
```sql
select * from `user` where `user`.`id` = ? limit 1  
-- [2]  

select * from `book` where `book`.`id` = ? limit 1  
-- [1]  

update `book` set `user_id` = ?, `book`.`update_time` = ? where `id` = ? 
-- [2,"2022-07-15 10:11:31",1]  

```

```php
// PS:如果想取消一本书的拥有者，
// 比如将 user_id 设置为 null，字段要设置可以 null; 
$book = Book::find(1);
$book->user()->dissociate();
$book->save();
```

```sql
select * from `book` where `book`.`id` = ? limit 1  
-- [1]  

update `book` set `user_id` = ?, `book`.`update_time` = ? where `id` = ?  
-- [null,"2022-07-15 10:13:34",1]  
```


## 默认模型

搜索书籍的对应用户的时候，空null字段会导致用户出现null数据

采用空对象默认模型的方式，去解决这个问题

```php
//Book.php
public function user()
{
    return $this->belongsTo(User::class, 'user_id', 'id')
               ->withDefault([
                'id' => 0,
                'name' => '游客用户'
            ]);
}
```

```php
$book = Book::find(1);
$book->load(['user']);

return $book;
```

```json
{
    "id": 1,
    "user_id": null,
    "title": "《三国演义》",
    "create_time": "2022-07-15T02:10:44.000000Z",
    "update_time": "2022-07-15T02:13:34.000000Z",
    "delete_time": null,
    "user": {
        "id": 0,
        "name": "游客用户"
    }
}
```

```sql
select * from `book` where `book`.`id` = ? limit 1  
-- [1]  

select * from `user` where 0 = 1
-- []
```