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


```bash
# 绑定远程仓库
# git remote add <name> <url>
$ git remote add origin git@gitee.com:mouday/git-demo.git

# 查看远程仓库
$ git remote -v
origin  git@gitee.com:mouday/git-demo.git (fetch)
origin  git@gitee.com:mouday/git-demo.git (push)

# 推送到远程仓库
# git push <remote-name> <branch-name>
$ git push origin master
```

切换到上级目录

```bash
# 从远程仓库克隆
# git clone <url>
$ git clone git@gitee.com:mouday/git-demo.git

# 从远程仓库拉取
# git pull <remote> <branch>
$ git pull
```

如果是本地创建的仓库，要从远程仓库拉取文件，会报错

```bash
$ git pull origin master
From gitee.com:mouday/git-demo
 * branch            master     -> FETCH_HEAD
fatal: refusing to merge unrelated histories

# 指定参考可解决此问题
$ git pull origin master --allow-unrelated-histories
```

7、分支操作

常用命令 | 说明
- | - 
git branch  | 查看分支
git branch [branch-name]  | 创建分支
git checkout [branch-name]  |切换分支
git push [remote-name] [branch-name]  | 推送至远程仓库
git merge [branch-name]  | 合并分支

查看分支

```bash
# 查看本地分支
$ git branch
* master

# 查看远程分支
$ git branch -r
origin/master

# 查看所有本地和远程分支
$ git branch -a
* master
  remotes/origin/master
```

创建分支

```bash
# git branch [branch-name]
$ git branch dev

$ git branch
  dev
* master
```

切换分支

```bash
# git checkout [branch-name]
$ git checkout dev
Switched to branch 'dev'

$ git branch
* dev
  master
```

推送至远程仓库

```bash
# git push [remote-name] [branch-name]
$ git push origin dev

# 或者将本地仓库和远程仓库绑定
$ git push --set-upstream origin dev
# 之后就可以直接push
$ git push
```

合并分支

```bash
# 先切换到主分支
$ git checkout master

# 将dev 分支合并到master 分支
# git merge [branch-name]
$ git merge dev
```

冲突解决

查看冲突文件，修改冲突部分内容，重新提交

```bash
$ git merge dev
Auto-merging dev.txt
CONFLICT (content): Merge conflict in dev.txt
Automatic merge failed; fix conflicts and then commit the result.
```

8、标签操作

常用命令 | 说明
- | - 
git tag | 列出已有标签
git tag [name] |  创建标签
git push [short-name] [name] | 将标签推送至远程仓库
git checkout -b [branch] [name] | 检出标签

示例

```bash
# 创建标签
$ git tag v0.1

# 查看标签
$ git tag
v0.1

# 将标签推送至远程仓库
$ git push origin v0.1

# 检出标签到分支
$ git checkout -b b0.1 v0.1
```

注意：标签是一个静态的概念，某一时刻的快照

## IDEA中使用Git

VCS 版本控制

.gitignore 忽略git管理的文件
