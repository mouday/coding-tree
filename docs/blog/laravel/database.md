# 数据库 Database

操作数据库的方式：

1. 原生
2. 查询构造器
3. EloquentORM(关系型对象映射器)

## 数据库配置

config/database.php

```php
<?php

return [
    'default' => env('DB_CONNECTION', 'mysql'),

    'connections' => [
        'mysql' => [
            'driver' => 'mysql',
            'url' => env('DATABASE_URL'),
            'host' => env('DB_HOST', '127.0.0.1'),
            'port' => env('DB_PORT', '3306'),
            'database' => env('DB_DATABASE', 'forge'),
            'username' => env('DB_USERNAME', 'forge'),
            'password' => env('DB_PASSWORD', ''),
            'unix_socket' => env('DB_SOCKET', ''),
            'charset' => 'utf8mb4',
            'collation' => 'utf8mb4_unicode_ci',
            'prefix' => '',
            'prefix_indexes' => true,
            'strict' => true,
            'engine' => null,
            'options' => extension_loaded('pdo_mysql') ? array_filter([
                PDO::MYSQL_ATTR_SSL_CA => env('MYSQL_ATTR_SSL_CA'),
            ]) : [],
        ],
    ],
];
```

.env 配置数据库
```bash
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=laravel
DB_USERNAME=root
DB_PASSWORD=
```

## 查询

### 原生查询

```php
DB::select('select * from laravel_user');
```

### 查询构造器
```php
DB::table('user')->find(19);
```

### EloquentORM模型

创建模型

```bash
php artisan make:model Http/Models/User
```

查询
```php
User::all();
```

模型编码规范要求数据表是复数

强制使用现有的数据表名

```php
protected $table = 'user';
```

https://www.bilibili.com/video/BV1gE411j78F?p=11&spm_id_from=pageDriver&vd_source=efbb4dc944fa761b6e016ce2ca5933da