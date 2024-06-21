# Golang面试题

## 并发安全性

### 1、问题描述

Go语言中的并发安全性是什么？如何确保并发安全性？

### 2、解答

并发安全性是指在并发编程中，多个goroutine对共享资源的访问不会导致数据竞争和不确定的结果。

为了确保并发安全性，可以采取以下措施：

- 使用互斥锁（Mutex）：通过使用互斥锁来保护共享资源的访问，一次只允许一个goroutine访问共享资源，从而避免竞争条件。
- 使用原子操作（Atomic Operations）：对于简单的读写操作，可以使用原子操作来保证操作的原子性，避免竞争条件。
- 使用通道（Channel）：通过使用通道来进行goroutine之间的通信和同步，避免共享资源的直接访问。
- 使用同步机制：使用同步机制如等待组（WaitGroup）、条件变量（Cond）等来协调多个goroutine的执行顺序和状态。

通过以上措施，可以确保并发程序的安全性，避免数据竞争和不确定的结果。


## defer

### 1、问题描述

Go语言中的defer关键字有什么作用？请给出一个使用defer的示例。

### 2、解答

defer关键字用于延迟函数的执行，即在函数退出前执行某个操作。defer通常用于释放资源、关闭文件、解锁互斥锁等清理操作，以确保在函数执行完毕后进行处理。

也可以使用defer语句结合time包实现函数执行时间的统计。

### 3、代码示例

下面是一个使用defer的示例，打开文件并在函数退出前关闭文件：

```go
package main

import (
	"fmt"
	"os"
)

func main() {
	file, err := os.Open("file.txt")
	if err != nil {
		fmt.Println("Error opening file:", err)
		return
	}
	defer func() {
		err := file.Close()
		if err != nil {
			fmt.Println("Error closing file:", err)
		}
	}()
	// 使用文件进行操作
	// ...
	fmt.Println("File operations completed")
}
```

在上述代码中，我们使用defer关键字延迟了文件的关闭操作，确保在函数执行完毕后关闭文件。这样可以避免忘记关闭文件而导致资源泄漏。













代码示例
下面是一个使用defer的示例，打开文件并在函数退出前关闭文件：


## 参考

https://www.jb51.net/jiaoben/290494skn.htm