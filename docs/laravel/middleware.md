# 中间件 Middleware

## 路由中间件

中间件：当程序接收HTTP请求时，拦截后进行过滤和处理

创建一个check中间件

```bash
php artisan make:middleware Check
```

实现一个简单的登录身份验证的效果

首先创建一个Login控制器

```php
class LoginController
{
    public function index()
    {
        echo '管理员，您好!'; 
    }

    public function login()
    {
        echo '登录失败!'; 
    }
}
```

```php
Route::get('/admin','LoginController@index');
Route::get('/login','LoginController@login');
```

要求，当Http接受`id=1` 的情况下，它就是管理员，跳转index否则login

```php
//固定方法，固定格式
public function handle($request, Closure $next) {
    //这里编写验证跳转方法
    if ($request->get('id') != 1) {
       return redirect(url('/login'));
    }

    // 固定返回格式，让其继续往下执行
    return $next($request);
}
```

注册中间件

```php
// Http/Kernel.php
protected $routeMiddleware = [
    'check'=>\App\Http\Middleware\Check::class,
]
```

执行中间件
```php
// 这种中间件，属于前置中间件
Route::get('/admin','LoginController@index')
    ->middleware('check');
```

- 前置中间件：先拦截 Http 请求，再执行主体代码
- 后置中间件：先执行主体代码，再拦截处理;

```php
// 固定方法，固定格式
public function handle($request, Closure $next) {
    //先执行主体代码
    $response = $next($request);
    //再进行拦截 Http 请求处理 echo '我是后置中间件';
    //固定格式返回
    return $response;
}
```

## 中间件进阶

设置多个中间件

```php
->middleware('check', 'auth');
```

没有在配置中注册中间件,采用完整的类名来进行调用
```php
->middleware(\App\Http\Middleware\Check::class);
```

全局中间件，每次执行都必然调用
```php
protected $middleware = [
    \App\Http\Middleware\Every::class,
]
```

中间件的核心方法可以有第三个参数，可以在控制器调用时传递

```php
public function handle($request, Closure $next, $param);

->middleware('check:abc');
```

中间件组，如果有一些需要固定调用多个中间件，我们可以将它群组
```php
protected $middlewareGroups = [
    'mymd' => [
        'check'=>\App\Http\Middleware\Check::class,
    ]
];
```

中间件的terminate()方法，可以在中间件响应完之后(return$next)再调用
```php
public function terminate($request, $response)
{
    echo '<br>Http响应完毕之后再调用我'; 
}
```

中间件也可以在控制器的构造方法里调用，这里注意错误跳转会死循环;

```php
public function __construct()
{
    $this->middleware('check:abc');
}
```