package main

import (
	"fmt"

	uuid "github.com/satori/go.uuid"
)

func main() {
	// Creating UUID Version 4
	uuid := uuid.NewV4()
	fmt.Printf(uuid.String())
	// f521f6bb-d809-43ad-8968-ab9e763d0eba
}
