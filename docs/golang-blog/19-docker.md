# Docker

## Docker 是什么?

Docker 是一个容器化平台，它包装你所有开发环境依赖成一个整体，像一个容器。保证项目开发，如开发、测
试、发布等各生产环节都可以无缝工作在不同的平台

Docker 容器:将一个软件包装在一个完整的文件系统中，该文件系统包含运行所需的一切:代码，运行时，系统 工具，系统库等。可以安装在服务器上的任何东⻄。这保证软件总是运行在相同的运行环境，无需考虑基础环境配 置的改变。

## 什么是 Docker 镜像?

Docker 镜像是 Docker 容器的源代码，Docker 镜像用于创建容器。使用build 命令创建镜像。

## 什么是 Docker 容器?

Docker 容器包括应用程序及其所有依赖项，作为操作系统的独立进程运行。

## Docker 容器有几种状态? 

四种状态:运行、已暂停、重新启动、已退出。

## Dockerfile 中最常⻅的指令是什么?

- FROM:指定基础镜像
- LABEL:功能是为镜像指定标签 
- RUN:运行指定的命令
- CMD:容器启动时要运行的命令


## Dockerfile 中的命令 COPY 和 ADD 命令有什么区别? 

COPY 与 ADD 的区别 COPY 的 SRC 只能是本地文件，其他用法一致。

## 解释一下 Dockerfile 的 ONBUILD 指令?

当镜像用作另一个镜像构建的基础时，ONBUILD 指令向镜像添加将在稍后执行的触发指令。如果要构建将用作构 建其他镜像的基础的镜像(例如，可以使用特定于用户的配置自定义的应用程序构建环境或守护程序)，这将非常 有用。

## 什么是 Docker Swarm?

Docker Swarm 是 Docker 的本机群集。它将 Docker 主机池转变为单个虚拟Docker 主机。Docker Swarm 提供标
准的 Docker API，任何已经与 Docker守护进程通信的工具都可以使用 Swarm 透明地扩展到多个主机。

## 如何在生产中监控 Docker?

Docker 提供 docker stats 和 docker 事件等工具来监控生产中的 Docker。我们可以使用这些命令获取重要统计数 据的报告。

Docker 统计数据:当我们使用容器 ID 调用 docker stats 时，我们获得容器的CPU，内存使用情况等。它类似于 Linux 中的 top 命令。

Docker 事件:Docker 事件是一个命令，用于查看 Docker 守护程序中正在进 行的活动流。

一些常⻅的 Docker 事件:attach，commit，die，detach，rename， destroy 等。我们还可以使用各种选项来限制或过滤我们感兴趣的事件。

## 如何使用 Docker 技术创建与环境无关的容器系统?

Docker 技术有三中主要的技术途径辅助完成此需求:存储卷(Volumes) 环境变量(Environment variable)注入
只读(Read-only)文件系统

## Docker 映像(image)是什么?

Docker image 是 Docker 容器的源。换言之，Docker images 用于创建 Docker 容器(containers)。映像 (Images)通过 Docker build 命令创建，当 run 映像时，它启动成一个容器(container)进程。做好的映像由 于可能非常庞大，常注册存储在诸如 registry.hub.docker.com 这样的公共平台上。映像常被分层设计，每层可单 独成为一个小映像，由多层小映像再构成大映像，这样碎片化的设计为了使映像在互联网上共享时，最小化传输数 据需求。

## Docker 容器(container)是什么?

Docker containers -- Docker 容器--是包含其所有运行依赖环境，但与其它容器共享操作系统内核的应用，它运行 在独立的主机操作系统用户空间进程中。Docker 容器并不紧密依赖特定的基础平台:可运行在任何配置的计算 机，任何平台以及任何云平台上。

## Docker 中心(hub)什么概念?

Docker hub 是云基础的 Docker 注册服务平台，它允许用户进行访问 Docker 中心资源库，创建自己的 Docker 映 像并测试，推送并存储创建好的 Docker 映像，连接 Docker 云平台将已创建好的指定 Docker 映像布署到本地主 机等任务。它提供了一个查找发现 Docker 映像，发布 Docker 映像及控制变化升级的资源中心，成为用户组或团 队协作开发中保证自动化开发流程的有效技术途径。


## 有什么方法确定一个 Docker 容器运行状态? 

使用如下命令行命令确定一个 Docker 容器的运行状态

```bash
$ docker ps –a
```
这将列表形式输出运行在主机上的所有 Docker 容器及其运行状态。从这个列表中很容易找到想要的容器及其运行 状态。
