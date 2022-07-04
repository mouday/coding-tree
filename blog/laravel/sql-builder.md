# 构造器的查询

打印执行SQL
```php
DB::listen(function($query) {
    $sql = $query->sql;
    $bindings = $query->bindings;
    Log::info('sql: ' . $sql);
    Log::info('params: ' . json_encode($bindings, JSON_UNESCAPED_UNICODE));
});
```

查询示例

```php
//获取全部结果
DB::table('user')->get();
// select * from `user`

 //获取第一条数据
DB::table('user')->first();
// select * from `user` limit 1

//获取第一条数据的 email 字段值
DB::table('user')->value('name');
// select `name` from `user` limit 1

 //通过 id 获取指定一条数据
DB::table('user')->find(20);
// select * from `user` where `id` = ? limit 1

//获取单列值的集合
DB::table('user')->pluck('name');
// select `name` from `user`

//获取单列值的集合(value, key)
DB::table('user')->pluck('name', 'id');
// select `name`, `id` from `user`
```

分块

```php
//切割分块执行，每次读取 3 条，id 排序; 
DB::table('user')->orderBy('id')->chunk(3, function ($users) {
        foreach ($users as $user) {
        echo $user->name;
    }
});
// select * from `user` order by `id` asc limit 3 offset 0
// select * from `user` order by `id` asc limit 3 offset 3
```

聚合查询

```php
DB::table('user')->count(); 
// select count(*) as aggregate from `user`

DB::table('user')->max('id'); 
// select max(`id`) as aggregate from `user`

DB::table('user')->min('id');
// select min(`id`) as aggregate from `user`

DB::table('user')->avg('id');
// select avg(`id`) as aggregate from `user`

DB::table('user')->sum('id');
// select sum(`id`) as aggregate from `user`
```

判断是否存在
```php 
DB::table('user')->where('id', 1)->exists();
// select exists(select * from `user` where `id` = ?) as `exists`

DB::table('user')->where('id', 18)->doesntExist();
// select exists(select * from `user` where `id` = ?) as `exists`
```

## 查询表达式

1、select 查询
```php
// 设置显示的列，设置列别名
DB::table('user')->select('name as username', 'id')->get();
// select `name` as `username`, `id` from `user`

// 给已经构建好的查询添加更多字段
$query = DB::table('user')->select('name as username', 'id');
$query->addSelect('create_time')->get();
// select `name` as `username`, `id`, `create_time` from `user`

// 结合原生 SQL 实现复杂查询
DB::table('user')->select(DB::raw('COUNT(*) AS count, name'))
    ->groupBy('name')
    ->get();
// select COUNT(*) AS count, name from `user` group by `name`

// 或者直接使用 selectRaw()方法实现原生
DB::table('user')->selectRaw('COUNT(*) AS count, name')
           ->groupBy('name')
           ->get();
// select COUNT(*) AS count, name from `user` group by `name`

//使用 havingRaw 方法实现分组筛选
DB::table('user')->selectRaw('COUNT(*) AS count, name')
           ->groupBy('name')
           ->havingRaw('count>1')
           ->get();
// select COUNT(*) AS count, name from `user` group by `name` having count>1
```

## where 查询
```php
// where 查询完整形式
DB::table('user')->where('id', '=', 19)->get();
// select * from `user` where `id` = ?

// 可以省略掉=号参数
DB::table('user')->where('id', 19)->get();
// select * from `user` where `id` = ?

DB::table('user')->where('id', '>=', 3)->get();
// select * from `user` where `id` >= ?

DB::table('user')->where('name', 'like', '%小%')->get();
// select * from `user` where `name` like ?

// 用数组来分别添加条件
// 查看 SQL 语句用->toSql()替换->get()
DB::table('user')->where([
    'id'  => 90,
    'name' => 'Tom' 
    ])->get();
// select * from `user` where (`id` = ? and `name` = ?)

// 如果条件非等于 
DB::table('user')->where([
    ['id', '>=', 90],
    ['name', '=', 'Tom'] ]
    )->get();
// select * from `user` where (`id` >= ? and `name` = ?)
```

## where 派生查询

```php
// where() + orWhere实现or条件查询
DB::table('user')->where('id', '>', 5)
    ->orWhere('name', 'Tom')
    ->get();
// select * from `user` where `id` > ? or `name` = ?

//orWhere()结合闭包查询 
$users = DB::table('users')
     ->where('price', '>', '95')->orWhere(function ($query) {      
        $query->where('gender', '女')
            ->where('username','like','%小%');
})->toSql();
// select * from `users` where `price` > ? or (`gender` = ? and `username` like ?)

// whereBetween 查询区间价格 60~90 之间
$users = DB::table('users')->whereBetween('price', [60, 90])->toSql();
// select * from `users` where `price` between ? and ?
// PS:这里还支持相关三种:
// whereNotBetween/orWhereBetween/orWhereNotBetween;

// whereIn 查询数组里匹配的数值
$users = DB::table('users')->whereIn('id', [20,30,50])->toSql();
// select * from `users` where `id` in (?, ?, ?)
// PS:这里还支持相关三种:
// whereNotIn/orWhereIn/orWhereNotIn;

//whereNull 查询字段值为 Null 的记录
$users = DB::table('users')->whereNull('uid')->toSql();
// select * from `users` where `uid` is null
// PS:这里还支持相关三种:
// whereNotNull/orWhereNull/orWhereNotNull;


// whereYear 查询指定日期的记录，或大于
$users = DB::table('users')->whereDate('create_time', '2018-12-11')->toSql();
// select * from `users` where date(`create_time`) = ?
         
// PS:这里还支持相关四种:
// whereYear/whereMonth/whereDay/whereTime，支持 or 前缀; 
// PS:三个参数支持大于小于之类的操作 orWhereDate('create_time','>', '2018-12-11')
```

## 排序分组

```php
//判断两个相等的字段，同样支持 orWhereColumn() //支持符号'create_time','>', 'update_time' //支持符号支持数组多个字段格式['create_time','>', 'update_time'] 
DB::table('user')
    ->whereColumn('create_time', 'update_time')
    ->get();
// select * from `user` where `create_time` = `update_time`

//支持 orderByRaw 和 orderByDesc 倒序方法
DB::table('user')
           ->orderBy('id', 'desc')
           ->get();
// select * from `user` order by `id` desc

// 按照创建时间倒序排，默认字段 created_at
DB::table('user')->latest('create_time')->toSql();
// select * from `user` order by `create_time` desc

//随机排序
DB::table('user')->inRandomOrder()->get();
// select * from `user` order by RAND()

//从第 3 条开始，显示 3 条
DB::table('user')->skip(2)->take(3)->toSql(); 
// select * from `user` limit 3 offset 2
DB::table('user')->offset(2)->limit(3)->get();
// select * from `user` limit 3 offset 2

//when 实现条件选择
DB::table('user')->when(true, 
    function ($query) {
        $query->where('id', 19); 
    }, 
    function ($query) {
        $query->where('name', 'Tom'); 
    }
)->get();

// true: select * from `user` where `id` = ?
// false: select * from `user` where `name` = ?

// 如果MySQL在5.7+，有支持JSON数据的新特性;
DB::table('user')->where('list->id', 19)->first();
// select * from `user` where json_unquote(json_extract(`list`, '$."id"')) = 19 limit 1
```

## 子查询

```php
//通过 books 表数据，查询到 users 表关联的所有用户
DB::table('users')->whereExists(function ($query) {
    $query->selectRaw(1) ->from('books')
         ->whereRaw('laravel_books.user_id = laravel_users.id');
})->toSql();
// select * from `users` where exists (select 1 from `books` where laravel_books.user_id = laravel_users.id)

//whereRaw 这句也可以替代为:whereColumn('books.user_id','users.id');
// PS:select 1 from，一般用于子查询的手段，目的是减少开销，提升效率

//id=子查询返回的 user_id
DB::table('users')->where('id', function ($query) {
    $query->select('user_id')
       ->from('books')
       ->whereColumn('books.user_id','users.id');
})->toSql();
// select * from `users` where `id` = (select `user_id` from `books` where `books`.`user_id` = `users`.`id`)
```

## join 查询

```php
// join实现内联接的多表查询
$sql = DB::table('users')
    ->join('books', 'users.id', '=', 'books.user_id') 
    ->join('profiles', 'users.id', '=', 'profiles.user_id')
    ->select('users.id', 'users.username', 'users.email','books.title', 'profiles.hobby')
     ->toSql();
// select `users`.`id`, `users`.`username`, `users`.`email`, `books`.`title`, `profiles`.`hobby` 
// from `users` inner join `books` on `users`.`id` = `books`.`user_id` 
// inner join `profiles` on `users`.`id` = `profiles`.`user_id`

// 使用leftjoin左连接或rightjoin右连接
$sql = DB::table('users')
    ->leftJoin('books', 'users.id', '=', 'books.user_id') 
    ->rightjoin('profiles', 'users.id', '=', 'profiles.user_id')
    ->toSql();
// select * from `users` 
// left join `books` on `users`.`id` = `books`.`user_id` 
// right join `profiles` on `users`.`id` = `profiles`.`user_id`

// crossjoin交叉连接查询，会生成笛卡尔积，再用distinct()取消重复
DB::table('users') ->crossJoin('books')
       ->select('username', 'email')
       ->distinct()
       ->toSql();
// select distinct `username`, `email` 
// from `users` cross join `books`

// 实现闭包查询，和where类似，只不过要用on和orOn方法
DB::table('users') ->join('books', function ($join) {
        //支持 orOn 连缀
        $join->on('users.id', '=', 'books.user_id');
    })->toSql();

// select * from `users` 
// inner join `books` on `users`.`id` = `books`.`user_id`

// joinSub实现子连接查询
$query = DB::table('books')->selectRaw('user_id,title');
$users = DB::table('users')->joinSub($query,'books', function ($join) {
    $join->on('users.id', '=', 'books.user_id');
})->toSql();
// select * from `users` 
// inner join (select user_id,title from `books`) as `books` 
// on `users`.`id` = `books`.`user_id`

// union()或unionAll()方法实现两个查询的合并操作
//union 取消重复，unionAll 不取消重复 
$query = DB::table('users'); 
$users = DB::table('users')
           ->union($query)
           ->get();
// (select * from `users`) union (select * from `users`)
```
