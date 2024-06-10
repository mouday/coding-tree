# Zookeeper源码分析

## 第1章 算法基础

思考:Zookeeper 是如何保证数据一致性的?这也是困扰分布式系统框架的一个难题。

### 1.1 拜占庭将军问题

拜占庭将军问题是一个协议问题，拜占庭帝国军队的将军们必须全体一致的决定是否攻击某一支敌军。问题是这些将军在地理上是分隔开来的，并且将 军中存在叛徒。叛徒可以任意行动以达到以下目标:欺骗某些将军采取进攻行动;促成一个不是所有将军都同意的决定，如当将军们不希望进攻时促成进攻 行动;或者迷惑某些将军，使他们无法做出决定。如果叛徒达到了这些目的之一，则任何攻击行动的结果都是注定要失败的，只有完全达成一致的努力才能 获得胜利。

### 1.2 Paxos 算法

Paxos(帕克索斯)算法: 一种基于消息传递且具有高度容错特性的一致性算法。 

Paxos算法解决的问题: 就是如何快速正确的在一个分布式系统中对某个数据值达成一致，并且保证不论发生任何异常，都不会破坏整个系统的一致性。

Paxos算法描述:

![](https://mouday.github.io/img/2024/06/09/cv8x2os.png)

在一个Paxos系统中，首先将所有节点划分为Proposer(提议者)，Acceptor(接受者)，和
Learner(学习者)。(注意:每个节点都可以身兼数职)。

一个完整的Paxos算法流程分为三个阶段:

1. Prepare准备阶段
    - Proposer向多个Acceptor发出Propose请求Promise(承诺)
    - Acceptor针对收到的Propose请求进行Promise(承诺)
2. Accept接受阶段
    - Proposer收到多数Acceptor承诺的Promise后，向Acceptor发出Propose请求
    - Acceptor针对收到的Propose请求进行Accept处理
3. Learn学习阶段:
    - Proposer将形成的决议发送给所有Learners

Paxos算法流程

(1)Prepare: Proposer生成全局唯一且递增的Proposal ID，向所有Acceptor发送Propose请求，这里无需携带提案内容，只携 带Proposal ID即可。

(2)Promise: Acceptor收到Propose请求后，做出“两个承诺，一个应答”。
- 不再接受ProposalID小于等于(注意:这里是<=)当前请求的Propose请求。
- 不再接受Proposal ID小于(注意:这里是< )当前请求的Accept请求。
- 不违背以前做出的承诺下，回复已经Accept过的提案中Proposal ID最大的那个提案的Value和Proposal ID，没有则返回空值。

(3)Propose: Proposer收到多数Acceptor的Promise应答后，从应答中选择Proposal ID最大的提案的Value，作为本次要发起的提案。如果所有应答的提案Value均为空值，则可以自己随意决定提案Value。然后携带当前Proposal ID，向所有Acceptor发送 Propose请求。

(4)Accept: Acceptor收到Propose请求后，在不违背自己之前做出的承诺下，接受并持久化当前Proposal ID和提案Value。 

(5)Learn: Proposer收到多数Acceptor的Accept后，决议形成，将形成的决议发送给所有Learner。

> proposal /prəˈpoʊzl/ 提议


下面我们针对上述描述做三种情况的推演举例:为了简化流程，我们这里不设置 Learner。

情况1:

![](https://mouday.github.io/img/2024/06/09/j301nc1.png)

有A1, A2, A3, A4, A5 5位议员，就税率问题进行决议。

- A1发起1号Proposal的Propose，等待Promise承诺; 
- A2-A5回应Promise;
- A1在收到两份回复时就会发起税率10%的Proposal; 
- A2-A5回应Accept;
- 通过Proposal，税率10%。

> ack acknowledge 确认

情况2:

![](https://mouday.github.io/img/2024/06/09/puhzmsb.png)

现在我们假设在A1提出提案的同时,A5决定将税率定为20%

- A1，A5同时发起Propose(序号分别为1，2)
- A2承诺A1，A4承诺A5，A3行为成为关键
- 情况1:A3先收到A1消息，承诺A1。
- A1发起Proposal(1，10%)，A2，A3接受。
- 之后A3又收到A5消息，回复A1:(1，10%)，并承诺A5。
- A5发起Proposal(2，20%)，A3，A4接受。之后A1，A5同时广播决议。

Paxos 算法缺陷:在网络复杂的情况下，一个应用 Paxos 算法的分布式系统，可能很久 无法收敛，甚至陷入活锁的情况。

情况3:

![](https://mouday.github.io/img/2024/06/09/nntv6rg.png)

现在我们假设在A1提出提案的同时,A5决定将税率定为20%

- A1，A5同时发起Propose(序号分别为1，2)
- A2承诺A1，A4承诺A5，A3行为成为关键
- 情况2:A3先收到A1消息，承诺A1。之后立刻收到A5消息，承诺A5。
- A1发起Proposal(1，10%)，无足够响应，A1重新Propose(序号3)，A3再次承诺A1。 - A5发起Proposal(2，20%)，无足够相应。A5重新Propose(序号4)，A3再次承诺A5。 - ......

造成这种情况的原因是系统中有一个以上的 Proposer，多个 Proposers 相互争夺 Acceptor， 造成迟迟无法达成一致的情况。针对这种情况，一种改进的 Paxos 算法被提出:从系统中选 出一个节点作为 Leader，只有 Leader 能够发起提案。这样，一次 Paxos 流程中只有一个 Proposer，不会出现活锁的情况，此时只会出现例子中第一种情况。

### 1.3 ZAB 协议

#### 1.3.1 什么是 ZAB 算法

Zab 借鉴了 Paxos 算法，是特别为 Zookeeper 设计的支持崩溃恢复的原子广播协议。基 于该协议，Zookeeper 设计为只有一台客户端(Leader)负责处理外部的写事务请求，然后 Leader 客户端将数据同步到其他 Follower 节点。即 Zookeeper 只有一个 Leader 可以发起提 案。

#### 1.3.2 Zab 协议内容

Zab 协议包括两种基本的模式:消息广播、崩溃恢复。

1、消息广播

![](https://mouday.github.io/img/2024/06/09/56fijus.png)
ZAB协议针对事务请求的处理过程 类似于一个两阶段提交过程

(1)广播事务阶段 

(2)广播提交操作

这两阶段提交模型如下，有可能因 为Leader宕机带来数据不一致，比如
(1) Leader 发起一个事务 Proposal1后就宕机，Follower都没有 Proposal1
(2)Leader收到半数ACK宕机， 没来得及向Follower发送Commit


(1)客户端发起一个写操作请求。
(2)Leader服务器将客户端的请求转化为事务Proposal 提案，同时为每个Proposal 分配一个全局的ID，即zxid。 
(3)Leader服务器为每个Follower服务器分配一个单独的队列，然后将需要广播的 Proposal依次放到队列中去，并且根据FIFO策略进行消息发送。 
(4)Follower接收到Proposal后，会首先将其以事务日志的方式写入本地磁盘中，写入成功后向Leader反馈一个Ack响应消息。 
(5)Leader接收到超过半数以上Follower的Ack响应消息后，即认为消息发送成功，可以发送commit消息。
(6)Leader向所有Follower广播commit消息，同时自身也会完成事务提交。Follower 接收到commit消息后，会将上一条事务提交。 
(7)Zookeeper采用Zab协议的核心，就是只要有一台服务器提交了Proposal，就要确保所有的服务器最终都能正确提交Proposal。

2、崩溃恢复

崩溃恢复——异常假设

![](https://mouday.github.io/img/2024/06/09/wllkc2g.png)

一旦Leader服务器出现崩溃或者由于网络原因导致Leader服务器失去了与过半 Follower的联系，那么就会进入崩溃恢复模式。

1)假设两种服务器异常情况:
(1)假设一个事务在Leader提出之后，Leader挂了。 
(2)一个事务在Leader上提交了，并且过半的Follower都响应Ack了，但是Leader在Commit消息发出之前挂了。 

2)Zab协议崩溃恢复要求满足以下两个要求: 
(1)确保已经被Leader提交的提案Proposal，必须最终被所有的Follower服务器提交。 (已经产生的提案，Follower必须执行) 
(2)确保丢弃已经被Leader提出的，但是没有被提交的Proposal。(丢弃胎死腹中的提案)


崩溃恢复——Leader选举

![](https://mouday.github.io/img/2024/06/09/yky1qvg.png)

崩溃恢复主要包括两部分:Leader选举和数据恢复。

Leader选举:根据上述要求，Zab协议需要保证选举出来的Leader需要满足以下条件:

(1)新选举出来的Leader不能包含未提交的Proposal。即新Leader必须都是已经提交了Proposal的Follower服务器节点。
(2)新选举的Leader节点中含有最大的zxid。这样做的好处是可以避免Leader服务器检查Proposal的提交和丢弃工作。

崩溃恢复——数据恢复

![](https://mouday.github.io/img/2024/06/09/zq2rb4t.png)

Zab如何数据同步:
(1)完成Leader选举后，在正式开始工作之前(接收事务请求，然后提出新的Proposal)，Leader服务器会首先确认事务日 志中的所有的Proposal 是否已经被集群中过半的服务器Commit。
(2)Leader服务器需要确保所有的Follower服务器能够接收到每一条事务的Proposal，并且能将所有已经提交的事务Proposal 应用到内存数据中。等到Follower将所有尚未同步的事务Proposal都从Leader服务器上同步过，并且应用到内存数据中以后， Leader才会把该Follower加入到真正可用的Follower列表中。

### 1.4 CAP

CAP理论告诉我们，一个分布式系统不可能同时满足以下三种

- 一致性(C:Consistency)
- 可用性(A:Available)
- 分区容错性(P:Partition Tolerance)

这三个基本需求，最多只能同时满足其中的两项，因为P是必须的，因此往往选择就在CP或者AP中。

1)一致性(C:Consistency) 在分布式环境中，一致性是指数据在多个副本之间是否能够保持数据一致的特性。在一致性的需求下，当一个系统在数据一致的状态下执行更新操作后，应该保证系统的数据仍然处于一致的状态。

2)可用性(A:Available) 可用性是指系统提供的服务必须一直处于可用的状态，对于用户的每一个操作请求总是能够在有限的时间内返回结果。

3)分区容错性(P:Partition Tolerance) 分布式系统在遇到任何网络分区故障的时候，仍然需要能够保证对外提供满足一致性和可用性的服务，除非是整个网络环境都发生了故障。

`ZooKeeper保证的是CP`

(1)ZooKeeper不能保证每次服务请求的可用性。(注:在极端环境下，ZooKeeper可能会丢弃一些请求，消费者程序需要 重新请求才能获得结果)。所以说，ZooKeeper不能保证服务可用性。

(2)进行Leader选举时集群都是不可用。


## 第2章 源码详解 

### 2.1 辅助源码

2.1.1 持久化源码

Leader 和 Follower 中的数据会在内存和磁盘中各保存一份。所以需要将内存中的数据 持久化到磁盘中。

在 org.apache.zookeeper.server.persistence 包下的相关类都是序列化相关的代码。
 
![](https://mouday.github.io/img/2024/06/10/65n0sj6.png)

2.1.2 序列化源码

zookeeper-jute 代码是关于 Zookeeper 序列化相关源码

![](https://mouday.github.io/img/2024/06/10/g0j9xyf.png)

### 2.2 ZK 服务端初始化源码解析

ZK服务端初始化源码解析

![](https://mouday.github.io/img/2024/06/10/rh54j7k.png)

### 2.3 ZK 服务端加载数据源码解析

![](https://mouday.github.io/img/2024/06/10/jyni8af.png)

![](https://mouday.github.io/img/2024/06/10/wdj9888.png)

### 2.4 ZK 选举源码解析
![](https://mouday.github.io/img/2024/06/10/56nl43o.png)

### 2.5 Follower 和 Leader 状态同步源码

当选举结束后，每个节点都需要根据自己的角色更新自己的状态。选举出的 Leader 更 新自己状态为 Leader，其他节点更新自己状态为 Follower。
Leader 更新状态入口:leader.lead()
Follower 更新状态入口:follower.followerLeader()
注意:
(1)follower 必须要让 leader 知道自己的状态:epoch、zxid、sid
必须要找出谁是 leader;
发起请求连接 leader;
发送自己的信息给 leader;
leader 接收到信息，必须要返回对应的信息给 follower。
(2)当 leader 得知 follower 的状态了，就确定需要做何种方式的数据同步 DIFF、TRUNC、
SNAP
(3)执行数据同步
(4)当 leader 接收到超过半数 follower 的 ack 之后，进入正常工作状态，集群启动完
成了
最终总结同步的方式:
(1)DIFF 咱两一样，不需要做什么
(2)TRUNC follower 的 zxid 比 leader 的 zxid 大，所以 Follower 要回滚 (3)COMMIT leader 的 zxid 比 follower 的 zxid 大，发送 Proposal 给 foloower 提交执行 (4)如果 follower 并没有任何数据，直接使用 SNAP 的方式来执行数据同步(直接把
数据全部序列到 follower)

![](https://mouday.github.io/img/2024/06/10/ghvjkip.png)

### 2.6 服务端 Leader 启动

![](https://mouday.github.io/img/2024/06/10/pwpje5m.png)


### 2.7 服务端 Follower 启动
![](https://mouday.github.io/img/2024/06/10/uae7cf9.png)

### 2.8 客户端启动
![](https://mouday.github.io/img/2024/06/10/qm8201o.png)