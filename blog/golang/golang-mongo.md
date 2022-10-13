# Golang操作MongoDB数据库

## 下载安装MongoDB

https://www.mongodb.com/try/download/community2

https://www.mongodb.com/download-center/community/releases

连接客户端

```bash
# 打开客户端
mongo

# 创建数据库
use go_db;

# 创建集合
db.createCollection('student');
```

## 下载驱动

https://pkg.go.dev/go.mongodb.org/mongo-driver/mongo

```
go get go.mongodb.org/mongo-driver/mongo
```

## 连接到mongodb数据库

```go
package main

import (
	"context"
	"log"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func main() {
	// 设置客户端连接配置
	// db_url := "mongodb://root:123456@localhost:27017"
	db_url := "mongodb://localhost:27017"
	clientOptions := options.Client().ApplyURI(db_url)

	// 连接到mongo
	client, _ := mongo.Connect(context.TODO(), clientOptions)

	// 连接检查
	err := client.Ping(context.TODO(), nil)

	if err != nil {
		log.Fatal(err)
	}
}
```

## BSON

二进制编码的json

类型D家族
- D BSON文档
- M 无序map
- A BSON数组
- E D里面的一个元素

示例
```go
package main

import (
    "fmt"

    "go.mongodb.org/mongo-driver/bson"
)

func main() {
    d := bson.D{{"name", "age"}}
    fmt.Printf("d: %v\n", d)
    // d: [{name age}]
}

```

## 添加文档

插入单条记录

```go
package main

import (
    "context"
    "fmt"

    "go.mongodb.org/mongo-driver/mongo"
    "go.mongodb.org/mongo-driver/mongo/options"
)

type Student struct {
    Name string
    Age  int
}

func main() {
    // 连接到mongo
    db_url := "mongodb://localhost:27017"
    clientOptions := options.Client().ApplyURI(db_url)
    client, _ := mongo.Connect(context.TODO(), clientOptions)

    student := Student{
        Name: "Tom",
        Age:  23,
    }

    collection := client.Database("go_db").Collection("student")

    ior, _ := collection.InsertOne(context.TODO(), student)
    fmt.Printf("ior.InsertedID: %v\n", ior.InsertedID)
    // ior.InsertedID: ObjectID("634822c35881b85ab2aa138e")

}

```

插入多条记录

```go
package main

import (
    "context"
    "fmt"

    "go.mongodb.org/mongo-driver/mongo"
    "go.mongodb.org/mongo-driver/mongo/options"
)

type Student struct {
    Name string
    Age  int
}

func main() {
    // 连接到mongo
    db_url := "mongodb://localhost:27017"
    clientOptions := options.Client().ApplyURI(db_url)
    client, _ := mongo.Connect(context.TODO(), clientOptions)

    student1 := Student{
        Name: "Steve",
        Age:  24,
    }

    student2 := Student{
        Name: "Jack",
        Age:  25,
    }

    students := []interface{}{student1, student2}

    collection := client.Database("go_db").Collection("student")

    imr, _ := collection.InsertMany(context.TODO(), students)
    fmt.Printf("imr.InsertedIDs: %v\n", imr.InsertedIDs)
    // imr.InsertedIDs: [
    // ObjectID("634823e52758c71e01e1e78f")
    // ObjectID("634823e52758c71e01e1e790")
    // ]

}

```