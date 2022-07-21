# 表单验证validate

## 表单快速验证

两个路由:一个表单，一个处理表单

```php
//表单页
Route::get('/task/form','TaskController@form');
//接收页
Route::post('/task/receive','TaskController@receive');
```

表单

```html
<form action="/task/receive" method="post">
    @csrf
用户名:<input type="text" name="username"> 
密码:<input type="password" name="password"> 
<button type="submit">提交</button>
</form>
```

表单处理页
```php
public function receive(Request $request)
{
    // 验证请求方式 
    // 左边为验证字段，右边为验证规则，每个规则竖线隔开 
    // 比如 required 不得为空，min 不等小于，max 不得大于 
    $request->validate([
        'username'             => 'required|min:2|max:10',
        'password'             => 'required|min:6', 
    ]);
    // 只有通过才能执行下面的语句，否则返回表单页
    return '恭喜验证通过!'; 
}
```

如果验证没有被通过，会自动重定向到提交页，并将错误信息存储到session中
```php
// 内部操作是通过中间件:Illuminate\View\Middleware\ShareErrorsFromSession
@if($errors->any())
    <div>
        <ul>
        @foreach ($errors->all() as $error)
            <li>   $error   </li>
        @endforeach
        </ul> 
    </div>
@endif    
```

也可以单独设置错误信息，使用@error指令

```php
@error('username')
        <div>{{  $message }} : 用户名非法!</div>
@enderror

@error('password')
    <div> {{  $message }} : 密码非法!</div>
@enderror
```

规则写法

```php
//数组方式验证 
$request->validate([
    'username' => ['required', 'min:2', 'max:10'],
    'password' => ['required', 'min:6'] 
]);
```

## 验证类的使用

创建一个验证类

```bash
php artisan make:request Form
```

```php
// Http\Request\Form.php
public function authorize()
{
    // 默认 false，为关闭授权，关闭状态会 403 
    // 比如判断这个用户是否有操作权限
    return true;
}

public function rules()
{
    return [ 
        //规则
        'username'             => 'required|min:2|max:10',
        'password'             => 'required|min:6', 
    ];
}
```
使用验证类

```php
// 通过验证类验证 
$request->validated();
```

设置成中文提示
```php
//验证器类方法
public function messages()
{
    return [
        'username.required' => '用户名不得为空~', 
        'username.min'      => '用户名不得小于2位~', 
        'username.max'      => '用户名不得大于10位~',
        'password.required' => '密码不得为空',
        'password.min'      => '密码不得小于6位~',
    ]
}
```
自定义属性名，而其它采用默认提示
```php
// 提示语言包在:resources\lang\en\validation.php
public function attributes()
{
    return [
        'username' => '用户名',
    ]; 
}
```

请求验证之前，修改提交的请求数据

```php
protected function prepareForValidation()
{
    $this->merge([
        'username' => 'Mr.Lee'
    ]); 
}
```

## 创建手动验证

快速验证方式

```php
$validateData = $request->validate([
    'username'             => 'required|min:2|max:10',
    'password'             => 'required|min:6', 
]);

//验证通过后得到提交的值 
dd($validateData);
```

创建手动验证

```php
//手动创建验证器
$validator = Validator::make($request->post(), [
    'username'             => 'required|min:2|max:10',
    'password'             => 'required|min:6', 
]);

//如果没有通过的话
if ($validator->fails()) {
    //跳转后，并将错误保存，还可以返回上一次填的信息
    return redirect('/task/form')
        ->withErrors($validator)
        ->withInput();
}
```

```php
// 快速验证，也支持 old 记忆上一次表单数据的功能
用户名:<input type="text" name="username" value="{{old('username')}}">
```

设置$errors的多个错误包

```php
$validator = Validator::make($request->post(), [
    'username' => 'required|min:2|max:10', 
    'password' => 'required|min:6',
])->validateWithBag('post'); 
// 设置快速验证和手动验证

if ($validator->fails()) { 
    //适合手动验证
    return redirect('/task/form')
        ->withErrors($validator, 'post')
        ->withInput();
}

{{--多个错误包调用--}} 
{{$errors->post}}
```

在验证完毕之前，通过附加回调添加更多的自定义错误信息

```php
//验证钩子
$validator->after(function ($validator) {
    $validator
        ->errors()
        ->add('info', '隐藏字段info的值不存在'); 
});
```

$errors对象方法

```php
any()判断
all()获取全部

{{--获取指定字段第一条信息--}} 
{{$errors->first('username')}}

{{--判断指定字段是否有错误信息--}}
{{$errors->has('username')}}
```

## 验证规则大全

文档：https://learnku.com/docs/laravel/9.x/validation/12219#available-validation-rules

```php
Accepted
Accepted If
Active URL
After (Date)
After Or Equal (Date)
Alpha
Alpha Dash
Alpha Numeric
Array
Bail
Before (Date)
Before Or Equal (Date)
Between
Boolean
Confirmed
Current Password
Date
Date Equals
Date Format
Declined
Declined If
Different
Digits
Digits Between
Dimensions (Image Files)
Distinct
Email
Ends With
Enum
Exclude
Exclude If
Exclude Unless
Exclude Without
Exists (Database)
File
Filled
Greater Than
Greater Than Or Equal
Image (File)
In
In Array
Integer
IP Address
MAC Address
JSON
Less Than
Less Than Or Equal
Max
MIME Types
MIME Type By File Extension
Min
Multiple Of
Not In
Not Regex
Nullable
Numeric
Password
Present
Prohibited
Prohibited If
Prohibited Unless
Prohibits
Regular Expression
Required
Required If
Required Unless
Required With
Required With All
Required Without
Required Without All
Required Array Keys
Same
Size
Sometimes
Starts With
String
Timezone
Unique (Database)
URL
UUID
```

(1) alpha_dash:字段必须由字母、数字破折号(-)和下划线(_)构成;

```php
'username' => 'required|alpha_dash',
```


(2) between:字段长度必须在指定的区间之间; 
```php
'username' => 'required|between:2,6',
```

(3) .size:6:字段长度固定在某个值; 
```php
'username' => 'required|size:6',
```

(4) .email:字段必须符合 email 格式; 
```php
'username'   => 'required|email',
```

(5) .unique:users:字段值是唯一的，通过指定数据表字段检查;
```php
'username'  => 'required|unique:users',
```

(6) .confiremed:这个基本用于密码和密码确认，固定了字段名称;
```php
'password'  => 'required|min:6|confirmed',

<input type="password" name="password_confirmation">
```

(7) different:password:字段和另一个字段不可以相同的验证;

```php
'username' => 'required|different:password',
```


(8) .ip/json:字段是否是 ip 地址/字段是否是 json 数据;
```php
'username'             => 'required|ip', 'username'             => 'required|json',
```

其它用法

Rule类

```php
'username'  => 'required|in:tom,jack,lusy',
    
'username' => [ 
    'required', 
    Rule::in(['tom', 'jack', 'lusy'])
],
```

可以结合where来限制验证范围等操作

```php
//验证是否重复
'username'             => Rule::unique('users'),

'username'             => Rule::unique('users')
                            ->where(function ($query) {
                                $query->where('id', 20); 
                            }),
```
