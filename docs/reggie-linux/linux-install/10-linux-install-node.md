# 安装node.js

```bash
wget https://mirrors.huaweicloud.com/nodejs/v16.20.2/node-v16.20.2-linux-x64.tar.xz \
&& tar xf node-v16.20.2-linux-x64.tar.xz \
&& mkdir /usr/local/node \
&& mv node-v16.20.2-linux-x64 /usr/local/node/v16.20.2 \
&& /usr/local/node/v16.20.2/bin/node  /usr/local/node/v16.20.2/bin/npm i -g pnpm@7 --registry=https://registry.npmmirror.com
```
