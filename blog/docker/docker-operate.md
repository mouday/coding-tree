[返回目录](/blog/docker/index)

# 三、Docker的基本操作

- 镜像操作
- 容器操作
- 数据卷（容器数据管理）

## 1、镜像名称

- 镜像名称一般分两部分组成：`[repository]:[tag]`
- 在没有指定tag时，默认是`latest`，代表最新版本的镜像

例如：mysql:5.7

- repository: mysql
- tag: 5.7

## 2、镜像命令

![](img/docker-operate.png)

### 2.1、案例1-拉取、查看镜像

需求：从DockerHub中拉取一个nginx镜像并查看

镜像仓库：https://hub.docker.com/

```bash
# 拉取镜像，默认tag=latest
docker pull nginx

# 查看拉取到的镜像
docker images
```


### 2.2、案例2-保存、导入镜像

需求：利用docker save将nginx镜像导出磁盘，然后再通过load加载回来

```bash
# 查看帮助
docker save --help
```

命令格式：

```bash
docker save -o [保存的目标文件名称] [镜像名称]
```

```bash
# 导出镜像到磁盘 
docker save -o nginx.tar nginx:latest

# 删除本地的nginx镜像
docker rmi nginx:latest

# 加载本地文件
docker load -i nginx.tar
```


## 3、容器命令

![](img/docker-command.png)

容器保护三个状态：

- 运行：进程正常运行
- 暂停：进程暂停，CPU不再运行，并不释放内存
- 停止：进程终止，回收进程占用的内存、CPU等资源

其中：

- docker run：创建并运行一个容器，处于运行状态
- docker pause：让一个运行的容器暂停
- docker unpause：让一个容器从暂停状态恢复运行
- docker stop：停止一个运行的容器
- docker start：让一个停止的容器再次运行
- docker rm：删除一个容器

### 3.1、案例1-创建并运行一个容器

https://hub.docker.com/_/nginx

创建并运行nginx容器的命令：

```bash
docker run --name containerName -p 宿主端口:容器端口 -d imageName
```

命令解读：

- docker run ：创建并运行一个容器
- --name : 容器名称
- -p ：端口映射，冒号左侧是宿主机端口，右侧是容器端口
- -d：后台运行
- imageName：镜像名称，例如nginx

例如

```bash
# 运行容器
docker run --name my-nginx -p 8080:80 -d nginx

# 查看容器状态
docker ps

# 查看所有容器状态，包括已停止的容器
docker ps -a

# 持续查看日志
docker logs -f my-nginx

# 删除已停止的容器
docker rm my-nginx

# 强制删除容器，包括正在运行中的容器
docker rm -f my-nginx
```

访问测试：http://127.0.0.1:8080/


### 3.2、案例2-进入容器，修改文件

需求：进入Nginx容器，修改HTML文件内容，添加：你好Nginx

> 注意：不推荐在容器中直接修改文件

步骤：

1）进入容器

进入我们刚刚创建的nginx容器的命令为：

```bash
docker exec -it my-nginx bash
```

命令解读：

- docker exec ：进入容器内部，执行一个命令
- -it : 给当前进入的容器创建一个标准输入、输出终端，允许我们与容器交互
- my-nginx ：要进入的容器的名称
- bash：进入容器后执行的命令，bash是一个linux终端交互命令


2）进入nginx的HTML所在目录 

```bash
# 参考文档 https://hub.docker.com/_/nginx
$ cd /usr/share/nginx/html

$ ls
50x.html  index.html
```

3）修改index.html的内容

容器内没有vi命令，无法直接修改，我们用下面的命令来修改：

```sh
sed -i -e 's#Welcome to nginx#你好Nginx#g' -e 's#<head>#<head><meta charset="utf-8">#g' index.html
```

访问测试：http://127.0.0.1:8080/

### 3.3、练习：运行redis容器

需求: 创建并运行一个redis容器，并且支持数据持久化

https://hub.docker.com/_/redis

步骤：

```bash
# 拉取镜像
docker pull redis

# 启动镜像，命令来自文档
docker run --name my-redis -p 6380:6379 -d redis redis-server --save 60 1 --loglevel warning

# 进入redis容器
# 方式一：通过bash进入redis容器
$ docker exec -it my-redis bash

# 连接redis
root@dc6903a9bcf7:/data# redis-cli

# 方式二：直接进入redis-cli
$ docker exec -it my-redis redis-cli

# 方式三：通过客户端连接redis
$ docker run -it --network host --rm redis redis-cli -h 127.0.0.1 -p 6380


# 操作redis数据
127.0.0.1:6379> set name Tom
OK
127.0.0.1:6379> get name
"Tom"
127.0.0.1:6379>exit

# 退出容器
root@dc6903a9bcf7:/data# exit

```

## 4、数据卷

数据卷（volume）是一个虚拟目录，指向宿主机文件系统中的某个目录。

数据卷作用：

将容器与数据分离，解耦合，方便操作容器内数据，保证数据安全

![](img/docker-volume.png)

### 4.1、数据卷操作命令

基本语法如下：

```bash
docker volume [COMMAND]
```

command操作：

- create 创建一个volume
- inspect 显示一个或多个volume的信息
- ls 列出所有的volume
- prune 删除未使用的volume
- rm 删除一个或多个指定的volume

示例

```bash
# 查看帮助
$ docker volume --help

# 创建一个数据卷
$ docker volume create html

# 查看数据卷
$ docker volume ls

# 查看数据卷信息
$ docker volume inspect html
[
    {
        "CreatedAt": "2023-03-12T13:59:45Z",
        "Driver": "local",
        "Labels": {},
        "Mountpoint": "/var/lib/docker/volumes/html/_data",
        "Name": "html",
        "Options": {},
        "Scope": "local"
    }
]

# 删除未使用的数据卷
$ docker volume prune

# 删除数据卷
$ docker volume rm html
```

### 4.2、挂载数据卷

命令格式如下：

```sh
docker run \
  --name mn \
  -v html:/root/html \
  -p 8080:80
  nginx \
```

说明：

- `-v html:/root/htm` ：把html数据卷挂载到容器内的/root/html这个目录中
- 如果volume不存在，会自动创建

### 4.3、案例1-给Nginx挂载数据卷

需求：创建一个nginx容器，修改容器内的html目录内的index.html内容

分析：已知nginx的html目录所在位置：/usr/share/nginx/html

步骤：

```bash
# 创建容器并挂载数据卷到容器内的HTML目录
docker run --name my-nginx \
    -v html:/usr/share/nginx/html \
    -p 8080:80 \
    -d nginx
```

进入html数据卷所在位置，并修改HTML内容

```bash
# 查看html数据卷的位置
$ docker volume inspect html

[
    {
        "CreatedAt": "2023-03-12T14:21:47Z",
        "Driver": "local",
        "Labels": null,
        "Mountpoint": "/var/lib/docker/volumes/html/_data",
        "Name": "html",
        "Options": null,
        "Scope": "local"
    }
]

# macOS需要执行如下命令进入
$ docker run -it --privileged --pid=host debian nsenter -t 1 -m -u -n -i sh

# 进入该数据卷目录
$ cd /var/lib/docker/volumes/html/_data

# 修改文件
vi index.html
```

### 4.4、挂载本地目录

容器可以挂载数据卷，也可以直接挂载到宿主机目录上

```bash
# 带数据卷模式：
宿主机目录 --> 数据卷 --> 容器内目录

# 直接挂载模式：
宿主机目录 --> 容器内目录
```

如图：

![](img/docker-volume-file.png)


语法：

目录挂载与数据卷挂载的语法是类似的：

```bash
-v [宿主机目录]:[容器内目录]
-v [宿主机文件]:[容器内文件]
```

### 4.5、案例2-给MySQL挂载本地目录

需求：创建并运行一个MySQL容器，将宿主机目录直接挂载到容器

https://hub.docker.com/_/mysql

步骤：

1、创建目录

存储目录 mysql/conf.d
配置目录 mysql/data

2、配置文件

hmy.cnf

```bash
[mysqld]
skip-name-resolve
character_set_server=utf8
datadir=/var/lib/mysql
server-id=1000
```

3、启动容器

```bash
# 拉取镜像
$ docker pull mysql:5.7.41

# 运行容器
docker run \
    --name my-mysql \
    -p 3309:3306 \
    -e MYSQL_ROOT_PASSWORD=123456 \
    -v /Users/hina/Applications/docker/mysql/conf.d:/etc/mysql/conf.d \
    -v /Users/hina/Applications/docker/mysql/data:/var/lib/mysql \
    -d mysql:5.7.41
```

### 4.6、小结

docker run的命令中通过 -v 参数挂载文件或目录到容器中：

- -v volume名称:容器内目录
- -v 宿主机文件:容器内文件
- -v 宿主机目录:容器内目录

数据卷挂载与目录直接挂载的

- 数据卷挂载耦合度低，由docker来管理目录，但是目录较深，不好找
- 目录挂载耦合度高，需要我们自己管理目录，不过目录容易寻找查看
