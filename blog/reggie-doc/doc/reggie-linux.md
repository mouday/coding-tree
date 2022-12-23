# 《瑞吉外卖》Linux笔记

目录

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

## Linux常用命令

- Linu常用命令
- 文件目录操作命令
- 拷贝移动命令
- 打包压缩命令
- 文本编辑命令
- 查找命令

1、Linu常用命令

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


https://www.bilibili.com/video/BV13a411q753/?p=123&spm_id_from=pageDriver&vd_source=efbb4dc944fa761b6e016ce2ca5933da