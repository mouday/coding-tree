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

https://www.bilibili.com/video/BV13a411q753/?p=122&spm_id_from=pageDriver&vd_source=efbb4dc944fa761b6e016ce2ca5933da