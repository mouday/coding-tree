# Cookie

获取Cookie
```php
// 注意 Laravel 中 cookie 都是加密的，原生 cookie 只能获取加密信息
return $_COOKIE['laravel_session'];
//    eyJpdiI6IjBINjVlYW8vSkM5NnVVZW1hUm81T1E9PSIsInZhbHVlIjoiUm16YmdTelZiMUpJZXQ2elpYcDc1dVB0UXFhSWpxaWsyOFNNTzZBZWhVUTZyRjRzWWoycmdTQzI3ZnM4eklpWUZNd21SSlNIK3d4UjdWZmpKSm9JWWx4M0RDTktDOGh2L3B0RlAvMFozYlBVL0hvOEhKYXBsLzQwVmlqMEh5blkiLCJtYWMiOiI2ZTNkZjQxN2Y1ZjAxYmYwZDQxYjg3MTAxNGZmMzVkZjFhZDE2MzhjZjdlYWFjMzc5YTlmYWQ2OGU3ZDJjMjE4IiwidGFnIjoiIn0=

//使用 request()->cookie 获取解密后的 cookie 信息
return request()->cookie('laravel_session');
// sh6TujUjSKMI6ENbXbBwy2eeuTXsuNSkCDUsQGHf

//使用Cookie获取，
// Illuminate\Support\Facades\Cookie; 

return Cookie::get('laravel_session');
// sh6TujUjSKMI6ENbXbBwy2eeuTXsuNSkCDUsQGHf
```

创建cookie

```php
return response('Hello Cookie')->cookie('name', 'Mr.Lee', 10);

//推荐这个，清爽很多 
Cookie::queue('age', 100, 10);

//助手函数，创建一个实例，让写入可以更加灵活 
$cookie = cookie('gender', '男', 10); 
Cookie::queue($cookie);

// 完整版 过期时间(分钟),路径，域名，https，仅 http
cookie($name, $value, $minutes, $path, $domain, $secure, $httpOnly)
```

默认cookie是加密存放的，如果想某个cookie不加密，在中间件文件夹设置
```php
// Http/Middleware/milldelEncryptCookies.php
protected $except = [
    'name'
];
```