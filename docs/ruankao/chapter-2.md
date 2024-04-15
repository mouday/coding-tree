[返回目录](./index)

# 第2章 信息技术发展

## 2.1 信息技术及其发展

### 2.1.1 计算机软硬件

计算机硬件( Computer Hardware)是指计算机系统中由电子、机械和光电元件等组成的各 种物理装置的总称 。 

计算机软件( Computer Software)是指计算机系统中的程序及其文档，程序是计 算任务的处理对象和处理规则的描述

### 2.1.2 计算机网络

1、 从网络的作用范围可将网络类别划分为：
- 个人局域网 (Personal Area Network, PAN)
- 局域网 (Local Area Network, LAN)
- 城域网( Metropolitan Area Network, MAN)
- 广域网 (WideArea Network, WAN)
- 公用网 (Public Network)
- 专用网( PrivateNetwork)

2、 开放系统互连参考模型(OpenSystemInterconnect, OSI)，采用了分层的结构， 从下到上共分：
- 物理层 
- 数据链路层
- 网络层
- 传输层
- 会话层：
- 表示层
- 应用层

IEEE802规范包括: 

- 802.1 (802协议概论)、 定义局域网体系结构、寻址、网络互联和网络:
- 802.2 (逻辑链路控制层LLC协议)、 
- `802.3` (以太网的CSMA/CD载波监昕多路访问/冲突检测协议) 以太网介质访问控制协议及物理层技术规范描述物理层和数据链路层的MAC子层的实现方法，是重要的局域网协议
- 802.4 （令牌总线TokenBus协议）
- 802.5 (令牌环TokenRing协议)
- 802.6 （城域网MAN协议） 城域网协议
- 802.7 (FDDI宽带技术协议)
- 802.8 (光纤技术协议)
- 802.9 (局域网上的语音/数据集成规范)
- 802.10 (局域网安全互操作标准)
- `802.11` (无线局域网 WLAN标准协议) 无线局域网协议
 

TCP/IP是 Internet的核心

TCP/IP四层:

1. 应用层: （应用层、表示层、会话层）应用程序通过本层协议利用网络完成数据交互的任务 
2. 传输层：负责提供流量控制、错误校验和排序服务
3. 网络层：处理信息的路由和主机地址解析
4. 网络接口层: （数据链路层、物理层）既是传输数据的物理媒介， 也可以为网络层提供一条准确无误的线路

应用层协议：
- FTP ( File Transfer Protocol，文件传输协议)
- TFTP ( Trivial File Transfer Protocol，简单文件传输协议)
- HTTP ( Hypertext Transfer Protocol，超文本传输协议)
- SMTP ( Simple Mail Transfer Protocol，简单邮件传输协议)
- DHCP (Dynamic Host Configuration Protocol，动态主机配置协议)
- Telnet (远程登录协议)
- DNS (Domain Name System，域名系统)
- SNMP (Simple Network Management Protocol，简单网络管理协议)

传输层主要有两个传输协议：
- TCP 
- UDP (User Datagram Protocol，用户数据报协议)

网络层中的协议主要有：
- IP
- ICMP (Internet Control Message Protocol，网际控制报文协议)
- IGMP （internet Group Management Protocol，网际组管理协议）
- ARP ( Address Resolution Protocol，地址解析协议)
- RARP (Reverse Address Resolution Protocol，反向地址解析协议)

会话层: 负责在网络中的两节点之间建立和维持通信，以及提供交互会话的管理功能。如三种数据流方向的控制即一路交互、两路交替和两路同时会话模式。常见的协议有：RPC、SQL、NFS。

![](https://cdn.jsdelivr.net/gh/mouday/img/2024/03/19/gzgtk1s.png)


3、 软件定义网络( Software Defined Network, SDN)的整体架构由下到上（由南到北） 分为：
- 数据平面: 由交换机等网络通用硬件组成，各个网络设备之间通过不同规则 形成的 SDN 数据`通路连接`
- 控制平面: 包含了逻辑上为中心的 SDN 控制器，它掌握 着 全局网络 信息，负责各种`转发规则`的控制
- 应用平面: 包含着各种基于 SDN 的`网络应用`，用户无须关心底 层细节就可以编程、部署新应用 。

![](https://cdn.jsdelivr.net/gh/mouday/img/2024/03/19/1utx0zi.png)

最主流的南向接口 CDPI采用的是 OpenFlow协议

4、 第五代移动通信技术( 5th Generation Mobile Communication Technology, 5G)特点：
- 高速率
- 低时延
- 大连接

![](https://cdn.jsdelivr.net/gh/mouday/img/2024/03/19/etn3far.png)

5、 国际电信联盟（ITU） 定义了5G的三大类应用场景：
- 增强移动宽带（eMBB）
- 超高可靠低时延通信（uRLLC）
- 海量机器类通信（mMTC）

### 2.1.3 存储和数据库

6、 存储分类根据服务器类型分: 
- 封闭系统的存储
- 开放系统的存储
    - 内置存储
    - 外挂存储
        - 直连式存储
        - 网络化存储
            - 网络接入存储
            - 存储区域网络

![](https://cdn.jsdelivr.net/gh/mouday/img/2024/03/20/riqr80j.png)

![](https://cdn.jsdelivr.net/gh/mouday/img/2024/03/19/x4nncvo.png)
![](https://cdn.jsdelivr.net/gh/mouday/img/2024/03/19/qqcrp4d.png)

存储虚拟化( Storage Virtualization)是“云存储”的核心技术之一

绿色存储(Green Storage)技术是指从节能环保的角度出发，用来设计生产能效更佳的存储产品，降低数据存储设备的功耗，提高存储设备每瓦性能的技术 

7、 常见的数据结构模型有三种：

- 层次模型(格式化数据模型)
- 网状模型(格式化数据模型)
- 关系模型

8、 数据库根据存储方式可以分为：
- 关系型数据库（SQL）: Oracle、MySQL、SQL Server
- 非关系型数据库(Not Only SQL, NoSQL) : MongoDB、Redis

9、 关系型数据库支持事务的`ACID原则`：
- 原子性（Atomicity）
- 一致性（Consistency）
- 隔离性（Isolation）
- 持久性（Durability）

这四种原则保证在事务过程当中数据的正确性。

10、 非关系型数据库是分布式的、 非关系型的、 不保证遵循ACID原则的数据存储系统。

常见的非关系数据库分为:

- 键值数据库
- 列存储( Column-oriented)数据库
- 面向文档( Document-Oriented)数据库
- 图形数据库

![](https://cdn.jsdelivr.net/gh/mouday/img/2024/03/19/rfa98s6.png)

11、 数据仓库是一个面向主题的、 集成的、 非易失的且随时间变化的数据集合， 用于支持管理决策。

数据仓库相关的基础概念包括:
- 清洗/转换/加载( Extract/Transformation/Load, ETL)
- 元数据 
- 粒度
- 分割
- 数据集市
- 操作数据存储 (Operation Data Store, ODS)
- 数据模型
- 人工关系

![](https://cdn.jsdelivr.net/gh/mouday/img/2024/03/19/get48ui.png)

### 2.1.4 信息安全

信息安全强调信息(数据)本身的安全属性，主要包括 以下内容：
- 保密性( Confidentiality) : 信息不被未授权者知晓 的属性 。
- 完整性( Integrity) : 信息是正确 的 、真实 的 、未被篡改 的、 完整无缺的属性 。
- 可用性( Availability) : 信息可 以随时正常使用 的属性 。


信息系统安全划分为四个层次:
- 设备安全
- 数据安全（即是传统的信息安全）
- 内容安全
- 行为安全

13、 信息系统一般由计算机系统、 网络系统、 操作系统、 数据库系统和应用系统组成。与此对应， 信息系统安全主要包括计算机设备安全、 网络安全、 操作系统安全、 数据库系统安全和应用系统安全等。

14、 网络安全技术主要包括：防火墙、 入侵检测与防护、 VPN、 安全扫描、 网络蜜罐技术、 用户和实体行为分析技术等。

15、 加密解密

- 对称加密： DES（Data Encryption Standard，即数据加密标准），对称加密的加密密钥和解密密钥相同
- 非对称加密： RSA (Rivest Shamir Adleman)，非对称加密的加密密钥和解密密钥不同， 加密密钥可以公开而解密密钥需要保密。

16、 用户和实体行为分析( User and Entity Behavior Analytics, UEBA)系统通常包括：
- 数据获取层
- 算法分析层
- 场景应用层

17、 网络安全态势感知( Network Security Situation Awareness)的关键技术主要包括：
- 海量多元异构数据的汇聚融合技术
- 面向多类型的网络安全威胁评估技术
- 网络安全态势评估与决策支撑技术 
- 网络安全态势可视化

### 2.1.5 信息技术的发展

 计算机硬件技术将向超高速、超小型、平行处理、智能化的方向发 展，计算机硬件设备的体积越来越小、速度越来越高、容量越来越大、功耗越来越低、可靠性越 来越高 。

5G 成为当前的主流


## 2.2 新一代信息技术及应用

### 2.2.1 物联网

物联网( The Internet of Things)是指通过信息传感设备，按约定的协议将任何物品与互联 网相连接，进行信息交换和通信，以实现智能化识别、定位、跟踪、监控和管理的网络

18、 物联网架构可分为三层：
- 感知层: 采集信息
- 网络层：
- 应用层

19、 物联网关键技术主要涉及：
- 传感器技术：射频识别技术( Radio Frequency Identification，盯ID)
- 传感网:微机电系统( Micro-Electro-M巳chanical Systems, MEMS )
- 应用系统框架: 机器、传感器硬件、通信网络、中间件和 应用

### 2.2.2 云计算

云计算(Cloud Computing)是分布式计算的 一种，指的是通过网络“云”将巨大的数据计 算处理程序分解成无数个小程序，然后通过由多部服务器组成的系统进行处理和分析这些小程 序得到结果并返回给用户。

云计算实现了“快速、按需、弹性”的服务

20、 按照云计算服务提供的资源层次， 可以分为三种服务类型：

- 础设施即服务( Infrastructure as a Service, IaaS)
- 平台即服务( Platform as a Service, PaaS)
- 软件即服务( Software as a Service, SaaS)

21、 云计算的关键技术主要涉及:
- 虚拟化技术：Docker容器(Container)
- 云存储技术
- 多租户和访问控制管理
- 云安全技术等

22、 云计算访问控制的研究主要集中在：
- 云计算访问控制模型
- 基于ABE密码体制的云计算访问控制
- 云中多租户及虚拟化访问控制

23、 基于ABE密码机制的云计算访问控制包括4个参与方：
- 数据提供者
- 可信第三方授权中心
- 云存储服务器
- 用户

### 2.2.3 大数据

24、 大数据从数据源到最终价值实现一般需要经过数据准备、 数据存储与管理、 数据分析和计算、 数据治理和知识展现等过程。

25、 大数据主要特征包括：
- 数据海量
- 数据类型多样 
- 数据价值密度低
- 数据处理速度快

26、 大数据技术架构主要包含：
- 大数据获取技术
- 分布式数据处理技术
- 大数据管理技术
- 大数据应用和服务技术

27、 大数据获取的研究主要集中在三个方面：
- 数据采集
- 整合
- 清洗

28、 目前主流的分布式计算系统有Hadoop、 Spark和Storm。Hadoop常用于离线的复杂的大数据处理， Spark常用于离线的快速的大数据处理， 而Storm常用于在线的实时的大数据处理。

29、 大数据管理技术主要集中在大数据存储、 大数据协同和安全隐私等方面。

30、 大数据应用和服务技术主要包含分析应用技术和可视化技术。

### 2.2.4 区块链

31、 区块链技术具有多中心化存储、 隐私保护、 防篡改等特点， 提供了开放、 分散和容错的事务机制，成为新一代匿名在线支付、 汇款和数字资产交易的核心。

32、 区块链分为四大类：
- 公有链
- 联盟链
- 私有链
- 混合链

33、 区块链的典型特征包括：
- 多中心化
- 多方维护
- 时序数据：时间戳
- 智能合约
- 不可篡改
- 开放共识
- 安全可信

区块链的关键技术

1. 分布式账本：区块链技术的核心之一

2. 加密算法：一般分为散列(哈希)算法和非对称加密算法。散列算法有 MD5、 SHA-1/SHA-2 和 SM3，目前 区块链主要使用 SHA-2中的 SHA256 算法 。
3. 共识机制: 常用的共识机制主要有 Pow、 PoS、 DPoS、 Paxos、 PBFT 等

区块链的典型应用: 数字货币

### 2.2.5 人工智能

人工智能在技术研究方面主要聚焦在三个方面:
- 热点技术
- 共性技术
- 新兴技术

34、 人工智能的关键技术:
- 机器学习
- 自然语言处理(Natural Language Processing, NLP)
- 专家系统(Expert System, ES)

专家系统由6 个部分构成:

- 人机交互界面
- 知识库
- 推理机
- 解释器
- 综合数据库
- 知识获取

### 2.2.6 虚拟现实

虚拟现实( Virtual Reality, VR)是一种可以创立和体验虚拟世界的计算机系统(其中虚拟 世界是全体虚拟环境的总称)

35、 虚拟现实技术的主要特征包括：
- 沉浸性
- 交互性
- 多感知性
- 构想性（也称想象性）
- 自主性

36、 虚拟现实的关键技术:
- 人机交互技术
- 传感器技术
- 动态环境建模技术
- 系统集成技术

![](https://cdn.jsdelivr.net/gh/mouday/img/2024/03/20/h6m724x.png)


相关章节

- 上一章：[第1章 信息化发展](./chapter-1.md)
- 下一章：[第3章 信息系统治理](./chapter-3.md)
