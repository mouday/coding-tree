# dubbo-admin

## 一、dubbo-admin安装

**1、环境准备**

dubbo-admin 是一个前后端分离的项目。前端使用vue，后端使用springboot，安装 dubbo-admin 其实就是部署该项目。我们将dubbo-admin安装到开发环境上。要保证开发环境有jdk，maven，nodejs

安装node**(如果当前机器已经安装请忽略)**

因为前端工程是用vue开发的，所以需要安装node.js，node.js中自带了npm，后面我们会通过npm启动

下载地址

```
https://nodejs.org/en/
```

![](https://cdn.jsdelivr.net/gh/mouday/img/2024/06/01/2iyxg2r.png)



**2、下载 Dubbo-Admin**

进入github，搜索dubbo-admin

```
https://github.com/apache/dubbo-admin
```

**3、把下载的zip包解压到指定文件夹**

解压到那个文件夹随意


**4、修改配置文件**

解压后我们进入目录，找到 **application.properties** 配置文件 进行配置修改

```
dubbo-admin-server/src/main/resources/application.properties
```


修改zookeeper地址

```bash
# centers in dubbo2.7
admin.registry.address=zookeeper://127.0.0.1:2181
admin.config-center=zookeeper://127.0.0.1:2181
admin.metadata-report.address=zookeeper://127.0.0.1:2181
```


- `admin.registry.address` 注册中心
- `admin.config-center` 配置中心
- `admin.metadata-report.address` 元数据中心

**5、先打包前端代码**

dubbo-admin-ui 目录下执行命令

```shell
cd dubbo-admin-ui

$ node -v
v10.16.0

npm install

npm run build
```

**6、再打包后端代码**

在 dubbo-admin-develop 目录执行打包命令

```shell
mvn --projects dubbo-admin-server clean package -Dmaven.test.skip=true
```

输出结果
```bash
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time:  8.200 s
[INFO] Finished at: 2024-06-01T17:02:06+08:00
[INFO] ------------------------------------------------------------------------
```
**7、启动后端**


执行下面的命令启动 dubbo-admin，dubbo-admin后台由SpringBoot构建。

```shell
java -jar  dubbo-admin-server/target/dubbo-admin-server-0.1.jar
```

**8、访问**

浏览器输入。用户名密码都是`root`

```
http://localhost:8081/
```
如果端口被占用，可以修改端口号

```bash
# application.properties
server.port=8082
```

![](https://cdn.jsdelivr.net/gh/mouday/img/2024/06/01/27x3ehs.png)

## 二、dubbo-admin简单使用

注意:Dubbo Admin【服务Mock】【服务统计】将在后续版本发布....

在上面的步骤中，我们已经进入了Dubbo-Admin的主界面，在【快速入门】章节中，我们定义了服务生产者、和服务消费者，下面我们从Dubbo-Admin管理界面找到这个两个服务

**1、点击服务查询**


**2、查询结果**

![](https://cdn.jsdelivr.net/gh/mouday/img/2024/06/01/u8uengw.png)

A:输入的查询条件com.itheima.service.UserService

B:搜索类型，主要分为【按服务名】【按IP地址】【按应用】三种类型查询

C:搜索结果

**3.1.4 dubo-admin查看详情**

我们查看com.itheima.service.UserService （服务提供者）的具体详细信息，包含【元数据信息】

**1）点击详情**



从【详情】界面查看，主要分为3个区域

A区域：主要包含服务端 基础信息比如服务名称、应用名称等

B区域：主要包含了生产者、消费者一些基本信息

**C区域：是元数据信息，注意看上面的图,元数据信息是空的**

我们需要打开我们的生产者配置文件加入下面配置

```xml
<!-- 元数据配置 -->
<dubbo:metadata-report address="zookeeper://192.168.149.135:2181" />
```

重新启动生产者，再次打开Dubbo-Admin

这样我们的元数据信息就出来了


![](https://cdn.jsdelivr.net/gh/mouday/img/2024/06/01/bdsj1dr.png)