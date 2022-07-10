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

## 批量赋值

设置 create 方法允许或不允许插入的数据字段

```php
class User extends Model
{
    // 可批量赋值的属性
    protected $fillable = ['name'];

    // 不可以批量赋值的属性
    protected $guarded = ['name'];

    // 所有属性都可以批量赋值，$guarded 定义成一个空数组
    protected $guarded = [];
}
```
## 软删除

```sql
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `age` int NOT NULL DEFAULT '0',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `delete_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB COMMENT='用户表';
```
```php
class User extends Model
{
    //开启软删除功能 
    use SoftDeletes;

    // 软删除字段，默认deleted_at
    const DELETED_AT = 'delete_time';

}
```

```php
//删除一
$user = User::find(1); 
$user->delete();
// select * from `user` where `user`.`id` = ? and `user`.`delete_time` is null limit 1
// update `user` set `delete_time` = ?, `user`.`update_time` = ? where `id` = ?

//删除二 
User::destroy(2);
// select * from `user` where `id` in (?) and `user`.`delete_time` is null
// update `user` set `delete_time` = ?, `user`.`update_time` = ? where `id` = ?

//软删除的数据不可见 
User::get();
// select * from `user` where `user`.`delete_time` is null

User::find(2);
// select * from `user` where `user`.`id` = ? and `user`.`delete_time` is null limit 1

// 获取包含软删除的数据
User::withTrashed()->get();
// select * from `user`

// 获取某个被软删除的数据(即使不是软删除的也可以搜索到)
User::withTrashed()->find(82);
// select * from `user` where `user`.`id` = ? limit 1

// 获取所有软删除的数据
User::onlyTrashed()->get();
// select * from `user` where `user`.`delete_time` is not null

// 获取某个被软删除的数据(只有软删除的数据才可以被搜索到)
User::onlyTrashed()->find(82);
// select * from `user` where `user`.`delete_time` is not null and `user`.`id` = ? limit 1

// 判断是否是被软删除的数据
$user = User::withTrashed()->find(1); 
$user->trashed(); // 1
// select * from `user` where `user`.`id` = ? limit 1

// 将被软删除的数据回复正常
$user = User::onlyTrashed()->find(2);
$user->restore();
// select * from `user` where `user`.`delete_time` is not null and `user`.`id` = ? limit 1
// update `user` set `delete_time` = ?, `user`.`update_time` = ? where `id` = ?
// [null,"2022-07-05 10:47:36",1]

// 开启软删除时的真实永久删除
$user = User::onlyTrashed()->find(3); 
$user->forceDelete();
// select * from `user` where `user`.`delete_time` is not null and `user`.`id` = ? limit 1
// delete from `user` where `id` = ?
```

## 模型的作用域

- 本地作用域
- 全局作用域

1、本地作用域

```php
class User extends Model
{
    // 本地作用域 查询条件：成年人
    public function scopeAdult($query)
    {
        return $query->where('age', '>', 18);
    }
}
```

```php
User::adult()->get();
// select * from `user` where `age` > ?
```

支持传递参数

```php
class User extends Model
{
    // 本地作用域 支持传递参数
    public function scopeQueryWhere($query, $where)
    {
        return $query->where($where);
    }
}
```

```php
User::queryWhere([
            ['age', '>', 10]
    ])->get();
// select * from `user` where (`age` > ?)
```

2、全局作用域

定义全局作用域

```php
<?php

namespace App\Scopes;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;

class StatusScope implements Scope
{
    public function apply(Builder $builder, Model $model)
    {
        return $builder->where('status', 1);
    }
}
```

```php
class User extends Model
{
    // 启用全局作用域
    protected static function booted() {
        parent::booted();
        
        // 全局公共模块
        static::addGlobalScope(new StatusScope());

        // 或者 只是针对某个模块
        static::addGlobalScope('status', function (Builder $builder) {
            return $builder->where('status', 1);
        });
    }
}
```

使用

```php
User::queryWhere([
        ['age', '>', 10]
    ])->get();
// select * from `user` where (`age` > 10) and `status` = 1
```

取消全局条件

```php
// 取消全局类的条件
User::withoutGlobalScope(StatusScope::class)->get();
// select * from `user`

// 取消名称为 status 的全局
User::withoutGlobalScope('status')->get();
// select * from `user`

// 取消全部全局作用域
User::withoutGlobalScopes()->get();

// 取消部分作用域
User::withoutGlobalScopes([
    FirstScope::class, 
    SecondScope::class
])->get();

```

## 模型的访问器和修改器

1、访问器

获取数据时，拦截属性并对属性进行修改

```php
// 前固定 get，后固定 Attribute，Name 是字段名 
// 参数 $value 是源字段值，可修改返回
// 属性：name
// name 曹真 -> 【曹真】
public function getNameAttribute($value)
{
    return '【'.$value.'】';
}
```

可以创建一个虚拟字段，用已有的数据字段进行整合，不过要进行数据追加
```php
// 将虚拟字段追加到数据对象列表里去
protected $appends = ['info']

// 虚拟字段 info
public function getInfoAttribute(){
    // "info": "【曹真】-23"
    return "{$this->name}-{$this->age}";

    // 使用源字段进行创建虚拟字段 "info": "曹真-23"
    return $this->attributes['name'] . '-' . $this->attributes['age'];
}
```

2、修改器

在写入的时候拦截，进行修改再写入
```php
// 修改器，写入数据时，将年龄+10
public function setAgeAttribute($value) {
    $this->attributes['age'] = $value + 10;
}
```

```php
// 设置可以自动写入日期的列 
// 默认 created_at 和 updated_at
protected $dates = [
    'details'
];

// 设置字段输出的类型，比如设置一个布尔型，输出时就是true和false;
// 设置字段类型
protected $casts = [
    'details' => 'boolean' 
];
```


