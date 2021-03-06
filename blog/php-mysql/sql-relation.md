# 表关系

表与表之间（实体）的关系

## 一对一

两张表使用相同的主键

学生表
```
学生ID（PRI） 姓名 年龄 性别 籍贯 住址
```
常用的信息会经常查询，不常用的信息偶尔会用到

解决方案：将两张表拆分
常用的字段放一张表
不常用的放一张表

学生表（常用字段）
```
学生ID（PRI） 姓名 年龄 性别
```

学生表（不常用字段）
```
学生ID（PRI） 籍贯 住址
```

## 一对多(多对一)

"多关系"的表中维护一个"一关系"的主键


示例：

父子关系：一个父亲有多个孩子，一个孩子只有一个父亲

父亲表
```
父亲ID 年龄 身高
F1
F2
```

孩子表
```
孩子ID 年龄 身高 父亲ID
K1              F1
K2              F1
```

## 多对多

一张表中的一条记录，在另一张表中可以匹配多条记录，反过来也一样

需要通过第三张表来维护关系

让中间表和对应的表行成多对一的关系；
在“多表”中增加“一表”对应的主键字段

例如：师生关系

老师表
```
tid name  age gender
T1  王老师 30    男
T2  李老师 28    女
```

学生表
```
sid name age gender
S1  张飞   18   男
S2  关羽   16   男
S3  刘备   19   男
S4  小乔   16   女
```

老师学生关系表
```
id tid sid
1   T1  S1
2   T1  S2
3   T2  S1
4   T2  S3
5   T2  S4
6   T2  S5
```
