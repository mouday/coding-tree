# 数组

## 定义数组

1、方式 1：直接定义

语法：多个元素空格隔开

```shell
数组名=(元素1 元素2 元素3...)
```

示例

```shell
array=('Tom' 'Jack' 'Steve')

echo "${array[@]}"
```

输出结果

```shell
Tom Jack Steve
```

2、方式 2：先定义空数组，再逐一赋值

语法：索引从 0 开始

```shell
数组名[索引]=元素值
```

示例

```shell
array=()
array[0]='Tom'
array[1]='Jack'
array[2]='Steve'

echo "${array[@]}"
```

输出结果

```shell
Tom Jack Steve
```

3、方式 3：字符串转数组

语法：先定义空格分隔的字符串，再将字符串拆分为数组

```shell
字符串变量="元素1 元素2 元素3"

数组名=($字符串变量)
```

示例

```shell
str='Tom Jack Steve'

array=($str)

echo "${array[@]}"
```

输出结果

```shell
Tom Jack Steve
```

## 数组取值

1、获取单个元素

语法：索引从 0 开始，若不存在则输出空

```shell
${数组名[索引]}
```

示例

```shell
array=('Tom' 'Jack' 'Steve')

echo ${array[0]}
echo ${array[1]}
echo ${array[2]}
```

输出结果

```shell
Tom
Jack
Steve
```

2、获取全部元素

语法

```shell
# 推荐：可以保留元素中的空格
${数组名[@]}

${数组名[*]}
```

示例

```shell
array=('Tom' 'Jack' 'Steve')

echo ${array[@]}
echo ${array[*]}

```

输出结果

```shell
Tom Jack Steve
Tom Jack Steve
```

## 数组长度

语法

```shell
# 推荐：可以保留元素中的空格
${#数组名[@]}

${#数组名[*]}
```

示例

```shell
array=('Tom' 'Jack' 'Steve')

echo ${#array[@]}
echo ${#array[*]}
```

输出结果

```shell
3
3
```

## 遍历数组

1、方式 1：`for...in`循环

语法

```shell
for 变量名 in ${数组名[@]}; do
    $变量名
done
```

示例

```shell
array=('Tom' 'Jack' 'Steve')

for item in ${array[@]}; do
    echo $item
done


```

输出结果

```shell
Tom
Jack
Steve
```

2、索引变量

语法：索引从 0 开始

```shell
for ((i=0; i < ${#数组名[@]}; i++)); do
   ${数组名[$i]}
done
```

示例

```shell
array=('Tom' 'Jack' 'Steve')

for ((i=0; i < ${#array[@]}; i++)); do
    echo ${array[$i]}
done


```

输出结果

```shell
Tom
Jack
Steve
```

## 追加元素

语法：括号不能省

```shell
数组名+=('新元素')
```

示例

```shell
array=('Tom' 'Jack' 'Steve')
array+=('Job')

echo ${array[@]}
```

输出结果

```shell
Tom Jack Steve Job
```

## 删除元素

语法

```shell
unset 数组名[索引]
```

示例

```shell
array=('Tom' 'Jack' 'Steve')
unset array[1]

echo ${array[@]}
```

输出结果

```shell
Tom Steve
```

## 总结

1. 数组元素之间`空格分隔`，不是逗号
2. 数组索引`从0开始`
