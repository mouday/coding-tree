[返回目录](/blog/react/atguigu-react)

# 5、React UI组件库

- material-ui: https://mui.com/material-ui/
- Ant Design: https://ant.design/index-cn/

其他组件库

- Element-UI（适用于Vue.js）: https://element.eleme.io/#/zh-CN
- Vant-UI(适用于Vue.js移动端): https://vant-contrib.gitee.io/vant/#/zh-CN



安装

```
$ pnpm install antd --save
```

使用示例

```js
import React, { Component } from "react";

import { Button } from "antd";

export default class App extends Component {
  render() {
    return (
      <div className="app">
        <Button type="primary">Primary Button</Button>
      </div>
    );
  }
}

```

进阶使用

- 按需引入
- 自定义主题
