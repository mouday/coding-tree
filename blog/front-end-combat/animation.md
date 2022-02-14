# 动画 animation

过渡 vs 动画

- 过渡：用于两个状态变化过程
- 动画：实现多个状态间的变化过程，动画过程可控

动画

- 动画的本质：快速切换大量图片时在人脑中行成的具有连续性的画面
- 构成动画的最小单元：帧或动画帧

实现步骤：

1. 定义动画

```css
/* 定义两种状态 */
@keyframes 动画名称 {
  from {
  }
  to {
  }
}

/* 定义多种状态 */
/* 百分比表示动画总时长的占比 */
@keyframes 动画名称 {
  0% {
  }
  10% {
  }
  50% {
  }
  100% {
  }
}
```

2. 使用动画

```css
animation: 动画名称 动画花费时长;
```

示例:

[](demo/animation-1.html ':include :type=code')

[](demo/animation-1.html ':include height=70')

## 动画属性

```css
animation: 动画名称 动画时长 速度曲线 延迟时间 重复次数 动画方向 执行完毕时状态;
```

注意：

- 动画名称 和 动画时长必须赋值
- 取值不分先后顺序
- 如果有 2 个时间值，第一个时间表示动画时长，第二个时间表示延迟时间

示例:

[](demo/animation-2.html ':include :type=code')

[](demo/animation-2.html ':include height=420')

https://www.bilibili.com/video/BV1xq4y1q7jZ?p=45&spm_id_from=pageDriver
