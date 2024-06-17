# Aixos在Vue中的使用

用到的模块：
```
Vue
Axios
vant
```

## 1、接口配置
server/contactApi.js

```js
// 统一接口管理
const CONTACT_API = {
    // 获取联系人列表
    getContactList: {
        method: "get",
        url: "/contactList.json"
    }
}


export default CONTACT_API

```


## 2、配置全局的Http请求函数
server/http.js
```js
import axios from "axios";
import contactApi from "./contactApi"
import {Toast} from "vant"

let instance = axios.create({
    baseURL: "/",
    timeout: 1000 // 毫秒
})

// 包装请求方法的容器
const Http = {}

for(let key in contactApi){
    let api = contactApi[key]

    let response = {};
    
    // async 作用，避免进入回调地狱
    Http[key] = async function(data){
        try{
            response = await instance[api.method](api.url, {params: data})
        }catch(err){
            response = err;
        }
        return response;
    }
}

// 请求拦截器
instance.interceptors.request.use(
    config => {
        Toast.loading({
            mask: false,
            duration: 0,  // 一直存在
            forbidClick: true, // 禁止点击
            message: "加载中..."
        })
        return config;
    },()=>{
        Toast.clear()
        Toast("请求出错")
    }
)

// 添加响应拦截器
instance.interceptors.response.use(
    res => {
        Toast.clear()
        return res.data;
    },()=>{
        Toast.clear()
        Toast("请求出错")
    }
)

export default Http
```

## 3、全局挂载
main.js
```js

// 把Http挂在到vue实例上，全局可用
Vue.prototype.$Http = Http
```

## 4、视图中调用http
views/VantIndex.vue
```html
<template>
  <div>
    <!-- 联系人列表 -->
    <van-contact-list :list="list" />
    
  </div>
</template>

<script>
// 引入组件
import { ContactList } from "vant";

export default {
  name: "vantIndex",

  data() {
    return {
      list: []
    };
  },

  // 注册组件
  components: {
    [ContactList.name]: ContactList
  },

  methods: {
    async getContactList() {
      let res = await this.$Http.getContactList({ name: "Tom" });
      this.list = res.data;
    }
  },

  created() {
    this.getContactList();
  }
};
</script>

```
## 5、修改路由
router.js
```js
routes: [
      {
        path: '/',
        name: 'index',
        component: () => import('./views/VantIndex.vue')
    }
  ]
```

## 6、测试数据 public/contactList.json
```json
{
    "code": 200,
    "data": [
        {
            "name": "张三",
            "tel": "13000000000",
            "id": 1
        },
        {
            "name": "李四",
            "tel": "13000000001",
            "id": 2
        },
        {
            "name": "王五",
            "tel": "13000000002",
            "id": 3
        }
    ]
}
```

启动服务访问测试
```
npm run serve
```
http://localhost:8080/


环境配置参考
> 1. [前端开发：axios在vue中的使用](https://pengshiyu.blog.csdn.net/article/details/97760659)
> 2. [前端开发：vant在vue中的使用](https://pengshiyu.blog.csdn.net/article/details/97761945)

