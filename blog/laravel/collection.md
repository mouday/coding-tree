# 集合 collection

文档：https://learnku.com/docs/laravel/9.x/collections/12225

```php
//使用 dd 查看它的类型 
dd($collection);

// 自定义集合方法
$collection = collect(['Tom', 'Jack', '王五', null]);

Collection::macro('toUpper', function () {
    return $this->map(function ($value) {
        return strtoupper($value);
    });
});

return $collection->toUpper();
// ["TOM", "JACK","王五",""]
```

## 创建集合

### collect

```php
// 创建一个数据集合
$collection = collect(['张三', '李四', '王五', null]);
```

### pad

```php
// 将用给定的值填充数组
collect()->pad(5, 0);
        
// [0, 0, 0, 0, 0 ]
```

### range

```php
// 返回一个包含指定范围之间整数的集合
collect()->range(0, 5);

// 或者
Collection::range(0, 5);

// [0, 1, 2, 3, 4, 5 ]
```

### times

```php
// 通过调用给定次数的回调函数来创建新集合
Collection::times(3, function ($number) {
    return $number * 2;
});
// [2, 4, 6 ]
```

## 查询集合

### all

```php
// 返回由集合表示的底层数组
$collection = collect([1, 2, 3, 3, 4]);

// 全部元素
$collection->all();
// [1,2,3,3,4]
```


### first

```php
// 返回判断成立的第一条数值
$collection = collect([1, 2, 3, 4]);

return $collection->first(function ($value) {
    return $value > 2;
    }
);
// 3
// 相关的还有 every()、except()、only()、firstWhere()、last()等方法;
```

### get

```php
// 通过键名找值
$collection = collect([
    'name'=>'Tom', 
    'age'=> 23
]); 

return $collection->get('name');
// Tom

// 还有 pluck()等;
```

### has

```php
// 判断集合中是否存在指定键
$collection = collect([
    'name'=>'Tom', 
    'age'=> 23
]); 

return $collection->has('name');
// 1
```

### search

```php
// 查找
$collection = collect(['Tom', '李四', '王五', null]);

// 查找 返回 key，找不到返回 false
$collection->search("李四");
// 1
```

### random

```php
// 从集合中返回一个随机项
$collection = collect([1, 2, 3, 4, 5]);

return $collection->random();
// 3
```


### where

```php
$collection = collect([ 
    ['name'=>'Mr.Lee', 'gender'=>'男'], 
    ['name'=>'Miss.Zhang', 'gender'=>'女']
]);

return $collection->where('name', 'Mr.Lee');

// [
//     {
//     "name": "Mr.Lee",
//     "gender": "男"
//     }
// ]
```

### values

```php
// 返回键被重置为连续编号的新集合
$collection = collect([
    3 => 1,
    4 => 2
]);

$collection->values();

// [1, 2 ]
```

### keys 

```php
// 返回集合的所有键
$collection = collect([
    3 => 1,
    4 => 2
]);

$collection->keys();

// [3, 4 ]
```

## 集合修改

### pop

```php
// 移出集合中最后一个值
$collection = collect([1, 2, 3, 4, 5]); 
$collection->pop();
return $collection;
// [1, 2, 3, 4 ]

// 还有 pull()、push()、put()方法
```

### slice

```php
// 切片
$collection = collect([1, 2, 3, 4, 5]);

$result = $collection->slice(3);

// "result": 
// {
//   "3": 4,
//   "4": 5
// }

// "collection": 
// [1, 2, 3, 4, 5 ]
```

### splice

```php
// 删除数组中指定索引的元素
$collection = collect([1, 2, 3, 4, 5]);

$result = $collection->splice(3);

// "result": 
// [4, 5 ]

// "collection": 
// [1, 2, 3 ]
```

### shift

```php
// 从集合中移除并返回第一项
$collection = collect([1, 2, 3, 4, 5]);

$collection->shift();

return $collection;

// [2, 3, 4, 5 ]
```


## 集合转换


### flatten

```php
// 多维数组转换为一维
$collection = collect([1, 2, [3, 4]]);

$collection->flatten();
// [ 1, 2, 3, 4]
```


### chunk

```php
// 集合的分割，这里好像有bug
$collection->chunk(2);
// [
//     ["张三", "李四" ],
//     { "2": "王五", "3": null}
// ]

// 解决：重新获取值，舍弃原有的key
$collection->chunk(2)
    ->map(function (Collection $value) {
        return $value->values();
    });
// [
//     ["Tom", "Jack"],
//     ["王五", null]
// ]
```


### merge

```php
// 集合合并
$collection = collect([
    'name' => 'Tom', 
    'age' => 23
]);

$merged = $collection->merge([
    'name' => 'Jack', 
    'school' => 'puk'
]);

return $merged;

// {
//     "name": "Jack",
//     "age": 23,
//     "school": "puk"
// }
```


### shuffle

```php
// 随机打乱集合中的项目
$collection = collect([1, 2, 3, 4, 5]);

$collection->shuffle();

// [5, 1, 2, 4, 3 ]
```


### filter

```php
// 过滤
$collection->filter(function ($item) {
    return $item;
});
// ["张三", "李四", "王五"]
```

### map

```php
// 映射
$collection->map(function ($value, $key) {
    return '[' . $value . ']';
});
// ["[张三]", "[李四]", "[王五]", "[]"]
```

### reduce

```php
// 求集合的乘积
$collection = collect([1, 2, 3, 4, 5]);

return $collection->reduce(function ($preValue, $value){
    return $preValue * $value;
}, 1);

// 120
```

### sort

```php
// 排序
$collection = collect([3, 1 , 5, 2, 7]);
return $collection->sort()->values();

// [1, 2, 3, 5, 7 ]

// sortBy()、sortByDesc()、sortKeys()等
```

### reverse

```php
// 反转集合项的顺序，保留原始键
$collection = collect(['a', 'b', 'c', 'd', 'e']);

$reversed = $collection->reverse();

return $reversed;

// {
//     "0": "a",
//     "1": "b",
//     "2": "c",
//     "3": "d",
//     "4": "e"
// }
```




### duplicates

```php
// 重复的值
$collection = collect([1, 2, 3, 3, 4]);

$collection->duplicates();
// {
//   "3": 3
// }
// 严格派生方法:duplicatesStrict()
```

### unique

```php
// 返回集合中所有唯一项。返回的集合保留着原数组的键
$collection = collect([1, 1, 2, 2, 3, 4, 2]);

$collection->unique();

// {
// "0": 1,
// "2": 2,
// "4": 3,
// "5": 4
// }
```


### toJson

```php
// 将集合转换成 JSON 字符串
$collection = collect(['name' => 'Desk', 'price' => 200]);

$collection->toJson();

// {
//   "name": "Desk",
//   "price": 200
// }
```


### toArray

```php
// 将集合转换成 PHP array
$collection = collect(['name' => 'Desk', 'price' => 200]);

$collection->toArray();

// {
//   "name": "Desk",
//   "price": 200
// }
```


## 分组聚合

### avg

```php
// 平均值
$collection = collect([1, 2, 3, 3, 4]);
$collection->avg();
// 2.6


$collection = collect([
    ['男' => 1], 
    ['女' => 1], 
    ['男' => 3]
]);

$collection->avg('男');
// 2
```

### count

```php
// 统计总数
$collection = collect([1, 2, 3, 3, 4]);
$collection->count();
// 5

// 相关的还有 sum()、min()、max()等
```

### countBy

```php
// 分组统计
$collection = collect([1, 2, 3, 3, 4]);
$collection->countBy();
// {
//     "1": 1, 
//     "2": 1, 
//     "3": 2, 
//     "4": 1
// }

// 分类统计邮箱个数
$collection = collect([
    'xiaoxin@163.com', 
    'yihu@163.com', 
    'xiaoying@qq.com'
]);

$collection->countBy(function ($value) {
    return substr(strrchr($value, '@'), 1);
});

// {
//   "163.com": 2,
//   "qq.com": 1
// }
```

### groupBy

```php
// 根据指定键对集合项进行分组
$collection = collect([
    ['name' => 'Tom', 'age' => '23'],
    ['name' => 'Jack', 'age' => '24'],
    ['name' => 'Steve', 'age' => '23'],
]);

$grouped = $collection->groupBy('age');
// {
//     "23": [
//         {
//             "name": "Tom",
//             "age": "23"
//         },
//         {
//             "name": "Steve",
//             "age": "23"
//         }
//     ],
//     "24": [
//         {
//             "name": "Jack",
//             "age": "24"
//         }
//     ]
// }
```

### diff

```php
// 不相同的部分
$collection = collect([1, 2, 3, 3, 4]);

$collection->diff([1, 3]);
// {
//   "1": 2,
//   "4": 4
// }
// 还有 diffAssoc()、diffKeys()派生方法;
```


### join

```php
// 将集合的值与字符串连接起来
$collection = collect([1, 2, 3, 4, 5]);

$collection->join();
// 1-2-3-4-5
```

