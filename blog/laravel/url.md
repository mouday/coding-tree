# 生成 URL

助手函数`url()`

```php
// 生成指定的 url
$user = User::find(19);
return url('/user/'.$user->id);

//得到当前 url，不带参数 
return url()->current(); 

//得到当前 url，带参数 
return url()->full(); 

//得到上一个 url
return url()->previous();
```

`route()`方法

```php
// 生成命名路由的url
Route::any('/url/{id}','UserController@url')
    ->name('url.id');

return route('url.id', ['id'=>5]);

// 使用控制器返回 url
return action('UserController@index', ['id'=>5]);
```

追加一个哈希签名字符串，用于验证

```php
return url()->signedRoute('url.id', ['id' => 5]);

// 验证哈希签名
return request()->hasValidSignature();
```