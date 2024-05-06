# Linux 环境搭建

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

SSH 连接工具 (secure shell)

- putty
- secureCRT
- xshell
- finalshell

通过 docker 进入 Linux

```bash
#  运行centos 获取systemctl权限
docker run \
--privileged \
-itd \
--name centos7 \
-p 8082:8080 \
-v /sys/fs/cgroup:/sys/fs/cgroup:ro \
centos:centos7 /usr/sbin/init

# 进入终端
docker exec -it centos7 /bin/bash

# 启动
docker start centos
```

`centos8` 需要更新 yum 源

```bash
sed -i 's/mirrorlist/#mirrorlist/g' /etc/yum.repos.d/CentOS-* && \
sed -i 's|#baseurl=http://mirror.centos.org|baseurl=http://vault.centos.org|g' /etc/yum.repos.d/CentOS-* && \
yum makecache && \
yum update -y
```
