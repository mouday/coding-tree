# Promise

## Promise用途
1、异步计算
2、异步操作队列化
3、对象之间传递和操作Promise

## 异步产生的原因
1、JavaScript为检查表单而生
2、首要目标数是操作DOM
3、JavaScript操作大多是异步的

## 异步操作常见语法
1、事件侦听与响应
```js
// 1、原生事件绑定
document.getElementById("start").addEventListener('click', start, false);
function start(){
    // 响应事件处理操作
}

// 2、jQuery事件绑定
$('#start').on('click', start);
```

2、回调
```js
// 1、ajax请求
$.ajax('http://www.baidu.com', {
    success: function(res){
        // 回调函数
    }
})

// 2、页面加载完成之后
$(function(){
    // 回调函数
});
```

## 浏览器中的JavaScript
1、异步操作以事件为主
2、回调主要出现在Ajax和File API

## 异步回调问题
1、嵌套层次较深，回调地狱
2、无法处理异常，不能正常return和throw
3、无法正常检索堆栈信息, 闭包变量可能被修改
4、多个回调之间难以建立联系

## Promise
Promise是一个代理对象，和原先要进行的操作无关系
通过引入一个回调，避免更多的回调

```js
new Promise(
    // 执行器 executor
    function(resolve, reject){
        // 耗时操作
        resolve(); // 数据处理完成
        reject();  // 数据处理出错
    }).then(function A(){
// 成功，下一步
    }, function B(){
// 失败，做相应处理
    })
```

## Promise3个状态

1、pendding 待定，初始状态
2、fulfilled 实现，操作成功
3、rejected 被否决，操作失败

Promise状态发生改变，就会触发.then()里的响应函数
Promise状态只会改变一次
Promise实例一经创建，执行器立即执行

## 代码实例
```js
// 定时执行
console.log("hi")
new Promise(resolve => {
    setTimeout(()=>{
        resolve("hello");
    }, 1000);
}).then(value=>{
    console.log(value + " world");
})
/*
hi
hello world
*/
```

```js
// 两步执行
console.log("hi")
new Promise(resolve => {
    setTimeout(()=>{
        resolve("hello");
    }, 1000);
}).then(value=>{
    console.log(value);
    return new Promise(resolve=>{
        setTimeout(()=>{
        resolve("world");
    }, 1000);
    })
}).then(value=>{
    console.log(value + " world");
})
/*
hi
hello
world world
*/
```

```js
// 队列
console.log("hi")

let promise = new Promise(resolve=>{
    setTimeout(()=>{
        console.log('promise')
        resolve('hello world');
    }, 1000)
});

setTimeout(()=>{
    promise.then(value=>{
       console.log(value) 
    })
}, 1000);
/*
hi
promise
hello world
*/
```

## then()

1、.then() 接受两个函数作为参数，分别代表fulfilled和rejected
2、.then() 返回新的Promise实例，可以链式调用
3、当前面的Promise状态改变时，.then()根据其最终状态，选择特定的状态响应函数执行
4、状态响应函数可以返回新的Promise，或其他值
5、如果返回新的Promise，那么下一级.then()会在新的Promise状态改变之后执行
6、如果返回其他任何值，则会立刻执行下一级.then()
