# VueCli3 全栈项目

主要内容
接口 Node + express + jwt
前端 VueCli3.0 + Element-UI
请求数据 Axios + Mlab + MongoDB

功能 
1. 分页
2. 筛选
3. 用户注册
4. 登录
5. jwt用户验证

## 1、新建项目
```
mkdir node-app && cd node-app
npm init
touch server.js
cnpm install express -S
```

server.js
```js
const express = require("express");

const app = express();

app.get("/", (req, res) => {
    res.send("hello world!");
})

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server runing on http://127.0.0.1:${port}`);
})
```

启动服务
```bash
node server.js

# 全局安装
cnpm install nodemon --save-dev

# 文件变化自动重启
nodemon server.js
```

package.json
```
"script": {
    "start": "node server.js",
    "server": "nodemon server.js"
}
```

```
线上运行
npm run start

本地测试
npm run server
```

## 2、MongoBD数据库
https://mlab.com/
cnpm install mongoose -S

```js
const mongoose = require("mongoose");

// 配置
// SANDBOX Cluster-app
let mongoURL = "mongodb://127.0.0.1:27017/data";

mongoose.connect(mongoURL).then(() => {
    console.log("mongodb connect");
}).catch((err) => {
    console.log(err);
})
```

## 3、建立模型

```js
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// 配置数据模型
const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now,
    },
})

module.exports = User = mongoose.model("User", UserSchema);
```

## 4、注册接口
cnpm install body-parser --save
cnpm install bcrypt --save

```js

/**
 * 用户注册
 */
router.post("/register", async (req, res) => {
    console.log(req.body);

    // 查询数据库中是否有这个邮箱
    const user = await User.findOne({ 'email': req.body.email })

    if (user) {
        res.status(400).json({ "msg": "邮箱已被注册" })
    } else {
        // 密码加密
        // https://www.npmjs.com/package/bcrypt
        const salt = bcrypt.genSaltSync(10);

        const newUser = new User({
            name: req.body.user,
            email: req.body.email,
            // avatar,
            password: bcrypt.hashSync(req.body.email, salt)
        })

        const result = await newUser.save()
        res.json(result);
    }
})
```

## 5、使用全球公认头像
https://en.gravatar.com/
```js
cnpm install gravatar  --save
```

## 6、用户登录
```js

/**
 * 用户登录
 */
router.post("/login", async (req, res) => {
    console.log(req.body);

    // 查询数据库中是否有这个邮箱
    const user = await User.findOne({ 'email': req.body.email })

    // 用户校验
    if (!user) {
        res.status(404).json({ "msg": "用户不存在" })
    } else {
        // 密码校验
        if (bcrypt.compareSync(req.body.password, user.password)) {
            res.json({ "msg": "success" })
        } else {
            res.status(400).json({ "msg": "密码错误" })
        }
    }
})
```

## 7、jwt实现token 
cnpm install jsonwebtoken --save

```js
const jwt = require('jsonwebtoken');

let token = jwt.sign(data, keys.secretKey, { expiresIn: 60 * 60 });
```

## 8、验证jwt
npm i passport passport-jwt --save

## 
package.json 不显示依赖
```
npm install -S jquery
或者
npm install --save jquery
```

>参考
>[package.json 不显示依赖](https://segmentfault.com/q/1010000008407026/a-1020000008407253)

## 9、添加数据
```js
/**
 * 添加数据
 */
router.post("/add", passport.authenticate('jwt', { session: false }), async (req, res) => {
    const data = {
        type: req.body.type || '',
        describe: req.body.describe || '',
        income: req.body.income || '',
        expend: req.body.expend || '',
        remark: req.body.remark || '',
        cash: req.body.cash || '',
    }
    const profile = await new Profile(data).save();

    res.json(profile)
})
```

## 10、获取数据
```js

/**
 * 获取列表数据
 */
router.get("/list", passport.authenticate('jwt', { session: false }), async (req, res) => {
    const list = await Profile.find()
    res.json(list)
})

/**
 * 获取单条数据
 */
router.get("/:id", passport.authenticate('jwt', { session: false }), async (req, res) => {
    const row = await Profile.findOne({ _id: req.params.id })
    res.json(row)
})
```

## 11、前端页面
创建前端项目
```
$ vue -V
3.12.0

$ vue create client

1、Manually
2、Babel Router Vuex
3、package.json
4、preset N
```

操作
```
a 全选
i 反选
空格 选中
回车安装
```

前后端连载
```
cnpm install concurrently --save-dev
```

client/package.json
```json
"scripts": {
    "start": "npm run serve"    
}

```

package.json
```json
"scripts": {
    // 安装前端依赖
    "client-install": "npm install --prefix client",    
    // 启动前端项目
    "client": "npm start --prefix client",
    // 启动前后端项目
    "dev": "concurrently \"npm run server\" \"npm run client\""
}

```

reset.css
https://meyerweb.com/eric/tools/css/reset/


安装element-ui
cd client
cnpm i element-ui -S

404
表单
表单验证

cd client
cnpm i axios -S

Proxy error: Could not proxy request /api2/users/login from localhost:8080 to localhost:3000 (ENOTFO
https://blog.csdn.net/reagan_/article/details/97498160

解析jwt
cnpm i jwt-decode -S

