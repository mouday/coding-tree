# 《瑞吉外卖》Linux笔记

学习资料
- [https://www.runoob.com/linux/linux-tutorial.html](https://www.runoob.com/linux/linux-tutorial.html)

## 目录

- Linux简介
- Linux环境搭建
- 常用命令
- 安装软件
- 项目部署

## Linux简介

主流操作系统

- 桌面操作系统
    - Windows
    - Mac OS
    - Linux
- 服务器操作系统
    - Unix
    - Linux
    - Windows Server
- 移动设备操作系统
    - Android
    - iOS
- 嵌入式操作系统
    - Linux

Linux系统版本

- 内核版
- 发行版
    - Ubuntu 桌面应用
    - RedHat 
    - CentOS 
    - openSUSE
    - Fedora
    - 红旗Linux

## Linux环境搭建

常见的虚拟机软件

- VMWare
- VirtualBox
- VMLite WorkStation
- Qemu
- HopeddotVOS

修改网卡

```bash
$ ip addr

$ cd /etc/sysconfig/network-scripts

$ vim ifcfg-eth0
# ONBOOT=no
ONBOOT=yes
```

SSH连接工具 (secure shell)

- putty
- secureCRT
- xshell
- finalshell

通过docker进入Linux

```bash
# 运行centos
docker run -itd --name centos centos /bin/bash

# 进入终端
docker exec -it centos /bin/bash
```

## Linux常用命令

- Linu常用命令
- 文件目录操作命令
- 拷贝移动命令
- 打包压缩命令
- 文本编辑命令
- 查找命令

### 1、Linu常用命令

| 命令 | 英文 | 作用
| - | - | - 
| ls | list |  查看当前目录下的内容
| pwd | print work directory | 查看当前所在目录
| cd | change directory | 切换目录
| touch | - | 如果文件不存在，新建文件
| mkdir | make directory |  创建目录
| rm  | remove | 删除指定文件

修改Linux编码

```bash
echo 'LANG="en_US.UTF-8"' >> /ect/profile
source /ect/profile
```

使用技巧

- tab键自动补全
- 连续两次tab键操作提示
- 上下箭头，切换命令历史
- clear 或者 ctrl + l 清空屏幕

Linux命令格式

```bash
# 空格隔开
command [-options] [parameter]
```

说明

- command 命令名
- [-options]  选项，可选
- [parameter] 参数

示例

```bash
# 命令
$ pwd

# 命令 + 选项
$ ls -l

# 命令 + 参数
$ touch 1.txt 2.txt

# 命令 + 选项 + 参数
$ rm -f 1.txt
```

### 2、文件目录操作命令

2.1、`ls` 显示目录下内容

语法

```bash
ls [-al] [dir]
```

说明

- `-a` 显示所有文件及目录，包括隐藏目录
- `-l` 显示文件详细信息 
    - d 表示目录
    - `-` 表示文件

> 注意 `ls -l` 可以简写 `ll`

2.2、`cd` 切换当前工作目录

语法

```
cd [dirname]
```

特殊说明

- `~` 当前用户的home目录
- `.` 当前所在目录
- `..` 上级目录
- `/` 根目录

2.3、`cat` 查看文件内容

语法

```bash
cat [-n] filename
```

说明
- `-n` 由1开始对所有输出的行数编号

2.4、`more` 以分页形式显示文件内容

语法
```bash
more filename
```

操作说明

- 回车键 向下滚动一行
- 空格键 向下滚动一屏
- b 返回上一屏
- q 或者 ctrl+c 退出


2.5、`tail`查看文件末尾内容

语法

```bash
tail [-f] filename
```

说明

- `-f` 动态读取文件末尾内容并显示，常用于日志文件的内容输出

示例

```bash
# 默认显示最后10行的内容
tail main.go

# 显示最后20行的内容
tail -20 main.go

# 动态显示日志文件, ctrl + c退出
tail -f main.log
```

2.6、`mkdir` 创建目录

语法

```bash
mkdir [-p] dirname
```

说明
 - `-p` 创建多层目录


2.7、`rmdir` 删除空目录

语法
```bash
rmdir [-p] dirname
```

说明
- `-p` 如果子目录被删除后，父目录为空，则一并删除

示例

```bash
# 删除空目录
rmdir temp

# 删除空目录test，如果temp也是空目录，则一并删除
rmdir -p temp/test

# 支持通配符
rmdir temp*
```

2.8、`rm` 删除文件或者目录

语法

```bash
rm [-rf] name
```

说明

- `-r` 递归删除
- `-f` 强制删除

示例

```bash
# 删除所有文件，会逐一确认
rm -r temp

# 无需确认，直接删除所有文件
rm -rf temp

# 无需确认，直接删除
rm -f temp 
```

### 3、拷贝移动命令

3.1、`cp` 复制文件或目录

语法

```bash
cp [-r] source dest
```

说明

- `-r` 复制该目录下所有子目录和文件

示例
```bash
# 将文件hello.txt 复制到 temp 目录中
cp hello.txt temp/

# 将文件hello.txt 复制到 当前目录中，并改名为hello.java
cp hello.txt hello.java

# 将文件夹 复制到 目录temp2中
cp -r temp/ temp2/

# 将文件夹下所有文件和目录 复制到 目录temp2中
cp -r temp/* temp2/
```

### 4、打包压缩命令

4.1、`mv` 拷贝移动命令

语法

```bash
mv source dest
```

示例

```bash
# 移动文件，相当于重命名
mv hello.txt hi.txt

# 移动文件到目录
mv hello.txt temp/

# 移动或改名
# 如果temp2目录存在，则将目录temp1 移动到目录 temp2中
# 如果temp2目录不存在，则将目录temp1 改名为目录 temp2
mv temp1/ temp2/
```

3.3、`tar` 打包/解包、压缩/解压

语法

```bash
tar [-zcxvf] filename [files]
```

文件后缀

- `.tar` 打包文件 
- `.tar.gz` 打包+压缩文件

说明

- `-z` gzip 压缩或解压
- `-c` create 创建新的包文件
- `-x` extract 从包文件中提取文件
- `-v` verbose 显示命令执行过程
- `-f` file 指定包文件的名称

示例

```bash
# 将目录temp 打包为temp.tar
$ tar -cvf temp.tar temp

# 将目录temp 打包并压缩 为temp.tar.gz
$ tar -zcvf temp.tar.gz temp

# 解包 temp.tar
$ tar -xvf temp.tar

# 解压 temp.tar.gz
$ tar -zxvf temp.tar.gz

# 解压 temp.tar 并指定解压文件放置目录
$ tar -zxvf temp.tar.gz -C temp
```

### 5、文本编辑命令

5.1、vi/vim 文本编辑

语法

```bash
vi filename
```

vim可以对文本内容着色

安装vim

```bash
yum -y install vim
```

说明

- 指定文件存在，直接打开；不存在则新建
- vim分为三种模式：
    - 命令模式 command mode
    - 插入模式 insert mode
    - 底行模式 last line mode

命令模式

- 可以查看文件内容
- 移动光标 
    - 上下左右箭头
    - gg 移动光标到文件开头
    - G 移动光标到文件结尾

插入模式

- 可以编辑文件内容
- 命令模式下按 [i, a, o] 进入插入模式
- `ESC` 退出插入模式，回到命令模式

底行模式

- 查找文件内容，显示行号，退出等操作
- 命令模式下按 [:, /] 进入底行模式
- `/`进入底行模式
    - 查找文件内容
- `:`进入底行模式
    - `wq` 保存并退出
    - `q!` 不保存退出
    - `set nu` 显示行号

### 6、查找命令

6.1、`find` 查找文件

语法

```bash
find dirname -option fiename
```

示例

```bash
# 在当前目录及其子目录下查找.java结尾的文件
find . -name "*.java"

# 在/opt 目录及其子目录下查找.java结尾的文件
find /opt -name "*.java"
```

6.2、`grep` 查找文本内容

语法

```bash
grep word filename
```

示例

```bash
# 在hello.java文件中查找Hello
grep Hello hello.java

# 在所有.java结尾的文件中查找Hello
grep Hello *.java
```

## 软件安装

- 软件安装的方式
- 安装jdk
- 安装tomcat
- 安装mysql
- 安装lrzsz

### 1、软件安装的方式

- 二进制发布包安装：解压即可
- rpm安装：不能自动解决依赖库
- yum安装：自动解决依赖库
- 源码编译安装：需要自行编译打包

### 2、安装jdk

使用二进制发布包安装方式安装jdk

下载(需要登录)

https://www.oracle.com/java/technologies/downloads/#java8-linux

```bash
# 上传到Linux，这里使用的docker环境
docker cp jdk-8u351-linux-x64.tar.gz centos:/usr/local

# 解压
tar -zxvf jdk-8u351-linux-x64.tar.gz -C /usr/local
```

配置环境变量

```bash
vim /etc/profile

# jdk
JAVA_HOME=/usr/local/jdk1.8.0_351
PATH=$JAVA_HOME/bin:$PATH
```

检查环境变量

```bash
# 使配置文件生效
$ source /etc/profile

# 检查安装是否成功
$ java -version
java version "1.8.0_351"
Java(TM) SE Runtime Environment (build 1.8.0_351-b10)
Java HotSpot(TM) 64-Bit Server VM (build 25.351-b10, mixed mode)
```

### 3、安装tomcat


开源地址：[https://github.com/apache/tomcat](https://github.com/apache/tomcat)

下载地址

- [https://tomcat.apache.org/](https://tomcat.apache.org/)
- [阿里云镜像站](https://mirrors.aliyun.com/apache/tomcat/)
- [中国互联网络信息中心](https://mirrors.cnnic.cn/apache/tomcat/)
- [清华大学开源软件镜像站](https://mirrors.tuna.tsinghua.edu.cn/apache/tomcat/)

下载

```bash
yum -y install wget

wget https://mirrors.aliyun.com/apache/tomcat/tomcat-8/v8.5.84/bin/apache-tomcat-8.5.84.tar.gz
```

解压

```bash
tar -zxvf apache-tomcat-8.5.84.tar.gz -C /usr/local/
cd /usr/local/
```

启动
```bash
cd apache-tomcat-8.5.84/bin
bash startup.sh
```

验证启动是否成功

方式一：查看启动日志

```bash
cd logs/

more catalina.out

# 或者只查看最后几行日志
tail catalina.out
```

方式二：查看进程

```bash
ps -ef | grep tomcat
```

注意：

- `-ps` 查看当前运行的所有进程的详细信息
- `|` 管道符，前一个命令的输出作为后一个命令的输入


### 4、安装mysql
### 5、安装lrzsz






https://www.bilibili.com/video/BV13a411q753/?p=134&spm_id_from=pageDriver&vd_source=efbb4dc944fa761b6e016ce2ca5933da