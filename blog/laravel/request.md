# 请求和依赖注入

```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class TaskController extends Controller
{
    // 自动得到 Request 对象，这个就是注入
    public function index(Request $request)
    {
        return [
            // 请求参数
            'name'=> $request->input('name'),
            // 全部请求参数
            'all'=> $request->all(),
            // 请求路径
            'uri'=> $request->path(),
            'url'=> $request->url(),
            'fullUrl'=> $request->fullUrl(),
            // 判断HTTP请求的方式
            'isGet'=> $request->isMethod('GET'),
            // 判断当前的uri是否匹配
            'isTask'=> $request->is('task/*'),
        ];
    }
}
```

请求地址：
```
http://127.0.0.1:8000/task?name=Tom&age=23
```
```json
{
    "name": "Tom",
    "all": {
        "name": "Tom",
        "age": "23"
    },
    "uri": "task",
    "url": "http://127.0.0.1:8000/task",
    "fullUrl": "http://127.0.0.1:8000/task?age=23&name=Tom",
    "isGet": true,
    "isTask": false
}
```