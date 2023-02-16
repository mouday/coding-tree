## Golang操作redis数据库

文档
- [https://pkg.go.dev/github.com/go-redis/redis/v8](https://pkg.go.dev/github.com/go-redis/redis/v8)
- [https://github.com/redis/go-redis](https://github.com/redis/go-redis)
- [Go Redis中文文档](https://redis.uptrace.dev/zh/)

安装

```bash
go get github.com/go-redis/redis/v8
```

示例

```go
package main

import (
    "context"
    "fmt"

    "github.com/go-redis/redis/v8"
)

var ctx = context.Background()

func main() {
    rdb := redis.NewClient(&redis.Options{
        Addr:     "localhost:6379",
        Password: "", // no password set
        DB:       0,  // use default DB
    })

    err := rdb.Set(ctx, "key", "value", 0).Err()
    if err != nil {
        panic(err)
    }

    val, err := rdb.Get(ctx, "key").Result()
    if err != nil {
        panic(err)
    }
    fmt.Println("key", val)

    val2, err := rdb.Get(ctx, "key2").Result()
    if err == redis.Nil {
        fmt.Println("key2 does not exist")
    } else if err != nil {
        panic(err)
    } else {
        fmt.Println("key2", val2)
    }
    // Output: key value
    // key2 does not exist
}

```