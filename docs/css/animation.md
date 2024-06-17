## css3动画

分类：
- 帧动画
- 过渡动画

CSS3动画属性：
- transition
- animation

常用属性 

- transform

动画库：
- swiper
- vue-transition
- svg
- animate.css

## transition过渡

语法
```css
transition: property duration timing-function delay;
```

属性名称property

过渡时间duration

时间函数timing-function

延迟时间delay


2、注意：

- display不能和transition一起使用

- transition后面尽量不要跟all

- 常见闪动可以persp和backface-visibility

```css
.box{
    width: 200px;
    height: 200px;
    background-color: #000000;
    margin-bottom: 20px;
}

// 鼠标经过变化宽度
.trasition-1{
    // transition: width 2s linear 1s;
    transition: width 2s linear;

    &:hover{
        width: 500px;
    }
}

// 鼠标经过旋转
.trasition-2{
    transition: transform 2s ease-out;

    &:hover{
        transform: rotate(45deg);
    }
}
```
## animation动画
语法
```css
animation: name duration timing-function delay iteration-count direction fill-mode play-state;
```

动画名称（name）@keyframes

过渡时间(duration)

时间函数(timing-function)

延迟时间(delay)

播放次数（iteration-count）

播放方向（direction）轮流播放和反向播放

停止播放的状态（fill-mode）

是否暂停（play-state）
```css
.box{
    width: 200px;
    height: 200px;
    background-color: #000000;
    margin-bottom: 20px;
}

// 鼠标经过移动
.animation-1{
    &:hover{
        animation: move 2s linear;
    }
}

@keyframes move{
    100%{
        transform: translateX(200px);
    }
}

// 小球滚动
.animation-2{
    border-radius: 50%;
    animation: jump 2s cubic-bezier(0.4,-0.04, 0.94, 0.29) infinite;
}

@keyframes jump{
    0%{
        transform: translateX(0px);
    }
    40%{
        transform: translateX(200px);
    }
    60%{
        transform: translateX(200px);
        clip-path: ellipse(50% 50% at 50% 50%);
    }
    100%{
        transform: translateX(0px);
        clip-path: ellipse(50% 45% at 50% 48%);
    }
}

// 菊花图旋转
.animation-3{
    width: 100px;
    height: 111px;
    animation: round 1s steps(12) infinite;
    background: url(./loading.jpg) no-repeat;
}


@keyframes round{
    100%{
        transform: rotate(360deg);
    }
}
```

## 时间函数

时间函数：管理动画在单位帧内播放的速度曲线
三次贝塞尔函数的数学函数
预设值：
- linear 匀速
- ease 
- ease-in
- ease-out 
- ease-in-out

steps作用是每一个关键帧，而不是整个时间

## 过渡和动画在js中的监听
animationstart
animationend
trasitionend
animationitertion

```js

// 过渡事件监听
let transitionend = ()=>{
    console.log("transitionend");
}
let $box = document.querySelector('.trasition-1');
// IE FireFox已经支持
$box.addEventListener("transitionend", transitionend);
// 360 safari chrome下需要兼容处理
$box.addEventListener("WebkitTransitionend", transitionend);

```

