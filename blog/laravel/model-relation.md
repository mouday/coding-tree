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
INSERT INTO `user`(`id`, `name`, `age`, `create_time`, `update_time`, `delete_time`) 
VALUES (1, '曹真', 23, '2022-07-05 10:32:48', '2022-07-05 10:47:36', NULL);
INSERT INTO `user`(`id`, `name`, `age`, `create_time`, `update_time`, `delete_time`) 
VALUES (2, '曹丕', 21, '2022-07-05 10:36:47', '2022-07-05 10:47:22', NULL);

-- 用户信息表
INSERT INTO `profile`(`id`, `user_id`, `hobby`, `create_time`, `update_time`, `delete_time`) 
VALUES (1, 1, '羽毛球', '2022-07-10 22:26:00', '2022-07-10 22:27:07', NULL);
INSERT INTO `profile`(`id`, `user_id`, `hobby`, `create_time`, `update_time`, `delete_time`) 
VALUES (2, 2, '乒乓球', '2022-07-10 22:27:16', '2022-07-10 22:27:16', NULL);
```

创建Model

```bash
# 用户表
php8 artisan make:model User

# 用户信息表
php8 artisan make:model Profile

# 添加代码提示，模型修改后也可以执行从而更新注释
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

// select * from `user` where `user`.`id` = ? limit 1
// select * from `profile` where `profile`.`user_id` = ? and `profile`.`user_id` is not null limit 1

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

// select * from `profile` where `profile`.`id` = ? limit 1
// select * from `user` where `user`.`id` = ? limit 1

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
INSERT INTO `book`(`id`, `user_id`, `title`, `create_time`, `update_time`, `delete_time`) 
VALUES (1, 1, '《三国演义》', '2022-07-10 22:26:00', '2022-07-10 22:27:07', NULL);
INSERT INTO `book`(`id`, `user_id`, `title`, `create_time`, `update_time`, `delete_time`) 
VALUES (2, 1, '《红楼梦》', '2022-07-10 22:27:16', '2022-07-10 22:27:16', NULL);
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

// select * from `user` where `user`.`id` = ? limit 1
// select * from `book` where `book`.`user_id` = ? and `book`.`user_id` is not null

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

// select * from `book` where `book`.`id` = ? limit 1

// select * from `user` where `user`.`id` = ? limit 1

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
// select * from `user` where `user`.`id` = ? limit 1

// select * from `book` where `book`.`user_id` = ? 
// and `book`.`user_id` is not null and `id` > ?

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

## 模型的多对多关联

定义数据表

```sql
-- 角色表
CREATE TABLE `role` (
  `id` int NOT NULL AUTO_INCREMENT,

  `title` varchar(255)  NOT NULL DEFAULT '',

  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `delete_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  COMMENT='角色表';

-- 用户角色关系表
CREATE TABLE `user_role` (
  `id` int NOT NULL AUTO_INCREMENT,

  `user_id` int NOT NULL,
  `role_id` int NOT NULL,
  `detail` varchar(255) NOT NULL DEFAULT '',

  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `delete_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  COMMENT='用户角色关系表';
```

初始化数据

```sql
-- 角色表
INSERT INTO `role`(`id`, `title`, `create_time`, `update_time`, `delete_time`) 
VALUES (1, '评论审核员', '2022-07-11 10:10:20', '2022-07-11 10:10:54', NULL);
INSERT INTO `role`(`id`, `title`, `create_time`, `update_time`, `delete_time`) 
VALUES (2, '账号管理员', '2022-07-11 10:10:26', '2022-07-11 10:10:47', NULL);

-- 用户角色关系表
INSERT INTO `user_role`(`id`, `user_id`, `role_id`, `detail`, `create_time`, `update_time`, `delete_time`) 
VALUES (1, 1, 1, '备注详情1', '2022-07-11 10:11:04', '2022-07-11 10:12:56', NULL);
INSERT INTO `user_role`(`id`, `user_id`, `role_id`, `detail`, `create_time`, `update_time`, `delete_time`) 
VALUES (2, 1, 2, '备注详情2', '2022-07-11 10:11:08', '2022-07-11 10:12:54', NULL);
```

生成模型类

```bash
# 角色表
php8 artisan make:model Role

# 添加代码提示
php8 artisan ide-helper:models
```

修改模型类

```php
class User extends Model
{
    protected $table = 'user';

    // 多对多关联
    public function roles()
    {
        return $this->belongsToMany(Role::class, 'user_role', 'user_id', 'role_id');
    }
}


class Role extends Model
{
    protected $table = 'role';

    // 多对多关联
    public function users()
    {
        return $this->belongsToMany(User::class, 'user_role', 'role_id', 'user_id');
    }
}

```

查询示例

示例1

```php
User::find(1)->roles;
```

```sql
select * from `user` where `user`.`id` = ? limit 1

select `role`.*, 
    `user_role`.`user_id` as `pivot_user_id`, 
    `user_role`.`role_id` as `pivot_role_id` 
from `role` 
inner join `user_role` 
on `role`.`id` = `user_role`.`role_id` 
where `user_role`.`user_id` = ?

```

```json
[
    {
        "id": 1,
        "title": "评论审核员",
        "create_time": "2022-07-11 10:10:20",
        "update_time": "2022-07-11 10:10:54",
        "delete_time": null,
        "pivot": {
            "user_id": 1,
            "role_id": 1
        }
    },
    {
        "id": 2,
        "title": "账号管理员",
        "create_time": "2022-07-11 10:10:26",
        "update_time": "2022-07-11 10:10:47",
        "delete_time": null,
        "pivot": {
            "user_id": 1,
            "role_id": 2
        }
    }
]
```

示例2

```php
User::find(1)
    ->roles()
    ->where('role_id', 1)
    ->get();
```

```sql
select * from `user` where `user`.`id` = ? limit 1

select `role`.*, 
    `user_role`.`user_id` as `pivot_user_id`, 
    `user_role`.`role_id` as `pivot_role_id` 
from `role` 
inner join `user_role` 
on `role`.`id` = `user_role`.`role_id` 
where `user_role`.`user_id` = ? and `role_id` = ?
```

```json
[
    {
        "id": 1,
        "title": "评论审核员",
        "create_time": "2022-07-11 10:10:20",
        "update_time": "2022-07-11 10:10:54",
        "delete_time": null,
        "pivot": {
            "user_id": 1,
            "role_id": 1
        }
    }
]
```

示例3

```php
Role::find(1)->users;
```

```sql
select * from `role` where `role`.`id` = ? limit 1

select `user`.*, 
    `user_role`.`role_id` as `pivot_role_id`, 
    `user_role`.`user_id` as `pivot_user_id` 
from `user` 
inner join `user_role` 
on `user`.`id` = `user_role`.`user_id` 
where `user_role`.`role_id` = ?
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
        "pivot": {
            "role_id": 1,
            "user_id": 1
        }
    }
]
```

示例4：获取中间表字段

```php
public function roles()
{
    return $this->belongsToMany(Role::class, 'user_role', 'user_id', 'role_id')
        ->withPivot('id', 'detail');
}
```

```php
User::find(1)->roles;
```

```sql
select * from `user` where `user`.`id` = ? limit 1

select `role`.*, 
    `user_role`.`user_id` as `pivot_user_id`, 
    `user_role`.`role_id` as `pivot_role_id`, 
    `user_role`.`id` as `pivot_id`, 
    `user_role`.`detail` as `pivot_detail` 
from `role` 
inner join `user_role` 
on `role`.`id` = `user_role`.`role_id` 
where `user_role`.`user_id` = ?
```

```json
[
    {
        "id": 1,
        "title": "评论审核员",
        "create_time": "2022-07-11 10:10:20",
        "update_time": "2022-07-11 10:10:54",
        "delete_time": null,
        "pivot": {
            "user_id": 1,
            "role_id": 1,
            "id": 1,
            "detail": "备注详情1"
        }
    },
    {
        "id": 2,
        "title": "账号管理员",
        "create_time": "2022-07-11 10:10:26",
        "update_time": "2022-07-11 10:10:47",
        "delete_time": null,
        "pivot": {
            "user_id": 1,
            "role_id": 2,
            "id": 2,
            "detail": "备注详情2"
        }
    }
]

```

示例5：筛选数据

```php
public function roles()
{
    return $this->belongsToMany(Role::class, 'user_role', 'user_id', 'role_id')
        ->wherePivot('id', 1);
}
```

```php
User::find(1)->roles;
```

```sql
select * from `user` where `user`.`id` = ? limit 1

select `role`.*, 
    `user_role`.`user_id` as `pivot_user_id`, 
    `user_role`.`role_id` as `pivot_role_id` 
from `role` 
inner join `user_role` 
on `role`.`id` = `user_role`.`role_id` 
where `user_role`.`user_id` = ? and `user_role`.`id` = ?
```

```json
[
    {
        "id": 1,
        "title": "评论审核员",
        "create_time": "2022-07-11 10:10:20",
        "update_time": "2022-07-11 10:10:54",
        "delete_time": null,
        "pivot": {
            "user_id": 1,
            "role_id": 1
        }
    }
]
```

## 其他关联关系

- 远程一对一
- 远程一对多
- 多态一对一
- 多态一对多
- 多态多对多

