# Aixos

1、Aixos特性
（1）支持Promise API
（2）拦截请求和响应
（3）装换请求数据和响应数据
（4）取消请求
（5）自动转换JSON数据
（6）客户端支持防御XSRF

2、Axios基础用法
get post put等请求方法

3、Axios进阶用法
实例 配置 拦截器 取消请求

4、Axios进一步封装


## Axios基础用法

文档：https://www.npmjs.com/package/axios

1、axios请求方法
```
get      获取数据
post     提交数据（表单提交+文件上传）
put      更新数据（所有数据推送到后端）
patch    更新数据（只将修改的数据推送到后端）
delete   删除数据
```

2、项目环境搭建
```
# 安装vue
$ npm install -g @vue/cli --registry=https://registry.npm.taobao.org
$ npm install -g serve
$ vue --version   # 3.9.3

$ npm uninstall -g @vue/cli   # 卸载

$ vue create hello-world      # 创建项目

（1）选择自定义，增加以下两个选项
router
css processer

（2）选择默认配置后，可以自定义添加以下3个插件
$ vue add @vue/eslint     # 安装插件
$ vue add router
$ vue add vuex 

$ cd hello-world
$ npm run serve           # 启动项目
$ npm run build           # 打包压缩

# -s 参数的意思是将其架设在 Single-Page Application 模式下
# 这个模式会处理即将提到的路由问题
serve -s dist
```

安装axios
```
npm install axios
```

3、路由引入
```vue
// 方式一 
// 不管有没有访问都加载
import Home from './views/Home.vue'

component: Home


// 方式二 
// 访问时才加载，异步加载，懒加载
component: () => import('./views/Home.vue')
```

4、axios在vue项目中使用实例

```js
import Axios from "axios";

export default {
  name: "mydata",

  created() {
  
    let data = {
      name: "Tom"
    };

    /**
     * GET
     * /getData.json?name=Tom
     */
    Axios.get("/getData.json", {
      params: data
    }).then(response => {
      console.log(response);
    });

    /**
     * POST
     */

    // Content-Type: application/json
    Axios.post("/PostJsonData.json", data).then(response => {
      console.log(response);
    });

    // Content-Type: multipart/form-data
    let formData = new FormData();
    for (let key in data) {
      formData.append(key, data[key]);
    }

    Axios.post("/PostFormData.json", formData).then(response => {
      console.log(response);
    });

    /**
     * PUT
     * Content-Type: application/json
     */
    Axios.put("/PutData.json", data).then(response => {
      console.log(response);
    });

    /**
     * PATCH
     * Content-Type: application/json
     */
    Axios.patch("/PatchData.json", data).then(response => {
      console.log(response);
    });

    /**
     * DELETE
     */

    // /DeleteData.json?name=Tom
    Axios.delete("/DeleteData.json", {
      params: data
    }).then(response => {
      console.log(response);
    });

    // Content-Type: application/json
    Axios.delete("/DeleteData.json", {
      data: data
    }).then(response => {
      console.log(response);
    });

    /**
     * Axios
     */
    Axios({
      url: "/url",
      method: "GET",
      params: data,   // url 参数
      data: data      // 请求体参数
    }).then(response => {
      console.log(response);
    });
  }
};
```

5、并发请求
同时进行多个请求，并统一处理返回值

```js
/**
 * 并发请求
 */
Axios.all([
  Axios.get("/data.json"), 
  Axios.get("/city.json")
]).then(
  Axios.spread((dataRes, cityRes) => {
    console.log(dataRes, cityRes);
  })
);
```

## axios进阶用法
1、axios实例
后端接口地址有多个，并且超时时长不一样

代码实例
```js

import axios from "axios";

export default {
  name: "axiosDemo",

  created() {
    let instance = axios.create({
      baseURL: "http://localhost:8080",
      timeout: 1000 // 1s
    });

    instance.get("/data.json").then(response => {
      console.log(response);
    });
  }
};

```

2、axios配置参数

参数 | 说明 | 示例
- | - | -
baseURL | 请求的域名，基本地址| "http://localhost:8080"
timeout | 请求超时时长，毫秒  | 1000
url     | 请求路径 | "/data.json"
method  | 请求方法  | "get/post/put/patch/delete"
headers | 请求头  | {"token": ""}
params  | url参数 | {}
data    | body参数 | {}

(1) axios全局配置

```js
axios.defaults.baseURL = "http://localhost:8080";
axios.defaults.timeout = 1000;

```

(2) axios实例配置
```js
let instance = axios.create();
instance.defaults.timeout = 2000;

```

(3) axios请求配置
```js
instance.get("data.json", {
    timeout: 3000
});
```

3、实际开发示例
有两个请求接口
http://localhost:8081
http://localhost:8082

```js
let instance1 = axios.create({
    baseURL: "http://localhost:8081",
    timeout: 1000
});

let instance2 = axios.create({
    baseURL: "http://localhost:8082",
    timeout: 2000
});

/** 用到的参数
 * baseURL、timeout、method、params
 */
instance1.get("/data.json", {
  params: {"name": "Tom"}
}).then(
  response => {}
);

/** 用到的参数
 * baseURL、timeout、method
 */
instance2.get("/data.json", {
  timeout: 5000  // 重新赋值
}).then(
  response => {}
);
```

4、axios拦截器
拦截器：在请你去或响应被处理前拦截它们
（1）请求拦截器
```js
axios.interceptors.request.use(
config => {
  // 在请求发送前处理
  return config;
}, err => {
  // 在请求错误时候处理
  return Promise.reject(err);
});

```

（2）响应拦截器
```js
axios.interceptors.response.use(
res => {
  // 在请求成功对响应数据处理
  return config;
}, err => {
  // 在响应错误时候处理
  return Promise.reject(err);
});

```

(3)取消拦截器
```js

let interceptors = axios.interceptors.request.use(
  config => {
    config.headers = {
      auth: true
    };
    return config;
  });


axios.interceptors.request.eject(interceptors);

```

代码实例
```js

/**
 * 不需要登录的接口
 */
let newInstance = axios.create({});


/**
 * 登录状态 token
 */

let instance = axios.create({});

instance.interceptors.request.use(
config => {
  config.headers.token = "token";
  return config;
});


/**
 * 移动开发
 */
let phoneInstance = axios.create({});

// 请求前显示弹框
phoneInstance.interceptors.request.use({
config => {
  $("#model").show();
  return config;
}
});

// 请求后隐藏弹框
phoneInstance.interceptors.response.use({
res => {
  $("#model").hide();
  return res;
}
})

```

5、axios错误处理
```js

axios.interceptors.request.use(
config => {
  return config;
}, err => {
  return Promise.reject(err);
});

axios.interceptors.response.use(
res => {
  return config;
}, err => {
  return Promise.reject(err);
});


axios.get("/data.json").then(
res => {
  // 请求成功
}
).catch(
err => {
  // 请求错误
})


// 实际开发中，添加统一的错误处理
let instance = axios.create({});

instance.interceptors.request.use(
config => {
  return config;
}, err => {
  // 请求错误，一般http状态码以4开头，401超时，404 not find
  $("#model").show();
  setTimeout(()={
    $("#model").hide();
  }, 2000);
  return Promise.reject(err);
});

instance.interceptors.response.use(
res => {
  return res;
}, err => {
  // 响应错误，一般http状态码以5开头，500系统错误，502系统重启
  $("#model").show();
  setTimeout(()={
    $("#model").hide();
  }, 2000);
  return Promise.reject(err);
});

instance.get("/data.json").then(
  res=>{

  }).catch(
  err=>{

  })

```

6、axios取消请求
取消正在进行的http请求

使用情况：商城 3-5秒

```js
let source = axios.CancelToken.source();

axios.get("/data.json", {
  CancelToken: source.token
}).then(
  res=>{

}).catch(
  err=>{

});

// 取消请求 message可选
source.cancel("cancel http");

```

