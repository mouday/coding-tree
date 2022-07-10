# 模型的数据集合

```php
$users = User::get();

//使用集合方法 map 可以对输出的字段进行转换
$list = $users->map(function ($user) {
    $user->name = "[{$user->name}]";
    return $user;
});

return $list;
```

常用的集合方法

```php
//判断集合中是否包含指定的模型实例
$users->contains(19);
$users->contains(User::find(19)); //返回不在集合中的所有模型

$users->diff(User::whereIn('id', [19,20,21])->get()); //返回给定主键外的所有模型
$users->except([19,20,21]);
//集合也有 find 方法
$users->find(19);
//返回集合的数量
$users->count();
//返回所有模型的主键
$users->modelKeys();

//返回主键的所有模型
$users->only([19,20,21]); //返回集合中的唯一模型
$users->unique();
```

https://www.bilibili.com/video/BV1gE411j78F?p=25&spm_id_from=pageDriver&vd_source=efbb4dc944fa761b6e016ce2ca5933da