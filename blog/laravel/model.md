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
    protected $dateFormat = 'U';

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

https://www.bilibili.com/video/BV1gE411j78F?p=18&spm_id_from=pageDriver&vd_source=efbb4dc944fa761b6e016ce2ca5933da