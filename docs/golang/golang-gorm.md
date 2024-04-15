## Golang ORM库 gorm

ORM：对象关系映射 Object Relational Mapping

文档：

- [https://gorm.io/zh_CN/docs/](https://gorm.io/zh_CN/docs/)

安装
```
go get gorm.io/gorm

go get gorm.io/driver/mysql
```

```go
package main

import (
	"fmt"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

type Product struct {
	gorm.Model
	Code  string
	Price uint
}

func main() {
	dsn := "root:123456@tcp(127.0.0.1:3306)/go_db?charset=utf8mb4&parseTime=True&loc=Local"
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}

	// 迁移 schema
	db.AutoMigrate(&Product{})

	// Create
	db.Create(&Product{Code: "D42", Price: 100})

	// Read
	var product Product
	db.First(&product, 1) // 根据整型主键查找
	fmt.Printf("product: %v\n", product)

	db.First(&product, "code = ?", "D42") // 查找 code 字段值为 D42 的记录
	fmt.Printf("product: %v\n", product)

	// Update - 将 product 的 price 更新为 200
	db.Model(&product).Update("Price", 200)

	// Update - 更新多个字段
	db.Model(&product).Updates(Product{Price: 200, Code: "F42"}) // 仅更新非零值字段
	db.Model(&product).Updates(map[string]interface{}{"Price": 200, "Code": "F42"})

	// Delete - 软删除 product
	db.Delete(&product, 1)
}
```