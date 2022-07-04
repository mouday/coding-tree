# 构造器的增删改

## 新增

```php
//新增一条记录
DB::table('user')->insert([ 
    'name' => '曹操', 
]);
// insert into `user` (`name`) values (?)

//新增多条记录 
DB::table('user')->insert([
    ['name' => '刘备'],
    ['name' => '关羽'],
    ['name' => '张飞']
]);
// insert into `user` (`name`) values (?), (?), (?)

// 忽略重复新增数据的错误 
DB::table('user')->insertOrIgnore([
    'id'        => 1,
    'name'  => '李白'
]);
// insert ignore into `user` (`id`, `name`) values (?, ?)

//获取新增后返回的 ID
$id = DB::table('user')->insertGetId([
    'name' => '李白'
]);
// insert into `user` (`name`) values (?)

```

## 更新

```php
//更新修改一条数据 
DB::table('user')->where('id', 10)
    ->update([
        'name' => '李红',
    ]);
// update `user` set `name` = ? where `id` = ?

//参数 1:修改的条件
//参数 2:修改的内容(新增的内容) 
DB::table('user')->updateOrInsert(
    ['id'=>11],
    ['name'=>'李黑']
);
// select exists(select * from `user` where (`id` = ?)) as `exists`
// 不存在
// insert into `user` (`id`, `name`) values (?, ?)
// 存在
// update `user` set `name` = ? where (`id` = ?) limit 1

//新增时，转换为 json 数据
DB::table('user')->insert([
    'name' => json_encode(['age'=>19, 'name'=>'孙权'], JSON_UNESCAPED_UNICODE)
]);

//修改时，使用 object->id 指定
DB::table('user')->where('id', 13)
->update([
    'name->age' => 20
]);
// update `user` set `name` = json_set(`name`, '$."age"', ?) where `id` = ?

//默认自增/自减为 1，可设置
DB::table('user')->where('id', 1)->increment('age'); 
// update `user` set `age` = `age` + 1 where `id` = ?

DB::table('user')->where('id', 2)->decrement('age', 2);
// update `user` set `age` = `age` - 2 where `id` = ?
```

## 删除
```php
// 删除一条数据
DB::table('user')->delete(1); 
// delete from `user` where `user`.`id` = ?

DB::table('user')->where('id', 2)->delete();
// delete from `user` where `id` = ?

// 清空 
DB::table('user')->delete(); 
// delete from `user`

DB::table('user')->truncate();
// truncate table `user`
```