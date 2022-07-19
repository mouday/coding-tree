# Session

启动Web后，默认会有session

获取所有session
```php
return request()->session()->all()
```

获取某一个session

```php
// 获取其中一个 session
return request()->session()->get('_token');

// 参数 2，闭包设置默认值
return request()->session()->get('name', function () {
    return 'no session name';
});

return Session::get('_token');
```

助手函数session()
```php
// 获取 session 值
return session('_token');

// 获取 session 值并设置默认值
return session('name', 'no session name');
```

判断是否存在session有两种方案

```php
// 判断是否存在且不为null 
return Session::has('name'); 

// 判断是否存在，即使是null 
return Session::exists('name'); 
```

存储session值

```php
//设置 session 值 
session(['name' => 'Mr.Lee']);
  
// 也支持 request()存储
Session::put('name', 'MrWang');
```

存储数组
```php
//session 数组方式 
Session::push('info.name', 'Mr.Lee'); 
Session::push('info.name', 'Mr.Wang'); 
Session::push('info.name', 'Mr.Zhang');

return Session::get('info');
```

闪存数据
```php
// 存储的 session 只能被获取一次，然后自动删除，flash 也称为闪存数据 
Session::flash('name', 'Mr.Lee');

// 本次请求获取，不要删除数据，给下一次请求时再自行删除，这是保存所有闪存数据 
Session::reflash(); 

// 保存单独的删除数据
Session::keep(['name']);

return Session::get('name');
```

删除一条或多条 session 数据
```php
// 删除一条数据
Session::forget('name');

Session::forget(['name']) 

return Session::get('name');

// 删除一条数据，并返回 
Session::pull('info');

// 删除所有数据 
Session::flush();
```

重新生成 SessionID

```php
//重新生成 SessionID 
Session::regenerate();

// 获取 SessionID
return Cookie::get('laravel_session');
```