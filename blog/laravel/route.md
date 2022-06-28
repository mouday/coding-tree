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

## 路由命名

```php
// 指定路由的名称
Route::get('/task', function(){
    return 'task';
})->name('index.task');

// 使用助手函数生成URL(URL是URI的子集)
Route::get('/url', function(){
    return route('index.task');
    // http://127.0.0.1:8000/task
});

// 传参
Route::get('/url', function(){
    return route('index.task', ['name'=> 'Tom']);
    // http://127.0.0.1:8000/task?name=Tom
});

// 路由跳转
Route::get('/url', function(){
    return redirect()->route('index.task', ['name'=> 'Tom']);
    // 跳转地址：http://127.0.0.1:8000/task?name=Tom
});

// 生成相对地址
Route::get('/url', function(){
    return route('index.task', ['name'=> 'Tom'], false);
    // /task?name=Tom
});
```

## 路由分组

```php
// 添加路由前缀
Route::group(['prefix' => 'api'], function () {
    // http://127.0.0.1:8000/api/index
    Route::get('/index', function () {
        return 'index';
    });

    // http://127.0.0.1:8000/api/task
    Route::get('/task', function () {
        return 'task';
    });
});


// 等价于（推荐）
Route::prefix('api')->group(function () {
    // http://127.0.0.1:8000/api/index
    Route::get('/index', function () {
        return 'index';
    });

    // http://127.0.0.1:8000/api/task
    Route::get('/task', function () {
        return 'task';
    });
});

// 路由中间件
Route::middleware('middleware')->group(function () {});

// 子域路由
Route::domain('127.0.0.1')->group(function () {});

// 命名空间
Route::namespace('Admin')->group(function () {});

// 路由名称前缀
Route::name('admin.')->group(function () {
    Route::get('/task', function () {
        return 'task';
    })->name('task');
    // admin.task
});
```

## 单动作控制器

```bash
php artisan make:controller OneController --invokable
```

```php
<?php

namespace App\Http\Controllers;

class OneController extends Controller
{
    public function __invoke()
    {
       return 'one';
    }
}

```

路由

```php
// http://127.0.0.1:8000/one
Route::get('/one', OneController::class);
```

## 回退路由

```php
// 错误处理，注意：必须放在所有路由最底部
Route::fallback(function () {
    return 'error';
    // 返回404页面
    // return view('404');
});
```

## 当前路由

### 当前路由信息

```php
Route::get('/task', function(){
    return json_encode(Route::current());
});
```

输出

```json
{
    "uri": "task",
    "methods": [
        "GET",
        "HEAD"
    ],
    "action": {
        "middleware": [
            "web"
        ],
        "uses": {},
        "namespace": null,
        "prefix": "",
        "where": []
    },
    "isFallback": false,
    "controller": null,
    "defaults": [],
    "wheres": {
        "id": "[0-9]+"
    },
    "parameters": [],
    "parameterNames": [],
    "computedMiddleware": [
        "web"
    ],
    "compiled": {}
}
```

### 当前路由名称

```php
Route::get('/task', function(){
    return Route::currentRouteName();
    // index.task
})->name('index.task');
```

### 当前路由指向的方法

```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

class TaskController extends Controller
{

    public function index()
    {
        return Route::currentRouteAction();
        // App\Http\Controllers\TaskController@index
    }

}

```

```php
Route::get('/task',[TaskController::class, 'index']);
```

https://www.bilibili.com/video/BV1gE411j78F?p=6&spm_id_from=pageDriver