# Vue

模板语法，条件渲染，列表渲染
vue-router vuex
vue-cli

## 开发环境

1、IDE
- webstorm http://www.jetbrains.com/webstorm
- vscode https://code.visualstudio.com/

2、node环境

（1）nvm Node Version Manager 
node 多版本管理工具

[1] 安装
https://github.com/nvm-sh/nvm
```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash
```

vim ~/.bash_profile
```
# nvm配置
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
```

[2]使用
```
$ nvm --version  # 0.34.0
nvm --help
nvm ls
nvm ls-remote
nvm install 8.0.0
nvm deactivate  # 卸载时使用

$ node --version
v8.0.0
```

(2) cnpm淘宝镜像 
http://npm.taobao.org/
```
$ npm install -g cnpm --registry=https://registry.npm.taobao.org
```

(3)chrome插件
vue.js devtools

chrome vue插件下载地址
https://chrome-extension-downloader.com/

(4)vue-cli
```
$ npm install -g @vue/cli   # 全局安装
$ vue --version
```

环境检查
```
$ nvm --version
0.34.0
$ node --version
v8.16.0
$ npm --version
5.0.0
$ vue --version
2.9.6
$ npm ls -g --depth=0
```

## 模板语法
1、文件结构
-template
-script
-css

2、插值语法，数据，js表达式
3、指令（指令缩写） @click，v-if, :href

vueCDN: https://www.bootcdn.cn/

代码示例
```html
<html>
<head>
<!-- 可以在head标签中 通过CND引入-->
<script src="https://cdn.bootcss.com/vue/2.6.10/vue.min.js"></script>
</head>

<body>
<!-- 模板部分-->
<div id="app">
    <div>{{message}}</div>          <!--变量替换 hello world! -->
    <div>{{ count + 1 }}</div>      <!--数值运算 2 -->
    <div>{{template}}</div>         <!--原样显示 <div>hello div</div> -->
    <div v-html="template"></div>   <!--标签解析 hello div -->
    
    <!--属性绑定 3者等效-->
    <div><a href="https://www.baidu.com">百度</a></div>
    <div><a v-bind:href="url">百度</a></div>   
    <div><a :href="url">百度</a></div>

    <!--事件绑定 2者等效-->
    <div><button v-on:click="add()">count+1</button></div>
    <div><button @click="add()">count+1</button></div>
</div>

<!--js部分-->
<script>
new Vue({
    el: "#app",  // 绑定的对象
    
    // 数据
    data: {   
        message: "hello world!",
        count: 1,
        template: "<div>hello div</div>",
        url: "https://www.baidu.com"
    },

    // 方法
    methods: {
        add: function() {
            this.count += 1;
        }
    }

});
</script>
</body>
</html>
```

## 计算属性和侦听属性
软回车（换行不删除）：shift+enter
```
计算属性  computed   数据联动   监听多个属性 
侦听器    watch      异步场景   监听一个属性    
```

代码示例
```html

<div id="app">
    <div>{{message}}</div>
    <div>{{fullMessage }}</div>
</div>

<script>
var app = new Vue({
    el: "#app",
    data: {
        message: "hello"
    },
    
    // 侦听属性
    watch: {
        message: function(newVal, oldVal) {
            console.log(oldVal + " => " + newVal);
        }
    },
    
    // 计算属性
    computed: {
        fullMessage: function(){
            return `数据：${this.message}`;
        }
    }
});
</script>

```

## 渲染
条件渲染: v-if, v-else, v-else-if; v-show
列表渲染: v-for
Class与Style绑定

代码示例
```html

<div id="app">
    <!-- if 条件判断 -->
    <div v-if="count===0">
        count的值===0
    </div>
    <div v-else-if="count > 0">
        count的值 > 0
    </div>
    <div v-else>
        count的值 < 0
    </div>

    <!-- show 条件判断 -->
    <div v-show="count==5">
        count的值 == 5
    </div>
    
    <!-- 循环渲染 -->
    <div v-for="item in students">
        {{item.name}} | {{item.age}}
    </div>

    <!-- 循环渲染和条件渲染结合 -->
    <div v-for="item in students">
        <div v-if="item.age > 23">
            {{item.name}}: age>23
        </div>
        <div v-else>
            {{item.name}}
        </div>
    </div>

    <!-- 样式渲染 -->
    <div v-for="item in students">
        <div v-show="item.age > 23"
            :class="['red', 'gree', {'red': item.age<23}]"
            :style="itemStyle">
            {{item.name}}
        </div>
    </div>
</div>

<script>
var app = new Vue({
    el: "#app",
    data: {
        count: 0,
        students: [
            {
                name: "小仓",
                age: 23
            },
            {
                name: "小龙",
                age: 24
            }
        ],

        // style属性
        itemStyle: {
            color: "red"
        }
    }
});
</script>

```

## vue-cli
```
$ vue create hello-world  # 创建项目
$ npm run server          # 启动项目
```

1、组件化思想
实现功能模块复用
开发复杂应用

原则：
300行原则
复用原则
业务复杂性原则

2、风格指南
https://cn.vuejs.org/v2/style-guide/

3、Vue-router
配置router.js

4、Vuex
state 状态
mutations 方法集
actions
vuex管理不同组件共用变量，一个组件改变变量，另一个跟着改变。

store.js 定义全局数据和方法
```js
export default new Vuex.Store({
  // 定义公共的数据
  state: {
    count: 0
  },

  // 公共的方法
  mutations: {
    increase() {
      this.state.count ++;
    }
  },
  actions: {

  },
});
```

info.vue 修改全局变量
```html
<template>
  <div>
    info 
    <button @click="add()">加一</button>
  </div>
</template>

<script>
// 导入文件 @相当于src目录
import store from "@/store"

export default{
    name: "Info",
    store,

    // 整个生命周期绑定
    mounted(){
        window.app = this;
    },
    methods: {
        add: function() {
            console.error("加一");
            debugger;
            // 调用store中的increase方法
            store.commit("increase");
        },
        output: function(){
            console.log("out put");
        }
    }
}
</script>

```

about.vue调用全局数据
```html
<template>
  <div class="about">
    <h1>This is an about page</h1>
     <div>{{msg}}</div>
  </div>
</template>

<script>
import store from "@/store"

export default{
    name: "About",
    store,
    data(){
    return {
      msg: store.state.count
    }
  }
}
</script>

```


5、调试
console.log()
console.error()
alert() 阻塞
debugger 断点
window对象绑定

6、集成vue

## Git工作流

```shell
# 拉取仓库
git clone git@hello.git
cd hello
git status
git branch -a   # 本地远程分支
git branch

# 添加新文件
touch text.txt
git status
git add .
git commit -m "初次提交"
git remote -v   # origin 远程仓库
git push origin master  # 推送到远程主干分支

# 新需求分支
git checkout -b dev
touch test1.txt
git add test1.txt
git commit -m "dev功能开发"
git push origin dev  # 推送到dev分支

# 合并分支到master上
git checkout master
git merge dev
git push origin master  # 提交到远程master分支
git branch -d dev       # 删除本地dev分支
git push origin :dev    # 删除远程dev分支

# 回退版本
git reset --hard head^   # 回退到上一版本

git log
git reflog
git reset --hard HEAD@{1}
```

## 快速原型开发

```
npm install -g @vue/cli-service-global

vue serve demo.vue
```

demo.vue
```html
<template>
    <div>
        <ul>
            <li v-for="(item, index) in list"
            :class="{'active': index===currentIndex}"
            :key="index"
            @click="selectItem(index)"
            >{{item}}</li>
        </ul>
        
        <button type="button" @click="add()">添加</button>

        <ul>
            <li v-for="(item, index) in target"
            :key="index"
            >{{item}}</li>
        </ul>
    </div>
</template>

<script>
export default {
    name: "demo1",
    data() {
        return{
            currentIndex: -1,
            list: [1, 2, 3, 4],
            target: []
        }
    },
    methods: {
        add(){
            if (this.currentIndex < 0){
                return
            }
            
            this.target.push(this.list[this.currentIndex]);
            this.currentIndex = -1;
        },
        
        // 选中的时候
        selectItem(index) {
            this.currentIndex = index;
        }
    }

}
</script>

<style>
.active{
    background-color: green;
    color: white
}
</style>

```

app应用
```
vue ui
```
localStorage
scss方式书写css

打包部署
npm run build

## 总结
模板语法
风格指南
vue-router、vuex、调试
vue-cli
vue集成
开发工作流




