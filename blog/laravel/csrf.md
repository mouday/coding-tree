# 表单伪造和 CSRF 保护

表单提交会出现419错误

```html
<form action="/task/getform" method="post"> 
    用户名:<input type="text" name="user">
    <button type="submit">提交</button>
</form>
```

csrf_token

```html
<!-- CSRF令牌保护 -->
<input type="hidden" name="_token" value="{{csrf_token()}}">
<!-- 修改提交方式 -->
<input type="hidden" name="_method" value="PUT">

<!-- 快捷方式 -->
@csrf
@method('PUT')
```

配置白名单

```php
<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;

class VerifyCsrfToken extends Middleware
{
    /**
     * The URIs that should be excluded from CSRF verification.
     *
     * @var array<int, string>
     */
    protected $except = [
        'api/*'
    ];
}

```
