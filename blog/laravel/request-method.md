# 请求的常用方法

参数接收

```php
// 参数 默认值
$request->input('name', 'default');

// 空参数和 all()效果一样 
$request->input();

// 动态方式获取
$request->name;
```

接受二维数组

```html
<form action="/post" method="get">
    <input type="checkbox" name="select[][a]" value="1"> 
    <input type="checkbox" name="select[][b]" value="2"> 
    <input type="checkbox" name="select[][c]" value="3"> 
    <button type="submit">发送</button>
</form>
```

```php
$request->input('select.1.b');
```

Request对象
```php
// 返回布尔值 
$request->boolean('name');
 
// 返回 IP 
$request->ip();

// 只接受固定参数
$request->only(['age', 'gender']);
  
// 排除不要的参数 
$request->except(['name']);

// 判断参数是否存在
return $request->has('name');

// 判断参数是否全部存在
return $request->has(['name', 'age']);
     
// 判断参数只有一个存在，就返回 true
return $request->hasAny(['name', 'age']);
   
// 判断参数存在，并且不为空
return $request->filled('name');

// 判断参数不存在(为空也不行)
return $request->missing('name');
```

助手函数
```php
request()->input();
```