# 《瑞吉外卖》项目学习笔记-Git

分布式版本控制工具

1、功能

- 代码回溯
- 版本切换
- 多人协作
- 远程备份

2、大纲

- Git概述
- Git代码托管服务
- Git常用命令
- IDEA中使用Git

## Git概述

- Git简介
- Git下载安装

1、Git简介

- 本地仓库
- 远程仓库


2、Git下载安装

https://brew.sh/index_zh-cn

https://git-scm.com/

## Git代码托管服务

- 常用的git代码托管服务
- 使用码云代码托管服务

1、常用的git代码托管服务

- Github https://github.com/
- 码云  https://gitee.com/
- GitLab https://about.gitlab.com/
- BitBucket https://bitbucket.org/

## Git 常用命令

- Git 全局设置
- 获取Git仓库
- 概念：工作区、暂存区、版本库
- Git工作区中文件的状态
- 本地仓库操作
- 远程仓库操作
- 分支操作
- 标签操作

1、Git 全局设置

```bash
# 设置用户信息
git config --global user.name 'username'
git config --global user.email 'user@qq.com'

# 查看配置信息

git config --list
```

2、获取Git仓库

```bash
# 方式一：本地初始化Git仓库
git init

# 方式二：从远程仓库克隆
git clone <远程仓库地址>
```

3、概念：工作区、暂存区、版本库

- 工作区 工作目录
- 暂存区 `.git/index` 暂存区stage
- 版本库 `.git` 隐藏文件夹

```
【工作区】 [git add] ->【暂存区】 [git commit] ->【版本库】
```

```bash
# 在【工作区】 创建文件
touch User.java

# 将【工作区】文件添加到【暂存区】
git add .

# 将【暂存区】文件添加到【版本库】
git commit -m 'add file'
```

4、Git工作区中文件的状态

工作区文件状态

- untracked 未跟踪(未纳入版本控制)
- tracked   已跟踪(已纳入版本控制)
    - Unmodified 未修改
    - Modified   已修改
    - Staged     已暂存

```bash
# 新建文件处于【Untracked】
$ touch User.java

$ git status
On branch master

No commits yet

Untracked files:
  (use "git add <file>..." to include in what will be committed)

    user.java

# 添加到暂存区【Staged】
$ git add .

$ git status
On branch master

No commits yet

Changes to be committed:
  (use "git rm --cached <file>..." to unstage)

    new file:   user.java

# 添加文件到版本库
$ git commit -m 'add file'
[master (root-commit) 9fdba5a] add file
 1 file changed, 0 insertions(+), 0 deletions(-)
 create mode 100644 user.java

$ git status
On branch master
nothing to commit, working tree clean
```

5、本地仓库操作

常用命令 | 说明
- | - 
git status | 查看文件状态
git add | 将文件的修改加入暂存区
git reset  | 将暂存区的文件取消暂存或者是切换到指定版本
git commit | 将暂存区的文件修改提交到版本库
git log  | 查看日志


修改文件 User.java 并提交到版本库

```java
public class User{
    
}
```

```bash
# 查看log
$ git log
commit 9a05bf544a2d6d85e67d66460115b86687ff9f10 (HEAD -> master)
Author: xxx <xxx@qq.com>
Date:   Sat Dec 10 20:10:48 2022 +0800

    change name

commit 9fdba5a102b73c1328d4e0303e1c793e9459d40f
Author: xxx <xxx@qq.com>
Date:   Fri Dec 9 22:29:33 2022 +0800

    add file

# 回退到指定历史版本
$ git reset --hard 9fdba5a102b73c1328d4e0303e1c793e9459d40f
```




6、远程仓库操作

常用命令 | 说明
- | - 
git remote | 查看远程仓库
git remote add | 添加远程仓库
git clone | 从远程仓库克隆
git pull | 从远程仓库拉取
git push | 推送到远程仓库


https://www.bilibili.com/video/BV13a411q753/?p=108&spm_id_from=pageDriver&vd_source=efbb4dc944fa761b6e016ce2ca5933da


