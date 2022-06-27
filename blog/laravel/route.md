# Route路由

## 路由配置

```php
// routes/web.php

# 接收get请求 http://127.0.0.1:8000/test
Route::get('/test', function () {
    return 'Hello Laravel';
});

# any接收任何请求方式
Route::any('/test', function () {
    return 'Hello Laravel';
});

# 指定提交方式
Route::match(['get', 'post'], '/test', function () {
    return 'Hello Laravel';
});

# 接收参数 http://127.0.0.1:8000/test/5
Route::get('/test/{id}', function ($id) {
    return $id;
});
```

## 控制器

```bash
php8 artisan make:controller TaskController
```

自动生成的模板代码

```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class TaskController extends Controller
{
    //
}

```

编写业务代码

```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class TaskController extends Controller
{

    public function index()
    {
        return 'task';
    }

    public function read($id)
    {
        return $id;
    }
}

```

路由配置

```php
// routes/web.php
<?php

use App\Http\Controllers\TaskController;
use Illuminate\Support\Facades\Route;

Route::get('/task', [TaskController::class, 'index']);
Route::get('/task/read/{id}', [TaskController::class, 'read']);
```

## 路由参数

参数约束

```php
// 允许：http://127.0.0.1:8000/user/5
// 报错：http://127.0.0.1:8000/user/ooxx

// 单个参数
Route::get('/user/{id}', function ($id) {
    return $id;
})->where('id', '[0-9]+');

// 多个参数
Route::get('/user/{id}/{name}', function ($id, $name) {
    //
})->where([
    'id'   => '[0-9]+', 
    'name' => '[a-z]+'
]);
```

全局约束

```php
// App\Providers\RouteServiceProvider
<?php

namespace App\Providers;

class RouteServiceProvider extends ServiceProvider
{
    public function boot()
    {
        // 添加全局约束
        Route::pattern('id', '[0-9]+');
    }
}

```

局部约束

```php
Route::get('/user/{id}', function ($id) {
    return $id;
})->where('id', '.*');
```


## 重定向路由

```php
// 状态码默认302，临时重定向
Route::redirect('/index', '/task');

// 301 永久重定向
Route::redirect('/index', '/task', 301);

// 等价于 永久重定向
Route::permanentRedirect('/index', '/task');

```

## 视图路由

视图模板

```html
{{-- resources/views/task.blade.php --}}
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    {{-- 变量 --}}
    {{$name}}
</body>
</html>
```

> ！+ tab 可快速创建HTML模板

```php
// http://127.0.0.1:8000/task

// 方式一：
Route::view('/task', 'task', [
    'name'=> 'Tom'
]);

// 方式二：使用助手函数返回view
Route::get('/task', function () {
    return view('task', [
        'name' => 'Tom'
    ]);
});

// 方式三：
Route::get('/task', [TaskController::class, 'index']);
```

Controller返回view

```php
<?php

namespace App\Http\Controllers;

class TaskController extends Controller
{

    public function index()
    {
        return view('task', [
            'name' => 'Tom'
        ]);
    }
}

```
https://www.bilibili.com/video/BV1gE411j78F?p=4&spm_id_from=pageDriver&vd_source=efbb4dc944fa761b6e016ce2ca5933da