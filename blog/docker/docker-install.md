[返回目录](/blog/docker/index)

# 二、安装Docker

安装环境 CentOS 7

## 1、Docker版本

- CE 即社区版（免费，支持周期 7 个月）
    - stable
    - test
    - nightly
- EE 即企业版，强调安全，付费使用，支持周期 24 个月

安装指南：[https://docs.docker.com/install/](https://docs.docker.com/install/)


## 2、安装docker

安装yum工具

```bash
yum install -y yum-utils \
           device-mapper-persistent-data \
           lvm2 --skip-broken
```

更新本地镜像源：

```bash
# 设置docker镜像源
yum-config-manager \
    --add-repo \
    https://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
    
sed -i 's/download.docker.com/mirrors.aliyun.com\/docker-ce/g' /etc/yum.repos.d/docker-ce.repo

yum makecache fast
```

安装docker-ce社区免费版

```bash
yum install -y docker-ce
```

## 3、启动docker

关闭防火墙

```bash
# 关闭防火墙
systemctl stop firewalld

# 禁止开机启动防火墙
systemctl disable firewalld

# 查看状态
systemctl status firewalld
```

启动docker

```bash
systemctl start docker  # 启动docker服务

systemctl stop docker  # 停止docker服务

systemctl restart docker  # 重启docker服务

systemctl status docker  # 查看状态
```

查看docker版本：

```bash
docker -v
```

## 4、配置镜像

参考阿里云的镜像加速文档：

https://cr.console.aliyun.com/cn-hangzhou/instances/mirrors

Mac 

```json
{
  "experimental": false,
  "debug": true,
  "registry-mirrors": [
    "https://nrqkr8da.mirror.aliyuncs.com",
    "https://hub-mirror.c.163.com",
    "https://registry.docker-cn.com/",
    "https://docker.mirrors.ustc.edu.cn/",
    "http://f1361db2.m.daocloud.io",
  ],
  "dns": [
    "8.8.8.8",
    "114.114.114.114"
  ]
}
```
## 5、卸载Docker

卸载命令

```bash
yum remove docker \
        docker-client \
        docker-client-latest \
        docker-common \
        docker-latest \
        docker-latest-logrotate \
        docker-logrotate \
        docker-selinux \
        docker-engine-selinux \
        docker-engine \
        docker-ce
```
