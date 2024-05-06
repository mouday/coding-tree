# 数据分页 paginate

创建分页

数据库DB方式的分页
```php
// 每页显示 5 条
$users = DB::table('users')->paginate(5);
```

模型创建分页
```php
$users = User::paginate(5);
```

分页按钮直接使用links()方法即可，它继承了Bootstrap样式

```php
{{$list->links()}}
```

使用withPath()方法，更改路由地址

```php
$users->withPath('/users/list');
```
指定参数，可以使用appends()方法
```php
{{$list->appends(['sort'=>'id'])->links()}}
```

保存所有查询参数，可以使用withQueryString()方法;
```php
{{$list->withQueryString()->links()}}
```

使用fragment()方法给URL地址#符号

```php
{{$list->fragment('element')->links()}}
```

大量分页中...省略分页数量，使用onEachSize()方法可设置外侧数量，默认3
```php
 {{$list->onEachSide(1)->links()}}
```

更多方法
| 方法 | 描述
| - | - 
| $results->count() | 获取当前页数据的数量
| $results->currentPage() | 获取当前页页码
| $results->hasPages() | 是否有多页
| $results->hasMorePages() |  是否有更多页
| $results->firstItem() | 获取结果集中第一条数据的结果编号
| $results->getOptions() | 获取分页器选项
| $results->items() | 获取当前页的所有项
| $results->lastItem() |  获取结果集中最后一条数据的结果编号
| $results->lastPage() | 获取最后一页的页码。 (在 simplePaginate 无效)
| $results->nextPageUrl() | 获取下一页的 URL
| $results->onFirstPage() | 当前页是否为第一页
| $results->perPage() | 每页的数据条数
| $results->getUrlRange($start, | 创建分页 URL 的范围
| $end) | 
| $results->previousPageUrl() | 获取前一页的 URL
| $results->total() | 数据总数(在 simplePaginate 无效)
| $results->url($page) | 获取指定页的 URL
| $results->getPageName() | 获取分页的查询字符串变量
| $results->setPageName($name) | 设置分页的查询字符串变量
```