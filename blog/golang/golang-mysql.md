# Golang操作MySQL数据库

## 准备数据库和数据表

下载安装数据库

https://dev.mysql.com/downloads/mysql/


登录数据库

```bash
$ mysql -uroot -p
```

初始化数据

```sql
-- 创建数据库
create database go_db;

use go_db;

-- 创建数据表
create table user_tbl(
    id integer primary key auto_increment,
    username varchar(20),
    password varchar(20)
);

desc user_tbl;
+----------+-------------+------+-----+---------+----------------+
| Field    | Type        | Null | Key | Default | Extra          |
+----------+-------------+------+-----+---------+----------------+
| id       | int         | NO   | PRI | NULL    | auto_increment |
| username | varchar(20) | YES  |     | NULL    |                |
| password | varchar(20) | YES  |     | NULL    |                |
+----------+-------------+------+-----+---------+----------------+
3 rows in set (0.03 sec)

-- 插入初始化数据
insert into user_tbl(username, password) values("Tom", "123456");
insert into user_tbl(username, password) values("Kite", "abcdef");

select * from user_tbl;
+----+----------+----------+
| id | username | password |
+----+----------+----------+
|  1 | Tom      | 123456   |
|  2 | Kite     | abcdef   |
+----+----------+----------+
2 rows in set (0.01 sec)
```

## 安装MySQL驱动

https://pkg.go.dev/github.com/go-sql-driver/mysql

```
go get github.com/go-sql-driver/mysql
```

## 获得数据库链接

```go
package main

import (
    "database/sql"
    "fmt"
    "time"

    _ "github.com/go-sql-driver/mysql"
)

func main() {
    db_url := "root:123456@tcp(127.0.0.1:3306)/go_db?charset=utf8mb4&parseTime=true"

    db, err := sql.Open("mysql", db_url)
    if err != nil {
        panic(err)
    }

    defer db.Close()

    // 最大连接时长
    db.SetConnMaxLifetime(time.Minute * 3)
    // 最大连接数
    db.SetMaxOpenConns(10)
    // 空闲连接数
    db.SetMaxIdleConns(10)

    // 尝试与数据库建立连接
    err = db.Ping()
    if err != nil {
        panic(err)
    }

    fmt.Printf("db: %v\n", db)

}

```

## 插入数据

```go
package main

import (
    "database/sql"
    "fmt"

    _ "github.com/go-sql-driver/mysql"
)

func main() {
    db_url := "root:123456@tcp(127.0.0.1:3306)/go_db?charset=utf8mb4&parseTime=true"

    db, err := sql.Open("mysql", db_url)
    if err != nil {
        panic(err)
    }

    defer db.Close()

    sql := "insert into user_tbl (username, password) values (?, ?)"

    result, sqlErr := db.Exec(sql, "Jack", "jjyy")
    if sqlErr != nil {
        panic(sqlErr)
    } else {
        id, _ := result.LastInsertId()
        fmt.Printf("id: %v\n", id)
        // id: 3
    }
}

```


## 查询操作

单行查询

```go
package main

import (
    "database/sql"
    "fmt"

    _ "github.com/go-sql-driver/mysql"
)

type User struct {
    id       int
    username string
    password string
}

func main() {
    db_url := "root:123456@tcp(127.0.0.1:3306)/go_db?charset=utf8mb4&parseTime=true"

    db, _ := sql.Open("mysql", db_url)
    defer db.Close()

    // 查询单条数据
    var user User

    sql := "select * from user_tbl where id = ?"

    db.QueryRow(sql, 1).Scan(&user.id, &user.username, &user.password)
    fmt.Printf("row: %v\n", user)
    // row: {1 Tom 123456}
}

```

查询多条数据

```go
package main

import (
    "database/sql"
    "fmt"

    _ "github.com/go-sql-driver/mysql"
)

type User struct {
    id       int
    username string
    password string
}

func main() {
    db_url := "root:123456@tcp(127.0.0.1:3306)/go_db?charset=utf8mb4&parseTime=true"

    db, _ := sql.Open("mysql", db_url)
    defer db.Close()

    sql := "select * from user_tbl"

    rows, _ := db.Query(sql)
    defer rows.Close()

    for rows.Next() {
        var user User

        rows.Scan(&user.id, &user.username, &user.password)
        fmt.Printf("row: %v\n", user)
        // row: {1 Tom 123456}
        // row: {2 Kite abcdef}
        // row: {3 Jack jjyy}
    }

}

```

## 更新操作

```go
package main

import (
    "database/sql"
    "fmt"

    _ "github.com/go-sql-driver/mysql"
)

type User struct {
    id       int
    username string
    password string
}

func main() {
    db_url := "root:123456@tcp(127.0.0.1:3306)/go_db?charset=utf8mb4&parseTime=true"

    db, _ := sql.Open("mysql", db_url)
    defer db.Close()

    // 更新数据
    sql := "update user_tbl set username = ? where id = ?"
    result, _ := db.Exec(sql, "Tom-1", 1)

    // 影响行数
    i, _ := result.RowsAffected()
    fmt.Printf("i: %v\n", i)
    // i: 1
}

```

## 删除数据

```go
package main

import (
    "database/sql"
    "fmt"

    _ "github.com/go-sql-driver/mysql"
)

type User struct {
    id       int
    username string
    password string
}

func main() {
    db_url := "root:123456@tcp(127.0.0.1:3306)/go_db?charset=utf8mb4&parseTime=true"

    db, _ := sql.Open("mysql", db_url)
    defer db.Close()

    // 删除数据
    sql := "delete from user_tbl where id = ?"
    result, _ := db.Exec(sql, 3)

    // 影响行数
    i, _ := result.RowsAffected()
    fmt.Printf("i: %v\n", i)
    // i: 1
}

```

