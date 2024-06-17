# vue-cli

## 为什么使用vue-cli
1、平台无关
2、占内存少，更高效。代码部署，热加载...
3、通用工具

## cli
Command Line Interface
命令行界面

前台、后台
前端、后端

##npm

npm node package manager 
cnpm 国内镜像

参数
-g global 全局安装
-S save 安装包信息加入到dependencies生产阶段依赖
-D --save --dev 安装包信息加入到devDependencies生产阶段+开发阶段依赖，开发阶段一般使用它
i install 缩写，没有'-'

查看全局安装的文件夹位置
```bash
npm root -g
```

初始化
```bash
npm init -f
```
参数f使用默认设置，如果不初始化，本地安装会报错

## 指定下载服务器
1、安装cnpm, 指定下载位置
```bash
npm install -g cnpm --registry=https://registry.npm.taobao.org
```
2、设置npm默认下载地址
```bash
npm config set registry https://registry.npm.taobao.org
npm config get registry # 查看 
```
3、cnpm安装vue-cli2
```bash
cnpm install -gd vue-cli
```

检查环境
```bash
$ node -v
v10.16.0

$ npm -v
6.9.0
```

查看vue版本号
```bash
$ vue -V
2.9.6
```

vue-cli2创建项目(不能有大写字母)
```bash
vue init webpack project-name
```

部分重要配置
官方路由 install vue-router? yes
代码风格 use ESLint to lint your code? yes

启动服务

```bash
cd project-name
npm run dev
```
http://localhost:8080

Sublime Vue语法高亮
https://github.com/vuejs/vue-syntax-highlight

下载解压 -> References -> Browser Packages
-> 新建文件夹Vue -> 将解压的文件放入文件夹中

->ctrl + shift + p
搜索 vue -> 选择 Set Syntax:Vue Component

路由配置
```js
import A from '@/components/A.vue';

routes: [
    {
      path: '/a',
      name: 'A',
      component: A
    }
]
```

路由跳转
```html
<router-link to="/a">a页面</router-link>
```

