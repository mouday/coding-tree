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



background复合属性

```css
background: color image repeat attachment position;
```
- background-color
- background-image
- background-repeat
- background-attachment
- background-position

-  background-size: cover/contian
  - cover: 图片完全覆盖盒子，可能会导致图片显示不全
  - contian：最大边和盒子尺寸相等，就不进行缩放


animation复合属性（了解）

属性 | 作用 | 取值
- | - | -
animation-name | 动画名称
animation-duration | 动画时长
animation-delay | 延迟时间
animation-fill-mode | 动画执行完毕时状态 | forwards 最后一帧状态/ backwards第一帧状态
animation-timing-function | 速度曲线 | steps(数字) 逐帧动画
animation-iteration-count | 重复次数 | infinite 无限循环
animation-direction | 动画执行方向 | alternate 反方向
animation-play-state | 暂停动画 | paused 暂停，通常配合hover使用


- 补间动画：两个动画之间平滑动画
- 逐帧动画：两个动画之间状态不补全

多组动画

```css
animation: 动画1, 动画2, ...动画N;
```

走马灯，无缝动画


```css
hmtl, body {
    height: 100%
}
```

示例: 无缝动画

[](demo/animation-walking.html ':include :type=code')

[](demo/animation-walking.html ':include height=120')


https://www.bilibili.com/video/BV1xq4y1q7jZ?p=55&spm_id_from=pageDriver