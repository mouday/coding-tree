# 常用片段

## 随机打乱数组

```js
// ES6 写法
function randomShuffle(arr) {
  return arr.sort(() => Math.random() - 0.5)
}

// ES5 写法
function randomShuffle(arr) {
  var compareFn = function () {
    return Math.random() - 0.5
  }
  return arr.sort(compareFn)
}
```

## 字母和数字转换

```js
// 字母转数字
let letter = 'a';
let num = letter.toUpperCase().charCodeAt() - 64;
console.log(num); // 1

// 数字转字母
let num = 1;
let letter = String.fromCharCode(64  + num);
console.log(letter); // 'A'
```