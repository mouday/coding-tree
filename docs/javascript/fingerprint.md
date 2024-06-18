# FingerprintJS

获取浏览器指纹

文档

- npmjs： https://www.npmjs.com/package/@fingerprintjs/fingerprintjs
- github：https://github.com/fingerprintjs/fingerprintjs

安装

```bash
npm i @fingerprintjs/fingerprintjs
```

示例

```js
// utils/fingerprint-util.js

import FingerprintJS from "@fingerprintjs/fingerprintjs";

export async function getVisitorId() {
  // 初始化指纹JS Library
  const fp = await FingerprintJS.load();
  // 获取访客ID
  const result = await fp.get();
  return result.visitorId;
}
```

使用示例

```js
import {getVisitorId} from "@/utils/fingerprint-util.js";

// 获取访客ID
(async ()=>{
  const visitorId = await getVisitorId();
  console.log(visitorId);
  // 4f7f11bbcfd0bb9f9758fb144a9b4548
})()
```

可以获取一个`32位`长度的指纹id，例如：4f7f11bbcfd0bb9f9758fb144a9b4548

