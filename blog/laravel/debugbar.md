# Debugbar 调试器

安装Debugbar

```bash
composer8 require barryvdh/laravel-debugbar
```

生成一个配置文件

```bash
php8 artisan vendor:publish --provider="Barryvdh\Debugbar\ServiceProvider"
```

需要配合view模板使用

页面底部的调试工具

```php
// @deprecated
// use Barryvdh\Debugbar\Facade as DebugBar;
use Barryvdh\Debugbar\Facades\Debugbar;

DebugBar::info('信息!');
```

```php
// config/debugbar.php

// 关闭调试工具
'enabled' => env('DEBUGBAR_ENABLED', false),
```

```php
//手工开启或关闭 
DebugBar::enable(); 
DebugBar::disable();
```