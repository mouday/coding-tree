# 数据库备份与还原

## 1、数据库备份

备份的结果都是SQL指令

mysqldump：专门用于备份SQL的客户端

SQL备份：表结构 + 数据

缺点：

1. 会产生的备份文件特别大
2. 不适合特大型数据备份
3. 不适合数据变更频繁的数据库备份

基本语法

```bash
> mysqldump -hPup 数据库名字 [表1 [表2]] > 备份文件地址
```

备份可以有3种形式

1. 整库备份 只需太提供数据库名字
2. 单表备份 数据库后跟一张表
3. 多表备份 数据库后跟多张表

示例
```bash
# 整库备份
> mysqldump -hlocalhost -P3306 -uroot -p123456 mydatabase > mydatabase.bak.sql

# 单表备份
> mysqldump -hlocalhost -P3306 -uroot -p123456 mydatabase my_student > mydatabase.my_student.bak.sql

# 多表备份
> mysqldump -hlocalhost -P3306 -uroot -p123456 mydatabase my_student my_class > mydatabase.my_student__my_class.bak.sql
```

备份文件内容

```sql
-- 删除已存在的表
DROP TABLE IF EXISTS `my_student`;


-- 创建表结构
SET character_set_client = utf8mb4 ;
CREATE TABLE `my_student` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(10) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `class_id` int(11) DEFAULT NULL,
  `age` int(11) DEFAULT NULL,
  `gender` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- 插入数据
LOCK TABLES `my_student` WRITE;
INSERT INTO `my_student` VALUES (1,'刘备',1,18,2),(2,'李四',1,19,1),(3,'王五',2,20,2),(4,'张飞',2,21,1),(5,'关羽',NULL,22,2),(6,'曹操',1,20,NULL);
UNLOCK TABLES;
```

## 2、数据还原

mysqldump备份的数据文件，没有关于数据库本身的操作，都是针对表级别的操作，当进行数据还原，必须指定数据库

方式一：mysql客户端

```bash
# 不用登录，直接操作
> mysql -hPup 数据库 < SQL文件位置

mysql -hlocalhost -P3306 -uroot -p123456 mydatabase2 < mydatabase.bak.sql
```

方式二：SQL指令导入

```sql
-- 首先进入到对应的数据库
mysql> source SQL文件位置

source mydatabase.bak.sql;
```

方式三：手动复制粘贴（不推荐）

打开备份文件，复制所有SQL指令，粘贴到mysql命令行中执行
