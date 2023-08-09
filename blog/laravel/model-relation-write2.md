# 模型多对多的关联写入

```php

class User extends Model
{
    protected $table = 'user';

    //多对多关联
    public function roles()
    {
        return $this->belongsToMany(Role::class, 'user_role', 'user_id', 'role_id');
    }
}

class Role extends Model
{
    protected $table = 'role';
}
```

多对多的新增:

```php
// 得到要添加权限的用户
$user = User::find(1); 
// 得到权限的 id,比如超级管理员 
$roleId = 1; 
// 设置成超级管理员 
$user->roles()->attach($roleId);
```

```sql
select * from `user` where `user`.`id` = ? limit 1  
-- [1]

insert into `user_role` (`role_id`, `user_id`) values (?, ?)  
-- [1,1]  
```

给中间表附加detail字段的数据，可以使用第二参数

```php
$user = User::find(1); 

$user->roles()->attach(1, ['detail'=> '备注']);
```

```sql
select * from `user` where `user`.`id` = ? limit 1  
-- [1]  

insert into `user_role` (`detail`, `role_id`, `user_id`) values (?, ?, ?)  
-- ["备注",1,1]  

```

移出某个用户的角色权限
```php
// 删除一个角色权限 
$user->roles()->detach(1);

// PS:如果不指定中间表 id，那么就移出这个用户的所有权限角色;
```
```sql
select * from `user` where `user`.`id` = ? limit 1  
-- [1]

delete from `user_role` where `user_role`.`user_id` = ? and `user_role`.`role_id` in (?)  
-- [1,1]  
```

批量处理

```php
// 这里传递的是角色权限表的 ID
$user->roles()->attach([1,2,3]); 

$user->roles()->detach([1,2,3]);
```

```sql
select * from `user` where `user`.`id` = ? limit 1  
-- [1] 

insert into `user_role` (`role_id`, `user_id`) values (?, ?), (?, ?), (?, ?)  
-- [1,1,2,1,3,1] 
```

```sql
sql: select * from `user` where `user`.`id` = ? limit 1  
-- [1]  

delete from `user_role` where `user_role`.`user_id` = ? and `user_role`.`role_id` in (?, ?, ?)  
-- [1,1,2,3]  
```

同步关联，已存在不在新增

```php
$user->roles()->sync([1,2,3])
```

```sql
select * from `user` where `user`.`id` = ? limit 1  
-- [1]  

select * from `user_role` where `user_role`.`user_id` = ?  
-- [1]  

insert into `user_role` (`role_id`, `user_id`) values (?, ?)  
-- [1,1]  

insert into `user_role` (`role_id`, `user_id`) values (?, ?)  
-- [2,1]  

insert into `user_role` (`role_id`, `user_id`) values (?, ?)  
-- [3,1]  
```

更新指定roleId的额外字段

// 更新中间表的额外字段 
```php
$user->role()->updateExistingPivot(1, ['detail'=>'喀']);
```

```sql
select * from `user` where `user`.`id` = ? limit 1  
-- [1]  
update `user_role` set `detail` = ? where `user_role`.`user_id` = ? and `role_id` in (?)  
-- ["喀",1,1]  
```

