# PG源码学习

## memory

```cpp
int main(int argc, char *argv[])
{
    MemoryContextInit();

    PostmasterMain(argc, argv);
}

void MemoryContextInit(void)
{
    TopMemoryContext = AllocSetContextCreate(
        (MemoryContext) NULL,
        "TopMemoryContext",
        ALLOCSET_DEFAULT_SIZES);

    CurrentMemoryContext = TopMemoryContext;

    ErrorContext = AllocSetContextCreate(
        TopMemoryContext,
        "ErrorContext",
        8 * 1024,
        8 * 1024,
        8 * 1024);
}

void InitializeGUCOptions(void)
{
    build_guc_variables()
}

void build_guc_variables(void)
{
    GUCMemoryContext = AllocSetContextCreate(
        TopMemoryContext,
        "GUCMemoryContext",
        ALLOCSET_DEFAULT_SIZES);
}

void PostmasterMain(int argc, char *argv[]){
    PostmasterContext = AllocSetContextCreate(
        TopMemoryContext,
        "Postmaster",
        ALLOCSET_DEFAULT_SIZES);

    MemoryContextSwitchTo(PostmasterContext);

    InitializeGUCOptions();
}

PostgresMain(){
    MessageContext = AllocSetContextCreate(
        TopMemoryContext,
        "MessageContext",
        ALLOCSET_DEFAULT_SIZES);
}


```

## PostgreSQL进程

- Postmaster 守护进程：PostmasterMain：调度中心
- Postgres 服务进程：PostgresMain：处理查询
- 辅助进程
  - SysLogger：系统日志进程
  - PgStat 统计数据收集进程
  - AutoVacuum 系统自动清理
  - AutoVacLauncherMain 监控进程
  - AutoVacWorkerMain 执行清理进程
  - BackgroundWriter：后台写进程：定期将存放普通数据的共享缓冲区写入磁盘
  - WalWriter：预写日志写进程：定期将存放预写日志的WAL缓冲区写入磁盘
  - PgArchiver：预写日志归档进程：对WAL日志归档备份
  - BackgroundWorker

辅助进程启动流程：

```cpp
main()
{
    PostmasterMain()
    {
        // syslogger进程启动流程
        StartSysLogger() {
            SysLogger_Start() {
                postmaster_child_launch(B_LOGGER){
                    SysLoggerMain()
                }
            }
        }

        // BackgroundWriter
        StartChildProcess(B_BG_WRITER){
            postmaster_child_launch(B_BG_WRITER){
                BackgroundWriterMain()
            }
        }

        // bgworker进程启动流程
        maybe_start_bgworkers(){
            StartBackgroundWorker(){
                postmaster_child_launch(B_BG_WORKER){
                    BackgroundWorkerMain()
                }
            }
        }

        ServerLoop(){
            // AutoVacWorkerMain
            process_pm_pmsignal(){
                StartAutovacuumWorker(){
                    StartChildProcess(B_AUTOVAC_WORKER){
                        postmaster_child_launch(B_AUTOVAC_WORKER){
                            AutoVacWorkerMain()
                        }
                    }
                }
            }

            // BackendMain
            BackendStartup(){
                postmaster_child_launch(B_BACKEND){
                    BackendMain(){
                        PostgresMain()
                    }
                }
            }

            LaunchMissingBackgroundProcesses(){
                // WalWriterMain
                StartChildProcess(B_WAL_WRITER){
                    postmaster_child_launch(B_WAL_WRITER){
                        WalWriterMain()
                    }
                }
                // AutoVacLauncherMain
                StartChildProcess(B_AUTOVAC_LAUNCHER){
                    postmaster_child_launch(B_WAL_WRITER){
                        AutoVacLauncherMain()
                    }
                }
                // PgArchiverMain
                StartChildProcess(B_ARCHIVER){
                    postmaster_child_launch(B_ARCHIVER){
                        PgArchiverMain()
                    }
                }
            }
        }
    }
}
```

多用户模式参数：IsUnderPostmaster

```cpp
// src/backend/utils/init/globals.c
bool IsUnderPostmaster = false;

// src/backend/postmaster/launch_backend.c
postmaster_child_launch(){
    InitPostmasterChild(void){
        bool IsUnderPostmaster = true;
    }
}
```



## 系统表

- pg_namespace 命名空间
- pg_tablespace 表空间
- pg_database 数据库信息
- pg_type 数据类型
- pg_class 表对象信息
- pg_attribute 表属性信息
- pg_index 索引信息
- pg_statistic 统计信息

## 初始化过程

3个默认系统数据库

|数据库 | 作用
|-|-
|template1 | 模板数据库，可修改
|template0 | 用于备份
|postgres | 用于连接

## Portal执行过程

```cpp
CreatePortal()       // 创建portal
PortalDefineQuery()  // 设置部分字段
PortalStart()        // 初始化portal
PortalRun()          // 调用portal执行过程
PortalDrop()         // 调用portal清理过程
```

## SQL语句分类

|SQL语句类型 | 操作范围 | 处理模块
|-|-|-|
|数据定义语句 DDL statement，功能性操作| 元组以外 | 功能处理器 Utility Processor
|可优化语句 Optimizable statement| 元组相关  | 执行器 Executor

### 数据定义语句

以建表语句为例

```sql
create table t1(id int, age int);
```

调用栈

```cpp
start(){
main(){
PostmasterMain(){
ServerLoop(){
BackendStartup(){
postmaster_child_launch(){
BackendMain(){
PostgresMain(){
exec_simple_query(){
    pg_parse_query() // 解析
    pg_analyze_and_rewrite_fixedparams() // 分析和重写查询树
    pg_plan_queries() // 生成查询计划

    CreatePortal()     // 创建portal
    PortalDefineQuery() // 设置部分字段
    PortalStart(){     // 初始化portal
        // 策略选择PORTAL_MULTI_QUERY
        ChoosePortalStrategy() 
    }
    
    PortalRun(){       // 调用portal执行过程
        PortalRunMulti(){
        PortalRunUtility(){
        ProcessUtility(){ // 功能处理器函数
        standard_ProcessUtility(){
        ProcessUtilitySlow(){
            // 对T_CreateStmt 节点进行转换处理
            transformCreateStmt() 
            DefineRelation(){
                // 创建物理文件并在相应系统表中注册
                heap_create_with_catalog(){
                    heap_create(){
                        // 创建物理文件
                        RelationCreateStorage()
                    }
                    // 向表中pg_type新增一条记录
                    AddNewRelationType()
                    // 将表的相关信息存入pg_class
                    AddNewRelationTuple()
                    // 将表的属性存入pg_attribute
                    AddNewAttributeTuples()
                    // 将约束存入pg_constraint
                    // 将默认值存入g_attrdef
                    StoreConstraints()
                }
            }
        }
    }
    PortalDrop() // 调用portal清理过程
}}}}}}}}}}}}}
```

常见的数据定义语句处理函数

|节点类型 |核心处理函数 |功能
|-|-|-
| T_CreateStmt | DefineRelation | 创建关系表

### 可优化语句

计划节点继承体系

```cpp
// src/include/nodes/plannodes.h
Plan
    /* 控制节点 control node */
    Result
    ProjectSet
    ModifyTable
    Append
    MergeAppend
    RecursiveUnion
    BitmapAnd
    BitmapOr

    /* 扫描节点 scan node */
    Scan
        SeqScan
        SampleScan
        IndexScan
        IndexOnlyScan
        BitmapIndexScan
        BitmapHeapScan
        TidScan
        TidRangeScan
        SubqueryScan
        FunctionScan
        ValuesScan
        TableFuncScan
        CteScan
        NamedTuplestoreScan
        WorkTableScan
        ForeignScan
        CustomScan

    /* 连接节点 join node */
    Join
        NestLoop
        MergeJoin
        HashJoin

    /* 物化节点 meterialzation node */
    Material
    Memoize
    Sort
        IncrementalSort
    Group
    Agg
    WindowAgg
    Unique
    Gather
    GatherMerge
    Hash
    SetOp
    LockRows
    Limit
```

状态节点继承体系

```cpp
// src/include/nodes/execnodes.h
PlanState
    ResultState
    ProjectSetState
    ModifyTableState
    AppendState
    MergeAppendState
    RecursiveUnionState
    BitmapAndState
    BitmapOrState
    ScanState
        SeqScanState
        SampleScanState
        IndexScanState
        IndexOnlyScanState
        BitmapIndexScanState
        BitmapHeapScanState
        TidScanState
        TidRangeScanState
        SubqueryScanState
        FunctionScanState
        ValuesScanState
        TableFuncScanState
        CteScanState
        NamedTuplestoreScanState
        WorkTableScanState
        ForeignScanState
        CustomScanState
        MaterialState
        MemoizeState
        SortState
        IncrementalSortState
        GroupState
        AggState
        WindowAggState
    JoinState
        NestLoopState
        MergeJoinState
        HashJoinState
    UniqueState
    GatherState
    GatherMergeState
    HashState
    SetOpState
    LockRowsState
    LimitState
```

执行器执行过程中涉及的主要数据结构

```cpp
/* query descriptor */
typedef struct QueryDesc
{
    /* These fields are provided by CreateQueryDesc */
    // 语句类型
    CmdType        operation;        /* CMD_SELECT, CMD_UPDATE, etc. */
    // 查询计划树
    PlannedStmt *plannedstmt;    /* planner's output (could be utility, too) */
    // 查询语句
    const char *sourceText;        /* source text of the query */

    /* These fields are set by ExecutorStart */

    TupleDesc    tupDesc;        /* descriptor for result tuples */
    // 执行器全局状态
    EState       *estate;            /* executor's query-wide state */
    // 计划节点执行状态
    PlanState  *planstate;        /* tree of per-plan-node state */
} QueryDesc;


// PlannedStmt node
typedef struct PlannedStmt
{
    NodeTag        type;

    // 语句类型
    CmdType        commandType;    /* select|insert|update|delete|merge|utility */

    uint64        queryId;        /* query identifier (copied from Query) */

    // 查询计划树根节点
    struct Plan *planTree;        /* tree of Plan nodes */

    // 查询涉及的范围表
    List       *rtable;            /* list of RangeTblEntry nodes */

    /* rtable indexes of target relations for INSERT/UPDATE/DELETE/MERGE */
    // 结果关系表
    List       *resultRelations;    /* integer list of RT indexes, or NIL */

    Node       *utilityStmt;    /* non-null if this is utility stmt */

} PlannedStmt;


/* Executor state */
typedef struct EState
{
    NodeTag        type;
    // 查询涉及的范围表
    List       *es_range_table; /* List of RangeTblEntry */
    
    /* Other working state: */
    // EState内存上下文
    MemoryContext es_query_cxt; /* per-query context in which EState lives */

    // 用于节点之间传递元组的全局元组表
    List       *es_tupleTable;    /* List of TupleTableSlots */

    /*
     * this ExprContext is for per-output-tuple operations, such as constraint
     * checks and index-value computations.  It will be reset for each output
     * tuple.  Note that it will be created only if needed.
     */
    // 每获取一个元组就会回收的内存上下文
    ExprContext *es_per_tuple_exprcontext;

} EState;


/* PlanState node */
typedef struct PlanState
{

    NodeTag        type;

    // 计划节点指针
    Plan       *plan;            /* associated Plan node */

    // 执行器全局状态指针
    EState       *state;            /* at execution time, states of individual
                                 * nodes point to one EState for the whole
                                 * top-level plan */

    /*
     * Common structural data for all Plan types.  These links to subsidiary
     * state trees parallel links in the associated plan tree (except for the
     * subPlan list, which does not exist in the plan tree).
     */
    //  选择运算相关条件
    ExprState  *qual;            /* boolean qual condition */

    // 左右子树状态节点指针
    struct PlanState *lefttree; /* input plan tree(s) */
    struct PlanState *righttree;
} PlanState;
```
