# Model 模型

## 模型的定义

创建了一个User.php模型

```bash
php8 artisan make:model User
```

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    use HasFactory;

    // 表名
    protected $table = 'user';

    // 默认主键
    protected $primaryKey = 'id';

    // 默认主键自增
    public $incrementing = true;

    // 默认主键类型为int
    protected $keyType = 'int';

    // 默认处理created_at和updated_at两个时间戳
    public $timestamps = true;

    // 自定义时间戳的格式
    // protected $dateFormat = 'U';
    protected $dateFormat = 'Y-m-d H:i:s';

    // 创建时间 created_at 字段名
    const CREATED_AT = 'create_time';

    // 更新时间 updated_at字段名
    const UPDATED_AT = 'update_time';

    // 默认数据库连接
    protected $connection = 'mysql';
}

```

安装代码提示插件

https://github.com/barryvdh/laravel-ide-helper

```bash
composer8 require --dev barryvdh/laravel-ide-helper

# 为 Facades 生成注释 php
php8 artisan ide-helper:generate 

# 为数据模型生成注释
php8 artisan ide-helper:models

# 生成 PhpStorm Meta file
php8 artisan ide-helper:meta
```

模型的数据库操作和查询构造器大体相同

```php
// 查询所有记录
User::get();
// select * from `user`
```

## 模型的增删改

修改时区 config/app.php
```php
// 'timezone' => 'UTC',
'timezone' => 'Asia/Shanghai',

// 'locale' => 'en',
'locale' => 'zh_CN',
```

新增

```php
// 默认模型接管created_at和updated_at
$users = new User(); 
$users->name = '曹操'; 
$users->age = 23;
$users->save();
// insert into `user` (`name`, `age`, `update_time`, `create_time`) values (?, ?, ?, ?)

// 需要在模型端设置批量赋值的许可 
// protected $fillable = []
//如果取消批量赋值限制，直接如下 
// protected $guarded = [];

User::create([
    'name' => '曹真',
    'age' => 23
]);

// insert into `user` (`name`, `age`, `update_time`, `create_time`) values (?, ?, ?, ?)
```

更新
```php
$users = User::find(1);
$users->name = '曹丕';
$users->save();
// select * from `user` where `user`.`id` = ? limit 1
// update `user` set `name` = ?, `user`.`update_time` = ? where `id` = ?

// 批量更新
User::where('name', '曹真')
    ->update([
        'name' => '曹爽'
    ]);
// update `user` set `name` = ?, `user`.`update_time` = ? where `name` = ?
```

删除

```php
$users = User::find(1); 
$users->delete();
// select * from `user` where `user`.`id` = ? limit 1
// delete from `user` where `id` = ?

//批量删除
User::where('name', '曹爽')->delete();
// delete from `user` where `name` = ?

// 通过主键删除 
User::destroy(2);
// delete from `user` where `id` = ?

User::destroy([2, 3, 4]);
// select * from `user` where `id` in (?, ?, ?)
```

https://www.bilibili.com/video/BV1gE411j78F?p=19&spm_id_from=pageDriver&vd_source=efbb4dc944fa761b6e016ce2ca5933da