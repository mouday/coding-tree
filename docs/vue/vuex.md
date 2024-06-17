# Vuex 

为vue.js应用程序开发的状态管理模式
采用集中式存储管理应用的所有组件状态
以相应的规则保证以一种可预测的方式发生变化

## 应用场景
读取，多个视图依赖于同一个状态
修改，不同视图的行为需要改变同一个状态

## 组成部分
State 数据仓库
getter 获取数据
Mutation 修改数据
Action 提交mutation

## 安装Vuex
1、安装vuex包：npm install vuex
2、创建实例：new Vuex.store()
3、在main.js中将vuex实例挂载到vue对象上
```js
import Vue from 'vue'
import App from './App.vue'
import Vuex from 'vuex'

Vue.config.productionTip = false

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        count: 0
    }
})

new Vue({
    store,
    render: h => h(App),
}).$mount('#app')
```

## count++示例
思路
1、state中创建count字段
2、mutations中创建一个count++的mutation
3、button新增click事件触发mutation改变count

main.js
```js
import Vue from 'vue'
import App from './App.vue'
import Vuex from 'vuex'

Vue.config.productionTip = false

Vue.use(Vuex)

const store = new Vuex.Store({
    // 状态数据
    state: {
        count: 0
    },

    // 状态改变方法
    mutations: {
        // 第一个参数是state， 可以接受第二个参数
        increaseCount(state) {
            state.count++;
        }
    }
})

new Vue({
    store,
    render: h => h(App),
}).$mount('#app')
```

App.vue
```js
<template>
  <div id="app">
    <h1>count: {{count}}</h1>
    <button @click="increaseCount">点我++</button>
  </div>
</template>

<script>
export default {
  name: "app",

  computed: {
    count() {
      // 获取状态数据
      return this.$store.state.count;
    }
  },
  
  methods: {
    increaseCount() {
      // 修改状态数据
      this.$store.commit("increaseCount");
    }r
  }
};
</script>

```

## 项目实战
业务目标
1、制作一个需要账号登录的课程学习项目
2、不同的课程需要不同的会员等级，实现购买会员的功能，课程分享

项目功能
1、通过state.userinfo控制用户登录路由限制
2、多组件共享state.userStatus 和 state.vipLevel状态
3、多组件修改state.userstatus 和 state.vipLevel状态

文件目录树
```
src
    ├── App.vue
    ├── main.js
    ├── router.js
    ├── store
    │   ├── actions.js
    │   ├── getters.js
    │   ├── index.js
    │   ├── mutations.js
    │   └── state.js
    └── views
        ├── Home.vue
        └── Login.vue
```

文件代码
App.vue
```html
<template>
  <div id="app">
    <router-view/>
  </div>
</template>

```

    
main.js
```js
import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import Vant from 'vant';
import 'vant/lib/index.css';

Vue.use(Vant);

Vue.config.productionTip = false

// 前置守卫，权限校验
router.beforeEach((to, from, next) => {
    if (store.state.username || to.path === "/login") {
        next()
    } else {
        next({
            path: "/login"
        })
    }
})


new Vue({
    store,
    router,
    render: h => h(App)
}).$mount('#app')
```
router.js
```js
import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [{
            path: '/',
            name: 'Home',
            component: Home
        },
        {
            path: '/login',
            name: 'Login',
            component: () =>
                import ('./views/Login.vue')
        }
    ]
})
```
store/actions.js
```js
export default {
    buyVip({ commit }, username) {
        return new Promise((resolve, reject) => {
            // 模拟后端交互耗时
            setTimeout(() => {
                commit("setUserInfo", username)
                resolve("购买成功")
            }, 1000)
        })
    }
}
```
store/getters.js
```js
export default {
    getUserLevel(state) {
        switch (state.username) {
            case "admin":
                return "管理员";
                
            case "user":
                return "会员";
               
            default:
                return "普通用户"
                
        }
    }
}
```
store/index.js
```js
import Vuex from 'vuex'
import Vue from 'vue'
import state from './state'
import mutations from './mutations'
import getters from './getters'
import actions from './actions'

Vue.use(Vuex)

const store = new Vuex.Store({
    state,
    getters,
    actions, // 异步操作
    mutations // 同步操作
})

export default store
```
store/mutations.js
```js
export default {
    setUserInfo(state, username) {
        state.username = username;
    }

}
```
store/state.js
```js
export default {
    username: "",
    password: ""
}
```

views/Home.vue
```html
<template>
  <div>
    <h1>详情页</h1>
    <p>欢迎登录:</p>
    <p>{{this.$store.getters.getUserLevel}}</p>
    <p>{{getUserLevel}}</p>
    <p>{{this.$store.state.username }}</p>
    <p>{{username}}</p>
    <van-button type="primary" @click="byVip" size="large">购买会员</van-button>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";

export default {
  computed: {
    // 解构
    ...mapGetters(["getUserLevel"]),
    ...mapState(["username"])
  },

  methods: {
    byVip() {
      this.$store.dispatch("buyVip", "user").then(res => {
        this.$dialog.alert({
          message: res
        });
      });
    }
  }
};
</script>
```
views/Login.vue
```html
<template>
  <div style="margin: 20px;">
    <div style="text-align: center;background-color:#EEEEEE">
      <h1>登录</h1>
    </div>
    <van-cell-group>
      <van-field v-model="username" label="用户名" placeholder="请输入用户名" required />

      <van-field v-model="password" @keyup.enter.native="login" label="密码" type="password" placeholder="请输入密码" required />
      <div style="margin-top:30px">
        <van-button type="primary" @click="login" size="large">登录</van-button>
      </div>
    </van-cell-group>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: "",
      password: ""
    };
  },
  methods: {
    login() {
      if (this.username !== "" && this.password !== "") {
        this.$store.commit("setUserInfo", this.username);
        this.$router.push({
          path: "/"
        });
      } else {
        this.$dialog.alert({
          message: "登录失败"
        });
      }
    }
  }
};
</script>
```