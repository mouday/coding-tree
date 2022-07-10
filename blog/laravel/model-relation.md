# 模型关联 relation

## 模型的一对一关联

创建数据库表

```sql
-- 用户表
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  
  `name` varchar(50)  NOT NULL,
  `age` int NOT NULL DEFAULT '0',

  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `delete_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB COMMENT='用户表';

-- 用户信息表
CREATE TABLE `profile` (
  `id` int NOT NULL AUTO_INCREMENT,

  `user_id` int NOT NULL,
  `hobby` varchar(255)  NOT NULL DEFAULT '',

  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `delete_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  COMMENT='用户信息表';
```

初始化数据
```sql
-- 用户表
INSERT INTO `user`(`id`, `name`, `age`, `create_time`, `update_time`, `delete_time`) VALUES (1, '曹真', 23, '2022-07-05 10:32:48', '2022-07-05 10:47:36', NULL);
INSERT INTO `user`(`id`, `name`, `age`, `create_time`, `update_time`, `delete_time`) VALUES (2, '曹丕', 21, '2022-07-05 10:36:47', '2022-07-05 10:47:22', NULL);

-- 用户信息表
INSERT INTO `profile`(`id`, `user_id`, `hobby`, `create_time`, `update_time`, `delete_time`) VALUES (1, 1, '羽毛球', '2022-07-10 22:26:00', '2022-07-10 22:27:07', NULL);
INSERT INTO `profile`(`id`, `user_id`, `hobby`, `create_time`, `update_time`, `delete_time`) VALUES (2, 2, '乒乓球', '2022-07-10 22:27:16', '2022-07-10 22:27:16', NULL);
```

创建Model

```bash
# 用户表
php8 artisan make:model User

# 用户信息表
php8 artisan make:model Profile

# 添加代码提示
php8 artisan ide-helper:models
```

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * App\Models\User
 *
 * @property int $id
 * @property string $name
 * @property int $age
 * @property string $create_time
 * @property string $update_time
 * @property string|null $delete_time
 * @property Profile|null $profile
 * @method static \Illuminate\Database\Eloquent\Builder|User newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|User newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|User query()
 * @method static \Illuminate\Database\Eloquent\Builder|User whereAge($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereCreateTime($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereDeleteTime($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereUpdateTime($value)
 * @mixin \Eloquent
 */
class User extends Model
{
    protected $table = 'user';

    // 一对一关联 Profile 表
    public function profile()
    {
        return $this->hasOne(Profile::class, 'user_id', 'id');
    }
}

```

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * App\Models\Profile
 *
 * @property int $id
 * @property int $user_id
 * @property int $hobby
 * @property string $create_time
 * @property string $update_time
 * @property string|null $delete_time
 * @property User|null $user
 * @method static \Illuminate\Database\Eloquent\Builder|Profile newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Profile newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Profile query()
 * @method static \Illuminate\Database\Eloquent\Builder|Profile whereCreateTime($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Profile whereDeleteTime($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Profile whereHobby($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Profile whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Profile whereUpdateTime($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Profile whereUserId($value)
 * @mixin \Eloquent
 */
class Profile extends Model
{
    protected $table = 'profile';

    // 反向关联
    public function user(){
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
}
```

```php
User::find(1)->profile;

{
    "id": 1,
    "user_id": 1,
    "hobby": "羽毛球",
    "create_time": "2022-07-10 22:26:00",
    "update_time": "2022-07-10 22:27:07",
    "delete_time": null
}
```

```php
Profile::find(1)->user;

{
    "id": 1,
    "name": "曹真",
    "age": 23,
    "create_time": "2022-07-05 10:32:48",
    "update_time": "2022-07-05 10:47:36",
    "delete_time": null
}
```

## 模型的一对多关联

定义数据表

```sql

-- 用户书单表
CREATE TABLE `book` (
  `id` int NOT NULL AUTO_INCREMENT,

  `user_id` int NOT NULL,
  `title` varchar(255)  NOT NULL DEFAULT '',

  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `delete_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  COMMENT='用户书单表';

-- 用户书单表
INSERT INTO `book`(`id`, `user_id`, `title`, `create_time`, `update_time`, `delete_time`) VALUES (1, 1, '《三国演义》', '2022-07-10 22:26:00', '2022-07-10 22:27:07', NULL);
INSERT INTO `book`(`id`, `user_id`, `title`, `create_time`, `update_time`, `delete_time`) VALUES (2, 1, '《红楼梦》', '2022-07-10 22:27:16', '2022-07-10 22:27:16', NULL);
```

初始化数据

```bash
# 用户书单表
php8 artisan make:model Book

# 添加代码提示
php8 artisan ide-helper:models
```

定义模型类

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

使用关联查询

```php
User::find(1)->books;

[
    {
        "id": 1,
        "user_id": 1,
        "title": "《三国演义》",
        "create_time": "2022-07-10 22:26:00",
        "update_time": "2022-07-10 22:27:07",
        "delete_time": null
    },
    {
        "id": 2,
        "user_id": 1,
        "title": "《红楼梦》",
        "create_time": "2022-07-10 22:27:16",
        "update_time": "2022-07-10 22:27:16",
        "delete_time": null
    }
]

```

```php
Book::find(1)->user;

{
    "id": 1,
    "name": "曹真",
    "age": 23,
    "create_time": "2022-07-05 10:32:48",
    "update_time": "2022-07-05 10:47:36",
    "delete_time": null
}
```
使用条件查询
```php
User::find(1)
    ->books()
    ->where('id', '>', 1)
    ->get();

[
    {
        "id": 2,
        "user_id": 1,
        "title": "《红楼梦》",
        "create_time": "2022-07-10 22:27:16",
        "update_time": "2022-07-10 22:27:16",
        "delete_time": null
    }
]

```

https://www.bilibili.com/video/BV1gE411j78F?p=27&spm_id_from=pageDriver&vd_source=efbb4dc944fa761b6e016ce2ca5933da